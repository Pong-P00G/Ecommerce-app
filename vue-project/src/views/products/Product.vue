<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '../../stores/product.js';
import { storeToRefs } from 'pinia';
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronLeft,
    ChevronRight,
    PackageOpen,
    AlertTriangle,
    Heart,
    ArrowRight,
    Sparkles,
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const { products, loading, error, categories } = storeToRefs(productStore);

// Local state
const searchQuery = ref('');
const selectedCategory = ref(null);
const selectedSort = ref('featured');
const priceRange = ref([0, 1000]);
const showFilters = ref(false);

// Pagination
const currentPage = ref(1);
const pageSize = ref(12);

// Sort options
const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' }
];

// Computed
const filteredProducts = computed(() => {
    let result = products.value || [];

    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase();
        result = result.filter(p =>
            p.product_name?.toLowerCase().includes(search) ||
            p.category_name?.toLowerCase().includes(search)
        );
    }

    if (selectedCategory.value) {
        result = result.filter(p => p.category_name === selectedCategory.value);
    }

    result = result.filter(p => {
        const price = parseFloat(p.final_price || 0);
        return price >= priceRange.value[0] && price <= priceRange.value[1];
    });

    result = result.filter(p => p.product_status === 'active');

    return result;
});

const sortedProducts = computed(() => {
    let result = [...filteredProducts.value];

    switch (selectedSort.value) {
        case 'newest':
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'price-low':
            result.sort((a, b) => parseFloat(a.final_price) - parseFloat(b.final_price));
            break;
        case 'price-high':
            result.sort((a, b) => parseFloat(b.final_price) - parseFloat(a.final_price));
            break;
        case 'name-asc':
            result.sort((a, b) => a.product_name.localeCompare(b.product_name));
            break;
        case 'name-desc':
            result.sort((a, b) => b.product_name.localeCompare(a.product_name));
            break;
    }

    return result;
});

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedProducts.value.slice(start, end);
});

const totalItems = computed(() => sortedProducts.value?.length || 0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1);
const hasProducts = computed(() => paginatedProducts.value?.length > 0);

const startIndex = computed(() => {
    if (totalItems.value === 0) return 0;
    return (currentPage.value - 1) * pageSize.value + 1;
});

const endIndex = computed(() => {
    if (totalItems.value === 0) return 0;
    return Math.min(currentPage.value * pageSize.value, totalItems.value);
});

const hasActiveFilters = computed(() => {
    return searchQuery.value ||
        selectedCategory.value ||
        priceRange.value[0] > 0 ||
        priceRange.value[1] < 1000;
});

const visiblePages = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
        if (start === 1) {
            end = Math.min(total, start + 4);
        } else {
            start = Math.max(1, end - 4);
        }
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// Methods
const loadProducts = async () => {
    await productStore.fetchAllProducts();
    await productStore.fetchCategories();
};

const handleSearch = () => {
    currentPage.value = 1;
};

const selectCategory = (categoryName) => {
    selectedCategory.value = categoryName;
    currentPage.value = 1;
    showFilters.value = false;
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = null;
    priceRange.value = [0, 1000];
    currentPage.value = 1;
};

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const viewProduct = (productId) => {
    router.push(`/product/${productId}`);
};

const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

const getDiscountPercentage = (product) => {
    if (!product.discount_amount) return 0;
    const discount = parseFloat(product.discount_amount);
    const basePrice = parseFloat(product.base_price);
    return Math.round((discount / basePrice) * 100);
};

const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f4f4f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%23a1a1aa"%3ENo Image%3C/text%3E%3C/svg%3E';
};

watch(() => route.query.category, (newCategory) => {
    if (newCategory) {
        selectedCategory.value = newCategory;
    }
}, { immediate: true });

onMounted(async () => {
    await loadProducts();
});
</script>

