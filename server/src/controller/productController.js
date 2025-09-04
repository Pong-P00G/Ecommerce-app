import * as productService from '../services/productService.js';

export const getAllProduct = async (req, res) => {
    try {
        const products = await productService.getAllProduct(req.body);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllProductById = async (req, res) => {
    try {
        const product = await productService.getAllProductById(req.body);
        res,json(product);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.updateProduct(id, req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};