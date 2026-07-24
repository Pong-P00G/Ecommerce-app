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
 * Return ALL payment methods (including inactive). Admin only.
 */
export const getAllPaymentMethods = async (roleId) => {
    if (roleId !== 1 && roleId !== 2) {
        throw httpError(403, 'Admin privileges required');
    }
    return await PaymentModel.getAllPaymentMethods();
};

/**
 * Update a payment method. Admin only.
 */
export const updatePaymentMethod = async (methodId, data, roleId) => {
    if (roleId !== 1 && roleId !== 2) {
        throw httpError(403, 'Admin privileges required');
    }

    const existing = await PaymentModel.getPaymentMethodById(methodId);
    if (!existing) {
        throw httpError(404, 'Payment method not found');
    }

    try {
        const updated = await PaymentModel.updatePaymentMethod(methodId, {
            method_name: data.method_name?.trim(),
            description: data.description,
            fee: data.fee != null ? Number(data.fee) : undefined,
            is_active: data.is_active,
        });
        return updated;
    } catch (err) {
        if (err && err.code === '23505') {
            throw httpError(409, `Payment method "${data.method_name}" already exists`);
        }
        throw err;
    }
};

/**
 * Delete a payment method. Admin only.
 */
export const deletePaymentMethod = async (methodId, roleId) => {
    if (roleId !== 1 && roleId !== 2) {
        throw httpError(403, 'Admin privileges required');
    }

    const existing = await PaymentModel.getPaymentMethodById(methodId);
    if (!existing) {
        throw httpError(404, 'Payment method not found');
    }

    try {
        const deleted = await PaymentModel.deletePaymentMethod(methodId);
        if (!deleted) {
            throw httpError(500, 'Failed to delete payment method');
        }
        return { methodId };
    } catch (err) {
        // PostgreSQL foreign-key violation — method has payments referencing it
        if (err && err.code === '23503') {
            throw httpError(409, 'Cannot delete: this payment method has payments associated with it');
        }
        throw err;
    }
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

    const { method_name, description, is_active, fee } = data || {};
    if (!method_name || typeof method_name !== 'string' || !method_name.trim()) {
        throw httpError(400, 'method_name is required');
    }

    try {
        return await PaymentModel.createPaymentMethod({
            method_name: method_name.trim(),
            description,
            is_active,
            fee: fee != null ? Number(fee) : 0.00,
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

    // Detect Cash on Delivery — payment is collected at delivery, not now.
    const isCOD = method.methodName === 'Cash on Delivery';

    // 4. Validate amount.
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw httpError(400, 'amount must be greater than 0');
    }
    // For COD, the expected total includes the COD fee.
    const expectedTotal = isCOD
        ? Number(order.totalAmount) + Number(method.fee || 0)
        : Number(order.totalAmount);
    if (
        typeof expectedTotal === 'number' &&
        Math.abs(numericAmount - expectedTotal) > 0.01
    ) {
        throw httpError(400, 'amount does not match expected total');
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
    // For COD: record as 'pending' (not paid yet) and keep order 'pending'.
    const paymentStatus = isCOD ? 'pending' : 'paid';
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const payment = await PaymentModel.createPayment(
            {
                order_id: orderId,
                method_id,
                discount_id: discount_id ?? null,
                amount: numericAmount,
                status: paymentStatus,
            },
            client
        );

        // For non-COD payments, advance the order from 'pending' to 'confirmed'
        if (!isCOD && order.status === 'pending') {
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

/**
 * Mark a COD payment as paid (admin-only action).
 *
 * Flow:
 *   1. Order must exist.
 *   2. Find the latest pending payment for this order that uses Cash on Delivery.
 *   3. Update payment status to 'paid' with paidAt = NOW().
 *   4. Advance the order from 'pending' to 'confirmed'.
 *   5. Return the updated payment.
 */
export const markPaymentAsPaid = async (userId, roleId, orderId) => {
    const isAdmin = roleId === 1 || roleId === 2;
    if (!isAdmin) {
        throw httpError(403, 'Admin privileges required');
    }

    const order = await OrderModel.getOrderById(orderId);
    if (!order) {
        throw httpError(404, 'Order not found');
    }

    // Find the latest pending COD payment for this order
    const payments = await PaymentModel.getPaymentsByOrderId(orderId);
    const pendingCOD = payments.find(
        p => p.status === 'pending' && p.methodName === 'Cash on Delivery'
    );

    if (!pendingCOD) {
        throw httpError(400, 'No pending Cash on Delivery payment found for this order');
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Update the payment to 'paid'
        const updated = await PaymentModel.updatePaymentStatus(
            pendingCOD.paymentId,
            'paid',
            client
        );

        // Advance the order from 'pending' to 'confirmed'
        if (order.status === 'pending') {
            await OrderModel.updateOrderStatus(orderId, 'confirmed', client);
        }

        await client.query('COMMIT');
        return await PaymentModel.getPaymentById(updated.paymentId);
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
    } finally {
        client.release();
    }
};

// Exposed for potential future use (status transitions on refunds, etc.).
export { ALLOWED_STATUSES };
