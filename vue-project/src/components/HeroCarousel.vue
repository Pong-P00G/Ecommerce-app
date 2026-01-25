<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Zap, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next';

const currentSlide = ref(0);
const autoPlayInterval = ref(null);

const heroSlides = [
    {
        id: 1,
        title: 'Summer Collection 2024',
        subtitle: 'New Arrivals',
        description: 'Discover the latest trends in fashion',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
        cta: 'Shop Now',
        badge: 'New',
        color: 'from-amber-500 to-orange-600'
    },
    {
        id: 2,
        title: 'Premium Electronics',
        subtitle: 'Tech Paradise',
        description: 'Experience innovation at its finest',
        image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop',
        cta: 'Explore',
        badge: 'Hot',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        id: 3,
        title: 'Home & Living',
        subtitle: 'Comfort Redefined',
        description: 'Transform your space with style',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=600&fit=crop',
        cta: 'Discover',
        badge: 'Sale',
        color: 'from-emerald-500 to-teal-600'
    }
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
    autoPlayInterval.value = setInterval(() => {
        nextSlide();
    }, 3000); // 3 Second
};

const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value);
        autoPlayInterval.value = null;
    }
};

onMounted(() => {
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});
</script>

<template>
    <section class="relative h-150 overflow-hidden bg-gray-900 rounded-xl" @mouseenter="stopAutoPlay"
        @mouseleave="startAutoPlay">
        <!-- All Slides (stacked) -->
        <div v-for="(slide, index) in heroSlides" :key="slide.id"
            class="absolute inset-0 transition-opacity duration-700"
            :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'">
            <!-- Background Image with Overlay -->
            <div class="absolute inset-0">
                <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-linear-to-r from-black/60 to-transparent"></div>
            </div>

            <!-- Content -->
            <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div class="max-w-2xl space-y-6">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold"
                        :style="{ animationDelay: currentSlide === index ? '0.2s' : '0s' }"
                        :class="currentSlide === index ? 'animate-fade-in-up' : 'opacity-0'">
                        <Zap class="w-4 h-4" />
                        {{ slide.badge }}
                    </div>
                    <h1 class="text-5xl md:text-8xl font-light text-white leading-tight tracking-tight"
                        :style="{ animationDelay: currentSlide === index ? '0.4s' : '0s' }"
                        :class="currentSlide === index ? 'animate-fade-in-up' : 'opacity-0'">
                        {{ slide.title.split(' ').slice(0, -1).join(' ') }} <span class="font-bold italic">{{
                            slide.title.split(' ').slice(-1)[0] }}</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-white/90 font-light"
                        :style="{ animationDelay: currentSlide === index ? '0.6s' : '0s' }"
                        :class="currentSlide === index ? 'animate-fade-in-up' : 'opacity-0'">
                        {{ slide.description }}
                    </p>
                    <div class="flex items-center gap-4 pt-4"
                        :style="{ animationDelay: currentSlide === index ? '0.8s' : '0s' }"
                        :class="currentSlide === index ? 'animate-fade-in-up' : 'opacity-0'">
                        <!-- <RouterLink to="/product"
                            class="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-black hover:text-white transition-all duration-500 hover:scale-105 shadow-2xl flex items-center gap-3 group">
                            {{ slide.cta }}
                            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </RouterLink> -->
                        <!-- <button
                            class="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300">
                            Explore More
                        </button> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- Navigation Arrows -->
        <!-- <button @click="prevSlide"
            class="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 border border-white/20 rounded-full flex items-center justify-center transition-all duration-500 z-20 group"
            aria-label="Previous slide">
            <ChevronLeft class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button @click="nextSlide"
            class="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 border border-white/20 rounded-full flex items-center justify-center transition-all duration-500 z-20 group"
            aria-label="Next slide">
            <ChevronRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button> -->
        <!-- Dots Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            <button v-for="(slide, index) in heroSlides" :key="`dot-${index}`" @click="goToSlide(index)"
                class="transition-all duration-300"
                :class="currentSlide === index ? 'w-12 h-3 bg-white rounded-full' : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/75'"
                :aria-label="`Go to slide ${index + 1}`"></button>
        </div>
    </section>
</template>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}
</style>