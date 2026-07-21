<script setup>
import { ref, onMounted } from 'vue'
import { Cookie, X, Check, Settings2 } from 'lucide-vue-next'

const visible = ref(false)
const showDetails = ref(false)
const preferences = ref({
    essential: true,
    analytics: false,
    marketing: false,
})

const COOKIE_CONSENT_KEY = 'alie_cookie_consent_v1'

onMounted(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!saved) {
        setTimeout(() => { visible.value = true }, 1500)
    }
})

const acceptAll = () => {
    preferences.value = { essential: true, analytics: true, marketing: true }
    saveAndClose()
}

const acceptSelected = () => {
    saveAndClose()
}

const rejectAll = () => {
    preferences.value = { essential: true, analytics: false, marketing: false }
    saveAndClose()
}

const saveAndClose = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences.value))
    visible.value = false
    showDetails.value = false
}
</script>

<template>
    <transition name="cookie-slide">
        <div v-if="visible"
            class="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
            <div class="max-w-3xl mx-auto">
                <div class="bg-ink text-paper rounded-2xl p-5 sm:p-6 shadow-2xl border border-neutral-800">
                    <!-- Main view -->
                    <div v-if="!showDetails" class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                            <Cookie class="w-5 h-5 text-accent" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold mb-1">We value your privacy</p>
                            <p class="text-xs text-neutral-400 leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                                By clicking "Accept All", you consent to our use of cookies.
                            </p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0 flex-wrap">
                            <button @click="rejectAll"
                                class="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-paper transition-colors">
                                Reject all
                            </button>
                            <button @click="showDetails = true"
                                class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-paper border border-neutral-700 rounded-full hover:bg-neutral-800 transition-all">
                                <Settings2 class="w-3.5 h-3.5" />
                                Customize
                            </button>
                            <button @click="acceptAll"
                                class="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-accent rounded-full hover:bg-accent-600 transition-all shine-effect">
                                <Check class="w-3.5 h-3.5" />
                                Accept all
                            </button>
                        </div>
                    </div>

                    <!-- Customize view -->
                    <div v-else>
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <Cookie class="w-5 h-5 text-accent" />
                                <p class="text-sm font-bold">Cookie preferences</p>
                            </div>
                            <button @click="showDetails = false" class="text-neutral-400 hover:text-paper transition-colors">
                                <X class="w-4 h-4" />
                            </button>
                        </div>

                        <div class="space-y-3 mb-5">
                            <div class="flex items-center justify-between py-3 px-4 bg-neutral-900 rounded-xl">
                                <div>
                                    <p class="text-sm font-bold text-paper">Essential</p>
                                    <p class="text-xs text-neutral-400">Required for the website to function</p>
                                </div>
                                <span class="inline-flex items-center gap-1 text-xs text-neutral-500">
                                    <Check class="w-3 h-3 text-success" />
                                    Always on
                                </span>
                            </div>
                            <div class="flex items-center justify-between py-3 px-4 bg-neutral-900 rounded-xl">
                                <div>
                                    <p class="text-sm font-bold text-paper">Analytics</p>
                                    <p class="text-xs text-neutral-400">Help us understand site usage</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="preferences.analytics" class="sr-only peer" />
                                    <span class="w-10 h-5 bg-neutral-700 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-paper after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></span>
                                </label>
                            </div>
                            <div class="flex items-center justify-between py-3 px-4 bg-neutral-900 rounded-xl">
                                <div>
                                    <p class="text-sm font-bold text-paper">Marketing</p>
                                    <p class="text-xs text-neutral-400">Used for personalized ads</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="preferences.marketing" class="sr-only peer" />
                                    <span class="w-10 h-5 bg-neutral-700 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-paper after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></span>
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center justify-between gap-3">
                            <button @click="rejectAll" class="text-xs text-neutral-400 hover:text-paper transition-colors">Reject all</button>
                            <div class="flex items-center gap-2">
                                <button @click="acceptAll" class="px-4 py-2 text-xs font-bold border border-neutral-700 text-paper rounded-full hover:bg-neutral-800">Accept all</button>
                                <button @click="acceptSelected" class="px-4 py-2 text-xs font-bold text-white bg-accent rounded-full hover:bg-accent-600">Save preferences</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.cookie-slide-enter-active { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.cookie-slide-leave-active { transition: all 0.25s ease; }
.cookie-slide-enter-from { transform: translateY(100%); opacity: 0; }
.cookie-slide-leave-to { transform: translateY(100%); opacity: 0; }
</style>
