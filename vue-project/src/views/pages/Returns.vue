<script setup>
import { ref } from 'vue'
import { RotateCcw, Package, CheckCircle, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-vue-next'

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
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-14 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <RotateCcw class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-5xl md:text-6xl text-ink mb-4">
                    Returns &
                    <span class="text-accent">exchanges</span>
                </h1>
                <p class="text-neutral-600 text-lg">Hassle-free returns within 30 days. No questions asked.</p>
            </div>

            <!-- Return Process Steps -->
            <div class="card-flat p-8 mb-10">
                <div class="flex items-center gap-3 mb-7">
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">How it works</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div v-for="step in steps" :key="step.num"
                        class="card-flat p-6 hover:border-ink transition-all duration-300 group">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-11 h-11 rounded-full bg-ink text-paper inline-flex items-center justify-center font-bold group-hover:bg-accent transition-colors">
                                {{ step.num }}
                            </div>
                            <component :is="step.icon" class="w-6 h-6 text-neutral-500 group-hover:text-accent transition-colors" />
                        </div>
                        <h3 class="font-bold text-ink mb-1.5">{{ step.title }}</h3>
                        <p class="text-sm text-neutral-600 leading-relaxed">{{ step.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- Policies -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <div v-for="policy in policies" :key="policy.title" class="card-flat p-6 flex items-start gap-4">
                    <div class="w-11 h-11 rounded-full bg-accent-50 inline-flex items-center justify-center text-accent shrink-0">
                        <CheckCircle class="w-5 h-5" />
                    </div>
                    <div>
                        <h3 class="font-bold text-ink mb-1">{{ policy.title }}</h3>
                        <p class="text-sm text-neutral-600">{{ policy.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- Important Notice -->
            <div class="card-flat p-6 md:p-7 flex items-start gap-4 border-l-4 border-l-accent">
                <AlertCircle class="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                    <h3 class="font-bold text-ink mb-1">Important information</h3>
                    <p class="text-sm text-neutral-600 leading-relaxed">
                        Final sale items, personalized products, and intimate apparel cannot be returned. Exchanges are subject to availability. For damaged or defective items, please contact support within 48 hours of delivery.
                    </p>
                </div>
            </div>

            <!-- CTA -->
            <div class="text-center mt-12">
                <button class="btn-accent shine-effect">
                    Start a return
                    <ArrowRight class="w-4 h-4" />
                </button>
                <div class="mt-5 inline-flex items-center gap-2 text-sm text-neutral-500">
                    <ShieldCheck class="w-4 h-4" />
                    Protected by our 100% money-back guarantee
                </div>
            </div>
        </section>
    </div>
</template>
