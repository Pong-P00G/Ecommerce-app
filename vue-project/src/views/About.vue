<script setup>
import { RouterLink } from 'vue-router';
import {
    Sparkles,
    Heart,
    Leaf,
    Award,
    Users,
    Globe,
    ArrowRight,
    Quote,
} from 'lucide-vue-next';

const values = [
    { icon: Heart, title: 'Crafted with care', desc: 'Every product is selected for its quality, design, and durability.' },
    { icon: Leaf, title: 'Built to last', desc: 'Sustainable materials and timeless silhouettes that age beautifully.' },
    { icon: Award, title: 'Honest pricing', desc: 'No markups, no shortcuts. Premium goods at fair prices.' },
    { icon: Globe, title: 'Globally sourced', desc: 'Curated from independent makers and ethical brands worldwide.' },
];

const stats = [
    { number: '120K+', label: 'Happy customers' },
    { number: '4.9', label: 'Average rating' },
    { number: '50+', label: 'Countries shipped' },
    { number: '98%', label: 'Return satisfaction' },
];

const team = [
    { name: 'Sokha Lim', role: 'Founder & Creative Director', img: 'https://i.pravatar.cc/400?img=12' },
    { name: 'Dara Pich', role: 'Head of Curation', img: 'https://i.pravatar.cc/400?img=47' },
    { name: 'Rithya Chan', role: 'Operations Lead', img: 'https://i.pravatar.cc/400?img=33' },
    { name: 'Lina Seng', role: 'Customer Experience', img: 'https://i.pravatar.cc/400?img=24' },
];
</script>

<template>
    <div class="bg-paper">
        <!-- Hero -->
        <section class="bg-ink text-paper overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div class="grid lg:grid-cols-2 gap-12 items-center">
                    <div class="space-y-6">
                        <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                            <Sparkles class="w-4 h-4" />
                            Our Story
                        </span>
                        <h1 class="text-5xl md:text-6xl lg:text-7xl font-elegant font-bold leading-[1.05]">
                            We curate <span class="italic text-accent">objects</span> worth keeping.
                        </h1>
                        <p class="text-lg text-neutral-300 font-light leading-relaxed max-w-xl">
                            ALIESHOP was founded on a simple belief: better things, made well, last longer.
                            We work with independent makers and ethical brands to bring you products that feel personal.
                        </p>
                        <div class="flex items-center gap-3 pt-2">
                            <RouterLink to="/product" class="btn-accent shine-effect">
                                Shop the catalog
                                <ArrowRight class="w-4 h-4" />
                            </RouterLink>
                            <RouterLink to="/contact" class="btn-outline border-neutral-700 text-paper hover:bg-paper hover:text-ink">
                                Get in touch
                            </RouterLink>
                        </div>
                    </div>
                    <div class="relative hidden lg:block">
                        <div class="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-accent/30 blur-3xl"></div>
                        <div class="relative grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=800&fit=crop" alt="" class="rounded-2xl h-72 w-full object-cover mt-12" />
                            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop" alt="" class="rounded-2xl h-72 w-full object-cover" />
                            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop" alt="" class="rounded-2xl h-72 w-full object-cover" />
                            <img src="https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&h=800&fit=crop" alt="" class="rounded-2xl h-72 w-full object-cover -mt-12" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-paper border border-neutral-200 rounded-3xl p-6 lg:p-8 shadow-[0_12px_32px_-8px_rgb(0_0_0_/_0.12)]">
                <div v-for="s in stats" :key="s.label" class="text-center lg:text-left space-y-1">
                    <p class="text-3xl lg:text-4xl font-elegant font-bold text-ink tabular-nums">{{ s.number }}</p>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{{ s.label }}</p>
                </div>
            </div>
        </section>

        <!-- Values -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center mb-16 space-y-3">
                <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    <Award class="w-4 h-4" />
                    What we stand for
                </span>
                <h2 class="text-4xl md:text-5xl font-elegant font-bold text-ink">Built on principles, not promises.</h2>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="v in values" :key="v.title" class="card-flat p-6 space-y-4 hover:border-ink hover:-translate-y-1 transition-all duration-300 group">
                    <div class="w-12 h-12 rounded-2xl bg-accent-50 group-hover:bg-accent flex items-center justify-center transition-colors">
                        <component :is="v.icon" class="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                    </div>
                    <h3 class="text-lg font-bold text-ink">{{ v.title }}</h3>
                    <p class="text-sm text-neutral-600 leading-relaxed">{{ v.desc }}</p>
                </div>
            </div>
        </section>

        <!-- Quote -->
        <section class="bg-neutral-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <Quote class="w-10 h-10 text-accent mx-auto mb-6" />
                <blockquote class="text-3xl md:text-4xl font-elegant font-medium text-ink leading-relaxed">
                    "We don't sell products. We share the things we love with people who will love them too."
                </blockquote>
                <p class="mt-6 text-sm font-bold text-neutral-500 uppercase tracking-[0.2em]">— Sokha Lim, Founder</p>
            </div>
        </section>

        <!-- Team -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="flex items-end justify-between mb-12 flex-wrap gap-4">
                <div class="space-y-2">
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        <Users class="w-4 h-4" />
                        The team
                    </span>
                    <h2 class="text-4xl md:text-5xl font-elegant font-bold text-ink">People behind the pixels.</h2>
                </div>
                <RouterLink to="/careers" class="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-accent transition-colors">
                    Join us
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="m in team" :key="m.name" class="group">
                    <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                        <img :src="m.img" :alt="m.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <h3 class="text-lg font-bold text-ink">{{ m.name }}</h3>
                    <p class="text-sm text-neutral-500">{{ m.role }}</p>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div class="bg-accent rounded-3xl p-10 lg:p-16 text-center text-white">
                <h2 class="text-3xl md:text-5xl font-elegant font-bold mb-4">Ready to find your next favorite?</h2>
                <p class="text-lg text-white/80 max-w-xl mx-auto mb-8">Browse our handpicked catalog of products designed to last.</p>
                <RouterLink to="/product" class="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-white font-bold rounded-full hover:bg-neutral-800 transition-all hover:-translate-y-0.5">
                    Shop now
                    <ArrowRight class="w-4 h-4" />
                </RouterLink>
            </div>
        </section>
    </div>
</template>
