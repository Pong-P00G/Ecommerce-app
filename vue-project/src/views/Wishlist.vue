<script setup>
import { computed, ref } from 'vue';
import { useHead } from '@unhead/vue';
import { RouterLink } from 'vue-router';
import LazyImage from '../components/LazyImage.vue';
import {
    Heart, ShoppingCart, Trash2, ArrowRight, CheckCheck
} from 'lucide-vue-next';

useHead({
    title: 'My Wishlist | AlieeShop',
    meta: [
        { name: 'description', content: 'View and manage your saved items at AlieeShop. Your wishlist is saved across all your devices.' },
        { property: 'og:title', content: 'My Wishlist | AlieeShop' },
        { property: 'og:description', content: 'View and manage your saved items at AlieeShop.' },
        { name: 'twitter:title', content: 'My Wishlist | AlieeShop' },
        { name: 'twitter:description', content: 'View and manage your saved items at AlieeShop.' },
    ],
    link: [
        { rel: 'canonical', href: 'https://alieeshop.com/wishlist' },
    ],
})
import { useShopStore } from '../stores/shop';
import { useToast } from '../composables/useToast.js';
import WishListBtn from '../components/WishListBtn.vue';

const shop = useShopStore();
const toast = useToast();

const items = computed(() => shop.wishlist);
const totalValue = computed(() =>
    items.value.reduce((sum, i) => sum + (parseFloat(i.price || i.base_price) || 0), 0)
);

const movingIds = ref(new Set());

const moveToCart = (item) => {
    movingIds.value.add(item.id);
    shop.addToCart({
        id: item.id,
        title: item.name || item.product_name,
        price: parseFloat(item.price || item.base_price) || 0,
        qty: 1,
        image: item.image || item.thumbnail,
    });
    shop.toggleWishlist(item);
    movingIds.value.delete(item.id);
    toast.success('Moved to cart');
};

const moveAllToCart = () => {
    items.value.forEach((item) => {
        shop.addToCart({
            id: item.id,
            title: item.name || item.product_name,
            price: parseFloat(item.price || item.base_price) || 0,
            qty: 1,
            image: item.image || item.thumbnail,
        });
    });
    shop.clearWishlist();
    toast.success('All items moved to cart');
};

const showClearConfirm = ref(false);

const confirmClear = () => {
    shop.clearWishlist();
    showClearConfirm.value = false;
    toast.success('Wishlist cleared');
};
</script>

<template>
    <div class="bg-paper min-h-[70vh]">
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Header -->
            <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
                        <Heart class="w-4 h-4 fill-accent" />
                        Saved for later
                    </span>
                    <h1 class="text-4xl md:text-5xl font-elegant font-bold text-ink leading-tight">Your wishlist</h1>
                    <p class="text-sm text-neutral-500 mt-1.5">
                        <span class="font-bold text-ink tabular-nums">{{ items.length }}</span>
                        {{ items.length === 1 ? 'item' : 'items' }}
                        <span v-if="items.length" class="mx-2">&middot;</span>
                        <span v-if="items.length" class="font-bold text-accent tabular-nums">
                            ${{ totalValue.toFixed(2) }}
                        </span> total value
                    </p>
                </div>

                <div v-if="items.length" class="flex items-center gap-3">
                    <button
                        @click="moveAllToCart"
                        class="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper text-sm font-bold rounded-full hover:bg-accent transition-all"
                    >
                        <ShoppingCart class="w-4 h-4" />
                        Move all to cart
                    </button>
                    <button
                        @click="showClearConfirm = true"
                        class="inline-flex items-center gap-2 px-4 py-2.5 bg-paper border border-neutral-300 text-ink text-sm font-bold rounded-full hover:border-danger hover:text-danger transition-all"
                    >
                        <Trash2 class="w-4 h-4" />
                        Clear all
                    </button>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="!items.length" class="card-flat text-center py-24 px-6">
                <div class="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
                    <Heart class="w-10 h-10 text-neutral-300" />
                </div>
                <h2 class="text-2xl font-elegant font-bold text-ink mb-2">Your wishlist is empty</h2>
                <p class="text-neutral-500 mb-8 max-w-md mx-auto">
                    Tap the <Heart class="w-4 h-4 inline-block text-accent" /> heart on any product
                    to save it here. Your wishlist is saved even if you leave.
                </p>
                <RouterLink to="/product" class="btn-accent inline-flex">
                    Discover products
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <article
                    v-for="item in items"
                    :key="item.id"
                    class="group/card bg-paper border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_32px_-8px_rgb(0_0_0_/_0.12)]"
                >
                    <RouterLink :to="'/product/' + item.id" class="block">
                        <div class="relative aspect-square bg-neutral-100 overflow-hidden">
                            <LazyImage
                                :src="item.image || item.thumbnail || item.images?.[0]?.image_url"
                                :alt="item.name || item.product_name"
                                wrapper-class="w-full h-full"
                                img-class="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                            />
                            <div class="absolute top-3 right-3 z-10">
                                <WishListBtn :item="item" />
                            </div>
                        </div>
                    </RouterLink>
                    <div class="p-5 space-y-2">
                        <p v-if="item.category" class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                            {{ typeof item.category === 'object' ? item.category.name : item.category }}
                        </p>
                        <RouterLink :to="'/product/' + item.id">
                            <h3 class="font-bold text-base text-ink group-hover/card:text-accent transition-colors line-clamp-2">
                                {{ item.name || item.product_name }}
                            </h3>
                        </RouterLink>
                        <p class="text-lg font-bold text-ink tabular-nums">
                            ${{ (parseFloat(item.price || item.base_price) || 0).toFixed(2) }}
                        </p>
                        <button
                            @click="moveToCart(item)"
                            :disabled="movingIds.has(item.id)"
                            class="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200"
                            :class="movingIds.has(item.id)
                                ? 'bg-success/10 text-success'
                                : 'bg-ink text-paper hover:bg-accent'"
                        >
                            <template v-if="movingIds.has(item.id)">
                                <CheckCheck class="w-4 h-4" />
                                Moved!
                            </template>
                            <template v-else>
                                <ShoppingCart class="w-4 h-4" />
                                Move to cart
                            </template>
                        </button>
                    </div>
                </article>
            </div>
        </section>

        <!-- Clear All Confirmation Modal -->
        <Transition name="modal">
            <div v-if="showClearConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showClearConfirm = false">
                <div class="absolute inset-0 bg-ink/60 backdrop-blur-sm"></div>
                <div class="relative bg-paper rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                    <div class="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                        <Trash2 class="w-7 h-7 text-danger" />
                    </div>
                    <h3 class="text-lg font-bold text-ink mb-2">Clear all {{ items.length }} items?</h3>
                    <p class="text-sm text-neutral-500 mb-6">This can't be undone. You'll lose all your saved items.</p>
                    <div class="flex gap-3">
                        <button
                            @click="showClearConfirm = false"
                            class="flex-1 px-4 py-2.5 border border-neutral-300 text-ink text-sm font-bold rounded-full hover:bg-neutral-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            @click="confirmClear"
                            class="flex-1 px-4 py-2.5 bg-danger text-paper text-sm font-bold rounded-full hover:bg-danger-600 transition-all"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.9);
    opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
