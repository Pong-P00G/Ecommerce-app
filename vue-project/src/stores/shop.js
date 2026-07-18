import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartAPI } from '../api/cartApi.js'

export const useShopStore = defineStore('shop', () => {
    const cart = ref([]) // {id, title, price, qty, variant, image}
    const wishlist = ref([]) // array of product id
    const cartSynced = ref(false)

    const cartOpen = ref(false)
    const cartTotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))
    const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))

    function openCart() { cartOpen.value = true }
    function closeCart() { cartOpen.value = false }
    function toggleCart() { cartOpen.value = !cartOpen.value }

    function addToCart(item) {
        const idx = cart.value.findIndex(i =>
            i.id === item.id && JSON.stringify(i.variant) === JSON.stringify(item.variant)
        )
        if (idx !== -1) {
            cart.value[idx].qty += item.qty
        } else {
            cart.value.push({ ...item })
        }
        // Persist to localStorage
        persistCart()
    }

    function removeFromCart(index) {
        cart.value.splice(index, 1)
        persistCart()
    }

    function updateQuantity(index, qty) {
        if (qty <= 0) {
            removeFromCart(index)
        } else {
            cart.value[index].qty = qty
            persistCart()
        }
    }

    function clearCart() {
        cart.value = []
        persistCart()
    }

    function toggleWishlist(id) {
        const i = wishlist.value.indexOf(id)
        if (i === -1) wishlist.value.push(id)
        else wishlist.value.splice(i, 1)
        persistWishlist()
    }

    function inWishlist(id) {
        return wishlist.value.includes(id)
    }

    // ── Persistence ────────────────────────────────────────────

    const CART_KEY = 'alie_cart_v1'
    const WISHLIST_KEY = 'alie_wishlist_v1'

    function persistCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart.value))
        } catch { /* ignore */ }
    }

    function persistWishlist() {
        try {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist.value))
        } catch { /* ignore */ }
    }

    function loadPersisted() {
        try {
            const raw = localStorage.getItem(CART_KEY)
            if (raw) cart.value = JSON.parse(raw)
            const wRaw = localStorage.getItem(WISHLIST_KEY)
            if (wRaw) wishlist.value = JSON.parse(wRaw)
        } catch { /* ignore */ }
    }

    // ── Backend sync ───────────────────────────────────────────

    /**
     * Sync the local cart to the backend. Called during checkout.
     * Clears the backend cart, then bulk-adds all local items in parallel.
     */
    async function syncCartToBackend() {
        try {
            // Clear backend cart first
            await cartAPI.clearCart()
            // Add all items in parallel for efficiency
            await Promise.all(cart.value.map(item =>
                cartAPI.addItem({
                    product_id: item.id,
                    variant_id: item.variantId || null,
                    quantity: item.qty
                })
            ))
            cartSynced.value = true
        } catch (err) {
            console.error('Failed to sync cart to backend:', err)
            cartSynced.value = false
            throw err
        }
    }

    // Load persisted cart on init
    loadPersisted()

    return {
        cart, wishlist, cartOpen, cartSynced,
        cartTotal, cartCount,
        openCart, closeCart, toggleCart,
        addToCart, removeFromCart, updateQuantity, clearCart,
        toggleWishlist, inWishlist,
        syncCartToBackend, loadPersisted
    }
})
