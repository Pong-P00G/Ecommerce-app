<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { useAuthStore } from '../../stores/auth.js';
import { storeToRefs } from 'pinia';
import { dashboardAPI } from '../../api/dashboardApi.js';
import {
    Plus,
    Boxes,
    BarChart3,
    Users,
    DollarSign,
    TrendingUp,
    ArrowRight,
    ShoppingBag,
    Clock,
    Sparkles,
    Package,
    RefreshCw,
    AlertCircle,
} from 'lucide-vue-next';

const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const { products, loading } = storeToRefs(productStore);

const currentTime = ref(new Date());
const selectedPeriod = ref('today');
const dashboardLoading = ref(false);
const error = ref(null);

setInterval(() => {
    currentTime.value = new Date();
}, 60000);

const dashboardStats = ref(null);
const activitiesLog = ref([]);
const orders = ref([]);

const revenueData = ref({ today: 0, week: 0, month: 0, growth: 0 });

const greeting = computed(() => {
    const hour = currentTime.value.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
});

const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
});

const formattedDate = computed(() => {
    return currentTime.value.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const totalProducts = computed(() => dashboardStats.value?.products?.total_products ?? products.value?.length ?? 0);

const activeProducts = computed(() => dashboardStats.value?.products?.active_products ?? products.value?.filter(p => p.product_status === 'active').length ?? 0);

const lowStockCount = computed(() => dashboardStats.value?.products?.low_stock_count ?? products.value?.filter(p => parseInt(p.total_stock) < 10 && parseInt(p.total_stock) > 0).length ?? 0);

const totalRevenue = computed(() => revenueData.value[selectedPeriod.value]);
const totalOrders = computed(() => orders.value.length);
const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending' || o.status === 'processing').length);

const recentOrders = computed(() => orders.value.slice(0, 4));

const topProducts = computed(() => {
    return products.value
        ?.filter(p => p.product_status === 'active')
        .sort((a, b) => parseFloat(b.final_price) - parseFloat(a.final_price))
        .slice(0, 3) || [];
});

const loadDashboard = async () => {
    try {
        dashboardLoading.value = true;
        error.value = null;

        const [statsResponse, activitiesResponse] = await Promise.all([
            dashboardAPI.getDashboardStats(),
            dashboardAPI.getRecentActivities(10)
        ]);

        if (statsResponse.success) {
            dashboardStats.value = statsResponse.data;
            if (statsResponse.data.revenue) revenueData.value = statsResponse.data.revenue;
        }
        if (activitiesResponse.success) activitiesLog.value = activitiesResponse.data;
        await productStore.fetchAllProducts();
    } catch (err) {
        console.error('Error loading dashboard:', err);
        error.value = err.message || 'Failed to load dashboard data';
    } finally {
        dashboardLoading.value = false;
    }
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

const getStatusBadge = (status) => {
    const map = {
        completed: 'bg-success/10 text-success',
        processing: 'bg-info/10 text-info',
        pending: 'bg-warning/10 text-warning',
        shipped: 'bg-accent/10 text-accent',
    };
    return map[status] || 'bg-neutral-100 text-neutral-700';
};

const navigateTo = (path) => router.push(path);

const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23f4f4f5"/%3C/svg%3E';
};

onMounted(loadDashboard);
</script>

<template>
    <div class="bg-neutral-100 min-h-screen">
        <div class="section py-8">
            <!-- Welcome Header -->
            <div class="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
                        <Sparkles class="w-3.5 h-3.5" />
                        {{ formattedDate }}
                    </span>
                    <h1 class="heading-hero text-4xl md:text-5xl text-ink">
                        {{ greeting }}, {{ authStore.user?.username || 'Admin' }}
                    </h1>
                </div>
                <div class="text-right">
                    <p class="text-3xl font-bold text-ink tabular-nums">{{ formattedTime }}</p>
                    <p class="text-xs uppercase tracking-[0.2em] font-bold text-neutral-500 mt-1">Live dashboard</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading || dashboardLoading" class="flex items-center justify-center py-20">
                <div class="text-center">
                    <div class="w-12 h-12 border-4 border-neutral-200 border-t-accent rounded-full animate-spin mb-4 mx-auto"></div>
                    <p class="text-neutral-500 text-sm">Loading dashboard...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="card-flat p-6 mb-6 border-l-4 border-l-danger">
                <div class="flex items-center gap-3">
                    <AlertCircle class="h-6 w-6 text-danger shrink-0" />
                    <div class="flex-1">
                        <h3 class="text-ink font-bold">Error loading dashboard</h3>
                        <p class="text-neutral-600 text-sm">{{ error }}</p>
                    </div>
                    <button @click="loadDashboard" class="btn-primary">
                        <RefreshCw class="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div v-else class="space-y-6">
                <!-- Revenue Card (Large Featured) -->
                <div class="bg-ink text-paper rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full -mr-36 -mt-36"></div>
                    <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full -ml-24 -mb-24"></div>

                    <div class="relative z-10">
                        <div class="flex items-start justify-between mb-6 flex-wrap gap-6">
                            <div>
                                <div class="flex items-center gap-3 mb-3">
                                    <div class="w-11 h-11 rounded-xl bg-accent/20 inline-flex items-center justify-center">
                                        <DollarSign class="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p class="text-neutral-400 text-xs uppercase tracking-[0.2em] font-bold">Total revenue</p>
                                        <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mt-0.5">
                                            {{ selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This week' : 'This month' }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-baseline gap-3 flex-wrap">
                                    <h2 class="text-5xl md:text-6xl font-bold tabular-nums">{{ '$' }}{{ formatPrice(totalRevenue) }}</h2>
                                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full text-sm font-bold">
                                        <TrendingUp class="w-3.5 h-3.5" />
                                        +{{ revenueData.growth }}%
                                    </span>
                                </div>
                            </div>

                            <!-- Period Selector -->
                            <div class="inline-flex bg-paper/10 rounded-full p-1">
                                <button
                                    v-for="period in ['today', 'week', 'month']"
                                    :key="period"
                                    @click="selectedPeriod = period"
                                    :class="[
                                        'px-4 py-2 rounded-full font-semibold text-sm capitalize transition-all',
                                        selectedPeriod === period ? 'bg-paper text-ink' : 'text-paper hover:bg-paper/10'
                                    ]"
                                >
                                    {{ period }}
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                            <div>
                                <p class="text-neutral-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Orders</p>
                                <p class="text-2xl font-bold tabular-nums">{{ totalOrders }}</p>
                            </div>
                            <div>
                                <p class="text-neutral-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Pending</p>
                                <p class="text-2xl font-bold tabular-nums">{{ pendingOrders }}</p>
                            </div>
                            <div>
                                <p class="text-neutral-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Products</p>
                                <p class="text-2xl font-bold tabular-nums">{{ totalProducts }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Action Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        @click="navigateTo('/admin/add-product')"
                        class="card-base p-5 text-left hover:border-ink group"
                    >
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-ink text-paper group-hover:bg-accent inline-flex items-center justify-center transition-colors shrink-0">
                                <Plus class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Quick action</p>
                                <p class="font-bold text-ink">Add product</p>
                            </div>
                        </div>
                    </button>

                    <button
                        @click="navigateTo('/admin/manage-stock')"
                        class="card-base p-5 text-left hover:border-ink group relative"
                    >
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-accent text-paper inline-flex items-center justify-center shrink-0">
                                <Boxes class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Inventory</p>
                                <p class="font-bold text-ink">Manage stock</p>
                            </div>
                        </div>
                        <span v-if="lowStockCount > 0" class="absolute top-3 right-3 badge-ghost text-[10px] !px-2 !py-0.5 bg-accent text-paper border-none">
                            {{ lowStockCount }} low
                        </span>
                    </button>

                    <button
                        @click="navigateTo('/admin/analytics')"
                        class="card-base p-5 text-left hover:border-ink group"
                    >
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-ink text-paper group-hover:bg-accent inline-flex items-center justify-center transition-colors shrink-0">
                                <BarChart3 class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Insights</p>
                                <p class="font-bold text-ink">Analytics</p>
                            </div>
                        </div>
                    </button>

                    <button
                        @click="navigateTo('/admin/manage-user')"
                        class="card-base p-5 text-left hover:border-ink group"
                    >
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-ink text-paper group-hover:bg-accent inline-flex items-center justify-center transition-colors shrink-0">
                                <Users class="w-6 h-6" />
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Team</p>
                                <p class="font-bold text-ink">Manage users</p>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Recent Orders -->
                    <div class="lg:col-span-2 card-flat p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <span class="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Activity</span>
                                <h2 class="font-elegant font-bold text-xl text-ink mt-1">Recent orders</h2>
                            </div>
                            <button @click="navigateTo('/admin/orders')" class="text-sm font-bold text-accent hover:text-accent-600 inline-flex items-center gap-1 transition-colors">
                                View all
                                <ArrowRight class="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div class="space-y-3">
                            <div v-if="recentOrders.length === 0" class="text-center py-14">
                                <div class="w-16 h-16 rounded-full bg-neutral-100 inline-flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag class="w-8 h-8 text-neutral-400" />
                                </div>
                                <p class="text-neutral-500 font-medium">No orders yet</p>
                                <p class="text-sm text-neutral-400 mt-1">Orders will appear here once customers place them.</p>
                            </div>

                            <div
                                v-else
                                v-for="order in recentOrders"
                                :key="order.id"
                                class="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
                            >
                                <div class="flex items-center gap-4 flex-1 min-w-0">
                                    <div class="w-11 h-11 rounded-xl bg-ink text-paper flex items-center justify-center font-bold text-sm shrink-0">
                                        #{{ order.id.toString().slice(-2) }}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-bold text-ink truncate">{{ order.customer }}</p>
                                        <div class="flex items-center gap-3 mt-1 flex-wrap">
                                            <span :class="['px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full', getStatusBadge(order.status)]">
                                                {{ order.status }}
                                            </span>
                                            <span class="text-xs text-neutral-500">{{ order.time }}</span>
                                            <span class="text-xs text-neutral-500">{{ order.items }} items</span>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-lg font-bold text-ink tabular-nums shrink-0">{{ '$' }}{{ formatPrice(order.amount) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Feed -->
                    <div class="card-flat p-6">
                        <span class="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Live feed</span>
                        <h2 class="font-elegant font-bold text-xl text-ink mt-1 mb-6">Recent activity</h2>

                        <div class="space-y-4">
                            <div v-if="activitiesLog.length === 0" class="text-center py-14">
                                <Clock class="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                <p class="text-neutral-500 font-medium">No recent activity</p>
                                <p class="text-xs text-neutral-400 mt-1">Activity will appear as you manage your store.</p>
                            </div>

                            <div
                                v-else
                                v-for="(activity, index) in activitiesLog"
                                :key="index"
                                class="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                            >
                                <div class="text-xl">{{ activity.icon }}</div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-ink leading-relaxed">{{ activity.message }}</p>
                                    <p class="text-xs text-neutral-500 mt-1">{{ activity.time }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Products -->
                <div class="card-flat p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <span class="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Best sellers</span>
                            <h2 class="font-elegant font-bold text-xl text-ink mt-1">Top products</h2>
                        </div>
                        <button @click="navigateTo('/admin/manage-products')" class="text-sm font-bold text-accent hover:text-accent-600 inline-flex items-center gap-1 transition-colors">
                            View all
                            <ArrowRight class="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div
                            v-for="(product, index) in topProducts"
                            :key="product.product_id"
                            class="relative card-flat p-5 hover:border-ink cursor-pointer group overflow-hidden"
                        >
                            <div class="absolute top-4 right-4 w-9 h-9 bg-accent text-paper rounded-full inline-flex items-center justify-center font-bold text-sm">
                                {{ index + 1 }}
                            </div>
                            <div class="aspect-square bg-neutral-100 rounded-xl overflow-hidden mb-4">
                                <img
                                    :src="product.main_image"
                                    :alt="product.product_name"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    @error="handleImageError"
                                />
                            </div>
                            <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1">{{ product.category_name }}</p>
                            <h3 class="font-bold text-ink mb-2 line-clamp-2">{{ product.product_name }}</h3>
                            <div class="flex items-baseline justify-between">
                                <span class="text-xl font-bold text-accent tabular-nums">{{ '$' }}{{ formatPrice(product.final_price) }}</span>
                                <span class="text-xs text-neutral-500">{{ product.total_stock }} in stock</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
