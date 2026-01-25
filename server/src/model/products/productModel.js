import db from '../../database/dbpool.js';

// ==================== PRODUCT OPERATIONS ====================

/**
 * Get all products with full details from view
 */
export const getAllProducts = async () => {
    const [rows] = await db.query(`
        SELECT * FROM product_list 
        ORDER BY created_at DESC
    `);
    return rows;
};

/**
 * Get product by ID with full details including images and variants
 */
export const getProductById = async (productId) => {
    // Get main product info
    const [product] = await db.query(
        'SELECT * FROM product_list WHERE product_id = ?',
        [productId]
    );

    if (product.length === 0) return null;

    // Get all images
    const [images] = await db.query(
        'SELECT image_id, image_url, is_main FROM product_images WHERE product_id = ? ORDER BY is_main DESC, image_id ASC',
        [productId]
    );

    // Get all variants with options and stock
    const [variants] = await db.query(
        'SELECT * FROM product_variant_list WHERE product_id = ?',
        [productId]
    );

    return {
        ...product[0],
        images,
        variants
    };
};

/**
 * Search products with filters using view
 */
export const searchProducts = async (searchTerm = null, category = null, minPrice = null, maxPrice = null, status = null) => {
    let query = 'SELECT * FROM product_search_view WHERE 1=1';
    const params = [];

    if (searchTerm) {
        query += ' AND (product_name LIKE ? OR category_name LIKE ?)';
        const searchPattern = `%${searchTerm}%`;
        params.push(searchPattern, searchPattern);
    }

    if (category) {
        query += ' AND category_name = ?';
        params.push(category);
    }

    if (status) {
        query += ' AND product_status = ?';
        params.push(status);
    }

    if (minPrice !== null) {
        query += ' AND final_price >= ?';
        params.push(minPrice);
    }

    if (maxPrice !== null) {
        query += ' AND final_price <= ?';
        params.push(maxPrice);
    }

    query += ' ORDER BY product_name';

    const [rows] = await db.query(query, params);
    return rows;
};

/**
 * Get paginated products with filters
 */
