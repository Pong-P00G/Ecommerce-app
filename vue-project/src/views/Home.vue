<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import ProductCarousel from '../components/ProductCarousel.vue'
import HeroCarousel from '../components/HeroCarousel.vue'

// sample product data (replace with real API/source)
const rawProducts = [
    { id: 1, name: 'Aurora Tee', price: 29, category: 'Tops', tags: ['casual', 'cotton'], description: 'Soft breathable cotton tee', image: '/p1.jpg', badge: 'New' },
    { id: 2, name: 'Nimbus Hoodie', price: 59, category: 'Outerwear', tags: ['cozy', 'fleece'], description: 'Warm hoodie for everyday wear', image: '/p2.jpg', badge: 'Hot' },
    { id: 3, name: 'Voyager Pants', price: 69, category: 'Bottoms', tags: ['stretch', 'travel'], description: 'Comfortable stretch pants', image: '/p3.jpg', badge: 'Bestseller' },
    { id: 4, name: 'Lumen Cap', price: 19, category: 'Accessories', tags: ['sun', 'casual'], description: 'Lightweight cap', image: '/p4.jpg', badge: 'Popular' },
    { id: 5, name: 'Echo Socks', price: 9, category: 'Accessories', tags: ['comfort'], description: 'Everyday socks', image: '/p5.jpg', badge: '' },
    { id: 6, name: 'Haven Jacket', price: 129, category: 'Outerwear', tags: ['waterproof'], description: 'Weather-ready jacket', image: '/p6.jpg', badge: 'New' }
]

// reactive UI state
const filters = ref({ q: '', category: '', tag: '', minPrice: null, maxPrice: null, sort: 'new' })
const view = ref('grid')
const page = ref(1)
const perPage = ref(6)
const products = ref(rawProducts)
const categories = computed(() => [...new Set(products.value.map(p => p.category))])
const tags = computed(() => [...new Set(products.value.flatMap(p => p.tags))])

function toggleTag(t) {
    filters.value.tag = filters.value.tag === t ? '' : t
}

function resetFilters() {
    filters.value = { q: '', category: '', tag: '', minPrice: null, maxPrice: null, sort: 'new' }
    page.value = 1
}

