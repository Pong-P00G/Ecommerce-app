import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });

// User Profile
export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (profileData) => api.put('/user/profile', profileData);

// Admin User Management
export const getAllUsers = () => api.get('/user');
export const createUsers = () => api.post(`/user`);
export const updateUser = (id, userData) => api.put(`/user/${id}`, userData);
export const deleteUser = (id) => api.delete(`/user/${id}`);

// Analytics
export const getAnalyticsKpis = () => api.get('/analytics/kpis');
export const getRevenueTrend = () => api.get('/analytics/revenue-trend');
export const getTrafficSources = () => api.get('/analytics/traffic-sources');
export const getTopPages = () => api.get('/analytics/top-pages');

// Reports
export const getReport = (reportData) => api.post('/reports', reportData);


// Products
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductCategory = (category) => api.get(`/products/category/${category}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (itemData) => api.post('/cart', itemData);
export const updateCartItem = (itemData) => api.put('/cart', itemData);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');

// Wishlist
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (itemData) => api.post('/wishlist', itemData);
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);
