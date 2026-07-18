import api from './api';

export const shippingAPI = {
    async getRates(params) {
        const { data } = await api.post('/shipping/rates', params);
        return data;
    },

    async validateAddress(address) {
        const { data } = await api.post('/shipping/validate', address);
        return data;
    }
};