const filtered = computed(() => {
    let list = products.value.slice()
    const f = filters.value
    if (f.q) {
        const q = f.q.toLowerCase()
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (f.category) list = list.filter(p => p.category === f.category)
    if (f.tag) list = list.filter(p => p.tags.includes(f.tag))
    if (f.minPrice != null) list = list.filter(p => p.price >= f.minPrice)
    if (f.maxPrice != null) list = list.filter(p => p.price <= f.maxPrice)
    if (f.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (f.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => b.id - a.id) // newest first by id

    return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paginated = computed(() => {
    const start = (page.value - 1) * perPage.value
    return filtered.value.slice(start, start + perPage.value)
})

function nextPage() { if (page.value < totalPages.value) page.value++ }
function prevPage() { if (page.value > 1) page.value-- }

function addToCart(p) {
    // placeholder: integrate with store / API
    alert(`Added ${p.name} to cart`)
}

function quickAdd(p) { addToCart(p) }

</script>


<template>
    <div class="min-h-screen bg-white">
        <!-- Hero Section-->
        <header class="relative overflow-hidden bg-gray-50">
            <HeroCarousel class="mb-6 mt-18" />
            <div class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div class="space-y-8">
                        <h1
                            class="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight">
                            Next‑gen Apparel & Essentials
                            <span class="block text-gray-600 font-light mt-2">Designed for life on the move.</span>
                        </h1>
                        <p class="text-lg text-gray-500 max-w-xl font-light leading-relaxed">
                            Hand-picked clothes, sustainable materials, and fast shipping. Explore trending
                            collections and snag exclusive deals — crafted to last and made to feel good.
                        </p>
                        <div class="flex items-center gap-4 mt-8">
                            <RouterLink to="/product"
                                class="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 group">
                                Shop All Collections
                                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </RouterLink>
                            <RouterLink to="/about"
                                class="px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-all duration-300">
                                Learn more →
                            </RouterLink>
                        </div>
                        <div class="mt-8 flex gap-3 flex-wrap">
                            <span
                                class="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700">Free
                                shipping over $50</span>
                            <span
                                class="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700">7‑day
                                returns</span>
                            <span
                                class="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700">Sustainably
                                sourced</span>
                        </div>
                    </div>
                    <!-- Hero visual / featured card -->
                    <div class="relative">
                        <div
                            class="rounded-3xl bg-white p-8 shadow-lg border border-gray-100 transform transition-transform hover:scale-102">
                            <div class="flex items-center gap-6">
                                <ProductCarousel :products="rawProducts" />
                            </div>
                        </div>
                        <!-- floating badges -->
                        <div class="absolute -right-6 -top-6 transform rotate-12">
                            <div class="px-4 py-2 bg-gray-900 text-white rounded-2xl shadow-lg text-sm font-bold">
                                Limited</div>
                        </div>
                        <div class="absolute -left-8 bottom-0 rotate-6">
                            <div
                                class="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-full shadow-md text-sm font-medium">
                                Bestseller</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main content: Filters + Products -->
        <main class="max-w-7xl mx-auto px-6 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filters column -->
                <aside class="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
                    <h4 class="text-xl font-bold text-gray-900 mb-6">Filters</h4>
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-3">Search</label>
                            <input v-model="filters.q" placeholder="Search products"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="c in ['All', ...categories]" :key="c"
                                    @click="filters.category = c === 'All' ? '' : c"
                                    :class="['px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300', filters.category === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900']">
                                    {{ c }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-3">Tags</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="t in tags" :key="t" @click="toggleTag(t)"
                                    :class="['px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300', filters.tag === t ? 'bg-gray-100 text-gray-900 border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900']">
                                    #{{ t }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
                            <div class="flex items-center gap-3">
                                <input type="number" v-model.number="filters.minPrice"
                                    class="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    placeholder="Min" />
                                <input type="number" v-model.number="filters.maxPrice"
                                    class="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    placeholder="Max" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-3">Sort By</label>
                            <select v-model="filters.sort"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white">
                                <option value="new">Newest</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                            </select>
                        </div>
                        <button @click="resetFilters"
                            class="w-full mt-4 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all duration-300">Reset
                            Filters</button>
                    </div>
                </aside>

                <!-- Products grid -->
                <section class="lg:col-span-3">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900">Showing <span class="text-gray-600">{{
                                    filtered.length }}</span> products</h2>
                            <p class="text-sm text-gray-500 font-medium mt-1">Hand-picked for you</p>
                        </div>
                        <div class="hidden sm:flex items-center gap-3">
                            <label class="text-sm font-semibold text-gray-700">View</label>
                            <button @click="view = 'grid'"
                                :class="view === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'"
                                class="px-4 py-2 rounded-lg font-medium transition-all duration-300">Grid</button>
                            <button @click="view = 'list'"
                                :class="view === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'"
                                class="px-4 py-2 rounded-lg font-medium transition-all duration-300">List</button>
                        </div>
                    </div>
                    <transition-group name="list" tag="div"
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <article v-for="p in paginated" :key="p.id"
                            class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                            <div class="relative">
                                <img :src="p.image" alt="" class="w-full h-56 object-cover rounded-xl" />
                                <div
                                    class="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {{ p.badge }}</div>
                                <div
                                    class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="quickAdd(p)"
                                        class="bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-900 hover:text-white transition-all duration-300">+</button>
                                </div>
                            </div>
                            <div class="mt-4 space-y-3">
                                <h3 class="font-bold text-lg text-gray-900">{{ p.name }}</h3>
                                <p class="text-sm text-gray-500 mt-1 line-clamp-2 font-medium">{{ p.description }}</p>
                                <div class="mt-3 flex items-center justify-between">
                                    <div class="text-2xl font-bold text-gray-900">${{ p.price }}</div>
                                    <div class="text-sm text-gray-500 font-medium">{{ p.category }}</div>
                                </div>
                                <div class="mt-3 flex items-center gap-2 flex-wrap">
                                    <span v-for="t in p.tags" :key="t"
                                        class="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">#{{
                                        t }}</span>
                                </div>
                                <div class="mt-4 flex gap-3">
                                    <RouterLink :to="`/product/${p.id}`"
                                        class="flex-1 text-center px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold transition-all duration-300">
                                        View</RouterLink>
                                    <button @click="addToCart(p)"
                                        class="px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white font-semibold transition-all duration-300">Add</button>
                                </div>
                            </div>
                        </article>
                    </transition-group>
                    <!-- pagination -->
                    <div class="mt-10 flex items-center justify-center gap-3">
                        <button @click="prevPage" :disabled="page === 1"
                            class="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">Prev</button>
                        <span class="px-6 py-3 font-semibold text-gray-700">Page {{ page }} / {{ totalPages }}</span>
                        <button @click="nextPage" :disabled="page === totalPages"
                            class="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">Next</button>
                    </div>
                </section>
            </div>
        </main>
        <!-- CTA Banner -->
        <section class="mt-16 bg-gray-50 border-y border-gray-100 py-20">
            <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 class="text-4xl font-black text-gray-900">Exclusive 20% off your first order</h3>
                    <p class="mt-3 text-lg text-gray-600 font-light">Use code <span
                            class="font-bold text-gray-900">WELCOME20</span> at checkout — limited time only.</p>
                </div>
                <div>
                    <RouterLink to="/checkout"
                        class="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 inline-block">
                        Redeem Offer</RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>