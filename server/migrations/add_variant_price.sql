-- ============================================================
-- Migration: Add price column to variants table
-- Run: psql -U postgres -d aliee_shop -f server/migrations/add_variant_price.sql
-- ============================================================

ALTER TABLE variants
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT NULL;

-- Update seed data with realistic variant prices
-- iPhone 16 Pro Max: base price $1,199
UPDATE variants SET price = 1199.00 WHERE sku = 'IP16PM-NT-256';
UPDATE variants SET price = 1299.00 WHERE sku = 'IP16PM-NT-512';
UPDATE variants SET price = 1499.00 WHERE sku = 'IP16PM-NT-1T';
UPDATE variants SET price = 1199.00 WHERE sku = 'IP16PM-DT-256';
UPDATE variants SET price = 1299.00 WHERE sku = 'IP16PM-DT-512';
UPDATE variants SET price = 1499.00 WHERE sku = 'IP16PM-DT-1T';
UPDATE variants SET price = 1199.00 WHERE sku = 'IP16PM-WT-256';
UPDATE variants SET price = 1299.00 WHERE sku = 'IP16PM-BT-512';

-- iPhone 15 Pro: base price $999
UPDATE variants SET price = 999.00  WHERE sku LIKE 'IPP-%';

-- Sony WH-1000XM5: base price $348
UPDATE variants SET price = 348.00  WHERE sku LIKE 'SONY-XM5%';

-- Nike Air Max: base price $129.99
UPDATE variants SET price = 129.99  WHERE sku LIKE 'NAM-%';

-- Levi's 501: base price $79.50
UPDATE variants SET price = 79.50   WHERE sku LIKE 'LEV501%';
