<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast.js'

const router = useRouter()
const auth = useAuthStore()
const {success, error} = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)


async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    success('✅ Login successful! Redirecting...')
    await router.push({ path: '/', replace: true })
  } catch (e) {
    error.value = e.message || 'Login failed'
    error(`❌ ${error.value}`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
    <!-- Animated Gradient Overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(120deg,#00ffff33,#0080ff33,#ff00ff33)] bg-[length:400%_400%] animate-gradient opacity-40"></div>

    <!-- Floating Glass Card -->
    <div
        class="relative z-10 w-full max-w-md p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_#00ffff30] hover:shadow-[0_0_60px_#00ffff50] transition-transform duration-500 hover:scale-[1.02]"
    >
      <!-- Logo & Heading -->
      <div class="flex flex-col items-center mb-8 space-y-2">
        <div
            class="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_25px_#00ffff80]"
        >
          <LogIn class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
          Welcome Back
        </h1>
        <p class="text-sm text-white/60">Sign in to continue to your dashboard</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-white/80 mb-2">Email Address</label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
                id="email"
                v-model.trim="email"
                type="email"
                required
                placeholder="operator@system.io"
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-white/80 mb-2">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="••••••••"
                class="w-full pl-11 pr-11 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-cyan-100 transition"
                @click="showPassword = !showPassword"
                aria-label="Toggle password"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Forgot Password -->
        <div class="flex justify-end">
          <RouterLink
              to="/forgot-password"
              class="text-sm text-cyan-300 hover:text-cyan-100 underline underline-offset-4 transition"
          >
            Forgot password?
          </RouterLink>
        </div>

        <!-- Sign In Button -->
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
          <span>{{ loading ? 'Authenticating...' : 'Sign In' }}</span>
        </button>

        <!-- Create Account -->
        <p class="text-center text-sm text-white/70 mt-4">
          New user?
          <RouterLink
              to="/register"
              class="text-cyan-300 hover:text-cyan-100 font-medium underline underline-offset-4 transition"
          >
            Create an account
          </RouterLink>
        </p>
      </form>
    </div>

    <!-- Floating Light Effects -->
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
