import db from '../database/dbpool.js';

/**
 * Get the cart row for a user. If none exists, INSERT a new cart and return it.
 * @param {number} userId
 * @returns {Promise<{cartId:number, userId:number, createdAt:string, updatedAt:string}>}
 */
export const getOrCreateCart = async (userId) => {
    const { rows } = await db.query(
        `SELECT cartid   AS "cartId",
                usersid  AS "userId",
                createdat AS "createdAt",
                updatedat AS "updatedAt"
         FROM cart WHERE usersid = $1`,
        [userId]
    );
    if (rows[0]) return rows[0];

    const inserted = await db.query(
        `INSERT INTO cart (usersid)
         VALUES ($1)
         RETURNING cartid   AS "cartId",
                   usersid  AS "userId",
                   createdat AS "createdAt",
                   updatedat AS "updatedAt"`,
        [userId]
    );
    return inserted.rows[0];
};

/**
 * Return the user's cart together with its items joined to product + variant info.
 * The items list mirrors `view_cart` (product_name, sku, currentPrice, quantity, lineTotal).
 */
export const getCartByUserId = async (userId) => {
    const cart = await getOrCreateCart(userId);

    const { rows } = await db.query(
        `SELECT
             ci.cartitemid   AS "cartItemId",
             ci.cartid       AS "cartId",
             ci.productsid   AS "productId",
             ci.variantid    AS "variantId",
             p.productname   AS "product_name",
             v.sku,
             p.baseprice     AS "currentPrice",
             ci.quantity,
             ROUND(p.baseprice * ci.quantity, 2) AS "lineTotal",
             ci.addedat      AS "addedAt"
         FROM cartitems ci
         JOIN cart c      ON ci.cartid     = c.cartid
         JOIN products p  ON ci.productsid = p.productsid
         LEFT JOIN variants v ON ci.variantid = v.variantid
         WHERE c.usersid = $1
         ORDER BY ci.addedat DESC`,
        [userId]
    );

    return { ...cart, items: rows };
};

/**
 * Fetch a single cart item by primary key.
 */
export const getCartItemById = async (cartItemId) => {
    const { rows } = await db.query(
        `SELECT cartitemid AS "cartItemId",
                cartid     AS "cartId",
                productsid AS "productId",
                variantid  AS "variantId",
                quantity,
                addedat    AS "addedAt"
         FROM cartitems WHERE cartitemid = $1`,
        [cartItemId]
    );
    return rows[0];
};

/**
 * Insert a cart item. If the (cartid, productsid, variantid) tuple already exists,
 * increment the existing row's quantity by the supplied amount.
 *
 * Uses unquoted lowercase identifiers so PostgreSQL matches the table's folded names.
 */
export const addCartItem = async (cartId, productId, variantId, quantity) => {
    const { rows } = await db.query(
        `INSERT INTO cartitems (cartid, productsid, variantid, quantity)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (cartid, productsid, variantid)
         DO UPDATE SET quantity = cartitems.quantity + EXCLUDED.quantity
         RETURNING cartitemid AS "cartItemId",
                   cartid     AS "cartId",
                   productsid AS "productId",
                   variantid  AS "variantId",
                   quantity,
                   addedat    AS "addedAt"`,
        [cartId, productId, variantId, quantity]
    );
    return rows[0];
};

/**
 * Update an existing cart item's quantity. Returns the updated row, or undefined if not found.
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
    const { rows } = await db.query(
        `UPDATE cartitems SET quantity = $1
         WHERE cartitemid = $2
         RETURNING cartitemid AS "cartItemId",
                   cartid     AS "cartId",
                   productsid AS "productId",
                   variantid  AS "variantId",
                   quantity,
                   addedat    AS "addedAt"`,
        [quantity, cartItemId]
    );
    return rows[0];
};

/**
 * Delete a single cart item. Returns true when a row was removed.
 */
export const deleteCartItem = async (cartItemId) => {
    const result = await db.query(
        'DELETE FROM cartitems WHERE cartitemid = $1',
        [cartItemId]
    );
    return result.rowCount > 0;
};

/**
 * Remove every item belonging to a cart. Returns the number of rows deleted.
 */
export const clearCart = async (cartId) => {
    const result = await db.query(
        'DELETE FROM cartitems WHERE cartid = $1',
        [cartId]
    );
    return result.rowCount;
};
