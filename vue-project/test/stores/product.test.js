import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useProductStore } from '../../src/stores/product.js';

// ── Mock productAPI ────────────────────────────────────────────────────────────
vi.mock('../../src/api/products/productApi.js', () => {
    const mockProductAPI = {
        getAllProducts: vi.fn(),
        getPaginatedProduct: vi.fn(),
        searchProducts: vi.fn(),
        getProductById: vi.fn(),
        getProductsByCategory: vi.fn(),
        getFeaturedProducts: vi.fn(),
        getNewArrivals: vi.fn(),
        getComingSoon: vi.fn(),
        getBestSellers: vi.fn(),
        getProductsByTag: vi.fn(),
        createCompleteProduct: vi.fn(),
        createProduct: vi.fn(),
        updateProduct: vi.fn(),
        deleteProduct: vi.fn(),
        bulkCreateProducts: vi.fn(),
    };
    return { productAPI: mockProductAPI };
});

vi.mock('../../src/api/products/categoryApi.js', () => {
    const mockCategoryAPI = {
        getAllCategories: vi.fn(),
        getCategoryById: vi.fn(),
        createCategory: vi.fn(),
        updateCategory: vi.fn(),
        deleteCategory: vi.fn(),
    };
    return { categoryAPI: mockCategoryAPI };
});

let productAPI;
let categoryAPI;

beforeEach(async () => {
    setActivePinia(createPinia());
    productAPI = (await import('../../src/api/products/productApi.js')).productAPI;
    categoryAPI = (await import('../../src/api/products/categoryApi.js')).categoryAPI;
});

// ── Mock data (uses REAL backend field names) ──────────────────────────────────

const mockProducts = [
    {
        product_id: 1,
        product_name: 'iPhone 15 Pro',
        base_price: 999.00,
        descriptions: 'Premium smartphone with titanium design',
        product_status: 'active',
        tags: ['premium', 'new_arrival'],
        category_name: 'Smartphones',
        thumbnail: '/images/iphone.jpg',
        total_stock: 50,
        created_at: '2026-07-01T00:00:00Z',
    },
    {
        product_id: 2,
        product_name: 'Sony WH-1000XM5',
        base_price: 348.00,
        descriptions: 'Noise canceling wireless headphones',
        product_status: 'inactive',
        tags: ['coming_soon', 'premium'],
        category_name: 'Audio',
        thumbnail: '/images/sony.jpg',
        total_stock: 0,
        created_at: '2026-07-05T00:00:00Z',
    },
    {
        product_id: 3,
        product_name: 'Nike Air Max',
        base_price: 129.99,
        descriptions: 'Classic sneakers for everyday wear',
        product_status: 'active',
        tags: ['best_seller'],
        category_name: 'Footwear',
        thumbnail: '/images/nike.jpg',
        total_stock: 100,
        created_at: '2026-06-15T00:00:00Z',
    },
    {
        product_id: 4,
        product_name: 'Organic Green Tea',
        base_price: 12.99,
        descriptions: '20 bags per box',
        product_status: 'active',
        tags: [],
        category_name: 'Food & Beverages',
        thumbnail: '/images/tea.jpg',
        total_stock: 200,
        created_at: '2026-05-01T00:00:00Z',
    },
    {
        product_id: 5,
        product_name: 'iPhone 16 Pro Max',
        base_price: 1199.00,
        descriptions: 'Apple iPhone 16 Pro Max with A18 Pro chip, 48MP Fusion camera system, and all-day battery life.',
        product_status: 'active',
        tags: ['new_arrival', 'best_seller', 'premium'],
        category_name: 'Smartphones',
        thumbnail: '/images/iphone16promax-natural-titanium.svg',
        total_stock: 138,
        created_at: '2026-07-16T00:00:00Z',
    },
];

/** A full product detail response as returned by GET /api/products/:id */
const mockProductDetail = {
    ...mockProducts[0],
    images: [
        { image_id: 1, image_url: '/images/iphone-1.jpg', is_main: true },
        { image_id: 2, image_url: '/images/iphone-2.jpg', is_main: false },
    ],
    variants: [
        { variant_id: 1, sku: 'IP15P-NT', variant_color: 'Natural Titanium', quantity: 25, reorder_level: 5 },
        { variant_id: 2, sku: 'IP15P-BK', variant_color: 'Black Titanium', quantity: 15, reorder_level: 3 },
    ],
};

