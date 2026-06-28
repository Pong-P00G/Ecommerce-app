<script setup>
import { LifeBuoy, LayoutDashboard, Package, Users, BarChart3, FileText, ArrowRight, X } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const emit = defineEmits(['close']);

const links = [
    { to: '/admin/dashboard', label: 'Manage Dashboard', icon: LayoutDashboard },
    { to: '/admin/manage-products', label: 'Manage Products', icon: Package },
    { to: '/admin/manage-stock', label: 'Manage Stock', icon: BarChart3 },
    { to: '/admin/manage-user', label: 'Manage Users', icon: Users },
    { to: '/admin/report', label: 'Generate Reports', icon: FileText },
];
</script>

<template>
    <div
        class="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="emit('close')"
    >
        <div class="bg-paper rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
            <!-- Header -->
            <div class="relative px-6 py-5 bg-ink text-paper">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                        <LifeBuoy class="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 class="text-lg font-bold">Need Help?</h2>
                        <p class="text-xs text-neutral-400">Quick links for the Admin Panel</p>
                    </div>
                </div>
                <span class="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full pulse-dot"></span>
                <button
                    @click="emit('close')"
                    class="absolute top-4 right-12 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
                    aria-label="Close"
                >
                    <X class="w-4 h-4 text-paper" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-2">
                <p class="text-sm text-neutral-600 leading-relaxed">
                    Welcome to your Admin Panel. Use the links below to manage every section of your store.
                </p>
                <div class="space-y-1 mt-3">
                    <RouterLink
                        v-for="link in links"
                        :key="link.to"
                        :to="link.to"
                        @click="emit('close')"
                        class="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-100 transition-colors group"
                    >
                        <span class="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-ink group-hover:text-paper flex items-center justify-center transition-colors">
                            <component :is="link.icon" class="w-4 h-4" />
                        </span>
                        <span class="flex-1 text-sm font-semibold text-ink">{{ link.label }}</span>
                        <ArrowRight class="w-4 h-4 text-neutral-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </RouterLink>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 pb-6">
                <button
                    @click="emit('close')"
                    class="w-full px-5 py-3 bg-ink text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition-all duration-300"
                >
                    Got it
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-up {
    animation: fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
