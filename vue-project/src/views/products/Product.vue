<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const { products, loading, error, categories } = storeToRefs(productStore);

// Local state
const searchQuery = ref('');
const selectedCategory = ref(null);
const selectedSort = ref('featured');
const priceRange = ref([0, 1000]);
const showFilters = ref(false);

// Pagination
const currentPage = ref(1);
const pageSize = ref(12);

// Sort options
const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' }
];

// Computed
const filteredProducts = computed(() => {
    let result = products.value || [];

    // Search filter
    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase();
        result = result.filter(p =>
            p.product_name?.toLowerCase().includes(search) ||
            p.category_name?.toLowerCase().includes(search)
        );
    }

    // Category filter
    if (selectedCategory.value) {
        result = result.filter(p => p.category_name === selectedCategory.value);
    }

    // Price range filter
    result = result.filter(p => {
        const price = parseFloat(p.final_price || 0);
        return price >= priceRange.value[0] && price <= priceRange.value[1];
    });

    // Only show active products
    result = result.filter(p => p.product_status === 'active');

    return result;
});

const sortedProducts = computed(() => {
    let result = [...filteredProducts.value];

    switch (selectedSort.value) {
        case 'newest':
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'price-low':
            result.sort((a, b) => parseFloat(a.final_price) - parseFloat(b.final_price));
            break;
        case 'price-high':
            result.sort((a, b) => parseFloat(b.final_price) - parseFloat(a.final_price));
            break;
        case 'name-asc':
            result.sort((a, b) => a.product_name.localeCompare(b.product_name));
            break;
        case 'name-desc':
            result.sort((a, b) => b.product_name.localeCompare(a.product_name));
            break;
    }

    return result;
});

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedProducts.value.slice(start, end);
});

const totalItems = computed(() => sortedProducts.value?.length || 0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1);
const hasProducts = computed(() => paginatedProducts.value?.length > 0);

const startIndex = computed(() => {
    if (totalItems.value === 0) return 0;
    return (currentPage.value - 1) * pageSize.value + 1;
});

const endIndex = computed(() => {
    if (totalItems.value === 0) return 0;
    return Math.min(currentPage.value * pageSize.value, totalItems.value);
});

const hasActiveFilters = computed(() => {
    return searchQuery.value ||
        selectedCategory.value ||
        priceRange.value[0] > 0 ||
        priceRange.value[1] < 1000;
});

const visiblePages = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
        if (start === 1) {
            end = Math.min(total, start + 4);
        } else {
            start = Math.max(1, end - 4);
        }
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// Methods
const loadProducts = async () => {
    await productStore.fetchAllProducts();
    await productStore.fetchCategories();
};

const handleSearch = () => {
    currentPage.value = 1;
};

const selectCategory = (categoryName) => {
    selectedCategory.value = categoryName;
    currentPage.value = 1;
    showFilters.value = false;
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = null;
    priceRange.value = [0, 1000];
    currentPage.value = 1;
};

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const viewProduct = (productId) => {
    router.push(`/product/${productId}`);
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

const getDiscountPercentage = (product) => {
    if (!product.discount_amount) return 0;
    const discount = parseFloat(product.discount_amount);
    const basePrice = parseFloat(product.base_price);
    return Math.round((discount / basePrice) * 100);
};

const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
};

// Watch route query for category
watch(() => route.query.category, (newCategory) => {
    if (newCategory) {
        selectedCategory.value = newCategory;
    }
}, { immediate: true });

// Lifecycle
onMounted(async () => {
    await loadProducts();
});
</script>

