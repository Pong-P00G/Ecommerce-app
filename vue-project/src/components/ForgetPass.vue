<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const email = ref('');
const newPassword = ref('');
const error = ref('');
const success = ref('');

function handleReset(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || user.email !== email.value) {
        error.value = 'Email not found!';
        success.value = '';
        return;
    }
    user.password = newPassword.value;
    localStorage.setItem('userInfo', JSON.stringify(user));
    success.value = 'Password reset successful. You can log in now.';
    error.value = '';
}
</script>

<template>
    <div class="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div class="fixed inset-0 pointer-events-none">
            <div class="bubble absolute w-20 h-20 bg-blue-500 rounded-full opacity-20 top-20 left-20"></div>
            <div class="bubble absolute w-32 h-32 bg-purple-500 rounded-full opacity-20 top-40 right-40"></div>
            <div class="bubble absolute w-16 h-16 bg-green-500 rounded-full opacity-20 bottom-10 right-1/4"></div>
            <div class="bubble absolute w-24 h-24 bg-pink-500 rounded-full opacity-20 bottom-20 left-1/3"></div>
        </div>
        <!-- Sparkles -->
        <div class="fixed inset-0 pointer-events-none">
            <div v-for="n in 40" :key="n" class="sparkle"></div>
        </div>
        <!-- Forgot Password Form -->
        <form @submit="handleReset" class="flex items-center justify-center min-h-screen">
            <div class="bg-white/10 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl w-92 border border-white/20 hover:shadow-purple-700/50 transition duration-500 animate-fade-slide card-hover">
                <!-- Title -->
                <h2
                class="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                    Forgot Password
                </h2>
                <!-- Email Input -->
                <input v-model="email" type="email" placeholder="Your email" class="text-gray-200 placeholder-gray-400 mb-4 p-3 border border-gray-500/30 rounded-lg w-full bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-lg transition duration-300"/>
                <!-- Password Input -->
                <input v-model="newPassword" type="password" placeholder="New Password" class="text-gray-200 placeholder-gray-400 mb-4 p-3 border border-gray-500/30 rounded-lg w-full bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg transition duration-300"/>
                <!-- Messages -->
                <p v-if="error" class="text-red-400 font-medium mb-4 animate-shake">{{ error }}</p>
                <p v-if="success" class="text-green-400 font-medium mb-4 animate-fade-in">{{ success }}</p>
                <!-- Reset Button -->
                <button type="submit" class="w-full px-4 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 bg-[length:200%_100%] hover:bg-right transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-700/40">
                    Reset Password
                </button>
                <!-- Back to Login -->
                <div class="text-center text-gray-300 font-medium mt-6">
                    <RouterLink to="/login" class="text-blue-400 hover:text-pink-400 transition duration-300 hover:underline">
                        Back to Login
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
/* Card entrance animation */
@keyframes fade-slide {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-slide {
    animation: fade-slide 0.8s ease-out forwards;
}

/* Shake for errors */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
}
.animate-shake {
    animation: shake 0.4s ease-in-out;
}

/* Fade-in for success */
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
.animate-fade-in {
    animation: fade-in 0.6s ease-in-out;
}

/* Floating bubbles */
@keyframes float {
    0% { transform: translateY(0) translateX(0); opacity: 0.2; }
    50% { transform: translateY(-20px) translateX(5px); opacity: 0.25; }
    100% { transform: translateY(-40px) translateX(-5px); opacity: 0.2; }
}
.bubble {
    animation: float 12s ease-in-out infinite alternate;
}

/* Sparkle particles */
@keyframes sparkle {
    0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
    50% { opacity: 0.8; transform: translate(5px, -5px) scale(1); }
    100% { opacity: 0; transform: translate(-5px, 5px) scale(0.5); }
}
.sparkle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    opacity: 0;
    top: calc(100% * var(--random-top));
    left: calc(100% * var(--random-left));
    animation: sparkle calc(2s + var(--random-duration)) infinite ease-in-out;
}

/* Generate random positions for sparkles */
.sparkle:nth-child(n) {
    --random-top: calc(var(--i) * 0.025);
    --random-left: calc(var(--i) * 0.03);
    --random-duration: calc(1s + var(--i) * 0.05s);
}

/* Card hover effect */
.card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 25px rgba(129, 140, 248, 0.4);
}
</style>
