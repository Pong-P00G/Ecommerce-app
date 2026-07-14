import db from '../database/dbpool.js';

function addParam(params, val) {
    params.push(val);
    return `$${params.length}`;
}

const REVIEW_COLS = `
    r.reviewsid     AS review_id,
    r.productsid    AS product_id,
    r.usersid       AS user_id,
    u.username,
    r.rating,
    r.title,
    r.comment,
    r.status,
    r.moderationnote AS moderation_note,
    r.createdat     AS created_at,
    r.updatedat     AS updated_at
`;

// ── CREATE ──────────────────────────────────────────────────────────────────

export const createReview = async ({ product_id, user_id, rating, title, comment }) => {
    const { rows } = await db.query(
        `INSERT INTO reviews (productsid, usersid, rating, title, comment, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING reviewsid`,
        [product_id, user_id, rating, title || null, comment || null]
    );
    return rows[0].reviewsid;
};

// ── READ ────────────────────────────────────────────────────────────────────

export const getReviewsByProduct = async (productId, status = 'approved') => {
    const { rows } = await db.query(
        `SELECT ${REVIEW_COLS}
         FROM reviews r
         JOIN users u ON r.usersid = u.usersid
         WHERE r.productsid = $1 AND r.status = $2
         ORDER BY r.createdat DESC`,
        [productId, status]
    );
    return rows;
};

export const getReviewById = async (reviewId) => {
    const { rows } = await db.query(
        `SELECT ${REVIEW_COLS}
         FROM reviews r
         JOIN users u ON r.usersid = u.usersid
         WHERE r.reviewsid = $1`,
        [reviewId]
    );
    return rows[0] || null;
};

export const getReviewsByUser = async (userId) => {
    const { rows } = await db.query(
        `SELECT ${REVIEW_COLS}
         FROM reviews r
         JOIN users u ON r.usersid = u.usersid
         WHERE r.usersid = $1
         ORDER BY r.createdat DESC`,
        [userId]
    );
    return rows;
};

// ── MODERATION ──────────────────────────────────────────────────────────────

export const getPendingReviews = async (page = 1, pageSize = 20) => {
    const offset = (page - 1) * pageSize;

    const countResult = await db.query(
        `SELECT COUNT(*) AS total FROM reviews WHERE status = 'pending'`
    );
    const totalItems = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / pageSize);

    const { rows } = await db.query(
        `SELECT ${REVIEW_COLS},
                p.productname AS product_name
         FROM reviews r
         JOIN users u   ON r.usersid   = u.usersid
         JOIN products p ON r.productsid = p.productsid
         WHERE r.status = 'pending'
         ORDER BY r.createdat ASC
         LIMIT $1 OFFSET $2`,
        [pageSize, offset]
    );

    return { page: parseInt(page), pageSize: parseInt(pageSize), totalItems, totalPages, items: rows };
};

export const getAllReviews = async (page = 1, pageSize = 20, statusFilter = null) => {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];

    if (statusFilter && statusFilter !== 'all') {
        const p = addParam(params, statusFilter);
        conditions.push(`r.status = ${p}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query(`SELECT COUNT(*) AS total FROM reviews r ${where}`, params);
    const totalItems = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / pageSize);

    const limitP  = addParam(params, pageSize);
    const offsetP = addParam(params, offset);

    const { rows } = await db.query(
        `SELECT ${REVIEW_COLS},
                p.productname AS product_name
         FROM reviews r
         JOIN users u   ON r.usersid   = u.usersid
         JOIN products p ON r.productsid = p.productsid
         ${where}
         ORDER BY r.createdat DESC
         LIMIT ${limitP} OFFSET ${offsetP}`,
        params
    );

    return { page: parseInt(page), pageSize: parseInt(pageSize), totalItems, totalPages, items: rows };
};

// ── PRODUCT RATING AGGREGATES ───────────────────────────────────────────────

export const getProductRatingSummary = async (productId) => {
    const { rows: [summary] } = await db.query(
        `SELECT
             COUNT(*)::int                                   AS total_reviews,
             COALESCE(ROUND(AVG(rating), 1), 0)              AS average_rating,
             COALESCE(SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END), 0)::int AS five_star,
             COALESCE(SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), 0)::int AS four_star,
             COALESCE(SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), 0)::int AS three_star,
             COALESCE(SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), 0)::int AS two_star,
             COALESCE(SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), 0)::int AS one_star
         FROM reviews
         WHERE productsid = $1 AND status = 'approved'`,
        [productId]
    );
    return summary;
};

// ── UPDATE ──────────────────────────────────────────────────────────────────

export const moderateReview = async (reviewId, status, moderationNote = null) => {
    const result = await db.query(
        `UPDATE reviews
         SET status = $1, moderationnote = $2, updatedat = NOW()
         WHERE reviewsid = $3`,
        [status, moderationNote, reviewId]
    );
    return result.rowCount > 0;
};

export const updateReview = async (reviewId, { rating, title, comment }) => {
    const result = await db.query(
        `UPDATE reviews
         SET rating = $1, title = $2, comment = $3, updatedat = NOW()
         WHERE reviewsid = $4`,
        [rating, title || null, comment || null, reviewId]
    );
    return result.rowCount > 0;
};

// ── DELETE ──────────────────────────────────────────────────────────────────

export const deleteReview = async (reviewId) => {
    const result = await db.query('DELETE FROM reviews WHERE reviewsid = $1', [reviewId]);
    return result.rowCount > 0;
};

// ── HELPER: check if user already reviewed a product ─────────────────────────

export const userHasReviewed = async (productId, userId) => {
    const { rows } = await db.query(
        `SELECT reviewsid FROM reviews WHERE productsid = $1 AND usersid = $2`,
        [productId, userId]
    );
    return rows.length > 0;
};

// ── TABLE CREATION (for auto-bootstrap) ─────────────────────────────────────

export const ensureTable = async () => {
    await db.query(`CREATE TABLE IF NOT EXISTS reviews (
        reviewsId       INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        productsId      INTEGER       NOT NULL,
        usersId         INTEGER       NOT NULL,
        rating          INTEGER       NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title           VARCHAR(200),
        comment         TEXT,
        status          VARCHAR(50)   NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        moderationNote  TEXT,
        createdAt       TIMESTAMPTZ   DEFAULT NOW(),
        updatedAt       TIMESTAMPTZ   DEFAULT NOW(),
        FOREIGN KEY (productsId) REFERENCES products(productsId) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (usersId) REFERENCES users(usersId) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    try {
        await db.query(
            `ALTER TABLE reviews ADD CONSTRAINT reviews_product_user_unique UNIQUE (productsId, usersId)`
        );
    } catch (e) {
        // constraint may already exist
    }

    await db.query(`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(productsId)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)`);
};