<template>
    <div class="min-h-screen bg-white">
        <!-- Hero Section -->
        <div class="bg-gray-50 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="text-center mt-8">
                    <h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">Shop Our Collection
                    </h1>
                    <p class="text-xl text-gray-600 font-light max-w-2xl mx-auto">Discover premium products for your
                        lifestyle</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Filters (Desktop) -->
                <aside class="hidden lg:block w-64 shrink-0">
                    <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-8 space-y-6">
                        <!-- Search -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                            <div class="relative">
                                <input v-model="searchQuery" @input="handleSearch" type="text"
                                    placeholder="Search products..."
                                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" />
                                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                            <div class="space-y-2">
                                <button @click="selectCategory(null)" :class="{
                                    'bg-gray-900 text-white': !selectedCategory,
                                    'bg-gray-50 text-gray-700 hover:bg-gray-100': selectedCategory
                                }" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                    All Products
                                </button>
                                <button v-for="category in categories" :key="category.category_id"
                                    @click="selectCategory(category.name)" :class="{
                                        'bg-gray-900 text-white': selectedCategory === category.name,
                                        'bg-gray-50 text-gray-700 hover:bg-gray-100': selectedCategory !== category.name
                                    }"
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                    {{ category.name }}
                                </button>
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                            <div class="space-y-3">
                                <input v-model.number="priceRange[0]" @change="currentPage = 1" type="range" min="0"
                                    max="1000" step="10" class="w-full" />
                                <input v-model.number="priceRange[1]" @change="currentPage = 1" type="range" min="0"
                                    max="1000" step="10" class="w-full" />
                                <div class="flex justify-between text-sm text-gray-600">
                                    <span>${{ priceRange[0] }}</span>
                                    <span>${{ priceRange[1] }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Clear Filters -->
                        <button v-if="hasActiveFilters" @click="clearFilters"
                            class="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                            Clear All Filters
                        </button>
                    </div>
                </aside>

                <!-- Main Products Area -->
                <div class="flex-1">
                    <!-- Mobile Filter Button -->
                    <div class="lg:hidden mb-6">
                        <button @click="showFilters = !showFilters"
                            class="w-full py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium flex items-center justify-center gap-2">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </button>
                    </div>

                    <!-- Toolbar -->
                    <div class="bg-white rounded-2xl shadow-sm p-4 mb-6">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <!-- Results Count -->
                            <div class="text-sm text-gray-600">
                                Showing <span class="font-semibold">{{ startIndex }}-{{ endIndex }}</span> of <span
                                    class="font-semibold">{{ totalItems }}</span> products
                            </div>

                            <!-- Sort -->
                            <div class="flex items-center gap-2">
                                <label class="text-sm text-gray-600">Sort by:</label>
                                <select v-model="selectedSort"
                                    class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white">
                                    <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex items-center justify-center py-20">
                        <div class="text-center">
                            <div
                                class="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4 mx-auto">
                            </div>
                            <p class="text-gray-500">Loading products...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="text-center py-20">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-gray-500 mb-4">{{ error }}</p>
                        <button @click="loadProducts"
                            class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                            Try Again
                        </button>
                    </div>

                    <!-- Products Grid -->
                    <div v-else-if="hasProducts">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div v-for="product in paginatedProducts" :key="product.product_id"
                                @click="viewProduct(product.product_id)"
                                class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                                <!-- Image -->
                                <div class="relative aspect-square bg-gray-100 overflow-hidden">
                                    <!-- Discount Badge -->
                                    <div v-if="product.discount_amount > 0" class="absolute top-4 left-4 z-10">
                                        <div
                                            class="px-3 py-1.5 bg-red-600 text-white font-bold text-sm rounded-lg shadow-lg">
                                            -{{ getDiscountPercentage(product) }}%
                                        </div>
                                    </div>

                                    <!-- Wishlist -->
                                    <button @click.stop
                                        class="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    <img :src="product.main_image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial, sans-serif%22 font-size=%2218%22 fill=%22%239ca3af%22%3ENo Image%3C/text%3E%3C/svg%3E'"
                                        :alt="product.product_name"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        @error="handleImageError" />
                                </div>

                                <!-- Info -->
                                <div class="p-5">
                                    <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                        {{ product.category_name || 'Uncategorized' }}
                                    </p>
                                    <h3
                                        class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700">
                                        {{ product.product_name }}
                                    </h3>
                                    <div class="flex items-center gap-2 mb-3">
                                        <span class="text-2xl font-bold text-gray-900">
                                            ${{ formatPrice(product.final_price) }}
                                        </span>
                                        <span v-if="product.discount_amount > 0"
                                            class="text-sm text-gray-400 line-through">
                                            ${{ formatPrice(product.base_price) }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                            <div class="w-2 h-2 rounded-full bg-green-600"></div>
                                            <span>{{ product.stock_status }}</span>
                                        </div>
                                        <button @click.stop="viewProduct(product.product_id)"
                                            class="text-sm text-gray-600 hover:text-gray-900 font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div
                            class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm">
                            <div class="flex items-center gap-2">
                                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                                    class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div class="flex items-center gap-1">
                                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="{
                                        'bg-gray-900 text-white': page === currentPage,
                                        'bg-white text-gray-700 hover:bg-gray-50': page !== currentPage
                                    }" class="min-w-10 h-10 rounded-lg border border-gray-200 font-medium text-sm">
                                        {{ page }}
                                    </button>
                                </div>

                                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                                    class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div class="text-sm text-gray-600">
                                Page {{ currentPage }} of {{ totalPages }}
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-20">
                        <svg class="mx-auto h-24 w-24 text-gray-300 mb-6" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p class="text-gray-500 mb-8">Try adjusting your filters or search terms</p>
                        <button @click="clearFilters"
                            class="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Filters Modal -->
        <div v-if="showFilters" @click="showFilters = false"
            class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center p-4">
            <div @click.stop
                class="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[80vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-gray-900">Filters</h3>
                    <button @click="showFilters = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Same filters as sidebar -->
                <div class="space-y-6">
                    <!-- Search -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                        <input v-model="searchQuery" type="text" placeholder="Search products..."
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
                    </div>

                    <!-- Categories -->
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                        <div class="space-y-2">
                            <button @click="selectCategory(null)" :class="{
                                'bg-gray-900 text-white': !selectedCategory,
                                'bg-gray-50 text-gray-700': selectedCategory
                            }" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium">
                                All Products
                            </button>
                            <button v-for="category in categories" :key="category.category_id"
                                @click="selectCategory(category.name)" :class="{
                                    'bg-gray-900 text-white': selectedCategory === category.name,
                                    'bg-gray-50 text-gray-700': selectedCategory !== category.name
                                }" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium">
                                {{ category.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                        <div class="space-y-3">
                            <input v-model.number="priceRange[0]" type="range" min="0" max="1000" step="10"
                                class="w-full" />
                            <input v-model.number="priceRange[1]" type="range" min="0" max="1000" step="10"
                                class="w-full" />
                            <div class="flex justify-between text-sm text-gray-600">
                                <span>${{ priceRange[0] }}</span>
                                <span>${{ priceRange[1] }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3 pt-4">
                        <button @click="clearFilters"
                            class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
                            Clear All
                        </button>
                        <button @click="showFilters = false"
                            class="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>