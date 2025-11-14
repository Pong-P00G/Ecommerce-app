<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { register } from '@/api/api'
import { useToast } from '@/composables/useToast.js'

const router = useRouter()
const { error, success } = useToast()

const username = ref('')
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)


async function handleRegister(e) {
    e.preventDefault()

    if (password.value !== confirmPassword.value) {
        error('❌ Passwords do not match!')
        return
    }

    loading.value = true
    try {
        const fullname = `${firstname.value} ${lastname.value}`

        await register({
        username: username.value,
        firstname: firstname.value,
        lastname: lastname.value,
        fullname,
        email: email.value,
        password: password.value,
        })

        success('✅ Registration successful! Redirecting...')
        setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
        const msg = err.response?.data?.message || '❌ Registration failed'
        error(msg)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white p-6">
        <!-- Gradient animation overlay -->
        <div class="absolute inset-0 bg-[linear-gradient(120deg,#00ffff33,#0080ff33,#ff00ff33)] bg-[length:400%_400%] animate-gradient opacity-40"></div>

        <!-- Registration Card -->
        <div
            class="relative z-10 w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_#00ffff30] p-10 hover:shadow-[0_0_60px_#00ffff60] transition-all duration-500 hover:scale-[1.02]"
        >
        <h1 class="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg">
            Create Your Account
        </h1>

        <form @submit="handleRegister" class="grid grid-cols-1 gap-6">
            <!-- Username -->
            <div>
            <label class="block text-sm font-medium text-white/80 mb-2" for="username">Username</label>
            <input
                id="username"
                v-model="username"
                type="text"
                required
                placeholder="Mr. John"
                class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            </div>

            <!-- Firstname / Lastname -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-white/80 mb-2" for="firstname">First name</label>
                <input
                    id="firstname"
                    v-model="firstname"
                    type="text"
                    required
                    placeholder="John"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-white/80 mb-2" for="lastname">Last name</label>
                <input
                    id="lastname"
                    v-model="lastname"
                    type="text"
                    required
                    placeholder="Smith"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
            </div>
            </div>

            <!-- Email -->
            <div>
            <label class="block text-sm font-medium text-white/80 mb-2" for="email">Email</label>
            <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            </div>

            <!-- Password / Confirm -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-white/80 mb-2" for="password">Password</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-white/80 mb-2" for="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
            </div>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_25px_#00ffff70] hover:shadow-[0_0_40px_#00ffffa0] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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
            <span>{{ loading ? 'Creating account...' : 'Create account' }}</span>
            </button>

            <!-- Redirect -->
            <p class="text-center text-sm text-white/70 mt-4">
            Already have an account?
            <RouterLink
                to="/login"
                class="text-cyan-300 hover:text-cyan-100 font-medium underline underline-offset-4 transition"
            >
                Sign in
            </RouterLink>
            </p>
        </form>
        </div>

        <!-- Floating light effects -->
        <div class="absolute top-0 left-0 w-64 h-64 bg-cyan-400/20 blur-3xl rounded-full animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-700"></div>
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
