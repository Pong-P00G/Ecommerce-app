<script setup>
import { computed } from 'vue';
import { Heart } from 'lucide-vue-next';
import { useWishlist } from '../composables/useWishList.js';

const props = defineProps({
  item: { type: Object, required: true },
  size: { type: String, default: 'md' }, // sm, md, lg
  showText: { type: Boolean, default: false }
});

const emit = defineEmits(['added', 'removed']);

const { isInWishlist, toggleWishlist } = useWishlist();

const isWishlisted = computed(() => isInWishlist(props.item.id));

const sizeClasses = computed(() => {
  return {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  }[props.size] || 'w-10 h-10 p-2';
});

const iconSize = computed(() => {
  return {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[props.size] || 'w-5 h-5';
});

const handleToggle = () => {
  const added = toggleWishlist(props.item);
  emit(added ? 'added' : 'removed', props.item);
};
</script>

<template>
  <div class="inline-flex items-center">
    <button
      @click="handleToggle"
      :class="[
        'rounded-full transition-all duration-300 hover:scale-110 active:scale-95',
        sizeClasses,
        isWishlisted
          ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg'
          : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-pink-400 border border-white/20'
      ]"
      :title="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
      :aria-pressed="isWishlisted.toString()"
      aria-label="Toggle wishlist"
    >
      <Heart :class="[iconSize, isWishlisted ? 'fill-current' : '']" />
    </button>
    <span v-if="showText" class="ml-2 text-sm font-medium">
      <slot name="text" :inWish="isWishlisted">
        {{ isWishlisted ? 'In Wishlist' : 'Add to Wishlist' }}
      </slot>
    </span>
  </div>
</template>
