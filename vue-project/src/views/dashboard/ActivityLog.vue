<script setup>
import { ref, computed, onMounted } from 'vue';
import { dashboardAPI } from '../../api/dashboardApi.js';
import { useToast } from '../../composables/useToast.js';
import {
    Activity,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    UserPlus,
    Package,
    ShoppingBag,
    PackagePlus,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    ListChecks,
} from 'lucide-vue-next';

const toast = useToast();

const activities = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const typeFilter = ref('all');
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const pageSize = ref(20);

const typeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'user_registration', label: 'User Registrations' },
    { value: 'product_added', label: 'Products Added' },
    { value: 'stock', label: 'Stock Changes' },
    { value: 'order_created', label: 'New Orders' },
    { value: 'role_managed', label: 'Role & Permission Changes' },
];

const typeIcons = {
    user_registration: UserPlus,
    product_added: PackagePlus,
    stock_in: Package,
    stock_out: Package,
    stock_adjust: AlertTriangle,
    stock_return: Package,
    stock_damaged: AlertTriangle,
    order_created: ShoppingBag,
};

const typeStyles = {
    user_registration: 'bg-info/10 text-info border-info/20',
    product_added: 'bg-accent/10 text-accent border-accent/20',
    stock_in: 'bg-success/10 text-success border-success/20',
    stock_out: 'bg-warning/10 text-warning border-warning/20',
    stock_adjust: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    stock_return: 'bg-info/10 text-info border-info/20',
    stock_damaged: 'bg-danger/10 text-danger border-danger/20',
    order_created: 'bg-accent/10 text-accent border-accent/20',
    role_managed: 'bg-purple-100 text-purple-700 border-purple-200',
    permission_managed: 'bg-purple-100 text-purple-700 border-purple-200',
};

const filteredActivities = computed(() => {
    if (!searchQuery.value) return activities.value;
    const q = searchQuery.value.toLowerCase();
    return activities.value.filter(a =>
        (a.message || '').toLowerCase().includes(q) ||
        (a.user || '').toLowerCase().includes(q) ||
        (a.type_label || '').toLowerCase().includes(q)
    );
});

const fetchActivities = async () => {
    try {
        loading.value = true;
        error.value = null;
        const type = typeFilter.value !== 'all' ? typeFilter.value : null;
        const response = await dashboardAPI.getAllActivities(currentPage.value, pageSize.value, type);
        if (response.success) {
            activities.value = response.data.items || [];
            totalPages.value = response.data.totalPages || 1;
            totalItems.value = response.data.totalItems || 0;
        } else {
            error.value = response.message || 'Failed to load activities';
        }
    } catch (err) {
        console.error('Error fetching activities:', err);
        error.value = err.response?.data?.message || 'Failed to load activities';
    } finally {
        loading.value = false;
    }
};

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchActivities();
};

const changeTypeFilter = (type) => {
    typeFilter.value = type;
    currentPage.value = 1;
    fetchActivities();
};

