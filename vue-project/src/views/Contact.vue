<script setup>
import {ref, onMounted, computed} from 'vue'
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
    {id: 'general', label: 'General Inquiry', icon: MessageSquare},
    {id: 'order', label: 'Order Status', icon: PackageSearch},
    {id: 'returns', label: 'Returns & Exchange', icon: ArrowLeftRight},
    {id: 'wholesale', label: 'Wholesale Inquiry', icon: Store},
    {id: 'styling', label: 'Styling Advice', icon: Shirt},
    {id: 'partnership', label: 'Partnership', icon: HeartHandshake}
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
    {id: 'contact', icon: MessageSquare, label: 'Contact'},
    {id: 'locations', icon: MapPin, label: 'Locations'},
    {id: 'services', icon: Ruler, label: 'Services'}
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
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <!-- Floating Background Elements -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="bubble absolute top-20 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
            <div class="bubble delay-2s absolute top-40 right-40 w-32 h-32 bg-purple-500 rounded-full opacity-10"></div>
            <div class="bubble delay-3s absolute bottom-10 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-10"></div>
            <div class="bubble delay-4s absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full opacity-10"></div>
        </div>
        <!-- Hero Section -->
        <section class="relative py-20 overflow-hidden">
        <div class="container mx-auto px-4">
            <div class="text-center relative z-10">
            <h1 class="text-6xl font-bold mb-6">
                <span class="inline-block animate-title-reveal">Style</span>
                <span
                    class="inline-block bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent animate-title-reveal"
                    style="animation-delay: 0.2s">
                Connect
                </span>
            </h1>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
                Get in touch with our style experts for a personalized fashion experience
            </p>
            </div>
        </div>
        </section>
        <!-- Navigation Tabs -->
        <div class="max-w-4xl mx-auto px-4 mb-8">
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-full p-2 flex items-center justify-center">
            <div class="flex space-x-2">
            <button
                v-for="tab in navigationTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                'flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300',
                activeTab === tab.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                ]"
            >
                <component :is="tab.icon" class="w-4 h-4"/>
                <span>{{ tab.label }}</span>
            </button>
            </div>
        </div>
        </div>
        <!-- Status Bar -->
        <div class="max-w-4xl mx-auto px-4 mb-12">
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-full p-2 flex items-center justify-between">
            <div class="flex items-center space-x-2 px-4">
            <div class="w-2 h-2 rounded-full"
                :class="isStoreOpen ? 'bg-green-500' : 'bg-rose-500'">
            </div>
            <div class="flex flex-col">
                <span class="text-sm font-medium">{{ storeStatusMessage.text }}</span>
                <span class="text-xs text-gray-400">{{ storeStatusMessage.subtext }}</span>
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
            <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl mb-12">
                <div class="p-8">
                <h2 class="text-2xl font-bold mb-6">Get in Touch</h2>
                <!-- Inquiry Categories -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold mb-4">What can we help you with?</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                        v-for="category in inquiryCategories"
                        :key="category.id"
                        @click="contactForm.category = category.id"
                        :class="[
                        'flex items-center space-x-2 p-3 rounded-lg border transition-all duration-300',
                        contactForm.category === category.id
                            ? 'border-pink-500 bg-pink-500/20 text-pink-400'
                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                        ]"
                    >
                        <component :is="category.icon" class="w-4 h-4"/>
                        <span class="text-sm">{{ category.label }}</span>
                    </button>
                    </div>
                </div>
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div class="grid md:grid-cols-2 gap-6">
                    <!-- Basic Info -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium">Name</label>
                        <input v-model="contactForm.name"
                            type="text"
                            required
                            class="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600
                                    focus:ring-2 focus:ring-pink-500 focus:border-transparent
                                    transition-all duration-300 text-white placeholder-gray-400"
                            placeholder="Your name"/>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium">Email</label>
                        <input v-model="contactForm.email"
                            type="email"
                            required
                            class="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600
                                    focus:ring-2 focus:ring-pink-500 focus:border-transparent
                                    transition-all duration-300 text-white placeholder-gray-400"
                            placeholder="your@email.com"/>
                    </div>
                    </div>
                    <!-- Subject -->
                    <div class="space-y-2">
                    <label class="block text-sm font-medium">Subject</label>
                    <input v-model="contactForm.subject"
                            type="text"
                            required
                            class="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600
                                    focus:ring-2 focus:ring-pink-500 focus:border-transparent
                                    transition-all duration-300 text-white placeholder-gray-400"
                            placeholder="Brief description of your inquiry"/>
                    </div>
                    <!-- Order Number (shown only for order-related inquiries) -->
                    <div v-if="contactForm.category === 'order'" class="space-y-2">
                    <label class="block text-sm font-medium">Order Number</label>
                    <input v-model="contactForm.orderNumber"
                            type="text"
                            class="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600
                                    focus:ring-2 focus:ring-pink-500 focus:border-transparent
                                    transition-all duration-300 text-white placeholder-gray-400"
                            placeholder="e.g., ORD-123456"/>
                    </div>
                    <!-- Message -->
                    <div class="space-y-2">
                    <label class="block text-sm font-medium">Message</label>
                    <textarea v-model="contactForm.message"
                                required
                                rows="4"
                                class="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600
                                    focus:ring-2 focus:ring-pink-500 focus:border-transparent
                                    transition-all duration-300 text-white placeholder-gray-400"
                                placeholder="How can we help you?"></textarea>
                    </div>
                    <button type="submit"
                            :disabled="isSubmitting"
                            class="w-full py-4 rounded-lg flex items-center justify-center space-x-2
                                disabled:cursor-not-allowed transition-all duration-300"
                            :class="isSubmitting ?
                                'bg-gradient-to-r from-gray-500 to-gray-600' :
                                'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg transform hover:scale-[1.02]'">
                    <span v-if="isSubmitting" class="loader"></span>
                    <Send v-else class="w-5 h-5"/>
                    <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                    </button>
                </form>
                </div>
            </div>
            <!-- Store Features -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div
                    v-for="feature in storeFeatures"
                    :key="feature.title"
                    class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-gray-800/70
                        transition-all duration-300 group"
                >
                <div :class="['w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center', feature.color]">
                    <component :is="feature.icon" class="w-8 h-8 text-white"/>
                </div>
                <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
                <div class="space-y-1">
                    <p v-for="detail in feature.details" :key="detail" class="text-sm text-gray-300">
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
                <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden">
                <div class="h-[410px] bg-gray-700 relative">
                    <!-- Replace with actual map -->
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
                    <div class="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-lg rounded-lg p-4">
                        <h3 class="font-semibold mb-2">{{ storeInfo.name }}</h3>
                        <p class="text-gray-300 text-sm">{{ storeInfo.address.street }}</p>
                        <p class="text-gray-300 text-sm">{{ storeInfo.address.city }}, {{ storeInfo.address.country }}</p>
                    </div>
                </div>
                </div>
                <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
                <h3 class="text-xl font-semibold mb-6">Store Hours</h3>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span>Monday - Friday</span>
                        <span class="text-pink-400">{{ storeInfo.hours.weekday }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Saturday</span>
                        <span class="text-pink-400">{{ storeInfo.hours.saturday }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Sunday</span>
                        <span class="text-pink-400">{{ storeInfo.hours.sunday }}</span>
                    </div>
                    <div class="mt-8 pt-6 border-t border-gray-700">
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center space-x-3">
                            <Phone class="w-5 h-5 text-pink-400"/>
                            <span>{{ storeInfo.contact.phone }}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <MessageSquare class="w-5 h-5 text-pink-400"/>
                            <span>{{ storeInfo.contact.email }}</span>
                        </div>
                    </div>
                    <button class="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg
                                hover:shadow-lg transform hover:scale-105 transition-all duration-300">
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
                <div v-for="service in fashionServices"
                    :key="service.title"
                    class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 group">
                        <component :is="service.icon" class="w-12 h-12 mb-4 text-pink-500 group-hover:scale-110 transition-transform"/>
                <h3 class="text-xl font-semibold mb-2">{{ service.title }}</h3>
                <p class="text-gray-300 mb-6">{{ service.description }}</p>
                <button class="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg
                    hover:shadow-lg transform hover:scale-105 transition-all duration-300">
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
            <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 text-center">
            <h3 class="text-2xl font-semibold mb-6">Follow Us</h3>
            <div class="flex justify-center space-x-6">
                <a
                    v-for="social in socialLinks"
                    :key="social.label"
                    :href="social.url"
                    :class="['flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-300 hover:bg-gray-700/50', social.color]"
                    :aria-label="social.label">
                <component :is="social.icon" class="w-8 h-8"/>
                <span class="text-sm">{{ social.handle }}</span>
                </a>
            </div>
            </div>
        </div>
        </section>
        <!-- Success Message -->
        <div v-if="showSuccess"
            class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50">
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