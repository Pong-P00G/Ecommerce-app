<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

function handleRegister(e) {
    e.preventDefault();
    
    if (!username.value || !email.value || !password.value || !confirmPassword.value) {
        alert('Please fill in all fields.');
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.');
        return;
    }

    const userInfo = {
        username: username.value,
        email: email.value,
        password: password.value
    }

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    alert('Registration successful!');
    router.push('/login');
}


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
        <form @submit.prevent="handleRegister" class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
            <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-md w-96">
                <h1 class="text-3xl font-bold mb-6 text-center text-white">Register</h1>
                <input 
                    type="text" 
                    v-model="username" 
                    placeholder="Username" 
                    required 
                    class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                <input 
                    type="email" 
                    v-model="email" 
                    placeholder="Email" 
                    required 
                    class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                <input 
                    type="password" 
                    v-model="password" 
                    placeholder="Password" 
                    required 
                    class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                <input 
                    type="password" 
                    v-model="confirmPassword" 
                    placeholder="Confirm password" 
                    required 
                    class="text-gray-100 mb-6 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                <p v-if="error" class="text-red-500">{{ error }}</p>
                <button 
                    type="submit" 
                    class="w-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 text-white font-semibold px-4 py-3 rounded-lg transition duration-200 mb-4 transform hover:scale-105">
                    Register
                </button>
                <div>
                    <router-link to="/login" class="text-center text-gray-200 font-medium mt-6 ">
                        Have an account?<span class="text-blue-500 hover:underline"> Login here</span>
                    </router-link>
                </div>
            </div>
        </form>
    </div>
</template>