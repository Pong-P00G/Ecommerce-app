import db from '../database/dbpool.js';

/**
 * Resolve the executor (client inside a transaction, otherwise the pool).
 * Lets the service layer pass a tx client to keep multi-step operations atomic.
 */
const exec = (client) => client || db;

/**
 * Return every active payment method, ordered by name.
 */
export const getActivePaymentMethods = async () => {
    const { rows } = await db.query(
        `SELECT methodsid   AS "methodId",
                methodname  AS "methodName",
                description,
                isactive    AS "isActive"
         FROM paymentmethod
         WHERE isactive = TRUE
         ORDER BY methodname ASC`
    );
    return rows;
};

/**
 * Insert a new payment method. The DB enforces uniqueness on methodName,
 * so a duplicate surfaces as a unique-violation error from the driver.
 */
export const createPaymentMethod = async ({ method_name, description, is_active }) => {
    const { rows } = await db.query(
        `INSERT INTO paymentmethod (methodname, description, isactive)
         VALUES ($1, $2, $3)
         RETURNING methodsid   AS "methodId",
                   methodname  AS "methodName",
                   description,
                   isactive    AS "isActive"`,
        [method_name, description ?? null, is_active ?? true]
    );
    return rows[0];
};

/**
 * Fetch a single payment method by id (active or not).
 * Returns null when not found.
 */
export const getPaymentMethodById = async (methodId) => {
    const { rows } = await db.query(
        `SELECT methodsid   AS "methodId",
                methodname  AS "methodName",
                description,
                isactive    AS "isActive"
         FROM paymentmethod
         WHERE methodsid = $1`,
        [methodId]
    );
    return rows[0] || null;
};

/**
 * Insert a payment row. `paidAt` is left NULL on non-paid statuses so the
 * column truthfully reflects when payment actually settled.
 */
export const createPayment = async (
    { order_id, method_id, discount_id, amount, status = 'paid' },
    client = null
) => {
    const runner = exec(client);
    const paidAtExpr = status === 'paid' ? 'NOW()' : 'NULL';
    const { rows } = await runner.query(
        `INSERT INTO payments (ordersid, methodsid, discountsid, amount, status, paidat)
         VALUES ($1, $2, $3, $4, $5, ${paidAtExpr})
         RETURNING paymentsid  AS "paymentId",
                   ordersid    AS "orderId",
                   methodsid   AS "methodId",
                   discountsid AS "discountId",
                   amount,
                   status,
                   paidat      AS "paidAt"`,
        [order_id, method_id, discount_id ?? null, amount, status]
    );
    return rows[0];
};

/**
 * List every payment belonging to an order, joined with the method's name.
 */
export const getPaymentsByOrderId = async (orderId) => {
    const { rows } = await db.query(
        `SELECT p.paymentsid   AS "paymentId",
                p.ordersid     AS "orderId",
                p.methodsid    AS "methodId",
                pm.methodname  AS "methodName",
                p.discountsid  AS "discountId",
                p.amount,
                p.status,
                p.paidat       AS "paidAt"
         FROM payments p
         JOIN paymentmethod pm ON p.methodsid = pm.methodsid
         WHERE p.ordersid = $1
         ORDER BY p.paymentsid ASC`,
        [orderId]
    );
    return rows;
};

/**
 * Fetch a single payment by id, joined with the method name.
 * Returns null when not found.
 */
export const getPaymentById = async (paymentId) => {
    const { rows } = await db.query(
        `SELECT p.paymentsid   AS "paymentId",
                p.ordersid     AS "orderId",
                p.methodsid    AS "methodId",
                pm.methodname  AS "methodName",
                p.discountsid  AS "discountId",
                p.amount,
                p.status,
                p.paidat       AS "paidAt"
         FROM payments p
         JOIN paymentmethod pm ON p.methodsid = pm.methodsid
         WHERE p.paymentsid = $1`,
        [paymentId]
    );
    return rows[0] || null;
};
