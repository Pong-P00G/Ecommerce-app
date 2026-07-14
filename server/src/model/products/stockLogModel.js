import db from '../../database/dbpool.js';

/**
 * Insert a row into `stockLog`.
 * params: { stock_id, user_id, change_type, quantity, reason }
 * change_type must be one of: 'IN', 'OUT', 'ADJUST', 'RETURN', 'DAMAGED'
 * Returns the inserted logId.
 */
export const createStockLog = async ({ stock_id, user_id = null, change_type, quantity, reason = null }) => {
    if (!stock_id) throw new Error('createStockLog: stock_id is required');
    if (!change_type) throw new Error('createStockLog: change_type is required');
    if (quantity == null) throw new Error('createStockLog: quantity is required');

    const { rows } = await db.query(
        `INSERT INTO stocklog (stockid, usersid, changetype, quantity, reason)
         VALUES ($1, $2, $3, $4, $5) RETURNING logid`,
        [stock_id, user_id, change_type, quantity, reason]
    );
    return rows[0].logid;
};

/**
 * List all stock-log rows for a given stock row, newest first.
 */
export const getStockLogs = async (stockId) => {
    const { rows } = await db.query(
        `SELECT logid      AS log_id,
                stockid    AS stock_id,
                usersid    AS user_id,
                changetype AS change_type,
                quantity,
                reason,
                createdat  AS created_at
         FROM stocklog WHERE stockid = $1 ORDER BY createdat DESC, logid DESC`,
        [stockId]
    );
    return rows;
};

/**
 * Get stock log history for a product (across all its variants).
 * Joins with users table to get usernames.
 */
export const getStockHistoryForProduct = async (productId) => {
    const { rows } = await db.query(
        `SELECT sl.logid      AS log_id,
                sl.stockid    AS stock_id,
                sl.usersid    AS user_id,
                u.username    AS user_name,
                sl.changetype AS change_type,
                sl.quantity,
                sl.reason,
                sl.createdat  AS created_at
         FROM stocklog sl
         LEFT JOIN users u ON sl.usersid = u.usersid
         WHERE sl.stockid IN (
             SELECT stockid FROM stock WHERE productsid = $1
         )
         ORDER BY sl.createdat DESC, sl.logid DESC
         LIMIT 100`,
        [productId]
    );
    return rows;
};

export default { createStockLog, getStockLogs };
