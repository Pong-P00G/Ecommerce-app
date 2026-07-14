import api from './api';

export const orderAPI = {
    // Get all orders (Admin: all; User: own)
    async getAllOrders() {
        const { data } = await api.get('/orders');
        return data;
    },

    // Get single order by ID with line items
    async getOrder(orderId) {
        const { data } = await api.get(`/orders/${orderId}`);
        return data;
    },

    // Update order status (Admin only)
    async updateOrderStatus(orderId, status) {
        const { data } = await api.put(`/orders/${orderId}/status`, { status });
        return data;
    }
};
