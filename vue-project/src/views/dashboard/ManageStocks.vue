<script setup>
import { ref, reactive, computed } from 'vue';
import { Plus, Pencil, Trash2, X, Save, Minus, Package, DollarSign, AlertTriangle, Sparkles, Search, Filter } from 'lucide-vue-next';
import router from '@/router';

import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/api.js';
import { onMounted } from 'vue';
import { useToast } from '../../composables/useToast.js';

const { success, error } = useToast();

const items = ref([]);

async function fetchItems() {
  try {
    const response = await getProducts();
    items.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(fetchItems);

const search = ref('');
const categoryFilter = ref('all');
const lowStockOnly = ref(false);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const editingId = ref(null);

const form = reactive({
  sku: '',
  name: '',
  category: '',
  price: '',
  stock: '',
  reorderLevel: ''
});

const errors = reactive({
  sku: '',
  name: '',
  price: '',
  stock: '',
  reorderLevel: ''
});

const categories = computed(() => {
  const set = new Set(items.value.map(i => i.category).filter(Boolean));
  return Array.from(set).sort();
});

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase();
  return items.value.filter(i => {
    const matchesTerm =
      !term ||
      i.sku.toLowerCase().includes(term) ||
      i.name.toLowerCase().includes(term) ||
      i.category.toLowerCase().includes(term);
    const matchesCategory = categoryFilter.value === 'all' || i.category === categoryFilter.value;
    const isLow = i.stock <= i.reorderLevel;
    const matchesLow = !lowStockOnly.value || isLow;
    return matchesTerm && matchesCategory && matchesLow;
  });
});

const totals = computed(() => {
  const totalSkus = items.value.length;
  const totalUnits = items.value.reduce((s, i) => s + Number(i.stock || 0), 0);
  const lowStock = items.value.filter(i => i.stock <= i.reorderLevel).length;
  const inventoryValue = items.value.reduce((s, i) => s + Number(i.stock || 0) * Number(i.price || 0), 0);
  return { totalSkus, totalUnits, lowStock, inventoryValue };
});

function resetForm() {
  form.sku = '';
  form.name = '';
  form.category = '';
  form.price = '';
  form.stock = '';
  form.reorderLevel = '';
  errors.sku = errors.name = errors.price = errors.stock = errors.reorderLevel = '';
  editingId.value = null;
}

function openCreate() {
  resetForm();
  isModalOpen.value = true;
  router.push('/dashboard/AddProduct')
}

function openEdit(item) {
  form.sku = item.sku;
  form.name = item.name;
  form.category = item.category;
  form.price = String(item.price);
  form.stock = String(item.stock);
  form.reorderLevel = String(item.reorderLevel);
  errors.sku = errors.name = errors.price = errors.stock = errors.reorderLevel = '';
  editingId.value = item.id;
  isModalOpen.value = true;
}

function validate() {
  let ok = true;
  errors.sku = form.sku.trim() ? '' : 'SKU is required';
  errors.name = form.name.trim() ? '' : 'Name is required';

  const price = Number(form.price);
  if (form.price === '' || isNaN(price) || price < 0) {
    errors.price = 'Enter a valid price (>= 0)';
    ok = false;
  } else {
    errors.price = '';
  }

  const stock = Math.floor(Number(form.stock));
  if (form.stock === '' || isNaN(stock) || stock < 0) {
    errors.stock = 'Enter a valid stock (integer >= 0)';
    ok = false;
  } else {
    errors.stock = '';
  }

  const rl = Math.floor(Number(form.reorderLevel));
  if (form.reorderLevel === '' || isNaN(rl) || rl < 0) {
    errors.reorderLevel = 'Enter a valid reorder level (integer >= 0)';
    ok = false;
  } else {
    errors.reorderLevel = '';
  }

  if (!form.sku.trim() || !form.name.trim()) ok = false;
  return ok;
}

function closeModal() {
  isModalOpen.value = false;
  resetForm();
}

async function saveItem() {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Math.floor(Number(form.stock)),
      reorderLevel: Math.floor(Number(form.reorderLevel)),
    };
    if (editingId.value == null) {
      await createProduct(payload);
      success('Item created successfully!');
    } else {
      await updateProduct(editingId.value, payload);
      success('Item updated successfully!');
    }
    fetchItems();
    closeModal();
  } catch (err) {
    error('Failed to save item.');
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteItem(item) {
  const confirmed = window.confirm(`Delete item "${item.name}" (${item.sku})? This cannot be undone.`);
  if (!confirmed) return;
  try {
    await deleteProduct(item.id);
    fetchItems();
    success('Item deleted successfully!');
  } catch (err) {
    error('Failed to delete item.');
  }
}

async function adjustStock(item, delta) {
  const next = Math.max(0, item.stock + delta);
  try {
    await updateProduct(item.id, { stock: next });
    fetchItems();
  } catch (err) {
    error('Failed to update stock.');
  }
}

function formatCurrency(v) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v || 0);
}

