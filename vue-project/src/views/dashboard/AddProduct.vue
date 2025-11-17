<script setup>
import { RouterLink } from "vue-router";
import { ref, computed } from "vue";
import { ImagePlus, Sparkles, Package, ArrowRight, RefreshCw } from 'lucide-vue-next';
import { createProduct } from '../../api/api.js';
import { useToast } from '../../composables/useToast.js';

const { success, error } = useToast();

const productData = ref({
  productimage: null,
  productname: "",
  productsize: "",
  productcolor: "",
  productprice: null,
  productdiscount: null,
  description: "",
  categoryid: "",
  userid: null
});

const imagePreview = ref(null);
const isDragging = ref(false);
const isSubmitting = ref(false);

const discountedPrice = computed(() => {
  if (!productData.value.productprice) return null;
  if (!productData.value.productdiscount) return productData.value.productprice;
  return (
    productData.value.productprice -
    (productData.value.productprice * productData.value.productdiscount) / 100
  );
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    productData.value.productimage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    productData.value.productimage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  productData.value.productimage = null;
  imagePreview.value = null;
};

async function addProduct() {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    for (let key in productData.value) {
      if (productData.value[key] !== null) {
        formData.append(key, productData.value[key]);
      }
    }
    const response = await createProduct(formData);
    success("Product added successfully!");
    productData.value = {
      productimage: null,
      productname: "",
      productsize: "",
      productcolor: "",
      productprice: null,
      productdiscount: null,
      description: "",
      categoryid: "",
      userid: null
    };
    imagePreview.value = null;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Error adding product";
    error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}

function RefreshPage() {
  window.location.reload();
}
</script>

<template>
  <div class="min-h-screen p-6 space-y-16">
    <!-- Modern Header with linear -->
    <div class="relative">
      <div class="absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 blur-3xl opacity-20 rounded-3xl"></div>
      <div class="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg">
              <Package class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-4xl font-black bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p class="text-gray-500 mt-1 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                Create amazing products for your store
              </p>
            </div>
          </div>
          <button
            @click="RefreshPage"
            class="group px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            <RefreshCw class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>
      </div>
    </div>
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
      <!-- Left Side: Form (takes 3 columns) -->
      <div class="xl:col-span-3">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <form @submit.prevent="addProduct" class="space-y-6">
            <!-- Image Upload Section -->
            <div>
              <label class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ImagePlus class="w-4 h-4 text-violet-600" />
                Product Image
              </label>
              <div
                class="relative group border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500"
                :class="isDragging
                  ? 'border-violet-500 bg-linear-to-br from-violet-50 to-fuchsia-50 scale-[0.98]'
                  : 'border-gray-300 hover:border-violet-400 hover:bg-linear-to-br hover:from-violet-50/50 hover:to-fuchsia-50/50'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="$refs.fileInput.click()">
                <input type="file" accept="image/*" class="hidden" ref="fileInput" @change="handleFileChange"/>

                <div v-if="!imagePreview" class="space-y-4">
                  <div class="inline-flex p-6 bg-linear-to-br from-violet-100 to-fuchsia-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <ImagePlus class="w-12 h-12 text-violet-600"/>
                  </div>
                  <div>
                    <p class="text-lg font-semibold text-gray-700">Drop your image here</p>
                    <p class="text-sm text-gray-500 mt-1">or <span class="text-violet-600 font-bold">browse files</span></p>
                    <p class="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                </div>
                <div v-else class="relative">
                  <img :src="imagePreview" alt="Preview"
                    class="w-full max-w-md mx-auto h-64 object-cover rounded-2xl shadow-2xl ring-4 ring-violet-100"/>
                  <button @click.stop="removeImage" type="button"
                    class="absolute -top-3 -right-3 p-3 bg-linear-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <!-- Form Fields Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Product Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-900 mb-2">Product Name</label>
                <input
                  v-model="productData.productname"
                  type="text"
                  placeholder="e.g., Premium Cotton T-Shirt"
                  class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"/>
              </div>
              <!-- Size -->
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Size</label>
                <input
                  v-model="productData.productsize"
                  type="text"
                  placeholder="S, M, L, XL"
                  class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400"/>
              </div>
              <!-- Color -->
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Color</label>
                <input
                  v-model="productData.productcolor"
                  type="text"
                  placeholder="Black, White, Blue"
                  class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400"/>
              </div>
              <!-- Price -->
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Price</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    v-model.number="productData.productprice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full pl-10 pr-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400"/>
                </div>
              </div>
              <!-- Discount -->
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Discount</label>
                <div class="relative">
                  <input
                    v-model.number="productData.productdiscount"
                    type="number"
                    placeholder="0"
                    class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400"/>
                  <span class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                </div>
              </div>
              <!-- Category -->
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-900 mb-2">Category</label>
                <select
                  v-model="productData.categoryid"
                  class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 font-medium">
                  <option value="">Select a category</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Pants">Pants</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-900 mb-2">Description</label>
                <textarea
                  v-model="productData.description"
                  placeholder="Tell customers about this product..."
                  rows="4"
                  class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"></textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Right Side: Live Preview (takes 2 columns) -->
      <div class="xl:col-span-2 xl:w-full">
        <div class="sticky top-6">
          <div class="bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 shadow-2xl">
            <h2 class="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <Sparkles class="w-6 h-6" />
              Live Preview
            </h2>
            <!-- Product Card Preview -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
              <!-- Image Container -->
              <div class="relative w-full h-80 bg-linear-to-br from-gray-100 to-gray-200">
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Product"
                  class="w-full h-full object-cover"/>
                <div v-else class="w-full h-full flex items-center justify-center">
                  <div class="text-center space-y-3">
                    <ImagePlus class="w-20 h-20 text-gray-300 mx-auto" />
                    <p class="text-gray-400 font-medium">No image yet</p>
                  </div>
                </div>

                <!-- Discount Badge -->
                <div v-if="productData.productdiscount"
                  class="absolute top-4 right-4 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg font-black text-sm">
                  -{{ productData.productdiscount }}% OFF
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-6 space-y-4">
                <div>
                  <h3 class="text-2xl font-black text-gray-900 mb-2">
                    {{ productData.productname || 'Product Name' }}
                  </h3>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    {{ productData.description || 'Product description will appear here...' }}
                  </p>
                </div>

                <!-- Product Details Grid -->
                <div class="grid grid-cols-3 gap-3">
                  <div class="bg-gray-50 rounded-2xl p-3 text-center">
                    <p class="text-xs text-gray-500 font-bold mb-1">Size</p>
                    <p class="text-sm font-black text-gray-900">{{ productData.productsize || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-2xl p-3 text-center">
                    <p class="text-xs text-gray-500 font-bold mb-1">Color</p>
                    <p class="text-sm font-black text-gray-900">{{ productData.productcolor || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-2xl p-3 text-center">
                    <p class="text-xs text-gray-500 font-bold mb-1">Category</p>
                    <p class="text-sm font-black text-gray-900">{{ productData.categoryid || '-' }}</p>
                  </div>
                </div>

                <!-- Price Section -->
                <div class="pt-4 border-t-2 border-gray-100">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-gray-500 font-bold mb-1">Price</p>
                      <div class="flex items-baseline gap-2">
                        <span class="text-3xl font-black bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          ${{ discountedPrice ? discountedPrice.toFixed(2) : (productData.productprice ? productData.productprice.toFixed(2) : '0.00') }}
                        </span>
                        <span v-if="productData.productdiscount" class="text-lg text-gray-400 line-through font-bold">
                          ${{ productData.productprice ? productData.productprice.toFixed(2) : '0.00' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-4 mt-6">
              <button
                @click="addProduct"
                :disabled="isSubmitting"
                class="group relative px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl shadow-xl transition-all duration-300 font-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isSubmitting">Add Product</span>
                <span v-else>Adding...</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <RouterLink to="/manage-stock">
                <button
                  class="w-full px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-xl transition-all duration-300 font-black">
                  View All
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
