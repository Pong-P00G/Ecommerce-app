<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Package, CreditCard} from 'lucide-vue-next';

const router = useRouter();
const cartItems = ref([]);

// Retrieve cart items from local storage on the component mount
onMounted(() => {
  const items = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.value = items;
});

// Remove item from a cart
const removeFromCart = (productId) => {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    cartItems.value = cartItems.value.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems.value)); // Update local storage
  }
};

// Update item quantity
const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 1) return; // Ensure quantity is at least 1
  const item = cartItems.value.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems.value)); // Update local storage
  }
};

// Calculate total price
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

const existingtatalPrice = JSON.parse(localStorage.getItem('totalPrice')) || [];

// Continue shopping
const continueShopping = () => {
  router.push('/Allproduct');
};

//proceed to payment
const proceedToPayment = () => {
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice.value.toFixed(2)));
  //clear cart item
  cartItems.value = [];
  localStorage.removeItem('cartItems');
  router.push('/payment')
}

</script>

<template>
  <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-10 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
          class="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl animate-pulse"></div>
      <div
          class="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl animate-pulse delay-1000"></div>
    </div>
    <div class="container mx-auto px-4 relative z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
          <ShoppingCart class="w-8 h-8 text-white"/>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Your Shopping Cart
        </h1>
        <p class="text-gray-400">{{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }} in your cart</p>
      </div>
      <!-- Cart Items -->
      <div v-if="cartItems.length > 0" class="max-w-4xl mx-auto">
        <!-- Items List -->
        <div class="space-y-6 mb-8">
          <div
              v-for="item in cartItems"
              :key="item.id"
              class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
            <div class="flex items-center space-x-6">
              <!-- Product Image -->
              <div class="relative overflow-hidden rounded-xl bg-white/10 p-2">
                <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
              <!-- Product Details -->
              <div class="flex-1 space-y-2">
                <h3 class="text-xl font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {{ item.name }}
                </h3>
                <div class="flex items-center space-x-4 text-gray-300">
                  <span class="bg-white/10 px-3 py-1 rounded-full text-sm">Size: {{ item.size }}</span>
                  <span class="bg-white/10 px-3 py-1 rounded-full text-sm">Color: {{ item.color }}</span>
                </div>
                <p class="text-2xl font-bold text-purple-300">${{ Number(item.price).toFixed(2) }}</p>
              </div>
              <!-- Quantity Controls -->
              <div class="flex flex-col items-center space-y-4">
                <div class="flex items-center bg-white/10 rounded-xl overflow-hidden">
                  <button
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      class="p-2 hover:bg-white/20 transition-colors duration-200 group/btn"
                      :disabled="item.quantity <= 1"
                  >
                    <Minus class="w-4 h-4 text-purple-300 group-hover/btn:text-white"/>
                  </button>
                  <div class="px-4 py-2 bg-white/5 min-w-[60px] text-center font-semibold">
                    {{ item.quantity }}
                  </div>
                  <button
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="p-2 hover:bg-white/20 transition-colors duration-200 group/btn"
                  >
                    <Plus class="w-4 h-4 text-purple-300 group-hover/btn:text-white"/>
                  </button>
                </div>
                <!-- Subtotal -->
                <div class="text-center">
                  <p class="text-sm text-gray-400">Subtotal</p>
                  <p class="text-lg font-bold text-pink-300">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
              <!-- Remove Button -->
              <button
                  @click="removeFromCart(item.id)"
                  class="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-200 group/remove"
                  aria-label="Remove item"
              >
                <Trash2 class="w-5 h-5 text-red-400 group-hover/remove:text-red-300"/>
              </button>
            </div>
          </div>
        </div>
        <!-- Order Summary -->
        <div
            class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-400/30 mb-8">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
            <Package class="w-6 h-6 mr-3 text-purple-300"/>
            Order Summary
          </h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center text-gray-300">
              <span>Subtotal ({{ cartItems.length }} items)</span>
              <span>${{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-300">
              <span>Shipping</span>
              <span class="text-green-400">Free</span>
            </div>
            <div class="flex justify-between items-center text-gray-300">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div class="border-t border-white/20 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold text-white">Total</span>
                <span
                    class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${{ totalPrice.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between">
          <button
              @click="continueShopping"
              class="flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] group"
          >
            <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"/>
            Continue Shopping
          </button>
          <button
              @click="proceedToPayment();"
              class=" flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
          >
            <CreditCard class="w-5 h-5 mr-2"/>
            Proceed to Payment
            <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </div>
      <!-- Empty Cart Message -->
      <div v-else class="max-w-md mx-auto text-center">
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-12 border border-white/10">
          <div class="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart class="w-10 h-10 text-gray-400"/>
          </div>
          <h2 class="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p class="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <router-link
              to="/Allproduct"
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group">
            <Package class="w-5 h-5 mr-2"/>
              Start Shopping
            <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group.btn:hover .group-hover\/btn\:text-white {
  color: white;
}

.group.remove:hover .group-hover\/remove\:text-red-300 {
  color: rgb(252 165 165);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #db2777);
}
</style>