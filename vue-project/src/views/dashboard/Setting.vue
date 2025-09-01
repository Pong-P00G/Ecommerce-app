<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { User, Heart, Menu, X } from "lucide-vue-next";

const isSidebarOpen = ref(false);
const screenWidth = ref(window.innerWidth);

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
}

function updateWidth() {
    screenWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
    window.removeEventListener("resize", updateWidth);
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 p-4 flex justify-center items-start">
        <div class="bg-white/10 backdrop-blur-xl shadow-lg rounded-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden relative">
            <!-- Mobile Header -->
            <div class="flex items-center justify-between p-4 md:hidden">
                <h2 class="text-xl font-semibold text-white drop-shadow-md">Settings</h2>
                <button
                    @click="toggleSidebar"
                    class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                    <Menu v-if="!isSidebarOpen" class="w-6 h-6 text-white" />
                    <X v-else class="w-6 h-6 text-white" />
                </button>
            </div>
            <!-- Dark Overlay (Mobile Only) -->
            <transition name="fade">
                <div v-if="isSidebarOpen && screenWidth < 768" class="fixed inset-0 bg-black/50 z-40 md:hidden" @click="isSidebarOpen = false"></div>
            </transition>
            <!-- Sidebar -->
            <transition name="slide">
                <div v-show="isSidebarOpen || screenWidth >= 768"
                class="fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-1/4 bg-white/95 md:bg-gray-50/95 border-r border-gray-200 p-6 flex flex-col z-50 md:z-0 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out"
                :style="{ transform: isSidebarOpen || screenWidth >= 768 ? 'translateX(0)' : 'translateX(-100%)' }">
                    <h2 class="hidden md:block text-2xl font-semibold mb-6 text-gray-800">
                        Settings
                    </h2>
                    <nav class="space-y-3 flex-1">
                        <RouterLink
                            to="/profile"
                            class="flex items-center w-full px-4 py-2 rounded-lg transition hover:bg-blue-100 text-gray-800"
                            active-class="bg-blue-500 text-white shadow"
                            @click="isSidebarOpen = false">
                            <User class="w-5 h-5 mr-2" /> Profile
                        </RouterLink>
                        <RouterLink
                            to="/WishList"
                            class="flex items-center w-full px-4 py-2 rounded-lg transition hover:bg-blue-100 text-gray-800"
                            active-class="bg-blue-500 text-white shadow"
                            @click="isSidebarOpen = false">
                            <Heart class="w-5 h-5 mr-2" /> Wishlist
                        </RouterLink>
                    </nav>
                </div>
            </transition>
            <!-- Content -->
            <section class="flex-1 p-4 md:p-6">
                <RouterView v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </RouterView>
            </section>
        </div>
    </div>
</template>
