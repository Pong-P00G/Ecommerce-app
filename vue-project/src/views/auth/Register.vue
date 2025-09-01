<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../../api/api"; // Import register from api.js


const router = useRouter();
const username = ref("");
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
    <form @submit="handleRegister" class="p-8 bg-gray-800 text-white rounded-xl w-96 mx-auto mt-20">
        <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
        <input v-model="username" placeholder="Username" required class="w-full p-3 mb-3 rounded text-black" />
        <input v-model="email" type="email" placeholder="Email" required class="w-full p-3 mb-3 rounded text-black" />
        <input v-model="password" type="password" placeholder="Password" required class="w-full p-3 mb-3 rounded text-black" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required class="w-full p-3 mb-3 rounded text-black" />
        <button type="submit" class="w-full bg-green-600 p-3 rounded hover:bg-green-500">Register</button>
        <div v-if="error" class="text-red-400 mt-3 text-center">{{ error }}</div>
        <div v-if="successful" class="text-green-400 mt-3 text-center">{{ successful }}</div>
        <div class="mt-4 text-center">
            Already have an account?
            <router-link to="/login" class="text-blue-400">Login</router-link>
        </div>
    </form>
</template>
