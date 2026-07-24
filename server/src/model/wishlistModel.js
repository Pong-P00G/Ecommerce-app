import db from '../database/dbpool.js';

export const getWishlistByUserId = async (userId) => {
    const { rows } = await db.query(
        `SELECT w.wishlist_id  AS "wishlistId",
                w.usersid      AS "userId",
                w.productsid   AS "productId",
                w.createdat    AS "createdAt",
                p.productname  AS "productName",
                p.baseprice    AS "basePrice",
                pi.imageurl    AS "thumbnail"
         FROM wishlist_items w
         JOIN products p ON w.productsid = p.productsid
         LEFT JOIN productimages pi ON pi.productsid = p.productsid AND pi.isthumbnail = true
         WHERE w.usersid = $1
         ORDER BY w.createdat DESC`,
        [userId]
    );
    return rows;
};

export const addWishlistItem = async (userId, productId) => {
    const { rows } = await db.query(
        `INSERT INTO wishlist_items (usersid, productsid)
         VALUES ($1, $2)
         ON CONFLICT (usersid, productsid) DO NOTHING
         RETURNING wishlist_id AS "wishlistId",
                   usersid     AS "userId",
                   productsid  AS "productId",
                   createdat   AS "createdAt"`,
        [userId, productId]
    );
    return rows[0] || null;
};

export const removeWishlistItem = async (userId, productId) => {
    const result = await db.query(
        `DELETE FROM wishlist_items
         WHERE usersid = $1 AND productsid = $2`,
        [userId, productId]
    );
    return result.rowCount > 0;
};

export const clearWishlist = async (userId) => {
    const result = await db.query(
        `DELETE FROM wishlist_items WHERE usersid = $1`,
        [userId]
    );
    return result.rowCount;
};

export const isInWishlist = async (userId, productId) => {
    const { rows } = await db.query(
        `SELECT 1 FROM wishlist_items
         WHERE usersid = $1 AND productsid = $2`,
        [userId, productId]
    );
    return rows.length > 0;
};

export const bulkAddWishlistItems = async (userId, productIds) => {
    if (!productIds || productIds.length === 0) return 0;
    const values = [];
    const params = [userId];
    let count = 0;
    for (const pid of productIds) {
        count++;
        const idx = count + 1;
        values.push(`($1, $${idx})`);
        params.push(pid);
    }
    const { rowCount } = await db.query(
        `INSERT INTO wishlist_items (usersid, productsid)
         VALUES ${values.join(', ')}
         ON CONFLICT (usersid, productsid) DO NOTHING`,
        params
    );
    return rowCount;
};
