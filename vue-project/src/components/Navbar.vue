<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
    ShoppingCart,
    Search,
    User,
    Heart,
    Menu,
    X,
    Home,
    Package,
    Phone,
    Info,
    Sparkles
} from 'lucide-vue-next';

const route = useRoute();
const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const scrolled = ref(false);
const cartCount = ref(3); // Demo cart count

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
    isMenuOpen.value = false;
    document.body.style.overflow = '';
};

const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value;
};

const Navlinks = ref([
    { to: '/', label: 'Home', icon: Home, ariaLabel: 'Home' },
    { to: '/product', label: 'Product', icon: Package, ariaLabel: 'Browse Product' },
    { to: '/contact', label: 'Contact', icon: Phone, ariaLabel: 'Contact' },
    { to: '/about', label: 'About', icon: Info, ariaLabel: 'About' },
]);

const isActiveRoute = computed(() => (linkTo) =>
    route.path === linkTo || (linkTo !== '/' && route.path.startsWith(linkTo + '/'))
);

const handleScroll = () => {
    scrolled.value = window.scrollY > 20;
};

const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
        if (isMenuOpen.value) closeMenu();
        if (isSearchOpen.value) isSearchOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscapeKey);
    window.removeEventListener('scroll', handleScroll);
    document.body.style.overflow = '';
});

watch(route, () => {
    closeMenu();
});
</script>

