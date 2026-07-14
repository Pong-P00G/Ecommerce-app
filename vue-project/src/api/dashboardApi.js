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
    },

    // Get revenue statistics (today, week, month, growth)
    async getRevenue() {
        const { data } = await api.get('/dashboard/revenue');
        return data;
    },

    // Get order statistics (status breakdown)
    async getOrderStats() {
        const { data } = await api.get('/dashboard/orders');
        return data;
    },

    // Get recent orders with customer info
    async getRecentOrders(limit = 5) {
        const { data } = await api.get(`/dashboard/recent-orders?limit=${limit}`);
        return data;
    },

    // Get top selling products
    async getTopProducts(limit = 5) {
        const { data } = await api.get(`/dashboard/top-products?limit=${limit}`);
        return data;
    },

    // Get review statistics (total, approval, rating)
    async getReviewStats() {
        const { data } = await api.get('/dashboard/reviews');
        return data;
    },

    // Global search across products, orders, and users
    async globalSearch(query) {
        const { data } = await api.get(`/dashboard/search?q=${encodeURIComponent(query)}`);
        return data;
    },

    // ── Notifications ────────────────────────────────────────────────────────────

    // Get all notifications (paginated, with optional type filter)
    async getAllNotifications(page = 1, pageSize = 20, type = null) {
        let url = `/dashboard/notifications/all?page=${page}&pageSize=${pageSize}`;
        if (type) url += `&type=${type}`;
        const { data } = await api.get(url);
        return data;
    },

    // Get recent notifications
    async getNotifications(limit = 20) {
        const { data } = await api.get(`/dashboard/notifications?limit=${limit}`);
        return data;
    },

    // Mark a single notification as read
    async markNotificationRead(id) {
        const { data } = await api.put(`/dashboard/notifications/${id}/read`);
        return data;
    },

    // Mark all notifications as read
    async markAllNotificationsRead() {
        const { data } = await api.put('/dashboard/notifications/read-all');
        return data;
    },

    // Get all activities (paginated, with optional type filter)
    async getAllActivities(page = 1, pageSize = 20, type = null) {
        let url = `/dashboard/activities/all?page=${page}&pageSize=${pageSize}`;
        if (type) url += `&type=${type}`;
        const { data } = await api.get(url);
        return data;
    },

    // Manually trigger a low-stock check
    async checkLowStock() {
        const { data } = await api.post('/dashboard/check-low-stock');
        return data;
    },

    // Generate a report on-the-fly (sales, inventory, customer, financial)
    async generateReport(params = {}) {
        const { data } = await api.post('/dashboard/reports/generate', params);
        return data;
    },

    // ── Notification Preferences ────────────────────────────────────────────────

    // Get notification preferences
    async getNotificationPreferences() {
        const { data } = await api.get('/dashboard/notification-preferences');
        return data;
    },

    // Update notification preferences
    async updateNotificationPreferences(prefs) {
        const { data } = await api.put('/dashboard/notification-preferences', prefs);
        return data;
    },

    // ── Push Notifications ──────────────────────────────────────────────────────

    // Get VAPID public key for push subscription
    async getVapidPublicKey() {
        const { data } = await api.get('/dashboard/vapid-public-key');
        return data;
    },

    // Save push subscription
    async savePushSubscription(subscription) {
        const { data } = await api.post('/dashboard/push-subscribe', subscription);
        return data;
    },

    // Remove push subscription
    async removePushSubscription(endpoint) {
        const { data } = await api.delete('/dashboard/push-subscribe', {
            data: { endpoint }
        });
        return data;
    }
};
