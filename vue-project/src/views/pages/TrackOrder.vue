<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { orderAPI } from '../../api/orderApi.js'
import {
    Package, Truck, CheckCircle, Clock, Search, MapPin,
    ArrowRight, MessageCircle, Loader2, AlertCircle, X, ShoppingBag
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()

const orderNumber = ref('')
const trackingResult = ref(null)
const searching = ref(false)
const searchError = ref(null)
const isLoggedIn = computed(() => authStore.isAuthenticated)

// Pre-fill from query params if coming from order detail
onMounted(() => {
    if (route.query.orderId) {
        orderNumber.value = route.query.orderId
        handleTrack()
    }
})

const orderStages = (status) => {
    const stages = [
        { name: 'Order Placed', key: 'placed', icon: CheckCircle },
        { name: 'Confirmed', key: 'confirmed', icon: Clock },
        { name: 'Shipped', key: 'shipped', icon: Package },
        { name: 'Out for Delivery', key: 'out_for_delivery', icon: Truck },
        { name: 'Delivered', key: 'delivered', icon: MapPin },
    ]

    const statusProgress = {
        'pending': 0,
        'confirmed': 1,
        'shipped': 2,
        'delivered': 4,
        'cancelled': -1,
    }

    const progress = statusProgress[status] ?? 0

    return stages.map((stage, idx) => ({
        ...stage,
        status: progress === -1
            ? 'cancelled'
            : idx <= progress
                ? 'completed'
                : idx === progress + 1
                    ? 'active'
                    : 'pending'
    }))
}

const timelineStages = computed(() => {
    if (!trackingResult.value) return []
    return orderStages(trackingResult.value.status)
})

const statusLabel = (status) => {
    const labels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        shipped: 'In Transit',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
    }
    return labels[status] || status
}

const handleTrack = async () => {
    if (!orderNumber.value) {
        searchError.value = 'Please enter an order number'
        return
    }

    searching.value = true
    searchError.value = null

    try {
        const res = await orderAPI.getOrder(Number(orderNumber.value))
        if (res.success && res.data) {
            const order = res.data
            trackingResult.value = {
                orderId: order.orderId,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items: order.items || [],
                estimatedDelivery: calculateDelivery(order.createdAt),
            }
        } else {
            searchError.value = res.message || 'Order not found. Please check your order number.'
            trackingResult.value = null
        }
    } catch (err) {
        console.error('Track order error:', err)
        const msg = err.response?.status === 404
            ? 'Order not found. Please check your order number.'
            : err.response?.data?.message || 'Failed to look up order. Please try again.'
        searchError.value = msg
        trackingResult.value = null
    } finally {
        searching.value = false
    }
}

