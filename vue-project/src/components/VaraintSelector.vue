<script setup>
import { toRefs, reactive, watch } from 'vue';

const props = defineProps({
    variants: { type: Object, default: () => ({ colors: [], sizes: [] }) },
    modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue']);
const selected = reactive({ ...props.modelValue });

watch(() => props.modelValue, (v) => {
    Object.assign(selected, v || {});
});

function select(part) {
    Object.assign(selected, part);
    emit('update:modelValue', { ...selected });
}
</script>

<template>
    <div class="space-y-5">
        <div v-if="variants.colors && variants.colors.length" class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-xs font-bold uppercase tracking-[0.2em] text-ink">Color</label>
                <span v-if="selected.color" class="text-xs text-neutral-500 font-medium">{{ selected.color }}</span>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button
                    v-for="c in variants.colors"
                    :key="c"
                    @click="select({ color: c })"
                    :class="[
                        'relative w-10 h-10 rounded-xl border-2 transition-all duration-200 group',
                        selected.color === c
                            ? 'border-ink scale-105 shadow-md'
                            : 'border-neutral-200 hover:border-neutral-400'
                    ]"
                    :aria-label="'Color ' + c"
                >
                    <span
                        class="absolute inset-1 rounded-lg"
                        :style="{ background: c }"
                    ></span>
                    <span
                        v-if="selected.color === c"
                        class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
                    >
                        <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </span>
                </button>
            </div>
        </div>

        <div v-if="variants.sizes && variants.sizes.length" class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-xs font-bold uppercase tracking-[0.2em] text-ink">Size</label>
                <span v-if="selected.size" class="text-xs text-neutral-500 font-medium">{{ selected.size }}</span>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button
                    v-for="s in variants.sizes"
                    :key="s"
                    @click="select({ size: s })"
                    :class="[
                        'min-w-[44px] h-10 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200',
                        selected.size === s
                            ? 'bg-ink text-paper border-ink shadow-md'
                            : 'bg-paper text-ink border-neutral-200 hover:border-ink'
                    ]"
                >
                    {{ s }}
                </button>
            </div>
        </div>
    </div>
</template>
