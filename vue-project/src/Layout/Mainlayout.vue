<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sidebarOpen = ref(true);
const showUserMenu = ref(false);
const showNotifications = ref(false);

const notifications = ref([
    { id: 1, type: 'order', message: 'New order #1005 received', time: '5 min ago', unread: true },
    { id: 2, type: 'stock', message: 'Low stock alert: Blue Sneakers', time: '12 min ago', unread: true },
    { id: 3, type: 'user', message: 'New customer registered', time: '23 min ago', unread: false }
]);

const navigation = [
    {
        label: 'Dashboard',
        to: '/admin/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
        label: 'Products',
        to: '/admin/manage-products',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
        label: 'Inventory',
        to: '/admin/manage-stock',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        badge: '5',
        badgeColor: 'bg-red-500'
    },
    {
        label: 'Users',
        to: '/admin/manage-user',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
        label: 'Analytics',
        to: '/admin/analytics',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
        label: 'Reports',
        to: '/admin/report',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    }
];

const unreadCount = computed(() =>
    notifications.value.filter(n => n.unread).length
);

const isActive = (path) => {
    return route.path === path;
};

const logout = () => {
    authStore.logout();
    router.push('/login');
};

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

const getNotificationIcon = (type) => {
    const icons = {
        order: '🛍️',
        stock: '📦',
        user: '👤'
    };
    return icons[type] || '🔔';
};
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-gray-100">
        <!-- Sidebar -->
        <aside :class="{
            'w-64': sidebarOpen,
            'w-20': !sidebarOpen
        }" class="hidden lg:flex lg:shrink-0 transition-all duration-300">
            <div class="flex flex-col w-full">
                <!-- Logo -->
                <div class="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
                    <div v-if="sidebarOpen" class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span class="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold text-gray-900">Admin</h1>
                            <p class="text-xs text-gray-500">Dashboard</p>
                        </div>
                    </div>
                    <div v-else class="w-full flex justify-center">
                        <div
                            class="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span class="text-white font-bold text-lg">A</span>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 px-3 py-4 bg-white overflow-y-auto">
                    <div class="space-y-1">
                        <router-link v-for="item in navigation" :key="item.to" :to="item.to" :class="{
                            'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30': isActive(item.to),
                            'text-gray-700 hover:bg-gray-100': !isActive(item.to)
                        }"
                            class="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200">
                            <svg class="shrink-0 w-6 h-6" :class="{
                                'mr-3': sidebarOpen
                            }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                            </svg>
                            <span v-if="sidebarOpen" class="flex-1">{{ item.label }}</span>
                            <span v-if="sidebarOpen && item.badge" :class="item.badgeColor || 'bg-blue-500'"
                                class="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white rounded-full">
                                {{ item.badge }}
                            </span>
                        </router-link>
                    </div>
                </nav>

                <!-- Sidebar Footer -->
                <div class="shrink-0 p-4 bg-linear-to-br from-gray-50 to-blue-50 border-t border-gray-200">
                    <div v-if="sidebarOpen" class="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                        <div
                            class="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-semibold text-sm">{{
                                authStore.user?.username?.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-900 truncate">{{ authStore.user?.username }}</p>
                            <p class="text-xs text-gray-500 truncate">Administrator</p>
                        </div>
                    </div>
                    <div v-else class="flex justify-center">
                        <div
                            class="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-semibold text-sm">{{
                                authStore.user?.username?.charAt(0).toUpperCase() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Mobile Sidebar -->
        <div v-if="sidebarOpen" @click="sidebarOpen = false"
            class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"></div>

        <aside :class="{
            'translate-x-0': sidebarOpen,
            '-translate-x-full': !sidebarOpen
        }" class="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300">
            <!-- Mobile sidebar content (same as desktop) -->
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span class="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold text-gray-900">Admin</h1>
                            <p class="text-xs text-gray-500">Dashboard</p>
                        </div>
                    </div>
                    <button @click="sidebarOpen = false" class="lg:hidden">
                        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav class="flex-1 px-3 py-4 overflow-y-auto">
                    <div class="space-y-1">
                        <router-link v-for="item in navigation" :key="item.to" :to="item.to"
                            @click="sidebarOpen = false" :class="{
                                'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg': isActive(item.to),
                                'text-gray-700 hover:bg-gray-100': !isActive(item.to)
                            }" class="flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all">
                            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                            </svg>
                            <span class="flex-1">{{ item.label }}</span>
                            <span v-if="item.badge" :class="item.badgeColor || 'bg-blue-500'"
                                class="ml-auto px-2 py-0.5 text-xs font-bold text-white rounded-full">
                                {{ item.badge }}
                            </span>
                        </router-link>
                    </div>
                </nav>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Bar -->
            <header class="shrink-0 bg-white border-b border-gray-200 shadow-sm">
                <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    <!-- Left: Menu Toggle + Search -->
                    <div class="flex items-center gap-4">
                        <button @click="toggleSidebar"
                            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div class="hidden md:block">
                            <div class="relative">
                                <input type="text" placeholder="Search..."
                                    class="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Notifications + User -->
                    <div class="flex items-center gap-3">
                        <!-- Notifications -->
                        <div class="relative">
                            <button @click="showNotifications = !showNotifications"
                                class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span v-if="unreadCount > 0"
                                    class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <!-- Notifications Dropdown -->
                            <div v-if="showNotifications" @click.stop
                                class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                                <div class="p-4 border-b border-gray-200">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-bold text-gray-900">Notifications</h3>
                                        <span
                                            class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                            {{ unreadCount }} new
                                        </span>
                                    </div>
                                </div>
                                <div class="max-h-96 overflow-y-auto">
                                    <div v-for="notification in notifications" :key="notification.id"
                                        :class="{ 'bg-blue-50': notification.unread }"
                                        class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div class="flex items-start gap-3">
                                            <span class="text-2xl">{{ getNotificationIcon(notification.type) }}</span>
                                            <div class="flex-1">
                                                <p class="text-sm text-gray-900">{{ notification.message }}</p>
                                                <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                                            </div>
                                            <div v-if="notification.unread"
                                                class="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3 border-t border-gray-200">
                                    <button
                                        class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- User Menu -->
                        <div class="relative">
                            <button @click="showUserMenu = !showUserMenu"
                                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div
                                    class="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span class="text-white font-semibold text-sm">{{
                                        authStore.user?.username?.charAt(0).toUpperCase() }}</span>
                                </div>
                                <div class="hidden md:block text-left">
                                    <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.username }}</p>
                                    <p class="text-xs text-gray-500">Admin</p>
                                </div>
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- User Dropdown -->
                            <div v-if="showUserMenu" @click.stop
                                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                                <div class="p-2">
                                    <button
                                        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </button>
                                    <button
                                        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </button>
                                </div>
                                <div class="border-t border-gray-200 p-2">
                                    <button @click="logout"
                                        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                <router-view />
            </main>
        </div>
        <!-- Click outside to close dropdowns -->
        <div v-if="showUserMenu || showNotifications" @click="showUserMenu = false; showNotifications = false"
            class="fixed inset-0 z-40">
        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>