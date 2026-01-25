<script setup>
import { ref } from 'vue';

const reportType = ref('sales');
const dateRange = ref('month');
const startDate = ref('');
const endDate = ref('');
const generating = ref(false);

const reportHistory = ref([
  { id: 1, name: 'Sales Report - January 2026', type: 'Sales', date: '2026-01-24', size: '245 KB' },
  { id: 2, name: 'Inventory Report - January 2026', type: 'Inventory', date: '2026-01-23', size: '189 KB' },
  { id: 3, name: 'Customer Report - January 2026', type: 'Customer', date: '2026-01-22', size: '156 KB' },
  { id: 4, name: 'Sales Report - December 2025', type: 'Sales', date: '2026-01-15', size: '298 KB' }
]);

const reportTypes = [
  { value: 'sales', label: 'Sales Report', icon: '📊', desc: 'Revenue, orders, and sales analytics' },
  { value: 'inventory', label: 'Inventory Report', icon: '📦', desc: 'Stock levels and product performance' },
  { value: 'customer', label: 'Customer Report', icon: '👥', desc: 'Customer data and behavior' },
  { value: 'financial', label: 'Financial Report', icon: '💰', desc: 'Profit, expenses, and financial metrics' }
];

const generateReport = async () => {
  generating.value = true;

  // Simulate report generation
  await new Promise(resolve => setTimeout(resolve, 2000));

  const newReport = {
    id: reportHistory.value.length + 1,
    name: `${reportTypes.find(t => t.value === reportType.value).label} - ${new Date().toLocaleDateString()}`,
    type: reportTypes.find(t => t.value === reportType.value).label,
    date: new Date().toISOString().split('T')[0],
    size: Math.floor(Math.random() * 300) + 100 + ' KB'
  };

  reportHistory.value.unshift(newReport);
  generating.value = false;

  alert('Report generated successfully!');
};

const downloadReport = (report) => {
  alert(`Downloading: ${report.name}`);
  // TODO: Implement actual download
};

const deleteReport = (reportId) => {
  if (confirm('Are you sure you want to delete this report?')) {
    const index = reportHistory.value.findIndex(r => r.id === reportId);
    if (index !== -1) {
      reportHistory.value.splice(index, 1);
      alert('Report deleted successfully!');
    }
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
        <p class="text-gray-600 mt-1">Generate and download business reports</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Report Generator -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Report Type Selection -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Generate New Report</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label v-for="type in reportTypes" :key="type.value" :class="{
                'border-gray-900 bg-gray-50': reportType === type.value,
                'border-gray-200': reportType !== type.value
              }"
                class="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input v-model="reportType" type="radio" :value="type.value" class="mt-1" />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-2xl">{{ type.icon }}</span>
                    <p class="font-semibold text-gray-900">{{ type.label }}</p>
                  </div>
                  <p class="text-sm text-gray-600">{{ type.desc }}</p>
                </div>
              </label>
            </div>

            <!-- Date Range -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Date Range</label>
                <select v-model="dateRange"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white">
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <!-- Custom Date Range -->
              <div v-if="dateRange === 'custom'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                  <input v-model="startDate" type="date"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                  <input v-model="endDate" type="date"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
              </div>
            </div>

            <!-- Generate Button -->
            <button @click="generateReport" :disabled="generating"
              class="w-full mt-6 px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="!generating" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ generating ? 'Generating Report...' : 'Generate Report' }}
            </button>
          </div>

          <!-- Report Preview Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div class="flex gap-3">
              <svg class="h-6 w-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-semibold text-blue-900 mb-1">Report Information</p>
                <p class="text-sm text-blue-700">
                  Your report will include detailed analytics, charts, and export options.
                  Reports are generated in real-time and can be downloaded as PDF or CSV.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p class="text-sm text-green-600 font-medium">Total Reports</p>
                  <p class="text-2xl font-bold text-green-900">{{ reportHistory.length }}</p>
                </div>
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p class="text-sm text-blue-600 font-medium">This Month</p>
                  <p class="text-2xl font-bold text-blue-900">3</p>
                </div>
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Export Formats -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Export Formats</h3>

            <div class="space-y-2">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-red-600">PDF</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">PDF Document</p>
                  <p class="text-xs text-gray-500">Formatted report</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-green-600">CSV</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">CSV Spreadsheet</p>
                  <p class="text-xs text-gray-500">Raw data export</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-blue-600">XLS</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">Excel File</p>
                  <p class="text-xs text-gray-500">Advanced formatting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report History -->
      <div class="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Report History</h2>

        <div class="space-y-3">
          <div v-for="report in reportHistory" :key="report.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">{{ report.name }}</p>
                <div class="flex items-center gap-3 mt-1">
                  <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {{ report.type }}
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(report.date) }}</span>
                  <span class="text-sm text-gray-500">{{ report.size }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="downloadReport(report)"
                class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button @click="deleteReport(report.id)" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>