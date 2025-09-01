import * as productModels from '../model/productModel.js'

// Get all product
export const getAllProduct = async () => {
    return await productModels.getAllProduct();
};

// Get prodcut by id
export const getAllProductById = async (id) => {
    return await productModels.getAllProductById(id);
};

// Create product
export const createProduct = async (productData) => {
    return await productModels.createProduct(productData);
};


// Update product
export const updateProduct = async (id, productData) => {
    return await productModels.updateProduct(id, productData);
};

// Delete product
export const deleteProduct = async (id) => {
    return await productModels.deleteProduct(id);
};