<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { storeToRefs } from 'pinia';

const router = useRouter();
const productStore = useProductStore();
const { categories, loading } = storeToRefs(productStore);

// Form data
const form = ref({
  product_name: '',
  product_description: '',
  category_id: null,
  base_price: '',
  product_status: 'active',
  main_image: '',
  images: [],
  variants: [],
  stock: []
});

const newVariant = ref({
  size: '',
  color: '',
  variant_price: ''
});

const newStock = ref({
  size: '',
  color: '',
  quantity: ''
});

const errors = ref({});
const submitting = ref(false);

// Methods
const validateForm = () => {
  errors.value = {};

  if (!form.value.product_name.trim()) {
    errors.value.product_name = 'Product name is required';
  }

  if (!form.value.category_id) {
    errors.value.category_id = 'Category is required';
  }

  if (!form.value.base_price || parseFloat(form.value.base_price) <= 0) {
    errors.value.base_price = 'Valid price is required';
  }

  return Object.keys(errors.value).length === 0;
};

const addVariant = () => {
  if (newVariant.value.size || newVariant.value.color) {
    form.value.variants.push({ ...newVariant.value });
    newVariant.value = { size: '', color: '', variant_price: '' };
  }
};

const removeVariant = (index) => {
  form.value.variants.splice(index, 1);
};

const addStock = () => {
  if (newStock.value.quantity > 0) {
    form.value.stock.push({ ...newStock.value });
    newStock.value = { size: '', color: '', quantity: '' };
  }
};

const removeStock = (index) => {
  form.value.stock.splice(index, 1);
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;

  try {
    const result = await productStore.createCompleteProduct(form.value);

    if (result.success) {
      alert('Product created successfully!');
      router.push('/admin/dashboard');
    } else {
      alert('Error: ' + (result.error || 'Failed to create product'));
    }
  } catch (error) {
    console.error('Error creating product:', error);
    alert('Error creating product');
  } finally {
    submitting.value = false;
  }
};

const cancel = () => {
  router.push('/admin/dashboard');
};

// Lifecycle
onMounted(async () => {
  await productStore.fetchCategories();
});

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <button @click="cancel" class="text-gray-600 hover:text-gray-900">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Add New Product</h1>
        </div>
        <p class="text-gray-600">Create a new product in your catalog</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>

          <div class="space-y-6">
            <!-- Product Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input v-model="form.product_name" type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter product name" />
              <p v-if="errors.product_name" class="mt-1 text-sm text-red-600">{{ errors.product_name }}</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea v-model="form.product_description" rows="4"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Describe your product..."></textarea>
            </div>

            <!-- Category & Price -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <select v-model="form.category_id"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <option :value="null">Select category</option>
                  <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                    {{ category.name }}
                  </option>
                </select>
                <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
              </div>

              <!-- Base Price -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Base Price <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-600">$</span>
                  <input v-model="form.base_price" type="number" step="0.01"
                    class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="0.00" />
                </div>
                <p v-if="errors.base_price" class="mt-1 text-sm text-red-600">{{ errors.base_price }}</p>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="form.product_status" type="radio" value="active" class="w-4 h-4 text-gray-900" />
                  <span class="text-sm font-medium text-gray-700">Active</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="form.product_status" type="radio" value="inactive" class="w-4 h-4 text-gray-900" />
                  <span class="text-sm font-medium text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Product Images</h2>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Main Image URL
            </label>
            <input v-model="form.main_image" type="url"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="https://example.com/image.jpg" />
            <p class="mt-1 text-xs text-gray-500">Enter the URL of your product's main image</p>
          </div>
        </div>

        <!-- Variants -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Product Variants (Optional)</h2>

          <!-- Add Variant Form -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input v-model="newVariant.size" type="text" placeholder="Size (e.g., M, L, XL)"
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input v-model="newVariant.color" type="text" placeholder="Color (e.g., Red, Blue)"
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input v-model="newVariant.variant_price" type="number" step="0.01" placeholder="Price (optional)"
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <button @click="addVariant" type="button"
              class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Add Variant
            </button>
          </div>

          <!-- Variants List -->
          <div v-if="form.variants.length > 0" class="space-y-2">
            <div v-for="(variant, index) in form.variants" :key="index"
              class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <span v-if="variant.size" class="text-sm font-medium">Size: {{ variant.size }}</span>
                <span v-if="variant.size && variant.color"> • </span>
                <span v-if="variant.color" class="text-sm font-medium">Color: {{ variant.color }}</span>
                <span v-if="variant.variant_price" class="text-sm text-gray-600"> - ${{ variant.variant_price }}</span>
              </div>
              <button @click="removeVariant(index)" type="button" class="text-red-600 hover:text-red-700">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Stock -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Stock Management (Optional)</h2>

          <!-- Add Stock Form -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input v-model="newStock.size" type="text" placeholder="Size"
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input v-model="newStock.color" type="text" placeholder="Color"
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input v-model.number="newStock.quantity" type="number" placeholder="Quantity"
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <button @click="addStock" type="button"
              class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Add Stock
            </button>
          </div>

          <!-- Stock List -->
          <div v-if="form.stock.length > 0" class="space-y-2">
            <div v-for="(stock, index) in form.stock" :key="index"
              class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <span v-if="stock.size" class="text-sm font-medium">Size: {{ stock.size }}</span>
                <span v-if="stock.size && stock.color"> • </span>
                <span v-if="stock.color" class="text-sm font-medium">Color: {{ stock.color }}</span>
                <span class="text-sm text-gray-600"> - Qty: {{ stock.quantity }}</span>
              </div>
              <button @click="removeStock(index)" type="button" class="text-red-600 hover:text-red-700">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button type="button" @click="cancel"
            class="flex-1 px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
            Cancel
          </button>
          <button type="submit" :disabled="submitting"
            class="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            {{ submitting ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>