<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        :class="scrolled ? 'py-3' : 'py-5'"
        role="banner"
    >
        <!-- Background -->
        <div
            class="absolute inset-0 transition-all duration-500"
            :class="scrolled
                ? 'bg-paper/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm'
                : 'bg-paper/80 backdrop-blur-md'"
        ></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <!-- Logo -->
                <RouterLink
                    to="/"
                    class="flex items-center gap-2 group transition-all duration-300 hover:opacity-80 z-10"
                    aria-label="AlieeShop Home"
                >
                    <div class="relative">
                        <span class="text-2xl tracking-tight text-ink font-elegant">
                            <span class="font-light">ALIE</span><span class="font-bold">SHOP</span>
                        </span>
                        <span class="absolute -top-1 -right-2 w-1.5 h-1.5 bg-accent rounded-full pulse-dot"></span>
                    </div>
                </RouterLink>

                <!-- Desktop Navigation -->
                <nav
                    class="hidden lg:flex items-center bg-neutral-100 rounded-full p-1"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <RouterLink
                        v-for="link in Navlinks"
                        :key="link.label"
                        :to="link.to"
                        class="relative px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2"
                        :class="isActiveRoute(link.to)
                            ? 'bg-ink text-paper shadow-md'
                            : 'text-neutral-600 hover:text-ink hover:bg-paper'"
                        :aria-label="link.ariaLabel"
                    >
                        <component :is="link.icon" class="w-4 h-4" />
                        <span>{{ link.label }}</span>
                        <span
                            v-if="isActiveRoute(link.to)"
                            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                        ></span>
                    </RouterLink>
                </nav>

                <!-- Desktop Actions -->
                <div class="hidden lg:flex items-center gap-2">
                    <button
                        @click="toggleSearch"
                        class="w-10 h-10 rounded-full hover:bg-neutral-100 transition-all duration-300 text-ink flex items-center justify-center"
                        aria-label="Search"
                    >
                        <Search class="w-5 h-5" />
                    </button>

                    <RouterLink
                        to="/wishlist"
                        class="w-10 h-10 rounded-full hover:bg-neutral-100 transition-all duration-300 text-ink flex items-center justify-center"
                        aria-label="Wishlist"
                    >
                        <Heart class="w-5 h-5" />
                    </RouterLink>

                    <RouterLink
                        to="/checkout"
                        class="relative w-10 h-10 rounded-full hover:bg-neutral-100 transition-all duration-300 text-ink flex items-center justify-center"
                        aria-label="Checkout Cart"
                    >
                        <ShoppingCart class="w-5 h-5" />
                        <span
                            v-if="cartCount > 0"
                            class="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-paper"
                        >
                            {{ cartCount }}
                        </span>
                    </RouterLink>

                    <div class="w-px h-6 bg-neutral-300 mx-2"></div>

                    <RouterLink
                        to="/login"
                        class="ml-1 inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-bold text-paper bg-ink rounded-full hover:bg-neutral-800 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <User class="w-4 h-4" />
                        Sign In
                    </RouterLink>
                </div>

                <!-- Mobile Menu Button -->
                <button
                    @click="toggleMenu"
                    class="lg:hidden w-10 h-10 rounded-full hover:bg-neutral-100 transition-all duration-300 flex items-center justify-center"
                    :aria-expanded="isMenuOpen"
                    aria-controls="mobile-menu"
                    aria-label="Toggle menu"
                >
                    <component :is="isMenuOpen ? X : Menu" class="w-6 h-6 text-ink" />
                </button>
            </div>

            <!-- Search Bar (Desktop) -->
            <transition name="slide-fade">
                <div v-if="isSearchOpen" class="hidden lg:block mt-4">
                    <div class="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search products, categories, brands..."
                            class="w-full px-5 py-3 pl-12 pr-28 rounded-xl border border-neutral-300 focus:border-ink focus:outline-none transition-all bg-paper shadow-sm"
                            autofocus
                        />
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <button
                            class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-600 transition-colors"
                        >
                            <Search class="w-3.5 h-3.5" />
                            Search
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Mobile Menu -->
        <transition name="mobile-menu">
            <div
                v-if="isMenuOpen"
                id="mobile-menu"
                class="lg:hidden fixed inset-0 z-40"
                aria-label="Mobile navigation"
                role="region"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                    @click="closeMenu"
                    aria-hidden="true"
                ></div>

                <!-- Sidebar -->
                <div class="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-paper shadow-2xl overflow-y-auto flex flex-col">
                    <!-- Header -->
                    <div class="flex justify-between items-center p-6 border-b border-neutral-200">
                        <div class="flex items-center gap-2">
                            <span class="text-xl font-elegant text-ink">
                                <span class="font-light">ALIE</span><span class="font-bold">SHOP</span>
                            </span>
                            <span class="w-1.5 h-1.5 bg-accent rounded-full pulse-dot"></span>
                        </div>
                        <button
                            @click="closeMenu"
                            class="w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors flex items-center justify-center"
                            aria-label="Close navigation menu"
                        >
                            <X class="w-5 h-5 text-ink" />
                        </button>
                    </div>

                    <!-- Welcome strip -->
                    <div class="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
                        <Sparkles class="w-4 h-4 text-accent" />
                        <p class="text-xs text-neutral-600 font-medium">
                            New arrivals this week — <span class="text-ink font-bold">up to 30% off</span>
                        </p>
                    </div>

                    <!-- Mobile Search -->
                    <div class="p-6 border-b border-neutral-200">
                        <div class="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                class="w-full px-4 py-3 pl-11 rounded-xl bg-neutral-100 border border-transparent focus:border-ink focus:bg-paper focus:outline-none transition-all"
                            />
                            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="p-6 flex-1">
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">Menu</p>
                        <ul class="space-y-1">
                            <li v-for="link in Navlinks" :key="link.label + '-mobile'">
                                <RouterLink
                                    :to="link.to"
                                    class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300"
                                    :class="isActiveRoute(link.to)
                                        ? 'bg-ink text-paper'
                                        : 'text-neutral-700 hover:bg-neutral-100'"
                                    @click="closeMenu"
                                    :aria-label="link.ariaLabel"
                                >
                                    <div
                                        class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                                        :class="isActiveRoute(link.to)
                                            ? 'bg-paper/15 text-paper'
                                            : 'bg-neutral-100 text-ink'"
                                    >
                                        <component :is="link.icon" class="w-4 h-4" />
                                    </div>
                                    <span class="font-medium flex-1">{{ link.label }}</span>
                                    <span
                                        v-if="isActiveRoute(link.to)"
                                        class="w-1.5 h-1.5 bg-accent rounded-full"
                                    ></span>
                                </RouterLink>
                            </li>
                        </ul>
                    </nav>

                    <!-- Mobile Actions -->
                    <div class="p-6 space-y-4 border-t border-neutral-200 bg-neutral-50">
                        <div class="grid grid-cols-2 gap-3">
                            <RouterLink
                                to="/wishlist"
                                @click="closeMenu"
                                class="flex items-center justify-center gap-2 p-3 rounded-xl bg-paper border border-neutral-200 hover:border-ink transition-colors"
                            >
                                <Heart class="w-4 h-4 text-ink" />
                                <span class="text-xs font-bold uppercase tracking-wider text-ink">Wishlist</span>
                            </RouterLink>
                            <RouterLink
                                to="/checkout"
                                @click="closeMenu"
                                class="relative flex items-center justify-center gap-2 p-3 rounded-xl bg-paper border border-neutral-200 hover:border-ink transition-colors"
                            >
                                <ShoppingCart class="w-4 h-4 text-ink" />
                                <span class="text-xs font-bold uppercase tracking-wider text-ink">Cart</span>
                                <span
                                    v-if="cartCount > 0"
                                    class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-paper"
                                >{{ cartCount }}</span>
                            </RouterLink>
                        </div>
                        <RouterLink
                            to="/login"
                            @click="closeMenu"
                            class="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-bold text-paper bg-ink rounded-xl hover:bg-neutral-800 transition-all duration-300"
                        >
                            <User class="w-4 h-4" />
                            Sign In / Join Now
                        </RouterLink>
                    </div>
                </div>
            </div>
        </transition>
    </header>
</template>

<style scoped>
header {
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
}
</style>
