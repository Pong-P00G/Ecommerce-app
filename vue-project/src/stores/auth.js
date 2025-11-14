import { defineStore } from 'pinia';
import { login as loginApi, register as registerApi } from '../api/api.js';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token || !!state.user
  },
  actions: {
    async login({ email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const data = await loginApi({ email, password });
        const token = data?.token || data?.accessToken || null;
        const user = data?.user || data?.profile || null;
        if (token) localStorage.setItem('auth_token', token);
        if (user) localStorage.setItem('auth_user', JSON.stringify(user));
        this.token = token;
        this.user = user;
        return data;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const data = await registerApi(payload);
        // Some backends auto-login after register; handle both cases
        const token = data?.token || data?.accessToken || null;
        const user = data?.user || data?.profile || null;
        if (token) {
          localStorage.setItem('auth_token', token);
          this.token = token;
        }
        if (user) {
          localStorage.setItem('auth_user', JSON.stringify(user));
          this.user = user;
        }
        return data;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      this.token = null;
      this.user = null;
      this.error = null;
    }
  }
});
