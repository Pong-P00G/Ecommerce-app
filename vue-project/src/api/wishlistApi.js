import api from './api.js';

export const wishlistAPI = {
    async getWishlist() {
        const { data } = await api.get('/wishlist');
        return data;
    },

    async toggleItem(productId) {
        const { data } = await api.post('/wishlist/toggle', { product_id: productId });
        return data;
    },

    async addItem(productId) {
        const { data } = await api.post('/wishlist/add', { product_id: productId });
        return data;
    },

    async removeItem(productId) {
        const { data } = await api.delete(`/wishlist/${productId}`);
        return data;
    },

    async clearWishlist() {
        const { data } = await api.delete('/wishlist');
        return data;
    },

    async syncWishlist(productIds) {
        const { data } = await api.post('/wishlist/sync', { product_ids: productIds });
        return data;
    }
};
