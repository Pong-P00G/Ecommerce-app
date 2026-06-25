<script setup>
import { Truck, Globe, Zap, Shield, Clock, MapPin } from 'lucide-vue-next'

const shippingOptions = [
    {
        name: 'Standard Shipping',
        time: '5-7 business days',
        price: 'Free on orders $50+',
        icon: Truck,
        color: 'from-blue-500 to-indigo-600'
    },
    {
        name: 'Express Shipping',
        time: '2-3 business days',
        price: '$9.99',
        icon: Zap,
        color: 'from-orange-500 to-red-600'
    },
    {
        name: 'Overnight Shipping',
        time: 'Next business day',
        price: '$24.99',
        icon: Clock,
        color: 'from-purple-500 to-pink-600'
    },
    {
        name: 'International',
        time: '7-14 business days',
        price: 'Calculated at checkout',
        icon: Globe,
        color: 'from-emerald-500 to-teal-600'
    }
]

const features = [
    { icon: Shield, title: 'Insured Packages', desc: 'All orders are fully insured' },
    { icon: MapPin, title: 'Real-Time Tracking', desc: 'Track every step of delivery' },
    { icon: Truck, title: 'Free Standard Shipping', desc: 'On all orders over $50' }
]
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-blue-50 py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                    <Truck class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    Shipping Information
                </h1>
                <p class="text-gray-600 text-lg">Fast, reliable delivery to your door</p>
            </div>

            <!-- Shipping Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div v-for="option in shippingOptions" :key="option.name"
                    class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                    <div :class="`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mb-4 shadow-md`">
                        <component :is="option.icon" class="w-6 h-6 text-white" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ option.name }}</h3>
                    <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Clock class="w-4 h-4" />
                        {{ option.time }}
                    </div>
                    <p class="font-bold text-blue-600">{{ option.price }}</p>
                </div>
            </div>

            <!-- Features -->
            <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Why Ship With Us</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="feature in features" :key="feature.title"
                        class="text-center">
                        <div class="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                            <component :is="feature.icon" class="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 class="font-bold text-gray-900 mb-1">{{ feature.title }}</h3>
                        <p class="text-sm text-gray-600">{{ feature.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- FAQ-style Info -->
            <div class="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Shipping FAQ</h2>
                <div class="space-y-3">
                    <details class="bg-white rounded-xl p-4 cursor-pointer">
                        <summary class="font-semibold text-gray-900">Do you ship internationally?</summary>
                        <p class="mt-2 text-sm text-gray-600">Yes, we ship to over 30 countries worldwide. International shipping rates are calculated at checkout.</p>
                    </details>
                    <details class="bg-white rounded-xl p-4 cursor-pointer">
                        <summary class="font-semibold text-gray-900">Can I change my shipping address?</summary>
                        <p class="mt-2 text-sm text-gray-600">You can change your shipping address within 2 hours of placing your order by contacting support.</p>
                    </details>
                    <details class="bg-white rounded-xl p-4 cursor-pointer">
                        <summary class="font-semibold text-gray-900">What if my package is lost?</summary>
                        <p class="mt-2 text-sm text-gray-600">All shipments are insured. If your package is lost, we'll send a replacement or issue a full refund.</p>
                    </details>
                </div>
            </div>
        </div>
    </div>
</template>
