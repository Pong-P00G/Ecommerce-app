<script setup>
import { ref } from 'vue';
import '../assets/homeStyle.css';
import { allProduct } from '../data/allProduct';
import { RouterLink, useRoute } from 'vue-router';


const heroTitle = ref('Welcome to STORE');
const heroSubtitle = ref('ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

const product = ref(allProduct.slice(0, 4));


</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-[#dcf1ff] to-[#d0ebff]">
        <!-- Hero section -->
        <section class="relative bg-gradient-to-r from-[#d8edfc] to-[#c2e7ff] h-[500px] flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-20"></div>
            <div class="text-center mt-20 max-w-3xl mx-auto relative z-10">
                <h1 class="text-6xl md:text-7xl font-extrabold mb-6 text-gray-800 tracking-tight drop-shadow-lg">
                    {{ heroTitle }}
                </h1>
                <p class="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                    {{ heroSubtitle }}
                </p>
                <div class="mt-10 flex justify-center items-center gap-6">
                    <a href="/Allproduct" class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-semibold text-lg shadow-xl transition-transform transform hover:scale-110">
                        Start Shopping
                    </a>
                    <a href="/about" class="text-lg font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 transition-colors">
                        Learn more →
                    </a>
                </div>
            </div>
        </section>
        <!-- Features Section -->
        <section class="py-20 bg-[#e6f5ff] relative">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div v-for="(feature, index) in [
                            { title: 'Our Services', text: 'Explore our wide range of professional services designed to meet your needs.' },
                            { title: 'About Us', text: 'Learn more about our company and our commitment to excellence.' },
                            { title: 'Contact', text: 'Get in touch with us. We\'re here to help and answer any questions.' }
                        ]"
                        :key="index"
                        class="text-center p-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-3 hover:shadow-2xl transition-all">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ feature.title }}</h3>
                        <p class="text-gray-600">{{ feature.text }}</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- Main Contents -->
        <main class="container mx-auto px-4 py-20">
            <h2 class="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-16 relative">
                Featured Products
                <span class="block w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto mt-4 rounded-full"></span>
            </h2>
            <div v-for="product in [product]" :key="product.id" class="mb-12">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    <div v-for="product in product" :key="product.id" class="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
                        <div class="relative">
                            <img :src="product.image" alt="" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"/>
                            <span class="absolute top-3 left-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
                                New
                            </span>
                        </div>
                        <div class="p-6">
                            <h3 class="text-2xl font-bold text-gray-800">
                                {{ product.name }}
                            </h3>
                            <p class="text-gray-600 mt-2">{{ product.description }}</p>
                            <p class="text-xl font-bold text-blue-600 mt-4">
                                ${{ product.price }}
                            </p>
                            <RouterLink
                                to="/Checkout"
                                class="block w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg px-4 py-3 font-semibold text-lg shadow-md transition-all text-center">
                                Add to Cart
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <!-- About Section -->
        <section class="container mx-auto px-4 py-20">
            <h2 class="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
                About Us
            </h2>
            <div class="container bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 px-10 py-8 max-w-4xl mx-auto">
                <p class="text-xl leading-relaxed text-center text-gray-700">
                Hey there, welcome to our shop! 🎉 We’re all about great service and
                awesome products that make you look and feel good. From everyday
                    <span class="font-semibold text-blue-600">T-Shirts</span> and
                    <span class="font-semibold text-blue-600">Hoodies</span> to
                    <span class="font-semibold text-blue-600">Pants</span> and cool
                    <span class="font-semibold text-blue-600">Accessories</span>, we’ve
                got you covered. Every item is made with
                    <span class="font-semibold text-blue-700">high-quality materials</span>
                , so you get comfort, style, and durability all in one. 💎
                <br /><br />
                Whether you’re shopping for something casual or a new favorite outfit,
                our collection is designed to fit your lifestyle. We’re more than just
                a store — we’re a community of people who love fashion, comfort, and
                confidence. Thanks for being part of it! 💖
                </p>
            </div>
        </section>
    </div>
</template>


<style scoped>
.container {
    min-width: 620px;
    max-width: 1200px;
}
</style>
