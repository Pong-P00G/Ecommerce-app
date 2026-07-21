<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Clock, ArrowRight, Trash2 } from 'lucide-vue-next'
import { useRecentlyViewedStore } from '../stores/recentlyViewed.js'
import LazyImage from './LazyImage.vue'

const store = useRecentlyViewedStore()
const products = computed(() => store.items.slice(0, 6))

const clearAll = () => {
    store.clear()
}
</script>

<template>
    <div v-if="products.length > 0" class="relative">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <Clock class="w-4 h-4 text-accent" />
                <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-ink">Recently viewed</h3>
            </div>
            <button @click="clearAll"
                class="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-danger transition-colors">
                <Trash2 class="w-3 h-3" />
                Clear
            </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <RouterLink v-for="product in products" :key="product.id" :to="'/product/' + product.id"
                class="group block">
                <div class="aspect-square rounded-xl bg-neutral-100 overflow-hidden mb-2">
                    <LazyImage
                        :src="product.image || 'https://placehold.co/200x200/e4e4e7/a1a1aa?text=P'"
                        :alt="product.name"
                        wrapper-class="w-full h-full"
                        img-class="group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <p class="text-xs font-bold text-ink truncate group-hover:text-accent transition-colors">{{ product.name }}</p>
                <p class="text-xs font-semibold text-accent tabular-nums">${{ parseFloat(product.price).toFixed(2) }}</p>
            </RouterLink>
        </div>
    </div>
</template>
