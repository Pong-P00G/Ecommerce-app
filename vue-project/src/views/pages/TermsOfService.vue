<script setup>
import { useHead } from '@unhead/vue'
import { Scale, ArrowRight, CheckCircle } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

useHead({
    title: 'Terms of Service | AlieeShop',
    meta: [
        { name: 'description', content: 'Read the terms and conditions for using AlieeShop. Understand your rights and obligations when using our services.' },
        { property: 'og:title', content: 'Terms of Service | AlieeShop' },
        { property: 'og:description', content: 'Read the terms and conditions for using AlieeShop. Understand your rights and obligations when using our services.' },
        { name: 'twitter:title', content: 'Terms of Service | AlieeShop' },
        { name: 'twitter:description', content: 'Read the terms and conditions for using AlieeShop.' },
    ],
    link: [
        { rel: 'canonical', href: 'https://alieeshop.com/terms' },
    ],
})

const lastUpdated = 'June 15, 2026'

const sections = [
    {
        title: 'Acceptance of Terms',
        content: 'By accessing or using AlieeShop, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services. We reserve the right to update these terms at any time, and continued use of our services constitutes acceptance of any changes.'
    },
    {
        title: 'Account Registration',
        content: 'When creating an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate our terms.'
    },
    {
        title: 'Orders & Payments',
        content: 'By placing an order, you agree to purchase the selected products at the listed prices plus applicable taxes and shipping fees. All payments are processed securely through our PCI-compliant payment partners. We reserve the right to cancel any order due to pricing errors, stock unavailability, or suspected fraud. Order confirmation emails are an acknowledgment of receipt, not acceptance of the order.'
    },
    {
        title: 'Shipping & Delivery',
        content: 'We strive to process and ship all orders within the estimated timeframes provided at checkout. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or other factors beyond our control. Risk of loss passes to you upon delivery to the carrier. Please refer to our Shipping page for detailed information.'
    },
    {
        title: 'Returns & Refunds',
        content: 'We accept returns within 30 days of delivery for items in original condition. Refunds are processed within 5-7 business days after we receive and inspect the returned items. Certain items, including final sale products and personalized items, are not eligible for return. Please see our Returns & Exchanges page for complete details.'
    },
    {
        title: 'Intellectual Property',
        content: 'All content on AlieeShop, including text, images, logos, designs, and software, is our property or licensed to us and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission. Our trademarks and trade dress may not be used in connection with any product or service without our prior consent.'
    },
    {
        title: 'Limitation of Liability',
        content: 'AlieeShop shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability for any claim related to our services shall not exceed the total amount paid by you for the products giving rise to the claim. Some jurisdictions do not allow limitations of liability, so these limitations may not apply to you.'
    },
    {
        title: 'Prohibited Activities',
        content: 'You agree not to use our services for any unlawful purpose or in violation of these terms. Prohibited activities include but are not limited to: attempting to gain unauthorized access to our systems, interfering with the proper functioning of our website, using automated tools to scrape or extract data, impersonating any person or entity, and engaging in any activity that could damage or impair our services.'
    },
    {
        title: 'Governing Law',
        content: 'These Terms of Service shall be governed by and construed in accordance with the laws of the Kingdom of Cambodia, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved through binding arbitration in Phnom Penh, Cambodia, unless otherwise required by applicable law.'
    }
]
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-12 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Scale class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
                    Terms of
                    <span class="text-accent">service</span>
                </h1>
                <p class="text-neutral-600 text-lg">The rules and guidelines for using AlieeShop.</p>
                <p class="text-xs text-neutral-400 mt-3 font-medium">Last updated: {{ lastUpdated }}</p>
            </div>

            <!-- Content -->
            <div class="max-w-3xl mx-auto space-y-8">
                <div v-for="(section, idx) in sections" :key="idx" class="card-flat p-6 md:p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 stagger-item group">
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent shrink-0 mt-0.5 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                            <CheckCircle class="w-5 h-5" />
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-ink mb-3">{{ section.title }}</h2>
                            <p class="text-neutral-600 leading-relaxed">{{ section.content }}</p>
                        </div>
                    </div>
                </div>

                <!-- CTA -->
                <div class="bg-ink text-paper rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full -mr-36 -mt-36"></div>
                    <div class="relative z-10">
                        <Scale class="w-10 h-10 text-accent mx-auto mb-5" />
                        <h2 class="font-elegant font-bold text-2xl md:text-3xl mb-3">Questions about our terms?</h2>
                        <p class="text-neutral-400 mb-6 max-w-md mx-auto">We are happy to clarify any questions about our terms of service.</p>
                        <RouterLink to="/contact" class="btn-accent shine-effect inline-flex">
                            Get in touch
                            <ArrowRight class="w-4 h-4" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
