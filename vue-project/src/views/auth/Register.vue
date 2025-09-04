<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../../api/api"; // Import register from api.js


const router = useRouter();
const username = ref("");
const fullname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const successful = ref("");

const handleRegister = async (e) => {
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match!";
        return;
    }
    try {
    const res = await register({ // Using api.register
        username: username.value,
        fullname: fullname.value,
        email: email.value,
        password: password.value,
    });

    successful.value = "Registration successful!";
    error.value = "";

    setTimeout(() => {
        router.push("/login");
    }, 1000);
    } catch (err) {
        error.value = err.response?.data?.message || "Registration failed";
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
        <form @submit="handleRegister" 
            class="p-6 sm:p-8 w-[370px] max-w-md mx-auto mt-8 mb-16 sm:mt-20
                bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80
                backdrop-blur-lg border border-gray-700/50
                rounded-2xl shadow-2xl text-white
                animate-fade-slide card-hover">
            <!-- Title -->
            <h1 class="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center tracking-wide
                bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Register
            </h1>
            <!-- Username -->
            <input 
                v-model="username" 
                placeholder="Username" 
                required 
                class="w-full p-3 mb-3 sm:mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-300
                    border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <!-- Fullname -->
            <input 
                v-model="fullname" 
                placeholder="Fullname" 
                required 
                class="w-full p-3 mb-3 sm:mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-300
                    border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            />
            <!-- Email -->
            <input 
                v-model="email" 
                type="email" 
                placeholder="Email" 
                required 
                class="w-full p-3 mb-3 sm:mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-300
                    border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <!-- Password -->
            <input 
                v-model="password" 
                type="password" 
                placeholder="Password" 
                required 
                class="w-full p-3 mb-3 sm:mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-300
                    border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
            <!-- Confirm Password -->
            <input 
                v-model="confirmPassword" 
                type="password" 
                placeholder="Confirm Password" 
                required 
                class="w-full p-3 mb-3 sm:mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-300
                    border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
            <!-- Register Button -->
            <button 
                type="submit" 
                class="w-full p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 font-semibold
                hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg">
                Register
            </button>
            <!-- Error & Success Messages -->
            <div v-if="error" class="text-red-400 mt-4 text-center text-sm font-medium">{{ error }}</div>
            <div v-if="successful" class="text-green-400 mt-4 text-center text-sm font-medium">{{ successful }}</div>
            <!-- Login Redirect -->
            <div class="mt-5 text-center text-sm">
                Already have an account?
                <router-link to="/login" class="text-blue-400 hover:underline font-medium">Login</router-link>
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

/* Hover lift + glow */
.card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4); /* emerald glow */
}
</style>

