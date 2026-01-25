<script setup>
import { ref, onMounted, computed } from 'vue'
import {
    MapPin, Phone, MessageSquare, Send,
    Facebook, Instagram, Twitter, MapPinned,
    Shirt, Ruler, Clock, ShoppingBag, HeartHandshake,
    PackageSearch, ArrowLeftRight, Store, Users
} from 'lucide-vue-next'


// Form Data
const contactForm = ref({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: '',
    category: 'general'
})

// Page State
const isSubmitting = ref(false)
const showSuccess = ref(false)
const activeTab = ref('contact')
const isPageLoaded = ref(false)
const currentHour = ref(new Date().getHours())

// Contact Categories
const inquiryCategories = [
    { id: 'general', label: 'General Inquiry', icon: MessageSquare },
    { id: 'order', label: 'Order Status', icon: PackageSearch },
    { id: 'returns', label: 'Returns & Exchange', icon: ArrowLeftRight },
    { id: 'wholesale', label: 'Wholesale Inquiry', icon: Store },
    { id: 'styling', label: 'Styling Advice', icon: Shirt },
    { id: 'partnership', label: 'Partnership', icon: HeartHandshake }
]

// Store Information
const storeInfo = {
    name: 'FASHION STORE',
    address: {
        street: '222, Style Avenue',
        city: 'Phnom Penh',
        country: 'Cambodia'
    },
    hours: {
        weekday: '10:00 AM - 9:00 PM',
        saturday: '10:00 AM - 10:00 PM',
        sunday: '11:00 AM - 6:00 PM'
    },
    contact: {
        phone: '+855 100 0002',
        email: 'contact@fashionstore.com',
        support: '24/7 Customer Service'
    }
}

