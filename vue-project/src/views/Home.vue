<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProductCarousel from '../components/ProductCarousel.vue'

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
    if (f.sort === 'price-asc') list.sort((a,b)=>a.price-b.price)
    else if (f.sort === 'price-desc') list.sort((a,b)=>b.price-a.price)
    else list.sort((a,b)=>b.id-a.id) // newest first by id

    return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paginated = computed(() => {
    const start = (page.value -1) * perPage.value
    return filtered.value.slice(start, start + perPage.value)
})

function nextPage(){ if(page.value < totalPages.value) page.value++ }
function prevPage(){ if(page.value >1) page.value-- }

function addToCart(p){
    // placeholder: integrate with store / API
    alert(`Added ${p.name} to cart`)
}

function quickAdd(p) { addToCart(p) }

</script>


<template>
    <div class="min-h-screen bg-linear-to-br from-[#f0f8ff] to-[#e6f6ff] text-gray-800">
        <!-- Hero Section-->
        <header class="relative overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div class="space-y-6">
                        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                            Next‑gen Apparel & Essentials
                            <span class="block text-blue-600">Designed for life on the move.</span>
                        </h1>
                        <p class="text-lg text-gray-600 max-w-xl">
                            Hand-picked clothes, sustainable materials, and fast shipping. Explore trending
                            collections and snag exclusive deals — crafted to last and made to feel good.
                        </p>
                        <div class="flex items-center gap-4 mt-6">
                            <RouterLink
                                to="/AllProduct"
                                class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg transform hover:scale-105 transition">
                                Shop All Collections
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </RouterLink>
                            <RouterLink to="/about" class="text-sm font-medium text-gray-700 hover:text-blue-700">
                                Learn more →
                            </RouterLink>
                        </div>
                        <div class="mt-8 flex gap-3 flex-wrap">
                            <span class="px-3 py-1 rounded-full bg-white/80 border border-white/50 text-sm">Free shipping over $50</span>
                            <span class="px-3 py-1 rounded-full bg-white/80 border border-white/50 text-sm">7‑day returns</span>
                            <span class="px-3 py-1 rounded-full bg-white/80 border border-white/50 text-sm">Sustainably sourced</span>
                        </div>
                    </div>
                    <!-- Hero visual / featured card -->
                    <div class="relative">
                        <div class="rounded-3xl bg-linear-to-br from-white to-blue-50 p-6 shadow-2xl transform transition-transform hover:scale-102">
                            <div class="flex items-center gap-6">
                                <ProductCarousel :products="rawProducts" />
                            </div>
                        </div>
                        <!-- floating badges -->
                        <div class="absolute -right-6 -top-6 transform rotate-16">
                            <div class="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md text-sm">Limited</div>
                        </div>
                        <!-- <div class="absolute -left-8 bottom-0 rotate-10">
                            <div class="px-3 py-2 bg-cyan-200 rounded-full shadow text-sm">Bestseller</div>
                        </div> -->
                    </div>
                </div>
            </div>
            <!-- animated diagonal wave -->
            <svg class="w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path d="M0,40 C200,120 400,0 720,40 C1040,80 1240,20 1440,60 L1440 120 L0 120 Z" fill="#e6f6ff" opacity="0.9"></path>
            </svg>
        </header>
        <!-- Main content: Filters + Products -->
        <main class="max-w-7xl mx-auto px-6 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filters column -->
                <aside class="lg:col-span-1 bg-white/60 backdrop-blur rounded-2xl p-6 shadow">
                    <h4 class="text-lg font-semibold">Filters</h4>
                    <div class="mt-4 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input v-model="filters.q" placeholder="Search products" class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <div class="flex flex-wrap gap-2">
                                <button
                                v-for="c in ['All', ...categories]"
                                :key="c"
                                @click="filters.category = c === 'All' ? '' : c"
                                :class="['px-3 py-1 rounded-full text-sm border', filters.category === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700']"
                                >
                                {{ c }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="t in tags" :key="t" @click="toggleTag(t)"
                                    :class="['px-3 py-1 rounded-full text-sm border', filters.tag === t ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700']">
                                    #{{ t }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <div class="flex items-center gap-3">
                                <input type="number" v-model.number="filters.minPrice" class="w-1/2 px-3 py-2 rounded-lg border" placeholder="Min" />
                                <input type="number" v-model.number="filters.maxPrice" class="w-1/2 px-3 py-2 rounded-lg border" placeholder="Max" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Sort</label>
                            <select v-model="filters.sort" class="w-full px-3 py-2 rounded-lg border">
                                <option value="new">Newest</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                            </select>
                        </div>
                        <button @click="resetFilters" class="w-full mt-4 px-4 py-2 rounded-lg bg-white border">Reset</button>
                    </div>
                </aside>
                <!-- Products grid -->
                <section class="lg:col-span-3">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold">Showing <span class="text-blue-600">{{ filtered.length }}</span> products</h2>
                            <p class="text-sm text-gray-500">Hand-picked for you</p>
                        </div>
                        <div class="hidden sm:flex items-center gap-3">
                            <label class="text-sm text-gray-600">View</label>
                            <button @click="view='grid'" :class="view==='grid'? 'bg-blue-600 text-white':'bg-white'" class="px-3 py-1 rounded">Grid</button>
                            <button @click="view='list'" :class="view==='list'? 'bg-blue-600 text-white':'bg-white'" class="px-3 py-1 rounded">List</button>
                        </div>
                    </div>
                    <transition-group name="list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <article v-for="p in paginated" :key="p.id" class="bg-white rounded-2xl shadow p-4 transform transition hover:-translate-y-2 hover:shadow-2xl group">
                            <div class="relative">
                                <img :src="p.image" alt="" class="w-full h-48 object-cover rounded-lg" />
                                <div class="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">{{ p.badge }}</div>
                                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="quickAdd(p)" class="bg-white border rounded-full p-2 shadow">+</button>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h3 class="font-semibold text-lg">{{ p.name }}</h3>
                                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ p.description }}</p>
                                <div class="mt-3 flex items-center justify-between">
                                    <div class="text-xl font-bold text-blue-600">${{ p.price }}</div>
                                    <div class="text-sm text-gray-500">{{ p.category }}</div>
                                </div>
                                <div class="mt-3 flex items-center gap-2 flex-wrap">
                                    <span v-for="t in p.tags" :key="t" class="text-xs px-2 py-1 bg-gray-100 rounded-full">#{{ t }}</span>
                                </div>
                                <div class="mt-4 flex gap-3">
                                    <RouterLink :to="`/product/${p.id}`" class="flex-1 text-center px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white">View</RouterLink>
                                    <button @click="addToCart(p)" class="px-4 py-2 rounded-lg border">Add</button>
                                </div>
                            </div>
                        </article>
                    </transition-group>
                    <!-- pagination -->
                    <div class="mt-8 flex items-center justify-center gap-3">
                        <button @click="prevPage" :disabled="page===1" class="px-3 py-1 rounded border">Prev</button>
                            <span class="px-3 py-1">Page {{ page }} / {{ totalPages }}</span>
                        <button @click="nextPage" :disabled="page===totalPages" class="px-3 py-1 rounded border">Next</button>
                    </div>
                </section>
            </div>
        </main>
        <!-- CTA Banner -->
        <section class="mt-12 bg-linear-to-r from-cyan-200 to-cyan-400 text-gray-900 py-12">
            <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 class="text-2xl font-bold">Exclusive 20% off your first order</h3>
                    <p class="mt-2 text-sm opacity-90">Use code <span class="font-semibold">WELCOME20</span> at checkout — limited time only.</p>
                </div>
                <div>
                    <RouterLink to="/checkout" class="px-6 py-3 bg-white text-blue-700 rounded-full font-semibold shadow">Redeem Offer</RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>