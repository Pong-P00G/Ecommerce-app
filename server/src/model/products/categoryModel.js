import db from '../../database/dbpool.js';

/**
 * Get all categories
 */
export const getAllCategories = async () => {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
    return rows;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (categoryId) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE category_id = ?', [categoryId]);
    return rows[0];
};

/**
 * Create new category
 */
export const createCategory = async (name) => {
    const [result] = await db.query(
        'INSERT INTO categories (name) VALUES (?)',
        [name]
    );
    return result.insertId;
};

/**
 * Update category
 */
export const updateCategory = async (categoryId, name) => {
    const [result] = await db.query(
        'UPDATE categories SET name = ? WHERE category_id = ?',
        [name, categoryId]
    );
    return result.affectedRows;
};

/**
 * Delete category
 */
export const deleteCategory = async (categoryId) => {
    const [result] = await db.query('DELETE FROM categories WHERE category_id = ?', [categoryId]);
    return result.affectedRows > 0;
};

/**
 * Check if category exists
 */
export const categoryExists = async (categoryId) => {
    const [rows] = await db.query('SELECT category_id FROM categories WHERE category_id = ?', [categoryId]);
    return rows.length > 0;
};

/**
 * Get category by name
 */
export const getCategoryByName = async (name) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);
    return rows[0];
};