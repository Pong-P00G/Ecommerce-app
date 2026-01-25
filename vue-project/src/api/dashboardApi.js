import api from './api';

export const dashboardAPI = {
    // Get comprehensive dashboard statistics
    async getDashboardStats() {
        const { data } = await api.get('/dashboard/stats');
        return data;
    },

    // Get user statistics
    async getUserStats() {
        const { data } = await api.get('/dashboard/users');
        return data;
    },

    // Get product statistics
    async getProductStats() {
        const { data } = await api.get('/dashboard/products');
        return data;
    },

    // Get recent activities
    async getRecentActivities(limit = 10) {
        const { data } = await api.get(`/dashboard/activities?limit=${limit}`);
        return data;
    },

    // Get analytics data
    async getAnalytics(timeframe = 'month') {
        const { data } = await api.get(`/dashboard/analytics?timeframe=${timeframe}`);
        return data;
    }
};