const statCards = computed(() => [
  { name: 'Total SKUs', value: totals.value.totalSkus.toLocaleString(), icon: Package, color: 'from-violet-500 to-purple-600' },
  { name: 'Units in Stock', value: totals.value.totalUnits.toLocaleString(), icon: Package, color: 'from-blue-500 to-cyan-600' },
  { name: 'Low Stock Items', value: totals.value.lowStock.toLocaleString(), icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
  { name: 'Inventory Value', value: formatCurrency(totals.value.inventoryValue), icon: DollarSign, color: 'from-pink-500 to-rose-600' },
]);
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
              <Package class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Manage Inventory
              </h1>
              <p class="text-gray-500 mt-1 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                Monitor and control your stock levels
              </p>
            </div>
          </div>
          <button
            @click="openCreate"
            class="group px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-bold">
            <Plus class="w-5 h-5" />
            Add New Item
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="(stat, index) in statCards" :key="index"
        class="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        <div class="absolute inset-0 bg-gradient-to-br opacity-5 rounded-3xl" :class="stat.color"></div>
        <div class="relative space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-500 uppercase tracking-wide">{{ stat.name }}</p>
              <h3 class="text-4xl font-black text-gray-900 mt-2">{{ stat.value }}</h3>
            </div>
            <div class="p-4 bg-gradient-to-br rounded-2xl shadow-lg" :class="stat.color">
              <component :is="stat.icon" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <Filter class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-2xl font-black text-gray-900">Filters</h2>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-bold text-gray-900 mb-2">Search</label>
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="search"
              v-model="search"
              type="text"
              placeholder="Search by SKU, name, or category..."
              class="w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
            />
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label for="category" class="block text-sm font-bold text-gray-900 mb-2">Category</label>
            <select
              id="category"
              v-model="categoryFilter"
              class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 font-medium">
              <option value="all">All categories</option>
              <option value="t-shirt">T-Shirts</option>
              <option value="hoodie">Hoodies</option>
              <option value="pant">Pants</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <label class="inline-flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="lowStockOnly" class="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
            <span class="text-sm font-bold text-gray-900">Show low stock only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b-2 border-gray-200 bg-gray-50/50">
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">SKU</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Product</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Category</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Price</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Stock</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Reorder</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Status</th>
              <th class="px-6 py-4 text-right text-sm font-black text-gray-900 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <Package class="w-16 h-16 text-gray-300" />
                  <p class="text-gray-500 font-medium">No items found</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in filteredItems" :key="item.id"
              class="border-b border-gray-100 hover:bg-violet-50/50 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="font-mono font-bold text-gray-900 text-sm">{{ item.sku }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="font-black text-gray-900">{{ item.name }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold">
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4 font-black text-gray-900">{{ formatCurrency(item.price) }}</td>
              <td class="px-6 py-4">
                <div class="inline-flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                  <button
                    class="p-2 rounded-lg hover:bg-white transition-colors"
                    @click="adjustStock(item, -1)"
                    :disabled="item.stock <= 0">
                    <Minus class="w-4 h-4 text-gray-700" />
                  </button>
                  <span class="min-w-[3ch] text-center font-black text-gray-900">{{ item.stock }}</span>
                  <button
                    class="p-2 rounded-lg hover:bg-white transition-colors"
                    @click="adjustStock(item, +1)">
                    <Plus class="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-gray-700">{{ item.reorderLevel }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex px-3 py-1 rounded-xl text-xs font-black"
                  :class="item.stock <= item.reorderLevel ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'">
                  {{ item.stock <= item.reorderLevel ? 'Low Stock' : 'In Stock' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="group px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                    @click="openEdit(item)">
                    <Pencil class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    class="group px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                    @click="deleteItem(item)">
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            {{ editingId == null ? 'Add New Item' : 'Edit Item' }}
          </h2>
          <button
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            @click="closeModal">
            <X class="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form @submit.prevent="saveItem" class="space-y-6">
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="sku" class="block text-sm font-bold text-gray-900 mb-2">SKU</label>
              <input
                id="sku"
                v-model="form.sku"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.sku }"
                placeholder="e.g., SKU-1004"
              />
              <p v-if="errors.sku" class="mt-2 text-sm text-red-600 font-bold">{{ errors.sku }}</p>
            </div>
            <div>
              <label for="name" class="block text-sm font-bold text-gray-900 mb-2">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.name }"
                placeholder="Item name"
              />
              <p v-if="errors.name" class="mt-2 text-sm text-red-600 font-bold">{{ errors.name }}</p>
            </div>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="category" class="block text-sm font-bold text-gray-900 mb-2">Category</label>
              <input
                id="category"
                v-model="form.category"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                placeholder="e.g., Accessories"
                list="category-list"
              />
              <datalist id="category-list">
                <option v-for="c in categories" :key="c" :value="c" />
              </datalist>
            </div>
            <div>
              <label for="price" class="block text-sm font-bold text-gray-900 mb-2">Price</label>
              <input
                id="price"
                v-model="form.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.price }"
                placeholder="0.00"
              />
              <p v-if="errors.price" class="mt-2 text-sm text-red-600 font-bold">{{ errors.price }}</p>
            </div>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="stock" class="block text-sm font-bold text-gray-900 mb-2">Stock</label>
              <input
                id="stock"
                v-model="form.stock"
                type="number"
                step="1"
                min="0"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.stock }"
                placeholder="0"
              />
              <p v-if="errors.stock" class="mt-2 text-sm text-red-600 font-bold">{{ errors.stock }}</p>
            </div>
            <div>
              <label for="reorderLevel" class="block text-sm font-bold text-gray-900 mb-2">Reorder Level</label>
              <input
                id="reorderLevel"
                v-model="form.reorderLevel"
                type="number"
                step="1"
                min="0"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.reorderLevel }"
                placeholder="0"
              />
              <p v-if="errors.reorderLevel" class="mt-2 text-sm text-red-600 font-bold">{{ errors.reorderLevel }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-4 pt-4 border-t-2 border-gray-100">
            <button
              type="button"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-2xl transition-all duration-300 font-bold"
              @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting">
              <Save class="w-5 h-5" />
              {{ isSubmitting ? 'Saving...' : (editingId == null ? 'Create Item' : 'Save Changes') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
