<script setup>
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { Map, ChevronRight } from 'lucide-vue-next'

useHead({
    title: 'Sitemap | AlieeShop',
    meta: [
        { name: 'description', content: 'Complete site index for AlieeShop. Browse all pages including shop, account, customer service, and legal information.' },
        { property: 'og:title', content: 'Sitemap | AlieeShop' },
        { property: 'og:description', content: 'Complete site index for AlieeShop. Find any page quickly.' },
        { name: 'twitter:title', content: 'Sitemap | AlieeShop' },
        { name: 'twitter:description', content: 'Complete site index for AlieeShop.' },
    ],
    link: [
        { rel: 'canonical', href: 'https://alieeshop.com/sitemap' },
    ],
})

const sections = [
    {
        label: 'Shop',
        links: [
            { name: 'All Products', to: '/product' },
            { name: 'New Arrivals', to: '/product?filter=new' },
            { name: 'Best Sellers', to: '/product?filter=bestsellers' },
            { name: 'Gift Cards', to: '/gift-cards' },
            { name: 'Product Comparison', to: '/compare' },
        ]
    },
    {
        label: 'Pages',
        links: [
            { name: 'Home', to: '/' },
            { name: 'About Us', to: '/about' },
            { name: 'Contact', to: '/contact' },
            { name: 'Careers', to: '/careers' },
            { name: 'Press', to: '/press' },
            { name: 'Blog', to: '/blog' },
        ]
    },
    {
        label: 'Account',
        links: [
            { name: 'Sign In', to: '/login' },
            { name: 'Create Account', to: '/register' },
            { name: 'Forgot Password', to: '/forgotPassword' },
            { name: 'My Profile', to: '/userprofile' },
            { name: 'Wishlist', to: '/wishlist' },
            { name: 'Settings', to: '/settings' },
        ]
    },
    {
        label: 'Customer Service',
        links: [
            { name: 'Track Order', to: '/track-order' },
            { name: 'Returns & Exchanges', to: '/returns' },
            { name: 'Shipping Information', to: '/shipping' },
            { name: 'FAQ', to: '/faq' },
        ]
    },
    {
        label: 'Legal',
        links: [
            { name: 'Privacy Policy', to: '/privacy' },
            { name: 'Terms of Service', to: '/terms' },
        ]
    },
]
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-12 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Map class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
                    Site
                    <span class="text-accent">map</span>
                </h1>
                <p class="text-neutral-600 text-lg">A complete overview of all pages on AlieeShop.</p>
            </div>

            <!-- Sitemap Grid -->
            <div class="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="section in sections" :key="section.label" class="card-flat p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 stagger-item">
                    <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">{{ section.label }}</h2>
                    <ul class="space-y-2">
                        <li v-for="link in section.links" :key="link.name">
                            <RouterLink :to="link.to"
                                class="flex items-center gap-2 text-sm text-neutral-600 hover:text-ink font-medium transition-all duration-200 group">
                                <ChevronRight class="w-3.5 h-3.5 text-neutral-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                                {{ link.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Admin Section -->
            <div class="max-w-4xl mx-auto mt-6">
                <div class="card-flat p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 stagger-item" style="animation-delay: 350ms;">
                    <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">Admin Dashboard</h2>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <RouterLink v-for="link in [
                            { name: 'Dashboard', to: '/admin/dashboard' },
                            { name: 'Products', to: '/admin/manage-products' },
                            { name: 'Add Product', to: '/admin/add-product' },
                            { name: 'Orders', to: '/admin/orders' },
                            { name: 'Inventory', to: '/admin/manage-stock' },
                            { name: 'Users', to: '/admin/manage-user' },
                            { name: 'Analytics', to: '/admin/analytics' },
                            { name: 'Notifications', to: '/admin/notifications' },
                            { name: 'Activity Log', to: '/admin/activity-log' },
                            { name: 'Reviews', to: '/admin/reviews' },
                            { name: 'Reports', to: '/admin/report' },
                        ]" :key="link.name" :to="link.to"
                            class="flex items-center gap-2 text-sm text-neutral-600 hover:text-ink font-medium transition-all duration-200 group p-2 rounded-xl hover:bg-neutral-50">
                            <ChevronRight class="w-3.5 h-3.5 text-neutral-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                            {{ link.name }}
                        </RouterLink>
                    </div>
                </div>
            </div>

            <!-- Note -->
            <div class="max-w-4xl mx-auto mt-8 text-center">
                <p class="text-sm text-neutral-500">
                    Can't find what you're looking for?
                    <RouterLink to="/contact" class="text-ink font-bold hover:text-accent transition-colors">Contact us</RouterLink>
                </p>
            </div>
        </section>
    </div>
</template>
