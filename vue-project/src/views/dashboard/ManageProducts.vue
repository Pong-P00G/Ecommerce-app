<script setup>
import { ref, computed, onMounted } from 'vue';
import { productAPI } from '../../api/products/productApi';
import { categoryAPI } from '../../api/products/categoryApi';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const filterCategory = ref('all');
const filterStatus = ref('all');
const showDeleteModal = ref(false);
const selectedProduct = ref(null);

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalProducts = ref(0);

// Fetch products
const fetchProducts = async () => {
    try {
        loading.value = true;
        error.value = null;

        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            search: searchQuery.value || undefined,
            category: filterCategory.value !== 'all' ? filterCategory.value : undefined,
            status: filterStatus.value !== 'all' ? filterStatus.value : undefined
        };

        const response = await productAPI.getPaginatedProduct(params);

        // Backend returns: { page, pageSize, totalItems, totalPages, items }
        products.value = response.items || [];
        totalProducts.value = response.totalItems || 0;
    } catch (err) {
        console.error('Error fetching products:', err);
        error.value = err.message || 'Failed to load products';
    } finally {
        loading.value = false;
    }
};

// Fetch categories for filter
const fetchCategories = async () => {
    try {
        const response = await categoryAPI.getAllCategories();
        // Backend returns: { success, count, data }
        categories.value = response.data || response || [];
    } catch (err) {
        console.error('Error fetching categories:', err);
    }
};

// Computed
const filteredProducts = computed(() => {
    return products.value;
});

const totalPages = computed(() => {
    return Math.ceil(totalProducts.value / pageSize.value);
});

const activeProducts = computed(() => {
    return products.value.filter(p => p.product_status === 'active').length;
});

const draftProducts = computed(() => {
    return products.value.filter(p => p.product_status === 'draft').length;
});

const inactiveProducts = computed(() => {
    return products.value.filter(p => p.product_status === 'inactive').length;
});

// Methods
const handleSearch = () => {
    currentPage.value = 1;
    fetchProducts();
};

const handleFilter = () => {
    currentPage.value = 1;
    fetchProducts();
};

const goToPage = (page) => {
    currentPage.value = page;
    fetchProducts();
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchProducts();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchProducts();
    }
};

const openAddProduct = () => {
    router.push({ name: 'addproduct' });
};

const openEditProduct = (product) => {
    router.push({ name: 'addproduct', query: { edit: product.product_id } });
};

const openDeleteModal = (product) => {
    selectedProduct.value = product;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    selectedProduct.value = null;
};

