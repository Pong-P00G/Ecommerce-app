<script setup>
import { useCartStore } from '../composables/useCart';
import { ShoppingCart } from 'lucide-vue-next';

const cartStore = useCartStore();
const handleAddToCart = (product) => {
    cartStore.addToCart(product);
};

defineProps({
    product: { type: Object, required: true },
});
</script>

<template>
    <div class="bg-paper border border-neutral-200 rounded-2xl p-5 transition-all duration-300 hover:border-ink hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgb(0_0_0_/_0.12)]">
        <h2 class="text-lg font-bold text-ink mb-1">{{ product.name }}</h2>
        <p class="text-xl font-bold text-accent tabular-nums mb-4">{{ '$' }}{{ product.price }}</p>
        <button
            @click="handleAddToCart(product)"
            class="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-ink text-paper text-sm font-bold rounded-full hover:bg-accent transition-all duration-300 hover:-translate-y-0.5"
        >
            <ShoppingCart class="w-4 h-4" />
            Add to Cart
        </button>
    </div>
</template>
