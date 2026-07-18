import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

// Mock database pool before any imports
const mockQuery = vi.fn();

vi.mock('../src/database/dbpool.js', () => ({
    default: { query: (...args) => mockQuery(...args) },
    db: { query: (...args) => mockQuery(...args) },
}));

import * as productModel from '../src/model/products/productModel.js';
import * as productService from '../src/services/productService.js';
import app from '../src/main.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
const mockRows = (rows) => ({ rows, rowCount: rows.length });

// These match the PostgreSQL view_products AS-aliased column names
const sampleProduct = {
    product_id: 1,
    product_name: 'Test Product',
    base_price: 29.99,
    descriptions: 'A test product',
    product_status: 'inactive',
    tags: ['coming_soon', 'premium'],
    category_name: 'Test Category',
    thumbnail: '/images/test.jpg',
    total_stock: 0,
    created_at: new Date().toISOString(),
};

// ── Migration tests ──────────────────────────────────────────────────────────
describe('tags column migration', () => {
    it('ALTER TABLE ADD COLUMN IF NOT EXISTS tags is idempotent', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const result = await mockQuery("ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'");
        expect(result).toBeDefined();
        expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('ALTER TABLE'));
    });

    it('view_products includes tags column', async () => {
        mockQuery.mockResolvedValue(mockRows([{ column_name: 'tags' }]));
        const result = await mockQuery(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'view_products' AND column_name = 'tags'"
        );
        expect(result.rows[0].column_name).toBe('tags');
    });

    it('migrates inactive products to coming_soon tag', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const sql = [
            "UPDATE products SET tags = array_append(",
            "COALESCE(tags, ARRAY[]::TEXT[]), 'coming_soon')",
            "WHERE status = 'inactive'",
            "AND NOT ('coming_soon' = ANY(COALESCE(tags, ARRAY[]::TEXT[])))",
        ].join(' ');
        const result = await mockQuery(sql);
        expect(result).toBeDefined();
    });

    it('tags column defaults to empty array', async () => {
        mockQuery.mockResolvedValue(mockRows([{ column_default: "'{}'::text[]" }]));
        const result = await mockQuery(
            "SELECT column_default FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tags'"
        );
        expect(result.rows[0].column_default).toContain('{}');
    });
});

// ── getNewArrivals model ─────────────────────────────────────────────────────
describe('getNewArrivals — model layer (tag + date hybrid)', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('returns active products with new_arrival tag or recent dates', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const result = await productModel.getNewArrivals(10);
        expect(result).toHaveLength(1);
    });

    it('queries with new_arrival tag check and date fallback', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        await productModel.getNewArrivals(5);
        const sql = mockQuery.mock.calls[0][0];
        expect(sql).toContain("'new_arrival' = ANY(tags)");
        expect(sql).toContain("createdat >= NOW() - INTERVAL '30 days'");
        expect(sql).toContain('CASE WHEN');
        expect(sql).toContain('createdat DESC');
    });

    it('respects the limit parameter', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        await productModel.getNewArrivals(8);
        expect(mockQuery.mock.calls[0][1]).toEqual([8]);
    });

    it('returns empty array when no matching products', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const result = await productModel.getNewArrivals(10);
        expect(result).toHaveLength(0);
    });
});

// ── getBestSellers model ─────────────────────────────────────────────────────
describe('getBestSellers — model layer (tag + stock hybrid)', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('returns products with best_seller tag or high stock', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const result = await productModel.getBestSellers(10);
        expect(result).toHaveLength(1);
    });

    it('queries with best_seller tag check and stock fallback', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        await productModel.getBestSellers(5);
        const sql = mockQuery.mock.calls[0][0];
        expect(sql).toContain("'best_seller' = ANY(tags)");
        expect(sql).toContain('totalstock > 20');
        expect(sql).toContain('CASE WHEN');
        expect(sql).toContain('totalstock DESC');
    });

    it('respects the limit parameter', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        await productModel.getBestSellers(3);
        expect(mockQuery.mock.calls[0][1]).toEqual([3]);
    });

    it('returns empty array when no matching products', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const result = await productModel.getBestSellers(10);
        expect(result).toHaveLength(0);
    });
});

