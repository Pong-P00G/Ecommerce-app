<script setup>
import { ref, computed } from 'vue';
import { FileDown, BarChart3, RefreshCw, Download, Filter, XCircle } from 'lucide-vue-next';
import html2pdf from 'html2pdf.js';

const dateFrom = ref(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10));
const dateTo = ref(new Date().toISOString().slice(0, 10));
const reportType = ref('sales');
const loading = ref(false);
const rows = ref([]);
const reportEl = ref(null);

const metrics = computed(() => {
  if (!rows.value.length) {
    return { total: 0, revenue: 0, avg: 0, refunds: 0 };
  }
  const total = rows.value.length;
  const revenue = rows.value.reduce((s, r) => s + (r.total || 0), 0);
  const refunds = rows.value.filter(r => r.status === 'Refunded').length;
  const avg = revenue / (total || 1);
  return { total, revenue, avg, refunds };
});

function resetFilters() {
  dateFrom.value = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10);
  dateTo.value = new Date().toISOString().slice(0, 10);
  reportType.value = 'sales';
  rows.value = [];
}



import { getReport } from '../../api/api.js';

async function generateReport() {
  loading.value = true;
  try {
    const response = await getReport({ 
      type: reportType.value, 
      from: dateFrom.value, 
      to: dateTo.value 
    });
    rows.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function exportCSV() {
  if (!rows.value.length) return;
  const items = rows.value;
  const headers = Object.keys(items[0]);
  const csv = [
    headers.join(','),
    ...items.map(row =>
      headers
        .map(h => {
          const v = row[h] ?? '';
          const s = typeof v === 'string' ? v.replace(/"/g, '""') : String(v);
          return `"${s}"`;
        })
        .join(',')
    )
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report_${reportType.value}_${dateFrom.value}_${dateTo.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF() {
  if (!rows.value.length || !reportEl.value) return;
  const opt = {
    margin: 10,
    filename: `report_${reportType.value}_${dateFrom.value}_${dateTo.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };
  html2pdf().set(opt).from(reportEl.value).save();
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Reports</h1>
        <p class="text-gray-500">Generate and export dashboard reports.</p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          @click="exportCSV" :disabled="!rows.length" aria-label="Export CSV">
          <Download class="h-4 w-4" aria-hidden="true" />
          CSV
        </button>
        <button type="button" class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60" @click="exportPDF"
          :disabled="!rows.length" aria-label="Export PDF">
          <FileDown class="h-4 w-4" aria-hidden="true" />
          PDF
        </button>
      </div>
    </div>
    <!-- Filters -->
    <div class="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="grid gap-3 md:grid-cols-5">
        <div class="md:col-span-2">
          <label for="from" class="mb-1 block text-sm font-medium">From</label>
          <input id="from" type="date" v-model="dateFrom" class="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div class="md:col-span-2">
          <label for="to" class="mb-1 block text-sm font-medium">To</label>
          <input id="to" type="date" v-model="dateTo" class="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label for="type" class="mb-1 block text-sm font-medium">Type</label>
          <select id="type" v-model="reportType" class="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="sales">Sales</option>
            <option value="users">Users</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-end gap-2">
        <button type="button" class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50" @click="resetFilters">
          <XCircle class="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
        <button type="button" class="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
          @click="generateReport" :disabled="loading">
          <RefreshCw class="h-4 w-4 animate-spin" v-if="loading" aria-hidden="true" />
          <Filter class="h-4 w-4" v-else aria-hidden="true" />
          {{ loading ? 'Generating...' : 'Generate' }}
        </button>
      </div>
    </div>
    <!-- Metrics -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" v-if="rows.length">
      <div class="rounded-xl border bg-white p-4">
        <div class="text-sm text-gray-500">Records</div>
        <div class="text-2xl font-semibold">{{ metrics.total.toLocaleString() }}</div>
      </div>
      <div class="rounded-xl border bg-white p-4" v-if="reportType === 'sales'">
        <div class="text-sm text-gray-500">Revenue</div>
        <div class="text-2xl font-semibold">
          {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.revenue) }}
        </div>
      </div>
      <div class="rounded-xl border bg-white p-4" v-if="reportType === 'sales'">
        <div class="text-sm text-gray-500">Avg Order</div>
        <div class="text-2xl font-semibold">
          {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.avg) }}
        </div>
      </div>
      <div class="rounded-xl border bg-white p-4" v-if="reportType === 'sales'">
        <div class="text-sm text-gray-500">Refunds</div>
        <div class="text-2xl font-semibold">{{ metrics.refunds }}</div>
      </div>
    </div>
    <!-- Chart + Table -->
    <div class="grid gap-4 lg:grid-cols-3" v-if="rows.length" ref="reportEl">
      <div class="rounded-xl border bg-white p-4 lg:col-span-2">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-semibold">Overview</h2>
          <BarChart3 class="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <div class="grid h-64 place-items-center rounded-lg border border-dashed text-gray-400">
          Chart coming soon
        </div>
      </div>
      <div class="rounded-xl border bg-white p-4 overflow-x-auto">
        <h2 class="mb-3 text-lg font-semibold">Sample Data</h2>
        <table class="min-w-full text-left text-sm">
          <thead class="text-xs text-gray-500">
            <tr>
              <th class="px-3 py-2">ID</th>
              <th class="px-3 py-2">Date</th>
              <th class="px-3 py-2" v-if="reportType === 'sales'">Customer</th>
              <th class="px-3 py-2" v-if="reportType === 'sales'">Total</th>
              <th class="px-3 py-2" v-if="reportType === 'sales'">Status</th>

              <th class="px-3 py-2" v-if="reportType === 'users'">Name</th>
              <th class="px-3 py-2" v-if="reportType === 'users'">Email</th>
              <th class="px-3 py-2" v-if="reportType === 'users'">Role</th>
              <th class="px-3 py-2" v-if="reportType === 'users'">Status</th>

              <th class="px-3 py-2" v-if="reportType === 'inventory'">SKU</th>
              <th class="px-3 py-2" v-if="reportType === 'inventory'">Stock</th>
              <th class="px-3 py-2" v-if="reportType === 'inventory'">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.id" class="border-t">
              <td class="px-3 py-2">{{ r.id }}</td>
              <td class="px-3 py-2">{{ r.date }}</td>
              <td class="px-3 py-2" v-if="reportType === 'sales'">{{ r.customer }}</td>
              <td class="px-3 py-2" v-if="reportType === 'sales'">
                {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(r.total) }}
              </td>
              <td class="px-3 py-2" v-if="reportType === 'sales'">
                <span class="rounded-full px-2 py-0.5 text-xs" :class="r.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ r.status }}
                </span>
              </td>
              <td class="px-3 py-2" v-if="reportType === 'users'">{{ r.name }}</td>
              <td class="px-3 py-2" v-if="reportType === 'users'">{{ r.email }}</td>
              <td class="px-3 py-2" v-if="reportType === 'users'">{{ r.role }}</td>
              <td class="px-3 py-2" v-if="reportType === 'users'">
                <span class="rounded-full px-2 py-0.5 text-xs" :class="r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                  {{ r.status }}
                </span>
              </td>
              <td class="px-3 py-2" v-if="reportType === 'inventory'">{{ r.sku }}</td>
              <td class="px-3 py-2" v-if="reportType === 'inventory'">{{ r.stock }}</td>
              <td class="px-3 py-2" v-if="reportType === 'inventory'">
                <span :class="r.change >= 0 ? 'text-green-700' : 'text-red-700'">{{ r.change }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
      Choose filters and click Generate to see results.
    </div>
  </div>
</template>