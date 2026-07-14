import { defineStore } from 'pinia';
import { authAPI } from '../api/authApi.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    permissions: [],
    error: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    hasError: (state) => !!state.error,

    // Check if user has a specific permission key
    can: (state) => {
      return (permissionKey) => {
        return state.permissions.includes(permissionKey);
      };
    },

    // Check if user can access any of the given permissions
    canAny: (state) => {
      return (permissionKeys) => {
        if (!permissionKeys || permissionKeys.length === 0) return false;
        return permissionKeys.some(k => state.permissions.includes(k));
      };
    },

    // Check if user can access all of the given permissions
    canAll: (state) => {
      return (permissionKeys) => {
        if (!permissionKeys || permissionKeys.length === 0) return false;
        return permissionKeys.every(k => state.permissions.includes(k));
      };
    },

    isSuperadmin: (state) => state.user?.role_id === 1,
    isAdmin: (state) => Number(state.user?.role_id) <= 2,
  },

  actions: {
    async init() {
      const token = authAPI.getToken();
      const user = authAPI.getCurrentUser();

      if (token && user) {
        this.token = token;
        this.user = user;
        // Fetch permissions from server
        const permissions = await authAPI.getUserPermissions();
        this.permissions = permissions;
        authAPI.storePermissions(permissions);
      }
    },

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

        // Fetch permissions for the user's role
        const permissions = await authAPI.getUserPermissions();
        this.permissions = permissions;
        authAPI.storePermissions(permissions);

        return { success: true, user: response.user };
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Login failed';
        console.error('Store login error:', this.error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.register(userData);

        this.token = response.token;
        this.user = response.user;

        // Customer role (3) - fetch limited permissions
        const permissions = await authAPI.getUserPermissions();
        this.permissions = permissions;
        authAPI.storePermissions(permissions);

        return { success: true, user: response.user };
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      authAPI.logout();
      authAPI.clearPermissions();
      this.token = null;
      this.user = null;
      this.permissions = [];
      this.error = null;
    },

    clearError() {
      this.error = null;
    },

    hasPermission(key) {
      return this.permissions.includes(key);
    }
  }
});
