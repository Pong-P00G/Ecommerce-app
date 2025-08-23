<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Accesorie } from '../data/accesorie';
import { Hoodie } from '../data/hoodies';
import { Pants } from '../data/pants';
import { Shirt } from '../data/shirt';

const route = useRoute();

const allProduct = [
    ...Shirt,
    ...Accesorie,
    ...Pants,
    ...Hoodie
];

const product = computed(() => {
    const id = Number(route.params.id);
    return allProduct.find(p => p.id === id);
});

const props = defineProps({
    product: { type: Object, required: true }
})
</script>

<template>
    <div v-if="product" class="max-w-xl mx-auto mt-10 p-6 bg-gray-800/60 backdrop-blur rounded-xl">
        <img :src="product.image" :alt="product.name" class="w-full mb-4 rounded-lg">
        <h1 class="text-2xl font-bold text-white mb-2">{{ product.name }}</h1>
        <p class="text-gray-300 mb-4">${{ product.price.toFixed(2) }}</p>
        <p class="text-gray-400">{{ product.description || 'No description available.' }}</p>
    </div>
    <div v-else class="text-white text-center mt-20">
        Product not found.
    </div>
</template>
