import api from '../api';

export const stockAPI = {

    // Get variant stock
    async getVariantStock(variantId) {
        const { data } = await api.get(`/products/variants/${variantId}/stock`);
        return data;
    },

    // Update stock (Admin only)
    async updateStock(variantId, quantity, reorderLevel = 5) {
        const { data } = await api.put(`/products/variants/${variantId}/stock`, {
            quantity, reorder_level: reorderLevel
        });
        return data;
    },

    // Increment stock (Admin only)
    async incrementStock(variantId, amount) {
        const { data } = await api.post(
            `/products/variants/${variantId}/stock/increment`,
            { amount }
        );
        return data;
    },

    // Decrement stock (Admin only)
    async decrementStock(variantId, amount) {
        const { data } = await api.post(
            `/products/variants/${variantId}/stock/decrement`,
            { amount }
        );
        return data;
    },

    // Get low stock products (Admin only)
    async getLowStockProducts() {
        const { data } = await api.get('/products/stock/low');
        return data;
    },

    // Update product-level stock (Admin only)
    async updateProductStock(productId, quantity, reorderLevel = 5, reason = null) {
        const { data } = await api.put(`/products/${productId}/stock`, {
            quantity,
            reorder_level: reorderLevel,
            reason
        });
        return data;
    },
};