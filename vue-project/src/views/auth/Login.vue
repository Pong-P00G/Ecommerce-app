<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../../api/api"; // Import login from api.js

const router = useRouter();
const email = ref(""); // Changed from username to email
const password = ref("");
const remember = ref(false);
const error = ref("");
const successful = ref("");

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await login({ // Using api.login
            email: email.value, // Changed from username to email
            password: password.value,
        });

        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (remember.value) {
            localStorage.setItem("rememberedUser", JSON.stringify({ email: email.value })); // Changed username to email
        } else {
            localStorage.removeItem("rememberedUser");
        }

        successful.value = "Login successful!";
        setTimeout(() => {
            router.push("/profile");
        }, 500);
    } catch (err) {
        error.value = err.response?.data?.message || "Login failed";
    }
};
</script>

<template>
    <form @submit="handleLogin" class="p-8 bg-gray-800 text-white rounded-xl w-96 mx-auto mt-20">
        <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
        <input v-model="email" placeholder="Email" required class="w-full p-3 mb-3 rounded text-black" /> <!-- Changed v-model and placeholder -->
        <input v-model="password" type="password" placeholder="Password" required class="w-full p-3 mb-3 rounded text-black" />
        <div class="flex justify-between items-center mb-4">
            <label class="flex items-center gap-2">
                <input type="checkbox" v-model="remember" /> Remember me
            </label>
            <router-link to="/forgotPassword" class="text-sm text-blue-400">Forgot?</router-link>
        </div>
        <button type="submit" class="w-full bg-blue-600 p-3 rounded hover:bg-blue-500">Login</button>
        <div v-if="error" class="text-red-400 mt-3 text-center">{{ error }}</div>
        <div v-if="successful" class="text-green-400 mt-3 text-center">{{ successful }}</div>
        <div class="mt-4 text-center">
            Don’t have an account?
            <router-link to="/register" class="text-blue-400">Register</router-link>
        </div>
    </form>
</template>
