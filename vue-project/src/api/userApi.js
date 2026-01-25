import api from './api';

export const userAPI = {

    // Get all user (Protected - requires auth)
    async getAllUsers() {
        const { data } = await api.get('/users');
        return data;
    },

    // Get user by ID (Protected - requires auth)
    async getUserById(id) {
        const { data } = await api.get(`/users/${id}`);
        return data;
    },

    // Create user (Protected - requires auth/admin)
    async createUser(userData) {
        const { data } = await api.post('/users', userData);
        return data;
    },

    // Update user (Protected - requires auth)
    async updateUser(id, userData) {
        const { data } = await api.put(`/users/${id}`, userData);
        return data;
    },

    // Update current user profile (Protected - requires auth)
    async updateProfile(userData) {
        const { data } = await api.put('/users', userData);
        return data;
    },

    // Delete user (Protected - requires auth)
    async deleteUser(id) {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    }
};