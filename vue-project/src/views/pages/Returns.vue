<script setup>
import { ref } from 'vue'
import { RotateCcw, Package, CheckCircle, Clock, AlertCircle } from 'lucide-vue-next'

const activeStep = ref(1)

const steps = [
    { num: 1, title: 'Initiate Return', icon: RotateCcw, desc: 'Start a return from your order' },
    { num: 2, title: 'Pack Items', icon: Package, desc: 'Securely pack items in original packaging' },
    { num: 3, title: 'Ship Back', icon: Clock, desc: 'Drop off at any carrier location' },
    { num: 4, title: 'Refund Processed', icon: CheckCircle, desc: 'Receive refund in 5-7 business days' }
]

const policies = [
    { title: '30-Day Window', desc: 'Returns accepted within 30 days of delivery' },
    { title: 'Original Condition', desc: 'Items must be unused with original tags' },
    { title: 'Free Return Shipping', desc: 'On all orders over $50' },
    { title: 'Quick Refunds', desc: 'Processed within 5-7 business days' }
]
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-orange-50 to-red-50 py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
                    <RotateCcw class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    Returns & Exchanges
                </h1>
                <p class="text-gray-600 text-lg">Hassle-free returns within 30 days</p>
            </div>

            <!-- Return Process Steps -->
            <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">How Returns Work</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div v-for="step in steps" :key="step.num"
                        class="relative p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-300 transition-colors">
                        <div class="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {{ step.num }}
                        </div>
                        <component :is="step.icon" class="w-8 h-8 text-orange-500 mb-3" />
                        <h3 class="font-bold text-gray-900 mb-1">{{ step.title }}</h3>
                        <p class="text-sm text-gray-600">{{ step.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- Policies -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div v-for="policy in policies" :key="policy.title"
                    class="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div class="flex items-start gap-3">
                        <CheckCircle class="w-6 h-6 text-green-500 shrink-0 mt-1" />
                        <div>
                            <h3 class="font-bold text-gray-900 mb-1">{{ policy.title }}</h3>
                            <p class="text-sm text-gray-600">{{ policy.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Important Notice -->
            <div class="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle class="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                    <h3 class="font-bold text-amber-900 mb-1">Important Information</h3>
                    <p class="text-sm text-amber-800">
                        Final sale items, personalized products, and intimate apparel cannot be returned. Exchanges are subject to availability. For damaged or defective items, please contact support within 48 hours of delivery.
                    </p>
                </div>
            </div>

            <!-- CTA -->
            <div class="mt-8 text-center">
                <button class="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300">
                    Start a Return
                </button>
            </div>
        </div>
    </div>
</template>
