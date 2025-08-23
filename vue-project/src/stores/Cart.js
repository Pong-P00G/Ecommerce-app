import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cart = ref([]);
    const addToCart = (product) => {
        const existing = cart.value.find(item => item.id === product.id);
        if (existing) {
        existing.quantity += 1;
        } else {
        cart.value.push({ ...product, quantity: 1 });
        }
    };
    const removeFromCart = (productId) => {
        cart.value = cart.value.filter(item => item.id !== productId);
    };
    return {
        cart,
        addToCart,
        removeFromCart,
    };
});
