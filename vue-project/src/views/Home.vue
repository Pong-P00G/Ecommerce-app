<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
    ArrowRight,
    Sparkles,
    Truck,
    ShieldCheck,
    RotateCcw,
    Headphones,
    Search,
    SlidersHorizontal,
    Grid3x3,
    List,
    Heart,
    Plus,
    Tag,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    X,
    Check,
    RefreshCw,
} from 'lucide-vue-next';
import { useToast } from '../composables/useToast.js';
import LazyImage from '../components/LazyImage.vue';
import ProductCarousel from '../components/ProductCarousel.vue';
import HeroCarousel from '../components/HeroCarousel.vue';

const toast = useToast();

const loadingProducts = ref(false);

const rawProducts = [
    { id: 1, name: 'Aurora Tee', price: 29, category: 'Tops', tags: ['casual', 'cotton'], description: 'Soft breathable cotton tee', image: '/p1.jpg', badge: 'New', href: '/product/1' },
    { id: 2, name: 'Nimbus Hoodie', price: 59, category: 'Outerwear', tags: ['cozy', 'fleece'], description: 'Warm hoodie for everyday wear', image: '/p2.jpg', badge: 'Hot', href: '/product/2' },
    { id: 3, name: 'Voyager Pants', price: 69, category: 'Bottoms', tags: ['stretch', 'travel'], description: 'Comfortable stretch pants', image: '/p3.jpg', badge: 'Bestseller', href: '/product/3' },
    { id: 4, name: 'Lumen Cap', price: 19, category: 'Accessories', tags: ['sun', 'casual'], description: 'Lightweight cap', image: '/p4.jpg', badge: 'Popular', href: '/product/4' },
    { id: 5, name: 'Echo Socks', price: 9, category: 'Accessories', tags: ['comfort'], description: 'Everyday socks', image: '/p5.jpg', badge: '', href: '/product/5' },
    { id: 6, name: 'Haven Jacket', price: 129, category: 'Outerwear', tags: ['waterproof'], description: 'Weather-ready jacket', image: '/p6.jpg', badge: 'New', href: '/product/6' },
    { id: 7, name: 'Sierra Boots', price: 149, category: 'Footwear', tags: ['leather', 'rugged'], description: 'Handcrafted leather boots', image: '/p7.jpg', badge: '', href: '/product/7' },
    { id: 8, name: 'Drift Backpack', price: 89, category: 'Accessories', tags: ['travel', 'canvas'], description: 'Roomy canvas backpack', image: '/p8.jpg', badge: 'Hot', href: '/product/8' },
    { id: 9, name: 'Mirage Sunglasses', price: 79, category: 'Accessories', tags: ['uv', 'unisex'], description: 'Polarised UV lenses', image: '/p9.jpg', badge: 'New', href: '/product/9' },
];

const filters = ref({ q: '', category: '', tag: '', minPrice: null, maxPrice: null, sort: 'new' });
const view = ref('grid');
const page = ref(1);
const perPage = ref(9);
const products = ref(rawProducts);
const showFilters = ref(false);

const categories = computed(() => [...new Set(products.value.map((p) => p.category))]);
const tags = computed(() => [...new Set(products.value.flatMap((p) => p.tags))]);

function toggleTag(t) {
    filters.value.tag = filters.value.tag === t ? '' : t;
}

function resetFilters() {
    filters.value = { q: '', category: '', tag: '', minPrice: null, maxPrice: null, sort: 'new' };
    page.value = 1;
}

