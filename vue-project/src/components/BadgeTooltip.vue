<script setup>
/**
 * BadgeTooltip — wraps badge content and shows a rich tooltip on hover.
 *
 * Props:
 *   text    — the tooltip body text (shown when non-empty)
 *   side    — 'top' (default) | 'bottom' | 'left' | 'right'
 */
import { computed } from 'vue';

const props = defineProps({
    text: { type: String, default: '' },
    side: { type: String, default: 'top' },
});

const positionClasses = computed(() => {
    switch (props.side) {
        case 'bottom':
            return 'top-full mt-2 left-1/2 -translate-x-1/2';
        case 'left':
            return 'right-full mr-2 top-1/2 -translate-y-1/2';
        case 'right':
            return 'left-full ml-2 top-1/2 -translate-y-1/2';
        default:
            return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
});

const arrowClasses = computed(() => {
    switch (props.side) {
        case 'bottom':
            return 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px] rotate-45';
        case 'left':
            return 'left-full top-1/2 -translate-y-1/2 -ml-[1px] rotate-45';
        case 'right':
            return 'right-full top-1/2 -translate-y-1/2 -mr-[1px] rotate-45';
        default:
            return 'top-full left-1/2 -translate-x-1/2 -mt-[1px] rotate-45';
    }
});
</script>

<template>
    <div class="relative inline-flex group/tooltip">
        <slot />

        <!-- Tooltip body -->
        <Transition name="tooltip-fade">
            <div
                v-if="text"
                class="absolute z-50 px-3 py-2 rounded-xl bg-ink text-paper text-[11px] leading-tight font-medium shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200"
                :class="[positionClasses, 'opacity-0 group-hover/tooltip:opacity-100']"
            >
                {{ text }}
                <!-- Arrow -->
                <div
                    class="absolute w-2 h-2 bg-ink"
                    :class="arrowClasses"
                ></div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
}
.tooltip-fade-enter-to,
.tooltip-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
