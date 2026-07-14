<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
    <div class="min-h-screen font-sans antialiased">
        <RouterView v-slot="{ Component, route }">
            <Transition name="page" mode="out-in">
                <component :is="Component" :key="route.path" />
            </Transition>
        </RouterView>
        <ToastContainer />
    </div>
</template>