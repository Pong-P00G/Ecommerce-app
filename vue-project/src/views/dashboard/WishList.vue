<script setup>
import { ref, computed } from 'vue';
import {
  Search, Grid, List, Heart,
  ShoppingCart, Trash2, Package, ArrowRight
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import ProductPreview from '../components/ProductPreview.vue';
import { useWishlist } from '../composables/useWishList.js';
import { Accesorie } from '../data/accesorie.js';
import { Hoodie } from '../data/hoodies.js';
import { Pants } from '../data/pants.js';
import { Shirt } from '../data/shirt.js';

const router = useRouter();
const wishlistStore = useWishlist();
const filterText = ref('');
const selectedSort = ref('name');
const isGridView = ref(true);

const allProducts = [...Accesorie, ...Hoodie, ...Pants, ...Shirt];

const wishlistItems = computed(() => {
  const wishlistIds = Array.from(wishlistStore.wishlist);
  return allProducts.filter(p => wishlistIds.includes(p.id));
});
const filteredWishlist = computed(() => {
  let list = [...wishlistItems.value];
  if (filterText.value.trim()) {
    const term = filterText.value.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }

  if (selectedSort.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (selectedSort.value === 'price') list.sort((a, b) => a.price - b.price);

  return list;
});

const wishlistCount = computed(() => wishlistItems.value.length);

const moveToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  wishlistStore.remove(product.id);
};

const addAllToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(...wishlistItems.value);
  localStorage.setItem('cart', JSON.stringify(cart));
  wishlistStore.clear();
};

const continueShopping = () => router.push('/');
</script>

<template>
  <div class="p-6 max-w-screen-xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-2xl font-semibold flex items-center gap-2 text-gray-800">
        <Heart class="w-6 h-6 text-pink-600" />
        Wishlist ({{ wishlistCount }})
      </h2>
      <!-- Controls -->
      <div class="flex flex-wrap gap-3 items-center">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="filterText"
            type="text"
            placeholder="Search..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm transition"
          />
          <Search class="w-5 h-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        <!-- Sort -->
        <select
          v-model="selectedSort"
          class="py-2 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 shadow-sm transition"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        <!-- View Toggle -->
        <button @click="isGridView = true"
          :class="isGridView ? 'bg-gray-200 shadow-md' : ''"
          class="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Grid class="w-5 h-5" />
        </button>
        <button @click="isGridView = false"
          :class="!isGridView ? 'bg-gray-200 shadow-md' : ''"
          class="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <List class="w-5 h-5" />
        </button>
        <!-- Actions -->
        <button @click="addAllToCart"
          :disabled="wishlistCount === 0"
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition disabled:opacity-50"
        >
          <ShoppingCart class="w-4 h-4" /> Add All to Cart
        </button>
        <button @click="wishlistStore.clear"
          :disabled="wishlistCount === 0"
          class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition disabled:opacity-50"
        >
          <Trash2 class="w-4 h-4" /> Clear Wishlist
        </button>
      </div>
    </div>
    <!-- Wishlist Items -->
    <div v-if="filteredWishlist.length > 0"
        :class="isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'">
      <div v-for="item in filteredWishlist" :key="item.id"
          class="border rounded-2xl p-4 shadow hover:shadow-lg transition hover:scale-105 bg-white">
        <ProductPreview :product="item" />
        <div class="mt-4 flex justify-between items-center gap-3">
          <button @click="moveToCart(item)"
                  class="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow-md transition">
            <Package class="w-4 h-4" /> Move to Cart
          </button>
          <button @click="wishlistStore.remove(item.id)"
                  class="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm shadow-md transition">
            <Trash2 class="w-4 h-4" /> Remove
          </button>
        </div>
      </div>
    </div>
    <!-- Empty State -->
    <div v-else class="text-center text-gray-400 mt-10">
      <p class="text-lg mb-4">Your wishlist is empty.</p>
      <button @click="continueShopping"
              class="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition">
        <ArrowRight class="w-4 h-4" /> Continue Shopping
      </button>
    </div>
  </div>
</template>
