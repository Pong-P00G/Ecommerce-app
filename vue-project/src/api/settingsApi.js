import api from './api';

export const settingsAPI = {
    async getSettings() {
        const { data } = await api.get('/settings');
        return data;
    },

    async updateSettings(settings) {
        const { data } = await api.put('/settings', settings);
        return data;
    }
};
