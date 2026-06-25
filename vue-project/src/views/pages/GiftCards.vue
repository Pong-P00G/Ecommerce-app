<script setup>
import { ref } from 'vue'
import { Gift, Mail, CreditCard, Sparkles } from 'lucide-vue-next'

const selectedAmount = ref(50)
const customAmount = ref('')
const recipientEmail = ref('')
const recipientName = ref('')
const senderName = ref('')
const message = ref('')

const presetAmounts = [25, 50, 100, 200, 500]

const handlePurchase = () => {
    console.log('Gift card purchase:', {
        amount: selectedAmount.value === 'custom' ? customAmount.value : selectedAmount.value,
        recipient: recipientEmail.value,
        recipientName: recipientName.value,
        senderName: senderName.value,
        message: message.value
    })
    alert('Gift card purchase feature coming soon!')
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50 py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                    <Gift class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    Gift Cards
                </h1>
                <p class="text-gray-600 text-lg">Give the perfect gift — let them choose what they love</p>
            </div>

            <!-- Gift Card Preview -->
            <div class="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-3xl shadow-2xl p-8 mb-10 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                <div class="relative z-10 flex items-center justify-between">
                    <div>
                        <p class="text-purple-100 text-sm uppercase tracking-widest mb-2">AlieeShop</p>
                        <p class="text-4xl font-bold">${{ selectedAmount === 'custom' ? customAmount || '0' : selectedAmount }}</p>
                        <p class="text-purple-100 mt-2 text-sm">For: {{ recipientName || 'Recipient Name' }}</p>
                    </div>
                    <Sparkles class="w-20 h-20 text-white/30" />
                </div>
            </div>

            <!-- Form -->
            <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <!-- Amount Selection -->
                <div class="mb-8">
                    <label class="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Amount</label>
                    <div class="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                        <button
                            v-for="amount in presetAmounts"
                            :key="amount"
                            @click="selectedAmount = amount"
                            :class="{
                                'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg': selectedAmount === amount,
                                'bg-gray-100 text-gray-700 hover:bg-gray-200': selectedAmount !== amount
                            }"
                            class="py-4 rounded-xl font-bold text-lg transition-all"
                        >
                            ${{ amount }}
                        </button>
                    </div>
                    <div class="relative">
                        <button
                            @click="selectedAmount = 'custom'"
                            :class="{
                                'ring-2 ring-purple-500': selectedAmount === 'custom'
                            }"
                            class="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <CreditCard class="w-5 h-5 text-gray-500" />
                            <span class="font-medium text-gray-700">Custom amount</span>
                        </button>
                        <input
                            v-if="selectedAmount === 'custom'"
                            v-model="customAmount"
                            type="number"
                            placeholder="Enter amount"
                            min="1"
                            class="mt-3 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                <!-- Recipient Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Recipient Name</label>
                        <input v-model="recipientName" type="text" placeholder="John Doe"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Recipient Email</label>
                        <input v-model="recipientEmail" type="email" placeholder="john@example.com"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                    </div>
                </div>

                <div class="mb-8">
                    <label class="block text-sm font-bold text-gray-900 mb-2">Your Name</label>
                    <input v-model="senderName" type="text" placeholder="Your name"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                </div>

                <div class="mb-8">
                    <label class="block text-sm font-bold text-gray-900 mb-2">Personal Message</label>
                    <textarea v-model="message" rows="4" placeholder="Write a message..."
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"></textarea>
                </div>

                <button @click="handlePurchase"
                    class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                    <Mail class="w-5 h-5" />
                    Send Gift Card
                </button>
            </div>
        </div>
    </div>
</template>
