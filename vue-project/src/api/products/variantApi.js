import api from '../api'

export const variantAPI = {
    
    // Get prouct image
    async getProductVaraints (productId) {
        const { data } = await api.get(`/products/${productId}/variants`);
        return data;
    },

    // Get variant by id
    async getVariantById (variantId) {
        const { data } = await api.get(`/products/variants/${variantId}`);
        return data;
    },
    
    // Create variant
    async createVariant (variantData) {
        const { data } = await api.post('/products/variants', variantData);
        return data;
    },
    
    // Update varaint
    async upadateVariant (variantId, variantData) {
        const { data } = await api.put(`/products/variants/${variantId}`, variantData);
        return data;
    },

    // Delete variant
    async deleteVariant (variantId) {
        const { data } = await api.delete(`/products/variants/${variantId}`);
        return data;
    }
    
}