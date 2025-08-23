<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const remember = ref(false);
const successful = ref('');
const error = ref('');

const handleLogin = (e) => {
    e.preventDefault();
    const storeduser = localStorage.getItem('userInfo');
    if (!storeduser) {
        error.value = 'No account found. Please register first.';
        return;
    }
    const userInfo = JSON.parse(storeduser);
    if (userInfo.username !== username.value || userInfo.password !== password.value) {
        error.value = 'Try again later...!';
        return;
    }
    error.value = '';
    localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
    if (remember.value) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username: username.value }));
    } else {
        localStorage.removeItem('rememberedUser');
    }
    const adminCredentials = { username: 'admin', password: 'admin' };
    if (username.value === adminCredentials.username && password.value === adminCredentials.password) {
        router.push('/Dashboard');
        return;
    }
    successful.value = 'Login successful!';
    setTimeout(() => {
        successful.value = '';
        router.push('/profile'); 
    }, 500);
};

</script>

<template>
    <div>
        <!-- Bubble background -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="bubble absolute top-20 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
            <div class="bubble delay-2s absolute top-40 right-40 w-32 h-32 bg-purple-500 rounded-full opacity-10"></div>
            <div class="bubble delay-3s absolute bottom-10 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-10"></div>
            <div class="bubble delay-4s absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full opacity-10"></div>
        </div>
        <form @submit="handleLogin" class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
            <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-md w-96">
                <h1 class="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h1>
                <input 
                    type="text" 
                    v-model="username" 
                    placeholder="Username" 
                    required 
                    class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300  transition"
                />
                <input 
                    type="password" 
                    v-model="password" 
                    placeholder="Password" 
                    required 
                    class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300  transition"
                />
                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between mt-3 mb-4">
                    <div class="flex items-center">
                        <input
                            id="remember"
                            v-model="remember"
                            name="remember"
                            type="checkbox"
                            class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"/>
                        <label for="remember" class="ml-2 block text-sm text-gray-200">
                        Remember me
                        </label>
                    </div>
                    <div class="text-sm">
                        <router-link
                            to="/forgotPassword"
                            class="font-medium text-red-600 hover:text-red-400">
                        Forgot your password ?
                        </router-link>
                    </div>
                </div>
                <button 
                    type="submit" 
                    class="w-full bg-gradient-to-r from-blue-900 via-purple-900 to-pink-700 text-white px-4 py-3 font-semibold rounded-lg transition duration-300 mb-4 transform hover:scale-105">
                    Login
                </button>
                <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
                <div v-if="successful" class="text-green-500 text-center mb-4">{{ successful }}</div>
                <div>
                    <router-link to="/register" class="text-center text-gray-200 font-medium mt-6">
                        Don't have an account?<span class="text-blue-500 hover:border-b-2">Create one now</span>
                    </router-link>
                </div>
            </div>
        </form>
    </div>
</template>