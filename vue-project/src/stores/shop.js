import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShopStore = defineStore('shop', () => {
    const cart = ref([]) // {id, title, price, qty, variant, image}
    const wishlist = ref([]) // array of product id

    function addToCart(item) {
        const idx = cart.value.findIndex(i =>
            i.id === item.id && JSON.stringify(i.variant) === JSON.stringify(item.variant)
        )
        if (idx !== -1) {
            cart.value[idx].qty += item.qty
        } else {
            cart.value.push({ ...item })
        }
    }

    function removeFromCart(index) {
        cart.value.splice(index, 1)
    }

    function clearCart() {
        cart.value = []
    }

    function toggleWishlist(id) {
        const i = wishlist.value.indexOf(id)
        if (i === -1) wishlist.value.push(id)
        else wishlist.value.splice(i, 1)
    }

    function inWishlist(id) {
        return wishlist.value.includes(id)
    }

    return {
        cart, wishlist,
        addToCart, removeFromCart, clearCart,
        toggleWishlist, inWishlist
    }
})
