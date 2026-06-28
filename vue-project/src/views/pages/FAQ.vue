<script setup>
import { ref } from 'vue'
import { HelpCircle, Search, ChevronDown, MessageCircle, ArrowRight } from 'lucide-vue-next'

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
    { id: 'all', label: 'All topics' },
    { id: 'orders', label: 'Orders' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
    { id: 'account', label: 'Account' },
    { id: 'payment', label: 'Payment' }
]

const faqs = [
    { category: 'orders', q: 'How do I track my order?', a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order in the Track Order page.' },
    { category: 'orders', q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. Please contact our support team immediately.' },
    { category: 'shipping', q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Overnight shipping delivers the next business day.' },
    { category: 'shipping', q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on all orders over $50 within the continental US.' },
    { category: 'returns', q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be in original condition with tags attached.' },
    { category: 'returns', q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive your return.' },
    { category: 'account', q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.' },
    { category: 'account', q: 'Can I change my email address?', a: 'Yes, you can update your email address in your account settings under Profile Information.' },
    { category: 'payment', q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay.' },
    { category: 'payment', q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard SSL encryption and never store your full payment details.' }
]

const visibleFaqs = ref(faqs.map((f, i) => ({ ...f, open: i === 0 })))

const toggle = (idx) => {
    visibleFaqs.value[idx].open = !visibleFaqs.value[idx].open
}
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-12 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <HelpCircle class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-5xl md:text-6xl text-ink mb-4">
                    Frequently
                    <span class="text-accent">asked</span>
                </h1>
                <p class="text-neutral-600 text-lg">Find quick answers to common questions about our products and services.</p>
            </div>

            <!-- Search -->
            <div class="card-flat p-2 mb-8 max-w-2xl mx-auto">
                <div class="relative">
                    <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search questions..."
                        class="w-full pl-14 pr-5 py-4 bg-transparent text-ink placeholder:text-neutral-400 focus:outline-none text-base"
                    />
                </div>
            </div>

            <!-- Category Filter -->
            <div class="flex flex-wrap gap-2 mb-10 justify-center">
                <button
                    v-for="cat in categories"
                    :key="cat.id"
                    @click="activeCategory = cat.id"
                    :class="[
                        'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                        activeCategory === cat.id
                            ? 'bg-ink text-paper shadow-sm'
                            : 'bg-paper border border-neutral-200 text-neutral-700 hover:border-ink'
                    ]"
                >
                    {{ cat.label }}
                </button>
            </div>

            <!-- FAQ List -->
            <div class="max-w-3xl mx-auto space-y-3 mb-12">
                <div
                    v-for="(faq, idx) in visibleFaqs"
                    :key="idx"
                    class="card-flat overflow-hidden"
                >
                    <button
                        @click="toggle(idx)"
                        class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                    >
                        <span class="font-bold text-ink pr-4">{{ faq.q }}</span>
                        <ChevronDown
                            :class="['w-5 h-5 text-neutral-500 transition-transform duration-300 shrink-0', faq.open ? 'rotate-180' : '']"
                        />
                    </button>
                    <div v-if="faq.open" class="px-6 pb-5 text-neutral-600 border-t border-neutral-100 pt-4 leading-relaxed">
                        {{ faq.a }}
                    </div>
                </div>
            </div>

            <!-- Contact CTA -->
            <div class="bg-ink text-paper rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
                <div class="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full -mr-36 -mt-36"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full -ml-24 -mb-24"></div>
                <div class="relative z-10">
                    <MessageCircle class="w-10 h-10 text-accent mx-auto mb-5" />
                    <h2 class="font-elegant font-bold text-3xl md:text-4xl mb-3">Still have questions?</h2>
                    <p class="text-neutral-400 mb-7 max-w-md mx-auto">Our support team is here to help you 24/7. Don't hesitate to reach out.</p>
                    <RouterLink to="/contact" class="btn-accent shine-effect">
                        Contact support
                        <ArrowRight class="w-4 h-4" />
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>
