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
    Youtube,
    ArrowUp,
    Send,
    ShieldCheck,
    Truck,
    RotateCcw,
    CreditCard,
    Sparkles
} from 'lucide-vue-next';

const currentYear = new Date().getFullYear();
const email = ref('');
const subscribed = ref(false);

const submitNewsletter = () => {
    if (!email.value || !email.value.includes('@')) return;
    subscribed.value = true;
    setTimeout(() => {
        subscribed.value = false;
        email.value = '';
    }, 3500);
};

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
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

const perks = [
    { icon: Truck, title: 'Free shipping', desc: 'On orders over $50' },
    { icon: RotateCcw, title: '7-day returns', desc: 'Hassle-free refunds' },
    { icon: ShieldCheck, title: 'Secure checkout', desc: '256-bit SSL encryption' },
    { icon: CreditCard, title: 'Flexible payment', desc: 'Cards, wallets, installments' },
];
</script>

<template>
    <footer class="bg-ink text-paper">
        <!-- Perks Strip -->
        <div class="border-b border-neutral-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        v-for="perk in perks"
                        :key="perk.title"
                        class="flex items-center gap-3 group"
                    >
                        <div class="w-11 h-11 rounded-xl bg-neutral-900 group-hover:bg-accent transition-colors duration-300 flex items-center justify-center shrink-0">
                            <component :is="perk.icon" class="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-bold text-paper">{{ perk.title }}</p>
                            <p class="text-xs text-neutral-400 truncate">{{ perk.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Footer -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                <!-- Brand + Newsletter -->
                <div class="lg:col-span-5 space-y-8">
                    <RouterLink to="/" class="inline-flex items-center gap-2 group">
                        <span class="text-3xl font-elegant text-paper">
                            <span class="font-light">ALIE</span><span class="font-bold">SHOP</span>
                        </span>
                        <span class="w-2 h-2 bg-accent rounded-full pulse-dot"></span>
                    </RouterLink>

                    <p class="text-neutral-400 text-base font-light leading-relaxed max-w-md">
                        Curating a world of exceptional products for your modern lifestyle.
                        Quality, sustainability, and design — in every detail.
                    </p>

                    <!-- Newsletter -->
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <Sparkles class="w-4 h-4 text-accent" />
                            <p class="text-xs font-bold uppercase tracking-[0.2em] text-paper">
                                Get 15% off your first order
                            </p>
                        </div>
                        <form @submit.prevent="submitNewsletter" class="flex gap-2 max-w-md">
                            <div class="relative flex-1">
                                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    v-model="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    class="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-sm text-paper placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-600 text-white font-bold text-sm rounded-full transition-all duration-300 shadow-[0_8px_24px_-6px_rgb(249_115_22_/0.45)] hover:shadow-[0_12px_28px_-6px_rgb(249_115_22_/0.55)] hover:-translate-y-0.5"
                            >
                                <Send class="w-4 h-4" />
                                <span class="hidden sm:inline">Subscribe</span>
                            </button>
                        </form>
                        <transition name="slide-fade">
                            <p v-if="subscribed" class="text-xs text-accent-300 font-medium flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 bg-accent-400 rounded-full pulse-dot"></span>
                                Thanks for subscribing! Check your inbox.
                            </p>
                        </transition>
                        <p class="text-xs text-neutral-500">
                            By subscribing you agree to our privacy policy. Unsubscribe anytime.
                        </p>
                    </div>

                    <!-- Social -->
                    <div class="flex items-center gap-3">
                        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mr-1">Follow</span>
                        <a
                            v-for="social in socialLinks"
                            :key="social.label"
                            :href="social.href"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="social.label"
                            class="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white hover:-translate-y-0.5"
                        >
                            <component :is="social.icon" class="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <!-- Link Columns -->
                <div class="lg:col-span-2">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-paper mb-6">Shop</h3>
                    <ul class="space-y-3.5">
                        <li v-for="link in footerLinks.shop" :key="link.name">
                            <RouterLink
                                :to="link.to"
                                class="text-sm text-neutral-400 hover:text-accent transition-colors font-medium inline-flex items-center gap-1.5 group"
                            >
                                <span class="w-1 h-1 bg-neutral-700 group-hover:bg-accent rounded-full transition-colors"></span>
                                {{ link.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <div class="lg:col-span-2">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-paper mb-6">Help</h3>
                    <ul class="space-y-3.5">
                        <li v-for="link in footerLinks.help" :key="link.name">
                            <RouterLink
                                :to="link.to"
                                class="text-sm text-neutral-400 hover:text-accent transition-colors font-medium inline-flex items-center gap-1.5 group"
                            >
                                <span class="w-1 h-1 bg-neutral-700 group-hover:bg-accent rounded-full transition-colors"></span>
                                {{ link.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <div class="lg:col-span-3">
                    <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-paper mb-6">Contact</h3>
                    <div class="space-y-5">
                        <div class="flex gap-3">
                            <div class="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                                <MapPin class="w-4 h-4 text-accent" />
                            </div>
                            <p class="text-sm text-neutral-400 leading-relaxed font-medium">
                                123 Commerce St,<br />Phnom Penh, Kingdom of Cambodia
                            </p>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                                <Phone class="w-4 h-4 text-accent" />
                            </div>
                            <a href="tel:+1234567890" class="text-sm text-neutral-400 hover:text-paper transition-colors font-medium">
                                +1 (234) 567-890
                            </a>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                                <Mail class="w-4 h-4 text-accent" />
                            </div>
                            <a href="mailto:support@aleeshop.com" class="text-sm text-neutral-400 hover:text-paper transition-colors font-medium">
                                support@aleeshop.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="pt-8 border-t border-neutral-800">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p class="text-xs text-neutral-500 font-bold uppercase tracking-widest">
                        © {{ currentYear }} ALIESHOP — Curated with passion.
                    </p>

                    <div class="flex items-center gap-6">
                        <a href="#" class="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-paper transition-colors">Privacy</a>
                        <a href="#" class="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-paper transition-colors">Terms</a>
                        <a href="#" class="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-paper transition-colors">Cookies</a>
                    </div>

                    <button
                        @click="scrollToTop"
                        class="w-10 h-10 rounded-full bg-neutral-900 hover:bg-accent transition-all duration-300 text-neutral-400 hover:text-white hover:-translate-y-0.5 flex items-center justify-center"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </footer>
</template>
