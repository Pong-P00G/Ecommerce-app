import * as ProductModel from '../model/products/productModel.js';
import * as CategoryModel from '../model/products/categoryModel.js';
import { getStockHistoryForProduct } from '../model/products/stockLogModel.js';
import { notifyNewProduct, notifyLowStock } from './dashboardService.js';
import db from '../database/dbpool.js';

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
        tags = [],
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
            product_status,
            tags
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
                    isMain ? 1 : 0,
                    image.alt_text != null ? image.alt_text : null,
                    image.sort_order != null ? image.sort_order : 0
                );
                
                createdImages.push({
                    image_id: imageId,
                    image_url: image.image_url,
                    is_main: isMain,
                    alt_text: image.alt_text || null,
                    sort_order: image.sort_order || 0
                });
            }
        }

        // 4. Create variants with options and stock
        const createdVariants = [];
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                const {
                    sku,
                    variant_color,
                    variant_size,
                    variant_storage,
                    options,
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
                    sku,
                    price: variant.variant_price || variant.price || null,
                });

                // Resolve options: prefer explicit `options` array, fall back to legacy color/size
                let resolvedOptions = [];
                if (Array.isArray(options) && options.length > 0) {
                    resolvedOptions = options;
                } else if (variant_color || variant_size || variant_storage) {
                    if (variant_color)   resolvedOptions.push({ attribute_name: 'Color',   value: variant_color });
                    if (variant_size)    resolvedOptions.push({ attribute_name: 'Size',    value: variant_size  });
                    if (variant_storage) resolvedOptions.push({ attribute_name: 'Storage', value: variant_storage });
                }

                if (resolvedOptions.length > 0) {
                    await ProductModel.addVariantOptions(variantId, resolvedOptions);
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

        // Fire-and-forget: notify admins of new product
        notifyNewProduct(product_name).catch(() => {});

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

export const getNewArrivals = async (limit = 10) => {
    return await ProductModel.getNewArrivals(limit);
};

export const getComingSoon = async (limit = 10) => {
    return await ProductModel.getComingSoon(limit);
};

export const getBestSellers = async (limit = 10) => {
    return await ProductModel.getBestSellers(limit);
};

export const getProductsByTag = async (tag, limit = 10) => {
    if (!tag || tag.trim() === '') {
        throw new Error('Tag parameter is required');
    }
    return await ProductModel.getProductsByTag(tag.trim(), limit);
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

export const deleteProduct = async (productId, forceDelete = false) => {
    const deleted = await ProductModel.deleteProduct(productId, forceDelete);
    if (!deleted) {
        throw new Error('Product not found');
    }
    return true;
};

/**
 * Update complete product with images, variants, options, and stock.
 * All write operations are wrapped in a database transaction for atomicity.
 * If any step fails, all changes are rolled back.
 *
 * Read operations (SELECTs for existing data) happen outside the transaction.
 * Write operations (UPDATE, DELETE, INSERT) use a client-level transaction.
 */
export const updateCompleteProduct = async (productId, productData) => {
    const {
        category_id,
        product_name,
        base_price,
        descriptions,
        product_status = 'active',
        tags = [],
        images = [],
        variants = []
    } = productData;

    // ── Pre-checks (outside transaction) ──────────────────────────────────────
    const exists = await ProductModel.productExists(productId);
    if (!exists) throw new Error('Product not found');

    // Gather existing data before we start deleting
    const existingVariants = await ProductModel.getProductVariants(productId);
    const existingImages = await ProductModel.getProductImages(productId);
    const stockLookup = {};
    for (const v of existingVariants) {
        const s = await ProductModel.getStock(v.variant_id);
        if (s) stockLookup[v.variant_id] = s;
    }

    // ── Transaction: all writes go through a single client ────────────────────
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // 1. Update basic product info
        const updateResult = await client.query(
            `UPDATE products
             SET categoriesid = COALESCE($1, categoriesid),
                 productname = $2,
                 baseprice = $3,
                 description = $4,
                 status = $5,
                 tags = $6
             WHERE productsid = $7`,
            [category_id ?? null, product_name, base_price, descriptions, product_status, tags || [], productId]
        );
        if (updateResult.rowCount === 0) {
            throw new Error('No changes made to product');
        }

        // 2. Delete existing variants in FK-safe order
        for (const v of existingVariants) {
            if (stockLookup[v.variant_id]?.stock_id) {
                await client.query('DELETE FROM stocklog WHERE stockid = $1', [stockLookup[v.variant_id].stock_id]);
            }
            await client.query('DELETE FROM stock WHERE variantid = $1', [v.variant_id]);
            await client.query('DELETE FROM variantoptionvalue WHERE variantid = $1', [v.variant_id]);
            await client.query('DELETE FROM variants WHERE variantid = $1', [v.variant_id]);
        }

        // 3. Delete existing images
        for (const img of existingImages) {
            await client.query('DELETE FROM productimages WHERE imageid = $1', [img.image_id]);
        }

        // 4. Create new images
        const createdImages = [];
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const isMain = i === 0 || image.is_main === true;

                if (isMain) {
                    await client.query('UPDATE productimages SET isthumbnail = FALSE WHERE productsid = $1', [productId]);
                }

                const imgResult = await client.query(
                    `INSERT INTO productimages (productsid, imageurl, alttext, isthumbnail, sortorder)
                     VALUES ($1, $2, $3, $4, $5) RETURNING imageid`,
                    [productId, image.image_url, image.alt_text || null, Boolean(isMain), image.sort_order ?? 0]
                );
                createdImages.push({
                    image_id: imgResult.rows[0].imageid,
                    image_url: image.image_url,
                    is_main: isMain,
                    alt_text: image.alt_text || null,
                    sort_order: image.sort_order ?? 0
                });
            }
        }

        // 5. Create new variants
        const createdVariants = [];
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                const {
                    sku,
                    variant_color,
                    variant_size,
                    variant_storage,
                    options,
                    variant_price,
                    stock_quantity = 0,
                    reorder_level = 5
                } = variant;

                // SKU uniqueness check (within the transaction)
                if (sku) {
                    const skuCheck = await client.query('SELECT variantid FROM variants WHERE sku = $1', [sku]);
                    if (skuCheck.rows.length > 0) {
                        throw new Error(`SKU '${sku}' already exists`);
                    }
                }

                // Create variant
                const varResult = await client.query(
                    `INSERT INTO variants (productsid, sku, price) VALUES ($1, $2, $3) RETURNING variantid`,
                    [productId, sku || null, variant_price || null]
                );
                const variantId = varResult.rows[0].variantid;

                // Resolve options and add them
                let resolvedOptions = [];
                if (Array.isArray(options) && options.length > 0) {
                    resolvedOptions = options;
                } else if (variant_color || variant_size || variant_storage) {
                    if (variant_color)   resolvedOptions.push({ attribute_name: 'Color',   value: variant_color });
                    if (variant_size)    resolvedOptions.push({ attribute_name: 'Size',    value: variant_size  });
                    if (variant_storage) resolvedOptions.push({ attribute_name: 'Storage', value: variant_storage });
                }

                for (const opt of resolvedOptions) {
                    if (!opt || !opt.attribute_name || !opt.value) continue;
                    // Upsert attribute
                    const attrResult = await client.query(
                        `INSERT INTO variantattribute (attributename) VALUES ($1)
                         ON CONFLICT (attributename) DO UPDATE SET attributename = EXCLUDED.attributename
                         RETURNING attributeid`,
                        [String(opt.attribute_name)]
                    );
                    const attrId = attrResult.rows[0].attributeid;
                    // Upsert attribute value
                    const valResult = await client.query(
                        `INSERT INTO variantattributevalue (attributeid, value) VALUES ($1, $2)
                         ON CONFLICT (attributeid, value) DO UPDATE SET value = EXCLUDED.value
                         RETURNING valueid`,
                        [attrId, String(opt.value)]
                    );
                    // Link to variant
                    await client.query(
                        `INSERT INTO variantoptionvalue (variantid, valueid) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                        [variantId, valResult.rows[0].valueid]
                    );
                }

                // Set stock
                if (stock_quantity >= 0) {
                    const stockResult = await client.query(
                        `INSERT INTO stock (productsid, variantid, quantity, minstock)
                         VALUES ((SELECT productsid FROM variants WHERE variantid = $1), $1, $2, $3)
                         ON CONFLICT (productsid, variantid)
                         DO UPDATE SET quantity = $2, minstock = $3, updatedat = NOW()
                         RETURNING stockid`,
                        [variantId, stock_quantity, reorder_level]
                    );
                    // Create stock log entry
                    const stockId = stockResult.rows[0]?.stockid;
                    if (stockId) {
                        await client.query(
                            `INSERT INTO stocklog (stockid, usersid, changetype, quantity, reason)
                             VALUES ($1, NULL, 'ADJUST', $2, 'Complete product update')`,
                            [stockId, stock_quantity]
                        );
                    }
                }

                // Store variantId and known data — full details are fetched after COMMIT
                createdVariants.push({
                    variant_id: variantId,
                    product_id: productId,
                    sku: sku || null,
                    variant_price: variant_price || null,
                    quantity: stock_quantity,
                    reorder_level
                });
            }
        }

        // ── Commit ────────────────────────────────────────────────────────────
        await client.query('COMMIT');

        // 6. Return the complete updated product (pool query, committed data is visible)
        const completeProduct = await ProductModel.getProductById(productId);

        // Enrich createdVariants with full details from the fresh read
        const fullVariants = completeProduct?.variants || [];
        const enrichedVariants = createdVariants.map(cv => {
            const full = fullVariants.find(fv => fv.variant_id === cv.variant_id);
            return full || cv;
        });

        return {
            ...completeProduct,
            images: createdImages,
            variants: enrichedVariants
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
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

export const addProductImage = async (productId, imageUrl, isMain = false, altText = null, sortOrder = 0) => {
    const exists = await ProductModel.productExists(productId);
    if (!exists) {
        throw new Error('Product not found');
    }

    const imageId = await ProductModel.addProductImage(
        productId,
        imageUrl,
        isMain ? 1 : 0,
        altText,
        sortOrder
    );
    return { imageId, imageUrl, isMain, altText, sortOrder };
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
    const { product_id, sku, variant_color, variant_size, variant_storage, variant_price, options, initial_stock = 0 } = variantData;

    if (!product_id) {
        throw new Error('Missing required field: product_id');
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

    const variantId = await ProductModel.createVariant({ product_id, sku, price: variant_price || null });

    // Resolve options: prefer explicit `options` array, fall back to legacy color/size
    let resolvedOptions = [];
    if (Array.isArray(options) && options.length > 0) {
        resolvedOptions = options;
    } else if (variant_color || variant_size || variant_storage) {
        if (variant_color)   resolvedOptions.push({ attribute_name: 'Color',   value: variant_color });
        if (variant_size)    resolvedOptions.push({ attribute_name: 'Size',    value: variant_size  });
        if (variant_storage) resolvedOptions.push({ attribute_name: 'Storage', value: variant_storage });
    }

    if (resolvedOptions.length > 0) {
        await ProductModel.addVariantOptions(variantId, resolvedOptions);
    }

    if (initial_stock > 0) {
        await ProductModel.updateStock(variantId, initial_stock);
    }

    return await getVariantById(variantId);
};

export const updateVariant = async (variantId, variantData) => {
    const { sku, variant_color, variant_size, variant_storage, variant_price, options } = variantData;

    if (sku) {
        const existing = await ProductModel.skuExists(sku);
        if (existing) {
            const currentVariant = await ProductModel.getVariantById(variantId);
            if (currentVariant && currentVariant.sku !== sku) {
                throw new Error('SKU already exists');
            }
        }
    }

    await ProductModel.updateVariant(variantId, { sku, price: variant_price || null });

    // Resolve options: prefer explicit `options` array, fall back to legacy color/size
    let resolvedOptions = null;
    if (Array.isArray(options)) {
        resolvedOptions = options;
    } else if (variant_color || variant_size || variant_storage) {
        resolvedOptions = [];
        if (variant_color)   resolvedOptions.push({ attribute_name: 'Color',   value: variant_color });
        if (variant_size)    resolvedOptions.push({ attribute_name: 'Size',    value: variant_size  });
        if (variant_storage) resolvedOptions.push({ attribute_name: 'Storage', value: variant_storage });
    }

    if (resolvedOptions !== null && resolvedOptions.length > 0) {
        await ProductModel.updateVariantOptions(variantId, resolvedOptions);
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

export const updateStock = async (variantId, quantity, reorderLevel = 5, userId = null, reason = null) => {
    if (quantity < 0) {
        throw new Error('Stock quantity cannot be negative');
    }

    await ProductModel.updateStock(variantId, quantity, reorderLevel, userId, reason);
    const updated = await getStock(variantId);

    // Fire-and-forget: notify if below threshold (but not out of stock)
    if (updated.quantity > 0 && updated.quantity < (updated.reorder_level || 5)) {
        const variant = await ProductModel.getVariantById(variantId).catch(() => null);
        const productName = variant ? `Product #${variant.product_id}` : `Item #${variantId}`;
        notifyLowStock(productName, updated.quantity, variant?.sku || null).catch(() => {});
    }

    return updated;
};

export const incrementStock = async (variantId, amount, userId = null, reason = null) => {
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    await ProductModel.incrementStock(variantId, amount, userId, reason);
    return await getStock(variantId);
};

export const decrementStock = async (variantId, amount, userId = null, reason = null) => {
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    const currentStock = await getStock(variantId);
    if (currentStock.quantity < amount) {
        throw new Error('Insufficient stock');
    }

    await ProductModel.decrementStock(variantId, amount, userId, reason);
    const updated = await getStock(variantId);

    // Fire-and-forget: check if stock is now below threshold
    if (updated.quantity > 0 && updated.quantity < (updated.reorder_level || 5)) {
        const variant = await ProductModel.getVariantById(variantId).catch(() => null);
        const productName = variant ? `Product #${variant.product_id}` : `Item #${variantId}`;
        notifyLowStock(productName, updated.quantity, variant?.sku || null).catch(() => {});
    }

    return updated;
};

// Product-level stock (variantId IS NULL)

export const getProductStock = async (productId) => {
    const stock = await ProductModel.getProductStock(productId);
    if (!stock) {
        return { product_id: productId, variant_id: null, quantity: 0, reorder_level: 5 };
    }
    return stock;
};

export const updateProductStock = async (productId, quantity, reorderLevel = 5, userId = null, reason = null) => {
    if (quantity < 0) {
        throw new Error('Stock quantity cannot be negative');
    }

    const productExists = await ProductModel.productExists(productId);
    if (!productExists) {
        throw new Error('Product not found');
    }

    await ProductModel.updateProductStock(productId, quantity, reorderLevel, userId, reason);
    const updated = await getProductStock(productId);

    // Fire-and-forget: check if still low and notify
    if (updated.quantity > 0 && updated.quantity < (updated.reorder_level || 5)) {
        const product = await ProductModel.getProductById(productId).catch(() => null);
        const productName = product?.product_name || `Product #${productId}`;
        notifyLowStock(productName, updated.quantity, null).catch(() => {});
    }

    return updated;
};

export const getLowStockProducts = async () => {
    return await ProductModel.getLowStockProducts();
};

// ── STOCK HISTORY ───────────────────────────────────────────────────────────

export const getStockHistory = async (productId) => {
    return await getStockHistoryForProduct(productId);
};

// ── BULK STOCK UPDATE ──────────────────────────────────────────────────────────

export const bulkUpdateStock = async (updates, userId = null) => {
    const results = { updated: 0, failed: 0, errors: [] };
    for (const item of updates) {
        try {
            const { product_id, quantity, reorder_level, reason } = item;
            if (!product_id || quantity === undefined) {
                results.failed++;
                results.errors.push({ product_id, error: 'product_id and quantity are required' });
                continue;
            }
            await ProductModel.updateProductStock(
                product_id,
                quantity,
                reorder_level != null ? reorder_level : 5,
                userId,
                reason || 'Bulk stock update'
            );
            results.updated++;
        } catch (err) {
            results.failed++;
            results.errors.push({ product_id: item.product_id, error: err.message });
        }
    }
    return results;
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

export const getAllDiscounts = async () => {
    return await ProductModel.getAllDiscounts();
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