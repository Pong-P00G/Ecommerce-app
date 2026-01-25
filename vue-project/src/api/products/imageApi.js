import api from '../api'

export const imageAPI = {
    
    // Get prouct image
    async getProductImages (productId) {
        const { data } = await api.get(`/products/${productId}/images`);
        return data;
    },

    // Add product images
    async addProductImages (productId, imageUrl, isMain = false) {
        const { data } = await api.post(`/products/${productId}/images`, {
            image_url: imageUrl,
            is_main: isMain
        });
        return data;
    },
    
    // Delete product images
    async deleteProductImages (productId, imageId) {
        const { data } = await api.delete(`/products/${productId}/images/${imageId}`);
        return data;
    },
    
    // Set main images
    async setMainImages (productId, imageId) {
        const { data } = await api.put(`/products/${productId}/images/${imageId}/set-main`);
        return data;
    }
    
}