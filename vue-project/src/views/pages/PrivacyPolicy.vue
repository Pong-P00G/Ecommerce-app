<script setup>
import { useHead } from '@unhead/vue'
import { Shield, CheckCircle, ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

useHead({
    title: 'Privacy Policy | AlieeShop',
    meta: [
        { name: 'description', content: 'Learn how AlieeShop collects, uses, and protects your personal information. Read our comprehensive privacy policy.' },
        { property: 'og:title', content: 'Privacy Policy | AlieeShop' },
        { property: 'og:description', content: 'Learn how AlieeShop collects, uses, and protects your personal information.' },
        { name: 'twitter:title', content: 'Privacy Policy | AlieeShop' },
        { name: 'twitter:description', content: 'Learn how AlieeShop collects, uses, and protects your personal information.' },
    ],
    link: [
        { rel: 'canonical', href: 'https://alieeshop.com/privacy' },
    ],
})

const lastUpdated = 'June 15, 2026'

const sections = [
    {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, including your name, email address, shipping address, payment information, and phone number when you create an account, place an order, or contact our support team. We also automatically collect certain information when you visit our site, including your IP address, browser type, device information, and browsing behavior through cookies and similar technologies.'
    },
    {
        title: 'How We Use Your Information',
        content: 'We use the information we collect to process your orders, communicate with you about your purchases, provide customer support, send you marketing communications (with your consent), improve our website and services, detect and prevent fraud, and comply with legal obligations.'
    },
    {
        title: 'Information Sharing',
        content: 'We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, shipping orders, and sending communications. These partners are contractually obligated to protect your information and use it only for the services they provide to us.'
    },
    {
        title: 'Data Security',
        content: 'We implement industry-standard security measures to protect your personal information, including SSL/TLS encryption for all data transmissions, secure tokenization of payment information, regular security audits, and strict access controls for our employees and contractors.'
    },
    {
        title: 'Your Rights',
        content: 'You have the right to access, correct, or delete your personal information at any time. You can update your account details in your profile settings, unsubscribe from marketing emails using the link in any email we send, request a copy of your data by contacting our support team, and request account deletion through your settings or by contacting us.'
    },
    {
        title: 'Cookies',
        content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and provide personalized content and advertisements. You can control cookie preferences through your browser settings. Essential cookies are required for the website to function properly and cannot be disabled.'
    },
    {
        title: 'Third-Party Services',
        content: 'Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information. Our payment processing is handled by PCI-compliant partners who adhere to strict security standards.'
    },
    {
        title: 'Children\'s Privacy',
        content: 'Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information promptly.'
    }
]
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-12 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Shield class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-5xl md:text-6xl text-ink mb-4">
                    Privacy
                    <span class="text-accent">policy</span>
                </h1>
                <p class="text-neutral-600 text-lg">How we collect, use, and protect your personal information.</p>
                <p class="text-xs text-neutral-400 mt-3 font-medium">Last updated: {{ lastUpdated }}</p>
            </div>

            <!-- Content -->
            <div class="max-w-3xl mx-auto space-y-8">
                <div v-for="(section, idx) in sections" :key="idx" class="card-flat p-6 md:p-8">
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent shrink-0 mt-0.5">
                            <CheckCircle class="w-5 h-5" />
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-ink mb-3">{{ section.title }}</h2>
                            <p class="text-neutral-600 leading-relaxed">{{ section.content }}</p>
                        </div>
                    </div>
                </div>

                <!-- Contact CTA -->
                <div class="bg-ink text-paper rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full -mr-36 -mt-36"></div>
                    <div class="relative z-10">
                        <Shield class="w-10 h-10 text-accent mx-auto mb-5" />
                        <h2 class="font-elegant font-bold text-2xl md:text-3xl mb-3">Have questions about privacy?</h2>
                        <p class="text-neutral-400 mb-6 max-w-md mx-auto">Our privacy team is here to help. Reach out anytime.</p>
                        <RouterLink to="/contact" class="btn-accent shine-effect inline-flex">
                            Contact us
                            <ArrowRight class="w-4 h-4" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
