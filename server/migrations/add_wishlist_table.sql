-- ============================================================
-- Migration: Create wishlist_items table
-- Run: psql -U postgres -d aliee_shop -f server/migrations/add_wishlist_table.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS wishlist_items (
    wishlist_id  SERIAL       PRIMARY KEY,
    usersid      INTEGER      NOT NULL REFERENCES users(usersid) ON DELETE CASCADE,
    productsid   INTEGER      NOT NULL REFERENCES products(productsid) ON DELETE CASCADE,
    createdat    TIMESTAMP    NOT NULL DEFAULT NOW(),

    -- Each user can save a given product only once
    UNIQUE (usersid, productsid)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_usersid ON wishlist_items(usersid);
