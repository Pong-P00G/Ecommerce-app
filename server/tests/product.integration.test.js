import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../src/database/dbpool.js';
import * as ProductModel from '../src/model/products/productModel.js';
import * as StockLogModel from '../src/model/products/stockLogModel.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Unique marker used to identify test-created records for cleanup.
 * All test products get this tag so afterAll can find and delete them.
 */
const TEST_MARKER = '_test_integration_';
const NONEXISTENT_ID = 999999;

let CATEGORY_ID;

/**
 * Create a minimal product row directly in the DB and return its ID.
 */
async function insertProduct(overrides = {}) {
    const { rows } = await db.query(
        `INSERT INTO products (categoriesid, productname, baseprice, description, status, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING productsid`,
        [
            overrides.category_id ?? CATEGORY_ID,
            overrides.product_name ?? `Integration Test ${Date.now()}`,
            overrides.base_price ?? 19.99,
            overrides.description ?? 'Created by integration test',
            overrides.status ?? 'active',
            overrides.tags ?? [TEST_MARKER, 'test_tag'],
        ]
    );
    return rows[0].productsid;
}

// ── Suite setup / teardown ──────────────────────────────────────────────────

beforeAll(async () => {
    // Create a dedicated category for integration tests
    const { rows } = await db.query(
        `INSERT INTO category (categoryname) VALUES ($1) RETURNING categoriesid`,
        [`Integration Test Cat ${Date.now()}`]
    );
    CATEGORY_ID = rows[0].categoriesid;
});

