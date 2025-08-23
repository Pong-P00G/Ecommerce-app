<script setup>
import {ref, onMounted} from 'vue'
import {Building2, Users, Target, Heart, Globe, Sparkles, Shield, Truck, Award, Star} from 'lucide-vue-next'
import {RouterLink} from 'vue-router'

const isVisible = ref(false)

const stats = [
    {number: '25K+', label: 'Happy Customers'},
    {number: '200+', label: 'Premium Products'},
    {number: '30+', label: 'Countries Worldwide'},
    {number: '24/7', label: 'Customer Support'}
]

const companyFeatures = [
    {
        title: 'Our Heritage',
        icon: Building2,
        description: 'Since 2025, we\'ve been crafting premium menswear and accessories, setting new standards in masculine fashion and style.',
        gradient: 'from-slate-600 to-gray-800'
    },
    {
        title: 'Expert Team',
        icon: Users,
        description: 'Our team of fashion designers and style experts curate every piece to ensure you look your absolute best.',
        gradient: 'from-blue-600 to-indigo-700'
    },
    {
        title: 'Our Vision',
        icon: Target,
        description: 'To be the go-to destination for modern men seeking premium quality clothing and accessories that define their unique style.',
        gradient: 'from-emerald-600 to-teal-700'
    }
]

const values = [
    {
        icon: Shield,
        title: 'Premium Quality',
        description: 'Every shirt, hoodie, pant, and accessory is crafted with the finest materials and attention to detail.'
    },
    {
        icon: Star,
        title: 'Style Excellence',
        description: 'From classic essentials to trendy pieces, we curate collections that elevate your wardrobe.'
    },
    {
        icon: Heart,
        title: 'Customer First',
        description: 'Your satisfaction is our priority. We\'re committed to providing exceptional service and quality.'
    }
]

const productCategories = [
    {
        name: 'Clothing',
        items: ['Premium Shirts', 'Comfortable Hoodies', 'Stylish Pants', 'Classic Jeans'],
        icon: '👕'
    },
    {
        name: 'Accessories',
        items: ['Trendy Caps', 'Luxury Belts', 'Stylish Bags', 'Premium Shoes'],
        icon: '🎒'
    },
    {
        name: 'Lifestyle',
        items: ['Designer Glasses', 'Statement Necklaces', 'Quality Socks', 'And Much More...'],
        icon: '🕶️'
    }
]

const features = [
    {
        icon: Truck,
        title: 'Fast Shipping',
        description: 'Free worldwide shipping on orders over $100'
    },
    {
        icon: Award,
        title: 'Premium Quality',
        description: 'Only the finest materials and craftsmanship'
    },
    {
        icon: Shield,
        title: 'Secure Shopping',
        description: '100% secure payment and data protection'
    },
    {
        icon: Heart,
        title: 'Customer Care',
        description: 'Dedicated support team ready to help you'
    }
]

