<script setup>
import { computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useUIStore } from '../stores/ui.js'

const ui = useUIStore()

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

onMounted(() => {
    applyHybridBehavior()
    window.addEventListener('resize', applyHybridBehavior)
})
</script>

<template>
    <div class="flex min-h-screen">
        <div class="flex flex-col min-h-screen transition-all duration-300 w-full">
            <Navbar />
            <main class="flex-1 bg-cyan-200" role="main">
                <router-view />
            </main>
            <Footer />
        </div>
    </div>
</template>
