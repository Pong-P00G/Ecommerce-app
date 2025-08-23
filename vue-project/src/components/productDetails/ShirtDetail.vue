<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Shirt } from '../../data/shirt.js'; // the merged + category-tagged file

const route = useRoute();
const router = useRouter();

const DELAY_MS = 500;
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

const selectedSize = ref(null);
const selectedColor = ref(null);

const colorMap = {
  black: '#000000',
  white: '#ffffff',
  gray: '#6B7280',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316'
};

const simulateApiDelay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration));

const findProductById = (id) => Shirt.find(product => product.id === id);

const fetchProduct = async () => {
  const productId = parseInt(route.params.id);
  await simulateApiDelay(DELAY_MS);
  const selectedProduct = findProductById(productId);
  if (!selectedProduct) throw new Error('Product not found');
  return selectedProduct;
};

onMounted(async () => {
  try {
    product.value = await fetchProduct();

    if (product.value) {
      // Default to first available options
      selectedSize.value = Object.keys(product.value.size)?.[0] || null;
      selectedColor.value = Object.keys(product.value.color)?.[0] || null;
    }
  } catch (e) {
    error.value = e.message || 'Failed to load product';
  } finally {
    isLoading.value = false;
  }
});

const addToCart = () => {
  if (!selectedSize.value || !selectedColor.value) {
    alert('Please select size and color');
    return;
  }

  const cartItem = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    size: selectedSize.value,
    color: selectedColor.value,
    quantity: 1,
    image: product.value.image,
    category: product.value.category,
  };

  let existingCartItems;
  try {
    existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch {
    existingCartItems = [];
  }

  const existingItemIndex = existingCartItems.findIndex(item =>
    item.id === cartItem.id &&
    item.size === cartItem.size &&
    item.color === cartItem.color
  );

  if (existingItemIndex !== -1) {
    existingCartItems[existingItemIndex].quantity += 1;
  } else {
    existingCartItems.push(cartItem);
  }

  localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
  router.push('/checkout');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500 border-b-4"></div>
    </div>
    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 text-xl font-semibold py-8">
      {{ error }}
    </div>
    <!-- Product Details -->
    <div v-else-if="product"
        class="w-full max-w-3xl bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate-fadeIn">
      <h1 class="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-sm">
        {{ product.name }}
      </h1>
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Product Image -->
        <div class="flex-1 flex justify-center items-center">
          <img :src="product.image" :alt="product.name"
              class="w-[280px] rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
        </div>
        <!-- Product Info -->
        <div class="flex-1 space-y-4">
          <p class="text-gray-300 text-lg leading-relaxed">{{ product.description }}</p>
          <!-- Size selector -->
          <div v-if="product.size && Object.keys(product.size).length">
            <strong class="text-gray-100">Size:</strong>
            <div class="flex gap-3 mt-2">
              <button
                v-for="(label, key) in product.size"
                :key="key"
                @click="selectedSize = key"
                :class="[
                  'px-4 py-2 rounded border cursor-pointer select-none',
                  selectedSize === key
                    ? 'bg-gray-800/80 text-white border-gray-400'
                    : 'bg-white border-gray-300 hover:bg-gray-100']">
                {{ label }}
              </button>
            </div>
          </div>
          <!-- Color selector -->
          <div v-if="product.color && Object.keys(product.color).length">
            <strong class="text-gray-100">Color:</strong>
            <div class="flex gap-3 mt-2 items-center">
              <button
                v-for="(name, key) in product.color"
                :key="key"
                @click="selectedColor = key"
                :title="name"
                :class="[
                  'w-8 h-8 rounded-full border-2 cursor-pointer transition-transform duration-200',
                  selectedColor === key
                    ? 'border-emerald-700 scale-110'
                    : 'border-gray-300']"
                :style="{ backgroundColor: colorMap[name.toLowerCase()] || '#ccc' }"
              ></button>
            </div>
          </div>
          <p class="text-gray-300"><strong class="text-gray-100">Category:</strong> {{ product.category }}</p>
          <p class="text-3xl font-bold text-emerald-400">
            ${{ Number(product.price).toFixed(2) }}
          </p>
          <!-- Add to Cart Button -->
          <button @click="addToCart" class="w-full py-3 px-6 mt-4 text-lg font-semibold text-white rounded-lg shadow-md 
              bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
              transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
