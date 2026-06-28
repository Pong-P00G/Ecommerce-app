<script setup>
import { RouterLink } from 'vue-router';
import { CheckCircle2, Package, Mail, ArrowRight, Sparkles, Truck, Calendar, Download } from 'lucide-vue-next';
</script>

<template>
    <div class="bg-paper min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div class="max-w-2xl w-full text-center">
            <div class="relative inline-block mb-8">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-50 flex items-center justify-center mx-auto">
                    <CheckCircle2 class="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                </div>
                <span class="absolute inset-0 rounded-full ring-4 ring-accent/20 pulse-dot"></span>
            </div>

            <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
                <Sparkles class="w-4 h-4" />
                Order confirmed
            </span>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-elegant font-bold text-ink mb-4">Thank you for your order!</h1>
            <p class="text-lg text-neutral-500 font-light max-w-md mx-auto">
                Your order <span class="font-bold text-ink tabular-nums">#ALIE-2024-0218</span> has been placed successfully.
            </p>

            <div class="bg-paper border border-neutral-200 rounded-3xl p-5 sm:p-6 mt-8 sm:mt-10 text-left space-y-4 sm:space-y-5">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Order details</span>
                    <button class="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-accent transition-colors">
                        <Download class="w-3.5 h-3.5" />
                        Receipt
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                            <Package class="w-4 h-4 text-ink" />
                        </div>
                        <div>
                            <p class="text-xs text-neutral-500">Items</p>
                            <p class="text-sm font-bold text-ink tabular-nums">3 products</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                            <Truck class="w-4 h-4 text-ink" />
                        </div>
                        <div>
                            <p class="text-xs text-neutral-500">Estimated arrival</p>
                            <p class="text-sm font-bold text-ink">Mar 28 - Apr 02</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                            <Calendar class="w-4 h-4 text-ink" />
                        </div>
                        <div>
                            <p class="text-xs text-neutral-500">Total paid</p>
                            <p class="text-sm font-bold text-accent tabular-nums">{{ '$' }}148.00</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-neutral-200 pt-4 flex items-center gap-3">
                    <Mail class="w-4 h-4 text-neutral-400 shrink-0" />
                    <p class="text-sm text-neutral-600">
                        A confirmation email is on its way to <span class="font-bold text-ink">you@example.com</span>.
                    </p>
                </div>
            </div>

            <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <RouterLink to="/product" class="btn-accent shine-effect">
                    Continue shopping
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
                <RouterLink to="/track-order" class="btn-outline">
                    Track this order
                </RouterLink>
            </div>
        </div>
    </div>
</template>
