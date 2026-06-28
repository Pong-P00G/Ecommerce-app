<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-vue-next';
import { useShopStore } from '../stores/shop';
import WishListBtn from '../components/WishListBtn.vue';

const shop = useShopStore();

const items = computed(() => shop.wishlist.map(id => ({ id })));
const totalValue = computed(() => items.value.reduce((sum, i) => sum + (i.price || 0), 0));

const clearAll = () => {
    if (confirm('Clear all items from wishlist?')) {
        items.value.forEach((i) => shop.toggleWishlist(i.id));
    }
};
</script>

<template>
    <div class="bg-paper min-h-[70vh]">
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Header -->
            <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div class="space-y-2">
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        <Heart class="w-4 h-4 fill-accent" />
                        Saved for later
                    </span>
                    <h1 class="text-4xl md:text-5xl font-elegant font-bold text-ink">Your wishlist</h1>
                    <p class="text-sm text-neutral-500">
                        <span class="font-bold text-ink tabular-nums">{{ items.length }}</span> {{ items.length === 1 ? 'item' : 'items' }}
                        <span v-if="items.length" class="mx-2">·</span>
                        <span v-if="items.length" class="font-bold text-accent tabular-nums">{{ '$' }}{{ totalValue.toFixed(2) }}</span> total
                    </p>
                </div>
                <button
                    v-if="items.length"
                    @click="clearAll"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-paper border border-neutral-300 text-ink text-sm font-bold rounded-full hover:border-accent hover:text-accent transition-all"
                >
                    <Trash2 class="w-4 h-4" />
                    Clear all
                </button>
            </div>

            <!-- Empty state -->
            <div v-if="!items.length" class="card-flat text-center py-20 px-6">
                <div class="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5">
                    <Heart class="w-10 h-10 text-neutral-400" />
                </div>
                <h2 class="text-2xl font-elegant font-bold text-ink mb-2">No favorites yet</h2>
                <p class="text-neutral-500 mb-6 max-w-md mx-auto">Tap the heart on any product to save it for later. Your wishlist syncs across all your devices.</p>
                <RouterLink to="/product" class="btn-accent">
                    Discover products
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <article
                    v-for="item in items"
                    :key="item.id"
                    class="bg-paper border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_32px_-8px_rgb(0_0_0_/_0.12)] group/card"
                >
                    <RouterLink :to="'/product/' + item.id" class="block">
                        <div class="relative aspect-square bg-neutral-100 overflow-hidden">
                            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                            <div class="absolute top-3 right-3">
                                <WishListBtn :item="item" />
                            </div>
                        </div>
                        <div class="p-5 space-y-2">
                            <p v-if="item.category" class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{{ item.category }}</p>
                            <h3 class="font-bold text-base text-ink group-hover/card:text-accent transition-colors">{{ item.name }}</h3>
                            <p class="text-lg font-bold text-ink tabular-nums">{{ '$' }}{{ item.price }}</p>
                            <button class="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink text-paper text-sm font-bold rounded-full hover:bg-accent transition-all">
                                <ShoppingCart class="w-4 h-4" />
                                Move to cart
                            </button>
                        </div>
                    </RouterLink>
                </article>
            </div>
        </section>
    </div>
</template>
