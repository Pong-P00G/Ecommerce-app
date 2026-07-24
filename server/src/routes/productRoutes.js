import express from 'express';
import * as productController from '../controller/productController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';
import {
    validateCompleteProduct,
    validatePagination,
    validateProduct,
    validateCategory,
    validateVariant,
    validateStock,
    validateDiscount,
    validateBulkProducts,
    validate
} from '../middleware/productValidation.js';

const router = express.Router();

// ==================== COMPLETE PRODUCT OPERATIONS ====================

// @route   POST /api/products/complete
// @desc    Create complete product with images, variants, and stock (All in one)
// @access  Private/Admin
router.post(
    '/complete',
    protect,
    isAdmin,
    validateCompleteProduct,
    productController.createCompleteProduct
);

// @route   POST /api/products/bulk
// @desc    Bulk create products
// @access  Private/Admin
router.post(
    '/bulk',
    protect,
    isAdmin,
    validateBulkProducts,
    productController.bulkCreateProducts
);

// @route   GET /api/products/paginated
// @desc    Get paginated products with filters
// @access  Public
router.get(
    '/paginated',
    validatePagination,
    productController.getPaginatedProducts
);

// ==================== PUBLIC PRODUCT ROUTES ====================

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', productController.searchProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

// @route   GET /api/products/new-arrivals
// @desc    Get newest products
// @access  Public
router.get('/new-arrivals', productController.getNewArrivals);

// @route   GET /api/products/coming-soon
// @desc    Get upcoming products
// @access  Public
router.get('/coming-soon', productController.getComingSoon);

// @route   GET /api/products/best-sellers
// @desc    Get best-selling products
// @access  Public
router.get('/best-sellers', productController.getBestSellers);

// @route   GET /api/products/by-tag
// @desc    Get products by tag (e.g. ?tag=coming_soon&limit=10)
// @access  Public
router.get('/by-tag', productController.getProductsByTag);

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', productController.getProductsByCategory);

// ==================== CATEGORY ROUTES ====================

// @route   GET /api/products/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', productController.getAllCategories);

// @route   GET /api/products/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/categories/:id', productController.getCategoryById);

// @route   POST /api/products/categories
// @desc    Create new category
// @access  Private/Admin
router.post('/categories', protect, isAdmin, validateCategory, validate, productController.createCategory);

// @route   PUT /api/products/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put('/categories/:id', protect, isAdmin, validateCategory, validate, productController.updateCategory);

// @route   DELETE /api/products/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/categories/:id', protect, isAdmin, productController.deleteCategory);

