<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { dashboardAPI } from '../../api/dashboardApi.js';

const timeframe = ref('month'); // week, month, year
const loading = ref(false);
const error = ref(null);

// Data from API
const analyticsData = ref(null);

// Computed
const salesData = computed(() => analyticsData.value?.sales_trend || []);
const productPerformance = computed(() => analyticsData.value?.product_performance || []);
const categoryData = computed(() => analyticsData.value?.category_data || []);

const totalSales = computed(() =>
  analyticsData.value?.summary?.total_revenue || 0
);

const totalOrders = computed(() =>
  analyticsData.value?.summary?.total_orders || 0
);

const totalCustomers = computed(() =>
  analyticsData.value?.summary?.total_customers || 0
);

const averageOrderValue = computed(() =>
  analyticsData.value?.summary?.average_order_value || 0
);

const maxSales = computed(() => {
  if (salesData.value.length === 0) return 0;
  return Math.max(...salesData.value.map(d => d.sales || 0));
});

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

// Fetch analytics data
const fetchAnalytics = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await dashboardAPI.getAnalytics(timeframe.value);
    if (response.success) {
      analyticsData.value = response.data;
    }
  } catch (err) {
    console.error('Error fetching analytics:', err);
    error.value = err.message || 'Failed to load analytics data';
  } finally {
    loading.value = false;
  }
};

// Watch timeframe changes
watch(timeframe, () => {
  fetchAnalytics();
});

onMounted(() => {
  fetchAnalytics();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
          <p class="text-gray-600 mt-1">Track your store performance</p>
        </div>
        <select v-model="timeframe" :disabled="loading"
          class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white disabled:opacity-50">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto">
          </div>
          <p class="text-gray-500">Loading analytics...</p>
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
            <h3 class="text-red-900 font-semibold">Error Loading Analytics</h3>
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
          <button @click="fetchAnalytics"
            class="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>

      <!-- Analytics Content -->
      <div v-else>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-sm text-green-600 font-semibold">+15.3%</span>
            </div>
            <p class="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900">${{ formatPrice(totalSales) }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span class="text-sm text-blue-600 font-semibold">+12.5%</span>
            </div>
            <p class="text-gray-600 text-sm mb-1">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalOrders }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="text-sm text-purple-600 font-semibold">+8.2%</span>
            </div>
            <p class="text-gray-600 text-sm mb-1">Total Customers</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalCustomers }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="text-sm text-orange-600 font-semibold">+5.4%</span>
            </div>
            <p class="text-gray-600 text-sm mb-1">Avg Order Value</p>
            <p class="text-3xl font-bold text-gray-900">${{ formatPrice(averageOrderValue) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Sales Trend Chart -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Sales Trend</h2>

            <div class="space-y-4">
              <div v-for="data in salesData" :key="data.period" class="flex items-center gap-4">
                <span class="text-sm font-medium text-gray-600 w-16">{{ data.period }}</span>
                <div class="flex-1 bg-gray-100 rounded-lg h-12 relative overflow-hidden">
                  <div :style="{ width: `${(data.sales / maxSales) * 100}%` }"
                    class="bg-linear-to-r from-green-500 to-green-600 h-full rounded-lg flex items-center justify-end pr-3">
                    <span class="text-white text-sm font-semibold">${{ data.sales }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>

            <div class="space-y-4">
              <div v-for="category in categoryData" :key="category.name">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
                  <span class="text-sm font-semibold text-gray-900">{{ category.percentage }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div :style="{ width: `${category.percentage}%` }" class="bg-blue-600 h-2 rounded-full"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">${{ formatPrice(category.sales) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Performance -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Top Performing Products</h2>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Units Sold</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in productPerformance" :key="product.name" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <p class="font-semibold text-gray-900">{{ product.name }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-sm font-semibold text-gray-900">{{ product.units }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-sm font-bold text-gray-900">${{ formatPrice(product.revenue) }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <div class="w-24 bg-gray-100 rounded-full h-2">
                        <div :style="{ width: `${(product.sales / 1200) * 100}%` }"
                          class="bg-green-600 h-2 rounded-full">
                        </div>
                      </div>
                      <span class="text-xs font-medium text-gray-600">{{ Math.round((product.sales / 1200) * 100)
                      }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>