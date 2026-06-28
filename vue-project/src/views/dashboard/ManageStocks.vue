<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../../stores/product.js';
import { storeToRefs } from 'pinia';

const productStore = useProductStore();
const { products, loading } = storeToRefs(productStore);

// Local state
const searchQuery = ref('');
const filterStatus = ref('all'); // all, low, out
const showUpdateModal = ref(false);
const selectedProduct = ref(null);
const newStock = ref(0);

// Computed
const filteredProducts = computed(() => {
  let result = products.value || [];

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    result = result.filter(p =>
      p.product_name?.toLowerCase().includes(search) ||
      p.category_name?.toLowerCase().includes(search)
    );
  }

  // Status filter
  if (filterStatus.value === 'low') {
    result = result.filter(p => {
      const stock = parseInt(p.total_stock || 0);
      return stock > 0 && stock < 10;
    });
  } else if (filterStatus.value === 'out') {
    result = result.filter(p => parseInt(p.total_stock || 0) === 0);
  }

  return result;
});

const lowStockCount = computed(() =>
  products.value?.filter(p => {
    const stock = parseInt(p.total_stock || 0);
    return stock > 0 && stock < 10;
  }).length || 0
);

const outOfStockCount = computed(() =>
  products.value?.filter(p => parseInt(p.total_stock || 0) === 0).length || 0
);

// Methods
const getStockStatus = (stock) => {
  const stockNum = parseInt(stock || 0);
  if (stockNum === 0) {
    return { text: 'Out of Stock', class: 'bg-red-100 text-red-700', dotClass: 'bg-red-600' };
  }
  if (stockNum < 10) {
    return { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-700', dotClass: 'bg-yellow-600' };
  }
  return { text: 'In Stock', class: 'bg-green-100 text-green-700', dotClass: 'bg-green-600' };
};

const openUpdateModal = (product) => {
  selectedProduct.value = product;
  newStock.value = parseInt(product.total_stock || 0);
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  selectedProduct.value = null;
  newStock.value = 0;
};

const updateStock = async () => {
  if (!selectedProduct.value) return;

  try {
    // TODO: Call API to update stock
    console.log('Updating stock for product:', selectedProduct.value.product_id, 'to:', newStock.value);

    // Update local state
    selectedProduct.value.total_stock = newStock.value;

    alert('Stock updated successfully!');
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating stock:', error);
    alert('Error updating stock');
  }
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/80?text=No+Image';
};

// Lifecycle
onMounted(async () => {
  await productStore.fetchAllProducts();
});
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-ink">Stock Management</h1>
        <p class="text-neutral-600 mt-1 text-sm sm:text-base">Monitor and update product inventory</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div class="bg-paper rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Total Products</p>
          <p class="text-3xl font-bold text-ink">{{ products?.length || 0 }}</p>
        </div>

        <div class="bg-paper rounded-2xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Low Stock</p>
          <p class="text-3xl font-bold text-yellow-600">{{ lowStockCount }}</p>
        </div>

        <div class="bg-paper rounded-2xl shadow-sm p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Out of Stock</p>
          <p class="text-3xl font-bold text-red-600">{{ outOfStockCount }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-paper rounded-2xl shadow-sm p-6 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search products..."
                class="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400" />
              <svg class="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="flex flex-wrap gap-2">
            <button @click="filterStatus = 'all'" :class="{
              'bg-ink text-white': filterStatus === 'all',
              'bg-neutral-100 text-neutral-700': filterStatus !== 'all'
            }" class="px-4 py-3 rounded-lg font-medium transition-colors">
              All
            </button>
            <button @click="filterStatus = 'low'" :class="{
              'bg-yellow-600 text-white': filterStatus === 'low',
              'bg-neutral-100 text-neutral-700': filterStatus !== 'low'
            }" class="px-4 py-3 rounded-lg font-medium transition-colors">
              Low Stock
            </button>
            <button @click="filterStatus = 'out'" :class="{
              'bg-red-600 text-white': filterStatus === 'out',
              'bg-neutral-100 text-neutral-700': filterStatus !== 'out'
            }" class="px-4 py-3 rounded-lg font-medium transition-colors">
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-neutral-200 border-t-ink rounded-full animate-spin"></div>
      </div>

      <!-- Products Table -->
      <div v-else class="bg-paper rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Product
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Category
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="product in filteredProducts" :key="product.product_id"
                class="hover:bg-neutral-50 transition-colors">
                <!-- Product -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                      <img :src="product.main_image || 'https://via.placeholder.com/80'" :alt="product.product_name"
                        class="w-full h-full object-cover" @error="handleImageError" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-ink truncate">{{ product.product_name }}</p>
                      <p class="text-sm text-neutral-500 truncate">ID: {{ product.product_id }}</p>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="px-6 py-4">
                  <span class="text-sm text-ink">{{ product.category_name || 'N/A' }}</span>
                </td>

                <!-- Price -->
                <td class="px-6 py-4">
                  <span class="text-sm font-semibold text-ink">${{ formatPrice(product.final_price) }}</span>
                </td>

                <!-- Stock -->
                <td class="px-6 py-4">
                  <span class="text-2xl font-bold text-ink">{{ product.total_stock || 0 }}</span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span :class="getStockStatus(product.total_stock).class"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                    <div :class="getStockStatus(product.total_stock).dotClass" class="w-2 h-2 rounded-full"></div>
                    {{ getStockStatus(product.total_stock).text }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <button @click="openUpdateModal(product)"
                    class="px-4 py-2 bg-ink text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium">
                    Update Stock
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-neutral-500">No products found</p>
        </div>
      </div>
    </div>

    <!-- Update Stock Modal -->
    <div v-if="showUpdateModal" @click="closeUpdateModal"
      class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-paper rounded-2xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-ink mb-6">Update Stock</h3>

        <!-- Product Info -->
        <div class="flex items-center gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
          <div class="w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden shrink-0">
            <img :src="selectedProduct?.main_image || 'https://via.placeholder.com/80'"
              :alt="selectedProduct?.product_name" class="w-full h-full object-cover" @error="handleImageError" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-ink truncate">{{ selectedProduct?.product_name }}</p>
            <p class="text-sm text-neutral-500">Current: {{ selectedProduct?.total_stock || 0 }} units</p>
          </div>
        </div>

        <!-- Stock Input -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-ink mb-2">New Stock Quantity</label>
          <input v-model.number="newStock" type="number" min="0"
            class="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 text-lg font-semibold" />
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button @click="closeUpdateModal"
            class="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-semibold">
            Cancel
          </button>
          <button @click="updateStock"
            class="flex-1 px-6 py-3 bg-ink text-white rounded-lg hover:bg-neutral-800 transition-colors font-semibold">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>