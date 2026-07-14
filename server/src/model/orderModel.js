import db from '../database/dbpool.js';

/**
 * Resolve the executor (client inside a transaction, otherwise the pool).
 * Every helper accepts an optional `client` so the service layer can run
 * multi-step order operations in a single transaction.
 */
const exec = (client) => client || db;

/**
 * Insert a new order row. Returns the new ordersId.
 * Uses unquoted lowercase identifiers so PostgreSQL matches the folded
 * column names from the schema.
 */
export const createOrder = async (userId, totalAmount = 0, client = null) => {
    const runner = exec(client);
    const { rows } = await runner.query(
        `INSERT INTO orders (usersid, totalamount)
         VALUES ($1, $2)
         RETURNING ordersid   AS "orderId",
                   usersid    AS "userId",
                   status,
                   totalamount AS "totalAmount",
                   createdat  AS "createdAt",
                   updatedat  AS "updatedAt"`,
        [userId, totalAmount]
    );
    return rows[0];
};

/**
 * Insert a single orderItems row. Accepts a plain object so the service
 * layer can pass through cart items without reshaping.
 */
export const addOrderItem = async (
    { orderId, productId, variantId, quantity, unitPrice },
    client = null
) => {
    const runner = exec(client);
    const { rows } = await runner.query(
        `INSERT INTO orderitems (ordersid, productsid, variantid, quantity, unitprice)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING orderitemid AS "orderItemId",
                   ordersid    AS "orderId",
                   productsid  AS "productId",
                   variantid   AS "variantId",
                   quantity,
                   unitprice   AS "unitPrice",
                   subtotal    AS "subtotal",
                   createdat   AS "createdAt"`,
        [orderId, productId, variantId ?? null, quantity, unitPrice]
    );
    return rows[0];
};

/**
 * List all orders that belong to a user, with item count per order.
 * Uses LEFT JOIN so orders with no items still appear (count = 0).
 */
export const getOrdersByUserId = async (userId) => {
    const { rows } = await db.query(
        `SELECT o.ordersid    AS "orderId",
                o.usersid     AS "userId",
                o.status,
                o.totalamount AS "totalAmount",
                o.createdat   AS "createdAt",
                o.updatedat   AS "updatedAt",
                COUNT(oi.orderitemid) AS "itemCount"
         FROM orders o
         LEFT JOIN orderitems oi ON o.ordersid = oi.ordersid
         WHERE o.usersid = $1
         GROUP BY o.ordersid
         ORDER BY o.createdat DESC`,
        [userId]
    );
    return rows;
};

/**
 * Admin: list every order with the owning user's username/email.
 * Uses a direct join (instead of view_orders) so the module works even
 * before the payments table from Phase 6 is created.
 */
export const getAllOrders = async () => {
    const { rows } = await db.query(
        `SELECT o.ordersid    AS "orderId",
                o.usersid     AS "userId",
                u.username,
                u.email,
                o.status,
                o.totalamount AS "totalAmount",
                o.createdat   AS "createdAt",
                o.updatedat   AS "updatedAt",
                COUNT(oi.orderitemid) AS "itemCount"
         FROM orders o
         JOIN users u ON o.usersid = u.usersid
         LEFT JOIN orderitems oi ON o.ordersid = oi.ordersid
         GROUP BY o.ordersid, u.username, u.email
         ORDER BY o.createdat DESC`
    );
    return rows;
};

/**
 * Fetch a single order with its user info and every line item joined to
 * product + variant info. Returns null when the order does not exist.
 */
export const getOrderById = async (orderId) => {
    const { rows: orderRows } = await db.query(
        `SELECT o.ordersid    AS "orderId",
                o.usersid     AS "userId",
                u.username,
                u.email,
                o.status,
                o.totalamount AS "totalAmount",
                o.createdat   AS "createdAt",
                o.updatedat   AS "updatedAt"
         FROM orders o
         JOIN users u ON o.usersid = u.usersid
         WHERE o.ordersid = $1`,
        [orderId]
    );
    if (orderRows.length === 0) return null;

    const { rows: items } = await db.query(
        `SELECT oi.orderitemid AS "orderItemId",
                oi.ordersid    AS "orderId",
                oi.productsid  AS "productId",
                oi.variantid   AS "variantId",
                oi.quantity,
                oi.unitprice   AS "unitPrice",
                oi.subtotal    AS "subtotal",
                oi.createdat   AS "createdAt",
                p.productname  AS "productName",
                v.sku
         FROM orderitems oi
         JOIN products p       ON oi.productsid = p.productsid
         LEFT JOIN variants v  ON oi.variantid  = v.variantid
         WHERE oi.ordersid = $1
         ORDER BY oi.orderitemid ASC`,
        [orderId]
    );

    return { ...orderRows[0], items };
};

/**
 * Update an order's status. Always bumps updatedAt to NOW() so callers can
 * audit the change. Accepts an optional client so it can run inside the
 * larger create-order transaction if needed.
 */
export const updateOrderStatus = async (orderId, status, client = null) => {
    const runner = exec(client);
    const { rows } = await runner.query(
        `UPDATE orders
         SET status     = $1,
             updatedat  = NOW()
         WHERE ordersid = $2
         RETURNING ordersid   AS "orderId",
                   usersid    AS "userId",
                   status,
                   totalamount AS "totalAmount",
                   createdat  AS "createdAt",
                   updatedat  AS "updatedAt"`,
        [status, orderId]
    );
    return rows[0];
};