const confirmDelete = async () => {
    try {
        loading.value = true;
        await productAPI.deleteProduct(selectedProduct.value.product_id);
        alert('Product deleted successfully!');
        closeDeleteModal();
        await fetchProducts();
    } catch (err) {
        console.error('Error deleting product:', err);
        alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
        loading.value = false;
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'draft':
            return 'bg-yellow-100 text-yellow-700';
        case 'inactive':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-neutral-100 text-neutral-700';
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const truncateText = (text, length = 50) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

// Lifecycle
onMounted(() => {
    fetchProducts();
    fetchCategories();
});
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-ink">Product Management</h1>
                    <p class="text-neutral-600 mt-1 text-sm sm:text-base">Manage your product inventory</p>
                </div>
                <button @click="openAddProduct"
                    class="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-ink text-white rounded-lg hover:bg-neutral-800 transition-colors font-semibold text-sm">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div class="bg-paper rounded-2xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p class="text-neutral-600 text-sm mb-1">Total Products</p>
                    <p class="text-3xl font-bold text-ink">{{ totalProducts }}</p>
                </div>

                <div class="bg-paper rounded-2xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p class="text-neutral-600 text-sm mb-1">Active Products</p>
                    <p class="text-3xl font-bold text-ink">{{ activeProducts }}</p>
                </div>

                <div class="bg-paper rounded-2xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                    </div>
                    <p class="text-neutral-600 text-sm mb-1">Draft Products</p>
                    <p class="text-3xl font-bold text-ink">{{ draftProducts }}</p>
                </div>

                <div class="bg-paper rounded-2xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    </div>
                    <p class="text-neutral-600 text-sm mb-1">Inactive Products</p>
                    <p class="text-3xl font-bold text-ink">{{ inactiveProducts }}</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-paper rounded-2xl shadow-sm p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="md:col-span-2">
                        <div class="relative">
                            <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                                placeholder="Search products..." :disabled="loading"
                                class="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50" />
                            <svg class="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Category Filter -->
                    <select v-model="filterCategory" @change="handleFilter" :disabled="loading"
                        class="px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-paper disabled:opacity-50">
                        <option value="all">All Categories</option>
                        <option v-for="category in categories" :key="category.category_id" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>

                    <!-- Status Filter -->
                    <select v-model="filterStatus" @change="handleFilter" :disabled="loading"
                        class="px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-paper disabled:opacity-50">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <!-- Error State -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <div class="flex items-center gap-3">
                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 class="text-red-900 font-semibold">Error Loading Products</h3>
                        <p class="text-red-700 text-sm">{{ error }}</p>
                    </div>
                    <button @click="fetchProducts"
                        class="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Retry
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading && products.length === 0" class="bg-paper rounded-2xl shadow-sm p-12 text-center">
                <div
                    class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto">
                </div>
                <p class="text-neutral-500">Loading products...</p>
            </div>

            <!-- Products Table -->
            <div v-else class="bg-paper rounded-2xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[800px]">
                        <thead class="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Product
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Category
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Price</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Created
                                </th>
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr v-for="product in filteredProducts" :key="product.product_id"
                                class="hover:bg-neutral-50 transition-colors">
                                <!-- Product -->
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                            <img v-if="product.image_url" :src="product.image_url"
                                                :alt="product.product_name" class="w-full h-full object-cover" />
                                            <div v-else class="w-full h-full flex items-center justify-center">
                                                <svg class="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-ink">{{ product.product_name }}</p>
                                            <p class="text-sm text-neutral-500">{{ truncateText(product.description, 40) }}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <!-- Category -->
                                <td class="px-6 py-4">
                                    <span
                                        class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                        {{ product.category_name || 'N/A' }}
                                    </span>
                                </td>

                                <!-- Price -->
                                <td class="px-6 py-4">
                                    <span class="text-sm font-semibold text-ink">{{ formatPrice(product.base_price)
                                        }}</span>
                                </td>

                                <!-- Status -->
                                <td class="px-6 py-4">
                                    <span :class="getStatusClass(product.product_status)"
                                        class="px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                        {{ product.product_status }}
                                    </span>
                                </td>

                                <!-- Created -->
                                <td class="px-6 py-4">
                                    <span class="text-sm text-neutral-600">{{ formatDate(product.created_at) }}</span>
                                </td>

                                <!-- Actions -->
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="openEditProduct(product)"
                                            class="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                                            Edit
                                        </button>
                                        <button @click="openDeleteModal(product)"
                                            class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div v-if="filteredProducts.length === 0 && !loading" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-neutral-500">No products found</p>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="border-t border-neutral-200 px-4 sm:px-6 py-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div class="text-sm text-neutral-600 text-center sm:text-left">
                            Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize,
                                totalProducts) }}
                            of {{ totalProducts }} products
                        </div>
                        <div class="flex items-center justify-center gap-2 flex-wrap">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Previous
                            </button>
                            <div class="flex items-center gap-1">
                                <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                                    :class="page === currentPage ? 'bg-ink text-white' : 'bg-paper text-neutral-700 hover:bg-neutral-50'"
                                    class="px-3 sm:px-4 py-2 border border-neutral-200 rounded-lg transition-colors text-sm">
                                    {{ page }}
                                </button>
                            </div>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" @click="closeDeleteModal"
            class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="bg-paper rounded-2xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div class="text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-ink mb-2">Delete Product</h3>
                    <p class="text-neutral-600 mb-6">
                        Are you sure you want to delete "<strong>{{ selectedProduct?.product_name }}</strong>"? This
                        action cannot
                        be undone.
                    </p>
                    <div class="flex gap-3">
                        <button @click="closeDeleteModal"
                            class="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-semibold">
                            Cancel
                        </button>
                        <button @click="confirmDelete" :disabled="loading"
                            class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
