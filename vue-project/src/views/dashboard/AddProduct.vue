<script setup>
import { RouterLink } from "vue-router";
import { ref, computed } from "vue";
import { ImagePlus , ArrowLeft } from 'lucide-vue-next';
import { createProduct } from '../../api/api.js';

const product = ref({
  name: "",
  size: "",
  color: "",
  price: null,
  discount: null,
  category: "",
  image: null,
});

const isDragging = ref(false);

const discountedPrice = computed(() => {
  if (!product.value.price) return null;
  if (!product.value.discount) return product.value.price;
  return product.value.price - (product.value.price * product.value.discount) / 100;
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      product.value.image = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      product.value.image = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  product.value.image = null;
};

async function addProduct() {
  try {
    const response = await createProduct(product.value);
    console.log("Product added:", response.data);
    // Reset the form
    product.value = {
      name: "",
      size: "",
      color: "",
      price: null,
      discount: null,
      category: "",
      image: null,
    };
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

function RefreshPage () {
  window.location.reload();
}

</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-gray-100 flex flex-col items-center justify-center p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 w-full max-w-6xl">
      <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
        📦 <span class="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Add Product</span>
      </h2>
      <div class="flex gap-4">
        <button
          @click="RefreshPage"
          class="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          🔄 Refresh
        </button>
        <router-link
          to="/dashboard"
          class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all font-medium border px-5 py-2.5 rounded-xl hover:bg-gray-50 shadow-sm">
          <ArrowLeft class="w-5 h-5" />
          Dashboard
        </router-link>
      </div>
    </div>
    <!-- Main Container -->
    <div class="bg-white/80 mb-8 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 p-12 border border-gray-200">
      <!-- Left Side: Form -->
      <div>
        <form @submit.prevent="addProduct" class="space-y-7">
          <!-- Drag & Drop Image Upload -->
          <div class="relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ease-in-out"
            :class="isDragging ? 'border-rose-500 bg-rose-50 scale-[1.01]' : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="$refs.fileInput.click()">
            <input type="file" accept="image/*" class="hidden" ref="fileInput" @change="handleFileChange"/>
            <!-- Default text -->
            <div v-if="!product.image" class="text-gray-500 flex flex-col items-center space-y-3">
              <image-plus class="w-10 h-10 text-rose-400"/>
              <p class="text-sm">Drag & drop product image here, or <span class="text-rose-500 font-semibold">click to upload</span></p>
            </div>
            <!-- Image Preview -->
            <div v-else class="relative flex justify-center">
              <img :src="product.image" alt="Preview"
                class="w-44 h-44 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition duration-300"/>
              <button @click.stop="removeImage"
                class="absolute top-3 right-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-2 shadow-md transition">
                ✕
              </button>
            </div>
          </div>
          <!-- Fields -->
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
              <input v-model="product.name" type="text" placeholder="Enter product name"
                class="w-full rounded-2xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 px-4 py-3 transition"/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Size</label>
              <input v-model="product.size" type="text" placeholder="M, L, XL"
                class="w-full rounded-2xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 px-4 py-3 transition"/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Color</label>
              <input v-model="product.color" type="text" placeholder="Red, Blue..."
                class="w-full rounded-2xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 px-4 py-3 transition"/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
              <input v-model.number="product.price" type="number" placeholder="0.00"
                class="w-full rounded-2xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 px-4 py-3 transition"/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
              <input v-model.number="product.discount" type="number" placeholder="0"
                class="w-full rounded-2xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 px-4 py-3 transition"/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select v-model="product.category" class="w-full rounded-2xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 px-4 py-3 transition">
                <option value="">Select category</option>
                <option value="Shirts">Shirts</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Pants">Pants</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      <!-- Right Side: Preview -->
      <div class="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-10 shadow-inner">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">🖼️ Live Preview</h2>
        <div class="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
          <img v-if="product.image" :src="product.image" alt="Product Image"
              class="w-full h-52 object-cover"/>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900">{{ product.name || 'Product Name' }}</h3>
            <p class="text-sm text-gray-500 mt-1">Size: {{ product.size || '-' }}</p>
            <p class="text-sm text-gray-500">Color: {{ product.color || '-' }}</p>
            <p class="text-sm text-gray-500">Category: {{ product.category || '-' }}</p>
            <div class="mt-5 flex items-center gap-2">
              <span v-if="product.discount" class="text-gray-400 line-through text-lg">${{ product.price || 0 }}</span>
              <span class="text-rose-600 font-extrabold text-2xl">
                {{ discountedPrice ? discountedPrice.toFixed(2) : (product.price || 0).toFixed(2) }}
              </span>
              <span v-if="product.discount" class="ml-1 text-sm text-green-600 font-semibold">-{{ product.discount }}%</span>
            </div>
          </div>
        </div>
        <!-- Buttons -->
        <div class="flex gap-4 mt-10">
          <button
            @click="addProduct"
            class="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg transition font-semibold transform hover:-translate-y-1 hover:shadow-xl">
            ➕ Add Product
          </button>
          <RouterLink to="/viewproduct">
            <button
              class="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl shadow-lg transition font-semibold transform hover:-translate-y-1 hover:shadow-xl">
              📋 View Products
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
