import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
});

// Add token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token"); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if we're already on the login/register endpoint
            // (login returns 401 for bad credentials — that's expected, not a session expiry)
            const requestUrl = error.config?.url || '';
            const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
            
            if (!isAuthRequest) {
                // Session expired — clear token and redirect to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;