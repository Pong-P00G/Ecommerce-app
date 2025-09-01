import { ref, computed } from 'vue';
import api from '../api/api.js';

const wishlistItems = ref([]);

export function useWishList() {
  const fetchWishlist = async (userId) => {
    const { data } = await api.get(`/wishlist/${userId}`);
    wishlistItems.value = data;
  };

  const addToWishlist = async (item) => {
    const { data } = await api.post('/wishlist', item);
    wishlistItems.value.push(data);
  };

  const removeFromWishlist = async (itemId) => {
    await api.delete(`/wishlist/${itemId}`);
    wishlistItems.value = wishlistItems.value.filter(i => i.id !== itemId);
  };

  const totalWishlist = computed(() => wishlistItems.value.length);

  return { wishlistItems, fetchWishlist, addToWishlist, removeFromWishlist, totalWishlist };
}
