<script setup>
import { computed, onMounted } from 'vue';
import { useWishlistStore } from '../../stores/wishlist';
import { useCartStore } from '../../stores/Cart';
import { useRouter } from 'vue-router';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

onMounted(() => {
  wishlistStore.fetchWishlist();
});

const wishlistItems = computed(() => wishlistStore.wishlistItems);

const moveToCart = (product) => {
  cartStore.addToCart(product.id, 1, product.stock);
  wishlistStore.removeFromWishlist(product.id);
};

const clearWishlist = () => {
  wishlistStore.clearWishlist();
};

const continueShopping = () => router.push('/Allproduct');
</script>

<template>
  <div class="min-h-screen bg-[#f7fafc] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-4xl font-bold text-gray-800 flex items-center gap-4">
          <Heart class="w-10 h-10 text-pink-500" />
          Your Wishlist
        </h1>
        <button @click="continueShopping" class="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-300">
          <ArrowLeft class="w-6 h-6" />
          <span class="font-medium">Back to Shopping</span>
        </button>
      </div>
      <div v-if="wishlistItems.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="item in wishlistItems" :key="item.id" class="relative bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-pink-500">
            <img :src="item.image" :alt="item.name" class="w-full h-64 object-cover">
            <div class="p-5">
              <h3 class="text-xl font-semibold text-gray-800 truncate">{{ item.name }}</h3>
              <p class="text-2xl font-bold text-blue-500 mt-2">${{ item.price.toFixed(2) }}</p>
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
              <button @click="moveToCart(item)" class="flex items-center justify-center gap-2 w-full bg-blue-500 text-white px-5 py-3 rounded-lg shadow-xl hover:bg-blue-600 transition-colors duration-300 font-semibold">
                <ShoppingCart class="w-6 h-6" />
                Add to Cart
              </button>
              <button @click="wishlistStore.removeFromWishlist(item.id)" class="flex items-center justify-center gap-2 w-full bg-red-500 text-white px-5 py-3 rounded-lg shadow-xl hover:bg-red-600 transition-colors duration-300 font-semibold">
                <Trash2 class="w-6 h-6" />
                Remove
              </button>
            </div>
          </div>
        </div>
        <div class="text-center mt-16">
          <button @click="clearWishlist" class="bg-red-500 text-white px-10 py-4 rounded-lg shadow-lg hover:bg-red-600 transition-all transform hover:scale-105 font-semibold text-lg">
            Clear Wishlist
          </button>
        </div>
      </div>
      <div v-else class="text-center py-24">
        <div class="inline-block bg-gray-200 p-8 rounded-full mb-6 shadow-inner">
          <Heart class="w-20 h-20 text-gray-400" />
        </div>
        <h2 class="text-3xl font-semibold text-gray-700 mb-4">Your Wishlist is Empty</h2>
        <p class="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your wishlist yet.</p>
        <button @click="continueShopping" class="bg-blue-500 text-white px-10 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105 font-semibold text-lg">
          Start Shopping
        </button>
      </div>
    </div>
  </div>
</template>
