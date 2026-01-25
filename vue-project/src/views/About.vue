<script setup>
import { ref, onMounted } from 'vue'
import { Building2, Users, Target, Heart, Globe, Sparkles, Shield, Truck, Award, Star } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const isVisible = ref(false)

const stats = [
    { number: '25K+', label: 'Happy Customers' },
    { number: '200+', label: 'Premium Products' },
    { number: '30+', label: 'Countries Worldwide' },
    { number: '24/7', label: 'Customer Support' }
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


const bubbleColors = ['#3b82f6', '#8b5cf6', '#f472b6', '#10b981', '#facc15']

function random(min, max) {
    return Math.random() * (max - min) + min
}

function bubbleStyle(i) {
    const size = random(30, 120) // width & height
    const left = random(0, 100) // vw position
    const duration = random(15, 30) // animation duration
    const delay = random(0, 10) // animation delay
    const color = bubbleColors[i % bubbleColors.length]

    return {
        width: `${size}px`,
        height: `${size}px`,
        top: '100vh', // start from bottom
        left: `${left}vw`,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: 0.2,
        animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
    }
}

</script>

<template>
    <div class="min-h-screen bg-white relative overflow-hidden">
        <!-- Hero Section -->
        <section class="relative bg-gray-50 border-b border-gray-100 py-32 px-4">
            <div class="relative z-20 max-w-5xl mx-auto space-y-8 text-center">
                <h1 class="text-6xl md:text-7xl font-black text-gray-900 tracking-tight">
                    SHOPPING
                </h1>
                <h2 class="text-3xl md:text-4xl font-light text-gray-600">
                    Premium Fashion & Accessories
                </h2>
                <p class="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
                    Discover our exclusive collection of shirts, hoodies, pants, jeans, and premium accessories for the
                    modern gentleman
                </p>
            </div>
        </section>

        <!-- Product Categories Preview -->
        <section class="container mx-auto px-4 py-24">
            <h2 class="text-4xl md:text-5xl font-black text-center mb-16 text-gray-900 tracking-tight">
                What We Offer
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="category in productCategories" :key="category.name"
                    class="bg-gray-50 border border-gray-100 rounded-3xl shadow-sm p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-500">
                    <div class="text-5xl mb-6 text-center">{{ category.icon }}</div>
                    <h3 class="text-2xl font-bold mb-6 text-center text-gray-900">{{ category.name }}</h3>
                    <ul class="space-y-3">
                        <li v-for="item in category.items" :key="item"
                            class="flex items-center text-gray-600 font-medium">
                            <div class="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="bg-gray-50 border-y border-gray-100 py-24">
            <div class="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div v-for="stat in stats" :key="stat.number"
                    class="text-center transform hover:scale-110 transition-transform duration-300">
                    <div class="text-5xl font-black text-gray-900 mb-2">
                        {{ stat.number }}
                    </div>
                    <div class="text-gray-600 text-lg font-medium">{{ stat.label }}</div>
                </div>
            </div>
        </section>

        <!-- Company Features -->
        <section class="container mx-auto px-4 py-24">
            <h2 class="text-4xl md:text-5xl font-black text-center mb-16 text-gray-900 tracking-tight">
                Why Choose Us
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="feature in companyFeatures" :key="feature.title"
                    class="relative group overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 bg-white">
                    <div class="relative p-10 h-full flex flex-col justify-center items-center">
                        <component :is="feature.icon"
                            class="w-16 h-16 mb-6 text-gray-900 transform group-hover:scale-110 transition-transform duration-300" />
                        <h3 class="text-2xl font-bold mb-6 text-center text-gray-900">{{ feature.title }}</h3>
                        <p class="text-gray-600 text-center leading-relaxed text-lg font-light">{{ feature.description
                        }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Values Section -->
        <section class="bg-gray-50 py-24">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl md:text-5xl font-black text-center mb-16 text-gray-900 tracking-tight">
                    Our Commitment
                </h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div v-for="value in values" :key="value.title"
                        class="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm transform hover:scale-105 hover:shadow-xl transition-all duration-500 text-center">
                        <component :is="value.icon" class="w-16 h-16 mb-6 text-gray-900 mx-auto" />
                        <h3 class="text-2xl font-bold mb-4 text-gray-900">{{ value.title }}</h3>
                        <p class="text-gray-600 leading-relaxed font-light">{{ value.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="bg-white py-24">
            <div class="container mx-auto px-4 text-center">
                <div class="max-w-4xl mx-auto space-y-8">
                    <h2 class="text-4xl md:text-5xl font-black mb-6 text-gray-900 tracking-tight">Elevate Your Style
                        Today</h2>
                    <p class="text-xl text-gray-600 leading-relaxed font-light">
                        Join thousands of satisfied customers who trust us for their fashion needs.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link to="/product"
                            class="px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold text-lg hover:scale-105 hover:shadow-xl transition-all">
                            Shop Collection
                        </router-link>
                        <router-link to="/contact"
                            class="px-10 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-900 hover:text-white transition-all">
                            Contact Us
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
html {
    scroll-behavior: smooth;
}
</style>