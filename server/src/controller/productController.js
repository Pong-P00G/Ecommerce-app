import * as productService from '../services/productService.js';

export const getAllProduct = async (req, res) => {
    try {
        const products = await productService.getAllProduct();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllProductById = async (req, res) => {
    try {
        const product = await productService.getAllProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};


export const getProductCategory = async (req, res) => {
    try {
        const product = await productService.getProductCategory(req.params.name);
        if (!product || product.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};

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
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.deleteProduct(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};