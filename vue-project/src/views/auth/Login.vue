<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { LogIn, Eye, EyeOff } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast.js';

const router = useRouter();
const auth = useAuthStore();
const { success, error: toastError } = useToast();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref('');

async function onSubmit() {
  errorMsg.value = '';
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    success('✅ Login successful! Redirecting...');

    // Role-based redirect
    if (auth.user.role === 'admin') router.push('/dashboard');
    else router.push('/');
  } catch (e) {
    errorMsg.value = auth.error || e.message || 'Login failed';
    toastError(errorMsg.value);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 text-white">
    <div class="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg">
      <div class="flex flex-col items-center mb-6">
        <LogIn class="w-12 h-12 text-cyan-400 mb-2" />
        <h1 class="text-2xl font-bold">Welcome Back</h1>
        <p class="text-sm text-white/70">Sign in to your account</p>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-400" />
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-400" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400"
              @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <p v-if="errorMsg" class="text-red-400 text-sm text-center">{{ errorMsg }}</p>
        <button type="submit" :disabled="loading"
          class="w-full py-2 rounded-lg bg-cyan-400 text-black font-semibold flex justify-center items-center gap-2">
          <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
          </svg>
          <span>{{ loading ? 'Authenticating...' : 'Sign In' }}</span>
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-white/70">
        New user? <router-link to="/register" class="text-cyan-400 underline">Create an account</router-link>
      </p>
    </div>
  </div>
</template>
