<script setup>
import { computed } from 'vue'
import { useShopStore } from '../stores/shop'

const shop = useShopStore()
const totalQty = computed(() => shop.cart.reduce((s, i) => s + i.qty, 0))
const totalPrice = computed(() => shop.cart.reduce((s, i) => s + i.qty * i.price, 0))


</script>


<template>
  <div class="fixed right-6 top-16 w-96 bg-white shadow-2xl rounded-lg p-4 z-50">
    <h3 class="font-bold mb-3">Cart ({{ totalQty }})</h3>
    <div v-if="!shop.cart.length" class="text-sm text-slate-500">Your cart is empty</div>
    <div v-for="(it, idx) in shop.cart" :key="idx" class="flex gap-3 items-center mb-3">
      <img :src="it.image" class="w-14 h-14 object-cover rounded" />
      <div class="flex-1">
        <div class="font-medium">{{ it.title }}</div>
        <div class="text-sm text-slate-600">x{{ it.qty }} • {{ it.variant.size ?? '' }}</div>
      </div>
      <div class="font-bold">${{ (it.price * it.qty).toFixed(2) }}</div>
    </div>
    <div class="mt-3 flex justify-between items-center">
      <div class="font-bold">Total</div>
      <div class="font-bold">${{ totalPrice.toFixed(2) }}</div>
    </div>
  </div>
</template>

