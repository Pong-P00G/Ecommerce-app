import api from './api';

export const cartAPI = {
    async getCart() {
        const { data } = await api.get('/cart');
        return data;
    },

    async addItem(params) {
        const { data } = await api.post('/cart/items', params);
        return data;
    },

    async updateItem(cartItemId, quantity) {
        const { data } = await api.put(`/cart/items/${cartItemId}`, { quantity });
        return data;
    },

    async removeItem(cartItemId) {
        const { data } = await api.delete(`/cart/items/${cartItemId}`);
        return data;
    },

    async clearCart() {
        const { data } = await api.delete('/cart');
        return data;
    }
};