/** A full product detail response for iPhone 16 Pro Max with color + storage variants */
const mockProductDetailIP16PM = {
    ...mockProducts[4],
    images: [
        { image_id: 10, image_url: '/images/iphone16promax-natural-titanium.svg', is_main: true },
        { image_id: 11, image_url: '/images/iphone16promax-desert-titanium.svg', is_main: false },
        { image_id: 12, image_url: '/images/iphone16promax-white-titanium.svg', is_main: false },
    ],
    variants: [
        { variant_id: 10, sku: 'IP16PM-NT-256', variant_color: 'Natural Titanium', variant_storage: '256GB', quantity: 30, reorder_level: 5 },
        { variant_id: 11, sku: 'IP16PM-NT-512', variant_color: 'Natural Titanium', variant_storage: '512GB', quantity: 20, reorder_level: 5 },
        { variant_id: 12, sku: 'IP16PM-NT-1T',  variant_color: 'Natural Titanium', variant_storage: '1TB',   quantity: 10, reorder_level: 3 },
        { variant_id: 13, sku: 'IP16PM-DT-256', variant_color: 'Desert Titanium', variant_storage: '256GB', quantity: 25, reorder_level: 5 },
        { variant_id: 14, sku: 'IP16PM-DT-512', variant_color: 'Desert Titanium', variant_storage: '512GB', quantity: 15, reorder_level: 5 },
        { variant_id: 15, sku: 'IP16PM-DT-1T',  variant_color: 'Desert Titanium', variant_storage: '1TB',   quantity: 8,  reorder_level: 3 },
        { variant_id: 16, sku: 'IP16PM-WT-256', variant_color: 'White Titanium',  variant_storage: '256GB', quantity: 18, reorder_level: 5 },
        { variant_id: 17, sku: 'IP16PM-BT-512', variant_color: 'Black Titanium',  variant_storage: '512GB', quantity: 12, reorder_level: 5 },
    ],
};

const mockPaginatedResponse = {
    page: 1,
    pageSize: 10,
    totalItems: 5,
    totalPages: 1,
    items: mockProducts,
};

const mockApiResponse = (data) => ({
    success: true,
    count: data.length,
    data,
});

const mockEmptyResponse = { success: true, count: 0, data: [] };

