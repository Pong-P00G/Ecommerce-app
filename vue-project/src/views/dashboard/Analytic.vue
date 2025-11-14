<script setup>
import { ref, computed } from 'vue';
import { getAnalyticsKpis, getRevenueTrend, getTrafficSources, getTopPages } from '../../api/api.js';
import { onMounted, watch } from 'vue';
import { TrendingUp, Users, DollarSign, Activity, Eye, BarChart3, Sparkles, Clock } from 'lucide-vue-next';

const range = ref('7d');
const kpiData = ref({});
const revenueSeries = ref([]);
const sources = ref([]);
const topPages = ref([]);

async function fetchAnalyticsData() {
  try {
    const [kpisRes, revenueRes, sourcesRes, pagesRes] = await Promise.all([
      getAnalyticsKpis(range.value),
      getRevenueTrend(range.value),
      getTrafficSources(range.value),
      getTopPages(range.value),
    ]);
    kpiData.value = kpisRes.data;
    revenueSeries.value = revenueRes.data;
    sources.value = sourcesRes.data;
    topPages.value = pagesRes.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(fetchAnalyticsData);
watch(range, fetchAnalyticsData);

// Formatters
const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('en-US');

const fmtCurrency = (n) => currencyFmt.format(n);
const fmtNumber = (n) => numberFmt.format(n);

// Chart configuration
const chartCfg = { w: 600, h: 200, pad: 12 };

const chart = computed(() => {
  const data = revenueSeries.value;
  const w = chartCfg.w, h = chartCfg.h, p = chartCfg.pad;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const spread = max - min || 1;
  const step = data.length > 1 ? (w - 2 * p) / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = p + step * i;
    const y = h - p - ((v - min) / spread) * (h - 2 * p);
    return [x, y];
  });

  const line = 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ');
  const area = `${line} L ${p + step * (data.length - 1)} ${h - p} L ${p} ${h - p} Z`;

  return { line, area, min, max };
});

const kpis = computed(() => [
  { name: 'Total Users', value: fmtNumber(kpiData.value.users || 0), icon: Users, color: 'from-blue-500 to-cyan-600' },
  { name: 'Total Sales', value: fmtCurrency(kpiData.value.sales || 0), icon: DollarSign, color: 'from-violet-500 to-purple-600' },
  { name: 'Active Sessions', value: fmtNumber(kpiData.value.sessions || 0), icon: Activity, color: 'from-pink-500 to-rose-600' },
  { name: 'Conversion Rate', value: `${kpiData.value.conversion || 0}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
]);

const sourceColors = ['from-violet-500 to-purple-600', 'from-blue-500 to-cyan-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600'];
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
                Analytics Overview
              </h1>
              <p class="text-gray-500 mt-1 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                Track your performance metrics
              </p>
            </div>
          </div>
          <div>
            <select
              id="range"
              v-model="range"
              class="px-6 py-3 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 font-bold shadow-lg">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="q">Last quarter</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="(kpi, index) in kpis" :key="index"
        class="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        <!-- Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br opacity-5 rounded-3xl" :class="kpi.color"></div>

        <!-- Content -->
        <div class="relative space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-500 uppercase tracking-wide">{{ kpi.name }}</p>
              <h3 class="text-4xl font-black text-gray-900 mt-2">{{ kpi.value }}</h3>
            </div>
            <div class="p-4 bg-gradient-to-br rounded-2xl shadow-lg" :class="kpi.color">
              <component :is="kpi.icon" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts & Traffic Sources -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Revenue Trend Chart -->
      <div class="xl:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
              <TrendingUp class="w-5 h-5 text-white" />
            </div>
            <h2 class="text-2xl font-black text-gray-900">Revenue Trend</h2>
          </div>
          <div class="text-sm font-bold text-gray-500">
            {{ fmtCurrency(chart.min) }} - {{ fmtCurrency(chart.max) }}
          </div>
        </div>

        <div class="relative bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-6">
          <svg :viewBox="`0 0 ${chartCfg.w} ${chartCfg.h}`" preserveAspectRatio="none" class="w-full h-56">
            <defs>
              <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#d946ef" stop-opacity="0.05" />
              </linearGradient>
            </defs>
            <path :d="chart.area" fill="url(#lineFill)" />
            <path :d="chart.line" stroke="url(#gradient)" stroke-width="3" fill="none" stroke-linecap="round" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#8b5cf6" />
                <stop offset="100%" stop-color="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <Activity class="w-5 h-5 text-white" />
          </div>
          <h2 class="text-2xl font-black text-gray-900">Traffic Sources</h2>
        </div>

        <div class="space-y-5">
          <div v-for="(s, index) in sources" :key="s.name" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-900">{{ s.name }}</span>
              <span class="text-sm font-black text-gray-900">{{ s.percent }}%</span>
            </div>
            <div class="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div class="absolute inset-y-0 left-0 bg-gradient-to-r rounded-full transition-all duration-500"
                :class="sourceColors[index % sourceColors.length]"
                :style="{ width: s.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Pages -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
          <Eye class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-2xl font-black text-gray-900">Top Pages</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="py-4 px-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Page</th>
              <th class="py-4 px-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Views</th>
              <th class="py-4 px-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Users</th>
              <th class="py-4 px-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Avg. Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in topPages" :key="p.path"
              class="border-b border-gray-100 hover:bg-violet-50/50 transition-colors duration-200">
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-sm">
                    {{ index + 1 }}
                  </div>
                  <span class="font-bold text-gray-900">{{ p.path }}</span>
                </div>
              </td>
              <td class="py-4 px-4 font-black text-gray-900">{{ fmtNumber(p.views) }}</td>
              <td class="py-4 px-4 font-black text-gray-900">{{ fmtNumber(p.users) }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2 text-gray-600">
                  <Clock class="w-4 h-4" />
                  <span class="font-bold">{{ p.avgTime }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