<template>
    <div class="bg-paper min-h-screen">
        <!-- Hero Section -->
        <section class="bg-ink text-paper">
            <div class="section py-16 md:py-20">
                <div class="max-w-3xl">
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-5">
                        <Sparkles class="w-3.5 h-3.5" />
                        Curated for you
                    </span>
                    <h1 class="heading-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5">
                        Shop our
                        <span class="text-accent">collection</span>
                    </h1>
                    <p class="text-neutral-400 text-lg max-w-xl leading-relaxed">
                        Discover premium products curated for the modern lifestyle. Quality you can feel, design you can see.
                    </p>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <div class="section py-10 md:py-14">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Filters (Desktop) -->
                <aside class="hidden lg:block w-64 shrink-0">
                    <div class="card-flat p-5 sm:p-6 sticky top-8 space-y-6 sm:space-y-7">
                        <!-- Search -->
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Search</label>
                            <div class="relative">
                                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                <input
                                    v-model="searchQuery"
                                    @input="handleSearch"
                                    type="text"
                                    placeholder="Search products..."
                                    class="input-base pl-11 py-2.5 text-sm"
                                />
                            </div>
                        </div>

                        <!-- Categories -->
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Categories</h3>
                            <div class="space-y-1.5">
                                <button
                                    @click="selectCategory(null)"
                                    :class="[
                                        'w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                                        !selectedCategory
                                            ? 'bg-ink text-paper'
                                            : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                                    ]"
                                >
                                    All Products
                                </button>
                                <button
                                    v-for="category in categories"
                                    :key="category.category_id"
                                    @click="selectCategory(category.name)"
                                    :class="[
                                        'w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                                        selectedCategory === category.name
                                            ? 'bg-ink text-paper'
                                            : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                                    ]"
                                >
                                    {{ category.name }}
                                </button>
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Price Range</h3>
                            <div class="space-y-3">
                                <input
                                    v-model.number="priceRange[0]"
                                    @change="currentPage = 1"
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    class="w-full accent-accent"
                                />
                                <input
                                    v-model.number="priceRange[1]"
                                    @change="currentPage = 1"
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    class="w-full accent-accent"
                                />
                                <div class="flex justify-between text-xs text-neutral-600 tabular-nums">
                                    <span>{{ '$' }}{{ priceRange[0] }}</span>
                                    <span>{{ '$' }}{{ priceRange[1] }}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            v-if="hasActiveFilters"
                            @click="clearFilters"
                            class="w-full py-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 hover:text-accent transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                </aside>

                <!-- Main Products Area -->
                <div class="flex-1 min-w-0">
                    <!-- Mobile Filter Button -->
                    <div class="lg:hidden mb-5">
                        <button
                            @click="showFilters = !showFilters"
                            class="w-full py-3 card-flat text-ink font-semibold text-sm flex items-center justify-center gap-2 hover:border-ink"
                        >
                            <SlidersHorizontal class="h-4 w-4" />
                            Filters
                        </button>
                    </div>

                    <!-- Toolbar -->
                    <div class="card-flat p-3 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div class="text-sm text-neutral-600">
                            Showing <span class="font-bold text-ink tabular-nums">{{ startIndex }}-{{ endIndex }}</span>
                            of <span class="font-bold text-ink tabular-nums">{{ totalItems }}</span> products
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-neutral-600">Sort by:</label>
                            <select v-model="selectedSort" class="input-base py-2 text-sm w-auto">
                                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex items-center justify-center py-20">
                        <div class="text-center">
                            <div class="w-12 h-12 border-4 border-neutral-200 border-t-accent rounded-full animate-spin mb-4 mx-auto"></div>
                            <p class="text-neutral-500 text-sm">Loading products...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="text-center py-20">
                        <AlertTriangle class="mx-auto h-12 w-12 text-accent mb-4" :stroke-width="1.5" />
                        <p class="text-neutral-700 font-medium mb-4">{{ error }}</p>
                        <button @click="loadProducts" class="btn-primary">
                            Try again
                        </button>
                    </div>

                    <!-- Products Grid -->
                    <div v-else-if="hasProducts">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                            <article
                                v-for="product in paginatedProducts"
                                :key="product.product_id"
                                @click="viewProduct(product.product_id)"
                                class="card-base overflow-hidden cursor-pointer group"
                            >
                                <div class="relative aspect-square bg-neutral-100 overflow-hidden">
                                    <div v-if="product.discount_amount > 0" class="absolute top-3 left-3 z-10">
                                        <span class="badge-accent">-{{ getDiscountPercentage(product) }}%</span>
                                    </div>
                                    <button
                                        @click.stop
                                        class="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-paper shadow-sm hover:bg-accent hover:text-white text-neutral-700 inline-flex items-center justify-center transition-all duration-200"
                                    >
                                        <Heart class="w-4 h-4" />
                                    </button>
                                    <img
                                        :src="product.main_image"
                                        :alt="product.product_name"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        @error="handleImageError"
                                    />
                                </div>
                                <div class="p-4 sm:p-5 space-y-2 sm:space-y-2.5">
                                    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                                        {{ product.category_name || 'Uncategorized' }}
                                    </p>
                                    <h3 class="text-base font-bold text-ink line-clamp-2 group-hover:text-accent transition-colors">
                                        {{ product.product_name }}
                                    </h3>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-xl font-bold text-ink tabular-nums">
                                            {{ '$' }}{{ formatPrice(product.final_price) }}
                                        </span>
                                        <span v-if="product.discount_amount > 0" class="text-sm text-neutral-400 line-through tabular-nums">
                                            {{ '$' }}{{ formatPrice(product.base_price) }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
                                        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                                            <span class="w-1.5 h-1.5 rounded-full bg-success pulse-dot"></span>
                                            {{ product.stock_status }}
                                        </span>
                                        <span class="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 group-hover:text-accent transition-colors">
                                            View
                                            <ArrowRight class="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <!-- Pagination -->
                        <div class="card-flat p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="flex items-center gap-2">
                                <button
                                    @click="goToPage(currentPage - 1)"
                                    :disabled="currentPage === 1"
                                    class="btn-icon disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft class="w-5 h-5" />
                                </button>
                                <div class="flex items-center gap-1.5">
                                    <button
                                        v-for="page in visiblePages"
                                        :key="page"
                                        @click="goToPage(page)"
                                        :class="[
                                            'min-w-10 h-10 rounded-full border text-sm font-bold transition-all',
                                            page === currentPage
                                                ? 'bg-ink text-paper border-ink'
                                                : 'bg-paper text-ink border-neutral-200 hover:border-ink'
                                        ]"
                                    >
                                        {{ page }}
                                    </button>
                                </div>
                                <button
                                    @click="goToPage(currentPage + 1)"
                                    :disabled="currentPage === totalPages"
                                    class="btn-icon disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent"
                                >
                                    <ChevronRight class="w-5 h-5" />
                                </button>
                            </div>
                            <div class="text-xs text-neutral-500 tabular-nums">
                                Page <span class="font-bold text-ink">{{ currentPage }}</span> of {{ totalPages }}
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="card-flat text-center py-20 px-6">
                        <div class="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5">
                            <PackageOpen class="w-10 h-10 text-neutral-400" :stroke-width="1.5" />
                        </div>
                        <h3 class="font-elegant font-bold text-2xl text-ink mb-2">No products found</h3>
                        <p class="text-neutral-500 mb-6 max-w-md mx-auto">Try adjusting your filters or search terms to discover something new.</p>
                        <button @click="clearFilters" class="btn-accent shine-effect">
                            Clear filters
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Filters Modal -->
        <div
            v-if="showFilters"
            @click="showFilters = false"
            class="lg:hidden fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4"
        >
            <div
                @click.stop
                class="bg-paper rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
            >
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-ink">Filters</h3>
                    <button @click="showFilters = false" class="btn-icon">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="space-y-7">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Search</label>
                        <div class="relative">
                            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search products..."
                                class="input-base pl-11"
                            />
                        </div>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Categories</h4>
                        <div class="space-y-1.5">
                            <button
                                @click="selectCategory(null)"
                                :class="[
                                    'w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium',
                                    !selectedCategory ? 'bg-ink text-paper' : 'bg-neutral-50 text-neutral-700'
                                ]"
                            >
                                All Products
                            </button>
                            <button
                                v-for="category in categories"
                                :key="category.category_id"
                                @click="selectCategory(category.name)"
                                :class="[
                                    'w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium',
                                    selectedCategory === category.name ? 'bg-ink text-paper' : 'bg-neutral-50 text-neutral-700'
                                ]"
                            >
                                {{ category.name }}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-[0.2em] text-ink mb-3">Price Range</h4>
                        <div class="space-y-3">
                            <input v-model.number="priceRange[0]" type="range" min="0" max="1000" step="10" class="w-full accent-accent" />
                            <input v-model.number="priceRange[1]" type="range" min="0" max="1000" step="10" class="w-full accent-accent" />
                            <div class="flex justify-between text-sm text-neutral-600 tabular-nums">
                                <span>{{ '$' }}{{ priceRange[0] }}</span>
                                <span>{{ '$' }}{{ priceRange[1] }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button @click="clearFilters" class="btn-outline flex-1">Clear all</button>
                        <button @click="showFilters = false" class="btn-primary flex-1">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
