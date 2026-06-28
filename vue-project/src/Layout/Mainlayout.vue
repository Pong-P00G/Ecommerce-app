<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import {
    LayoutDashboard,
    Package,
    Boxes,
    Users,
    BarChart3,
    FileText,
    Search,
    Bell,
    ChevronDown,
    LogOut,
    User as UserIcon,
    Settings,
    Menu,
    X,
    ShoppingBag,
    AlertTriangle,
    UserPlus,
    Sparkles,
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sidebarOpen = ref(true);
const showUserMenu = ref(false);
const showNotifications = ref(false);

const notifications = ref([
    { id: 1, type: 'order', message: 'New order #1005 received', time: '5 min ago', unread: true, icon: ShoppingBag },
    { id: 2, type: 'stock', message: 'Low stock alert: Blue Sneakers', time: '12 min ago', unread: true, icon: AlertTriangle },
    { id: 3, type: 'user', message: 'New customer registered', time: '23 min ago', unread: false, icon: UserPlus }
]);

const navigation = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', to: '/admin/manage-products', icon: Package },
    { label: 'Inventory', to: '/admin/manage-stock', icon: Boxes, badge: '5' },
    { label: 'Users', to: '/admin/manage-user', icon: Users },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
    { label: 'Reports', to: '/admin/report', icon: FileText }
];

const unreadCount = computed(() =>
    notifications.value.filter(n => n.unread).length
);

const isActive = (path) => route.path === path;