const calculateDelivery = (createdAt) => {
    if (!createdAt) return 'N/A'
    const created = new Date(createdAt)
    const est = new Date(created)
    est.setDate(est.getDate() + 7)
    return est.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

const formatPrice = (p) => parseFloat(p || 0).toFixed(2)

const getProgressWidth = (status) => {
    const progress = {
        'pending': 10,
        'confirmed': 30,
        'shipped': 50,
        'delivered': 100,
        'cancelled': 0,
    }
    return progress[status] || 0
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
                <h1 class="heading-hero text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
                    Track your
                    <span class="text-accent">order</span>
                </h1>
                <p class="text-neutral-600 text-lg">Real-time updates on your order, every step of the way.</p>
            </div>

            <!-- Search Form -->
            <div class="card-flat p-8 mb-10 max-w-3xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Order number</label>
                        <input
                            v-model="orderNumber"
                            type="text"
                            placeholder="e.g. 1001"
                            class="input-base"
                            @keyup.enter="handleTrack"
                            aria-label="Order number"
                        />
                        <p class="text-xs text-neutral-400 mt-1.5">
                            {{ isLoggedIn ? 'Enter your order number to track its status.' : 'Sign in to view your orders, or enter an order number.' }}
                        </p>
                    </div>
                </div>

                <!-- Error message -->
                <div v-if="searchError" class="flex items-center gap-2 mb-4 p-3 bg-danger/5 border border-danger/20 rounded-xl text-sm text-danger">
                    <AlertCircle class="w-4 h-4 shrink-0" />
                    {{ searchError }}
                </div>

                <button
                    @click="handleTrack"
                    :disabled="searching"
                    class="btn-accent shine-effect w-full py-4 disabled:opacity-50"
                >
                    <Loader2 v-if="searching" class="w-5 h-5 animate-spin" />
                    <Search v-else class="w-5 h-5" />
                    {{ searching ? 'Searching...' : 'Track order' }}
                    <ArrowRight v-if="!searching" class="w-4 h-4" />
                </button>
            </div>

            <!-- Tracking Result -->
            <div v-if="trackingResult" class="card-flat p-8 max-w-3xl mx-auto animate-fade-up">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200 flex-wrap gap-4">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Order status</p>
                        <div class="flex items-center gap-3 mt-1">
                            <p class="text-2xl font-bold" :class="trackingResult.status === 'cancelled' ? 'text-danger' : 'text-accent'">
                                {{ statusLabel(trackingResult.status) }}
                            </p>
                            <span class="text-sm text-neutral-500 font-medium tabular-nums">#{{ trackingResult.orderId }}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Estimated delivery</p>
                        <p class="text-2xl font-bold text-ink mt-1 tabular-nums">{{ trackingResult.estimatedDelivery }}</p>
                    </div>
                </div>

                <!-- Order Details Summary -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    <div class="bg-neutral-50 rounded-xl p-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">Order placed</p>
                        <p class="font-bold text-ink text-sm">{{ formatDate(trackingResult.createdAt) }}</p>
                    </div>
                    <div class="bg-neutral-50 rounded-xl p-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">Items</p>
                        <p class="font-bold text-ink text-sm">{{ trackingResult.items.length }} {{ trackingResult.items.length === 1 ? 'item' : 'items' }}</p>
                    </div>
                    <div class="bg-neutral-50 rounded-xl p-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">Total</p>
                        <p class="font-bold text-ink text-sm tabular-nums">${{ formatPrice(trackingResult.totalAmount) }}</p>
                    </div>
                </div>

                <!-- Cancelled notice -->
                <div v-if="trackingResult.status === 'cancelled'" class="mb-8 p-4 bg-danger/5 border border-danger/20 rounded-xl flex items-center gap-3">
                    <X class="w-5 h-5 text-danger shrink-0" />
                    <div>
                        <p class="text-sm font-bold text-danger">Order cancelled</p>
                        <p class="text-xs text-neutral-600">This order has been cancelled. Please contact support if you have any questions.</p>
                    </div>
                </div>

                <!-- Progress Timeline -->
                <div v-if="trackingResult.status !== 'cancelled'" class="mb-8">
                    <h3 class="font-bold text-ink mb-7">Shipping progress</h3>
                    <div class="flex items-start justify-between relative gap-1 sm:gap-0">
                        <div class="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 h-1 bg-neutral-200 rounded-full"></div>
                        <div
                            class="absolute top-4 sm:top-5 left-4 sm:left-5 h-1 rounded-full transition-all duration-1000"
                            :class="trackingResult.status === 'delivered' ? 'bg-success' : 'bg-accent'"
                            :style="{ width: `calc(${getProgressWidth(trackingResult.status)}% - 16px)` }"
                        ></div>
                        <div
                            v-for="(stage, idx) in timelineStages"
                            :key="idx"
                            class="relative z-10 flex flex-col items-center min-w-0"
                            style="flex: 1;"
                        >
                            <div :class="[
                                'w-8 h-8 sm:w-10 sm:h-10 rounded-full inline-flex items-center justify-center mb-1 sm:mb-2 transition-all duration-500 shrink-0',
                                stage.status === 'completed'
                                    ? 'bg-success text-white shadow-[0_4px_12px_-4px_rgb(34_197_94_/_0.5)]'
                                    : stage.status === 'active'
                                        ? 'bg-accent text-white shadow-[0_4px_12px_-4px_rgb(249_115_22_/_0.5)] scale-110'
                                        : 'bg-neutral-200 text-neutral-400'
                            ]">
                                <component :is="stage.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <p class="text-[10px] sm:text-xs font-semibold text-ink text-center leading-tight break-words">{{ stage.name }}</p>
                        </div>
                    </div>
                </div>

                <!-- Items List -->
                <div v-if="trackingResult.items.length > 0" class="mb-6">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">Order items</h3>
                    <div class="space-y-2">
                        <div
                            v-for="item in trackingResult.items"
                            :key="item.orderItemId"
                            class="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
                        >
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-lg bg-paper border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600 shrink-0">
                                    {{ item.quantity }}
                                </div>
                                <span class="text-sm text-ink truncate">{{ item.productName || `Product #${item.productId}` }}</span>
                            </div>
                            <span class="text-sm font-semibold text-ink tabular-nums shrink-0 ml-2">
                                ${{ formatPrice(item.unitPrice) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4 border-t border-neutral-200">
                    <router-link
                        :to="{ name: 'userprofile', query: { tab: 'orders' } }"
                        class="btn-outline flex-1 text-sm"
                    >
                        <ShoppingBag class="w-4 h-4" />
                        All orders
                    </router-link>
                    <router-link
                        to="/contact"
                        class="btn-ghost flex-1 text-sm"
                    >
                        <MessageCircle class="w-4 h-4" />
                        Need help?
                    </router-link>
                </div>
            </div>

            <!-- Help Section -->
            <div class="mt-12 text-center">
                <div class="inline-flex items-center gap-2 text-sm text-neutral-500 card-flat px-5 py-3">
                    <MessageCircle class="w-4 h-4 text-accent" />
                    Need help?
                    <router-link to="/contact" class="text-ink font-bold hover:text-accent transition-colors">Contact support</router-link>
                </div>
            </div>
        </section>
    </div>
</template>
