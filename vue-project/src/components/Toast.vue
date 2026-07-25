<script setup>
import { useToast } from '../composables/useToast';
const { toasts, remove } = useToast();
</script>

<template>
    <div class="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full sm:w-auto pointer-events-none">
        <transition-group name="toast" tag="div" class="flex flex-col gap-3">
            <div
                v-for="t in toasts"
                :key="t.id"
                class="pointer-events-auto relative flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg border min-w-[260px] overflow-hidden"
                :class="{
                    'bg-paper border-neutral-200': !t.type || t.type === 'info',
                    'bg-paper border-accent-200': t.type === 'success',
                    'bg-paper border-red-200': t.type === 'error',
                    'bg-paper border-yellow-300': t.type === 'warning',
                }"
            >
                <span
                    class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    :class="{
                        'bg-ink': !t.type || t.type === 'info',
                        'bg-accent': t.type === 'success',
                        'bg-red-500': t.type === 'error',
                        'bg-yellow-500': t.type === 'warning',
                    }"
                >
                    <svg v-if="!t.type || t.type === 'info'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <svg v-else-if="t.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <svg v-else-if="t.type === 'error'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-ink leading-snug">{{ t.message }}</p>
                </div>
                <button
                    @click="remove(t.id)"
                    class="shrink-0 w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-ink transition-colors"
                    aria-label="Dismiss"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <span
                    v-if="t.type === 'success'"
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent/30"
                >
                    <span class="block h-full bg-accent animate-[shrink_3s_linear_forwards]"></span>
                </span>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.toast-enter-active {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.92);
}
.toast-leave-to {
    opacity: 0;
    transform: translateX(20px) scale(0.95);
}
@keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
}
</style>