// @route   GET /api/products/discounts
// @desc    Get all discounts across all products with product info
// @access  Private/Admin
// NOTE: Must be defined BEFORE GET /:id to avoid route conflict
router.get('/discounts', protect, isAdmin, productController.getAllDiscounts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   GET /api/products/:id/variants
// @desc    Get product variants
// @access  Public
router.get('/:id/variants', productController.getProductVariants);

// @route   GET /api/products/:id/images
// @desc    Get product images
// @access  Public
router.get('/:id/images', productController.getProductImages);

// @route   GET /api/products/:id/discounts
// @desc    Get product discounts
// @access  Public
router.get('/:id/discounts', productController.getProductDiscounts);

// @route   GET /api/products/:id/stock
// @desc    Get product-level stock (variantId IS NULL)
// @access  Public
router.get('/:id/stock', productController.getProductStock);

// @route   PUT /api/products/:id/stock
// @desc    Upsert product-level stock
// @access  Private/Admin
router.put('/:id/stock', protect, isAdmin, productController.updateProductStock);

// @route   GET /api/products/:id/discount/active
// @desc    Get active discount for product
// @access  Public
router.get('/:id/discount/active', productController.getActiveDiscount);

// ==================== ADMIN PRODUCT ROUTES ====================

// @route   POST /api/products
// @desc    Create new product (Basic - without images/variants)
// @access  Private/Admin
router.post('/', protect, isAdmin, validateProduct, validate, productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update product basic fields (name, price, status, description, tags, category)
//         Does NOT touch images, variants, or stock.
// @access  Private/Admin
router.put('/:id', protect, isAdmin, validateProduct, validate, productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete(
    '/:id',
    protect,
    isAdmin,
    productController.deleteProduct
);

// @route   POST /api/products/:id/images
// @desc    Add product image
// @access  Private/Admin
router.post('/:id/images', protect, isAdmin, productController.addProductImage);

// @route   DELETE /api/products/:id/images/:imageId
// @desc    Delete product image
// @access  Private/Admin
router.delete('/:id/images/:imageId', protect, isAdmin, productController.deleteProductImage);

// @route   PUT /api/products/:id/images/:imageId/set-main
// @desc    Set main image
// @access  Private/Admin
router.put('/:id/images/:imageId/set-main', protect, isAdmin, productController.setMainImage);

// @route   POST /api/products/:id/discount
// @desc    Apply discount to product
// @access  Private/Admin
router.post('/:id/discount', protect, isAdmin, validateDiscount, validate, productController.applyDiscount);

// @route   PUT /api/products/discount/:discountId
// @desc    Update discount
// @access  Private/Admin
router.put('/discount/:discountId', protect, isAdmin, validateDiscount, validate, productController.updateDiscount);

// @route   DELETE /api/products/discount/:discountId
// @desc    Delete discount
// @access  Private/Admin
router.delete(
    '/discount/:discountId',
    protect,
    isAdmin,
    productController.deleteDiscount
);

// ==================== VARIANT ROUTES ====================

// @route   GET /api/variants/:variantId
// @desc    Get variant by ID
// @access  Public
router.get('/variants/:variantId', productController.getVariantById);

// @route   GET /api/variants/:variantId/stock
// @desc    Get stock for variant
// @access  Public
router.get('/variants/:variantId/stock', productController.getStock);

// @route   POST /api/variants
// @desc    Create new variant
// @access  Private/Admin
router.post('/variants', protect, isAdmin, validateVariant, validate, productController.createVariant);

// @route   PUT /api/variants/:variantId
// @desc    Update variant
// @access  Private/Admin
router.put('/variants/:variantId', protect, isAdmin, validateVariant, validate, productController.updateVariant);

// @route   DELETE /api/variants/:variantId
// @desc    Delete variant
// @access  Private/Admin
router.delete('/variants/:variantId', protect, isAdmin, productController.deleteVariant);

// @route   PUT /api/variants/:variantId/stock
// @desc    Update stock quantity
// @access  Private/Admin
router.put('/variants/:variantId/stock', protect, isAdmin, validateStock, validate, productController.updateStock);

// @route   POST /api/variants/:variantId/stock/increment
// @desc    Increment stock
// @access  Private/Admin
router.post('/variants/:variantId/stock/increment', protect, isAdmin, productController.incrementStock);

// @route   POST /api/variants/:variantId/stock/decrement
// @desc    Decrement stock
// @access  Private/Admin
router.post('/variants/:variantId/stock/decrement', protect, isAdmin, productController.decrementStock);

// @route   GET /api/variants/stock/low
// @desc    Get low stock products
// @access  Private/Admin
router.get('/stock/low', protect, isAdmin, productController.getLowStockProducts);

// @route   GET /api/products/:id/stock/history
// @desc    Get stock change history for a product
// @desc    IMPORTANT: must be defined AFTER /variants/:variantId/stock to avoid route conflict
// @access  Private/Admin
router.get('/:id/stock/history', protect, isAdmin, productController.getStockHistory);

// @route   POST /api/products/stock/bulk-update
// @desc    Bulk update stock for multiple products
// @access  Private/Admin
router.post('/stock/bulk-update', protect, isAdmin, productController.bulkUpdateStock);

export default router;