// Store Features
const storeFeatures = [
    {
        icon: Shirt,
        title: 'Premium Collection',
        details: ['Curated Fashion', 'Designer Brands'],
        color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
        icon: Users,
        title: 'Personal Styling',
        details: ['Expert Stylists', 'Private Sessions'],
        color: 'bg-gradient-to-r from-rose-500 to-red-500'
    },
    {
        icon: Clock,
        title: 'Express Service',
        details: ['Same-Day Delivery', 'Quick Alterations'],
        color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    {
        icon: ShoppingBag,
        title: 'VIP Shopping',
        details: ['Member Benefits', 'Exclusive Events'],
        color: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    }
]

// Social Media Links
const socialLinks = [
    {
        icon: Facebook,
        url: 'https://www.facebook.com',
        color: 'hover:text-blue-500',
        label: 'Follow on Facebook',
        handle: '@fashionstore'
    },
    {
        icon: Instagram,
        url: 'https://www.instagram.com',
        color: 'hover:text-pink-500',
        label: 'Follow on Instagram',
        handle: '@fashionstore'
    },
    {
        icon: Twitter,
        url: 'https://www.x.com',
        color: 'hover:text-sky-500',
        label: 'Follow on Twitter',
        handle: '@fashionstore'
    }
]

// Navigation Tabs
const navigationTabs = [
    { id: 'contact', icon: MessageSquare, label: 'Contact' },
    { id: 'locations', icon: MapPin, label: 'Locations' },
    { id: 'services', icon: Ruler, label: 'Services' }
]

// Store Services
const fashionServices = [
    {
        title: 'Personal Styling',
        description: 'One-on-one sessions with expert stylists',
        icon: Ruler,
        action: 'Book Session',
        color: 'from-purple-500 to-pink-500'
    },
    {
        title: 'Virtual Try-On',
        description: 'Experience our collection from home',
        icon: Shirt,
        action: 'Try Now',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        title: 'VIP Shopping',
        description: 'Exclusive after-hours shopping experience',
        icon: ShoppingBag,
        action: 'Learn More',
        color: 'from-emerald-500 to-teal-500'
    }
]

// Lifecycle Hooks
onMounted(() => {
    isPageLoaded.value = true
    startTimeUpdate()
})

// Store Hours Update
const startTimeUpdate = () => {
    setInterval(() => {
        currentHour.value = new Date().getHours()
    }, 60000)
}

// Computed Properties
const isStoreOpen = computed(() => {
    const hour = currentHour.value
    const day = new Date().getDay()

    if (day === 0) { // Sunday
        return hour >= 11 && hour < 18
    } else if (day === 6) { // Saturday
        return hour >= 10 && hour < 22
    }
    return hour >= 10 && hour < 21
})

const storeStatusMessage = computed(() => {
    if (!isStoreOpen.value) {
        return {
            text: 'Currently Closed',
            subtext: 'Online shopping available 24/7',
            color: 'text-rose-500'
        }
    }
    return {
        text: 'Now Open',
        subtext: 'Visit us for personal styling',
        color: 'text-emerald-500'
    }
})

// Form Submission
const handleSubmit = async () => {
    isSubmitting.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Show a success message
        showSuccess.value = true

        // Reset form
        contactForm.value = {
            name: '',
            email: '',
            subject: '',
            message: '',
            orderNumber: '',
            category: 'general'
        }

        // Hide success message after delay
        setTimeout(() => {
            showSuccess.value = false
        }, 3000)
    } catch (error) {
        console.error('Form submission error:', error)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-white">
        <!-- Hero Section -->
        <section class="relative bg-gray-50 border-b border-gray-100 py-24">
            <div class="container mx-auto px-4">
                <div class="text-center relative z-10">
                    <h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        <span class="inline-block">Style</span>
                        <span class="inline-block text-gray-600"> Connect</span>
                    </h1>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                        Get in touch with our style experts for a personalized fashion experience
                    </p>
                </div>
            </div>
        </section>

        <!-- Navigation Tabs -->
        <div class="max-w-4xl mx-auto px-4 pt-8 pb-4">
            <div class="bg-gray-50 border border-gray-100 rounded-full p-2 flex items-center justify-center">
                <div class="flex space-x-2">
                    <button v-for="tab in navigationTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                        'flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-semibold',
                        activeTab === tab.id
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    ]">
                        <component :is="tab.icon" class="w-4 h-4" />
                        <span>{{ tab.label }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Status Bar -->
        <div class="max-w-4xl mx-auto px-4 mb-12">
            <div class="bg-gray-50 border border-gray-100 rounded-full p-4 flex items-center justify-between">
                <div class="flex items-center space-x-2 px-4">
                    <div class="w-2 h-2 rounded-full" :class="isStoreOpen ? 'bg-green-500' : 'bg-red-500'">
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-semibold text-gray-900">{{ storeStatusMessage.text }}</span>
                        <span class="text-xs text-gray-600">{{ storeStatusMessage.subtext }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Main Content -->
        <section class="container mx-auto px-4 py-12">
            <div class="max-w-6xl mx-auto">
                <!-- Contact Tab Content -->
                <div v-if="activeTab === 'contact'">
                    <!-- Contact Form Section -->
                    <!-- Contact Form Card -->
                    <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-12">
                        <div class="p-8">
                            <h2 class="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>
                            <!-- Inquiry Categories -->
                            <div class="mb-8">
                                <h3 class="text-lg font-semibold mb-4 text-gray-900">What can we help you with?</h3>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <button v-for="category in inquiryCategories" :key="category.id"
                                        @click="contactForm.category = category.id" :class="[
                                            'flex items-center space-x-2 p-3 rounded-xl border-2 transition-all duration-300 font-medium',
                                            contactForm.category === category.id
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50'
                                        ]">
                                        <component :is="category.icon" class="w-4 h-4" />
                                        <span class="text-sm">{{ category.label }}</span>
                                    </button>
                                </div>
                            </div>
                            <form @submit.prevent="handleSubmit" class="space-y-6">
                                <div class="grid md:grid-cols-2 gap-6">
                                    <!-- Basic Info -->
                                    <div class="space-y-2">
                                        <label class="block text-sm font-semibold text-gray-900">Name</label>
                                        <input v-model="contactForm.name" type="text" required class="w-full px-4 py-3 bg-white rounded-xl border border-gray-200
                                    focus:ring-2 focus:ring-gray-900 focus:border-transparent
                                    transition-all duration-300 text-gray-900 placeholder-gray-400"
                                            placeholder="Your name" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="block text-sm font-semibold text-gray-900">Email</label>
                                        <input v-model="contactForm.email" type="email" required class="w-full px-4 py-3 bg-white rounded-xl border border-gray-200
                                    focus:ring-2 focus:ring-gray-900 focus:border-transparent
                                    transition-all duration-300 text-gray-900 placeholder-gray-400"
                                            placeholder="your@email.com" />
                                    </div>
                                </div>
                                <!-- Subject -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-semibold text-gray-900">Subject</label>
                                    <input v-model="contactForm.subject" type="text" required class="w-full px-4 py-3 bg-white rounded-xl border border-gray-200
                                    focus:ring-2 focus:ring-gray-900 focus:border-transparent
                                    transition-all duration-300 text-gray-900 placeholder-gray-400"
                                        placeholder="Brief description of your inquiry" />
                                </div>
                                <!-- Order Number (shown only for order-related inquiries) -->
                                <div v-if="contactForm.category === 'order'" class="space-y-2">
                                    <label class="block text-sm font-semibold text-gray-900">Order Number</label>
                                    <input v-model="contactForm.orderNumber" type="text" class="w-full px-4 py-3 bg-white rounded-xl border border-gray-200
                                    focus:ring-2 focus:ring-gray-900 focus:border-transparent
                                    transition-all duration-300 text-gray-900 placeholder-gray-400"
                                        placeholder="e.g., ORD-123456" />
                                </div>
                                <!-- Message -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-semibold text-gray-900">Message</label>
                                    <textarea v-model="contactForm.message" required rows="4" class="w-full px-4 py-3 bg-white rounded-xl border border-gray-200
                                    focus:ring-2 focus:ring-gray-900 focus:border-transparent
                                    transition-all duration-300 text-gray-900 placeholder-gray-400"
                                        placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="submit" :disabled="isSubmitting" class="w-full py-4 rounded-full flex items-center justify-center space-x-2
                                disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                                    :class="isSubmitting ?
                                        'bg-gray-400' :
                                        'bg-gray-900 text-white hover:bg-black hover:shadow-xl transform hover:scale-[1.02]'">
                                    <span v-if="isSubmitting" class="loader"></span>
                                    <Send v-else class="w-5 h-5" />
                                    <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <!-- Store Features -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div v-for="feature in storeFeatures" :key="feature.title" class="bg-white border border-gray-100 rounded-3xl p-6 text-center hover:shadow-lg
                        transition-all duration-300 group">
                            <div
                                :class="['w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center']">
                                <component :is="feature.icon" class="w-8 h-8 text-white" />
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-gray-900">{{ feature.title }}</h3>
                            <div class="space-y-1">
                                <p v-for="detail in feature.details" :key="detail" class="text-sm text-gray-600">
                                    {{ detail }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Locations Tab Content -->
                <div v-if="activeTab === 'locations'">
                    <!-- Store Location & Hours -->
                    <div class="grid md:grid-cols-2 gap-6 mb-12">
                        <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                            <div class="h-102.5 bg-gray-100 relative">
                                <!-- Replace with actual map -->
                                <div class="absolute inset-0 bg-linear-to-b from-transparent to-gray-900/20"></div>
                                <div
                                    class="absolute bottom-4 left-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-lg">
                                    <h3 class="font-bold mb-2 text-gray-900">{{ storeInfo.name }}</h3>
                                    <p class="text-gray-600 text-sm">{{ storeInfo.address.street }}</p>
                                    <p class="text-gray-600 text-sm">{{ storeInfo.address.city }}, {{
                                        storeInfo.address.country }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h3 class="text-xl font-bold mb-6 text-gray-900">Store Hours</h3>
                            <div class="space-y-4">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-700">Monday - Friday</span>
                                    <span class="text-gray-900 font-semibold">{{ storeInfo.hours.weekday }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-700">Saturday</span>
                                    <span class="text-gray-900 font-semibold">{{ storeInfo.hours.saturday }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-700">Sunday</span>
                                    <span class="text-gray-900 font-semibold">{{ storeInfo.hours.sunday }}</span>
                                </div>
                                <div class="mt-8 pt-6 border-t border-gray-100">
                                    <div class="space-y-3 mb-6">
                                        <div class="flex items-center space-x-3">
                                            <Phone class="w-5 h-5 text-gray-900" />
                                            <span class="text-gray-700">{{ storeInfo.contact.phone }}</span>
                                        </div>
                                        <div class="flex items-center space-x-3">
                                            <MessageSquare class="w-5 h-5 text-gray-900" />
                                            <span class="text-gray-700">{{ storeInfo.contact.email }}</span>
                                        </div>
                                    </div>
                                    <button class="w-full py-3 bg-gray-900 text-white rounded-full font-semibold
                                hover:bg-black hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                        Book Personal Shopping Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Services Tab Content -->
                <div v-if="activeTab === 'services'">
                    <!-- Fashion Services -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        <div v-for="service in fashionServices" :key="service.title"
                            class="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group">
                            <component :is="service.icon"
                                class="w-12 h-12 mb-4 text-gray-900 group-hover:scale-110 transition-transform" />
                            <h3 class="text-xl font-bold mb-2 text-gray-900">{{ service.title }}</h3>
                            <p class="text-gray-600 mb-6">{{ service.description }}</p>
                            <button class="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold
                    hover:bg-black hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                {{ service.action }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Social Media Links -->
        <section class="container mx-auto px-4 py-12">
            <div class="max-w-4xl mx-auto">
                <div class="bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
                    <h3 class="text-2xl font-bold mb-6 text-gray-900">Follow Us</h3>
                    <div class="flex justify-center space-x-6">
                        <a v-for="social in socialLinks" :key="social.label" :href="social.url"
                            class="flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 text-gray-900"
                            :aria-label="social.label">
                            <component :is="social.icon" class="w-8 h-8" />
                            <span class="text-sm font-medium">{{ social.handle }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <!-- Success Message -->
        <div v-if="showSuccess"
            class="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl animate-fade-in-up z-50 font-semibold">
            Thank you! We'll get back to you shortly.
        </div>
    </div>
</template>

<style scoped>
.bubble {
    animation: bubble 6s infinite;
}

.delay-2s {
    animation-delay: -2s;
}

.delay-3s {
    animation-delay: -3s;
}

.delay-4s {
    animation-delay: -4s;
}

@keyframes bubble {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-100px);
    }

    100% {
        transform: translateY(0);
    }
}
</style>