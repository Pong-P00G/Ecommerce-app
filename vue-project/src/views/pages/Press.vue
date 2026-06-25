<script setup>
import { Newspaper, Download, Mail, ExternalLink, Calendar } from 'lucide-vue-next'

const pressReleases = [
    {
        date: '2026-06-15',
        title: 'AlieeShop Launches Sustainable Collection',
        summary: 'New eco-friendly line made from recycled materials debuts this summer.',
        category: 'Product Launch'
    },
    {
        date: '2026-05-02',
        title: 'AlieeShop Reaches 1 Million Customers Milestone',
        summary: 'Company celebrates significant growth and community expansion across 30+ countries.',
        category: 'Company News'
    },
    {
        date: '2026-03-18',
        title: 'Series B Funding Announcement',
        summary: 'AlieeShop secures $50M in Series B funding to accelerate global expansion.',
        category: 'Funding'
    },
    {
        date: '2026-01-10',
        title: 'AlieeShop Named Top Employer 2026',
        summary: 'Recognized for outstanding workplace culture and employee satisfaction.',
        category: 'Awards'
    }
]

const mediaKit = [
    { name: 'Brand Logos (PNG, SVG)', size: '2.4 MB' },
    { name: 'Brand Guidelines', size: '5.1 MB' },
    { name: 'Product Photography', size: '128 MB' },
    { name: 'Executive Bios', size: '1.2 MB' }
]

const pressContacts = [
    { name: 'Sarah Johnson', role: 'Head of PR', email: 'press@alieeshop.com' },
    { name: 'Michael Chen', role: 'Investor Relations', email: 'ir@alieeshop.com' }
]
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-50 py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl mb-4 shadow-lg">
                    <Newspaper class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent mb-3">
                    Press & Media
                </h1>
                <p class="text-gray-600 text-lg">Latest news, press releases, and media resources</p>
            </div>

            <!-- Press Releases -->
            <div class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Latest Press Releases</h2>
                <div class="space-y-4">
                    <article v-for="(release, idx) in pressReleases" :key="idx"
                        class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="px-3 py-1 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                {{ release.category }}
                            </span>
                            <span class="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar class="w-4 h-4" />
                                {{ release.date }}
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ release.title }}</h3>
                        <p class="text-gray-600 mb-4">{{ release.summary }}</p>
                        <a href="#" class="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold">
                            Read full release
                            <ExternalLink class="w-4 h-4" />
                        </a>
                    </article>
                </div>
            </div>

            <!-- Media Kit -->
            <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Media Kit</h2>
                <p class="text-gray-600 mb-6">Download official AlieeShop brand assets and resources.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(item, idx) in mediaKit" :key="idx"
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div>
                            <p class="font-semibold text-gray-900">{{ item.name }}</p>
                            <p class="text-sm text-gray-500">{{ item.size }}</p>
                        </div>
                        <button class="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors shrink-0">
                            <Download class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Press Contacts -->
            <div class="bg-gradient-to-r from-slate-700 via-gray-800 to-black rounded-3xl shadow-2xl p-8 text-white">
                <h2 class="text-2xl font-bold mb-2">Press Contact</h2>
                <p class="text-slate-200 mb-6">For media inquiries, please reach out to our PR team.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="contact in pressContacts" :key="contact.email"
                        class="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <p class="font-bold text-lg">{{ contact.name }}</p>
                        <p class="text-slate-200 text-sm mb-3">{{ contact.role }}</p>
                        <a :href="`mailto:${contact.email}`"
                            class="inline-flex items-center gap-2 text-white hover:text-slate-200 font-semibold">
                            <Mail class="w-4 h-4" />
                            {{ contact.email }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