const filtered = computed(() => {
    let list = products.value.slice();
    const f = filters.value;
    if (f.q) {
        const q = f.q.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (f.category) list = list.filter((p) => p.category === f.category);
    if (f.tag) list = list.filter((p) => p.tags.includes(f.tag));
    if (f.minPrice != null) list = list.filter((p) => p.price >= f.minPrice);
    if (f.maxPrice != null) list = list.filter((p) => p.price <= f.maxPrice);
    if (f.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (f.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.id - a.id);
    return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paginated = computed(() => {
    const start = (page.value - 1) * perPage.value;
    return filtered.value.slice(start, start + perPage.value);
});

function nextPage() {
    if (page.value < totalPages.value) page.value++;
}
function prevPage() {
    if (page.value > 1) page.value--;
}

function addToCart(p) {
    toast.success('"' + p.name + '" added to cart!');
}

const promises = [
    { icon: Truck, title: 'Free shipping', desc: 'On orders over ' + ('$') + '50' },
    { icon: RotateCcw, title: '7-day returns', desc: 'Hassle-free refunds' },
    { icon: ShieldCheck, title: 'Secure checkout', desc: '256-bit SSL encryption' },
    { icon: Headphones, title: '24/7 support', desc: 'Real humans, real help' },
];
</script>

<template>
    <div class="min-h-screen bg-paper">
        <!-- Hero Carousel -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <HeroCarousel />
        </section>

        <!-- Promise strip -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <div v-for="p in promises" :key="p.title" class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-paper border border-neutral-200 rounded-2xl hover:border-ink transition-colors group">
                    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <component :is="p.icon" class="w-4 h-4 text-ink group-hover:text-white transition-colors" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs sm:text-sm font-bold text-ink truncate">{{ p.title }}</p>
                        <p class="text-[10px] sm:text-xs text-neutral-500 truncate">{{ p.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured carousel -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
                        <Sparkles class="w-3.5 h-3.5" />
                        Hand-picked
                    </span>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-elegant font-bold text-ink">Featured this week</h2>
                </div>
                <RouterLink to="/product" class="hidden md:inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-accent transition-colors">
                    View all
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
            </div>
            <ProductCarousel :products="rawProducts.slice(0, 6)" />
        </section>

        <!-- Filters + Products -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4 flex-wrap">
                <div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
                        <Tag class="w-3.5 h-3.5" />
                        Catalog
                    </span>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-elegant font-bold text-ink">All products</h2>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        @click="showFilters = !showFilters"
                        class="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-paper text-sm font-bold rounded-full"
                    >
                        <SlidersHorizontal class="w-4 h-4" />
                        Filters
                    </button>
                    <div class="hidden sm:flex items-center bg-paper border border-neutral-200 rounded-full p-1">
                        <button
                            @click="view = 'grid'"
                            :class="view === 'grid' ? 'bg-ink text-paper' : 'text-ink hover:bg-neutral-100'"
                            class="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Grid view"
                        >
                            <Grid3x3 class="w-4 h-4" />
                        </button>
                        <button
                            @click="view = 'list'"
                            :class="view === 'list' ? 'bg-ink text-paper' : 'text-ink hover:bg-neutral-100'"
                            class="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                            aria-label="List view"
                        >
                            <List class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filters -->
                <aside
                    class="lg:col-span-1 bg-paper border border-neutral-200 rounded-2xl p-6 h-fit lg:sticky lg:top-24"
                    :class="showFilters ? 'block' : 'hidden lg:block'"
                >
                    <h4 class="text-sm font-bold uppercase tracking-[0.2em] text-ink mb-5 flex items-center gap-2">
                        <SlidersHorizontal class="w-4 h-4" />
                        Filters
                    </h4>
                    <div class="space-y-5">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Search</label>
                            <div class="relative">
                                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    v-model="filters.q"
                                    placeholder="Search products"
                                    class="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-ink focus:bg-paper focus:outline-none transition-all text-sm"
                                    aria-label="Search products"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Category</label>
                            <div class="flex flex-wrap gap-1.5">
                                <button
                                    v-for="c in ['All', ...categories]"
                                    :key="c"
                                    @click="filters.category = c === 'All' ? '' : c"
                                    :class="[
                                        'px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200',
                                        filters.category === c
                                            ? 'bg-ink text-paper border-ink'
                                            : 'bg-paper text-neutral-700 border-neutral-200 hover:border-ink'
                                    ]"
                                >
                                    {{ c }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Tags</label>
                            <div class="flex flex-wrap gap-1.5">
                                <button
                                    v-for="t in tags"
                                    :key="t"
                                    @click="toggleTag(t)"
                                    :class="[
                                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                                        filters.tag === t
                                            ? 'bg-accent text-white border-accent'
                                            : 'bg-paper text-neutral-700 border-neutral-200 hover:border-accent'
                                    ]"
                                >
                                    #{{ t }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Price range</label>
                            <div class="flex items-center gap-2">
                                <input type="number" v-model.number="filters.minPrice" class="w-1/2 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-ink focus:bg-paper focus:outline-none transition-all text-sm" placeholder="Min" aria-label="Minimum price" />
                                <span class="text-neutral-400">–</span>
                                <input type="number" v-model.number="filters.maxPrice" class="w-1/2 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-ink focus:bg-paper focus:outline-none transition-all text-sm" placeholder="Max" aria-label="Maximum price" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Sort by</label>
                            <select v-model="filters.sort" class="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-ink focus:bg-paper focus:outline-none transition-all text-sm" aria-label="Sort products by">
                                <option value="new">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                        <button @click="resetFilters" class="w-full mt-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-ink hover:text-paper text-ink text-sm font-bold transition-all">
                            Reset filters
                        </button>
                    </div>
                </aside>

                <!-- Grid -->
                <section class="lg:col-span-3">
                    <div class="mb-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="text-sm text-neutral-600">
                                Showing <span class="font-bold text-ink">{{ filtered.length }}</span> {{ filtered.length === 1 ? 'product' : 'products' }}
                            </p>
                            <button v-if="page < totalPages" @click="nextPage"
                                class="sm:hidden inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-600 transition-colors">
                                Next
                                <ChevronRight class="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <!-- Active filter badges -->
                        <div v-if="filters.category || filters.tag || filters.minPrice != null || filters.maxPrice != null || filters.q" class="flex flex-wrap items-center gap-1.5">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mr-0.5">Active:</span>
                            <span v-if="filters.q" class="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-ink">
                                "{{ filters.q }}"
                                <button @click="filters.q = ''; page = 1" class="hover:text-accent transition-colors"><X class="w-3 h-3" /></button>
                            </span>
                            <span v-if="filters.category" class="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-ink">
                                {{ filters.category }}
                                <button @click="filters.category = ''; page = 1" class="hover:text-accent transition-colors"><X class="w-3 h-3" /></button>
                            </span>
                            <span v-if="filters.tag" class="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full text-[10px] font-bold text-accent">
                                #{{ filters.tag }}
                                <button @click="filters.tag = ''; page = 1" class="hover:text-accent-600 transition-colors"><X class="w-3 h-3" /></button>
                            </span>
                            <span v-if="filters.minPrice != null || filters.maxPrice != null" class="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-ink">
                                ${{ filters.minPrice ?? '0' }}–${{ filters.maxPrice ?? '∞' }}
                                <button @click="filters.minPrice = null; filters.maxPrice = null; page = 1" class="hover:text-accent transition-colors"><X class="w-3 h-3" /></button>
                            </span>
                            <button @click="resetFilters" class="text-[10px] font-bold text-neutral-400 hover:text-accent underline underline-offset-2 transition-colors ml-1">Clear all</button>
                        </div>
                    </div>

                    <!-- Skeleton Loading -->
                    <div v-if="loadingProducts" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse">
                        <div v-for="i in 6" :key="'s-' + i" class="bg-paper border border-neutral-200 rounded-2xl overflow-hidden">
                            <div class="h-48 sm:h-56 bg-neutral-200"></div>
                            <div class="p-5 space-y-3">
                                <div class="h-3 w-16 bg-neutral-200 rounded"></div>
                                <div class="h-5 w-32 bg-neutral-200 rounded"></div>
                                <div class="h-3 w-48 bg-neutral-200 rounded"></div>
                                <div class="flex items-center justify-between pt-2">
                                    <div class="h-6 w-16 bg-neutral-200 rounded"></div>
                                    <div class="h-4 w-12 bg-neutral-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="filtered.length === 0" class="bg-paper border border-neutral-200 rounded-2xl p-12 sm:p-16 text-center">
                        <div class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search class="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 class="text-lg font-bold text-ink mb-1">No products match your filters</h3>
                        <p class="text-sm text-neutral-500 max-w-sm mx-auto">
                            Try adjusting your search, category, or price range to find what you're looking for.
                        </p>
                        <button @click="resetFilters"
                            class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper text-sm font-bold rounded-full hover:bg-neutral-800 transition-all duration-300">
                            <RefreshCw class="w-4 h-4" />
                            Reset all filters
                        </button>
                    </div>

                    <transition-group
                        v-else
                        name="list"
                        tag="div"
                        :class="view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'"
                    >
                        <!-- GRID CARD -->
                        <article
                            v-for="p in paginated"
                            :key="p.id"
                            v-show="view === 'grid'"
                            class="bg-paper border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_32px_-8px_rgb(0_0_0_/_0.12)] group/card"
                        >
                            <RouterLink :to="'/product/' + p.id" class="block">
                                <div class="relative h-48 sm:h-56 bg-neutral-100 overflow-hidden">
                                    <LazyImage :src="p.image" :alt="p.name" wrapper-class="w-full h-full" img-class="group-hover/card:scale-110" />
                                    <span v-if="p.badge" class="absolute top-3 left-3 badge-ink">{{ p.badge }}</span>
                                    <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 translate-y-1 group-hover/card:translate-y-0 transition-all duration-300">
                                        <button class="w-9 h-9 rounded-full bg-paper text-ink flex items-center justify-center hover:bg-accent hover:text-white transition-colors shadow-md" @click.prevent>
                                            <Heart class="w-4 h-4" />
                                        </button>
                                        <button class="w-9 h-9 rounded-full bg-paper text-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors shadow-md" @click.prevent="addToCart(p)">
                                            <Plus class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div class="p-5">
                                    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{{ p.category }}</p>
                                    <h3 class="font-bold text-lg text-ink mt-1 group-hover/card:text-accent transition-colors">{{ p.name }}</h3>
                                    <p class="text-sm text-neutral-500 mt-1 line-clamp-2">{{ p.description }}</p>
                                    <div class="mt-4 flex items-center justify-between">
                                        <span class="text-xl font-bold text-ink tabular-nums">{{ '$' }}{{ p.price }}</span>
                                        <span class="inline-flex items-center gap-1 text-xs font-bold text-ink group-hover/card:text-accent transition-colors">
                                            View
                                            <ArrowRight class="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </RouterLink>
                        </article>

                        <!-- LIST CARD -->
                        <article
                            v-for="p in paginated"
                            :key="'l-' + p.id"
                            v-show="view === 'list'"
                            class="bg-paper border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-ink group/list"
                        >
                            <RouterLink :to="'/product/' + p.id" class="flex flex-col sm:flex-row">
                                <div class="relative h-48 sm:h-auto sm:w-48 shrink-0 bg-neutral-100 overflow-hidden">
                                    <LazyImage :src="p.image" :alt="p.name" wrapper-class="w-full h-full" img-class="group-hover/list:scale-110" />
                                    <span v-if="p.badge" class="absolute top-2 left-2 badge-ink text-[10px]">{{ p.badge }}</span>
                                </div>
                                <div class="p-5 flex-1 flex flex-col">
                                    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{{ p.category }}</p>
                                    <h3 class="font-bold text-lg text-ink mt-1">{{ p.name }}</h3>
                                    <p class="text-sm text-neutral-500 mt-2 flex-1">{{ p.description }}</p>
                                    <div class="mt-4 flex items-center justify-between">
                                        <span class="text-xl font-bold text-ink tabular-nums">{{ '$' }}{{ p.price }}</span>
                                        <span class="inline-flex items-center gap-1 text-xs font-bold text-ink">
                                            View
                                            <ArrowRight class="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </RouterLink>
                        </article>
                    </transition-group>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-2">
                        <button
                            @click="prevPage"
                            :disabled="page === 1"
                            class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-ink hover:border-ink hover:bg-ink hover:text-paper transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-paper disabled:hover:text-ink"
                        >
                            <ChevronLeft class="w-4 h-4" />
                        </button>
                        <span class="px-4 text-sm font-bold text-ink tabular-nums">{{ page }} / {{ totalPages }}</span>
                        <button
                            @click="nextPage"
                            :disabled="page === totalPages"
                            class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-ink hover:border-ink hover:bg-ink hover:text-paper transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-paper disabled:hover:text-ink"
                        >
                            <ChevronRight class="w-4 h-4" />
                        </button>
                    </div>
                </section>
            </div>
        </section>

        <!-- CTA Banner -->
        <section class="mt-16 sm:mt-24 bg-ink overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
                <div class="space-y-6 text-paper">
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        <Sparkles class="w-4 h-4" />
                        Limited offer
                    </span>
                    <h3 class="text-3xl sm:text-4xl md:text-5xl font-elegant font-bold leading-tight">
                        Get <span class="italic text-accent">20% off</span> your first order.
                    </h3>
                    <p class="text-lg text-neutral-400 font-light max-w-md">
                        Use code <span class="font-bold text-paper px-2 py-1 bg-accent rounded-md ml-1">WELCOME20</span> at checkout — limited time only.
                    </p>
                    <div class="flex items-center gap-3 pt-2">
                        <RouterLink to="/checkout" class="btn-accent shine-effect">
                            Redeem Offer
                            <ArrowRight class="w-4 h-4" />
                        </RouterLink>
                        <RouterLink to="/product" class="btn-outline border-neutral-700 text-paper hover:bg-paper hover:text-ink">
                            Browse Shop
                        </RouterLink>
                    </div>
                </div>
                <div class="hidden lg:flex justify-end">
                    <div class="relative">
                        <div class="w-72 h-72 rounded-full bg-accent/20 blur-3xl absolute -top-10 -right-10"></div>
                        <div class="relative grid grid-cols-2 gap-3">
                            <div class="space-y-3 pt-12">
                                <div class="bg-paper rounded-2xl p-3 shadow-2xl">
                                    <div class="h-32 rounded-xl bg-neutral-100 overflow-hidden">
                                        <LazyImage :src="rawProducts[0].image" alt="" wrapper-class="w-full h-32" />
                                    </div>
                                    <p class="mt-2 text-xs font-bold text-ink truncate">{{ rawProducts[0].name }}</p>
                                    <p class="text-xs text-accent font-bold mt-1">{{ '$' }}{{ rawProducts[0].price }}</p>
                                </div>
                                <div class="bg-paper rounded-2xl p-3 shadow-2xl">
                                    <div class="h-32 rounded-xl bg-neutral-100 overflow-hidden">
                                        <LazyImage :src="rawProducts[2].image" alt="" wrapper-class="w-full h-32" />
                                    </div>
                                    <p class="mt-2 text-xs font-bold text-ink truncate">{{ rawProducts[2].name }}</p>
                                    <p class="text-xs text-accent font-bold mt-1">{{ '$' }}{{ rawProducts[2].price }}</p>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div class="bg-paper rounded-2xl p-3 shadow-2xl">
                                    <div class="h-32 rounded-xl bg-neutral-100 overflow-hidden">
                                        <LazyImage :src="rawProducts[1].image" alt="" wrapper-class="w-full h-32" />
                                    </div>
                                    <p class="mt-2 text-xs font-bold text-ink truncate">{{ rawProducts[1].name }}</p>
                                    <p class="text-xs text-accent font-bold mt-1">{{ '$' }}{{ rawProducts[1].price }}</p>
                                </div>
                                <div class="bg-paper rounded-2xl p-3 shadow-2xl">
                                    <div class="h-32 rounded-xl bg-neutral-100 overflow-hidden">
                                        <LazyImage :src="rawProducts[3].image" alt="" wrapper-class="w-full h-32" />
                                    </div>
                                    <p class="mt-2 text-xs font-bold text-ink truncate">{{ rawProducts[3].name }}</p>
                                    <p class="text-xs text-accent font-bold mt-1">{{ '$' }}{{ rawProducts[3].price }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* ── Product list transitions ──────────────────────────── */
.list-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.list-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
}
.list-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
}
.list-move {
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Quick add button pulse animation ──────────────────── */
@keyframes quick-add-pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.3); }
    100% { transform: scale(1); }
}
.quick-add-pop {
    animation: quick-add-pop 0.35s ease-out;
}
</style>
