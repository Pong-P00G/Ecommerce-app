import { ref, computed, watch } from 'vue';

const WISHLIST_KEY = 'WishListItems';

const wishlist = ref(JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []);

watch(wishlist, (newValue) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(newValue));
}, { deep: true });

export function useWishlist() {
  const addToWishlist = (item) => {
    if (!wishlist.value.find(i => i.id === item.id)) {
      wishlist.value.push(item);
    }
  };

  const removeFromWishlist = (id) => {
    wishlist.value = wishlist.value.filter(item => item.id !== id);
  };

  const clearWishlist = () => {
    wishlist.value = [];
  };

  const isInWishlist = (id) => {
    return wishlist.value.some(item => item.id === id);
  };

  const wishlistCount = computed(() => wishlist.value.length);
  const allWishlistItems = computed(() => wishlist.value);

  return {
    wishlist,
    wishlistCount,
    allWishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };
}
