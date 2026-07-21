<script setup>
import { computed } from 'vue';
import { Heart } from 'lucide-vue-next';
import { useShopStore } from '../stores/shop';

const props = defineProps({
    item: { type: Object, required: true },
    size: { type: String, default: 'md' }, // sm, md, lg
    showText: { type: Boolean, default: false },
});

const emit = defineEmits(['added', 'removed']);

const shop = useShopStore();
const isWishlisted = computed(() => shop.inWishlist(props.item.id));

const sizeClasses = computed(() => ({
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
}[props.size] || 'w-10 h-10'));

const iconSize = computed(() => ({
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
}[props.size] || 'w-5 h-5'));

const handleToggle = () => {
    shop.toggleWishlist(props.item);
    emit(isWishlisted.value ? 'removed' : 'added', props.item);
};
</script>

<template>
    <div class="inline-flex items-center">
        <button
            @click="handleToggle"
            :class="[
                sizeClasses,
                'rounded-full transition-all duration-300 flex items-center justify-center',
                'hover:scale-110 active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                isWishlisted
                    ? 'bg-accent text-white shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]'
                    : 'bg-paper text-ink border border-neutral-300 hover:border-ink hover:bg-ink hover:text-paper'
            ]"
            :title="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
            :aria-pressed="isWishlisted.toString()"
            aria-label="Toggle wishlist"
        >
            <Heart :class="[iconSize, isWishlisted ? 'fill-current' : '']" />
        </button>
        <span v-if="showText" class="ml-2 text-sm font-medium text-ink">
            <slot name="text" :inWish="isWishlisted">
                {{ isWishlisted ? 'In Wishlist' : 'Add to Wishlist' }}
            </slot>
        </span>
    </div>
</template>
