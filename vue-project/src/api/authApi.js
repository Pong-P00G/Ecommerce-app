import api from './api';

export const authAPI = {

    // Register
    async register(userData) {
        const { data } = await api.post('/auth/register', userData);
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
        }
        return data;
    },
    
    // login 
    async login(identifier, password) {
        const { data } = await api.post('/auth/login', { 
            identifier,  // Both (email or username)
            password 
        });
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
        }
        return data;
    },

    // Check if username is available
    async checkUsername(username) {
        const { data } = await api.get(`/auth/check-username/${username}`);
        return data;
    },

    // Check if email is available
    async checkEmail(email) {
        const { data } = await api.get(`/auth/check-email/${email}`);
        return data;
    },
    
    // Logout 
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    },
    
    // Get current logged-in user from storage
    getCurrentUser() {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // Get authentication token from storage
    getToken() {
        return localStorage.getItem('auth_token');
    },
    

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }
};