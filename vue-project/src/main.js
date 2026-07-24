import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { seoHead } from './head.js';
import { useAuthStore } from './stores/auth.js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(seoHead);

// ── Restore auth session from localStorage BEFORE mount ─────────────────
// This ensures the router guard (beforeEach) sees the stored token+user
// when checking isAuthenticated, preventing a redirect to login on refresh.
const authStore = useAuthStore();
authStore.init().catch((err) => {
  console.error('Auth init failed:', err);
}); // runs synchronously for localStorage read, async for permissions fetch

app.mount('#app');