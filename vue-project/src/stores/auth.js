import { defineStore } from 'pinia';
import { authAPI } from '../api/authApi';

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
    /**
     * Initialize auth state from localStorage
     */
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
        // Call authAPI login with identifier
        const response = await authAPI.login(
          credentials.identifier,
          credentials.password
        );

        // Store token and user
        this.token = response.token;
        this.user = response.user;

        return { success: true, user: response.user };
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
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

        // Auto-login after registration
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

    // logout
    logout() {
      authAPI.logout();
      this.token = null;
      this.user = null;
      this.error = null;
    },

    // Clear messeges
    clearError() {
      this.error = null;
    },

    // Update user profile
    async updateProfile(userData) {
      this.loading = true;
      this.error = null;

      try {
        // Assuming you have a userAPI with updateProfile method
        const response = await userAPI.updateProfile(userData);
        this.user = response;
        
        // Update localStorage
        localStorage.setItem('auth_user', JSON.stringify(response));

        return { success: true, user: response };
      } catch (err) {
        this.error = err.response?.data?.message || 'Update failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});