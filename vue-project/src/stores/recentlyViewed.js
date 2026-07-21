import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const LS_KEY = 'alie_recently_viewed_v1'
const MAX_ITEMS = 12

function load() {
    try {
        const raw = localStorage.getItem(LS_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
    const items = ref(load())

    const hasItems = computed(() => items.value.length > 0)
    const count = computed(() => items.value.length)

    function add(product) {
        items.value = items.value.filter(i => i.id !== product.id)
        items.value.unshift({
            id: product.id,
            name: product.name || product.product_name,
            price: product.price || product.base_price,
            image: product.image || product.thumbnail,
            category: product.category || product.category_name,
            addedAt: Date.now(),
        })
        if (items.value.length > MAX_ITEMS) {
            items.value = items.value.slice(0, MAX_ITEMS)
        }
        persist()
    }

    function remove(productId) {
        items.value = items.value.filter(i => i.id !== productId)
        persist()
    }

    function clear() {
        items.value = []
        persist()
    }

    function persist() {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(items.value))
        } catch (e) { /* ignore */ }
    }

    return { items, hasItems, count, add, remove, clear }
})
