<script setup>
import { ref } from 'vue'
import { HelpCircle, Search, ChevronDown } from 'lucide-vue-next'

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'orders', label: 'Orders' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
    { id: 'account', label: 'Account' },
    { id: 'payment', label: 'Payment' }
]

const faqs = [
    {
        category: 'orders',
        q: 'How do I track my order?',
        a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order in the Track Order page.'
    },
    {
        category: 'orders',
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 2 hours of placement. Please contact our support team immediately.'
    },
    {
        category: 'shipping',
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Overnight shipping delivers the next business day.'
    },
    {
        category: 'shipping',
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over $50 within the continental US.'
    },
    {
        category: 'returns',
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery. Items must be in original condition with tags attached.'
    },
    {
        category: 'returns',
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive your return.'
    },
    {
        category: 'account',
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.'
    },
    {
        category: 'account',
        q: 'Can I change my email address?',
        a: 'Yes, you can update your email address in your account settings under Profile Information.'
    },
    {
        category: 'payment',
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay.'
    },
    {
        category: 'payment',
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use industry-standard SSL encryption and never store your full payment details.'
    }
]

const visibleFaqs = ref(faqs.map((f, i) => ({ ...f, open: i === 0 })))

const toggle = (idx) => {
    visibleFaqs.value[idx].open = !visibleFaqs.value[idx].open
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
                    <HelpCircle class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                    Frequently Asked Questions
                </h1>
                <p class="text-gray-600 text-lg">Find quick answers to common questions</p>
            </div>

            <!-- Search -->
            <div class="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
                <div class="relative">
                    <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Search questions..."
                        class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none text-lg" />
                </div>
            </div>

            <!-- Category Filter -->
            <div class="flex flex-wrap gap-2 mb-8 justify-center">
                <button v-for="cat in categories" :key="cat.id"
                    @click="activeCategory = cat.id"
                    :class="{
                        'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg': activeCategory === cat.id,
                        'bg-white text-gray-700 hover:bg-gray-50': activeCategory !== cat.id
                    }"
                    class="px-5 py-2 rounded-full font-semibold text-sm transition-all">
                    {{ cat.label }}
                </button>
            </div>

            <!-- FAQ List -->
            <div class="space-y-3">
                <div v-for="(faq, idx) in visibleFaqs" :key="idx"
                    class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <button @click="toggle(idx)"
                        class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                        <span class="font-bold text-gray-900">{{ faq.q }}</span>
                        <ChevronDown :class="{ 'rotate-180': faq.open }"
                            class="w-5 h-5 text-gray-500 transition-transform duration-300" />
                    </button>
                    <div v-if="faq.open" class="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                        {{ faq.a }}
                    </div>
                </div>
            </div>

            <!-- Contact CTA -->
            <div class="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white text-center">
                <h2 class="text-2xl font-bold mb-2">Still have questions?</h2>
                <p class="text-emerald-100 mb-6">Our support team is here to help you 24/7</p>
                <RouterLink to="/contact"
                    class="inline-block px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:shadow-2xl transition-all">
                    Contact Support
                </RouterLink>
            </div>
        </div>
    </div>
</template>
