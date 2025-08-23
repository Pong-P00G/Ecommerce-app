<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import { onClickDownloadReceipt } from '../utility/DownloadResipt.js'

import {CheckCircle, Package, Calendar, Clock, CreditCard, ArrowRight, Home, Receipt} from 'lucide-vue-next';

const router = useRouter();
const orderNumber = ref(generateOrderNumber());
const orderDetails = ref(null);

function generateOrderNumber() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

onMounted(() => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalPrice = JSON.parse(localStorage.getItem('totalPrice')) || '0.00';
  const details = {
    items: cartItems,
    total: totalPrice,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };
  orderDetails.value = details;
  // Save for receipt download
  localStorage.setItem('lastOrderNumber', orderNumber.value);
  localStorage.setItem('lastOrderDetails', JSON.stringify(details));
  // Clean up cart
  localStorage.removeItem('cartItems');
  localStorage.removeItem('totalPrice');
});

const backToHome = () => {
  router.push('/');
};
</script>

<template>
  <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-10 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
          class="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 blur-3xl animate-pulse"></div>
      <div
          class="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl animate-pulse delay-1000"></div>
      <div
          class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-600/10 blur-2xl animate-pulse delay-500"></div>
    </div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-3xl mx-auto">
        <!-- Success Animation Card -->
        <div class="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/10 glass-effect">
          <!-- Success Message -->
          <div class="text-center mb-8">
            <div
                class="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-6 shadow-lg animate-bounce-slow">
              <CheckCircle class="w-10 h-10 text-white animate-pulse"/>
              <!-- Success ring animation -->
              <div class="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"></div>
              <div class="absolute inset-0 rounded-full border-2 border-green-400/50 animate-pulse"></div>
            </div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4 animate-gradient">
              Payment Successful!
            </h1>
            <p class="text-xl text-gray-300 mb-2">Thank you for your purchase</p>
            <p class="text-gray-400">Your order has been confirmed and is being processed</p>
          </div>
          <!-- Order Summary Card -->
          <div
              class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-green-400/20">
            <div class="flex items-center mb-4">
              <Receipt class="w-6 h-6 text-green-400 mr-3"/>
              <h2 class="text-2xl font-bold text-white">Order Details</h2>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Order Info -->
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <Package class="w-5 h-5 text-green-400"/>
                  <div>
                    <p class="text-sm text-gray-400">Order Number</p>
                    <p class="text-lg font-bold text-green-400">{{ orderNumber }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <Calendar class="w-5 h-5 text-purple-400"/>
                  <div>
                    <p class="text-sm text-gray-400">Order Date</p>
                    <p class="text-white font-semibold">{{ orderDetails?.date }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <Clock class="w-5 h-5 text-blue-400"/>
                  <div>
                    <p class="text-sm text-gray-400">Order Time</p>
                    <p class="text-white font-semibold">{{ orderDetails?.time }}</p>
                  </div>
                </div>
              </div>
              <!-- Payment Info -->
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <CreditCard class="w-5 h-5 text-pink-400"/>
                  <div>
                    <p class="text-sm text-gray-400">Payment Method</p>
                    <p class="text-white font-semibold">Credit Card ****1234</p>
                  </div>
                </div>
                <div
                    class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-400/30">
                  <p class="text-sm text-gray-400 mb-1">Total Paid</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ${{ orderDetails?.total }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- Order Items -->
          <div v-if="orderDetails?.items?.length" class="mb-8">
            <div class="flex items-center mb-6">
              <Package class="w-6 h-6 text-purple-400 mr-3"/>
              <h2 class="text-2xl font-bold text-white">Items Ordered</h2>
              <span class="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-full">
                {{ orderDetails.items.length }} item{{ orderDetails.items.length !== 1 ? 's' : '' }}
              </span>
            </div>
            <div class="space-y-4">
              <div v-for="item in orderDetails.items" :key="item.id"
                  class="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div class="flex items-center space-x-4">
                  <!-- Product Image -->
                  <div class="relative overflow-hidden rounded-xl bg-white/10 p-2">
                    <img :src="item.image" :alt="item.name"
                        class="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>
                  <!-- Product Details -->
                  <div class="flex-1 space-y-1">
                    <h3 class="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      {{ item.name }}
                    </h3>
                    <div class="flex items-center space-x-4 text-sm text-gray-400">
                      <span class="bg-white/10 px-2 py-1 rounded-full">Size: {{ item.size }}</span>
                      <span class="bg-white/10 px-2 py-1 rounded-full">Color: {{ item.color }}</span>
                      <span class="bg-white/10 px-2 py-1 rounded-full">Qty: {{ item.quantity }}</span>
                    </div>
                  </div>
                  <!-- Price -->
                  <div class="text-right">
                    <p class="text-sm text-gray-400">Subtotal</p>
                    <p class="text-xl font-bold text-purple-300">${{ (item.price * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Delivery Information -->
          <div
              class="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-blue-400/20">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center">
              <Package class="w-5 h-5 text-blue-400 mr-2"/>
              Delivery Information
            </h3>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <p class="text-gray-400">Estimated Delivery:</p>
                <p class="text-white font-semibold">3-5 Business Days</p>
              </div>
              <div class="space-y-2">
                <p class="text-gray-400">Tracking Available:</p>
                <p class="text-blue-400 font-semibold">Within 24 hours</p>
              </div>
            </div>
          </div>
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="backToHome"
                    class="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
              <Home class="w-5 h-5 mr-2 group-hover:animate-bounce"/>
              Back to Home
              <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
            </button>
            <button @click="onClickDownloadReceipt"
                class="flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] group">
              <Package class="w-5 h-5 mr-2 group-hover:animate-pulse"/>
              Download Resipt
            </button>
          </div>
        </div>
        <!-- Additional Information -->
        <div class="text-center text-gray-400 text-sm">
          <p class="mb-2">You will receive an order confirmation email shortly.</p>
          <p>Need help? Contact our support team at <span
              class="text-purple-400 font-semibold">support@example.com</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-effect {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-500 {
  animation-delay: 0.5s;
}

.delay-1000 {
  animation-delay: 1s;
}

* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #10b981, #059669);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #059669, #047857);
}

@media (max-width: 640px) {
  .glass-effect {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}
</style>