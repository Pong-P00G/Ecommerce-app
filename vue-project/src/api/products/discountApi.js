import api from '../api'

export const discountAPI = {

    // Get active discount
    async getActiveDiscount(productId) {
        const { data } = await api.get(`/products/${productId}/discount/active`);
        return data;
    },

    // Get all product discounts
    async getProductDiscounts(productId) {
        const { data } = await api.get(`/products/${productId}/discounts`);
        return data;
    },

    // Apply discount (Admin only)
    async applyDiscount(productId, discountData) {
        const { data } = await api.post(`/products/${productId}/discount`, discountData);
        return data;
    },

    // Update discount (Admin only)
    async updateDiscount(discountId, discountData) {
        const { data } = await api.put(`/products/discount/${discountId}`, discountData);
        return data;
    },

    // Delete discount (Admin only)
    async deleteDiscount(discountId) {
        const { data } = await api.delete(`/products/discount/${discountId}`);
        return data;
    },

    // Get all discounts across all products (Admin only)
    async getAllDiscounts() {
        const { data } = await api.get('/products/discounts');
        return data;
    }
};