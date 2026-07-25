<script setup>
import { Truck, Globe, Zap, Shield, Clock, MapPin, ChevronDown, ArrowRight } from 'lucide-vue-next'

const shippingOptions = [
    { name: 'Standard Shipping', time: '5-7 business days', price: 'Free on orders $50+', icon: Truck },
    { name: 'Express Shipping', time: '2-3 business days', price: '$9.99', icon: Zap },
    { name: 'Overnight Shipping', time: 'Next business day', price: '$24.99', icon: Clock },
    { name: 'International', time: '7-14 business days', price: 'Calculated at checkout', icon: Globe }
]

const features = [
    { icon: Shield, title: 'Insured Packages', desc: 'All orders are fully insured' },
    { icon: MapPin, title: 'Real-Time Tracking', desc: 'Track every step of delivery' },
    { icon: Truck, title: 'Free Standard Shipping', desc: 'On all orders over $50' }
]

const faqs = [
    { q: 'Do you ship internationally?', a: 'Yes, we ship to over 30 countries worldwide. International shipping rates are calculated at checkout.' },
    { q: 'Can I change my shipping address?', a: 'You can change your shipping address within 2 hours of placing your order by contacting support.' },
    { q: 'What if my package is lost?', a: 'All shipments are insured. If your package is lost, we will send a replacement or issue a full refund.' }
]
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-14 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Truck class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
                    Shipping
                    <span class="text-accent">information</span>
                </h1>
                <p class="text-neutral-600 text-lg">Fast, reliable delivery to your door — anywhere in the world.</p>
            </div>

            <!-- Shipping Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                <div v-for="option in shippingOptions" :key="option.name"
                    class="card-base p-6 group stagger-item">
                    <div class="flex items-start justify-between mb-5">
                        <div class="w-12 h-12 rounded-xl bg-ink text-paper inline-flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                            <component :is="option.icon" class="w-6 h-6" />
                        </div>
                        <span class="badge-ghost">
                            <Clock class="w-3 h-3" />
                            {{ option.time }}
                        </span>
                    </div>
                    <h3 class="font-bold text-xl text-ink mb-2">{{ option.name }}</h3>
                    <p class="text-sm font-semibold text-accent">{{ option.price }}</p>
                </div>
            </div>

            <!-- Features -->
            <div class="card-flat p-8 mb-10">
                <div class="text-center mb-8">
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">Why ship with us</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="feature in features" :key="feature.title" class="text-center group stagger-item">
                        <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-neutral-100 group-hover:bg-accent group-hover:text-paper text-ink inline-flex items-center justify-center transition-all duration-300">
                            <component :is="feature.icon" class="w-6 h-6" />
                        </div>
                        <h3 class="font-bold text-ink mb-1">{{ feature.title }}</h3>
                        <p class="text-sm text-neutral-600">{{ feature.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- FAQ -->
            <div class="card-flat p-8">
                <div class="mb-6">
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">Common questions</span>
                    <h2 class="font-elegant font-bold text-2xl text-ink mt-2">Shipping FAQ</h2>
                </div>
                <div class="space-y-3">
                    <details v-for="(item, idx) in faqs" :key="idx" class="group rounded-xl border border-neutral-200 bg-paper overflow-hidden">
                        <summary class="flex items-center justify-between p-4 cursor-pointer font-semibold text-ink hover:bg-neutral-50 transition-colors">
                            <span>{{ item.q }}</span>
                            <ChevronDown class="w-5 h-5 text-neutral-500 group-open:rotate-180 transition-transform duration-300" />
                        </summary>
                        <div class="px-4 pb-4 text-sm text-neutral-600 border-t border-neutral-100 pt-3 leading-relaxed">
                            {{ item.a }}
                        </div>
                    </details>
                </div>
                <div class="text-center mt-8">
                    <RouterLink to="/contact" class="btn-outline">
                        More questions? Contact us
                        <ArrowRight class="w-4 h-4" />
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>
