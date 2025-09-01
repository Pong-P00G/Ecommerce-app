import { storeToRefs } from "pinia";
import { useCartStore } from "../stores/Cart";

export function useCart() {
    const cartStore = useCartStore();
    const { cartItems, loading, error, totalPrice, cartCount } = storeToRefs(cartStore);

    return {
        // state & getters
        cartItems,
        loading,
        error,
        totalPrice,
        cartCount,

        // actions
        fetchCart: cartStore.fetchCart,
        addToCart: cartStore.addToCart,
        updateCartItem: cartStore.updateCartItem,
        removeCartItem: cartStore.removeCartItem,
        clearCart: cartStore.clearCart,
    };
}
