import api from "../api";

// 11 Endpoint
export const productAPI = {
    // Get All Product
    async getAllProducts() {
        const { data } = await api.get('/products');
        return data;
    },

    // Get paginated product
    async getPaginatedProduct(params = {}) {
        const { page = 1, pageSize = 10, search, category, minPrice, maxPrice, status, stockStatus, sortField, sortDirection } = params;
    
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
        if (status) queryParams.append('status', status);
        if (stockStatus) queryParams.append('stockStatus', stockStatus);
        if (sortField) queryParams.append('sortField', sortField);
        if (sortDirection) queryParams.append('sortDirection', sortDirection);
        
        const { data } = await api.get(`/products/paginated?${queryParams}`);
        return data.data;
    },

    // Search product 
    async searchProducts(filters = {}) {
        const { search, category, minPrice, maxPrice, status } = filters;
        
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
        if (status) queryParams.append('status', status);
        
        const { data } = await api.get(`/products/search?${queryParams}`);
        return data;
    },

    // Get product by ID
    async getProductById(productId) {
        const { data } = await api.get(`/products/${productId}`);
        return data;
    },


    // Get products by category
    async getProductsByCategory(categoryName) {
        const { data } = await api.get(`/products/category/${categoryName}`);
        return data;
    },


    // Get featured products
    async getFeaturedProducts(limit = 10) {
        const { data } = await api.get(`/products/featured?limit=${limit}`);
        return data;
    },

    // Get new arrivals
    async getNewArrivals(limit = 10) {
        const { data } = await api.get(`/products/new-arrivals?limit=${limit}`);
        return data;
    },

    // Get coming soon products
    async getComingSoon(limit = 10) {
        const { data } = await api.get(`/products/coming-soon?limit=${limit}`);
        return data;
    },

    // Get best sellers
    async getBestSellers(limit = 10) {
        const { data } = await api.get(`/products/best-sellers?limit=${limit}`);
        return data;
    },

    // Get products by tag (e.g. 'coming_soon', 'new_arrival')
    async getProductsByTag(tag, limit = 10) {
        const { data } = await api.get(`/products/by-tag?tag=${encodeURIComponent(tag)}&limit=${limit}`);
        return data;
    },


    // Create complete product (Admin only)

    async createCompleteProduct(productData) {
        const { data } = await api.post('/products/complete', productData);
        return data;
    },

    // Create basic product (Admin only)

    async createProduct(productData) {
        const { data } = await api.post('/products', productData);
        return data;
    },

    /**
     * Update product (Admin only)
     */
    async updateProduct(productId, productData) {
        const { data } = await api.put(`/products/${productId}`, productData);
        return data;
    },


    // Delete product (Admin only)

    async deleteProduct(productId, force = false) {
        const { data } = await api.delete(`/products/${productId}`, {
            params: { force: force ? 'true' : 'false' }
        });
        return data;
    },


    // Bulk create products (Admin only)

    async bulkCreateProducts(productsArray) {
        const { data } = await api.post('/products/bulk', { products: productsArray });
        return data;
    },
};