<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-vue-next';

const currentSlide = ref(0);
const autoPlayInterval = ref(null);

const heroSlides = [
    {
        id: 1,
        eyebrow: 'Summer Collection 2024',
        title: 'Threads of',
        titleAccent: 'Modernity',
        description: 'Curated apparel and essentials designed for the contemporary wardrobe.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
        cta: 'Shop Collection',
        ctaLink: '/product',
        badge: 'New Season',
    },
    {
        id: 2,
        eyebrow: 'Premium Electronics',
        title: 'Built for',
        titleAccent: 'Tomorrow',
        description: 'Cutting-edge devices and accessories engineered for everyday excellence.',
        image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop',
        cta: 'Explore Tech',
        ctaLink: '/product?category=tech',
        badge: 'Trending',
    },
    {
        id: 3,
        eyebrow: 'Home & Living',
        title: 'Spaces that',
        titleAccent: 'Inspire',
        description: 'Transformative pieces that turn any room into a personal sanctuary.',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=600&fit=crop',
        cta: 'Discover More',
        ctaLink: '/product?category=home',
        badge: 'On Sale',
    },
];

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
};
const prevSlide = () => {
    currentSlide.value = currentSlide.value === 0 ? heroSlides.length - 1 : currentSlide.value - 1;
};
const goToSlide = (index) => {
    currentSlide.value = index;
};
const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayInterval.value = setInterval(() => nextSlide(), 5000);
};
const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value);
        autoPlayInterval.value = null;
    }
};

onMounted(() => startAutoPlay());
onUnmounted(() => stopAutoPlay());
</script>

<template>
    <section
        class="relative h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden rounded-3xl bg-ink group"
        @mouseenter="stopAutoPlay"
        @mouseleave="startAutoPlay"
    >
        <!-- Slides -->
        <div
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            class="absolute inset-0 transition-opacity duration-1000"
            :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
            <!-- Background image -->
            <div class="absolute inset-0">
                <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover scale-105" />
                <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent"></div>
            </div>

            <!-- Content -->
            <div class="relative h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center">
                <div class="max-w-2xl space-y-6">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-1.5 bg-paper/15 backdrop-blur-md border border-paper/20 rounded-full text-paper text-xs font-bold uppercase tracking-[0.2em]"
                        :class="currentSlide === index ? 'animate-fade-up' : 'opacity-0'"
                    >
                        <span class="w-1.5 h-1.5 bg-accent rounded-full pulse-dot"></span>
                        {{ slide.badge }}
                    </div>

                    <p
                        class="text-sm font-bold uppercase tracking-[0.25em] text-accent"
                        :class="currentSlide === index ? 'animate-fade-up' : 'opacity-0'"
                        style="animation-delay: 0.1s"
                    >
                        {{ slide.eyebrow }}
                    </p>

                    <h2
                        class="text-5xl md:text-7xl lg:text-8xl font-elegant text-paper leading-[0.95]"
                        :class="currentSlide === index ? 'animate-fade-up' : 'opacity-0'"
                        style="animation-delay: 0.2s"
                    >
                        {{ slide.title }}
                        <span class="block font-bold italic">{{ slide.titleAccent }}</span>
                    </h2>

                    <p
                        class="text-base md:text-lg text-paper/80 font-light max-w-lg leading-relaxed"
                        :class="currentSlide === index ? 'animate-fade-up' : 'opacity-0'"
                        style="animation-delay: 0.3s"
                    >
                        {{ slide.description }}
                    </p>

                    <div
                        class="flex items-center gap-4 pt-2"
                        :class="currentSlide === index ? 'animate-fade-up' : 'opacity-0'"
                        style="animation-delay: 0.4s"
                    >
                        <RouterLink
                            :to="slide.ctaLink"
                            class="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold text-sm rounded-full shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.6)] hover:bg-accent-600 hover:-translate-y-0.5 transition-all duration-300 group/cta"
                        >
                            {{ slide.cta }}
                            <ArrowRight class="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                        </RouterLink>
                        <RouterLink
                            to="/about"
                            class="inline-flex items-center gap-2 px-7 py-3.5 bg-paper/10 backdrop-blur-md text-paper font-bold text-sm rounded-full border border-paper/20 hover:bg-paper hover:text-ink transition-all duration-300"
                        >
                            <Sparkles class="w-4 h-4" />
                            Our Story
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Arrows -->
        <button
            @click="prevSlide"
            class="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-paper/10 hover:bg-paper text-paper hover:text-ink border border-paper/20 rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
        >
            <ChevronLeft class="w-5 h-5" />
        </button>
        <button
            @click="nextSlide"
            class="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-paper/10 hover:bg-paper text-paper hover:text-ink border border-paper/20 rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-md opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
        >
            <ChevronRight class="w-5 h-5" />
        </button>

        <!-- Dots -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <button
                v-for="(slide, index) in heroSlides"
                :key="`dot-${index}`"
                @click="goToSlide(index)"
                class="transition-all duration-300 h-2 rounded-full"
                :class="currentSlide === index
                    ? 'w-10 bg-accent'
                    : 'w-2 bg-paper/40 hover:bg-paper/70'"
                :aria-label="`Go to slide ${index + 1}`"
            ></button>
        </div>

        <!-- Slide counter -->
        <div class="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 bg-paper/10 backdrop-blur-md border border-paper/20 rounded-full text-paper text-xs font-bold tabular-nums">
            <span class="text-accent">{{ String(currentSlide + 1).padStart(2, '0') }}</span>
            <span class="text-paper/40">/</span>
            <span>{{ String(heroSlides.length).padStart(2, '0') }}</span>
        </div>
    </section>
</template>