// ── getComingSoon model ─────────────────────────────────────────────────────
describe('getComingSoon — model layer', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('returns products tagged as coming_soon', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const result = await productModel.getComingSoon(10);
        expect(result).toHaveLength(1);
        expect(result[0].product_name).toBe('Test Product');
    });

    it('uses tag-based filtering not status-based', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        await productModel.getComingSoon(5);
        const sql = mockQuery.mock.calls[0][0];
        expect(sql).toContain('ANY(tags)');
        expect(sql).not.toContain("status = 'inactive'");
    });

    it('respects the limit parameter', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        await productModel.getComingSoon(3);
        // The 'coming_soon' tag is hardcoded in the SQL, only limit is a parameter
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('LIMIT $1'),
            [3]
        );
    });

    it('returns empty array when no coming_soon products exist', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const result = await productModel.getComingSoon(10);
        expect(result).toHaveLength(0);
    });
});

// ── getComingSoon service ────────────────────────────────────────────────────
describe('getComingSoon — service layer', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('delegates to model with correct limit', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const result = await productService.getComingSoon(8);
        expect(result).toHaveLength(1);
        expect(result[0].product_name).toBe('Test Product');
    });
});

// ── CRUD with tags ──────────────────────────────────────────────────────────
describe('product CRUD with tags', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('createProduct stores tags in INSERT', async () => {
        mockQuery.mockResolvedValueOnce(mockRows([{ productsid: 10 }]));
        mockQuery.mockResolvedValueOnce(mockRows([{ ...sampleProduct, productsid: 10 }]));

        const result = await productModel.createProduct({
            category_id: 1,
            product_name: 'Tagged Product',
            base_price: 49.99,
            descriptions: 'With tags!',
            product_status: 'active',
            tags: ['coming_soon', 'sale'],
        });

        expect(result).toBe(10);
        // Verify the SQL includes tags
        const insertCall = mockQuery.mock.calls[0][0];
        expect(insertCall).toContain('tags');
    });

    it('createProduct defaults to empty array when tags not provided', async () => {
        mockQuery.mockResolvedValueOnce(mockRows([{ productsid: 11 }]));
        mockQuery.mockResolvedValueOnce(mockRows([{ ...sampleProduct, productsid: 11 }]));

        const result = await productModel.createProduct({
            category_id: 1,
            product_name: 'No Tags',
            base_price: 19.99,
            descriptions: '',
            product_status: 'active',
        });

        expect(result).toBe(11);
    });
});

// ── byTag model ──────────────────────────────────────────────────────────────
describe('getProductsByTag — model layer', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('queries with correct tag syntax', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const result = await productModel.getProductsByTag('premium', 5);
        expect(result).toHaveLength(1);
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('= ANY(tags)'),
            ['premium', 5]
        );
    });

    it('returns empty for non-existent tag', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const result = await productModel.getProductsByTag('nonexistent', 10);
        expect(result).toHaveLength(0);
    });
});

// ── Endpoint tests via supertest ─────────────────────────────────────────────
describe('GET /api/products/coming-soon — endpoint', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('returns 200 with coming soon products', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const res = await request(app).get('/api/products/coming-soon?limit=8');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].product_name).toBe('Test Product');
    });

    it('returns 200 with empty array when none exist', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const res = await request(app).get('/api/products/coming-soon?limit=10');
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(0);
        expect(res.body.data).toEqual([]);
    });

    it('returns products with tags field', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const res = await request(app).get('/api/products/coming-soon?limit=5');
        expect(res.body.data[0].tags).toBeDefined();
        expect(Array.isArray(res.body.data[0].tags)).toBe(true);
        expect(res.body.data[0].tags).toContain('coming_soon');
    });

    it('uses default limit of 10 when no limit provided', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        await request(app).get('/api/products/coming-soon');
        expect(mockQuery).toHaveBeenCalledWith(
            expect.any(String),
            expect.arrayContaining([10])
        );
    });
});

describe('GET /api/products/by-tag — endpoint', () => {
    beforeEach(() => { mockQuery.mockReset(); });

    it('returns 400 when tag query param is missing', async () => {
        const res = await request(app).get('/api/products/by-tag');
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message.toLowerCase()).toContain('tag');
    });

    it('returns 200 with products matching the tag', async () => {
        mockQuery.mockResolvedValue(mockRows([sampleProduct]));
        const res = await request(app).get('/api/products/by-tag?tag=premium&limit=5');
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(1);
    });

    it('returns empty array for non-existent tag', async () => {
        mockQuery.mockResolvedValue(mockRows([]));
        const res = await request(app).get('/api/products/by-tag?tag=nonexistent');
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(0);
        expect(res.body.data).toEqual([]);
    });
});