onMounted(() => {
    isVisible.value = true
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="bubble absolute top-20 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
            <div class="bubble delay-2s absolute top-40 right-40 w-32 h-32 bg-purple-500 rounded-full opacity-10"></div>
            <div class="bubble delay-3s absolute bottom-10 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-10"></div>
            <div class="bubble delay-4s absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full opacity-10"></div>
        </div>
        <!-- Hero Section -->
        <section class="relative h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <div class="absolute inset-0 bg-[url('')] opacity-20"></div>
        <div class="relative z-20 h-full flex items-center justify-center text-white">
            <div class="text-center space-y-8 max-w-5xl px-4">
                <h1 class="text-6xl md:text-8xl font-bold animate-fade-in bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    MEN'S STYLE
                </h1>
                <h2 class="text-2xl md:text-4xl font-semibold animate-slide-up text-gray-200">
                    Premium Fashion & Accessories
                </h2>
                <p class="text-lg md:text-xl animate-slide-up text-gray-300 max-w-3xl mx-auto">
                    Discover our exclusive collection of shirts, hoodies, pants, jeans, and premium accessories designed for the
                    modern gentleman
                </p>
            </div>
        </div>
        </section>
        <!-- Product Categories Preview -->
        <section class="container mx-auto px-4 py-20">
            <h2 class="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-slate-100 to-gray-300 bg-clip-text text-transparent">
                What We Offer
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="category in productCategories"
                    :key="category.name"
                    class="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div class="text-4xl mb-6 text-center">{{ category.icon }}</div>
                <h3 class="text-2xl font-bold mb-6 text-center text-gray-200">{{ category.name }}</h3>
                <ul class="space-y-3">
                    <li v-for="item in category.items"
                        :key="item"
                        class="flex items-center text-gray-300">
                    <div class="w-2 h-2 bg-gradient-to-r from-slate-100 to-gray-300 rounded-full mr-3"></div>
                    {{ item }}
                    </li>
                </ul>
                </div>
            </div>
        </section>
        <!-- Stats Section -->
        <section class="bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900 shadow-lg py-20">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div v-for="stat in stats" :key="stat.number" class="text-center transform hover:scale-110 transition-transform duration-300">
                        <div class="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            {{ stat.number }}
                        </div>
                        <div class="text-gray-300 text-lg">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Company Features -->
        <section class="container mx-auto px-4 py-20">
            <h2 class="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-slate-100 to-gray-300 bg-clip-text text-transparent">
                Why Choose Us
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="feature in companyFeatures" :key="feature.title"
                    class="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br opacity-90" :class="feature.gradient">
                </div>
                <div class="relative p-10 text-white h-full">
                    <component :is="feature.icon" class="w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300"/>
                    <h3 class="text-2xl font-bold mb-6">{{ feature.title }}</h3>
                    <p class="text-white/95 leading-relaxed text-lg">{{ feature.description }}</p>
                </div>
                </div>
            </div>
        </section>
        <!-- Values Section -->
        <section class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-slate-100 to-gray-300 bg-clip-text text-transparent">
                Our Commitment
                </h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div v-for="value in values"
                        :key="value.title"
                        :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
                        class="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <component :is="value.icon" class="w-16 h-16 mb-6 text-slate-100"/>
                        <h3 class="text-2xl font-semibold mb-4 text-gray-300">{{ value.title }}</h3>
                        <p class="text-gray-300 leading-relaxed">{{ value.description }}</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- Features Grid -->
        <section class="container mx-auto px-4 py-20">
            <div class="grid md:grid-cols-4 gap-6">
                <div v-for="feature in features"
                    :key="feature.title"
                    class="text-center p-6 rounded-xl hover:bg-gray-800 hover:backdrop-blur-lg transition-colors duration-300 hover:cursor-auto">
                        <component :is="feature.icon" class="w-12 h-12 mx-auto mb-4 text-slate-200"/>
                <h4 class="font-semibold mb-2 text-gray-100">{{ feature.title }}</h4>
                <p class="text-sm text-gray-100">{{ feature.description }}</p>
                </div>
            </div>
        </section>
        <!-- Call to Action -->
        <section class="bg-gray-800/50 backdrop-blur-lg py-20">
            <div class="container mx-auto px-4 text-center">
                <div class="max-w-4xl mx-auto text-white">
                    <h2 class="text-4xl font-bold mb-6">Elevate Your Style Today</h2>
                    <p class="text-xl mb-8 text-gray-300 leading-relaxed">
                        Join thousands of satisfied customers who trust us for their fashion needs.
                        From premium shirts and hoodies to stylish accessories that complete your look.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link to="/store" @click="handleScroll" class="px-10 py-4 bg-gradient-to-r from-white to-gray-200 text-slate-800 rounded-full
                            hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg">
                        Shop Collection
                        </router-link>
                        <router-link to="/contact" @click="handleScroll" class="px-10 py-4 border-2 border-white text-white rounded-full
                            hover:bg-white hover:text-slate-800 transition-all duration-300 font-semibold text-lg">
                        Contact Us
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 1.2s ease-out;
}

.animate-slide-up {
    animation: slideUp 1.2s ease-out 0.3s both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

html {
    scroll-behavior: smooth;
}

.group:hover .transform {
    transform: scale(1.05);
}
</style>