const logout = () => {
    authStore.logout();
    router.push('/login');
};

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-neutral-100">
        <!-- Sidebar (Desktop) -->
        <aside
            :class="sidebarOpen ? 'w-64' : 'w-20'"
            class="hidden lg:flex lg:shrink-0 transition-all duration-300"
        >
            <div class="flex flex-col w-full">
                <!-- Logo -->
                <div class="flex items-center justify-between h-16 px-5 bg-ink text-paper border-b border-neutral-800">
                    <div v-if="sidebarOpen" class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                            <Sparkles class="w-5 h-5 text-paper" />
                        </div>
                        <div>
                            <h1 class="text-base font-bold tracking-tight">Admin</h1>
                            <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">Dashboard</p>
                        </div>
                    </div>
                    <div v-else class="w-full flex justify-center">
                        <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                            <Sparkles class="w-5 h-5 text-paper" />
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 px-3 py-4 bg-paper overflow-y-auto">
                    <div class="space-y-1">
                        <router-link
                            v-for="item in navigation"
                            :key="item.to"
                            :to="item.to"
                            :class="[
                                'group flex items-center rounded-xl text-sm font-semibold transition-all duration-200',
                                sidebarOpen ? 'px-3 py-3' : 'px-0 py-3 justify-center',
                                isActive(item.to)
                                    ? 'bg-ink text-paper shadow-sm'
                                    : 'text-neutral-700 hover:bg-neutral-100'
                            ]"
                        >
                            <component :is="item.icon" :class="['shrink-0 w-5 h-5', sidebarOpen ? 'mr-3' : '']" />
                            <span v-if="sidebarOpen" class="flex-1">{{ item.label }}</span>
                            <span
                                v-if="sidebarOpen && item.badge"
                                class="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-accent text-paper text-[10px] font-bold rounded-full"
                            >
                                {{ item.badge }}
                            </span>
                        </router-link>
                    </div>
                </nav>

                <!-- Sidebar Footer -->
                <div class="shrink-0 p-3 bg-neutral-50 border-t border-neutral-200">
                    <div
                        v-if="sidebarOpen"
                        class="flex items-center gap-3 p-2.5 bg-paper rounded-xl"
                    >
                        <div class="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-bold text-sm shrink-0">
                            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-ink truncate">{{ authStore.user?.username }}</p>
                            <p class="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">Administrator</p>
                        </div>
                    </div>
                    <div v-else class="flex justify-center">
                        <div class="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-bold text-sm">
                            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Mobile Sidebar Overlay -->
        <div
            v-if="sidebarOpen"
            @click="sidebarOpen = false"
            class="lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-sm z-40"
        ></div>

        <!-- Mobile Sidebar -->
        <aside
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-paper transform transition-transform duration-300 flex flex-col"
        >
            <div class="flex items-center justify-between h-16 px-5 bg-ink text-paper border-b border-neutral-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Sparkles class="w-5 h-5 text-paper" />
                    </div>
                    <div>
                        <h1 class="text-base font-bold">Admin</h1>
                        <p class="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">Dashboard</p>
                    </div>
                </div>
                <button @click="sidebarOpen = false" class="text-neutral-400 hover:text-paper">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <nav class="flex-1 px-3 py-4 overflow-y-auto">
                <div class="space-y-1">
                    <router-link
                        v-for="item in navigation"
                        :key="item.to"
                        :to="item.to"
                        @click="sidebarOpen = false"
                        :class="[
                            'flex items-center px-3 py-3 rounded-xl text-sm font-semibold transition-all',
                            isActive(item.to)
                                ? 'bg-ink text-paper'
                                : 'text-neutral-700 hover:bg-neutral-100'
                        ]"
                    >
                        <component :is="item.icon" class="w-5 h-5 mr-3 shrink-0" />
                        <span class="flex-1">{{ item.label }}</span>
                        <span v-if="item.badge" class="ml-auto min-w-5 h-5 px-1.5 bg-accent text-paper text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                            {{ item.badge }}
                        </span>
                    </router-link>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Bar -->
            <header class="shrink-0 bg-paper border-b border-neutral-200">
                <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 gap-4">
                    <!-- Left: Menu Toggle + Search -->
                    <div class="flex items-center gap-4 flex-1">
                        <button @click="toggleSidebar" class="btn-icon">
                            <Menu class="w-5 h-5" />
                        </button>

                        <div class="hidden md:block flex-1 max-w-md">
                            <div class="relative">
                                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    class="input-base pl-11 py-2.5 text-sm bg-neutral-50 border-transparent focus:bg-paper"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Right: Notifications + User -->
                    <div class="flex items-center gap-2">
                        <!-- Notifications -->
                        <div class="relative">
                            <button
                                @click="showNotifications = !showNotifications"
                                class="btn-icon relative"
                            >
                                <Bell class="w-5 h-5" />
                                <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
                            </button>

                            <div
                                v-if="showNotifications"
                                @click.stop
                                class="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm card-flat shadow-xl z-50 overflow-hidden"
                            >
                                <div class="p-4 border-b border-neutral-200 flex items-center justify-between">
                                    <h3 class="text-base font-bold text-ink">Notifications</h3>
                                    <span class="badge-ghost">{{ unreadCount }} new</span>
                                </div>
                                <div class="max-h-96 overflow-y-auto">
                                    <div
                                        v-for="notification in notifications"
                                        :key="notification.id"
                                        :class="['p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer', notification.unread ? 'bg-accent-50/40' : '']"
                                    >
                                        <div class="flex items-start gap-3">
                                            <div :class="['w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0', notification.unread ? 'bg-accent text-paper' : 'bg-neutral-100 text-neutral-500']">
                                                <component :is="notification.icon" class="w-4 h-4" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm text-ink leading-relaxed">{{ notification.message }}</p>
                                                <p class="text-xs text-neutral-500 mt-1">{{ notification.time }}</p>
                                            </div>
                                            <div v-if="notification.unread" class="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3 border-t border-neutral-200">
                                    <button class="w-full text-center text-sm font-bold text-accent hover:text-accent-600 transition-colors">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- User Menu -->
                        <div class="relative">
                            <button
                                @click="showUserMenu = !showUserMenu"
                                class="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                            >
                                <div class="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-bold text-sm shrink-0">
                                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                                </div>
                                <div class="hidden md:block text-left">
                                    <p class="text-sm font-bold text-ink">{{ authStore.user?.username }}</p>
                                    <p class="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">Admin</p>
                                </div>
                                <ChevronDown class="w-4 h-4 text-neutral-500 hidden md:block" />
                            </button>

                            <div
                                v-if="showUserMenu"
                                @click.stop
                                class="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-56 max-w-sm card-flat shadow-xl z-50 overflow-hidden"
                            >
                                <div class="p-2">
                                    <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink hover:bg-neutral-100 rounded-lg transition-colors">
                                        <UserIcon class="w-4 h-4" />
                                        Profile
                                    </button>
                                    <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink hover:bg-neutral-100 rounded-lg transition-colors">
                                        <Settings class="w-4 h-4" />
                                        Settings
                                    </button>
                                </div>
                                <div class="border-t border-neutral-200 p-2">
                                    <button
                                        @click="logout"
                                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                    >
                                        <LogOut class="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto bg-neutral-100">
                <router-view />
            </main>
        </div>

        <!-- Click outside to close dropdowns -->
        <div
            v-if="showUserMenu || showNotifications"
            @click="showUserMenu = false; showNotifications = false"
            class="fixed inset-0 z-30"
        ></div>
    </div>
</template>

<style scoped>
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #d4d4d8;
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: #a1a1aa;
}
</style>
