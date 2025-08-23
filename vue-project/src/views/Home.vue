<script setup>
import { ref } from 'vue';
import '../assets/homeStyle.css';
import { allProduct } from '../data/allProduct';


const heroTitle = ref('Welcome to STORE');
const heroSubtitle = ref('ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

const product = ref(allProduct.slice(0, 4));


</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <!-- Bubble background -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="bubble absolute top-20 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
            <div class="bubble delay-2s absolute top-40 right-40 w-32 h-32 bg-purple-500 rounded-full opacity-10"></div>
            <div class="bubble delay-3s absolute bottom-10 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-10"></div>
            <div class="bubble delay-4s absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full opacity-10"></div>
        </div>
        <!-- Hero section -->
        <section class="bg-center h-[400px] flex items-center justify-center">
            <div class="text-center mt-28 max-w-3xl mx-auto">
                <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent animate-[bounce_2s_ease-in-out_infinite]">
                    {{ heroTitle }}
                </h1>
                <p class="mt-6 text-lg text-slate-300">
                    {{ heroSubtitle }}
                </p>
                <div class="mt-10 flex justify-center items-center gap-6">
                    <a href="/Allproduct" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm">
                    Get started
                    </a>
                    <a href="/about" class="text-sm font-medium text-white hover:underline flex items-center gap-1">
                    Learn more →
                    </a>
                </div>
            </div>
        </section>
        <!-- Features Section -->
        <section class="py-16 m-6">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
                        <h3 class="text-xl font-semibold mb-4">Our Services</h3>
                        <p class="text-gray-300">Explore our wide range of professional services designed to meet your needs.</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
                        <h3 class="text-xl font-semibold mb-4">About Us</h3>
                        <p class="text-gray-300">Learn more about our company and our commitment to excellence.</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
                        <h3 class="text-xl font-semibold mb-4">Contact</h3>
                        <p class="text-gray-300">Get in touch with us. We're here to help and answer any questions.</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- Main Contents -->
        <main class="container mx-auto px-4 py-6 bg-white/10 backdrop-blur-lg rounded-xl">
            <h2 class="text-3xl font-bold text-center text-white mb-8">
                Our Products
            </h2>
            <div v-for="product in [product]" :key="product.id" class="mb-12">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div v-for="product in product" :key="product.id" class="bg-white/10 backdrop-blur-lg rounded-lg p-4 transform hover:scale-105 transition-transform">
                        <img :src="product.image" alt="" class="w-full h-48 object-cover rounded-lg mb-4">
                        <h3 class="text-xl font-semibold text-white">{{ product.name }}</h3>
                        <p class="text-gray-300 mt-2">{{ product.description }}</p>
                        <p class="text-lg font-bold text-white mt-4">${{ product.price }}</p>
                    </div>
                </div>
            </div>
        </main>
        
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
}
</style>