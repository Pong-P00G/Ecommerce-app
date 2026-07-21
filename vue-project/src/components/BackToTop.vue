<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const visible = ref(false)
let scrollHandler = null

onMounted(() => {
    scrollHandler = () => {
        visible.value = window.scrollY > 400
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
    <transition name="btt-fade">
        <button
            v-if="visible"
            @click="scrollToTop"
            class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-ink text-paper shadow-lg hover:bg-accent hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
            aria-label="Scroll to top"
        >
            <ArrowUp class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span class="absolute -top-8 right-0 bg-ink text-paper text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Back to top
            </span>
        </button>
    </transition>
</template>

<style scoped>
.btt-fade-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.btt-fade-leave-active { transition: all 0.2s ease; }
.btt-fade-enter-from { opacity: 0; transform: translateY(20px) scale(0.8); }
.btt-fade-leave-to { opacity: 0; transform: translateY(20px) scale(0.8); }
</style>
