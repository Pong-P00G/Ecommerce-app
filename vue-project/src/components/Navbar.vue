<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { icons, ShoppingBagIcon, ShoppingCart } from 'lucide-vue-next';
import Icons from '../assets/icons/icons.vue';
import '../assets/navbar.css';
// import * as  User  from '../views/UserProfile.vue'

const route = useRoute();

const isMenuOpen = ref(false);
const openDropdown = ref(null);
const dropdownTimeout = ref(null);
// const User = ref(false);


const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
    isMenuOpen.value = false;
    document.body.style.overflow = '';
};

const navLinks = ref([
    { to: '/', label: 'Home', icon: 'Home', ariaLabel: 'Go to Home' },
    { to: '/Allproduct', label: 'Product', icon: 'Box', ariaLabel: 'Browse our product' },
    { to: '/contact', label: 'Contact', icon: 'Phone', ariaLabel: 'Contact us' },
    { to: '/about', label: 'About', icon: 'Info', ariaLabel: 'Learn about us' },
]);

const isActiveRoute = computed(() => (linkTo) =>
    route.path === linkTo || route.path.startsWith(linkTo + '/')
);

const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
        if (isMenuOpen.value) closeMenu();
        openDropdown.value = null;
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = '';
    if (dropdownTimeout.value) clearTimeout(dropdownTimeout.value);
});
</script>

<template>
    <header class="sticky top-0 z-50 bg-white/30 backdrop-blur-2xl text-grya-900 shadow-lg" role="banner">
        <div class="flex justify-between items-center px-4 py-3 max-w-full mx-auto">
            <!-- Mobile Toggle -->
            <button @click="toggleMenu" class="md:hidden p-2 rounded-lg hover:bg-cyan-100" :aria-expanded="isMenuOpen"
                aria-controls="mobile-menu" aria-label="Toggle navigation menu">
                <Icons :name="isMenuOpen ? 'X' : 'Menu'" class="w-6 h-6" />
            </button>
            <!-- Logo -->
            <RouterLink to="/" class="text-2xl font-bold px-2 py-1 rounded-lg" aria-label="MyApp - Go to homepage">
                <span class="text-cyan-600">ALIE</span><span class="text-gray-800">SHOP</span>
            </RouterLink>
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex space-x-1" role="navigation" aria-label="Main navigation">
                <RouterLink v-for="link in navLinks" :key="link.label" :to="link.to"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-100 transition-colors duration-200"
                    :class="{ 'bg-cyan-200': isActiveRoute(link.to) }" :aria-label="link.ariaLabel">
                    <Icons :name="link.icon" class="w-5 h-5" />
                    <span class="text-sm font-medium">{{ link.label }}</span>
                </RouterLink>
            </nav>
            <div class="flex items-center gap-1">
                <!-- User Account -->
                <RouterLink to="/userprofile" class="p-2 rounded-lg hover:bg-cyan-100" aria-label="User account">
                    <Icons name="UserCircle" class="w-7 h-7" />
                </RouterLink>
                <!-- Cart -->
                <RouterLink to="/checkout" class="p-2 rounded-lg hover:bg-cyan-100 flex items-center justify-center"
                    aria-label="View shopping cart">
                    <Icons name="ShoppingCart" class="w-6 h-6" />
                </RouterLink>
            </div>
        </div>
        <!-- Mobile Menu Overlay -->
        <transition name="overlay">
            <div v-if="isMenuOpen" class="fixed inset-0 bg-black/60 md:hidden" @click="closeMenu" aria-hidden="true">
            </div>
        </transition>
        <!-- Mobile Sidebar -->
        <transition name="slide">
            <aside v-if="isMenuOpen" id="mobile-menu"
                class="fixed top-0 left-0 w-80 h-full bg-linear-to-br from-[#dcf1ff] to-[#d0ebff] text-grya-900 z-50 shadow-xl overflow-y-auto md:hidden"
                aria-label="Mobile navigation" role="region">
                <div class="flex justify-between items-center p-4">
                    <h2 class="text-xl font-semibold">Navigation</h2>
                    <button @click="closeMenu" class="p-2 rounded-lg hover:bg-cyan-100 focus:ring-2 focus:ring-cyan-500"
                        aria-label="Close navigation menu">
                        <Icons name="X" class="w-6 h-6" />
                    </button>
                </div>
                <nav class="p-4">
                    <ul class="space-y-2">
                        <template v-for="link in navLinks">
                            <li v-if="link.children" :key="link.label">
                                <transition name="slide-fade">
                                    <ul v-show="openDropdown === link.label" class="ml-6 mt-2 space-y-1">
                                        <li v-for="child in link.children" :key="child.to">
                                            <RouterLink :to="child.to"
                                                class="flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
                                                @click="closeMenu"
                                                :aria-label="child.ariaLabel || `Go to ${child.label}`">
                                                <Icons :name="child.icon" class="w-4 h-4" />
                                                {{ child.label }}
                                            </RouterLink>
                                        </li>
                                    </ul>
                                </transition>
                            </li>
                            <li v-else :key="link.label + '-single'">
                                <RouterLink :to="link.to"
                                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-100 transition-colors duration-200"
                                    :class="{ 'bg-cyan-200': isActiveRoute(link.to) }" @click="closeMenu"
                                    :aria-label="link.ariaLabel">
                                    <Icons :name="link.icon" class="w-5 h-5" />
                                    <span class="text-sm font-medium">{{ link.label }}</span>
                                </RouterLink>
                            </li>
                        </template>
                    </ul>
                </nav>
            </aside>
        </transition>
    </header>
</template>