afterAll(async () => {
    try {
        // Must delete in FK-safe order due to ON DELETE RESTRICT constraints
        // 1. Discounts (RESTRICT on products)
        await db.query(
            'DELETE FROM discounts WHERE productsid IN (SELECT productsid FROM products WHERE $1 = ANY(tags))',
            [TEST_MARKER]
        );
        // 2. Stock logs (RESTRICT on stock)
        await db.query(
            'DELETE FROM stocklog WHERE stockid IN (SELECT stockid FROM stock WHERE productsid IN (SELECT productsid FROM products WHERE $1 = ANY(tags)))',
            [TEST_MARKER]
        );
        // 3. Stock
        await db.query(
            'DELETE FROM stock WHERE productsid IN (SELECT productsid FROM products WHERE $1 = ANY(tags))',
            [TEST_MARKER]
        );
        // 4. Variant option values (CASCADE on variants)
        await db.query(
            'DELETE FROM variantoptionvalue WHERE variantid IN (SELECT variantid FROM variants WHERE productsid IN (SELECT productsid FROM products WHERE $1 = ANY(tags)))',
            [TEST_MARKER]
        );
        // 5. Variants (RESTRICT on products)
        await db.query(
            'DELETE FROM variants WHERE productsid IN (SELECT productsid FROM products WHERE $1 = ANY(tags))',
            [TEST_MARKER]
        );
        // 6. Product images (CASCADE on products — safe, delete explicitly)
        await db.query(
            'DELETE FROM productimages WHERE productsid IN (SELECT productsid FROM products WHERE $1 = ANY(tags))',
            [TEST_MARKER]
        );
        // 7. Finally, delete the products
        await db.query(
            'DELETE FROM products WHERE $1 = ANY(tags)',
            [TEST_MARKER]
        );
        // 8. Clean up the test category
        if (CATEGORY_ID) {
            await db.query('DELETE FROM category WHERE categoriesid = $1', [CATEGORY_ID]);
        }
    } finally {
        await db.end();
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT CRUD
// ═══════════════════════════════════════════════════════════════════════════════

describe('Product CRUD — real database', () => {
    it('createProduct inserts a product and returns its ID', async () => {
        const id = await ProductModel.createProduct({
            category_id: CATEGORY_ID,
            product_name: `CRUD Test ${TEST_MARKER}`,
            base_price: 49.99,
            descriptions: 'Testing CRUD create',
            product_status: 'active',
            tags: [TEST_MARKER, 'test_crud'],
        });

        expect(id).toBeGreaterThan(0);

        const { rows } = await db.query(
            'SELECT productname, baseprice, status, tags FROM products WHERE productsid = $1',
            [id]
        );
        expect(rows[0].productname).toContain(TEST_MARKER);
        expect(parseFloat(rows[0].baseprice)).toBe(49.99);
        expect(rows[0].status).toBe('active');
        expect(rows[0].tags).toContain('test_crud');
    });

    it('getProductById returns full product with images and variants', async () => {
        const id = await insertProduct({ product_name: `GetById Test ${TEST_MARKER}` });

        const product = await ProductModel.getProductById(id);

        expect(product).not.toBeNull();
        expect(product.product_id).toBe(id);
        expect(product.product_status).toBe('active');
        expect(product.tags).toBeDefined();
        expect(Array.isArray(product.tags)).toBe(true);
        expect(Array.isArray(product.images)).toBe(true);
        expect(Array.isArray(product.variants)).toBe(true);
    });

    it('getProductById returns null for non-existent product', async () => {
        const result = await ProductModel.getProductById(NONEXISTENT_ID);
        expect(result).toBeNull();
    });

    it('updateProduct modifies product fields', async () => {
        const id = await insertProduct({
            product_name: `Before Update ${TEST_MARKER}`,
            base_price: 10.00,
        });

        const affected = await ProductModel.updateProduct(id, {
            category_id: CATEGORY_ID,
            product_name: `After Update ${TEST_MARKER}`,
            base_price: 25.00,
            descriptions: 'Updated description',
            product_status: 'inactive',
            tags: [TEST_MARKER, 'updated_tag'],
        });

        expect(affected).toBeGreaterThan(0);

        const updated = await ProductModel.getProductById(id);
        expect(updated.product_name).toBe(`After Update ${TEST_MARKER}`);
    });

    it('updateProduct changes tags correctly', async () => {
        const id = await insertProduct({ tags: [TEST_MARKER, 'old_tag'] });

        await ProductModel.updateProduct(id, {
            category_id: CATEGORY_ID,
            product_name: `Tags Change ${TEST_MARKER}`,
            base_price: 15.00,
            product_status: 'active',
            tags: [TEST_MARKER, 'new_tag', 'replacement'],
        });

        const { rows } = await db.query(
            'SELECT tags FROM products WHERE productsid = $1',
            [id]
        );
        expect(rows[0].tags).toContain('new_tag');
        expect(rows[0].tags).toContain('replacement');
    });

    it('deleteProduct removes a product', async () => {
        const id = await insertProduct({ product_name: `To Delete ${TEST_MARKER}` });

        const deleted = await ProductModel.deleteProduct(id);
        expect(deleted).toBe(true);

        const gone = await ProductModel.getProductById(id);
        expect(gone).toBeNull();
    });

    it('deleteProduct returns false for non-existent product', async () => {
        const result = await ProductModel.deleteProduct(NONEXISTENT_ID);
        expect(result).toBe(false);
    });

    it('productExists returns true for existing product', async () => {
        const id = await insertProduct();
        const exists = await ProductModel.productExists(id);
        expect(exists).toBe(true);
    });

    it('productExists returns false for non-existent product', async () => {
        const exists = await ProductModel.productExists(NONEXISTENT_ID);
        expect(exists).toBe(false);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINATION & FILTERING
// ═══════════════════════════════════════════════════════════════════════════════

describe('getPaginatedProducts — real database', () => {
    let paginationIds = [];

    beforeAll(async () => {
        // Create test products specifically for pagination tests
        for (let i = 0; i < 5; i++) {
            const id = await insertProduct({
                product_name: `Pagination ${i} ${TEST_MARKER}`,
                base_price: 10 + i * 5,
                status: i % 2 === 0 ? 'active' : 'inactive',
                tags: [TEST_MARKER, 'pagination'],
            });
            paginationIds.push(id);
        }
    });

    it('returns paginated results with correct structure', async () => {
        const result = await ProductModel.getPaginatedProducts(1, 5, {});

        expect(result).toHaveProperty('page', 1);
        expect(result).toHaveProperty('pageSize', 5);
        expect(result).toHaveProperty('totalItems');
        expect(result).toHaveProperty('totalPages');
        expect(Array.isArray(result.items)).toBe(true);

        // Each item should have the expected fields from PRODUCT_COLS
        const item = result.items[0];
        expect(item).toHaveProperty('product_id');
        expect(item).toHaveProperty('product_name');
        expect(item).toHaveProperty('base_price');
        expect(item).toHaveProperty('product_status');
        expect(item).toHaveProperty('tags');
        expect(item).toHaveProperty('category_name');
        expect(item).toHaveProperty('total_stock');
    });

    it('filters by status correctly', async () => {
        const active = await ProductModel.getPaginatedProducts(1, 100, { status: 'active' });
        expect(active.items.every(p => p.product_status === 'active')).toBe(true);

        const inactive = await ProductModel.getPaginatedProducts(1, 100, { status: 'inactive' });
        expect(inactive.items.every(p => p.product_status === 'inactive')).toBe(true);
    });

    it('sorts by price ascending and descending', async () => {
        const asc = await ProductModel.getPaginatedProducts(1, 20, {
            sortField: 'base_price',
            sortDirection: 'asc',
        });
        const prices = asc.items.map(p => parseFloat(p.base_price));
        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }

        const desc = await ProductModel.getPaginatedProducts(1, 20, {
            sortField: 'base_price',
            sortDirection: 'desc',
        });
        const pricesDesc = desc.items.map(p => parseFloat(p.base_price));
        for (let i = 1; i < pricesDesc.length; i++) {
            expect(pricesDesc[i]).toBeLessThanOrEqual(pricesDesc[i - 1]);
        }
    });

    it('searches by product name', async () => {
        const result = await ProductModel.getPaginatedProducts(1, 10, {
            search: TEST_MARKER,
        });

        expect(result.items.length).toBeGreaterThanOrEqual(1);
        expect(result.items.every(p => p.product_name.includes(TEST_MARKER))).toBe(true);
    });

    it('handles empty result sets', async () => {
        const result = await ProductModel.getPaginatedProducts(1, 10, {
            status: 'archived',
            search: 'ThisProductDoesNotExist_ZZZZ',
        });
        expect(result.items).toHaveLength(0);
        expect(result.totalItems).toBe(0);
        expect(result.totalPages).toBe(0);
    });

    it('paginates across multiple pages', async () => {
        const page1 = await ProductModel.getPaginatedProducts(1, 2, {
            search: TEST_MARKER,
        });
        const page2 = await ProductModel.getPaginatedProducts(2, 2, {
            search: TEST_MARKER,
        });

        expect(page1.items.length).toBeLessThanOrEqual(2);
        expect(page2.items.length).toBeLessThanOrEqual(2);

        // Same items should not appear on both pages
        const page1Ids = new Set(page1.items.map(p => p.product_id));
        const page2Ids = new Set(page2.items.map(p => p.product_id));
        page2Ids.forEach(id => {
            expect(page1Ids.has(id)).toBe(false);
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TAGS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Products by tag — real database', () => {
    beforeAll(async () => {
        await insertProduct({ product_name: `Tagged Alpha ${TEST_MARKER}`, tags: [TEST_MARKER, 'alpha_tag'] });
        await insertProduct({ product_name: `Tagged Beta ${TEST_MARKER}`, tags: [TEST_MARKER, 'alpha_tag'] });
        await insertProduct({ product_name: `Limited 1 ${TEST_MARKER}`, tags: [TEST_MARKER, 'limit_test'] });
        await insertProduct({ product_name: `Limited 2 ${TEST_MARKER}`, tags: [TEST_MARKER, 'limit_test'] });
        await insertProduct({ product_name: `Limited 3 ${TEST_MARKER}`, tags: [TEST_MARKER, 'limit_test'] });
    });

    it('getProductsByTag returns products with matching tag', async () => {
        const result = await ProductModel.getProductsByTag('alpha_tag', 10);
        const filtered = result.filter(p => p.tags.includes(TEST_MARKER));
        expect(filtered.length).toBeGreaterThanOrEqual(2);
        expect(filtered.every(p => p.tags.includes('alpha_tag'))).toBe(true);
    });

    it('getProductsByTag returns empty for non-existent tag', async () => {
        const result = await ProductModel.getProductsByTag('nonexistent_tag_xyz', 10);
        expect(result).toHaveLength(0);
    });

    it('getProductsByTag respects limit parameter', async () => {
        const result = await ProductModel.getProductsByTag('limit_test', 2);
        expect(result.length).toBeLessThanOrEqual(2);
    });
});

describe('getNewArrivals — real database', () => {
    beforeAll(async () => {
        await insertProduct({
            product_name: `New Arrival ${TEST_MARKER}`,
            tags: [TEST_MARKER, 'new_arrival'],
            status: 'active',
        });
        await insertProduct({
            product_name: `Inactive New Arrival ${TEST_MARKER}`,
            tags: [TEST_MARKER, 'new_arrival'],
            status: 'inactive',
        });
    });

    it('returns active products with new_arrival tag', async () => {
        const result = await ProductModel.getNewArrivals(50);
        const found = result.find(p => p.product_name.includes(TEST_MARKER) && p.product_name.includes('New Arrival'));
        expect(found).toBeDefined();
        expect(found.tags).toContain('new_arrival');
    });

    it('does not return inactive products', async () => {
        const result = await ProductModel.getNewArrivals(50);
        const found = result.find(p => p.product_name.includes('Inactive New Arrival'));
        expect(found).toBeUndefined();
    });

    it('respects the limit parameter', async () => {
        const result = await ProductModel.getNewArrivals(3);
        expect(result.length).toBeLessThanOrEqual(3);
    });
});

describe('getComingSoon — real database', () => {
    beforeAll(async () => {
        await insertProduct({
            product_name: `Coming Soon ${TEST_MARKER}`,
            tags: [TEST_MARKER, 'coming_soon'],
            status: 'active',
        });
    });

    it('returns products tagged as coming_soon', async () => {
        const result = await ProductModel.getComingSoon(50);
        const filtered = result.filter(p => p.tags.includes(TEST_MARKER));
        expect(filtered.length).toBeGreaterThanOrEqual(1);
        expect(filtered.every(p => p.tags.includes('coming_soon'))).toBe(true);
    });

    it('respects the limit', async () => {
        const result = await ProductModel.getComingSoon(1);
        expect(result.length).toBeLessThanOrEqual(1);
    });
});

describe('getBestSellers — real database', () => {
    beforeAll(async () => {
        await insertProduct({
            product_name: `Best Seller ${TEST_MARKER}`,
            tags: [TEST_MARKER, 'best_seller'],
            status: 'active',
        });
    });

    it('returns products with best_seller tag or high stock', async () => {
        const result = await ProductModel.getBestSellers(50);
        const filtered = result.filter(p => p.tags.includes(TEST_MARKER));
        expect(filtered.length).toBeGreaterThanOrEqual(1);
    });

    it('respects the limit', async () => {
        const result = await ProductModel.getBestSellers(2);
        expect(result.length).toBeLessThanOrEqual(2);
    });
});

describe('getFeaturedProducts — real database', () => {
    beforeAll(async () => {
        await insertProduct({
            product_name: `Featured ${TEST_MARKER}`,
            status: 'active',
        });
    });

    it('returns active products ordered by stock', async () => {
        const result = await ProductModel.getFeaturedProducts(50);
        const filtered = result.filter(p => p.tags.includes(TEST_MARKER));
        expect(filtered.length).toBeGreaterThanOrEqual(1);
        expect(filtered[0]).toHaveProperty('total_stock');
    });

    it('respects the limit', async () => {
        const result = await ProductModel.getFeaturedProducts(1);
        expect(result.length).toBeLessThanOrEqual(1);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT IMAGES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Product images — real database', () => {
    it('addProductImage inserts and returns image ID', async () => {
        const pid = await insertProduct({ product_name: `Image Test ${TEST_MARKER}` });

        const imageId = await ProductModel.addProductImage(
            pid, '/images/test-image.jpg', 1, 'Test alt text', 1
        );

        expect(imageId).toBeGreaterThan(0);

        const { rows } = await db.query(
            'SELECT imageurl, alttext, isthumbnail, sortorder FROM productimages WHERE imageid = $1',
            [imageId]
        );
        expect(rows[0].imageurl).toBe('/images/test-image.jpg');
        expect(rows[0].alttext).toBe('Test alt text');
        expect(rows[0].isthumbnail).toBe(true);
        expect(rows[0].sortorder).toBe(1);
    });

    it('getProductImages returns all images for a product', async () => {
        const pid = await insertProduct({ product_name: `Multi Image ${TEST_MARKER}` });
        await ProductModel.addProductImage(pid, '/images/img1.jpg', 1, 'First', 1);
        await ProductModel.addProductImage(pid, '/images/img2.jpg', 0, 'Second', 2);

        const images = await ProductModel.getProductImages(pid);
        expect(images.length).toBe(2);
        expect(images[0].alt_text).toBe('First');
        expect(images[1].alt_text).toBe('Second');
    });

    it('deleteProductImage removes an image', async () => {
        const pid = await insertProduct({ product_name: `Delete Image ${TEST_MARKER}` });
        const imageId = await ProductModel.addProductImage(pid, '/images/to-delete.jpg', 0, null, 0);

        const deleted = await ProductModel.deleteProductImage(imageId);
        expect(deleted).toBe(true);

        const images = await ProductModel.getProductImages(pid);
        expect(images).toHaveLength(0);
    });

    it('setMainImage updates the main image', async () => {
        const pid = await insertProduct({ product_name: `Main Image ${TEST_MARKER}` });
        const img1 = await ProductModel.addProductImage(pid, '/images/main1.jpg', 1, null, 1);
        const img2 = await ProductModel.addProductImage(pid, '/images/main2.jpg', 0, null, 2);

        await ProductModel.setMainImage(img2, pid);

        const images = await ProductModel.getProductImages(pid);
        const newMain = images.find(i => i.is_main === true);
        expect(newMain.image_url).toBe('/images/main2.jpg');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Product variants — real database', () => {
    it('createVariant inserts a variant', async () => {
        const pid = await insertProduct({ product_name: `Variant ${TEST_MARKER}` });

        const variantId = await ProductModel.createVariant({
            product_id: pid,
            sku: `INT-SKU-${Date.now()}`,
        });

        expect(variantId).toBeGreaterThan(0);

        const variant = await ProductModel.getVariantById(variantId);
        expect(variant.sku).toContain('INT-SKU');
    });

    it('skuExists detects duplicate SKUs', async () => {
        const sku = `UNIQUE-SKU-${Date.now()}`;
        const pid = await insertProduct({ product_name: `SKU Test ${TEST_MARKER}` });
        await ProductModel.createVariant({ product_id: pid, sku });

        const exists = await ProductModel.skuExists(sku);
        expect(exists).toBe(true);

        const notExists = await ProductModel.skuExists('NONEXISTENT-SKU-999999');
        expect(notExists).toBe(false);
    });

    it('getProductVariants returns variants for a product', async () => {
        const pid = await insertProduct({ product_name: `Multi Var ${TEST_MARKER}` });
        await ProductModel.createVariant({ product_id: pid, sku: `VAR-${Date.now()}-A` });
        await ProductModel.createVariant({ product_id: pid, sku: `VAR-${Date.now()}-B` });

        const variants = await ProductModel.getProductVariants(pid);
        expect(variants.length).toBe(2);
    });

    it('addVariantOptions attaches color and size to a variant', async () => {
        const pid = await insertProduct({ product_name: `Options ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `OPT-${Date.now()}` });

        await ProductModel.addVariantOptions(vid, [
            { attribute_name: 'Color', value: 'Red' },
            { attribute_name: 'Size', value: 'XL' },
        ]);

        const options = await ProductModel.getVariantOptions(vid);
        expect(options.options).toHaveLength(2);
        expect(options.variant_color).toBe('Red');
        expect(options.variant_size).toBe('XL');
    });

    it('updateVariantOptions replaces existing options', async () => {
        const pid = await insertProduct({ product_name: `Replace Opt ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `REP-${Date.now()}` });
        await ProductModel.addVariantOptions(vid, [{ attribute_name: 'Color', value: 'Blue' }]);

        await ProductModel.updateVariantOptions(vid, [
            { attribute_name: 'Color', value: 'Green' },
            { attribute_name: 'Storage', value: '256GB' },
        ]);

        const options = await ProductModel.getVariantOptions(vid);
        expect(options.options).toHaveLength(2);
        expect(options.variant_color).toBe('Green');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STOCK
// ═══════════════════════════════════════════════════════════════════════════════

describe('Product stock — real database', () => {
    it('updateStock creates or updates variant stock', async () => {
        const pid = await insertProduct({ product_name: `Stock ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `STK-${Date.now()}` });

        const stockId = await ProductModel.updateStock(vid, 50, 10);
        expect(stockId).toBeGreaterThan(0);

        const stock = await ProductModel.getStock(vid);
        expect(stock.quantity).toBe(50);
        expect(stock.reorder_level).toBe(10);
    });

    it('updateStock updates existing stock quantity', async () => {
        const pid = await insertProduct({ product_name: `Stock Upd ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `STK2-${Date.now()}` });
        await ProductModel.updateStock(vid, 30, 5);
        await ProductModel.updateStock(vid, 75, 8);

        const stock = await ProductModel.getStock(vid);
        expect(stock.quantity).toBe(75);
        expect(stock.reorder_level).toBe(8);
    });

    it('updateProductStock handles product-level stock (variantId IS NULL)', async () => {
        const pid = await insertProduct({ product_name: `PLevel Stock ${TEST_MARKER}` });

        const stockId = await ProductModel.updateProductStock(pid, 100, 20);
        expect(stockId).toBeGreaterThan(0);

        const stock = await ProductModel.getProductStock(pid);
        expect(stock.quantity).toBe(100);
        expect(stock.reorder_level).toBe(20);
    });

    it('incrementStock increases quantity', async () => {
        const pid = await insertProduct({ product_name: `Incr ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `INC-${Date.now()}` });
        await ProductModel.updateStock(vid, 10, 5);
        await ProductModel.incrementStock(vid, 5);

        const stock = await ProductModel.getStock(vid);
        expect(stock.quantity).toBe(15);
    });

    it('decrementStock decreases quantity', async () => {
        const pid = await insertProduct({ product_name: `Decr ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `DEC-${Date.now()}` });
        await ProductModel.updateStock(vid, 20, 5);
        await ProductModel.decrementStock(vid, 8);

        const stock = await ProductModel.getStock(vid);
        expect(stock.quantity).toBe(12);
    });

    it('getLowStockProducts returns items below threshold', async () => {
        const pid = await insertProduct({ product_name: `Low Stock ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `LOW-${Date.now()}` });
        await ProductModel.updateStock(vid, 3, 10);

        const lowStock = await ProductModel.getLowStockProducts();
        const found = lowStock.find(s => s.sku && s.sku.includes('LOW-'));
        expect(found).toBeDefined();
        expect(parseInt(found.quantity)).toBe(3);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DISCOUNTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Product discounts — real database', () => {
    it('applyDiscount creates a discount', async () => {
        const pid = await insertProduct({ product_name: `Discount ${TEST_MARKER}` });

        const discountId = await ProductModel.applyDiscount(
            pid, 25.00,
            new Date(Date.now() - 86400000).toISOString(),
            new Date(Date.now() + 604800000).toISOString()
        );

        expect(discountId).toBeGreaterThan(0);
    });

    it('getActiveDiscount returns current discount', async () => {
        const pid = await insertProduct({ product_name: `Active Disc ${TEST_MARKER}` });

        await ProductModel.applyDiscount(
            pid, 15.00,
            new Date(Date.now() - 86400000).toISOString(),
            new Date(Date.now() + 604800000).toISOString()
        );

        const active = await ProductModel.getActiveDiscount(pid);
        expect(active).not.toBeNull();
        expect(parseFloat(active.discount_amount)).toBe(15.00);
    });

    it('getActiveDiscount returns undefined for product with no discount', async () => {
        const pid = await insertProduct({ product_name: `No Disc ${TEST_MARKER}` });
        const active = await ProductModel.getActiveDiscount(pid);
        expect(active).toBeUndefined();
    });

    it('getProductDiscounts returns all discounts for a product', async () => {
        const pid = await insertProduct({ product_name: `Mult Disc ${TEST_MARKER}` });
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        const nextWeek = new Date(Date.now() + 604800000).toISOString();

        await ProductModel.applyDiscount(pid, 10.00, yesterday, nextWeek);
        await ProductModel.applyDiscount(pid, 20.00, yesterday, nextWeek);

        const discounts = await ProductModel.getProductDiscounts(pid);
        expect(discounts.length).toBe(2);
    });

    it('updateDiscount modifies discount fields', async () => {
        const pid = await insertProduct({ product_name: `Upd Disc ${TEST_MARKER}` });
        const discountId = await ProductModel.applyDiscount(
            pid, 30.00,
            new Date(Date.now() - 86400000).toISOString(),
            new Date(Date.now() + 604800000).toISOString()
        );

        const affected = await ProductModel.updateDiscount(discountId, {
            discount_amount: 35.00,
            start_date: new Date(Date.now() - 86400000).toISOString(),
            end_date: new Date(Date.now() + 1209600000).toISOString(),
        });
        expect(affected).toBeGreaterThan(0);
    });

    it('deleteDiscount removes a discount', async () => {
        const pid = await insertProduct({ product_name: `Del Disc ${TEST_MARKER}` });
        const discountId = await ProductModel.applyDiscount(
            pid, 5.00,
            new Date(Date.now() - 86400000).toISOString(),
            new Date(Date.now() + 604800000).toISOString()
        );

        const deleted = await ProductModel.deleteDiscount(discountId);
        expect(deleted).toBe(true);

        const discounts = await ProductModel.getProductDiscounts(pid);
        expect(discounts.find(d => d.discount_id === discountId)).toBeUndefined();
    });

    it('getAllDiscounts returns all discounts with product info', async () => {
        const pid = await insertProduct({ product_name: `All Disc ${TEST_MARKER}` });
        await ProductModel.applyDiscount(
            pid, 12.00,
            new Date(Date.now() - 86400000).toISOString(),
            new Date(Date.now() + 604800000).toISOString()
        );

        const all = await ProductModel.getAllDiscounts();
        expect(all.length).toBeGreaterThanOrEqual(1);
        expect(all[0]).toHaveProperty('product_name');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH & FILTERING
// ═══════════════════════════════════════════════════════════════════════════════

describe('Search products — real database', () => {
    beforeAll(async () => {
        await insertProduct({ product_name: `Searchable Widget ${TEST_MARKER}`, base_price: 5.00 });
        await insertProduct({ product_name: `Expensive Item ${TEST_MARKER}`, base_price: 100.00 });
        await insertProduct({
            product_name: `Filtered Prod ${TEST_MARKER}`,
            base_price: 15.00,
            status: 'active',
        });
    });

    it('searchProducts finds by name', async () => {
        // searchProducts expects individual args: (searchTerm, category, minPrice, maxPrice, status)
        const result = await ProductModel.searchProducts(TEST_MARKER, null, null, null, null);
        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(p => p.product_name.includes(TEST_MARKER))).toBe(true);
    });

    it('searchProducts filters by price range', async () => {
        const cheap = await ProductModel.searchProducts(null, null, 0, 10, null);
        const testCheap = cheap.filter(p => p.tags.includes(TEST_MARKER));
        expect(testCheap.length).toBeGreaterThanOrEqual(1);
    });

    it('searchProducts returns all products when no filters provided', async () => {
        const result = await ProductModel.searchProducts();
        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('searchProducts returns empty for non-matching search', async () => {
        const result = await ProductModel.searchProducts('ZZZZNonExistentSearch', null, null, null, null);
        expect(result).toHaveLength(0);
    });

    it('searchProducts can combine multiple filters', async () => {
        const result = await ProductModel.searchProducts(TEST_MARKER, null, 10, 20, 'active');
        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.every(p => p.product_status === 'active')).toBe(true);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STOCK LOGS & HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

describe('Stock logs — real database', () => {
    it('createStockLog inserts a log with change type IN', async () => {
        const pid = await insertProduct({ product_name: `StockLog IN ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `SLOG-IN-${Date.now()}` });

        // updateStock creates stock + creates a log via createStockLog
        await ProductModel.updateStock(vid, 100, 10);

        // Now directly create another log entry
        const stock = await ProductModel.getStock(vid);
        const logId = await StockLogModel.createStockLog({
            stock_id: stock.stock_id,
            user_id: null,
            change_type: 'IN',
            quantity: 20,
            reason: 'Direct stock-in test',
        });

        expect(logId).toBeGreaterThan(0);

        // Verify the log exists
        const logs = await StockLogModel.getStockLogs(stock.stock_id);
        const found = logs.find(l => l.log_id === logId);
        expect(found).toBeDefined();
        expect(found.change_type).toBe('IN');
        expect(parseInt(found.quantity)).toBe(20);
        expect(found.reason).toBe('Direct stock-in test');
    });

    it('createStockLog supports all change types', async () => {
        const pid = await insertProduct({ product_name: `StockLog Types ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `SLOG-TYPES-${Date.now()}` });
        await ProductModel.updateStock(vid, 200, 20);
        const stock = await ProductModel.getStock(vid);

        const types = ['IN', 'OUT', 'ADJUST', 'RETURN', 'DAMAGED'];
        const logIds = [];

        for (const changeType of types) {
            const logId = await StockLogModel.createStockLog({
                stock_id: stock.stock_id,
                user_id: null,
                change_type: changeType,
                quantity: 10,
                reason: `Test ${changeType}`,
            });
            logIds.push(logId);
        }

        expect(logIds.length).toBe(5);

        const allLogs = await StockLogModel.getStockLogs(stock.stock_id);
        const logTypes = allLogs.map(l => l.change_type);
        types.forEach(t => expect(logTypes).toContain(t));
    });

    it('createStockLog rejects missing required fields', async () => {
        await expect(StockLogModel.createStockLog({
            stock_id: null,
            change_type: 'IN',
            quantity: 5,
        })).rejects.toThrow('stock_id is required');

        await expect(StockLogModel.createStockLog({
            stock_id: 1,
            change_type: null,
            quantity: 5,
        })).rejects.toThrow('change_type is required');

        await expect(StockLogModel.createStockLog({
            stock_id: 1,
            change_type: 'IN',
            quantity: null,
        })).rejects.toThrow('quantity is required');
    });

    it('getStockLogs returns logs in reverse chronological order', async () => {
        const pid = await insertProduct({ product_name: `StockLog Order ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `SLOG-ORDER-${Date.now()}` });
        await ProductModel.updateStock(vid, 50, 5);
        const stock = await ProductModel.getStock(vid);

        // Create logs with increasing quantities to verify order
        await StockLogModel.createStockLog({ stock_id: stock.stock_id, change_type: 'IN', quantity: 10, reason: 'First' });
        await StockLogModel.createStockLog({ stock_id: stock.stock_id, change_type: 'OUT', quantity: 5, reason: 'Second' });

        const logs = await StockLogModel.getStockLogs(stock.stock_id);
        expect(logs.length).toBeGreaterThanOrEqual(3); // at least the initial + 2 new ones

        // Each log should have the expected fields
        logs.forEach(log => {
            expect(log).toHaveProperty('log_id');
            expect(log).toHaveProperty('stock_id');
            expect(log).toHaveProperty('change_type');
            expect(log).toHaveProperty('quantity');
            expect(log).toHaveProperty('reason');
            expect(log).toHaveProperty('created_at');
        });

        // Verify reverse chronological order by timestamps
        for (let i = 1; i < logs.length; i++) {
            const prev = new Date(logs[i - 1].created_at).getTime();
            const curr = new Date(logs[i].created_at).getTime();
            expect(prev).toBeGreaterThanOrEqual(curr);
        }
    });

    it('getStockLogs returns empty array for stock with no logs', async () => {
        // Create a new stock record with no logs via direct INSERT
        const pid = await insertProduct({ product_name: `No Logs ${TEST_MARKER}` });
        const { rows } = await db.query(
            `INSERT INTO stock (productsid, variantid, quantity, minstock)
             VALUES ($1, NULL, 0, 5) RETURNING stockid`,
            [pid]
        );

        const logs = await StockLogModel.getStockLogs(rows[0].stockid);
        expect(logs).toHaveLength(0);
    });

    it('incrementStock creates a stock log with type IN', async () => {
        const pid = await insertProduct({ product_name: `Incr Log ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `INCR-LOG-${Date.now()}` });
        await ProductModel.updateStock(vid, 30, 5);
        const stockBefore = await ProductModel.getStock(vid);

        await ProductModel.incrementStock(vid, 10, null, 'Restock from supplier');

        // Verify stock changed
        const stockAfter = await ProductModel.getStock(vid);
        expect(stockAfter.quantity).toBe(40);

        // Verify a log was created
        const logs = await StockLogModel.getStockLogs(stockBefore.stock_id);
        const incrementLog = logs.find(l => l.change_type === 'IN');
        expect(incrementLog).toBeDefined();
        expect(parseInt(incrementLog.quantity)).toBe(10);
        expect(incrementLog.reason).toContain('Restock');
    });

    it('decrementStock creates a stock log with type OUT', async () => {
        const pid = await insertProduct({ product_name: `Decr Log ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `DECR-LOG-${Date.now()}` });
        await ProductModel.updateStock(vid, 30, 5);
        const stockBefore = await ProductModel.getStock(vid);

        await ProductModel.decrementStock(vid, 8, null, 'Sale order #1234');

        // Verify stock changed
        const stockAfter = await ProductModel.getStock(vid);
        expect(stockAfter.quantity).toBe(22);

        // Verify a log was created
        const logs = await StockLogModel.getStockLogs(stockBefore.stock_id);
        const decrementLog = logs.find(l => l.change_type === 'OUT');
        expect(decrementLog).toBeDefined();
        expect(parseInt(decrementLog.quantity)).toBe(8);
        expect(decrementLog.reason).toContain('Sale order');
    });

    it('updateStock with a reason creates an ADJUST log', async () => {
        const pid = await insertProduct({ product_name: `Adjust Log ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `ADJ-LOG-${Date.now()}` });
        await ProductModel.updateStock(vid, 30, 5);
        const stockBefore = await ProductModel.getStock(vid);

        // updateStock internally creates an ADJUST log
        await ProductModel.updateStock(vid, 60, 8, null, 'Inventory correction');

        const logs = await StockLogModel.getStockLogs(stockBefore.stock_id);
        const adjustLog = logs.find(l => l.change_type === 'ADJUST');
        expect(adjustLog).toBeDefined();
        expect(parseInt(adjustLog.quantity)).toBe(60);
    });
});

describe('Stock history for product — real database', () => {
    it('getStockHistoryForProduct returns logs across multiple variants', async () => {
        const pid = await insertProduct({ product_name: `History ${TEST_MARKER}` });
        const v1 = await ProductModel.createVariant({ product_id: pid, sku: `HIST-A-${Date.now()}` });
        const v2 = await ProductModel.createVariant({ product_id: pid, sku: `HIST-B-${Date.now()}` });

        // Create stock + logs for variant 1
        await ProductModel.updateStock(v1, 50, 10, null, 'Initial variant A stock');
        await ProductModel.incrementStock(v1, 10, null, 'Restock variant A');

        // Create stock + logs for variant 2
        await ProductModel.updateStock(v2, 100, 20, null, 'Initial variant B stock');
        await ProductModel.decrementStock(v2, 5, null, 'Sold variant B');

        // Get full history for the product
        const history = await StockLogModel.getStockHistoryForProduct(pid);
        expect(history.length).toBeGreaterThanOrEqual(4); // at least 4 log entries

        // History entries should have the expected structure
        history.forEach(entry => {
            expect(entry).toHaveProperty('log_id');
            expect(entry).toHaveProperty('stock_id');
            expect(entry).toHaveProperty('change_type');
            expect(entry).toHaveProperty('quantity');
            expect(entry).toHaveProperty('reason');
            expect(entry).toHaveProperty('created_at');
        });

        // Should include logs from both variants
        const reasons = history.map(h => h.reason).filter(Boolean);
        expect(reasons.some(r => r.includes('variant A'))).toBe(true);
        expect(reasons.some(r => r.includes('variant B'))).toBe(true);
    });

    it('getStockHistoryForProduct returns logs with usernames when user_id is set', async () => {
        const pid = await insertProduct({ product_name: `History User ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `HIST-USER-${Date.now()}` });

        // Use a real user ID from the DB
        const { rows: users } = await db.query(
            'SELECT usersid FROM users LIMIT 1'
        );
        const userId = users[0]?.usersid || null;

        await ProductModel.updateStock(vid, 200, 10, userId, 'Admin adjustment');

        const history = await StockLogModel.getStockHistoryForProduct(pid);
        const logWithUser = history.find(l => l.user_id === userId);
        expect(logWithUser).toBeDefined();
        expect(logWithUser.user_name).toBeDefined();
    });

    it('getStockHistoryForProduct returns empty array for product with no stock', async () => {
        const pid = await insertProduct({ product_name: `Empty History ${TEST_MARKER}` });

        const history = await StockLogModel.getStockHistoryForProduct(pid);
        expect(history).toHaveLength(0);
    });

    it('getStockHistoryForProduct returns empty array for non-existent product', async () => {
        const history = await StockLogModel.getStockHistoryForProduct(NONEXISTENT_ID);
        expect(history).toHaveLength(0);
    });

    it('getStockHistoryForProduct works with product-level stock (variantId IS NULL)', async () => {
        const pid = await insertProduct({ product_name: `PLevel Hist ${TEST_MARKER}` });

        // Create product-level stock via updateProductStock, which also creates an ADJUST log
        await ProductModel.updateProductStock(pid, 500, 50, null, 'Initial product-level stock');

        const history = await StockLogModel.getStockHistoryForProduct(pid);
        expect(history.length).toBeGreaterThanOrEqual(1);
        expect(history[0].change_type).toBe('ADJUST');
        expect(parseInt(history[0].quantity)).toBe(500);
        expect(history[0].reason).toContain('product-level');
    });

    it('createStockLog rejects invalid change_type (DB constraint)', async () => {
        const pid = await insertProduct({ product_name: `Bad Change ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `BAD-CHG-${Date.now()}` });
        await ProductModel.updateStock(vid, 10, 5);
        const stock = await ProductModel.getStock(vid);

        // The DB has a CHECK constraint on stocklog.changetype
        await expect(StockLogModel.createStockLog({
            stock_id: stock.stock_id,
            change_type: 'INVALID_TYPE',
            quantity: 5,
            reason: 'Bad type test',
        })).rejects.toThrow();
    });

    it('getStockHistoryForProduct returns logs in reverse chronological order', async () => {
        const pid = await insertProduct({ product_name: `History Order ${TEST_MARKER}` });
        const vid = await ProductModel.createVariant({ product_id: pid, sku: `HIST-ORD-${Date.now()}` });

        await ProductModel.updateStock(vid, 10, 5, null, 'First entry');
        await ProductModel.incrementStock(vid, 5, null, 'Second entry');
        await ProductModel.incrementStock(vid, 3, null, 'Third entry');

        const history = await StockLogModel.getStockHistoryForProduct(pid);
        expect(history.length).toBeGreaterThanOrEqual(3);

        // Verify descending order by checking timestamps
        for (let i = 1; i < history.length; i++) {
            const prev = new Date(history[i - 1].created_at).getTime();
            const curr = new Date(history[i].created_at).getTime();
            expect(prev).toBeGreaterThanOrEqual(curr);
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE PRODUCT OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Complete product operations — real database', () => {
    it('productExists works correctly', async () => {
        const id = await insertProduct({ product_name: `Exists ${TEST_MARKER}` });
        expect(await ProductModel.productExists(id)).toBe(true);
        expect(await ProductModel.productExists(NONEXISTENT_ID)).toBe(false);
    });

    it('getProductById returns tags field from view_products', async () => {
        const id = await insertProduct({
            product_name: `Tags Field ${TEST_MARKER}`,
            tags: [TEST_MARKER, 'tag_a', 'tag_b'],
        });

        const product = await ProductModel.getProductById(id);
        expect(product.tags).toBeDefined();
        expect(Array.isArray(product.tags)).toBe(true);
        expect(product.tags).toContain('tag_a');
        expect(product.tags).toContain('tag_b');
    });

    it('getAllProducts returns all products', async () => {
        await insertProduct({ product_name: `All Products ${TEST_MARKER}` });

        const all = await ProductModel.getAllProducts();
        expect(all.length).toBeGreaterThanOrEqual(1);
        expect(all[0]).toHaveProperty('product_id');
        expect(all[0]).toHaveProperty('product_name');
        expect(all[0]).toHaveProperty('tags');
    });

    it('getProductsByCategory returns products in the test category', async () => {
        await insertProduct({
            product_name: `Category Test ${TEST_MARKER}`,
            category_id: CATEGORY_ID,
        });

        const result = await ProductModel.getProductsByCategory(
            (await db.query('SELECT categoryname FROM category WHERE categoriesid = $1', [CATEGORY_ID])).rows[0].categoryname
        );
        const filtered = result.filter(p => p.tags.includes(TEST_MARKER));
        expect(filtered.length).toBeGreaterThanOrEqual(1);
    });
});
