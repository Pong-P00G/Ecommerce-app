const { pool } = require('../db');


// Get all products
const getAllProducts = async (req, res) => {
    try {
        const result = await ProductModels.getAllProducts();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Product by id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductModels.getProductById(id);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Product
const createProduct = async (req, res) => {
    try {
        const { productName, productSize,  productColor, productPrice, productImage, productDiscount, productCategory } = req.body;
        const result = await ProductModels.createProduct({
            productName,
            productSize,
            productColor,
            productPrice,
            productImage,
            productDiscount,
            productCategory
        });
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productSize,  productColor, productPrice, productImage, productDiscount, productCategory } = req.body;
        const result = await pool.query
        (`UPDATE Products SET productName=$1, productSize=$2, productColor=$3, productPrice=$4, productImage=$5, productDiscount=$6, productCategory=$7 WHERE id=$8 RETURNING *`,
            [productName, productSize,  productColor, productPrice, productImage, productDiscount, productCategory, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports ={
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}