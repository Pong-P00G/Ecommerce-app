<script setup>
import { computed, onMounted, ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useUIStore } from '../stores/ui.js'

const ui = useUIStore()
const scrolled = ref(false)

const logoText = computed(() => (ui.expanded ? 'Alie Shop' : 'AS'))

// Hybrid breakpoint behavior
const applyHybridBehavior = () => {
    const w = window.innerWidth
    if (w < 768) {
        ui.setExpanded(false)
        ui.setSidebarVisible(false)
    } else if (w >= 768 && w < 1024) {
        ui.setExpanded(false)
        ui.setSidebarVisible(false)
    } else {
        ui.setExpanded(true)
        ui.setSidebarVisible(false)
    }
}

const handleScroll = () => {
    scrolled.value = window.scrollY > 0
}

onMounted(() => {
    applyHybridBehavior()
    window.addEventListener('resize', applyHybridBehavior)
    window.addEventListener('scroll', handleScroll)
})
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <Navbar />
        <main class="flex-1 pt-20" role="main">
            <div class="min-h-screen bg-linear-to-br from-white via-gray-50 to-blue-50">
                <router-view />
            </div>
        </main>
        <Footer />
    </div>
</template>

<style scoped>
main {
    scroll-behavior: smooth;
}</style>
