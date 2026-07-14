import db from '../../database/dbpool.js';

export const getAllCategories = async () => {
    const { rows } = await db.query(
        `SELECT categoriesid AS category_id, categoryname AS name, parentid AS parent_id, createdat AS created_at
         FROM category ORDER BY categoryname`
    );
    return rows;
};

export const getCategoryById = async (categoryId) => {
    const { rows } = await db.query(
        `SELECT categoriesid AS category_id, categoryname AS name, parentid AS parent_id, createdat AS created_at
         FROM category WHERE categoriesid = $1`,
        [categoryId]
    );
    return rows[0];
};

export const createCategory = async (name) => {
    const { rows } = await db.query(
        `INSERT INTO category (categoryname) VALUES ($1) RETURNING categoriesid`,
        [name]
    );
    return rows[0].categoriesid;
};

export const updateCategory = async (categoryId, name) => {
    const result = await db.query(
        `UPDATE category SET categoryname = $1 WHERE categoriesid = $2`,
        [name, categoryId]
    );
    return result.rowCount;
};

export const deleteCategory = async (categoryId) => {
    const result = await db.query(
        `DELETE FROM category WHERE categoriesid = $1`,
        [categoryId]
    );
    return result.rowCount > 0;
};

export const categoryExists = async (categoryId) => {
    const { rows } = await db.query(
        `SELECT categoriesid FROM category WHERE categoriesid = $1`,
        [categoryId]
    );
    return rows.length > 0;
};

export const getCategoryByName = async (name) => {
    const { rows } = await db.query(
        `SELECT categoriesid AS category_id, categoryname AS name FROM category WHERE categoryname = $1`,
        [name]
    );
    return rows[0];
};
