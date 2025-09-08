<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/useUser";
import { LogOut, User, Heart, Settings, SquarePlus } from "lucide-vue-next";

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="min-h-screen bg-[#e4e4e4] p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-4xl font-bold text-gray-800">DASHBOARD</h1>
        <button
          @click="handleLogout"
          class="flex items-center gap-2 bg-red-500 text-gray-100 px-5 py-3 rounded-lg shadow-sm hover:bg-red-400 transition-all duration-300">
          <LogOut class="w-6 h-6" />
          <span class="font-medium">Logout</span>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Profile Card -->
        <div
          class="bg-slate-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-blue-500"
          @click="router.push('/profile')">
          <User class="w-16 h-16 text-blue-500 mb-6" />
          <h2 class="text-2xl font-semibold mb-3">Profile</h2>
          <p class="text-gray-500">View and edit your personal information.</p>
        </div>
        <!-- Wishlist Card -->
        <div
          class="bg-slate-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-pink-500"
          @click="router.push('/wishlist')">
          <Heart class="w-16 h-16 text-pink-500 mb-6" />
          <h2 class="text-2xl font-semibold mb-3">Wishlist</h2>
          <p class="text-gray-500">Manage your saved items.</p>
        </div>
        <!-- Settings Card -->
        <div
          class="bg-slate-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-gray-500"
          @click="router.push('/settings')">
          <Settings class="w-16 h-16 text-gray-500 mb-6" />
          <h2 class="text-2xl font-semibold mb-3">Settings</h2>
          <p class="text-gray-500">Configure your application settings.</p>
        </div>
        <!-- Manage product -->
        <div 
          class="bg-slate-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-green-500" 
          @click="router.push('/addproduct')">
          <SquarePlus class="w-16 h-16 text-green-500 mb-6"/>
          <h2 class="text-2xl font-semibold mb-3">Manage Product</h2>
          <p class="text-gray-500">Manage our products items</p> 
        </div>
      </div>
    </div>
  </div>
</template>
