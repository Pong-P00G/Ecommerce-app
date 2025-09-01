<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ProductCart from '../views/cart/ProductCart.vue';
import Icons from '../assets/icons/icons.vue';
import '../assets/navbar.css';
import { icons, ShoppingBagIcon, ShoppingCart } from 'lucide-vue-next';

const route = useRoute();

const isMenuOpen = ref(false);
const openDropdown = ref(null);
const dropdownTimeout = ref(null);


const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
    isMenuOpen.value = false;
    openDropdown.value = null;
    document.body.style.overflow = '';
};

const toggleDropdown = (label) => {
    openDropdown.value = openDropdown.value === label ? null : label;
};

const handleDropdownEnter = (label) => {
    if (dropdownTimeout.value) clearTimeout(dropdownTimeout.value);
    openDropdown.value = label;
};

const handleDropdownLeave = () => {
    dropdownTimeout.value = setTimeout(() => {
        openDropdown.value = null;
    }, 150);
};

const handleDropdownKeydown = (event, label) => {
    if (event.key === 'Escape') {
        openDropdown.value = null;
    } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDropdown(label);
    }
};

const navLinks = ref([
    { to: '/', label: 'Home', icon: 'Home', ariaLabel: 'Go to Home' },
    {
        label: 'Shop',
        icon: 'Store',
        ariaLabel: 'Browse our store',
        children: [
            { to: '/Allproduct', label: 'All-Product', icon: 'Box' },
            { to: '/Shirt', label: 'Shirts', icon: 'Shirt' },
            { to: '/Accessorie', label: 'Accessories', icon: 'Watch' },
            { to: '/Pant', label: 'Pants', icon: 'Pants' },
            { to: '/Hoodie', label: 'Hoodie', icon: 'Jacket' }
        ]
    },
    { to: '/contact', label: 'Contact', icon: 'Phone', ariaLabel: 'Contact us' },
    { to: '/about', label: 'About', icon: 'Info', ariaLabel: 'Learn about us' },
    {to: '/setting', label: 'setting', icon: 'Settings', ariaLabel: 'Setting' }
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
    <header class="sticky top-0 z-50 bg-gray-900 text-white shadow-lg" role="banner">
        <div class="flex justify-between items-center px-4 py-3 max-w-full mx-auto">
            <!-- Mobile Toggle -->
            <button @click="toggleMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-800"
                :aria-expanded="isMenuOpen" aria-controls="mobile-menu" aria-label="Toggle navigation menu">
                <Icons :name="isMenuOpen ? 'X' : 'Menu'" class="w-6 h-6" />
            </button>
            <!-- Logo -->
            <RouterLink to="/" class="text-2xl font-bold px-2 py-1 rounded-lg" aria-label="MyApp - Go to homepage">
                MyApp
            </RouterLink>
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex space-x-1" role="navigation" aria-label="Main navigation">
                <section v-for="link in navLinks" :key="link.label">
                    <div v-if="link.children" class="relative"
                        @mouseenter="handleDropdownEnter(link.label)"
                        @mouseleave="handleDropdownLeave">
                        <button class="px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                            :aria-expanded="openDropdown === link.label"
                            :aria-label="link.ariaLabel"
                            @keydown="(e) => handleDropdownKeydown(e, link.label)">
                            <Icons :name="link.icon" class="w-5 h-5" />
                            {{ link.label }}
                            <Icons name="ChevronDown" class="w-4 h-4 transition-transform"
                                :class="{ 'rotate-180': openDropdown === link.label }" />
                        </button>
                        <!-- Dropdown -->
                        <transition name="dropdown" class="rounded-lg">
                            <div v-show="openDropdown === link.label"
                                class="absolute left-0 min-w-[200px] bg-gray-800 rounded-b-lg shadow-xl mt-2 py-2 z-20 border border-gray-700"
                                role="menu" :aria-label="`${link.label} submenu`">
                                <RouterLink v-for="child in link.children" :key="child.to" :to="child.to"
                                    class="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors"
                                    :class="{ 'bg-gray-700 text-white': isActiveRoute(child.to) }"
                                    :aria-label="child.ariaLabel || `Go to ${child.label}`"
                                    role="menuitem">
                                    <Icons :name="child.icon" class="w-4 h-4" />
                                    {{ child.label }}
                                </RouterLink>
                            </div>
                        </transition>
                    </div>
                    <!-- Regular Links -->
                    <RouterLink
                        v-else
                        :to="link.to"
                        class="px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 border-b-2 border-transparent hover:border-blue-400"
                        :class="{ 'bg-gray-800 border-blue-400': isActiveRoute(link.to) }"
                        :aria-label="link.ariaLabel">
                        <Icons :name="link.icon" class="w-5 h-5" />
                        {{ link.label }}
                    </RouterLink>
                </section>
            </nav>
            <div class="flex items-center gap-1">
                <!-- User Account -->
                <RouterLink to="/login" class="p-2 rounded-lg hover:bg-gray-800" aria-label="User account">
                    <Icons name="UserCircle2" class="w-7 h-7" />
                </RouterLink>
                <!-- Cart -->
                <RouterLink to="/checkout" 
                    class="p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
                    aria-label="View shopping cart">
                    <Icons name="ShoppingCart" class="w-6 h-6" />
                </RouterLink>
            </div>
        </div>
        <!-- Mobile Menu Overlay -->
        <transition name="overlay">
            <div v-if="isMenuOpen" class="fixed inset-0 bg-black/60 md:hidden" @click="closeMenu" aria-hidden="true"></div>
        </transition>
        <!-- Mobile Sidebar -->
        <transition name="slide">
            <aside v-if="isMenuOpen" id="mobile-menu" class="fixed top-0 left-0 w-80 h-full bg-gray-900 z-50 shadow-xl overflow-y-auto md:hidden"
                aria-label="Mobile navigation" role="region">
                <div class="flex justify-between items-center p-4">
                    <h2 class="text-xl font-semibold">Navigation</h2>
                    <button @click="closeMenu" class="p-2 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                        aria-label="Close navigation menu">
                        <Icons name="X" class="w-6 h-6" />
                    </button>
                </div>
                <nav class="p-4">
                    <ul class="space-y-2">
                        <template v-for="link in navLinks">
                            <li v-if="link.children" :key="link.label">
                                <button @click="toggleDropdown(link.label)"
                                    class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800"
                                    :aria-expanded="openDropdown === link.label"
                                    :aria-label="link.ariaLabel">
                                    <div class="flex items-center gap-3">
                                        <Icons :name="link.icon" class="w-5 h-5" />
                                        {{ link.label }}
                                    </div>
                                    <Icons name="ChevronDown" class="w-4 h-4 transition-transform"
                                        :class="{ 'rotate-180': openDropdown === link.label }" />
                                </button>
                                <transition name="slide-fade">
                                    <ul v-show="openDropdown === link.label" class="ml-6 mt-2 space-y-1">
                                        <li v-for="child in link.children" :key="child.to">
                                            <RouterLink :to="child.to"
                                                class="flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
                                                @click="closeMenu" :aria-label="child.ariaLabel || `Go to ${child.label}`">
                                                <Icons :name="child.icon" class="w-4 h-4" />
                                                {{ child.label }}
                                            </RouterLink>
                                        </li>
                                    </ul>
                                </transition>
                            </li>
                            <li v-else :key="link.label + '-single'">
                                <RouterLink :to="link.to"
                                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                                    :class="{ 'bg-gray-800': isActiveRoute(link.to) }"
                                    @click="closeMenu"
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
