-- ============================================================
-- Migration: Add view_stock_low database view
-- Description: Provides a unified view of all products/variants
-- where stock is at or below the reorder level (minstock).
-- Used by dashboardService.checkAndNotifyLowStock() to
-- automatically generate low-stock notifications.
-- ============================================================

DROP VIEW IF EXISTS view_stock_low;

CREATE VIEW view_stock_low AS
SELECT
    p.productsid   AS product_id,
    p.productname  AS product_name,
    v.variantid    AS variant_id,
    COALESCE(v.sku, '')    AS sku,
    COALESCE(s.quantity, 0)         AS quantity,
    COALESCE(s.minstock, 5)         AS minstock,
    (s.minstock - s.quantity)       AS shortage,
    pi.imageurl                     AS thumbnail,
    c.categoryname                  AS category_name
FROM products p
JOIN variants v         ON p.productsid = v.productsid
LEFT JOIN stock s       ON v.variantid  = s.variantid
LEFT JOIN productimages pi ON p.productsid = pi.productsid AND pi.isthumbnail = TRUE
LEFT JOIN category c    ON p.categoriesid = c.categoriesid
WHERE p.status = 'active'
  AND (s.quantity IS NULL OR s.quantity <= COALESCE(s.minstock, 5));

COMMENT ON VIEW view_stock_low IS 'Products with stock at or below reorder level, used by the automatic low-stock notification system.';
