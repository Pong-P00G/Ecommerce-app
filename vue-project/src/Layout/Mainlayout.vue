<script setup>
import { ref } from 'vue'

const sidebarOpen = ref(false)
const nav = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Stock', to: '/manage-stock' },
    { label: 'User', to: '/manage-user' },
    { label: 'Analytic', to: '/analytics' },
    { label: 'Report', to: '/report' },
    { label: 'Add Product', to: '/add-product' },
]

</script>

<template>
    <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <!-- Top Bar -->
        <header class="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
            <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                <button
                    class="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
                    @click="sidebarOpen = !sidebarOpen"
                    aria-label="Toggle sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
                <div class="flex items-center gap-2">
                    <span class="text-lg font-semibold">Admin Dashboard</span>
                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">v1</span>
                </div>
                <div class="flex items-center gap-2">
                    <slot name="actions">
                        <ThemeToggle />
                        <button class="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Help</button>
                    </slot>
                </div>
            </div>
        </header>
        <!-- Mobile sidebar overlay -->
        <div v-if="sidebarOpen" class="fixed inset-0 z-20 bg-black/30 md:hidden" @click="sidebarOpen = false"></div>
        <div class="mx-auto grid max-w-9xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
            <!-- Sidebar -->
            <aside class="fixed inset-y-20 left-4 right-4 z-30 rounded-xl border border-gray-200 bg-white p-3 shadow-lg md:static md:inset-auto md:z-0 md:h-[calc(100vh-6rem)] md:self-start dark:border-gray-700 dark:bg-gray-800"
                :class="sidebarOpen ? 'block md:block' : 'hidden md:block'">
                <nav class="flex flex-col gap-1">
                    <RouterLink
                        v-for="item in nav"
                        :key="item.to"
                        :to="item.to"
                        class="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                        active-class="bg-gray-100 text-gray-900 font-medium dark:bg-gray-700 dark:text-white"
                        @click="sidebarOpen = false">
                        {{ item.label }}
                    </RouterLink>
                </nav>
                <div class="mt-4 rounded-lg bg-linear-to-br from-indigo-50 to-purple-50 p-3 text-xs text-gray-600 dark:from-indigo-900/20 dark:to-purple-900/20 dark:text-gray-300">
                    <p class="font-medium text-gray-800 dark:text-gray-100">Tips</p>
                    <p>Use the sidebar to navigate between sections.</p>
                </div>
            </aside>
            <!-- Main content -->
            <main class="min-w-0">
                <div class="rounded-xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-700 dark:bg-gray-800">
                    <slot name="page-header">
                        <h1 class="mb-1 text-xl font-semibold tracking-tight">Overview</h1>
                        <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">Welcome to your admin panel.</p>
                    </slot> 
                    <section class="pt-4">
                        <RouterView />
                    </section>
                </div>
            </main>
        </div>
    </div>
</template>