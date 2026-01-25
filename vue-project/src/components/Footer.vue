<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    ArrowUp
} from 'lucide-vue-next';

const currentYear = new Date().getFullYear();

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const footerLinks = {
    shop: [
        { name: 'New Arrivals', to: '/product?filter=new' },
        { name: 'Best Sellers', to: '/product?filter=bestsellers' },
        { name: 'Sale', to: '/product?filter=sale' },
        { name: 'Gift Cards', to: '/gift-cards' },
    ],
    help: [
        { name: 'Track Order', to: '/track-order' },
        { name: 'Returns & Exchanges', to: '/returns' },
        { name: 'Shipping Info', to: '/shipping' },
        { name: 'FAQ', to: '/faq' },
    ],
    company: [
        { name: 'About Us', to: '/about' },
        { name: 'Contact', to: '/contact' },
        { name: 'Careers', to: '/careers' },
        { name: 'Press', to: '/press' },
    ],
};

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
];

</script>

<template>
    <footer class="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">

                <!-- Brand Section -->
                <div class="lg:col-span-4 space-y-10">
                    <RouterLink to="/" class="inline-block group">
                        <span class="text-3xl tracking-tight text-gray-900">
                            <span class="font-light">Aliee</span><span class="font-black italic">Shop</span>
                        </span>
                    </RouterLink>
                    <p class="text-gray-500 text-lg font-light leading-relaxed max-w-sm">
                        Curating a world of exceptional products for your modern lifestyle. Quality is our signature.
                    </p>
                    <!-- Social Media Links -->
                    <div class="flex gap-4">
                        <a v-for="social in socialLinks" :key="social.label" :href="social.href" target="_blank"
                            rel="noopener noreferrer" :aria-label="social.label"
                            class="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-300 hover:border-gray-900 hover:text-gray-900 hover:scale-110">
                            <component :is="social.icon" class="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <!-- Quick Links Sections -->
                <div class="lg:col-span-2">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Shop</h3>
                    <ul class="space-y-4">
                        <li v-for="link in footerLinks.shop" :key="link.name">
                            <RouterLink :to="link.to"
                                class="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium inline-block">
                                {{ link.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <div class="lg:col-span-2">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Help</h3>
                    <ul class="space-y-4">
                        <li v-for="link in footerLinks.help" :key="link.name">
                            <RouterLink :to="link.to"
                                class="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium inline-block">
                                {{ link.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <div class="lg:col-span-2">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Company</h3>
                    <ul class="space-y-4">
                        <li v-for="link in footerLinks.company" :key="link.name">
                            <RouterLink :to="link.to"
                                class="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium inline-block">
                                {{ link.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Contact Section -->
                <div class="lg:col-span-2">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Location</h3>
                    <div class="space-y-6">
                        <div class="flex gap-3">
                            <MapPin class="w-5 h-5 text-gray-400 shrink-0" />
                            <p class="text-sm text-gray-500 leading-relaxed font-medium">
                                123 Commerce St,<br />
                                Phnom Penh, KH
                            </p>
                        </div>
                        <div class="flex gap-3">
                            <Phone class="w-5 h-5 text-gray-400 shrink-0" />
                            <a href="tel:+1234567890"
                                class="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                                +1 (234) 567-890
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="pt-12 border-t border-gray-100">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        © {{ currentYear }} AlieeShop. Curated with passion.
                    </p>
                    <div class="flex gap-8">
                        <a href="#"
                            class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Privacy
                            Policy</a>
                        <a href="#"
                            class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Terms
                            of Service</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}
</style>