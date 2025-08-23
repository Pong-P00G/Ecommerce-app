<script setup>
import { useCartStore } from '../../stores/Cart';
const cartStore = useCartStore();

</script>

<template>
    <div>
        <h2>Shopping Cart</h2>
        <ul>
            <li v-for="item in cartStore.cart" :key="item.id">
                {{ item.name }} x {{ item.quantity }}
            </li>
        </ul>
    </div>
</template>