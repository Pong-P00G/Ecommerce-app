<script setup>
import './assets/App.css';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { useUserStore } from './stores/useUser';

onMounted(() => {
    const userStore = useUserStore();
    userStore.loadFromLocalStorage();
});
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <Navbar />
        <div class="flex flex-1">
            <div class="flex-1">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </div>
        <Footer />
    </div>
</template>