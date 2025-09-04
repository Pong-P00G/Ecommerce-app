<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../../api/api"; // Import login from api.js

const router = useRouter();
const email = ref("")
const password = ref("");
const remember = ref(false);
const error = ref("");
const successful = ref("");

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await login({ 
            email: email.value, 
            password: password.value,
        });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        if (remember.value) {
            localStorage.setItem("rememberedUser", JSON.stringify({ email: email.value })); 
        } 
        else {
          localStorage.removeItem("rememberedUser");
        }
        successful.value = "Login successful!";
        setTimeout(() => {
            if (res.data.admin) {
              router.push('/dashboard');
            } else {
              router.push("/profile");
            }
        }, 500);
    } catch (err) {
        error.value = err.response?.data?.message || "Login failed";
    }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="fixed inset-0 pointer-events-none">
      <div class="bubble absolute w-20 h-20 bg-blue-500 rounded-full opacity-20 top-20 left-20"></div>
      <div class="bubble absolute w-32 h-32 bg-purple-500 rounded-full opacity-20 top-40 right-40"></div>
      <div class="bubble absolute w-16 h-16 bg-green-500 rounded-full opacity-20 bottom-10 right-1/4"></div>
      <div class="bubble absolute w-24 h-24 bg-pink-500 rounded-full opacity-20 bottom-20 left-1/3"></div>
    </div>
    <!-- Container -->
    <form @submit="handleLogin"
      class="relative p-6 sm:p-8 w-[370px] max-w-md
        bg-gray-900/70 backdrop-blur-xl border border-gray-700/50
        rounded-2xl shadow-2xl text-white
        animate-fade-slide card-hover-login">
      <!-- Floating glow -->
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-pink-500/20 blur-2xl opacity-30 -z-10"></div>
      <!-- Title -->
      <h1 class="text-3xl sm:text-4xl font-extrabold mb-8 text-center tracking-wide
        bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
        Welcome Back
      </h1>
      <!-- Email -->
      <input 
        v-model="email" 
        placeholder="Email or Username" 
        required 
        class="w-full p-3 mb-4 rounded-lg bg-gray-800/70 text-white placeholder-gray-400
          border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-400
          transition duration-200 shadow-sm"/>
      <!-- Password -->
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required 
        class="w-full p-3 mb-5 rounded-lg bg-gray-800/70 text-white placeholder-gray-400
          border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-purple-400
          transition duration-200 shadow-sm"/>
    
      <!-- Remember + Forgot -->
      <div class="flex justify-between items-center mb-6 text-sm">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="remember" class="accent-blue-500" /> 
          <span class="text-gray-300">Remember me</span>
        </label>
        <router-link to="/forgotPassword" class="text-blue-400 hover:text-blue-300 transition">Forgot?</router-link>
      </div>
      <!-- Button -->
      <button 
        type="submit" 
        class="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold
          hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg
          transform hover:scale-[1.02] active:scale-[0.98]">
        Login
      </button>
      <!-- Error & Success Messages -->
      <div v-if="error" class="text-red-400 mt-4 text-center text-sm font-medium">{{ error }}</div>
      <div v-if="successful" class="text-green-400 mt-4 text-center text-sm font-medium">{{ successful }}</div>
      <!-- Register Redirect -->
      <div class="mt-6 text-center text-sm text-gray-400">
        Don’t have an account?
        <router-link to="/register" class="text-blue-400 hover:text-blue-300 font-medium transition"> Register</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
@keyframes fade-slide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-slide {
  animation: fade-slide 0.6s ease-out;
}

/* Card hover lift + glow */
.card-hover-login {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover-login:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.35),0 8px 18px rgba(139, 92, 246, 0.25);
}

/* Gradient text shimmer */
@keyframes gradient-move {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.animate-gradient {
  background-size: 200% auto;
  animation: gradient-move 4s linear infinite;
}
</style>