export const getPaginatedProducts = async (page = 1, pageSize = 10, filters = {}) => {
    const { search, category, minPrice, maxPrice, status } = filters;
    const offset = (page - 1) * pageSize;
    
    let query = 'SELECT * FROM product_search_view WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND (product_name LIKE ? OR category_name LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern);
    }

    if (category) {
        query += ' AND category_name = ?';
        params.push(category);
    }

    if (status) {
        query += ' AND product_status = ?';
        params.push(status);
    }

    if (minPrice !== null && minPrice !== undefined) {
        query += ' AND final_price >= ?';
        params.push(minPrice);
    }

    if (maxPrice !== null && maxPrice !== undefined) {
        query += ' AND final_price <= ?';
        params.push(maxPrice);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Get paginated results
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [items] = await db.query(query, params);

    return {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems,
        totalPages,
        items
    };
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (categoryName) => {
    const [rows] = await db.query(
        'SELECT * FROM product_list WHERE category_name = ? ORDER BY created_at DESC',
        [categoryName]
    );
    return rows;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 10) => {
    const [rows] = await db.query(`
        SELECT * FROM product_list 
        WHERE product_status = 'active' 
        ORDER BY total_stock DESC, created_at DESC 
        LIMIT ?
    `, [limit]);
    return rows;
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
    const { category_id, product_name, base_price, descriptions, product_status } = productData;

    const [result] = await db.query(`
        INSERT INTO products (category_id, product_name, base_price, descriptions, product_status)
        VALUES (?, ?, ?, ?, ?)
    `, [category_id, product_name, base_price, descriptions, product_status]);

    return result.insertId;
};

/**
 * Update product
 */
export const updateProduct = async (productId, productData) => {
    const { category_id, product_name, base_price, descriptions, product_status } = productData;

    const [result] = await db.query(`
        UPDATE products 
        SET category_id = ?, product_name = ?, base_price = ?, descriptions = ?, product_status = ?
        WHERE product_id = ?
    `, [category_id, product_name, base_price, descriptions, product_status, productId]);

    return result.affectedRows;
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
    const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
    return result.affectedRows > 0;
};

/**
 * Check if product exists
 */
export const productExists = async (productId) => {
    const [rows] = await db.query('SELECT product_id FROM products WHERE product_id = ?', [productId]);
    return rows.length > 0;
};

// ==================== IMAGE OPERATIONS ====================

/**
 * Add product image
 */
export const addProductImage = async (productId, imageUrl, isMain = 0) => {
    // If this is set as main image, unset other main images for this product
    if (isMain) {
        await db.query(
            'UPDATE product_images SET is_main = 0 WHERE product_id = ?',
            [productId]
        );
    }

    const [result] = await db.query(`
        INSERT INTO product_images (product_id, image_url, is_main)
        VALUES (?, ?, ?)
    `, [productId, imageUrl, isMain]);

    return result.insertId;
};

/**
 * Get product images
 */
export const getProductImages = async (productId) => {
    const [rows] = await db.query(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, image_id ASC',
        [productId]
    );
    return rows;
};

/**
 * Delete product image
 */
export const deleteProductImage = async (imageId) => {
    const [result] = await db.query('DELETE FROM product_images WHERE image_id = ?', [imageId]);
    return result.affectedRows > 0;
};

/**
 * Set main image
 */
export const setMainImage = async (imageId, productId) => {
    // Unset all main images for this product
    await db.query('UPDATE product_images SET is_main = 0 WHERE product_id = ?', [productId]);
    
    // Set new main image
    const [result] = await db.query(
        'UPDATE product_images SET is_main = 1 WHERE image_id = ?',
        [imageId]
    );
    return result.affectedRows > 0;
};

// ==================== VARIANT OPERATIONS ====================

/**
 * Get product variants
 */
export const getProductVariants = async (productId) => {
    const [rows] = await db.query(
        'SELECT * FROM product_variant_list WHERE product_id = ?',
        [productId]
    );
    return rows;
};

/**
 * Get variant by ID
 */
export const getVariantById = async (variantId) => {
    const [rows] = await db.query(
        'SELECT * FROM product_variant_list WHERE variant_id = ?',
        [variantId]
    );
    return rows[0];
};

/**
 * Create product variant
 */
export const createVariant = async (variantData) => {
    const { product_id, variant_name, sku } = variantData;

    const [result] = await db.query(`
        INSERT INTO product_variants (product_id, variant_name, sku)
        VALUES (?, ?, ?)
    `, [product_id, variant_name, sku]);

    return result.insertId;
};

/**
 * Update variant
 */
export const updateVariant = async (variantId, variantData) => {
    const { variant_name, sku } = variantData;

    const [result] = await db.query(`
        UPDATE product_variants 
        SET variant_name = ?, sku = ?
        WHERE variant_id = ?
    `, [variant_name, sku, variantId]);

    return result.affectedRows;
};

/**
 * Delete variant
 */
export const deleteVariant = async (variantId) => {
    const [result] = await db.query('DELETE FROM product_variants WHERE variant_id = ?', [variantId]);
    return result.affectedRows > 0;
};

/**
 * Check if SKU exists
 */
export const skuExists = async (sku) => {
    const [rows] = await db.query('SELECT variant_id FROM product_variants WHERE sku = ?', [sku]);
    return rows.length > 0;
};

// ==================== VARIANT OPTIONS OPERATIONS ====================

/**
 * Add variant options (color, size)
 */
export const addVariantOptions = async (variantId, color, size) => {
    const [result] = await db.query(`
        INSERT INTO product_variant_options (variant_id, variant_color, variant_size)
        VALUES (?, ?, ?)
    `, [variantId, color, size]);

    return result.insertId;
};

/**
 * Update variant options
 */
export const updateVariantOptions = async (optionId, color, size) => {
    const [result] = await db.query(`
        UPDATE product_variant_options 
        SET variant_color = ?, variant_size = ?
        WHERE option_id = ?
    `, [color, size, optionId]);

    return result.affectedRows;
};

/**
 * Get variant options
 */
export const getVariantOptions = async (variantId) => {
    const [rows] = await db.query(
        'SELECT * FROM product_variant_options WHERE variant_id = ?',
        [variantId]
    );
    return rows[0];
};

// ==================== STOCK OPERATIONS ====================

/**
 * Get stock for variant
 */
export const getStock = async (variantId) => {
    const [rows] = await db.query(
        'SELECT * FROM stocks WHERE variant_id = ?',
        [variantId]
    );
    return rows[0];
};

/**
 * Update stock quantity
 */
export const updateStock = async (variantId, quantity, reorderLevel = 5) => {
    // Check if stock record exists
    const [existing] = await db.query(
        'SELECT stock_id FROM stocks WHERE variant_id = ?',
        [variantId]
    );

    if (existing.length > 0) {
        // Update existing stock
        const [result] = await db.query(`
            UPDATE stocks 
            SET quantity = ?, reorder_level = ?
            WHERE variant_id = ?
        `, [quantity, reorderLevel, variantId]);
        return result.affectedRows;
    } else {
        // Insert new stock record
        const [result] = await db.query(`
            INSERT INTO stocks (variant_id, quantity, reorder_level)
            VALUES (?, ?, ?)
        `, [variantId, quantity, reorderLevel]);
        return result.insertId;
    }
};

/**
 * Increment stock
 */
export const incrementStock = async (variantId, amount) => {
    const [result] = await db.query(`
        UPDATE stocks 
        SET quantity = quantity + ?
        WHERE variant_id = ?
    `, [amount, variantId]);
    return result.affectedRows;
};

/**
 * Decrement stock
 */
export const decrementStock = async (variantId, amount) => {
    const [result] = await db.query(`
        UPDATE stocks 
        SET quantity = quantity - ?
        WHERE variant_id = ? AND quantity >= ?
    `, [amount, variantId, amount]);
    return result.affectedRows;
};

/**
 * Get low stock products
 */
export const getLowStockProducts = async () => {
    const [rows] = await db.query(`
        SELECT pv.*, s.quantity, s.reorder_level, p.product_name
        FROM stocks s
        JOIN product_variants pv ON s.variant_id = pv.variant_id
        JOIN products p ON pv.product_id = p.product_id
        WHERE s.quantity <= s.reorder_level
        ORDER BY s.quantity ASC
    `);
    return rows;
};

// ==================== DISCOUNT OPERATIONS ====================

/**
 * Apply discount to product
 */
export const applyDiscount = async (productId, discountAmount, startDate, endDate) => {
    const [result] = await db.query(`
        INSERT INTO product_discounts (product_id, discount_amount, start_date, end_date)
        VALUES (?, ?, ?, ?)
    `, [productId, discountAmount, startDate, endDate]);

    return result.insertId;
};

/**
 * Get active discount for product
 */
export const getActiveDiscount = async (productId) => {
    const [rows] = await db.query(`
        SELECT * FROM product_discounts 
        WHERE product_id = ? 
        AND NOW() BETWEEN start_date AND end_date
        ORDER BY discount_id DESC
        LIMIT 1
    `, [productId]);
    return rows[0];
};

/**
 * Get all discounts for product
 */
export const getProductDiscounts = async (productId) => {
    const [rows] = await db.query(
        'SELECT * FROM product_discounts WHERE product_id = ? ORDER BY start_date DESC',
        [productId]
    );
    return rows;
};

/**
 * Delete discount
 */
export const deleteDiscount = async (discountId) => {
    const [result] = await db.query('DELETE FROM product_discounts WHERE discount_id = ?', [discountId]);
    return result.affectedRows > 0;
};

/**
 * Update discount
 */
export const updateDiscount = async (discountId, discountData) => {
    const { discount_amount, start_date, end_date } = discountData;

    const [result] = await db.query(`
        UPDATE product_discounts 
        SET discount_amount = ?, start_date = ?, end_date = ?
        WHERE discount_id = ?
    `, [discount_amount, start_date, end_date, discountId]);

    return result.affectedRows;
};

export { db };