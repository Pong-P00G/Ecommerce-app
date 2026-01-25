import * as productService from '../services/productService.js';

// ==================== COMPLETE PRODUCT OPERATIONS ====================

/**
 * Create complete product with images, variants, and stock
 * POST /api/products/complete
 */
export const createCompleteProduct = async (req, res) => {
    try {
        const result = await productService.createCompleteProduct(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully with images, variants, and stock',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get paginated products
 * GET /api/products/paginated?page=1&pageSize=10
 */
export const getPaginatedProducts = async (req, res) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            search,
            category,
            minPrice,
            maxPrice,
            status
        } = req.query;

        const result = await productService.getPaginatedProducts(
            parseInt(page),
            parseInt(pageSize),
            {
                search,
                category,
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                status
            }
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Bulk create products
 * POST /api/products/bulk
 */
export const bulkCreateProducts = async (req, res) => {
    try {
        const { products } = req.body;
        
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: 'Products array is required'
            });
        }

        const result = await productService.bulkCreateProducts(products);
        
        res.status(201).json({
            success: true,
            message: `Bulk operation completed: ${result.created} created, ${result.failed} failed`,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== PRODUCT CONTROLLERS ====================

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const searchProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, status } = req.query;
        const products = await productService.searchProducts({
            search,
            category,
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            status
        });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const products = await productService.getProductsByCategory(req.params.category);
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const products = await productService.getFeaturedProducts(limit);
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== CATEGORY CONTROLLERS ====================

export const getAllCategories = async (req, res) => {
    try {
        const categories = await productService.getAllCategories();
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await productService.getCategoryById(req.params.id);
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await productService.createCategory(name);
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await productService.updateCategory(req.params.id, name);
        
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await productService.deleteCategory(req.params.id);
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== IMAGE CONTROLLERS ====================

export const getProductImages = async (req, res) => {
    try {
        const images = await productService.getProductImages(req.params.id);
        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addProductImage = async (req, res) => {
    try {
        const { image_url, is_main } = req.body;
        const image = await productService.addProductImage(
            req.params.id,
            image_url,
            is_main
        );
        
        res.status(201).json({
            success: true,
            message: 'Image added successfully',
            data: image
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProductImage = async (req, res) => {
    try {
        await productService.deleteProductImage(req.params.imageId);
        
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const setMainImage = async (req, res) => {
    try {
        await productService.setMainImage(req.params.imageId, req.params.id);
        
        res.json({
            success: true,
            message: 'Main image updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== VARIANT CONTROLLERS ====================

export const getProductVariants = async (req, res) => {
    try {
        const variants = await productService.getProductVariants(req.params.id);
        res.json({
            success: true,
            count: variants.length,
            data: variants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getVariantById = async (req, res) => {
    try {
        const variant = await productService.getVariantById(req.params.variantId);
        res.json({
            success: true,
            data: variant
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createVariant = async (req, res) => {
    try {
        const variant = await productService.createVariant(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Variant created successfully',
            data: variant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateVariant = async (req, res) => {
    try {
        const variant = await productService.updateVariant(req.params.variantId, req.body);
        
        res.json({
            success: true,
            message: 'Variant updated successfully',
            data: variant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteVariant = async (req, res) => {
    try {
        await productService.deleteVariant(req.params.variantId);
        
        res.json({
            success: true,
            message: 'Variant deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== STOCK CONTROLLERS ====================

export const getStock = async (req, res) => {
    try {
        const stock = await productService.getStock(req.params.variantId);
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { quantity, reorder_level } = req.body;
        const stock = await productService.updateStock(
            req.params.variantId,
            quantity,
            reorder_level
        );
        
        res.json({
            success: true,
            message: 'Stock updated successfully',
            data: stock
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const incrementStock = async (req, res) => {
    try {
        const { amount } = req.body;
        const stock = await productService.incrementStock(req.params.variantId, amount);
        
        res.json({
            success: true,
            message: 'Stock incremented successfully',
            data: stock
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const decrementStock = async (req, res) => {
    try {
        const { amount } = req.body;
        const stock = await productService.decrementStock(req.params.variantId, amount);
        
        res.json({
            success: true,
            message: 'Stock decremented successfully',
            data: stock
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const products = await productService.getLowStockProducts();
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== DISCOUNT CONTROLLERS ====================

export const getActiveDiscount = async (req, res) => {
    try {
        const discount = await productService.getActiveDiscount(req.params.id);
        res.json({
            success: true,
            data: discount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductDiscounts = async (req, res) => {
    try {
        const discounts = await productService.getProductDiscounts(req.params.id);
        res.json({
            success: true,
            count: discounts.length,
            data: discounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const applyDiscount = async (req, res) => {
    try {
        const discount = await productService.applyDiscount(req.params.id, req.body);
        
        res.status(201).json({
            success: true,
            message: 'Discount applied successfully',
            data: discount
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateDiscount = async (req, res) => {
    try {
        await productService.updateDiscount(req.params.discountId, req.body);
        
        res.json({
            success: true,
            message: 'Discount updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteDiscount = async (req, res) => {
    try {
        await productService.deleteDiscount(req.params.discountId);
        
        res.json({
            success: true,
            message: 'Discount deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};