<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import CookieConsent from './components/CookieConsent.vue'
import BackToTop from './components/BackToTop.vue'
import SearchOverlay from './components/SearchOverlay.vue'
import { useUIStore } from './stores/ui.js'

const ui = useUIStore()
</script>

<template>
    <div class="min-h-screen font-sans antialiased">
        <RouterView v-slot="{ Component, route }">
            <Transition name="page" mode="out-in">
                <component :is="Component" :key="route.path" />
            </Transition>
        </RouterView>
        
        <!-- Global Components -->
        <CookieConsent />
        <BackToTop />
        <SearchOverlay :show="ui.searchOpen" @close="ui.closeSearch()" />
        <ToastContainer />
    </div>
</template>