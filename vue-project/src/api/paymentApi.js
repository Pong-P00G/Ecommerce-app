import api from './api';

export const paymentAPI = {
    // Active methods (for checkout)
    async getPaymentMethods() {
        const { data } = await api.get('/payments/methods');
        return data;
    },

    // All methods (admin: includes inactive)
    async getAllPaymentMethods() {
        const { data } = await api.get('/payments/methods/all');
        return data;
    },

    // Create a new payment method (admin)
    async createPaymentMethod(params) {
        const { data } = await api.post('/payments/methods', params);
        return data;
    },

    // Update a payment method (admin)
    async updatePaymentMethod(methodId, params) {
        const { data } = await api.put(`/payments/methods/${methodId}`, params);
        return data;
    },

    // Delete a payment method (admin)
    async deletePaymentMethod(methodId) {
        const { data } = await api.delete(`/payments/methods/${methodId}`);
        return data;
    },

    async recordPayment(orderId, params) {
        const { data } = await api.post(`/orders/${orderId}/pay`, params);
        return data;
    },

    async getOrderPayments(orderId) {
        const { data } = await api.get(`/orders/${orderId}/payments`);
        return data;
    },

    async markPaymentAsPaid(orderId) {
        const { data } = await api.put(`/orders/${orderId}/mark-paid`);
        return data;
    }
};