const pageNumbers = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const maxVisible = 5;
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const formatTimestamp = (ts) => {
    if (!ts) return '-';
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(() => {
    fetchActivities();
});
</script>
<template>
    <div class="min-h-screen bg-neutral-100">
        <div class="section py-6 sm:py-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
                        <Activity class="w-3.5 h-3.5" />
                        Activity Log
                    </span>
                    <h1 class="text-2xl sm:text-3xl font-bold text-ink">Activity log</h1>
                    <p class="text-neutral-500 mt-1 text-sm">Track all system activity and changes</p>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="fetchActivities" class="btn-ghost text-sm gap-2" :disabled="loading">
                        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                        Refresh
                    </button>
                </div>
            </div>

            <!-- Filter Bar -->
            <div class="card-flat p-4 mb-6">
                <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div class="flex-1 w-full sm:max-w-xs">
                        <div class="relative">
                            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search activities..."
                                class="input-base pl-11 py-2.5 text-sm"
                            />
                        </div>
                    </div>
                    <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        <Filter class="w-4 h-4 text-neutral-400 shrink-0" />
                        <button
                            v-for="opt in typeOptions"
                            :key="opt.value"
                            @click="changeTypeFilter(opt.value)"
                            :class="[
                                'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all',
                                typeFilter === opt.value
                                    ? 'bg-ink text-paper'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            ]"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-if="error && activities.length === 0" class="card-flat border-l-4 border-danger p-6 mb-6">
                <div class="flex items-center gap-4">
                    <AlertCircle class="w-10 h-10 text-danger shrink-0" />
                    <div class="flex-1">
                        <p class="font-bold text-ink">Failed to load activities</p>
                        <p class="text-sm text-neutral-500 mt-1">{{ error }}</p>
                    </div>
                    <button @click="fetchActivities" class="btn-primary text-sm gap-2">
                        <RefreshCw class="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading && activities.length === 0" class="card-flat overflow-hidden">
                <div class="px-5 sm:px-6 py-3 bg-neutral-50 border-b border-neutral-200">
                    <div class="h-4 w-40 skeleton-shimmer rounded"></div>
                </div>
                <div class="divide-y divide-neutral-100">
                    <div v-for="i in 6" :key="'sk-act-' + i" class="px-5 sm:px-6 py-4">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 skeleton-shimmer rounded-full shrink-0"></div>
                            <div class="flex-1 min-w-0 space-y-2">
                                <div class="flex items-center gap-2">
                                    <div class="h-5 w-20 skeleton-shimmer rounded"></div>
                                </div>
                                <div class="h-3.5 w-3/4 skeleton-shimmer rounded"></div>
                                <div class="flex items-center gap-3">
                                    <div class="h-3 w-24 skeleton-shimmer rounded"></div>
                                    <div class="h-3 w-20 skeleton-shimmer rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && filteredActivities.length === 0" class="card-flat p-16">
                <div class="flex flex-col items-center justify-center gap-4">
                    <ListChecks class="w-16 h-16 text-neutral-300" />
                    <div class="text-center">
                        <h3 class="text-lg font-bold text-ink">
                            {{ searchQuery ? 'No matching activities' : 'No activities yet' }}
                        </h3>
                        <p class="text-sm text-neutral-500 mt-1">
                            {{ searchQuery ? 'Try a different search or filter' : 'Activities will appear here as they happen' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Activity List -->
            <div v-else class="card-flat divide-y divide-neutral-100">
                <div class="px-5 sm:px-6 py-3 bg-neutral-50 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                    <span>{{ totalItems }} total activities</span>
                    <span v-if="searchQuery" class="text-accent">{{ filteredActivities.length }} filtered</span>
                </div>

                <div v-for="activity in filteredActivities" :key="activity.id" class="px-5 sm:px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <div class="flex items-start gap-4">
                        <!-- Icon -->
                        <div :class="['w-10 h-10 rounded-full inline-flex items-center justify-center shrink-0', typeStyles[activity.type] || 'bg-neutral-100 text-neutral-500']">
                            <component :is="typeIcons[activity.type] || Activity" class="w-5 h-5" />
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border', typeStyles[activity.type] || 'bg-neutral-100 text-neutral-500 border-neutral-200']">
                                    {{ activity.type_label || activity.type }}
                                </span>
                            </div>
                            <p class="text-sm text-ink font-medium">{{ activity.message }}</p>
                            <div class="flex items-center gap-3 mt-1.5">
                                <span class="flex items-center gap-1.5 text-xs text-neutral-500">
                                    <Clock class="w-3.5 h-3.5" />
                                    {{ formatTimestamp(activity.created_at) }}
                                </span>
                                <span v-if="activity.user" class="flex items-center gap-1.5 text-xs text-neutral-500">
                                    <UserPlus class="w-3.5 h-3.5" />
                                    {{ activity.user }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                <p class="text-xs text-neutral-500 text-center sm:text-left">
                    Showing <span class="font-semibold text-ink">{{ (currentPage - 1) * 20 + 1 }}</span>
                    to <span class="font-semibold text-ink">{{ Math.min(currentPage * 20, totalItems) }}</span>
                    of <span class="font-semibold text-ink">{{ totalItems }}</span> activities
                </p>
                <div class="flex items-center justify-center gap-1">
                    <button
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage <= 1"
                        class="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                        aria-label="Previous page"
                    >
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                        <button
                            v-for="p in pageNumbers"
                            :key="p"
                            @click="goToPage(p)"
                            class="min-w-9 h-9 rounded-lg text-sm font-bold transition-all duration-150 active:scale-90"
                            :class="p === currentPage
                                ? 'bg-ink text-paper shadow-sm scale-105'
                                : 'text-neutral-500 hover:bg-neutral-100 hover:text-ink'"
                        >
                            {{ p }}
                        </button>
                    <button
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage >= totalPages"
                        class="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                        aria-label="Next page"
                    >
                        <ChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
