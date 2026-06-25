<script setup>
import { ref, computed } from 'vue'
import { Package, Truck, CheckCircle, Clock, Search, MapPin } from 'lucide-vue-next'

const orderNumber = ref('')
const email = ref('')
const trackingResult = ref(null)
const searching = ref(false)

const orderStages = [
    { name: 'Order Placed', icon: CheckCircle, status: 'completed' },
    { name: 'Processing', icon: Clock, status: 'completed' },
    { name: 'Shipped', icon: Package, status: 'active' },
    { name: 'Out for Delivery', icon: Truck, status: 'pending' },
    { name: 'Delivered', icon: MapPin, status: 'pending' }
]

const handleTrack = () => {
    searching.value = true
    setTimeout(() => {
        trackingResult.value = {
            orderNumber: orderNumber.value,
            status: 'In Transit',
            estimatedDelivery: '2026-07-02',
            carrier: 'FedEx',
            trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            currentLocation: 'Memphis, TN'
        }
        searching.value = false
    }, 1500)
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                    <Truck class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Track Your Order
                </h1>
                <p class="text-gray-600 text-lg">Real-time updates on your shipment</p>
            </div>

            <!-- Search Form -->
            <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Order Number</label>
                        <input v-model="orderNumber" type="text" placeholder="#1001"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                        <input v-model="email" type="email" placeholder="you@example.com"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                    </div>
                </div>
                <button @click="handleTrack" :disabled="searching"
                    class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                    <Search class="w-5 h-5" />
                    {{ searching ? 'Tracking...' : 'Track Order' }}
                </button>
            </div>

            <!-- Tracking Result -->
            <div v-if="trackingResult" class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <p class="text-sm text-gray-500 uppercase tracking-wider">Order Status</p>
                        <p class="text-2xl font-bold text-blue-600">{{ trackingResult.status }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500 uppercase tracking-wider">Estimated Delivery</p>
                        <p class="text-2xl font-bold text-gray-900">{{ trackingResult.estimatedDelivery }}</p>
                    </div>
                </div>

                <!-- Progress Timeline -->
                <div class="mb-8">
                    <h3 class="text-lg font-bold text-gray-900 mb-6">Shipping Progress</h3>
                    <div class="flex items-center justify-between relative">
                        <div class="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
                        <div class="absolute top-5 left-0 h-1 bg-blue-500" style="width: 60%"></div>
                        <div v-for="(stage, idx) in orderStages" :key="idx" class="relative z-10 flex flex-col items-center">
                            <div :class="{
                                'bg-blue-500 text-white': stage.status === 'completed' || stage.status === 'active',
                                'bg-gray-200 text-gray-400': stage.status === 'pending'
                            }" class="w-10 h-10 rounded-full flex items-center justify-center mb-2">
                                <component :is="stage.icon" class="w-5 h-5" />
                            </div>
                            <p class="text-xs font-medium text-gray-700 text-center max-w-20">{{ stage.name }}</p>
                        </div>
                    </div>
                </div>

                <!-- Shipment Details -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 rounded-xl p-4">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Carrier</p>
                        <p class="font-bold text-gray-900">{{ trackingResult.carrier }}</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Number</p>
                        <p class="font-bold text-gray-900 text-sm">{{ trackingResult.trackingNumber }}</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Location</p>
                        <p class="font-bold text-gray-900">{{ trackingResult.currentLocation }}</p>
                    </div>
                </div>
            </div>

            <!-- Help Section -->
            <div class="mt-8 text-center text-sm text-gray-500">
                Need help? <a href="/contact" class="text-blue-600 font-semibold hover:underline">Contact support</a>
            </div>
        </div>
    </div>
</template>
