<script setup>
import { useToast } from '@/composables/useToast.js';
const { toasts, remove, executeAction } = useToast();

function toastType(type) {
    switch (type) {
        case 'success':
            return { bg: 'bg-accent', icon: 'M5 13l4 4L19 7' };
        case 'error':
            return { bg: 'bg-red-500', icon: 'M6 18L18 6M6 6l12 12' };
        case 'warning':
            return { bg: 'bg-yellow-500', icon: 'M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z' };
        default:
            return { bg: 'bg-ink', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    }
}
</script>

<template>
    <div class="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full sm:w-auto pointer-events-none">
        <transition-group name="toast" tag="div" class="flex flex-col gap-3">
            <div
                v-for="t in toasts"
                :key="t.id"
                class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg bg-paper border border-neutral-200 min-w-[260px] overflow-hidden"
            >
                <span
                    class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
                    :class="toastType(t.type).bg"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="toastType(t.type).icon" />
                    </svg>
                </span>
                <p class="flex-1 text-sm font-medium text-ink leading-snug">{{ t.message }}</p>

                <!-- Action button (e.g. Undo) -->
                <button
                    v-if="t.action"
                    @click="executeAction(t.id)"
                    class="shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
                    :class="t.type === 'error'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-accent/10 text-accent hover:bg-accent/20'"
                >
                    {{ t.action.label }}
                </button>

                <button
                    @click="remove(t.id)"
                    class="shrink-0 w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-ink transition-colors"
                    aria-label="Dismiss"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
    opacity: 0;
    transform: translateX(20px);
}
.toast-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
