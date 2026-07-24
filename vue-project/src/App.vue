<script setup>
import { watch } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import CookieConsent from './components/CookieConsent.vue'
import BackToTop from './components/BackToTop.vue'
import SearchOverlay from './components/SearchOverlay.vue'
import { useAuthStore } from './stores/auth.js'
import { useUIStore } from './stores/ui.js'

const router = useRouter()
const authStore = useAuthStore()
const ui = useUIStore()

// ── Re-evaluate route after auth init completes ────────────────────────
// The router's beforeEach guard is deferred during init (initialized = false).
// Once init finishes, we re-navigate to the current URL so the guard runs
// again with the real auth state (authenticated or not).
watch(() => authStore.initialized, (val) => {
    if (val) {
        router.replace(router.currentRoute.value.fullPath);
    }
});
</script>

<template>
    <div class="min-h-screen font-sans antialiased">
        <!-- ── Auth Loading Overlay ──────────────────────────── -->
        <Transition name="auth-loading">
            <div v-if="!authStore.initialized"
                class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
                <div class="flex flex-col items-center gap-6">
                    <!-- Logo -->
                    <div class="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <!-- Spinner -->
                    <div class="relative w-10 h-10">
                        <div class="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-transparent border-t-zinc-900 rounded-full animate-spin"></div>
                    </div>
                    <p class="text-sm font-medium text-zinc-500">Loading your experience...</p>
                </div>
            </div>
        </Transition>

        <!-- ── Main App ─────────────────────────────────────── -->
        <div v-if="authStore.initialized">
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
    </div>
</template>

<style scoped>
.auth-loading-leave-active {
    transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
}
.auth-loading-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}
</style>