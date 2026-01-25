<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const identifier = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);

// Computed error from auth store
const error = computed(() => authStore.error);

const handleLogin = async () => {
  // Basic validation
  if (!identifier.value || !password.value) {
    authStore.error = 'Please enter both email/username and password';
    return;
  }

  loading.value = true;
  authStore.clearError();

  try {
    const result = await authStore.login({
      identifier: identifier.value,
      password: password.value
    });

    if (result.success) {
      // Optionally handle remember me
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect based on role_id (1 = Admin, 2 = User)
      if (authStore.user.role_id === 1) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  } catch (err) {
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] relative flex items-center justify-center px-4">
    <!-- Dotted background -->
    <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[18px_18px]"></div>

    <div class="relative w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
          <ShieldCheck class="h-7 w-7" />
        </div>
        <h1 class="text-2xl font-semibold text-gray-900">Welcome Back</h1>
        <p class="mt-1 text-sm text-gray-500">
          Elevate your experience with AlieeShop
        </p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-white p-8 shadow-lg">
        <!-- Error -->
        <div v-if="error"
          class="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 animate-shake">
          <AlertCircle class="h-5 w-5 shrink-0" />
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Identity -->
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Identity
            </p>
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="identifier" type="text" required placeholder="Email or Username" :disabled="loading"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>

          <!-- Security -->
          <div>
            <div class="mb-2 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Security
              </p>
            </div>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="Password"
                :disabled="loading"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
              <button type="button" @click="showPassword = !showPassword" :disabled="loading"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
            <RouterLink to="/forgotPassword"
              class="inline-block mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot Password?
            </RouterLink>
          </div>

          <!-- Remember -->
          <div class="flex items-center gap-3 px-1">
            <label class="relative flex items-center mt-1 cursor-pointer group">
              <input v-model="rememberMe" type="checkbox" class="peer sr-only" :disabled="loading" />
              <div
                class="w-5 h-5 border-2 border-gray-200 rounded-lg group-hover:border-indigo-400 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200 peer-disabled:opacity-50">
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform duration-200">
                <CheckCircle2 class="w-3.5 h-3.5" />
              </div>
            </label>
            <span class="text-sm font-medium text-gray-600">
              Remember Me
            </span>
          </div>

          <!-- Button -->
          <button type="submit" :disabled="loading || !identifier || !password"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
            <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
            <span v-else class="flex items-center gap-2">
              Authenticate
              <ArrowRight class="h-4 w-4" />
            </span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="mt-6 mb-8 text-center text-sm font-bold text-gray-500">
        New to the platform?
        <RouterLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-700">
          Sign Up
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.4s ease-in-out 0s 2;
}

.bg-size-\[18px_18px\] {
  background-size: 18px 18px;
}
</style>