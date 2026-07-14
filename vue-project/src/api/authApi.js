import api from './api.js';

export const authAPI = {
  // Register
  async register(userData) {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.error('Register API error:', err);
      throw err;
    }
  },

  // Login
  async login(identifier, password) {
    try {
      const { data } = await api.post('/auth/login', {
        identifier,
        password
      });
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.error('Login API error full response:', err.response);
      console.error('Login API error message:', err.response?.data?.message || err.message);
      throw err;
    }
  },

  // Check if username is available
  async checkUsername(username) {
    try {
      const { data } = await api.get(`/auth/check-username/${username}`);
      return data;
    } catch (err) {
      console.error('Check username API error:', err);
      throw err;
    }
  },

  // Check if email is available
  async checkEmail(email) {
    try {
      const { data } = await api.get(`/auth/check-email/${email}`);
      return data;
    } catch (err) {
      console.error('Check email API error:', err);
      throw err;
    }
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
  },

  // Fetch current user's permissions from the server
  async getUserPermissions() {
    try {
      const { data } = await api.get('/auth/permissions');
      return data.data ?? [];
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
      return [];
    }
  },

  // Get stored permissions from localStorage
  getStoredPermissions() {
    const perms = localStorage.getItem('auth_permissions');
    return perms ? JSON.parse(perms) : [];
  },

  // Store permissions in localStorage
  storePermissions(permissions) {
    localStorage.setItem('auth_permissions', JSON.stringify(permissions));
  },

  // Clear permissions from storage
  clearPermissions() {
    localStorage.removeItem('auth_permissions');
  }
};
