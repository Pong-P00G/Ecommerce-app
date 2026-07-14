import db from '../database/dbpool.js';
import * as OrderModel from '../model/orderModel.js';
import * as PaymentModel from '../model/paymentModel.js';

// Allowed status values match the schema's CHECK constraint exactly.
const ALLOWED_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

// Helper to build a tagged error. The controller maps `status` to the HTTP code.
const httpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

/**
 * Return every active payment method.
 */
export const getPaymentMethods = async () => {
    return await PaymentModel.getActivePaymentMethods();
};

/**
 * Create a new payment method. Only admin roles (1 or 2) may invoke this.
 * The DB unique constraint on methodName catches duplicates; we surface them
 * as a 409 instead of letting the raw PG error leak.
 */
export const createPaymentMethod = async (data, roleId) => {
    if (roleId !== 1 && roleId !== 2) {
        throw httpError(403, 'Admin privileges required');
    }

    const { method_name, description, is_active } = data || {};
    if (!method_name || typeof method_name !== 'string' || !method_name.trim()) {
        throw httpError(400, 'method_name is required');
    }

    try {
        return await PaymentModel.createPaymentMethod({
            method_name: method_name.trim(),
            description,
            is_active,
        });
    } catch (err) {
        // PostgreSQL unique-violation
        if (err && err.code === '23505') {
            throw httpError(409, `Payment method "${method_name}" already exists`);
        }
        throw err;
    }
};

/**
 * Record a payment against an order.
 *
 * Flow (all inside a single transaction):
 *   1. Load the order; 404 if missing.
 *   2. Authorize: non-admin users may only pay their own orders.
 *   3. Validate the payment method exists AND is active.
 *   4. Validate amount > 0 and matches the order total (allow ±0.01 rounding).
 *   5. Validate optional discount_id exists in the discounts table.
 *   6. Insert the payment with status='paid' and paidAt=NOW().
 *   7. If the order is still 'pending', bump it to 'confirmed' so the
 *      downstream pipeline sees it as paid.
 *   8. COMMIT, return the new payment.
 */
export const recordPayment = async (
    userId,
    roleId,
    orderId,
    { method_id, discount_id, amount }
) => {
    // 1. Order must exist.
    const order = await OrderModel.getOrderById(orderId);
    if (!order) {
        throw httpError(404, 'Order not found');
    }

    // 2. Authorization: non-admin can only pay their own order.
    const isAdmin = roleId === 1 || roleId === 2;
    if (!isAdmin && order.userId !== userId) {
        throw httpError(403, 'Not authorized to pay for this order');
    }

    // 3. Validate payment method.
    if (!Number.isInteger(method_id)) {
        throw httpError(400, 'method_id is required');
    }
    const method = await PaymentModel.getPaymentMethodById(method_id);
    if (!method) {
        throw httpError(404, 'Payment method not found');
    }
    if (!method.isActive) {
        throw httpError(400, 'Payment method is not active');
    }

    // 4. Validate amount.
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw httpError(400, 'amount must be greater than 0');
    }
    // Optional: enforce that amount matches the order total (allow tiny float drift).
    if (
        typeof order.totalAmount === 'number' &&
        Math.abs(numericAmount - Number(order.totalAmount)) > 0.01
    ) {
        throw httpError(400, 'amount does not match order total');
    }

    // 5. Validate optional discount id.
    if (discount_id != null) {
        if (!Number.isInteger(discount_id)) {
            throw httpError(400, 'discount_id must be an integer');
        }
        const { rowCount } = await db.query(
            'SELECT 1 FROM discounts WHERE discountsid = $1',
            [discount_id]
        );
        if (rowCount === 0) {
            throw httpError(404, 'Discount not found');
        }
    }

    // 6 + 7. Insert payment and optionally advance order status — all in one tx.
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const payment = await PaymentModel.createPayment(
            {
                order_id: orderId,
                method_id,
                discount_id: discount_id ?? null,
                amount: numericAmount,
                status: 'paid',
            },
            client
        );

        if (order.status === 'pending') {
            await OrderModel.updateOrderStatus(orderId, 'confirmed', client);
        }

        await client.query('COMMIT');

        // Return the hydrated payment (with methodName) using the pool.
        return await PaymentModel.getPaymentById(payment.paymentId);
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Return every payment for an order. Authorizes: non-admin may only read
 * payments for their own orders.
 */
export const getOrderPayments = async (userId, roleId, orderId) => {
    const order = await OrderModel.getOrderById(orderId);
    if (!order) {
        throw httpError(404, 'Order not found');
    }

    const isAdmin = roleId === 1 || roleId === 2;
    if (!isAdmin && order.userId !== userId) {
        throw httpError(403, 'Not authorized to view payments for this order');
    }

    return await PaymentModel.getPaymentsByOrderId(orderId);
};

// Exposed for potential future use (status transitions on refunds, etc.).
export { ALLOWED_STATUSES };
