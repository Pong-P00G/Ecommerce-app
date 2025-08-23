const pool = require('../db');



const ProductModels = {
    getAllProducts: async () => await pool.query('SELECT * FROM Products'),
    getProductById: async (id) => await pool.query('SELECT * FROM Products WHERE id = $1', [id]),
    createProduct: async (productData) => {
        const { productName, productSize, productColor, productPrice, productImage, productDiscount, productCategory } = productData;
        return await pool.query(
            'INSERT INTO Products (productName, productSize, productColor, productPrice, productImage, productDiscount, productCategory) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [productName, productSize,  productColor, productPrice, productImage, productDiscount, productCategory]
        );
    },
    updateProduct: async (id, productData) => {
        const { productName, productSize,  productColor, productPrice, productImage, productDiscount, productCategory } = productData;
        return await pool.query(
            `UPDATE Products SET productName=$1, productSize=$2, productColor=$3, productPrice=$4, productImage=$5, productDiscount=$6, productCategory=$7 WHERE id=$8 RETURNING *`,
            [productName, productSize,  productColor, productPrice, productImage, productDiscount, productCategory, id]
        );
    },
    deleteProduct: async (id) => await pool.query('DELETE FROM Products WHERE id = $1 RETURNING *', [id]),
}

module.exports = ProductModels;