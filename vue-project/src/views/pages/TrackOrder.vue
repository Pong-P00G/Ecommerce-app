<script setup>
import { ref, computed } from 'vue'
import { Package, Truck, CheckCircle, Clock, Search, MapPin, ArrowRight, MessageCircle } from 'lucide-vue-next'

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
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-12 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Truck class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-5xl md:text-6xl text-ink mb-4">
                    Track your
                    <span class="text-accent">order</span>
                </h1>
                <p class="text-neutral-600 text-lg">Real-time updates on your shipment, every step of the way.</p>
            </div>

            <!-- Search Form -->
            <div class="card-flat p-8 mb-10 max-w-3xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Order number</label>
                        <input v-model="orderNumber" type="text" placeholder="#1001" class="input-base" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Email address</label>
                        <input v-model="email" type="email" placeholder="you@example.com" class="input-base" />
                    </div>
                </div>
                <button
                    @click="handleTrack"
                    :disabled="searching"
                    class="btn-accent shine-effect w-full py-4 disabled:opacity-50"
                >
                    <Search class="w-5 h-5" />
                    {{ searching ? 'Tracking...' : 'Track order' }}
                    <ArrowRight v-if="!searching" class="w-4 h-4" />
                </button>
            </div>

            <!-- Tracking Result -->
            <div v-if="trackingResult" class="card-flat p-8 max-w-3xl mx-auto animate-fade-up">
                <div class="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200 flex-wrap gap-4">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Order status</p>
                        <p class="text-2xl font-bold text-accent mt-1">{{ trackingResult.status }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Estimated delivery</p>
                        <p class="text-2xl font-bold text-ink mt-1 tabular-nums">{{ trackingResult.estimatedDelivery }}</p>
                    </div>
                </div>

                <!-- Progress Timeline -->
                <div class="mb-8">
                    <h3 class="font-bold text-ink mb-7">Shipping progress</h3>
                    <div class="flex items-start justify-between relative gap-1 sm:gap-0">
                        <div class="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 h-1 bg-neutral-200 rounded-full"></div>
                        <div class="absolute top-4 sm:top-5 left-4 sm:left-5 h-1 bg-accent rounded-full" style="width: calc(60% - 16px);"></div>
                        <div
                            v-for="(stage, idx) in orderStages"
                            :key="idx"
                            class="relative z-10 flex flex-col items-center min-w-0"
                            style="flex: 1;"
                        >
                            <div :class="[
                                'w-8 h-8 sm:w-10 sm:h-10 rounded-full inline-flex items-center justify-center mb-1 sm:mb-2 transition-colors shrink-0',
                                stage.status === 'completed' || stage.status === 'active'
                                    ? 'bg-accent text-paper'
                                    : 'bg-neutral-200 text-neutral-400'
                            ]">
                                <component :is="stage.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <p class="text-[10px] sm:text-xs font-semibold text-ink text-center leading-tight break-words">{{ stage.name }}</p>
                        </div>
                    </div>
                </div>

                <!-- Shipment Details -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="bg-neutral-50 rounded-xl p-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">Carrier</p>
                        <p class="font-bold text-ink">{{ trackingResult.carrier }}</p>
                    </div>
                    <div class="bg-neutral-50 rounded-xl p-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">Tracking number</p>
                        <p class="font-bold text-ink text-sm tabular-nums">{{ trackingResult.trackingNumber }}</p>
                    </div>
                    <div class="bg-neutral-50 rounded-xl p-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">Current location</p>
                        <p class="font-bold text-ink">{{ trackingResult.currentLocation }}</p>
                    </div>
                </div>
            </div>

            <!-- Help Section -->
            <div class="mt-12 text-center">
                <div class="inline-flex items-center gap-2 text-sm text-neutral-500 card-flat px-5 py-3">
                    <MessageCircle class="w-4 h-4 text-accent" />
                    Need help?
                    <a href="/contact" class="text-ink font-bold hover:text-accent transition-colors">Contact support</a>
                </div>
            </div>
        </section>
    </div>
</template>
