import db from '../database/dbpool.js';

export const ensureTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            subscriberid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            email        VARCHAR(320) NOT NULL UNIQUE,
            subscribedat TIMESTAMPTZ  DEFAULT NOW(),
            isactive     BOOLEAN      DEFAULT TRUE
        );
        CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
    `);
};

export const subscribe = async (email) => {
    const { rows } = await db.query(
        `INSERT INTO newsletter_subscribers (email)
         VALUES ($1)
         ON CONFLICT (email) DO UPDATE SET isactive = TRUE, subscribedat = NOW()
         RETURNING subscriberid, email, subscribedat AS subscribed_at`,
        [email.toLowerCase().trim()]
    );
    return rows[0];
};

export const unsubscribe = async (email) => {
    const { rows } = await db.query(
        `UPDATE newsletter_subscribers
         SET isactive = FALSE
         WHERE email = $1
         RETURNING subscriberid`,
        [email.toLowerCase().trim()]
    );
    return rows.length > 0;
};
