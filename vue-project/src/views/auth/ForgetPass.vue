<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { forgotPassword } from '@/api/api.js'
import { useToast } from '@/composables/useToast.js'

const email = ref('')
const loading = ref(false)
const { error, success } = useToast()

async function onSubmit() {
    if (!email.value) {
        error('❌ Please enter your email')
        return
    }

    loading.value = true
    try {
        await forgotPassword({ email: email.value })
        success('✅ If an account exists, a reset link has been sent to your email.')
        email.value = ''
    } catch (err) {
        const msg = err.response?.data?.message || '❌ Failed to send reset link'
        error(msg)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-fuchsia-900 via-rose-900 to-indigo-950 p-6"
    >
        <!-- Background gradient animation -->
        <div
            class="absolute inset-0 bg-[linear-gradient(120deg,#ff66cc33,#ff336633,#6633ff33)] bg-[length:400%_400%] animate-gradient opacity-40"
        ></div>

        <!-- Card -->
        <div
            class="relative z-10 w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_#ff66cc40] p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_#ff66cc80]"
        >
        <h1 class="text-3xl font-bold text-white text-center mb-3">Forgot your password?</h1>
        <p class="text-sm text-white/70 text-center mb-8">
            Enter your email and we’ll send you a password reset link.
        </p>

        <form @submit.prevent="onSubmit" class="space-y-6">
            <div>
            <label for="email" class="block text-sm font-medium text-white/80 mb-2">Email address</label>
            <input
                id="email"
                v-model.trim="email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all"
            />
            </div>

            <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-600 shadow-[0_0_25px_#ff66cc60] hover:shadow-[0_0_40px_#ff66cc90] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
            <svg
                v-if="loading"
                class="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
            </svg>
            <span>{{ loading ? 'Sending...' : 'Send reset link' }}</span>
            </button>

            <p class="text-center text-sm text-white/80 mt-4">
            Remembered your password?
            <RouterLink
                to="/login"
                class="text-pink-300 hover:text-pink-100 font-medium underline underline-offset-4 transition"
            >
                Go back to sign in
            </RouterLink>
            </p>
        </form>
        </div>

        <!-- Floating light effects -->
        <div class="absolute top-0 left-0 w-72 h-72 bg-pink-400/20 blur-3xl rounded-full animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/30 blur-3xl rounded-full animate-pulse delay-700"></div>
    </div>
</template>

<style scoped>
@keyframes gradient {
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
.animate-gradient {
    animation: gradient 8s ease infinite;
}
</style>