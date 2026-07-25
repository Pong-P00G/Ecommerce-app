<script setup>
import { Briefcase, MapPin, Clock, Heart, Users, Sparkles, ArrowRight } from 'lucide-vue-next'

const openPositions = [
    { title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote / San Francisco, CA', type: 'Full-time', description: 'Build next-generation e-commerce experiences using Vue.js, TypeScript, and modern web technologies.' },
    { title: 'Product Designer', department: 'Design', location: 'New York, NY', type: 'Full-time', description: 'Shape the future of online shopping through beautiful, intuitive, and accessible design.' },
    { title: 'Customer Experience Specialist', department: 'Support', location: 'Remote', type: 'Full-time', description: 'Help our customers have amazing experiences with prompt, friendly, and effective support.' },
    { title: 'Marketing Manager', department: 'Marketing', location: 'Los Angeles, CA', type: 'Full-time', description: 'Lead campaigns that drive growth and connect customers with products they love.' },
    { title: 'Data Analyst', department: 'Analytics', location: 'Remote', type: 'Full-time', description: 'Turn data into insights that shape product strategy and customer experience.' },
    { title: 'Warehouse Associate', department: 'Operations', location: 'Austin, TX', type: 'Full-time', description: 'Help fulfill orders and keep our warehouse running smoothly.' }
]

const benefits = [
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage' },
    { icon: Clock, title: 'Flexible Schedule', desc: 'Work-life balance with flexible hours' },
    { icon: Users, title: 'Team Culture', desc: 'Collaborative, inclusive, and supportive environment' },
    { icon: Sparkles, title: 'Growth Opportunities', desc: 'Continuous learning and career development' }
]
</script>

<template>
    <div class="bg-paper min-h-screen">
        <section class="section py-12 md:py-16">
            <!-- Header -->
            <div class="text-center mb-14 max-w-2xl mx-auto">
                <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink text-paper mb-5 shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]">
                    <Briefcase class="w-7 h-7 text-accent" />
                </span>
                <h1 class="heading-hero text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
                    Join our
                    <span class="text-accent">team</span>
                </h1>
                <p class="text-neutral-600 text-lg">Help us build the future of e-commerce. We're looking for passionate people to join our growing team.</p>
            </div>

            <!-- Why Work With Us -->
            <div class="card-flat p-8 mb-12">
                <div class="text-center mb-8">
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our culture</span>
                    <h2 class="font-elegant font-bold text-2xl text-ink mt-2">Why work with us</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="benefit in benefits" :key="benefit.title" class="text-center group stagger-item">
                        <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-neutral-100 group-hover:bg-ink group-hover:text-paper text-ink inline-flex items-center justify-center transition-all duration-300">
                            <component :is="benefit.icon" class="w-6 h-6" />
                        </div>
                        <h3 class="font-bold text-ink mb-1">{{ benefit.title }}</h3>
                        <p class="text-sm text-neutral-600 leading-relaxed">{{ benefit.desc }}</p>
                    </div>
                </div>
            </div>

            <!-- Open Positions -->
            <div class="mb-10">
                <div class="flex flex-wrap items-end justify-between gap-4 mb-7">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">Open roles</span>
                        <h2 class="font-elegant font-bold text-3xl text-ink mt-2">Open positions</h2>
                        <p class="text-sm text-neutral-500 mt-1 tabular-nums">{{ openPositions.length }} roles currently available</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="(job, idx) in openPositions"
                        :key="idx"
                        class="card-base p-6 group cursor-pointer stagger-item"
                    >
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                                    {{ job.title }}
                                </h3>
                                <p class="text-sm text-neutral-600 mb-3 leading-relaxed">{{ job.description }}</p>
                                <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-neutral-500">
                                    <span class="inline-flex items-center gap-1.5">
                                        <Briefcase class="w-3.5 h-3.5" />
                                        {{ job.department }}
                                    </span>
                                    <span class="inline-flex items-center gap-1.5">
                                        <MapPin class="w-3.5 h-3.5" />
                                        {{ job.location }}
                                    </span>
                                    <span class="inline-flex items-center gap-1.5">
                                        <Clock class="w-3.5 h-3.5" />
                                        {{ job.type }}
                                    </span>
                                </div>
                            </div>
                            <button class="btn-primary shrink-0">
                                Apply now
                                <ArrowRight class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="bg-ink text-paper rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
                <div class="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full -mr-36 -mt-36"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full -ml-24 -mb-24"></div>
                <div class="relative z-10">
                    <Sparkles class="w-10 h-10 text-accent mx-auto mb-5" />
                    <h2 class="font-elegant font-bold text-3xl md:text-4xl mb-3">Don't see the right role?</h2>
                    <p class="text-neutral-400 mb-7 max-w-md mx-auto">We're always looking for talented people. Send us your resume and we'll be in touch.</p>
                    <a href="mailto:careers@alieeshop.com" class="btn-accent shine-effect">
                        Email us
                        <ArrowRight class="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>
