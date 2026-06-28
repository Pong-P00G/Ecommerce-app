<script setup>
import { ref } from 'vue'
import { Gift, Mail, CreditCard, Sparkles, ArrowRight, Check } from 'lucide-vue-next'

const selectedAmount = ref(50)
const customAmount = ref('')
const recipientEmail = ref('')
const recipientName = ref('')
const senderName = ref('')
const message = ref('')

const presetAmounts = [25, 50, 100, 200, 500]

const handlePurchase = () => {
    alert('Gift card purchase feature coming soon!')
}
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-12 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Gift class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-5xl md:text-6xl text-ink mb-4">
                    Gift
                    <span class="text-accent">cards</span>
                </h1>
                <p class="text-neutral-600 text-lg">Give the perfect gift — let them choose what they love.</p>
            </div>

            <!-- Gift Card Preview -->
            <div class="bg-ink text-paper rounded-3xl p-8 md:p-10 mb-10 relative overflow-hidden shadow-[0_20px_60px_-15px_rgb(0_0_0_/_0.4)]">
                <div class="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full -mr-36 -mt-36"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent/15 rounded-full -ml-24 -mb-24"></div>
                <div class="relative z-10 flex items-center justify-between gap-6 flex-wrap">
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-2 h-2 rounded-full bg-accent pulse-dot"></div>
                            <p class="text-neutral-400 text-xs font-bold uppercase tracking-[0.2em]">AlieeShop</p>
                        </div>
                        <p class="text-5xl md:text-6xl font-bold tabular-nums">
                            {{ '$' }}{{ selectedAmount === 'custom' ? customAmount || '0' : selectedAmount }}
                        </p>
                        <p class="text-neutral-400 mt-3 text-sm">For: {{ recipientName || 'Recipient Name' }}</p>
                    </div>
                    <Sparkles class="w-24 h-24 text-accent/40" />
                </div>
            </div>

            <!-- Form -->
            <div class="card-flat p-8 max-w-3xl mx-auto">
                <!-- Amount Selection -->
                <div class="mb-8">
                    <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-4">Select amount</label>
                    <div class="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-4">
                        <button
                            v-for="amount in presetAmounts"
                            :key="amount"
                            @click="selectedAmount = amount"
                            :class="[
                                'py-4 rounded-xl font-bold text-lg transition-all duration-200',
                                selectedAmount === amount
                                    ? 'bg-ink text-paper shadow-sm'
                                    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                            ]"
                        >
                            {{ '$' }}{{ amount }}
                        </button>
                    </div>
                    <button
                        @click="selectedAmount = 'custom'"
                        :class="[
                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                            selectedAmount === 'custom'
                                ? 'bg-paper border-2 border-accent'
                                : 'bg-neutral-50 border border-neutral-200 hover:bg-neutral-100'
                        ]"
                    >
                        <CreditCard class="w-5 h-5 text-neutral-500" />
                        <span class="font-medium text-ink">Custom amount</span>
                    </button>
                    <input
                        v-if="selectedAmount === 'custom'"
                        v-model="customAmount"
                        type="number"
                        placeholder="Enter amount"
                        min="1"
                        class="mt-3 input-base"
                    />
                </div>

                <!-- Recipient Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Recipient name</label>
                        <input v-model="recipientName" type="text" placeholder="John Doe" class="input-base" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Recipient email</label>
                        <input v-model="recipientEmail" type="email" placeholder="john@example.com" class="input-base" />
                    </div>
                </div>

                <div class="mb-8">
                    <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Your name</label>
                    <input v-model="senderName" type="text" placeholder="Your name" class="input-base" />
                </div>

                <div class="mb-8">
                    <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-2">Personal message</label>
                    <textarea v-model="message" rows="4" placeholder="Write a message..." class="input-base resize-none"></textarea>
                </div>

                <button @click="handlePurchase" class="btn-accent shine-effect w-full py-4">
                    <Mail class="w-5 h-5" />
                    Send gift card
                    <ArrowRight class="w-4 h-4" />
                </button>

                <div class="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Check class="w-4 h-4 text-success" />
                    Delivered instantly via email — no shipping required
                </div>
            </div>
        </section>
    </div>
</template>
