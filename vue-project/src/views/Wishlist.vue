<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const wishlistItems = ref([
    {
        id: 1,
        name: 'Premium Cotton Hoodie',
        price: 59.99,
        image: 'https://via.placeholder.com/300x300?text=Hoodie',
        inStock: true
    },
    {
        id: 2,
        name: 'Classic Denim Jacket',
        price: 89.99,
        image: 'https://via.placeholder.com/300x300?text=Jacket',
        inStock: true
    },
    {
        id: 3,
        name: 'Leather Wallet',
        price: 39.99,
        image: 'https://via.placeholder.com/300x300?text=Wallet',
        inStock: false
    }
])

const itemCount = computed(() => wishlistItems.value.length)

const removeItem = (id) => {
    wishlistItems.value = wishlistItems.value.filter(item => item.id !== id)
}

const moveToCart = (item) => {
    // Placeholder: integrate with cart store
    console.log('Moving to cart:', item)
    removeItem(item.id)
}

const clearWishlist = () => {
    wishlistItems.value = []
}

const continueShopping = () => {
    router.push('/product')
}
</script>

<template>
    <div class="min-h-screen bg-linear-to-br from-white via-gray-50 to-blue-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 mt-8 flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-bold bg-linear-to-r from-gray-900 via-pink-800 to-red-900 bg-clip-text text-transparent flex items-center gap-3">
                        <Heart class="w-10 h-10 text-red-500 fill-red-500" />
                        My Wishlist
                    </h1>
                    <p class="text-gray-600 mt-2">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} saved for later</p>
                </div>
                <button
                    v-if="itemCount > 0"
                    @click="clearWishlist"
                    class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Clear All
                </button>
            </div>

            <!-- Empty State -->
            <div v-if="itemCount === 0" class="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
                <div class="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center">
                    <Heart class="w-12 h-12 text-red-400" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p class="text-gray-600 mb-8">Save items you love to your wishlist and revisit them anytime.</p>
                <button
                    @click="continueShopping"
                    class="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300"
                >
                    <ArrowLeft class="w-5 h-5" />
                    Browse Products
                </button>
            </div>

            <!-- Wishlist Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div
                    v-for="item in wishlistItems"
                    :key="item.id"
                    class="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                    <!-- Product Image -->
                    <div class="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                            :src="item.image"
                            :alt="item.name"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                            @click="removeItem(item.id)"
                            class="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                            aria-label="Remove from wishlist"
                        >
                            <Trash2 class="w-5 h-5" />
                        </button>
                        <span
                            v-if="!item.inStock"
                            class="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
                        >
                            Out of Stock
                        </span>
                    </div>

                    <!-- Product Info -->
                    <div class="p-5">
                        <h3 class="font-bold text-gray-900 mb-2 line-clamp-1">{{ item.name }}</h3>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${{ item.price.toFixed(2) }}
                            </span>
                        </div>
                        <button
                            @click="moveToCart(item)"
                            :disabled="!item.inStock"
                            :class="{
                                'opacity-50 cursor-not-allowed': !item.inStock
                            }"
                            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:hover:shadow-none"
                        >
                            <ShoppingCart class="w-5 h-5" />
                            {{ item.inStock ? 'Move to Cart' : 'Unavailable' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