// ════════════════════════════════════════════════════════════════════════════════
//  FIELD MAPPING TESTS — verify backend fields are preserved exactly
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — fetchAllProducts field mapping', () => {
    it('preserves all backend fields including thumbnail, base_price, descriptions', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        await store.fetchAllProducts();

        expect(store.products).toHaveLength(5);

        // ✅ Field: thumbnail (NOT main_image)
        expect(store.products[0].thumbnail).toBe('/images/iphone.jpg');
        expect(store.products[1].thumbnail).toBe('/images/sony.jpg');

        // ✅ Field: base_price (NOT final_price)
        expect(store.products[0].base_price).toBe(999.00);
        expect(store.products[2].base_price).toBe(129.99);

        // ✅ Field: descriptions (NOT product_description)
        expect(store.products[0].descriptions).toBe('Premium smartphone with titanium design');
        expect(store.products[3].descriptions).toBe('20 bags per box');

        // ✅ Field: total_stock (for deriving stock status in views)
        expect(store.products[0].total_stock).toBe(50);
        expect(store.products[1].total_stock).toBe(0);

        // ✅ Field: tags (badge detection)
        expect(store.products[0].tags).toEqual(['premium', 'new_arrival']);
        expect(store.products[2].tags).toEqual(['best_seller']);
        expect(store.products[3].tags).toEqual([]);

        // ✅ Field: product_status
        expect(store.products[0].product_status).toBe('active');
        expect(store.products[1].product_status).toBe('inactive');

        // ✅ Core identifiers preserved
        expect(store.products[0].product_id).toBe(1);
        expect(store.products[0].product_name).toBe('iPhone 15 Pro');
        expect(store.products[0].category_name).toBe('Smartphones');
        expect(store.products[0].created_at).toBe('2026-07-01T00:00:00Z');
    });

    it('handles raw array response format', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockProducts);

        const store = useProductStore();
        await store.fetchAllProducts();

        expect(store.products).toHaveLength(5);
        expect(store.products[0].thumbnail).toBe('/images/iphone.jpg');
        expect(store.products[0].base_price).toBe(999.00);
    });

    it('handles response with data array but no success wrapper', async () => {
        productAPI.getAllProducts.mockResolvedValue({ data: mockProducts });

        const store = useProductStore();
        await store.fetchAllProducts();

        expect(store.products).toHaveLength(5);
        expect(store.products[0].product_name).toBe('iPhone 15 Pro');
    });

    it('sets empty array when response format is unrecognized', async () => {
        productAPI.getAllProducts.mockResolvedValue({ success: true });

        const store = useProductStore();
        await store.fetchAllProducts();

        expect(store.products).toEqual([]);
    });

    it('handles fields that might be missing from API', async () => {
        const partialProduct = {
            product_id: 5,
            product_name: 'Minimal Product',
            // deliberately missing: thumbnail, descriptions, tags, total_stock
        };
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse([partialProduct]));

        const store = useProductStore();
        await store.fetchAllProducts();

        expect(store.products).toHaveLength(1);
        // Missing fields should be undefined (not crash)
        expect(store.products[0].thumbnail).toBeUndefined();
        expect(store.products[0].descriptions).toBeUndefined();
        expect(store.products[0].tags).toBeUndefined();
        expect(store.products[0].total_stock).toBeUndefined();
        // Present fields should still work
        expect(store.products[0].product_id).toBe(5);
        expect(store.products[0].product_name).toBe('Minimal Product');
    });

    it('handles null values gracefully', async () => {
        const productWithNulls = {
            product_id: 6,
            product_name: 'Null Fields Product',
            base_price: null,
            descriptions: null,
            thumbnail: null,
            total_stock: null,
            tags: null,
        };
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse([productWithNulls]));

        const store = useProductStore();
        await store.fetchAllProducts();

        expect(store.products).toHaveLength(1);
        expect(store.products[0].base_price).toBeNull();
        expect(store.products[0].descriptions).toBeNull();
        expect(store.products[0].total_stock).toBeNull();
    });

    it('sets loading true during fetch and false after', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        const fetchPromise = store.fetchAllProducts();

        // During fetch, loading should be true
        expect(store.loading).toBe(true);

        await fetchPromise;

        // After fetch, loading should be false
        expect(store.loading).toBe(false);
    });

    it('sets error on API failure and clears loading', async () => {
        productAPI.getAllProducts.mockRejectedValue(new Error('Database error'));

        const store = useProductStore();
        const result = await store.fetchAllProducts();

        expect(result.success).toBe(false);
        expect(result.error).toBe('Database error');
        expect(store.error).toBe('Database error');
        expect(store.loading).toBe(false);
        expect(store.products).toHaveLength(0);
    });

    it('extracts error message from Axios-style error response', async () => {
        const axiosError = { response: { data: { message: 'Server error' } } };
        productAPI.getAllProducts.mockRejectedValue(axiosError);

        const store = useProductStore();
        const result = await store.fetchAllProducts();

        expect(result.error).toBe('Server error');
        expect(store.error).toBe('Server error');
    });

    it('falls back to generic error message when none provided', async () => {
        productAPI.getAllProducts.mockRejectedValue({});

        const store = useProductStore();
        const result = await store.fetchAllProducts();

        expect(result.error).toBe('Failed to fetch products');
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  PRODUCT DETAIL — nested images & variants
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — fetchProductById (detail with images & variants)', () => {
    it('stores the full product detail with images and variants arrays', async () => {
        productAPI.getProductById.mockResolvedValue({
            success: true,
            data: mockProductDetail,
        });

        const store = useProductStore();
        const result = await store.fetchProductById(1);

        expect(result.success).toBe(true);
        expect(result.data.product_id).toBe(1);

        // ✅ images array preserved
        expect(result.data.images).toHaveLength(2);
        expect(result.data.images[0].image_url).toBe('/images/iphone-1.jpg');
        expect(result.data.images[0].is_main).toBe(true);

        // ✅ variants array preserved
        expect(result.data.variants).toHaveLength(2);
        expect(result.data.variants[0].sku).toBe('IP15P-NT');
        expect(result.data.variants[0].variant_color).toBe('Natural Titanium');
        expect(result.data.variants[0].quantity).toBe(25);

        // ✅ currentProduct in store matches
        expect(store.currentProduct.product_name).toBe('iPhone 15 Pro');
        expect(store.currentProduct.images).toEqual(mockProductDetail.images);
        expect(store.currentProduct.variants).toEqual(mockProductDetail.variants);
    });

    it('handles product detail with empty images array', async () => {
        const productNoImages = { ...mockProductDetail, images: [], variants: mockProductDetail.variants };
        productAPI.getProductById.mockResolvedValue({
            success: true,
            data: productNoImages,
        });

        const store = useProductStore();
        const result = await store.fetchProductById(2);

        expect(result.success).toBe(true);
        expect(result.data.images).toEqual([]);
        expect(result.data.variants).toHaveLength(2);
    });

    it('handles product detail with empty variants array', async () => {
        const productNoVariants = { ...mockProductDetail, images: mockProductDetail.images, variants: [] };
        productAPI.getProductById.mockResolvedValue({
            success: true,
            data: productNoVariants,
        });

        const store = useProductStore();
        const result = await store.fetchProductById(3);

        expect(result.success).toBe(true);
        expect(result.data.images).toHaveLength(2);
        expect(result.data.variants).toEqual([]);
    });

    it('handles 404 product not found', async () => {
        productAPI.getProductById.mockRejectedValue(new Error('Product not found'));

        const store = useProductStore();
        const result = await store.fetchProductById(999);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Product not found');
        expect(store.currentProduct).toBeNull();
    });

    it('handles raw response without success wrapper', async () => {
        productAPI.getProductById.mockResolvedValue({ data: mockProductDetail });

        const store = useProductStore();
        const result = await store.fetchProductById(1);

        expect(result.success).toBe(true);
        expect(result.data.product_id).toBe(1);
        expect(store.currentProduct.product_id).toBe(1);
    });

    it('handles response where data is the product object directly', async () => {
        productAPI.getProductById.mockResolvedValue(mockProductDetail);

        const store = useProductStore();
        const result = await store.fetchProductById(1);

        expect(result.success).toBe(true);
        expect(result.data.product_id).toBe(1);
        expect(store.currentProduct.product_id).toBe(1);
    });

    it('sets loading true during fetch and false after', async () => {
        productAPI.getProductById.mockResolvedValue({
            success: true,
            data: mockProductDetail,
        });

        const store = useProductStore();
        const fetchPromise = store.fetchProductById(1);

        expect(store.loading).toBe(true);
        await fetchPromise;
        expect(store.loading).toBe(false);
    });

    it('clears previous error before new fetch', async () => {
        productAPI.getProductById
            .mockRejectedValueOnce(new Error('Previous error'))
            .mockResolvedValueOnce({ success: true, data: mockProductDetail });

        const store = useProductStore();
        await store.fetchProductById(999);
        expect(store.error).toBe('Previous error');

        await store.fetchProductById(1);
        expect(store.error).toBeNull();
        expect(store.currentProduct.product_id).toBe(1);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  FETCH FEATURED PRODUCTS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — fetchFeaturedProducts field mapping', () => {
    it('stores featured products with correct fields', async () => {
        productAPI.getFeaturedProducts.mockResolvedValue(
            mockApiResponse([mockProducts[0], mockProducts[2]])
        );

        const store = useProductStore();
        const result = await store.fetchFeaturedProducts(8);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);
        expect(store.featuredProducts).toHaveLength(2);

        // Verify fields
        expect(store.featuredProducts[0].thumbnail).toBe('/images/iphone.jpg');
        expect(store.featuredProducts[0].base_price).toBe(999.00);
        expect(store.featuredProducts[0].descriptions).toBe('Premium smartphone with titanium design');
        expect(store.featuredProducts[0].tags).toContain('premium');

        expect(productAPI.getFeaturedProducts).toHaveBeenCalledWith(8);
    });

    it('handles raw array response', async () => {
        productAPI.getFeaturedProducts.mockResolvedValue([mockProducts[0]]);

        const store = useProductStore();
        const result = await store.fetchFeaturedProducts(5);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(store.featuredProducts).toHaveLength(1);
    });

    it('handles empty response', async () => {
        productAPI.getFeaturedProducts.mockResolvedValue(mockEmptyResponse);

        const store = useProductStore();
        const result = await store.fetchFeaturedProducts(5);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(0);
        expect(store.featuredProducts).toHaveLength(0);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  FETCH PRODUCTS BY CATEGORY
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — fetchProductsByCategory field mapping', () => {
    it('stores products filtered by category with correct fields', async () => {
        productAPI.getProductsByCategory.mockResolvedValue(
            mockApiResponse([mockProducts[0]])
        );

        const store = useProductStore();
        const result = await store.fetchProductsByCategory('Smartphones');

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(store.products).toHaveLength(1);
        expect(store.products[0].category_name).toBe('Smartphones');
        expect(store.products[0].base_price).toBe(999.00);
        expect(store.products[0].thumbnail).toBe('/images/iphone.jpg');
        expect(productAPI.getProductsByCategory).toHaveBeenCalledWith('Smartphones');
    });

    it('sets loading state correctly', async () => {
        productAPI.getProductsByCategory.mockResolvedValue(
            mockApiResponse([mockProducts[0]])
        );

        const store = useProductStore();
        const fetchPromise = store.fetchProductsByCategory('Audio');

        expect(store.loading).toBe(true);
        await fetchPromise;
        expect(store.loading).toBe(false);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  FETCH PAGINATED PRODUCTS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — fetchPaginatedProducts', () => {
    it('stores paginated response with items array', async () => {
        productAPI.getPaginatedProduct.mockResolvedValue(mockPaginatedResponse);

        const store = useProductStore();
        const result = await store.fetchPaginatedProducts(1, 10);

        expect(result.success).toBe(true);
        expect(store.paginatedProducts.page).toBe(1);
        expect(store.paginatedProducts.totalItems).toBe(5);
        expect(store.paginatedProducts.totalPages).toBe(1);
        expect(store.paginatedProducts.items).toHaveLength(5);

        // Fields preserved in paginated items
        expect(store.paginatedProducts.items[0].thumbnail).toBe('/images/iphone.jpg');
        expect(store.paginatedProducts.items[0].base_price).toBe(999.00);
    });

    it('handles response as data array (format 2)', async () => {
        productAPI.getPaginatedProduct.mockResolvedValue({
            data: [mockProducts[0], mockProducts[1]],
        });

        const store = useProductStore();
        const result = await store.fetchPaginatedProducts(1, 10);

        expect(result.success).toBe(true);
        expect(store.paginatedProducts.totalItems).toBe(2);
        expect(store.paginatedProducts.items).toHaveLength(2);
        expect(store.paginatedProducts.items[0].product_name).toBe('iPhone 15 Pro');
    });

    it('sets loading and error on API failure', async () => {
        productAPI.getPaginatedProduct.mockRejectedValue(new Error('Pagination failed'));

        const store = useProductStore();
        const result = await store.fetchPaginatedProducts(1, 10);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Pagination failed');
        expect(store.loading).toBe(false);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  SEARCH PRODUCTS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — searchProducts', () => {
    it('stores search results with correct fields', async () => {
        productAPI.searchProducts.mockResolvedValue({
            success: true,
            data: [mockProducts[2]],
        });

        const store = useProductStore();
        const result = await store.searchProducts({ search: 'Nike', category: 'Footwear' });

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(store.products).toHaveLength(1);
        expect(store.products[0].product_name).toBe('Nike Air Max');
        expect(store.products[0].base_price).toBe(129.99);
        expect(store.products[0].tags).toContain('best_seller');
    });

    it('handles raw array response', async () => {
        productAPI.searchProducts.mockResolvedValue([mockProducts[2]]);

        const store = useProductStore();
        const result = await store.searchProducts({ search: 'Nike' });

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
    });

    it('handles error', async () => {
        productAPI.searchProducts.mockRejectedValue(new Error('Search failed'));

        const store = useProductStore();
        const result = await store.searchProducts({ search: 'xyz' });

        expect(result.success).toBe(false);
        expect(result.error).toBe('Search failed');
        expect(store.loading).toBe(false);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  FECTH NEW ARRIVALS / COMING SOON / BEST SELLERS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — fetchComingSoon', () => {
    it('fetches and stores coming soon products on success', async () => {
        productAPI.getComingSoon.mockResolvedValue(
            mockApiResponse([mockProducts[1]]) // Only the inactive/coming_soon product
        );

        const store = useProductStore();
        const result = await store.fetchComingSoon(5);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(result.data[0].product_id).toBe(2);
        expect(result.data[0].tags).toContain('coming_soon');
        expect(store.comingSoon).toHaveLength(1);
        expect(productAPI.getComingSoon).toHaveBeenCalledWith(5);
    });

    it('stores empty array when API returns no coming soon products', async () => {
        productAPI.getComingSoon.mockResolvedValue(mockEmptyResponse);

        const store = useProductStore();
        const result = await store.fetchComingSoon(10);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(0);
        expect(store.comingSoon).toHaveLength(0);
    });

    it('handles raw array response format', async () => {
        productAPI.getComingSoon.mockResolvedValue([mockProducts[1]]);

        const store = useProductStore();
        const result = await store.fetchComingSoon(5);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(store.comingSoon).toHaveLength(1);
        expect(store.comingSoon[0].product_id).toBe(2);
    });

    it('handles error during fetch', async () => {
        productAPI.getComingSoon.mockRejectedValue(new Error('Network error'));

        const store = useProductStore();
        const result = await store.fetchComingSoon(5);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Network error');
        expect(store.comingSoon).toHaveLength(0);
    });

    it('handles API error response', async () => {
        const apiError = { response: { data: { message: 'Server error' } } };
        productAPI.getComingSoon.mockRejectedValue(apiError);

        const store = useProductStore();
        const result = await store.fetchComingSoon(5);

        expect(result.success).toBe(false);
        expect(store.comingSoon).toHaveLength(0);
    });

    it('preserves tag data in stored products', async () => {
        productAPI.getComingSoon.mockResolvedValue(mockApiResponse([mockProducts[1]]));

        const store = useProductStore();
        await store.fetchComingSoon(10);

        expect(store.comingSoon[0].tags).toBeDefined();
        expect(Array.isArray(store.comingSoon[0].tags)).toBe(true);
        expect(store.comingSoon[0].tags).toContain('coming_soon');
        expect(store.comingSoon[0].tags).toContain('premium');
    });
});

describe('productStore — fetchNewArrivals', () => {
    it('fetches and stores new arrivals', async () => {
        productAPI.getNewArrivals.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        const result = await store.fetchNewArrivals(8);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(5);
        expect(store.newArrivals).toHaveLength(5);
        expect(productAPI.getNewArrivals).toHaveBeenCalledWith(8);
    });

    it('handles empty response', async () => {
        productAPI.getNewArrivals.mockResolvedValue(mockEmptyResponse);

        const store = useProductStore();
        const result = await store.fetchNewArrivals(5);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(0);
        expect(store.newArrivals).toHaveLength(0);
    });

    it('handles network error', async () => {
        productAPI.getNewArrivals.mockRejectedValue(new Error('Network error'));

        const store = useProductStore();
        const result = await store.fetchNewArrivals(5);

        expect(result.success).toBe(false);
        expect(store.newArrivals).toHaveLength(0);
    });
});

describe('productStore — fetchBestSellers', () => {
    it('fetches and stores best sellers', async () => {
        productAPI.getBestSellers.mockResolvedValue(
            mockApiResponse([mockProducts[2], mockProducts[0]])
        );

        const store = useProductStore();
        const result = await store.fetchBestSellers(8);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);
        expect(store.bestSellers).toHaveLength(2);
        expect(store.bestSellers[0].product_id).toBe(3);
        expect(productAPI.getBestSellers).toHaveBeenCalledWith(8);
    });

    it('handles empty response', async () => {
        productAPI.getBestSellers.mockResolvedValue(mockEmptyResponse);

        const store = useProductStore();
        const result = await store.fetchBestSellers(5);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(0);
        expect(store.bestSellers).toHaveLength(0);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  GETTERS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — getters', () => {
    beforeEach(() => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));
    });

    it('getProducts returns all products', async () => {
        const store = useProductStore();
        expect(store.getProducts).toEqual([]);

        await store.fetchAllProducts();
        expect(store.getProducts).toHaveLength(5);
    });

    it('getProductById finds product by ID', async () => {
        const store = useProductStore();
        await store.fetchAllProducts();

        const product = store.getProductById(2);
        expect(product).toBeDefined();
        expect(product.product_name).toBe('Sony WH-1000XM5');
        expect(product.base_price).toBe(348.00);
        expect(product.thumbnail).toBe('/images/sony.jpg');
    });

    it('getProductById returns undefined for non-existent ID', async () => {
        const store = useProductStore();
        await store.fetchAllProducts();

        const product = store.getProductById(999);
        expect(product).toBeUndefined();
    });

    it('getProductsByCategory filters by category', async () => {
        const store = useProductStore();
        await store.fetchAllProducts();

        const footwear = store.getProductsByCategory('Footwear');
        expect(footwear).toHaveLength(1);
        expect(footwear[0].product_name).toBe('Nike Air Max');
    });

    it('getProductsByCategory returns empty array for unmatched category', async () => {
        const store = useProductStore();
        await store.fetchAllProducts();

        const result = store.getProductsByCategory('NonExistent');
        expect(result).toEqual([]);
    });

    it('getCurrentProduct returns null initially', () => {
        const store = useProductStore();
        expect(store.getCurrentProduct).toBeNull();
    });

    it('getCompleteProduct aliases currentProduct', () => {
        const store = useProductStore();
        expect(store.getCompleteProduct).toBe(store.currentProduct);
    });

    it('getFeaturedProducts returns empty array by default', () => {
        const store = useProductStore();
        expect(store.getFeaturedProducts).toEqual([]);
    });

    it('getNewArrivals returns empty array by default', () => {
        const store = useProductStore();
        expect(store.getNewArrivals).toEqual([]);
    });

    it('getComingSoon returns empty array by default', () => {
        const store = useProductStore();
        expect(store.getComingSoon).toEqual([]);
    });

    it('getBestSellers returns empty array by default', () => {
        const store = useProductStore();
        expect(store.getBestSellers).toEqual([]);
    });

    it('hasProducts returns false when paginated items empty', () => {
        const store = useProductStore();
        expect(store.hasProducts).toBe(false);
    });

    it('hasProducts returns true when paginated has items', async () => {
        productAPI.getPaginatedProduct.mockResolvedValue(mockPaginatedResponse);

        const store = useProductStore();
        await store.fetchPaginatedProducts(1, 10);
        expect(store.hasProducts).toBe(true);
    });

    it('getTotalPages returns 0 initially', () => {
        const store = useProductStore();
        expect(store.getTotalPages).toBe(0);
    });

    it('getTotalPages reflects paginated state', async () => {
        productAPI.getPaginatedProduct.mockResolvedValue(mockPaginatedResponse);

        const store = useProductStore();
        await store.fetchPaginatedProducts(1, 10);
        expect(store.getTotalPages).toBe(1);
    });

    it('getCategories returns empty array initially', () => {
        const store = useProductStore();
        expect(store.getCategories).toEqual([]);
    });

    it('getFilters returns default filters', () => {
        const store = useProductStore();
        expect(store.getFilters).toEqual({
            search: '',
            category: null,
            minPrice: null,
            maxPrice: null,
            status: 'active',
        });
    });

    it('isLoading reflects loading state', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        expect(store.isLoading).toBe(false);

        const fetchPromise = store.fetchAllProducts();
        expect(store.isLoading).toBe(true);
        await fetchPromise;
        expect(store.isLoading).toBe(false);
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  STATE MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — state management actions', () => {
    it('setFilters merges with existing filters', () => {
        const store = useProductStore();
        store.setFilters({ search: 'iPhone', category: 'Smartphones' });

        expect(store.filters.search).toBe('iPhone');
        expect(store.filters.category).toBe('Smartphones');
        // Defaults preserved
        expect(store.filters.minPrice).toBeNull();
        expect(store.filters.status).toBe('active');
    });

    it('setFilters overrides existing filter values', () => {
        const store = useProductStore();
        store.setFilters({ search: 'first' });
        store.setFilters({ search: 'second' });

        expect(store.filters.search).toBe('second');
    });

    it('clearFilters resets to defaults', () => {
        const store = useProductStore();
        store.setFilters({ search: 'test', category: 'Audio', minPrice: 10, maxPrice: 100 });

        store.clearFilters();

        expect(store.filters).toEqual({
            search: '',
            category: null,
            minPrice: null,
            maxPrice: null,
            status: 'active',
        });
    });

    it('setPage updates paginated page number', () => {
        const store = useProductStore();
        expect(store.paginatedProducts.page).toBe(1);

        store.setPage(3);
        expect(store.paginatedProducts.page).toBe(3);
    });

    it('setPageSize updates paginated page size', () => {
        const store = useProductStore();
        expect(store.paginatedProducts.pageSize).toBe(10);

        store.setPageSize(25);
        expect(store.paginatedProducts.pageSize).toBe(25);
    });

    it('clearError clears error message', () => {
        const store = useProductStore();
        store.error = 'Some error';

        store.clearError();
        expect(store.error).toBeNull();
    });

    it('clearSuccess clears success message', () => {
        const store = useProductStore();
        store.successMessage = 'Success!';

        store.clearSuccess();
        expect(store.successMessage).toBeNull();
    });

    it('clearMessages clears both error and success', () => {
        const store = useProductStore();
        store.error = 'Error!';
        store.successMessage = 'Success!';

        store.clearMessages();
        expect(store.error).toBeNull();
        expect(store.successMessage).toBeNull();
    });

    it('resetCurrentProduct sets currentProduct to null', () => {
        const store = useProductStore();
        store.currentProduct = { product_id: 1 };

        store.resetCurrentProduct();
        expect(store.currentProduct).toBeNull();
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  CRUD ACTIONS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — CRUD actions', () => {
    beforeEach(() => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));
    });

    describe('createCompleteProduct', () => {
        it('calls API and refreshes products list', async () => {
            const newProduct = { product_name: 'New Product', base_price: 49.99 };
            productAPI.createCompleteProduct.mockResolvedValue({
                success: true,
                data: { product_id: 5, ...newProduct },
            });
            productAPI.getPaginatedProduct.mockResolvedValue(mockPaginatedResponse);

            const store = useProductStore();
            const result = await store.createCompleteProduct(newProduct);

            expect(result.success).toBe(true);
            expect(productAPI.createCompleteProduct).toHaveBeenCalledWith(newProduct);
            expect(store.successMessage).toBe('Product created successfully!');
        });

        it('handles API error', async () => {
            productAPI.createCompleteProduct.mockRejectedValue(
                new Error('Validation failed')
            );

            const store = useProductStore();
            const result = await store.createCompleteProduct({});

            expect(result.success).toBe(false);
            expect(result.error).toBe('Validation failed');
        });
    });

    describe('updateProduct', () => {
        it('updates product in products list and currentProduct', async () => {
            const update = { product_name: 'Updated Name', base_price: 199.99 };
            productAPI.updateProduct.mockResolvedValue({
                success: true,
                data: { ...mockProducts[0], ...update },
            });

            const store = useProductStore();
            await store.fetchAllProducts();

            // Set as current product
            store.currentProduct = { ...mockProducts[0] };

            const result = await store.updateProduct(1, update);

            expect(result.success).toBe(true);
            // Updated in list
            expect(store.products[0].product_name).toBe('Updated Name');
            expect(store.products[0].base_price).toBe(199.99);
            // Updated in currentProduct
            expect(store.currentProduct.product_name).toBe('Updated Name');
            expect(store.successMessage).toBe('Product updated successfully!');
        });

        it('handles API error', async () => {
            productAPI.updateProduct.mockRejectedValue(new Error('Update failed'));

            const store = useProductStore();
            const result = await store.updateProduct(1, {});

            expect(result.success).toBe(false);
            expect(result.error).toBe('Update failed');
        });
    });

    describe('deleteProduct', () => {
        it('removes product from list and refreshes', async () => {
            productAPI.deleteProduct.mockResolvedValue({ success: true });
            productAPI.getPaginatedProduct.mockResolvedValue(mockPaginatedResponse);

            const store = useProductStore();
            await store.fetchAllProducts();
            expect(store.products).toHaveLength(5);

            // deleteProduct calls fetchPaginatedProducts which resets products, so we just verify the call
            const result = await store.deleteProduct(1);

            expect(result.success).toBe(true);
            expect(productAPI.deleteProduct).toHaveBeenCalledWith(1);
            expect(store.successMessage).toBe('Product deleted successfully!');
        });

        it('handles API error', async () => {
            productAPI.deleteProduct.mockRejectedValue(new Error('Delete failed'));

            const store = useProductStore();
            const result = await store.deleteProduct(999);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Delete failed');
        });
    });

    describe('bulkCreateProducts', () => {
        it('calls API and refreshes', async () => {
            const products = [{ product_name: 'A' }, { product_name: 'B' }];
            productAPI.bulkCreateProducts.mockResolvedValue({
                success: true,
                data: { created: 2, failed: 0 },
            });
            productAPI.getPaginatedProduct.mockResolvedValue(mockPaginatedResponse);

            const store = useProductStore();
            const result = await store.bulkCreateProducts(products);

            expect(result.success).toBe(true);
            expect(productAPI.bulkCreateProducts).toHaveBeenCalledWith(products);
            expect(store.successMessage).toContain('2 products created');
        });
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  CATEGORY ACTIONS
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — category actions', () => {
    beforeEach(() => {
        categoryAPI.getAllCategories.mockResolvedValue({ data: [
            { category_id: 1, name: 'Smartphones' },
            { category_id: 2, name: 'Audio' },
            { category_id: 3, name: 'Footwear' },
        ]});
    });

    it('fetchCategories stores categories', async () => {
        categoryAPI.getAllCategories.mockResolvedValue({ data: [
            { category_id: 1, name: 'Smartphones' },
        ]});

        const store = useProductStore();
        const result = await store.fetchCategories();

        expect(result.success).toBe(true);
        expect(store.categories).toHaveLength(1);
        expect(store.categories[0].name).toBe('Smartphones');
    });

    it('fetchCategories handles error', async () => {
        categoryAPI.getAllCategories.mockRejectedValue({
            response: { data: { message: 'Categories error' } },
        });

        const store = useProductStore();
        const result = await store.fetchCategories();

        expect(result.success).toBe(false);
        expect(store.error).toBe('Categories error');
    });
});

// ════════════════════════════════════════════════════════════════════════════════
//  IPHONE 16 PRO MAX — field mapping, detail, variants, tags, category
// ════════════════════════════════════════════════════════════════════════════════

describe('productStore — iPhone 16 Pro Max field mapping', () => {
    it('preserves all backend fields including premium $1,199 price point', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        await store.fetchAllProducts();

        const ip16pm = store.products[4];
        expect(ip16pm.product_name).toBe('iPhone 16 Pro Max');
        expect(ip16pm.base_price).toBe(1199.00);
        expect(ip16pm.descriptions).toContain('A18 Pro chip');
        expect(ip16pm.thumbnail).toBe('/images/iphone16promax-natural-titanium.svg');
        expect(ip16pm.total_stock).toBe(138);
        expect(ip16pm.product_status).toBe('active');
        expect(ip16pm.category_name).toBe('Smartphones');
        expect(ip16pm.created_at).toBe('2026-07-16T00:00:00Z');
    });

    it('has three tags: new_arrival, best_seller, premium', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        await store.fetchAllProducts();

        const tags = store.products[4].tags;
        expect(tags).toHaveLength(3);
        expect(tags).toContain('new_arrival');
        expect(tags).toContain('best_seller');
        expect(tags).toContain('premium');
    });

    it('appears in getProductsByCategory for Smartphones', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        await store.fetchAllProducts();

        const smartphones = store.getProductsByCategory('Smartphones');
        expect(smartphones).toHaveLength(2); // iPhone 15 Pro + iPhone 16 Pro Max
        expect(smartphones.map(p => p.product_name)).toContain('iPhone 16 Pro Max');
        // Both Smartphones products have the correct category and appropriate pricing
        expect(smartphones.every(p => p.category_name === 'Smartphones')).toBe(true);
    });

    it('is the highest-priced product in the catalog', async () => {
        productAPI.getAllProducts.mockResolvedValue(mockApiResponse(mockProducts));

        const store = useProductStore();
        await store.fetchAllProducts();

        const prices = store.products.map(p => p.base_price);
        const maxPrice = Math.max(...prices);
        expect(maxPrice).toBe(1199.00);
        expect(store.products[4].base_price).toBe(maxPrice);
    });

    it('shows in fetchNewArrivals due to new_arrival tag', async () => {
        productAPI.getNewArrivals.mockResolvedValue(
            mockApiResponse([mockProducts[0], mockProducts[4]])
        );

        const store = useProductStore();
        await store.fetchNewArrivals(10);

        expect(store.newArrivals).toHaveLength(2);
        expect(store.newArrivals.some(p => p.product_name === 'iPhone 16 Pro Max')).toBe(true);
        expect(productAPI.getNewArrivals).toHaveBeenCalledWith(10);
    });

    it('shows in fetchBestSellers due to best_seller tag', async () => {
        productAPI.getBestSellers.mockResolvedValue(
            mockApiResponse([mockProducts[2], mockProducts[4]])
        );

        const store = useProductStore();
        await store.fetchBestSellers(5);

        expect(store.bestSellers).toHaveLength(2);
        expect(store.bestSellers.some(p => p.product_id === 5)).toBe(true);
        expect(productAPI.getBestSellers).toHaveBeenCalledWith(5);
    });

    it('fetches iPhone 16 Pro Max detail with 3 images and 8 variants', async () => {
        productAPI.getProductById.mockResolvedValue({
            success: true,
            data: mockProductDetailIP16PM,
        });

        const store = useProductStore();
        const result = await store.fetchProductById(5);

        expect(result.success).toBe(true);
        expect(store.currentProduct.product_name).toBe('iPhone 16 Pro Max');
        expect(store.currentProduct.base_price).toBe(1199.00);

        // ✅ 3 images
        expect(store.currentProduct.images).toHaveLength(3);
        expect(store.currentProduct.images[0].image_url).toBe('/images/iphone16promax-natural-titanium.svg');
        expect(store.currentProduct.images[0].is_main).toBe(true);
        expect(store.currentProduct.images[1].image_url).toBe('/images/iphone16promax-desert-titanium.svg');
        expect(store.currentProduct.images[2].image_url).toBe('/images/iphone16promax-white-titanium.svg');

        // ✅ 8 variants across 4 colors × storage tiers
        expect(store.currentProduct.variants).toHaveLength(8);

        // Check specific variants exist
        const variantSkus = store.currentProduct.variants.map(v => v.sku);
        expect(variantSkus).toContain('IP16PM-NT-256');
        expect(variantSkus).toContain('IP16PM-NT-1T');
        expect(variantSkus).toContain('IP16PM-DT-512');
        expect(variantSkus).toContain('IP16PM-WT-256');
        expect(variantSkus).toContain('IP16PM-BT-512');

        // Check color + storage fields on variants
        const naturalTitaniumVariant = store.currentProduct.variants.find(v => v.sku === 'IP16PM-NT-256');
        expect(naturalTitaniumVariant.variant_color).toBe('Natural Titanium');
        expect(naturalTitaniumVariant.variant_storage).toBe('256GB');
        expect(naturalTitaniumVariant.quantity).toBe(30);
        expect(naturalTitaniumVariant.reorder_level).toBe(5);

        // Check 1TB variant has lower reorder level
        const oneTBVariant = store.currentProduct.variants.find(v => v.sku === 'IP16PM-DT-1T');
        expect(oneTBVariant.variant_storage).toBe('1TB');
        expect(oneTBVariant.variant_color).toBe('Desert Titanium');
        expect(oneTBVariant.quantity).toBe(8);
        expect(oneTBVariant.reorder_level).toBe(3);
    });

    it('preserves variant stock totals matching seed data', async () => {
        productAPI.getProductById.mockResolvedValue({
            success: true,
            data: mockProductDetailIP16PM,
        });

        const store = useProductStore();
        await store.fetchProductById(5);

        const totalVariantStock = store.currentProduct.variants
            .reduce((sum, v) => sum + v.quantity, 0);
        expect(totalVariantStock).toBe(138); // matches total_stock in mockProducts[4]

        // Natural Titanium variants = 30 + 20 + 10 = 60
        const ntStock = store.currentProduct.variants
            .filter(v => v.variant_color === 'Natural Titanium')
            .reduce((sum, v) => sum + v.quantity, 0);
        expect(ntStock).toBe(60);

        // Desert Titanium variants = 25 + 15 + 8 = 48
        const dtStock = store.currentProduct.variants
            .filter(v => v.variant_color === 'Desert Titanium')
            .reduce((sum, v) => sum + v.quantity, 0);
        expect(dtStock).toBe(48);
    });
});
