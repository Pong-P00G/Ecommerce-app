<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import '../assets/Navbar.css';
import { RouterLink, useRoute } from 'vue-router';
import { ShoppingCart, Search, User, Heart, Menu, MenuSquare } from 'lucide-vue-next';
import Icons from '../assets/icons/icons.vue';

const route = useRoute();
const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const scrolled = ref(false);
const cartCount = ref(''); // Example cart count

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
    { to: '/', label: 'Home', icon: 'Home', ariaLabel: 'Home' },
    { to: '/product', label: 'Product', icon: 'Box', ariaLabel: 'Browse Product' },
    { to: '/contact', label: 'Contact', icon: 'Phone', ariaLabel: 'Contact' },
    { to: '/about', label: 'About', icon: 'Info', ariaLabel: 'About' },
]);

const isActiveRoute = computed(() => (linkTo) =>
    route.path === linkTo || route.path.startsWith(linkTo + '/')
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
<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" :class="scrolled ? 'py-3' : 'py-5'" role="banner">
        <!-- Elegant Background -->
        <div class="absolute inset-0 transition-all duration-500"
            :class="scrolled ? 'bg-secondary/95 backdrop-blur-xl border-b border-neutral-300' : 'bg-secondary/80 backdrop-blur-md'">
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <!-- Logo Section -->
                <RouterLink to="/"
                    class="flex items-center gap-2 group transition-all duration-300 hover:opacity-80 z-10"
                    aria-label="AlieeShop Home">
                    <span class="text-2xl tracking-tight text-primary font-elegant font-semibold">
                        <span class="font-light">ALIE</span><span class="font-bold">SHOP</span>
                    </span>
                </RouterLink>
                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center bg-neutral-100 rounded-full px-1 py-1"
                    role="navigation" aria-label="Main navigation">
                    <RouterLink v-for="link in Navlinks" :key="link.label" :to="link.to"
                        class="relative px-6 py-2 rounded-full text-neutral-600 font-medium text-sm transition-all duration-300"
                        :class="isActiveRoute(link.to) ? 'bg-primary text-secondary' : 'hover:text-primary'"
                        :aria-label="link.ariaLabel">
                        <span>{{ link.label }}</span>
                    </RouterLink>
                </nav>
                <!-- Desktop Actions -->
                <div class="hidden lg:flex items-center gap-4">
                    <!-- Search Button -->
                    <button @click="toggleSearch"
                        class="p-3 rounded-full hover:bg-neutral-100 transition-all duration-300 text-neutral-600 hover:text-primary"
                        aria-label="Search">
                        <Search class="w-5 h-5" />
                    </button>
                    <!-- Wishlist Button -->
                    <RouterLink to="/wishlist"
                        class="p-3 rounded-full hover:bg-neutral-100 transition-all duration-300 text-neutral-600 hover:text-primary"
                        aria-label="Wishlist">
                        <Heart class="w-5 h-5" />
                    </RouterLink>
                    <!-- Cart Button -->
                    <RouterLink to="/checkout"
                        class="relative p-3 rounded-full hover:bg-neutral-100 transition-all duration-300 text-neutral-600 hover:text-primary"
                        aria-label="Checkout Cart">
                        <ShoppingCart class="w-5 h-5" />
                        <span v-if="cartCount > 0"
                            class="absolute top-1 right-1 w-5 h-5 bg-primary text-secondary text-[10px] font-bold rounded-full flex items-center justify-center">
                            {{ cartCount }}
                        </span>
                    </RouterLink>
                    <!-- Vertical Divider -->
                    <div class="w-px h-6 bg-neutral-300 mx-2"></div>
                    <!-- Login Button -->
                    <RouterLink to="/login"
                        class="ml-2 px-8 py-3 text-sm font-bold text-secondary bg-primary rounded-full hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2">
                        <User class="w-4 h-4" />
                        Sign In
                    </RouterLink>
                </div>
                <!-- Mobile Menu Button -->
                <button @click="toggleMenu"
                    class="lg:hidden p-3 rounded-full hover:bg-neutral-100 transition-all duration-300"
                    :aria-expanded="isMenuOpen" aria-controls="mobile-menu" aria-label="Toggle menu">
                    <Menu class="w-6 h-6 text-primary" />
                </button>
            </div>
            <!-- Search Bar (Desktop) -->
            <transition name="slide-fade">
                <div v-if="isSearchOpen" class="hidden lg:block px-4 sm:px-6 lg:px-8 pb-4 mt-4">
                    <div class="relative max-w-2xl mx-auto">
                        <input type="text" placeholder="Search products, categories, brands..."
                            class="w-full px-5 py-3 pl-12 pr-4 rounded-xl border border-neutral-300 focus:border-primary focus:outline-none transition-colors bg-secondary shadow-sm"
                            autofocus />
                        <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    </div>
                </div>
            </transition>
        </div>
        <!-- Mobile Menu -->
        <transition name="mobile-menu">
            <div v-if="isMenuOpen" id="mobile-menu" class="lg:hidden fixed inset-0 z-40" aria-label="Mobile navigation"
                role="region">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-primary/30 backdrop-blur-sm" @click="closeMenu" aria-hidden="true"></div>
                <!-- Sidebar -->
                <div class="absolute top-0 right-0 w-80 h-full bg-secondary shadow-2xl overflow-y-auto">
                    <!-- Header -->
                    <div class="flex justify-between items-center p-6 border-b border-neutral-200">
                        <div class="flex items-center gap-2">
                            <span class="text-xl font-elegant font-semibold text-primary">ALIE<span
                                    class="font-bold">SHOP</span></span>
                        </div>
                        <button @click="closeMenu" class="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                            aria-label="Close navigation menu">
                            <Icons name="X" class="w-6 h-6 text-primary" />
                        </button>
                    </div>
                    <!-- Mobile Search -->
                    <div class="p-6 border-b border-neutral-200">
                        <div class="relative">
                            <input type="text" placeholder="Search products..."
                                class="w-full px-4 py-3 pl-11 rounded-xl bg-neutral-100 border border-neutral-300 focus:border-primary focus:outline-none transition-all" />
                            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        </div>
                    </div>
                    <!-- Navigation Links -->
                    <nav class="p-6">
                        <ul class="space-y-2">
                            <li v-for="link in Navlinks" :key="link.label + '-mobile'">
                                <RouterLink :to="link.to"
                                    class="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                                    :class="isActiveRoute(link.to)
                                        ? 'bg-primary text-secondary'
                                        : 'text-neutral-600 hover:bg-neutral-100' " @click="closeMenu" :aria-label="link.ariaLabel">
                                    <div class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                        :class="isActiveRoute(link.to)
                                            ? 'bg-secondary/20'
                                            : 'bg-neutral-200'">
                                        <Icons :name="link.icon" class="w-5 h-5" />
                                    </div>
                                    <span class="font-medium">{{ link.label }}</span>
                                </RouterLink>
                            </li>
                        </ul>
                    </nav>
                    <!-- Mobile Actions -->
                    <div class="p-6 mt-auto space-y-4 border-t border-neutral-200">
                        <!-- Quick Actions -->
                        <div class="grid grid-cols-2 gap-3">
                            <RouterLink to="/wishlist" @click="closeMenu"
                                class="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors">
                                <Heart class="w-5 h-5 text-primary" />
                                <span
                                    class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Wishlist</span>
                            </RouterLink>
                            <RouterLink to="/checkout" @click="closeMenu"
                                class="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors relative">
                                <ShoppingCart class="w-5 h-5 text-primary" />
                                <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Cart</span>
                                <span v-if="cartCount > 0"
                                    class="absolute top-3 right-3 w-5 h-5 bg-primary text-secondary text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {{ cartCount }}
                                </span>
                            </RouterLink>
                        </div>
                        <!-- Login Button -->
                        <RouterLink to="/login" @click="closeMenu"
                            class="flex items-center justify-center gap-3 w-full px-6 py-4 text-sm font-bold text-secondary bg-primary rounded-xl hover:bg-neutral-800 transition-all duration-300">
                            <User class="w-5 h-5" />
                            Sign In / Join Now
                        </RouterLink>
                    </div>
                </div>
            </div>
        </transition>
    </header>
</template>