import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as api from "../api/api";

export const useWishlistStore = defineStore("wishlist", () => {
  const wishlistItems = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const setError = (err, fallback) => {
    error.value =
      err?.response?.data?.message || err?.message || fallback || "Unexpected error";
  };

  // --- Actions ---
  const fetchWishlist = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getWishlist();
      wishlistItems.value = res.data.wishlist || [];
    } catch (err) {
      setError(err, "Failed to fetch wishlist");
    } finally {
      loading.value = false;
    }
  };

  const addToWishlist = async (productID) => {
    error.value = null;

    const existing = wishlistItems.value.find((i) => i.productID === productID);
    if (existing) {
      return;
    }

    // Optimistic UI update
    wishlistItems.value.push({ productID, productName: "Loading..." });

    try {
      await api.addToWishlist({ productID });
      await fetchWishlist(); // sync with server
    } catch (err) {
      setError(err, "Failed to add item to wishlist");
      await fetchWishlist(); // rollback
    }
  };

  const removeFromWishlist = async (productID) => {
    error.value = null;

    // Optimistic remove
    const index = wishlistItems.value.findIndex((i) => i.productID === productID);
    const removed = index >= 0 ? wishlistItems.value.splice(index, 1)[0] : null;

    try {
      await api.removeFromWishlist(productID);
    } catch (err) {
      setError(err, "Failed to remove item from wishlist");
      if (removed) wishlistItems.value.push(removed); // rollback
      await fetchWishlist();
    }
  };

  // --- Getters ---
  const wishlistCount = computed(() => wishlistItems.value.length);
  const isInWishlist = (productID) =>
    computed(() => wishlistItems.value.some((item) => item.productID === productID));

  return {
    // state
    wishlistItems,
    loading,
    error,
    // actions
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    // getters
    wishlistCount,
    isInWishlist,
  };
});
