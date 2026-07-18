import api from './api';

export const paymentAPI = {
    async getPaymentMethods() {
        const { data } = await api.get('/payments/methods');
        return data;
    },

    async recordPayment(orderId, params) {
        const { data } = await api.post(`/orders/${orderId}/pay`, params);
        return data;
    },

    async getOrderPayments(orderId) {
        const { data } = await api.get(`/orders/${orderId}/payments`);
        return data;
    }
};
