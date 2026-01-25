import * as ProductModel from '../model/products/productModel.js';
import * as CategoryModel from '../model/products/categoryModel.js';

// ==================== COMPLETE PRODUCT CREATION ====================

/**
 * Create complete product with images, variants, options, and stock
 * All in one transaction
 */
export const createCompleteProduct = async (productData) => {
    const {
        category_id,
        product_name,
        base_price,
        descriptions,
        product_status = 'active',
        images = [],
        variants = []
    } = productData;

    try {
        // 1. Validate category if provided
        if (category_id) {
            const categoryExists = await CategoryModel.categoryExists(category_id);
            if (!categoryExists) {
                throw new Error('Category not found');
            }
        }

        // 2. Create the main product
        const productId = await ProductModel.createProduct({
            category_id,
            product_name,
            base_price,
            descriptions,
            product_status
        });

        // 3. Add images if provided
        const createdImages = [];
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const isMain = i === 0 || image.is_main === true;
                
                const imageId = await ProductModel.addProductImage(
                    productId,
                    image.image_url,
                    isMain ? 1 : 0
                );
                
                createdImages.push({
                    image_id: imageId,
                    image_url: image.image_url,
                    is_main: isMain
                });
            }
        }

        // 4. Create variants with options and stock
        const createdVariants = [];
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                const {
                    variant_name,
                    sku,
                    variant_color,
                    variant_size,
                    stock_quantity = 0,
                    reorder_level = 5
                } = variant;

                // Check SKU uniqueness
                if (sku) {
                    const skuExists = await ProductModel.skuExists(sku);
                    if (skuExists) {
                        throw new Error(`SKU '${sku}' already exists`);
                    }
                }

                // Create variant
                const variantId = await ProductModel.createVariant({
                    product_id: productId,
                    variant_name,
                    sku
                });

                // Add variant options if provided
                if (variant_color && variant_size) {
                    await ProductModel.addVariantOptions(variantId, variant_color, variant_size);
                }

                // Set initial stock
                if (stock_quantity >= 0) {
                    await ProductModel.updateStock(variantId, stock_quantity, reorder_level);
                }

                const variantDetails = await ProductModel.getVariantById(variantId);
                createdVariants.push(variantDetails);
            }
        }

        // 5. Get complete product with all details
        const completeProduct = await ProductModel.getProductById(productId);

        return {
            ...completeProduct,
            images: createdImages,
            variants: createdVariants
        };

    } catch (error) {
        throw error;
    }
};

// ==================== PRODUCT SERVICES ====================

export const getAllProducts = async () => {
    return await ProductModel.getAllProducts();
};

