import { defineStore } from 'pinia';
import { authAPI } from '../api/authApi.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    error: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    hasError: (state) => !!state.error
  },

  actions: {
    init() {
      const token = authAPI.getToken();
      const user = authAPI.getCurrentUser();

      if (token && user) {
        this.token = token;
        this.user = user;
      }
    },

    // Login with email or username
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.login(
          credentials.identifier,
          credentials.password
        );

        this.token = response.token;
        this.user = response.user;

        return { success: true, user: response.user };
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Login failed';
        console.error('Store login error:', this.error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Register new user
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.register(userData);

        this.token = response.token;
        this.user = response.user;

        return { success: true, user: response.user };
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Logout
    logout() {
      authAPI.logout();
      this.token = null;
      this.user = null;
      this.error = null;
    },

    // Clear errors
    clearError() {
      this.error = null;
    }
  }
});
