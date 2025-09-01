<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Minus, X, ShoppingCart } from 'lucide-vue-next';
import { useCart }  from '../../composables/useCart.js';

const router = useRouter();
const userId = 1; // Replace with actual logged-in user id
const {
  cartItems,
  isLoading,
  fetchCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  totalQuantity,
  totalPrice
} = useCart();

onMounted(() => fetchCart(userId));

const checkout = () => {
  router.push('/checkout');
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <ShoppingCart class="w-12 h-12 animate-spin text-blue-600"/>
    </div>
    <!-- Empty cart -->
    <div v-else-if="cartItems.length === 0" class="text-center py-16">
      <h2 class="text-2xl font-semibold mb-4">Your cart is empty</h2>
      <button @click="router.push('/')"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go Shopping
      </button>
    </div>
    <!-- Cart items -->
    <div v-else class="space-y-6">
      <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div class="flex items-center gap-4">
          <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg"/>
          <div>
            <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">Color: {{ item.color }}, Size: {{ item.size }}</p>
            <p class="text-sm text-gray-500">Price: ${{ item.price.toFixed(2) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="decrementQuantity(item)" class="p-2 border rounded disabled:opacity-50" :disabled="item.quantity <= 1">
            <Minus class="w-4 h-4"/>
          </button>
          <span class="w-6 text-center">{{ item.quantity }}</span>
          <button @click="incrementQuantity(item)" class="p-2 border rounded" :disabled="item.quantity >= Math.min(10, item.stock)">
            <Plus class="w-4 h-4"/>
          </button>
        </div>
        <div class="flex items-center gap-4">
          <span class="font-semibold">${{ item.subtotal.toFixed(2) }}</span>
          <button @click="removeItem(item)" class="text-red-500 hover:text-red-700">
            <X class="w-5 h-5"/>
          </button>
        </div>
      </div>
      <!-- Totals & Checkout -->
      <div class="mt-6 flex justify-end items-center gap-6">
        <div class="text-right">
          <p>Total items: {{ totalQuantity }}</p>
          <p class="font-semibold text-lg">Subtotal: ${{ totalPrice.toFixed(2) }}</p>
        </div>
        <button @click="checkout" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>
