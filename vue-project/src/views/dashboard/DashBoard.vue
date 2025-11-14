<script setup>
import { ref } from 'vue'
import { TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, Package, Activity, ArrowUpRight, Sparkles, Eye, BarChart3, Zap } from 'lucide-vue-next'

const stats = ref([
  { id: 1, name: 'Total Revenue', value: 42850, change: 8.2, icon: DollarSign, color: 'from-violet-500 to-purple-600' },
  { id: 2, name: 'Active Users', value: 1243, change: 12.6, icon: Users, color: 'from-blue-500 to-cyan-600' },
  { id: 3, name: 'Total Orders', value: 342, change: -1.4, icon: ShoppingCart, color: 'from-pink-500 to-rose-600' },
  { id: 4, name: 'Products', value: 89, change: 4.2, icon: Package, color: 'from-amber-500 to-orange-600' },
])

const recentOrders = ref([
  { id: 'ORD-1042', customer: 'Alice Johnson', product: 'Premium Hoodie', total: 189.00, status: 'Completed', avatar: '👩' },
  { id: 'ORD-1041', customer: 'David Kim', product: 'Classic T-Shirt', total: 72.50, status: 'Processing', avatar: '👨' },
  { id: 'ORD-1040', customer: 'Maria Garcia', product: 'Winter Jacket', total: 560.00, status: 'Completed', avatar: '👩‍🦰' },
  { id: 'ORD-1039', customer: 'John Smith', product: 'Sports Pants', total: 38.90, status: 'Cancelled', avatar: '👨‍🦱' },
])

const topProducts = ref([
  { name: 'Premium Hoodie', sales: 234, revenue: 14800, trend: 'up', progress: 85 },
  { name: 'Classic T-Shirt', sales: 189, revenue: 9450, trend: 'up', progress: 70 },
  { name: 'Winter Jacket', sales: 156, revenue: 24960, trend: 'down', progress: 60 },
  { name: 'Sports Pants', sales: 142, revenue: 8520, trend: 'up', progress: 55 },
])

const activities = ref([
  { id: 1, type: 'sale', user: 'Sarah M.', action: 'purchased Premium Hoodie', time: '2 min ago', color: 'from-green-500 to-emerald-600' },
  { id: 2, type: 'product', user: 'Admin', action: 'added new product "Summer Collection"', time: '1 hour ago', color: 'from-blue-500 to-cyan-600' },
  { id: 3, type: 'user', user: 'Michael R.', action: 'created new account', time: '3 hours ago', color: 'from-purple-500 to-fuchsia-600' },
  { id: 4, type: 'review', user: 'Emma L.', action: 'left a 5-star review', time: '5 hours ago', color: 'from-amber-500 to-orange-600' },
])

const formatCurrency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
</script>

<template>
  <div class="min-h-screen p-6 space-y-8 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
    <!-- Modern Header -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 blur-3xl opacity-20 rounded-3xl"></div>
      <div class="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg">
              <BarChart3 class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p class="text-gray-500 mt-1 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                Welcome back! Here's what's happening today
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="group px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-bold">
              <Activity class="w-4 h-4" />
              Live View
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.id"
        class="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        <!-- Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br opacity-5 rounded-3xl" :class="stat.color"></div>

        <!-- Content -->
        <div class="relative space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-500 uppercase tracking-wide">{{ stat.name }}</p>
              <h3 class="text-4xl font-black text-gray-900 mt-2">
                {{ stat.name.includes('Revenue') ? formatCurrency(stat.value) : stat.value.toLocaleString() }}
              </h3>
            </div>
            <div class="p-4 bg-gradient-to-br rounded-2xl shadow-lg" :class="stat.color">
              <component :is="stat.icon" class="w-6 h-6 text-white" />
            </div>
          </div>

          <!-- Change Indicator -->
          <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-sm"
              :class="stat.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
              <component :is="stat.change >= 0 ? TrendingUp : TrendingDown" class="w-4 h-4" />
              {{ Math.abs(stat.change) }}%
            </div>
            <span class="text-xs text-gray-500 font-medium">vs last month</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Recent Orders -->
      <div class="xl:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-gray-900">Recent Orders</h2>
          <router-link to="/dashboard/report"
            class="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-300 font-bold text-sm">
            View All
            <ArrowUpRight class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </router-link>
        </div>

        <div class="space-y-4">
          <div v-for="order in recentOrders" :key="order.id"
            class="group flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-300">
            <div class="text-4xl">{{ order.avatar }}</div>
            <div class="flex-1 min-w-0">
              <h4 class="font-black text-gray-900">{{ order.customer }}</h4>
              <p class="text-sm text-gray-500 truncate">{{ order.product }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ order.id }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-black text-gray-900">{{ formatCurrency(order.total) }}</p>
              <span class="inline-block mt-1 px-3 py-1 rounded-xl text-xs font-bold"
                :class="{
                  'bg-green-100 text-green-700': order.status === 'Completed',
                  'bg-blue-100 text-blue-700': order.status === 'Processing',
                  'bg-red-100 text-red-700': order.status === 'Cancelled',
                }">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
            <Zap class="w-5 h-5 text-white" />
          </div>
          <h2 class="text-2xl font-black text-gray-900">Live Activity</h2>
        </div>

        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id"
            class="relative flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div class="relative">
              <div class="p-2 bg-gradient-to-br rounded-xl shadow-lg" :class="activity.color">
                <Activity class="w-4 h-4 text-white" />
              </div>
              <span v-if="activity.id === 1" class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900">{{ activity.user }}</p>
              <p class="text-sm text-gray-600">{{ activity.action }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
            <Package class="w-5 h-5 text-white" />
          </div>
          <h2 class="text-2xl font-black text-gray-900">Top Selling Products</h2>
        </div>
        <router-link to="/dashboard/manage-stock"
          class="flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-700 font-bold text-sm group">
          <Eye class="w-4 h-4" />
          View Inventory
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div v-for="(product, index) in topProducts" :key="index"
          class="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-black text-gray-900 text-lg">{{ product.name }}</h4>
                <p class="text-sm text-gray-500 mt-1">{{ product.sales }} sales</p>
              </div>
              <component :is="product.trend === 'up' ? TrendingUp : TrendingDown"
                class="w-5 h-5"
                :class="product.trend === 'up' ? 'text-green-500' : 'text-red-500'" />
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 font-bold">Revenue</span>
                <span class="text-gray-900 font-black">{{ formatCurrency(product.revenue) }}</span>
              </div>

              <!-- Progress Bar -->
              <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                  :style="{ width: `${product.progress}%` }"></div>
              </div>
              <p class="text-xs text-gray-500 text-right">{{ product.progress }}% of goal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}
</style>
