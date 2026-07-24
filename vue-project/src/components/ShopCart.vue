<script setup>
import { ref } from 'vue';
import { useShopStore } from '../stores/shop';
import { ShoppingCart, Check } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';

const shop = useShopStore();
const toast = useToast();
const addingItem = ref(false);

const handleAddToCart = (product) => {
    if (addingItem.value) return; // prevent double-click while animating

    shop.addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        qty: 1,
        image: product.image || product.thumbnail,
    });

    // Trigger animation & toast
    addingItem.value = true;
    toast.success(`Added “${product.name}” to cart`);

    // Brief pause so user sees the "Added!" state before drawer slides in
    setTimeout(() => {
        shop.openCart();
        addingItem.value = false;
    }, 500);
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
            :disabled="addingItem"
            class="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold rounded-full transition-all duration-300"
            :class="addingItem
                ? 'bg-success text-white scale-105 shadow-[0_8px_24px_-6px_rgb(34_197_94_/_0.45)]'
                : 'bg-ink text-paper hover:bg-accent hover:-translate-y-0.5'"
        >
            <transition name="icon-swap" mode="out-in">
                <Check v-if="addingItem" key="check" class="w-4 h-4" />
                <ShoppingCart v-else key="cart" class="w-4 h-4" />
            </transition>
            <transition name="icon-swap" mode="out-in">
                <span v-if="addingItem" key="added">Added!</span>
                <span v-else key="add">Add to Cart</span>
            </transition>
        </button>
    </div>
</template>

<style scoped>
.icon-swap-enter-active,
.icon-swap-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.icon-swap-enter-from {
    opacity: 0;
    transform: scale(0.6) rotate(-12deg);
}
.icon-swap-leave-to {
    opacity: 0;
    transform: scale(0.6) rotate(12deg);
}
</style>
