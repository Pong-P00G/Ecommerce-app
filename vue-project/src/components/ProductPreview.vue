<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ShoppingCart, Heart, Share2 } from 'lucide-vue-next';
import LazyImage from './LazyImage.vue';
import { Accesorie } from '../data/accesorie';
import { Hoodie } from '../data/hoodies';
import { Pants } from '../data/pants';
import { Shirt } from '../data/shirt';

const route = useRoute();

const allProduct = [...Shirt, ...Accesorie, ...Pants, ...Hoodie];

const product = computed(() => {
    const id = Number(route.params.id);
    return allProduct.find((p) => p.id === id);
});

const props = defineProps({
    product: { type: Object, required: true },
});
</script>

<template>
    <div v-if="product" class="max-w-2xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 md:p-8 bg-paper border border-neutral-200 rounded-2xl sm:rounded-3xl shadow-sm">
        <div class="relative overflow-hidden rounded-2xl bg-neutral-100">
            <LazyImage :src="product.image" :alt="product.name" wrapper-class="w-full h-64 sm:h-80 md:h-96" />
            <div class="absolute top-4 right-4 flex flex-col gap-2">
                <button class="w-10 h-10 rounded-full bg-paper shadow-md flex items-center justify-center text-ink hover:bg-accent hover:text-white transition-colors">
                    <Heart class="w-4 h-4" />
                </button>
                <button class="w-10 h-10 rounded-full bg-paper shadow-md flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors">
                    <Share2 class="w-4 h-4" />
                </button>
            </div>
        </div>
        <div class="mt-6 space-y-4">
            <span class="badge-ghost">Quick Preview</span>
            <h1 class="text-2xl sm:text-3xl font-elegant font-bold text-ink">{{ product.name }}</h1>
            <p class="text-xl sm:text-2xl font-bold text-accent tabular-nums">{{ '$' }}{{ product.price.toFixed(2) }}</p>
            <p class="text-neutral-600 leading-relaxed">{{ product.description || 'No description available.' }}</p>
            <button class="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-full hover:bg-accent-600 transition-all duration-300 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)] hover:-translate-y-0.5">
                <ShoppingCart class="w-4 h-4" />
                Add to Cart
            </button>
        </div>
    </div>
    <div v-else class="text-center mt-12 sm:mt-20 px-4 sm:px-6 py-12 sm:py-16 bg-paper border border-neutral-200 rounded-2xl sm:rounded-3xl max-w-xl mx-auto">
        <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">&#128230;</span>
        </div>
        <h3 class="text-xl font-bold text-ink mb-2">Product not found</h3>
        <p class="text-neutral-500">The product you're looking for doesn't exist or has been removed.</p>
    </div>
</template>
