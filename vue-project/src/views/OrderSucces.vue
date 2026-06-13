<template>
    <div class="min-h-screen pt-24 pb-12 bg-linear-to-b from-white to-gray-50 px-4">
        <div class="max-w-2xl mx-auto">
            <!-- Success Card -->
            <div class="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center border border-green-100">
                <!-- Success Icon with Animation -->
                <div class="mx-auto w-24 h-24 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-md">
                    <svg class="w-12 h-12 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <!-- Success Message -->
                <h1 class="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">Order Confirmed!</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg mx-auto">
                    Thank you for your purchase. Your order has been received and is being processed with care.
                </p>

                <!-- Order Details Card -->
                <div class="bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 mb-10 border border-gray-200">
                    <div class="grid grid-cols-2 gap-6 text-sm md:gap-8">
                        <div class="text-left">
                            <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Order Number</p>
                            <p class="font-bold text-gray-900 text-lg">#{{ orderNumber }}</p>
                        </div>
                        <div class="text-left">
                            <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Order Date</p>
                            <p class="font-bold text-gray-900 text-lg">{{ orderDate }}</p>
                        </div>
                        <div class="text-left">
                            <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Amount</p>
                            <p class="font-bold text-green-600 text-xl">${{ orderTotal }}</p>
                        </div>
                        <div class="text-left">
                            <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Payment Method</p>
                            <p class="font-bold text-gray-900 text-lg">{{ paymentMethod }}</p>
                        </div>
                    </div>
                </div>

                <!-- Confirmation Email -->
                <div class="flex items-center justify-center gap-3 text-sm text-gray-600 mb-10 bg-blue-50 rounded-xl py-4 px-6 border border-blue-100">
                    <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium">A confirmation email has been sent to your address</span>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-4 mb-8">
                    <button 
                        @click="downloadReceipt"
                        :disabled="isDownloading"
                        class="flex-1 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg v-if="!isDownloading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span v-if="!isDownloading">Download Receipt</span>
                        <span v-else>Generating...</span>
                    </button>
                    <router-link 
                        to="/products"
                        class="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                    >
                        Continue Shopping
                    </router-link>
                </div>

                <router-link 
                    to="/"
                    class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
                >
                    ← Back to Home
                </router-link>
            </div>

            <!-- What's Next -->
            <div class="mt-12 bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-gray-200">
                <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center md:text-left">What Happens Next?</h3>
                <div class="space-y-6">
                    <div class="flex gap-6">
                        <div class="shrink-0 w-10 h-10 bg-linear-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                            1
                        </div>
                        <div class="text-left">
                            <h4 class="font-semibold text-gray-900 text-lg">Order Confirmation</h4>
                            <p class="text-gray-600 mt-1">You'll receive a detailed confirmation email with your receipt and order tracking link</p>
                        </div>
                    </div>
                    <div class="flex gap-6">
                        <div class="shrink-0 w-10 h-10 bg-linear-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                            2
                        </div>
                        <div class="text-left">
                            <h4 class="font-semibold text-gray-900 text-lg">Processing & Preparation</h4>
                            <p class="text-gray-600 mt-1">Our team will prepare your order for shipment with care and attention to detail</p>
                        </div>
                    </div>
                    <div class="flex gap-6">
                        <div class="shrink-0 w-10 h-10 bg-linear-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                            3
                        </div>
                        <div class="text-left">
                            <h4 class="font-semibold text-gray-900 text-lg">Shipping & Delivery</h4>
                            <p class="text-gray-600 mt-1">Track your package in real-time with the tracking number we'll send to your email</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onClickDownloadReceipt } from '@/utility/DownloadReceipt';

const orderNumber = ref('');
const orderDate = ref('');
const orderTotal = ref('0.00');
const paymentMethod = ref('Credit Card');
const isDownloading = ref(false);

const downloadReceipt = async () => {
    if (isDownloading.value) return;
    isDownloading.value = true;
    try {
        await onClickDownloadReceipt();
    } finally {
        isDownloading.value = false;
    }
};

onMounted(() => {
    // Generate order details
    orderNumber.value = Math.random().toString(36).substr(2, 9).toUpperCase();
    orderDate.value = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Get from order data (you'd pass this from checkout)
    orderTotal.value = localStorage.getItem('orderTotal') || '179.99';
    paymentMethod.value = localStorage.getItem('paymentMethod') || 'Credit Card';
    
    // Store order number for receipt generation
    localStorage.setItem('lastOrderNumber', orderNumber.value);
    localStorage.setItem('lastOrderDetails', JSON.stringify({
        date: orderDate.value,
        time: new Date().toLocaleTimeString('en-US'),
        total: orderTotal.value,
        items: JSON.parse(localStorage.getItem('lastOrderDetails'))?.items || []
    }));
});
</script>