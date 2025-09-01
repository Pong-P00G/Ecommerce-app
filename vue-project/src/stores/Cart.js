import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

// Debounce helper
function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const setError = (err, fallback) => {
    error.value =
      err?.response?.data?.message || err?.message || fallback || "Unexpected error";
  };

  // --- Actions ---
  const fetchCart = async (userID) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`/api/cart/${userID}`);
      cartItems.value = res.data.cart || [];
    } catch (err) {
      setError(err, "Failed to fetch cart");
    } finally {
      loading.value = false;
    }
  };

  const addToCart = debounce(async (userID, productID, quantity = 1, maxStock = Infinity) => {
    error.value = null;

    const existing = cartItems.value.find((i) => i.productID === productID);
    const newQuantity = (existing?.quantity || 0) + quantity;

    if (newQuantity > maxStock) {
      error.value = `Cannot add more than ${maxStock} items`;
      return;
    }

    // Optimistic UI update
    if (existing) {
      existing.quantity = newQuantity;
    } else {
      cartItems.value.push({
        productID,
        productName: "Loading...",
        productPrice: 0,
        quantity,
      });
    }

    try {
      await axios.post("/api/cart/add", { userID, productID, quantity });
      await fetchCart(userID); // sync with server
    } catch (err) {
      setError(err, "Failed to add item");
      await fetchCart(userID); // rollback
    }
  }, 200);

  const updateCartItem = async (userID, productID, quantity, maxStock = Infinity) => {
    error.value = null;

    if (quantity > maxStock) {
      error.value = `Cannot exceed stock: ${maxStock}`;
      return;
    }

    const existing = cartItems.value.find((i) => i.productID === productID);
    if (existing) {
      existing.quantity = quantity; // optimistic
    }

    try {
      await axios.put("/api/cart/update", { userID, productID, quantity });
      await fetchCart(userID);
    } catch (err) {
      setError(err, "Failed to update item");
      await fetchCart(userID);
    }
  };

  const removeCartItem = async (userID, productID) => {
    error.value = null;

    // Optimistic remove
    const index = cartItems.value.findIndex((i) => i.productID === productID);
    const removed = index >= 0 ? cartItems.value.splice(index, 1)[0] : null;

    try {
      await axios.delete("/api/cart/remove", { data: { userID, productID } });
    } catch (err) {
      setError(err, "Failed to remove item");
      if (removed) cartItems.value.push(removed); // rollback
      await fetchCart(userID);
    }
  };

  const clearCart = async (userID) => {
    error.value = null;
    const backup = [...cartItems.value];
    cartItems.value = []; // optimistic

    try {
      await axios.delete("/api/cart/clear", { data: { userID } });
    } catch (err) {
      setError(err, "Failed to clear cart");
      cartItems.value = backup;
      await fetchCart(userID);
    }
  };

  // --- Getters ---
  const totalPrice = computed(() =>
    cartItems.value.reduce(
      (sum, item) => sum + (parseFloat(item.productPrice) * item.quantity || 0),
      0
    )
  );

  const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  );

  return {
    // state
    cartItems,
    loading,
    error,
    // actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    // getters
    totalPrice,
    cartCount,
  };
});
