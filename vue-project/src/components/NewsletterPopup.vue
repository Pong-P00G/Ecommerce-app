<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { X, Mail, Sparkles, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-vue-next'

const POPUP_KEY = 'alie_newsletter_popup_v1'

const visible = ref(false)
const email = ref('')
const subscribing = ref(false)
const subscribed = ref(false)
const error = ref('')

let popupTimer = null
let exitHandler = null

onMounted(() => {
    const dismissed = localStorage.getItem(POPUP_KEY)
    if (dismissed) return

    popupTimer = setTimeout(() => {
        visible.value = true
    }, 30000)

    exitHandler = (e) => {
        if (e.clientY <= 0) {
            visible.value = true
            document.removeEventListener('mouseleave', exitHandler)
            exitHandler = null
        }
    }
    document.addEventListener('mouseleave', exitHandler)
})

onUnmounted(() => {
    if (popupTimer) {
        clearTimeout(popupTimer)
        popupTimer = null
    }
    if (exitHandler) {
        document.removeEventListener('mouseleave', exitHandler)
        exitHandler = null
    }
})

const dismiss = () => {
    visible.value = false
    localStorage.setItem(POPUP_KEY, 'dismissed')
}

const submit = async () => {
    if (!email.value || !email.value.includes('@')) {
        error.value = 'Please enter a valid email address'
        return
    }
    subscribing.value = true
    error.value = ''
    try {
        await new Promise(r => setTimeout(r, 1200))
        subscribed.value = true
        setTimeout(() => { dismiss() }, 3000)
    } catch {
        error.value = 'Something went wrong. Please try again.'
    } finally {
        subscribing.value = false
    }
}
</script>

<template>
    <transition name="popup-fade">
        <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="dismiss">
            <div class="absolute inset-0 bg-ink/60 backdrop-blur-sm"></div>
            <div class="relative bg-paper rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-popup-in">
                <button @click="dismiss"
                    class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-ink transition-colors">
                    <X class="w-4 h-4" />
                </button>
                <div class="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -mr-24 -mt-24"></div>
                <div class="absolute bottom-0 left-0 w-36 h-36 bg-accent/5 rounded-full -ml-18 -mb-18"></div>

                <div class="relative p-8 sm:p-10 text-center">
                    <template v-if="subscribed">
                        <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle class="w-8 h-8 text-success" />
                        </div>
                        <h3 class="text-2xl font-elegant font-bold text-ink mb-2">You're in!</h3>
                        <p class="text-neutral-500">Thanks for subscribing. Check your inbox for a welcome surprise.</p>
                    </template>

                    <template v-else>
                        <div class="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                            <Mail class="w-8 h-8 text-accent" />
                        </div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full text-xs font-bold text-accent uppercase tracking-wider mb-4">
                            <Sparkles class="w-3.5 h-3.5" />
                            Exclusive offer
                        </div>
                        <h3 class="text-2xl sm:text-3xl font-elegant font-bold text-ink mb-2">Get 10% off your first order</h3>
                        <p class="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
                            Join our newsletter and be the first to know about new arrivals, exclusive sales, and styling inspiration.
                        </p>

                        <form @submit.prevent="submit" class="space-y-3">
                            <div class="relative">
                                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input v-model="email" type="email" required placeholder="Enter your email"
                                    class="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all" />
                            </div>
                            <p v-if="error" class="text-xs text-danger flex items-center gap-1 justify-center">
                                <AlertCircle class="w-3 h-3" />
                                {{ error }}
                            </p>
                            <button type="submit" :disabled="subscribing" class="btn-accent w-full py-3.5 shine-effect">
                                <Loader2 v-if="subscribing" class="w-4 h-4 animate-spin" />
                                <Sparkles v-else class="w-4 h-4" />
                                {{ subscribing ? 'Subscribing...' : 'Get 10% off' }}
                                <ArrowRight v-if="!subscribing" class="w-4 h-4" />
                            </button>
                        </form>

                        <p class="mt-4 text-[11px] text-neutral-400">
                            No spam, ever. Unsubscribe anytime.
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.popup-fade-enter-active,
.popup-fade-leave-active { transition: all 0.3s ease; }
.popup-fade-enter-from,
.popup-fade-leave-to { opacity: 0; }
.animate-popup-in {
    animation: popupIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes popupIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
