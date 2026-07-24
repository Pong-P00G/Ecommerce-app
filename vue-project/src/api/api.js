import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    withCredentials: true, // Send httpOnly cookie with every request
    headers: {
        "Content-Type": "application/json"
    },
});

// Handle response errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if:
            // - The request itself is for /auth/login or /auth/register (expected 401 for bad creds)
            // - We're already on an auth page (login, register, forgotPassword)
            const requestUrl = error.config?.url || '';
            const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
            const isOnAuthPage = ['/login', '/register', '/forgotPassword', '/forgot-password']
                .some(p => window.location.pathname.startsWith(p));
            
            if (!isAuthRequest && !isOnAuthPage) {
                // Session expired — cookie is invalid, redirect to login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ── Newsletter API ───────────────────────────────────────────────────────────

export const subscribeNewsletter = async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
};

export default api;