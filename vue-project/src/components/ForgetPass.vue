<script setup>
    import { ref } from 'vue';
import { useRouter } from 'vue-router';

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
        return;
    }

    user.password = newPassword.value;
    localStorage.setItem('userInfo', JSON.stringify(user));
    success.value = 'Password reset successful. You can log in now.';
    error.value = '';
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
        <form @submit="handleReset" class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
            <div class="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-md w-96">
                <h2 class="text-3xl font-bold mb-6 text-center text-white">Forgot Password</h2>
                <input v-model="email" placeholder="Your email" 
                class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                <input v-model="newPassword" type="password" placeholder="New Password" 
                class="text-gray-100 mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"/>
                <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
                <p v-if="success" class="text-green-500 mb-4">{{ success }}</p>
                <button type="submit" class="w-full bg-gradient-to-r from-blue-900 via-purple-900 to-pink-700 text-white px-4 py-3 font-semibold rounded-lg transition duration-300 transform hover:scale-105 mb-4">
                    Reset Password
                </button>
                <div class="text-center text-gray-200 font-medium mt-4">
                    <router-link to="/login" class="text-blue-500 hover:border-b-2">Back to Login</router-link>
                </div>
            </div>
        </form>
    </div>
</template>