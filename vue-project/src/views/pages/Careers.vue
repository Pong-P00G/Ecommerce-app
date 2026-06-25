<script setup>
import { Briefcase, MapPin, Clock, Heart, Users, Sparkles, ArrowRight } from 'lucide-vue-next'

const openPositions = [
    {
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote / San Francisco, CA',
        type: 'Full-time',
        description: 'Build next-generation e-commerce experiences using Vue.js, TypeScript, and modern web technologies.'
    },
    {
        title: 'Product Designer',
        department: 'Design',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'Shape the future of online shopping through beautiful, intuitive, and accessible design.'
    },
    {
        title: 'Customer Experience Specialist',
        department: 'Support',
        location: 'Remote',
        type: 'Full-time',
        description: 'Help our customers have amazing experiences with prompt, friendly, and effective support.'
    },
    {
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        description: 'Lead campaigns that drive growth and connect customers with products they love.'
    },
    {
        title: 'Data Analyst',
        department: 'Analytics',
        location: 'Remote',
        type: 'Full-time',
        description: 'Turn data into insights that shape product strategy and customer experience.'
    },
    {
        title: 'Warehouse Associate',
        department: 'Operations',
        location: 'Austin, TX',
        type: 'Full-time',
        description: 'Help fulfill orders and keep our warehouse running smoothly.'
    }
]

const benefits = [
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage' },
    { icon: Clock, title: 'Flexible Schedule', desc: 'Work-life balance with flexible hours' },
    { icon: Users, title: 'Team Culture', desc: 'Collaborative, inclusive, and supportive environment' },
    { icon: Sparkles, title: 'Growth Opportunities', desc: 'Continuous learning and career development' }
]
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-white via-violet-50 to-purple-50 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 mt-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                    <Briefcase class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                    Join Our Team
                </h1>
                <p class="text-gray-600 text-lg max-w-2xl mx-auto">
                    Help us build the future of e-commerce. We're looking for passionate people to join our growing team.
                </p>
            </div>

            <!-- Why Work With Us -->
            <div class="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Why Work With Us</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="benefit in benefits" :key="benefit.title" class="text-center">
                        <div class="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <component :is="benefit.icon" class="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 class="font-bold text-gray-900 mb-1">{{ benefit.title }}</h3>
                        <p class="text-sm text-gray-600">{{ benefit.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- Open Positions -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Open Positions</h2>
                <p class="text-gray-600 mb-6">{{ openPositions.length }} roles currently available</p>

                <div class="space-y-4">
                    <div v-for="(job, idx) in openPositions" :key="idx"
                        class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    {{ job.title }}
                                </h3>
                                <p class="text-gray-600 mb-3">{{ job.description }}</p>
                                <div class="flex flex-wrap gap-3 text-sm text-gray-500">
                                    <span class="flex items-center gap-1">
                                        <Briefcase class="w-4 h-4" />
                                        {{ job.department }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <MapPin class="w-4 h-4" />
                                        {{ job.location }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <Clock class="w-4 h-4" />
                                        {{ job.type }}
                                    </span>
                                </div>
                            </div>
                            <button class="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 shrink-0">
                                Apply Now
                                <ArrowRight class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl shadow-2xl p-8 text-white text-center">
                <h2 class="text-2xl font-bold mb-2">Don't see the right role?</h2>
                <p class="text-purple-100 mb-6">We're always looking for talented people. Send us your resume and we'll be in touch.</p>
                <a href="mailto:careers@alieeshop.com"
                    class="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:shadow-2xl transition-all">
                    Email Us
                </a>
            </div>
        </div>
    </div>
</template>
