<script setup>
    import { useCartStore } from '../stores/Cart';
    const cartStore = useCartStore();
    const handleAddToCart = (product) => {
        cartStore.addToCart(product);
    };

</script>

<template>
    <div class="shop-card">
        <h2>{{ product.name }}</h2>
        <p>{{ product.price }}$</p>
        <button @click="handleAddToCart(product)">Add to Cart</button>
    </div>
</template>

<script>
export default {
    props: {
        product: Object,
    },
};
</script>