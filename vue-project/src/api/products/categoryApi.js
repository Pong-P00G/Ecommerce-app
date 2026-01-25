import api from '../api'

export const categoryAPI = {

    // Get all categories
    async getAllCategories () {
        const { data } = await api.get('/products/categories');
        return data;
    },

    // Get category by ID
    async getCategoryByIdasync (categoryId) {
        const { data } = await api.get(`/products/categories/${categoryId}`);
        return data;
    },


    // Create category (Admin only)
    async createCategory (name) {
        const { data } = await api.post('/products/categories', { name });
        return data;
    },

    // Update category (Admin only)
    async updateCategory (categoryId, name) {
        const { data } = await api.put(`/products/categories/${categoryId}`, { name });
        return data;
    },

    // Delete category (Admin only)
    async deleteCategory (categoryId) {
        const { data } = await api.delete(`/products/categories/${categoryId}`);
        return data;
    }
}