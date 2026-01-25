<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-2xl w-full">
          <!-- Success Card -->
          <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
              <!-- Success Icon -->
              <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
              </div>

              <!-- Success Message -->
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p class="text-gray-600 mb-8">
                  Thank you for your purchase. Your order has been received and is being processed.
              </p>

              <!-- Order Details -->
              <div class="bg-gray-50 rounded-xl p-6 mb-8">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                      <div class="text-left">
                          <p class="text-gray-500 mb-1">Order Number</p>
                          <p class="font-semibold text-gray-900">#{{ orderNumber }}</p>
                      </div>
                      <div class="text-left">
                          <p class="text-gray-500 mb-1">Order Date</p>
                          <p class="font-semibold text-gray-900">{{ orderDate }}</p>
                      </div>
                      <div class="text-left">
                          <p class="text-gray-500 mb-1">Total Amount</p>
                          <p class="font-semibold text-gray-900">${{ orderTotal }}</p>
                      </div>
                      <div class="text-left">
                          <p class="text-gray-500 mb-1">Payment Method</p>
                          <p class="font-semibold text-gray-900">{{ paymentMethod }}</p>
                      </div>
                  </div>
              </div>

              <!-- Confirmation Email -->
              <div class="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>A confirmation email has been sent to your email address</span>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-4">
                  <router-link 
                      to="/orders"
                      class="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                      Track Order
                  </router-link>
                  <router-link 
                      to="/products"
                      class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                      Continue Shopping
                  </router-link>
              </div>
          </div>

          <!-- What's Next -->
          <div class="mt-8 bg-white rounded-2xl shadow-sm p-6">
              <h3 class="font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div class="space-y-4">
                  <div class="flex gap-4">
                      <div class="shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          1
                      </div>
                      <div>
                          <h4 class="font-medium text-gray-900">Order Confirmation</h4>
                          <p class="text-sm text-gray-600">You'll receive a confirmation email shortly</p>
                      </div>
                  </div>
                  <div class="flex gap-4">
                      <div class="shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          2
                      </div>
                      <div>
                          <h4 class="font-medium text-gray-900">Processing</h4>
                          <p class="text-sm text-gray-600">We'll prepare your order for shipment</p>
                      </div>
                  </div>
                  <div class="flex gap-4">
                      <div class="shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          3
                      </div>
                      <div>
                          <h4 class="font-medium text-gray-900">Shipping</h4>
                          <p class="text-sm text-gray-600">Track your package with the tracking number we'll send</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const orderNumber = ref('');
const orderDate = ref('');
const orderTotal = ref('0.00');
const paymentMethod = ref('Credit Card');

onMounted(() => {
  // Generate order details
  orderNumber.value = Math.random().toString(36).substr(2, 9).toUpperCase();
  orderDate.value = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
  });
  
  // Get from order data (you'd pass this from checkout)
  orderTotal.value = localStorage.getItem('orderTotal') || '179.99';
  paymentMethod.value = localStorage.getItem('paymentMethod') || 'Credit Card';
});
</script>