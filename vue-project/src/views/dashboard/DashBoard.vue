<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { useAuthStore } from '../../stores/auth.js';
import { storeToRefs } from 'pinia';
import { dashboardAPI } from '../../api/dashboardApi.js';

const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const { products, loading } = storeToRefs(productStore);

// Local state
const currentTime = ref(new Date());
const selectedPeriod = ref('today'); // today, week, month
const dashboardLoading = ref(false);
const error = ref(null);

// Update time every minute
setInterval(() => {
    currentTime.value = new Date();
}, 60000);

// Data from API
const dashboardStats = ref(null);
const activitiesLog = ref([]);

// Mock orders data (until order system is implemented)
const orders = ref([]);

const revenueData = ref({
    today: 0,
    week: 0,
    month: 0,
    growth: 0
});

// Computed
const greeting = computed(() => {
    const hour = currentTime.value.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
});

const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});

const formattedDate = computed(() => {
    return currentTime.value.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const totalProducts = computed(() => {
    if (dashboardStats.value?.products) {
        return dashboardStats.value.products.total_products || 0;
    }
    return products.value?.length || 0;
});

const activeProducts = computed(() => {
    if (dashboardStats.value?.products) {
        return dashboardStats.value.products.active_products || 0;
    }
    return products.value?.filter(p => p.product_status === 'active').length || 0;
});

const lowStockCount = computed(() => {
    if (dashboardStats.value?.products) {
        return dashboardStats.value.products.low_stock_count || 0;
    }
    return products.value?.filter(p => parseInt(p.total_stock) < 10 && parseInt(p.total_stock) > 0).length || 0;
});

const totalRevenue = computed(() => revenueData.value[selectedPeriod.value]);

const totalOrders = computed(() => orders.value.length);

const pendingOrders = computed(() =>
    orders.value.filter(o => o.status === 'pending' || o.status === 'processing').length
);

const recentOrders = computed(() => orders.value.slice(0, 4));

const topProducts = computed(() => {
    return products.value
        ?.filter(p => p.product_status === 'active')
        .sort((a, b) => parseFloat(b.final_price) - parseFloat(a.final_price))
        .slice(0, 3) || [];
});

// Methods
const loadDashboard = async () => {
    try {
        dashboardLoading.value = true;
        error.value = null;

        // Fetch all dashboard data in parallel
        const [statsResponse, activitiesResponse] = await Promise.all([
            dashboardAPI.getDashboardStats(),
            dashboardAPI.getRecentActivities(10)
        ]);

        // Update dashboard stats
        if (statsResponse.success) {
            dashboardStats.value = statsResponse.data;

            // Update revenue data from API
            if (statsResponse.data.revenue) {
                revenueData.value = statsResponse.data.revenue;
            }
        }

        // Update activities
        if (activitiesResponse.success) {
            activitiesLog.value = activitiesResponse.data;
        }

        // Also fetch products for the product list
        await productStore.fetchAllProducts();

    } catch (err) {
        console.error('Error loading dashboard:', err);
        error.value = err.message || 'Failed to load dashboard data';
    } finally {
        dashboardLoading.value = false;
    }
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

const getStatusColor = (status) => {
    const colors = {
        completed: 'from-green-500 to-green-600',
        processing: 'from-blue-500 to-blue-600',
        pending: 'from-yellow-500 to-yellow-600',
        shipped: 'from-purple-500 to-purple-600'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
};

const getStatusBadge = (status) => {
    const badges = {
        completed: 'bg-green-100 text-green-700',
        processing: 'bg-blue-100 text-blue-700',
        pending: 'bg-yellow-100 text-yellow-700',
        shipped: 'bg-purple-100 text-purple-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
};

const navigateTo = (path) => {
    router.push(path);
};

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/80?text=No+Image';
};

onMounted(async () => {
    await loadDashboard();
});
</script>

<template>
    <div class="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Welcome Header -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h1
                            class="text-4xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                            {{ greeting }}, {{ authStore.user?.username || 'Admin' }}! 👋
                        </h1>
                        <p class="text-gray-600 mt-2">{{ formattedDate }}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-gray-900">{{ formattedTime }}</div>
                        <div class="text-sm text-gray-500">Live Dashboard</div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading || dashboardLoading" class="flex items-center justify-center py-20">
                <div class="text-center">
                    <div
                        class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto">
                    </div>
                    <p class="text-gray-500">Loading dashboard...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <div class="flex items-center gap-3">
                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 class="text-red-900 font-semibold">Error Loading Dashboard</h3>
                        <p class="text-red-700 text-sm">{{ error }}</p>
                    </div>
                    <button @click="loadDashboard"
                        class="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Retry
                    </button>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div v-else class="space-y-6">
                <!-- Revenue Card (Large Featured) -->
                <div
                    class="bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                    <!-- Decorative Elements -->
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

                    <div class="relative z-10">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <div class="flex items-center gap-3 mb-2">
                                    <div
                                        class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
                                        <p class="text-xs text-blue-200">{{ selectedPeriod === 'today' ? 'Today' :
                                            selectedPeriod === 'week' ? 'This Week' : 'This Month' }}</p>
                                    </div>
                                </div>
                                <div class="flex items-baseline gap-3">
                                    <h2 class="text-5xl font-bold">${{ formatPrice(totalRevenue) }}</h2>
                                    <div
                                        class="flex items-center gap-1 px-3 py-1 bg-green-500 bg-opacity-30 rounded-full">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span class="text-sm font-semibold">+{{ revenueData.growth }}%</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Period Selector -->
                            <div class="flex gap-2">
                                <button v-for="period in ['today', 'week', 'month']" :key="period"
                                    @click="selectedPeriod = period" :class="{
                                        'bg-white text-blue-700': selectedPeriod === period,
                                        'bg-white bg-opacity-20 text-white hover:bg-opacity-30': selectedPeriod !== period
                                    }" class="px-4 py-2 rounded-xl font-medium text-sm transition-all capitalize">
                                    {{ period }}
                                </button>
                            </div>
                        </div>

                        <!-- Quick Stats Row -->
                        <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white border-opacity-20">
                            <div>
                                <p class="text-blue-100 text-sm mb-1">Orders</p>
                                <p class="text-2xl font-bold">{{ totalOrders }}</p>
                            </div>
                            <div>
                                <p class="text-blue-100 text-sm mb-1">Pending</p>
                                <p class="text-2xl font-bold">{{ pendingOrders }}</p>
                            </div>
                            <div>
                                <p class="text-blue-100 text-sm mb-1">Products</p>
                                <p class="text-2xl font-bold">{{ totalProducts }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Action Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Add Product -->
                    <button @click="navigateTo('/admin/add-product')"
                        class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-blue-500">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-gray-600 text-sm">Quick Action</p>
                                <p class="font-bold text-gray-900">Add Product</p>
                            </div>
                        </div>
                    </button>

                    <!-- Manage Stock -->
                    <button @click="navigateTo('/admin/manage-stock')"
                        class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-orange-500">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-gray-600 text-sm">Inventory</p>
                                <p class="font-bold text-gray-900">Manage Stock</p>
                            </div>
                        </div>
                        <div v-if="lowStockCount > 0"
                            class="mt-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full inline-block">
                            {{ lowStockCount }} items low
                        </div>
                    </button>

                    <!-- View Reports -->
                    <button @click="navigateTo('/admin/analytics')"
                        class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-purple-500">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-gray-600 text-sm">Insights</p>
                                <p class="font-bold text-gray-900">Analytics</p>
                            </div>
                        </div>
                    </button>

                    <!-- Manage Users -->
                    <button @click="navigateTo('/admin/manage-user')"
                        class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-green-500">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-gray-600 text-sm">Team</p>
                                <p class="font-bold text-gray-900">Manage Users</p>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Recent Orders -->
                    <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl font-bold text-gray-900">Recent Orders</h2>
                            <button @click="navigateTo('/admin/orders')"
                                class="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                                View All
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div v-if="recentOrders.length === 0" class="text-center py-12">
                                <svg class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p class="text-gray-500">No orders yet</p>
                                <p class="text-sm text-gray-400 mt-1">Orders will appear here once customers place them
                                </p>
                            </div>

                            <div v-else v-for="order in recentOrders" :key="order.id"
                                class="group flex items-center justify-between p-4 rounded-xl hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer border border-transparent hover:border-blue-200">
                                <div class="flex items-center gap-4 flex-1">
                                    <div
                                        :class="`w-12 h-12 bg-linear-to-br ${getStatusColor(order.status)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`">
                                        #{{ order.id.toString().slice(-2) }}
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-semibold text-gray-900">{{ order.customer }}</p>
                                        <div class="flex items-center gap-3 mt-1">
                                            <span :class="getStatusBadge(order.status)"
                                                class="px-2 py-0.5 text-xs font-semibold rounded-full capitalize">
                                                {{ order.status }}
                                            </span>
                                            <span class="text-xs text-gray-500">{{ order.time }}</span>
                                            <span class="text-xs text-gray-500">{{ order.items }} items</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-xl font-bold text-gray-900">${{ formatPrice(order.amount) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Feed -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

                        <div class="space-y-4">
                            <div v-if="activitiesLog.length === 0" class="text-center py-12">
                                <svg class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-gray-500">No recent activity</p>
                                <p class="text-sm text-gray-400 mt-1">Activity will appear as you manage your store</p>
                            </div>

                            <div v-else v-for="(activity, index) in activitiesLog" :key="index"
                                class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div class="text-2xl">{{ activity.icon }}</div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 leading-relaxed">{{ activity.message }}</p>
                                    <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Products -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-bold text-gray-900">Top Products</h2>
                        <button @click="navigateTo('/admin/manage-products')"
                            class="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                            View All
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="(product, index) in topProducts" :key="product.product_id"
                            class="group relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 p-6 hover:shadow-xl transition-all cursor-pointer">
                            <!-- Rank Badge -->
                            <div
                                class="absolute top-4 right-4 w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                {{ index + 1 }}
                            </div>

                            <div class="aspect-square bg-white rounded-xl overflow-hidden mb-4 shadow-md">
                                <img :src="product.main_image || 'https://via.placeholder.com/200'"
                                    :alt="product.product_name"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    @error="handleImageError" />
                            </div>

                            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ product.category_name }}
                            </p>
                            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">{{ product.product_name }}</h3>

                            <div class="flex items-center justify-between">
                                <span
                                    class="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    ${{ formatPrice(product.final_price) }}
                                </span>
                                <span class="text-sm text-gray-500">{{ product.total_stock }} in stock</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>