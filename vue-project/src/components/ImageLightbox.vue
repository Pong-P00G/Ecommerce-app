<script setup>
import { ref, computed, watch } from 'vue'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-vue-next'
import LazyImage from './LazyImage.vue'

const props = defineProps({
    images: { type: Array, default: () => [] },
    initialIndex: { type: Number, default: 0 },
    show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const currentIndex = ref(props.initialIndex)
const zoomed = ref(false)
const rotation = ref(0)
const touchStart = ref(0)
const touchEnd = ref(0)

const currentImage = computed(() => props.images[currentIndex.value] || {})
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.images.length - 1)

watch(() => props.show, (val) => {
    if (val) {
        currentIndex.value = props.initialIndex
        zoomed.value = false
        rotation.value = 0
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

const prev = () => { if (hasPrev.value) { currentIndex.value--; zoomed.value = false; rotation.value = 0 } }
const next = () => { if (hasNext.value) { currentIndex.value++; zoomed.value = false; rotation.value = 0 } }

const toggleZoom = () => { zoomed.value = !zoomed.value }
const rotate = () => { rotation.value = (rotation.value + 90) % 360 }

const close = () => {
    document.body.style.overflow = ''
    emit('close')
}

const onKeydown = (e) => {
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'z') toggleZoom()
}

const onTouchStart = (e) => { touchStart.value = e.touches[0].clientX }
const onTouchMove = (e) => { touchEnd.value = e.touches[0].clientX }
const onTouchEnd = () => {
    const diff = touchStart.value - touchEnd.value
    if (Math.abs(diff) > 50) {
        if (diff > 0) next()
        else prev()
    }
}
</script>

<template>
    <transition name="lightbox-fade">
        <div v-if="show" class="fixed inset-0 z-[60] bg-ink/95"
            @keydown="onKeydown" tabindex="0"
            @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

            <!-- Top bar -->
            <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-ink/80 to-transparent">
                <div class="flex items-center gap-2">
                    <span class="text-sm text-paper font-medium tabular-nums">{{ currentIndex + 1 }} / {{ images.length }}</span>
                    <span v-if="currentImage?.alt_text" class="text-xs text-neutral-400 hidden sm:inline">— {{ currentImage.alt_text }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="toggleZoom" class="w-9 h-9 rounded-full bg-paper/10 hover:bg-paper/20 text-paper flex items-center justify-center transition-colors">
                        <ZoomIn v-if="!zoomed" class="w-4 h-4" />
                        <ZoomOut v-else class="w-4 h-4" />
                    </button>
                    <button @click="rotate" class="w-9 h-9 rounded-full bg-paper/10 hover:bg-paper/20 text-paper flex items-center justify-center transition-colors">
                        <RotateCw class="w-4 h-4" />
                    </button>
                    <button @click="close" class="w-9 h-9 rounded-full bg-paper/10 hover:bg-paper/20 text-paper flex items-center justify-center transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Navigation -->
            <button v-if="hasPrev" @click="prev"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper flex items-center justify-center transition-all">
                <ChevronLeft class="w-6 h-6" />
            </button>
            <button v-if="hasNext" @click="next"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper flex items-center justify-center transition-all">
                <ChevronRight class="w-6 h-6" />
            </button>

            <!-- Image -->
            <div class="absolute inset-0 flex items-center justify-center p-16" @click="toggleZoom">
                <div class="transition-all duration-300" :class="{ 'scale-150 overflow-auto': zoomed }">
                    <LazyImage
                        :src="currentImage?.image_url || currentImage?.src"
                        :alt="currentImage?.alt_text || ''"
                        wrapper-class="max-w-full max-h-full"
                        img-class="max-w-full max-h-[85vh] object-contain transition-transform duration-300"
                        :style="{ transform: 'rotate(' + rotation + 'deg)' }"
                    />
                </div>
            </div>

            <!-- Thumbnails -->
            <div v-if="images.length > 1"
                class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 p-4 bg-gradient-to-t from-ink/80 to-transparent overflow-x-auto">
                <button v-for="(img, idx) in images" :key="idx"
                    @click="currentIndex = idx; zoomed = false; rotation = 0"
                    :class="['w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                        currentIndex === idx ? 'border-accent brightness-100' : 'border-transparent brightness-50 hover:brightness-75']">
                    <LazyImage :src="img.image_url || img.src" :alt="''" wrapper-class="w-full h-full" img-class="w-full h-full object-cover" />
                </button>
            </div>

            <!-- Keyboard hint -->
            <div class="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
                <p class="text-[10px] text-neutral-500 bg-ink/60 px-3 py-1 rounded-full">
                    <kbd class="text-paper font-bold">←</kbd> <kbd class="text-paper font-bold">→</kbd> navigate
                    <kbd class="text-paper font-bold ml-2">Z</kbd> zoom
                    <kbd class="text-paper font-bold ml-2">Esc</kbd> close
                </p>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active { transition: opacity 0.25s ease; }
.lightbox-fade-enter-from,
.lightbox-fade-leave-to { opacity: 0; }
</style>