export const getProductById = async (productId) => {
    const product = await ProductModel.getProductById(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
};

export const searchProducts = async (filters) => {
    const { search, category, minPrice, maxPrice, status } = filters;
    return await ProductModel.searchProducts(search, category, minPrice, maxPrice, status);
};

export const getPaginatedProducts = async (page = 1, pageSize = 10, filters = {}) => {
    return await ProductModel.getPaginatedProducts(page, pageSize, filters);
};

export const getProductsByCategory = async (categoryName) => {
    return await ProductModel.getProductsByCategory(categoryName);
};

export const getFeaturedProducts = async (limit = 10) => {
    return await ProductModel.getFeaturedProducts(limit);
};

export const createProduct = async (productData) => {
    if (!productData.product_name || !productData.base_price || !productData.product_status) {
        throw new Error('Missing required fields: product_name, base_price, or product_status');
    }

    if (productData.base_price <= 0) {
        throw new Error('Base price must be greater than 0');
    }

    const productId = await ProductModel.createProduct(productData);
    return await getProductById(productId);
};

export const updateProduct = async (productId, productData) => {
    const exists = await ProductModel.productExists(productId);
    if (!exists) {
        throw new Error('Product not found');
    }

    if (productData.base_price !== undefined && productData.base_price <= 0) {
        throw new Error('Base price must be greater than 0');
    }

    const affectedRows = await ProductModel.updateProduct(productId, productData);
    if (affectedRows === 0) {
        throw new Error('No changes made');
    }

    return await getProductById(productId);
};

export const deleteProduct = async (productId) => {
    const deleted = await ProductModel.deleteProduct(productId);
    if (!deleted) {
        throw new Error('Product not found');
    }
    return true;
};

// ==================== CATEGORY SERVICES ====================

export const getAllCategories = async () => {
    return await CategoryModel.getAllCategories();
};

export const getCategoryById = async (categoryId) => {
    const category = await CategoryModel.getCategoryById(categoryId);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};

export const createCategory = async (name) => {
    if (!name || name.trim() === '') {
        throw new Error('Category name is required');
    }

    const categoryId = await CategoryModel.createCategory(name.trim());
    return await getCategoryById(categoryId);
};

export const updateCategory = async (categoryId, name) => {
    if (!name || name.trim() === '') {
        throw new Error('Category name is required');
    }

    const affectedRows = await CategoryModel.updateCategory(categoryId, name.trim());
    if (affectedRows === 0) {
        throw new Error('Category not found');
    }

    return await getCategoryById(categoryId);
};

export const deleteCategory = async (categoryId) => {
    const deleted = await CategoryModel.deleteCategory(categoryId);
    if (!deleted) {
        throw new Error('Category not found');
    }
    return true;
};

// ==================== IMAGE SERVICES ====================

export const addProductImage = async (productId, imageUrl, isMain = false) => {
    const exists = await ProductModel.productExists(productId);
    if (!exists) {
        throw new Error('Product not found');
    }

    const imageId = await ProductModel.addProductImage(productId, imageUrl, isMain ? 1 : 0);
    return { imageId, imageUrl, isMain };
};

export const getProductImages = async (productId) => {
    return await ProductModel.getProductImages(productId);
};

export const deleteProductImage = async (imageId) => {
    const deleted = await ProductModel.deleteProductImage(imageId);
    if (!deleted) {
        throw new Error('Image not found');
    }
    return true;
};

export const setMainImage = async (imageId, productId) => {
    const updated = await ProductModel.setMainImage(imageId, productId);
    if (!updated) {
        throw new Error('Image not found');
    }
    return true;
};

// ==================== VARIANT SERVICES ====================

export const getProductVariants = async (productId) => {
    return await ProductModel.getProductVariants(productId);
};

export const getVariantById = async (variantId) => {
    const variant = await ProductModel.getVariantById(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }
    return variant;
};

export const createVariant = async (variantData) => {
    const { product_id, variant_name, sku, variant_color, variant_size, initial_stock = 0 } = variantData;

    if (!product_id || !variant_name) {
        throw new Error('Missing required fields: product_id, variant_name');
    }

    const productExists = await ProductModel.productExists(product_id);
    if (!productExists) {
        throw new Error('Product not found');
    }

    if (sku) {
        const skuExists = await ProductModel.skuExists(sku);
        if (skuExists) {
            throw new Error('SKU already exists');
        }
    }

    const variantId = await ProductModel.createVariant({ product_id, variant_name, sku });

    if (variant_color && variant_size) {
        await ProductModel.addVariantOptions(variantId, variant_color, variant_size);
    }

    if (initial_stock > 0) {
        await ProductModel.updateStock(variantId, initial_stock);
    }

    return await getVariantById(variantId);
};

export const updateVariant = async (variantId, variantData) => {
    const { variant_name, sku, variant_color, variant_size } = variantData;

    if (sku) {
        const existing = await ProductModel.skuExists(sku);
        if (existing) {
            const currentVariant = await ProductModel.getVariantById(variantId);
            if (currentVariant && currentVariant.sku !== sku) {
                throw new Error('SKU already exists');
            }
        }
    }

    if (variant_name || sku) {
        await ProductModel.updateVariant(variantId, { variant_name, sku });
    }

    if (variant_color && variant_size) {
        const options = await ProductModel.getVariantOptions(variantId);
        if (options) {
            await ProductModel.updateVariantOptions(options.option_id, variant_color, variant_size);
        } else {
            await ProductModel.addVariantOptions(variantId, variant_color, variant_size);
        }
    }

    return await getVariantById(variantId);
};

export const deleteVariant = async (variantId) => {
    const deleted = await ProductModel.deleteVariant(variantId);
    if (!deleted) {
        throw new Error('Variant not found');
    }
    return true;
};

// ==================== STOCK SERVICES ====================

export const getStock = async (variantId) => {
    const stock = await ProductModel.getStock(variantId);
    if (!stock) {
        return { variant_id: variantId, quantity: 0, reorder_level: 5 };
    }
    return stock;
};

export const updateStock = async (variantId, quantity, reorderLevel = 5) => {
    if (quantity < 0) {
        throw new Error('Stock quantity cannot be negative');
    }

    await ProductModel.updateStock(variantId, quantity, reorderLevel);
    return await getStock(variantId);
};

export const incrementStock = async (variantId, amount) => {
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    await ProductModel.incrementStock(variantId, amount);
    return await getStock(variantId);
};

export const decrementStock = async (variantId, amount) => {
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    const currentStock = await getStock(variantId);
    if (currentStock.quantity < amount) {
        throw new Error('Insufficient stock');
    }

    await ProductModel.decrementStock(variantId, amount);
    return await getStock(variantId);
};

export const getLowStockProducts = async () => {
    return await ProductModel.getLowStockProducts();
};

// ==================== DISCOUNT SERVICES ====================

export const applyDiscount = async (productId, discountData) => {
    const { discount_amount, start_date, end_date } = discountData;

    if (!discount_amount || discount_amount <= 0) {
        throw new Error('Discount amount must be greater than 0');
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (start >= end) {
        throw new Error('End date must be after start date');
    }

    const exists = await ProductModel.productExists(productId);
    if (!exists) {
        throw new Error('Product not found');
    }

    const discountId = await ProductModel.applyDiscount(productId, discount_amount, start_date, end_date);
    return { discountId, ...discountData };
};

export const getActiveDiscount = async (productId) => {
    return await ProductModel.getActiveDiscount(productId);
};

export const getProductDiscounts = async (productId) => {
    return await ProductModel.getProductDiscounts(productId);
};

export const updateDiscount = async (discountId, discountData) => {
    const { discount_amount, start_date, end_date } = discountData;

    if (discount_amount !== undefined && discount_amount <= 0) {
        throw new Error('Discount amount must be greater than 0');
    }

    if (start_date && end_date) {
        const start = new Date(start_date);
        const end = new Date(end_date);

        if (start >= end) {
            throw new Error('End date must be after start date');
        }
    }

    const affectedRows = await ProductModel.updateDiscount(discountId, discountData);
    if (affectedRows === 0) {
        throw new Error('Discount not found');
    }

    return true;
};

export const deleteDiscount = async (discountId) => {
    const deleted = await ProductModel.deleteDiscount(discountId);
    if (!deleted) {
        throw new Error('Discount not found');
    }
    return true;
};

// ==================== BULK OPERATIONS ====================

export const bulkCreateProducts = async (productsArray) => {
    const results = {
        success: [],
        failed: []
    };

    for (const productData of productsArray) {
        try {
            const result = await createCompleteProduct(productData);
            results.success.push({
                product_name: productData.product_name,
                product_id: result.product_id
            });
        } catch (error) {
            results.failed.push({
                product_name: productData.product_name,
                error: error.message
            });
        }
    }

    return {
        total: productsArray.length,
        created: results.success.length,
        failed: results.failed.length,
        results
    };
};