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
    <div class="min-h-screen bg-[#cbe5f6]">
        <!-- Hero section -->
        <section class="bg-center h-[400px] flex items-center justify-center bg-[#d8edfc]">
            <div class="text-center mt-28 max-w-3xl mx-auto">
                <h1 class="text-6xl font-extrabold mb-4 text-gray-800">
                    {{ heroTitle }}
                </h1>
                <p class="mt-6 text-lg text-gray-600">
                    {{ heroSubtitle }}
                </p>
                <div class="mt-10 flex justify-center items-center gap-6">
                    <a href="/Allproduct" class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg shadow-lg transition-transform transform hover:scale-105">
                        Start Shopping
                    </a>
                    <a href="/about" class="text-lg font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 transition-colors">
                        Learn more →
                    </a>
                </div>
            </div>
        </section>
        <!-- Features Section -->
        <section class="py-20 bg-[#c2e7ff]">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div class="text-center p-8 bg-gray-50 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">Our Services</h3>
                        <p class="text-gray-600">Explore our wide range of professional services designed to meet your needs.</p>
                    </div>
                    <div class="text-center p-8 bg-gray-50 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">About Us</h3>
                        <p class="text-gray-600">Learn more about our company and our commitment to excellence.</p>
                    </div>
                    <div class="text-center p-8 bg-gray-50 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">Contact</h3>
                        <p class="text-gray-600">Get in touch with us. We're here to help and answer any questions.</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- Main Contents -->
        <main class="container mx-auto px-4 py-16">
            <h2 class="text-4xl font-extrabold text-center text-gray-800 mb-12">
                Featured Products
            </h2>
            <div v-for="product in [product]" :key="product.id" class="mb-12">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <div v-for="product in product" :key="product.id" class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                        <img :src="product.image" alt="" class="w-full h-56 object-cover">
                        <div class="p-6">
                            <h3 class="text-2xl font-bold text-gray-800">{{ product.name }}</h3>
                            <p class="text-gray-600 mt-2">{{ product.description }}</p>
                            <p class="text-xl font-bold text-blue-600 mt-4">${{ product.price }}</p>
                            <button class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-semibold text-lg shadow-md transition-colors">
                                <RouterLink to="/Checkout" class="block w-full h-full">
                                    Add to Cart
                                </RouterLink>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.container {
    min-width: 620px;
    max-width: 1200px;
}
</style>
