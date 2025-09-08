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
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <!-- Global Floating Bubbles / Particles -->
        <div class="fixed inset-0 pointer-events-none overflow-hidden">
        <div v-for="i in 25" :key="i" class="bubble absolute rounded-full opacity-20"
            :style="bubbleStyle(i)">
        </div>
        </div>
        <!-- Hero Section -->
        <section class="relative h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <div class="relative z-20 max-w-5xl space-y-8">
            <h1 class="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in">
            SHOPPING
            </h1>
            <h2 class="text-2xl md:text-4xl font-semibold text-gray-200 animate-slide-up">
            Premium Fashion & Accessories
            </h2>
            <p class="text-lg md:text-xl text-gray-300 animate-slide-up max-w-3xl mx-auto">
            Discover our exclusive collection of shirts, hoodies, pants, jeans, and premium accessories for the modern gentleman
            </p>
        </div>
        </section>
        <!-- Product Categories Preview -->
        <section class="container mx-auto px-4 py-20">
        <h2 class="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-slate-100 to-gray-300 bg-clip-text text-transparent">
            What We Offer
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div v-for="category in productCategories" :key="category.name"
                class="bg-white/5 backdrop-blur-lg rounded-3xl shadow-lg p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div class="text-5xl mb-6 text-center text-gradient">{{ category.icon }}</div>
            <h3 class="text-2xl font-bold mb-6 text-center text-gray-200">{{ category.name }}</h3>
            <ul class="space-y-3">
                <li v-for="item in category.items" :key="item" class="flex items-center text-gray-300">
                <div class="w-2 h-2 bg-gradient-to-r from-slate-100 to-gray-300 rounded-full mr-3"></div>
                {{ item }}
                </li>
            </ul>
            </div>
        </div>
        </section>
        <!-- Stats Section -->
        <section class="bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900 shadow-lg py-20">
        <div class="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="stat in stats" :key="stat.number" class="text-center transform hover:scale-110 transition-transform duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                {{ stat.number }}
            </div>
            <div class="text-gray-300 text-lg">{{ stat.label }}</div>
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
                class="relative group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-br opacity-90" :class="feature.gradient"></div>
            <div class="relative p-10 text-white h-full flex flex-col justify-center items-center">
                <component :is="feature.icon" class="w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300"/>
                <h3 class="text-2xl font-bold mb-6 text-center">{{ feature.title }}</h3>
                <p class="text-white/95 text-center leading-relaxed text-lg">{{ feature.description }}</p>
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
            <div v-for="value in values" :key="value.title"
                class="bg-white/5 backdrop-blur-lg p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-500 text-center">
                <component :is="value.icon" class="w-16 h-16 mb-6 text-slate-100 mx-auto"/>
                <h3 class="text-2xl font-semibold mb-4 text-gray-300">{{ value.title }}</h3>
                <p class="text-gray-300 leading-relaxed">{{ value.description }}</p>
            </div>
            </div>
        </div>
        </section>
        <!-- Call to Action -->
        <section class="bg-white/5 backdrop-blur-lg py-20">
        <div class="container mx-auto px-4 text-center text-white">
            <div class="max-w-4xl mx-auto space-y-6">
            <h2 class="text-4xl font-bold mb-6 text-gradient">Elevate Your Style Today</h2>
            <p class="text-xl text-gray-300 leading-relaxed">
                Join thousands of satisfied customers who trust us for their fashion needs.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link to="/Allproduct" class="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 hover:shadow-xl transition-all">
                Shop Collection
                </router-link>
                <router-link to="/contact" class="px-10 py-4 border-2 border-white rounded-full font-semibold text-lg hover:bg-white hover:text-slate-800 transition-all">
                Contact Us
                </router-link>
            </div>
            </div>
        </div>
        </section>
    </div>
</template>

<style scoped>

.animate-fade-in { animation: fadeIn 1.2s ease-out; }
.animate-slide-up { animation: slideUp 1.2s ease-out 0.3s both; }

@keyframes fadeIn { from {opacity:0; transform:translateY(-20px);} to{opacity:1; transform:translateY(0);} }
@keyframes slideUp { from {opacity:0; transform:translateY(30px);} to{opacity:1; transform:translateY(0);} }
@keyframes floatUp {
    0% {
        top: 100vh;
        transform: translateX(0) scale(1);
        opacity: 0.2;
    }
    25% {
        top: 75vh;
        transform: translateX(-20px) scale(1.1);
        opacity: 0.15;
    }
    50% {
        top: 50vh;
        transform: translateX(10px) scale(0.9);
        opacity: 0.1;
    }
    75% {
        top: 25vh;
        transform: translateX(-10px) scale(1.05);
        opacity: 0.15;
    }
    100% {
        top: -20vh;
        transform: translateX(0) scale(1);
        opacity: 0.2;
    }
}


html { scroll-behavior: smooth; }

</style>