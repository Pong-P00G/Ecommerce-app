import api from './api';

export const addressAPI = {
    async getAddresses() {
        const { data } = await api.get('/addresses');
        return data;
    },

    async createAddress(addressData) {
        const { data } = await api.post('/addresses', addressData);
        return data;
    },

    async updateAddress(addressId, addressData) {
        const { data } = await api.put(`/addresses/${addressId}`, addressData);
        return data;
    },

    async deleteAddress(addressId) {
        const { data } = await api.delete(`/addresses/${addressId}`);
        return data;
    }
};
