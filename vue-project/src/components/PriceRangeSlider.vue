<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: { type: Array, default: () => [0, 1000] },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 1000 },
    step: { type: Number, default: 10 },
    formatLabel: { type: Function, default: (v) => '$' + v },
})

const emit = defineEmits(['update:modelValue'])

const minVal = ref(props.modelValue[0])
const maxVal = ref(props.modelValue[1])

const range = computed(() => props.max - props.min)
const minPercent = computed(() => ((minVal.value - props.min) / range.value) * 100)
const maxPercent = computed(() => ((maxVal.value - props.min) / range.value) * 100)

watch(() => props.modelValue, (val) => {
    minVal.value = val[0]
    maxVal.value = val[1]
})

const updateMin = (e) => {
    const v = parseInt(e.target.value)
    minVal.value = Math.min(v, maxVal.value - props.step)
    emit('update:modelValue', [minVal.value, maxVal.value])
}

const updateMax = (e) => {
    const v = parseInt(e.target.value)
    maxVal.value = Math.max(v, minVal.value + props.step)
    emit('update:modelValue', [minVal.value, maxVal.value])
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
            <span class="font-bold text-ink tabular-nums">{{ formatLabel(minVal) }}</span>
            <span class="text-neutral-400">—</span>
            <span class="font-bold text-ink tabular-nums">{{ formatLabel(maxVal) }}</span>
        </div>

        <div class="relative h-2">
            <!-- Track -->
            <div class="absolute inset-0 rounded-full bg-neutral-200"></div>
            <!-- Active track -->
            <div class="absolute top-0 h-full rounded-full bg-ink"
                :style="{ left: minPercent + '%', right: (100 - maxPercent) + '%' }">
            </div>
            <!-- Min thumb -->
            <input type="range" :min="min" :max="max" :step="step"
                :value="minVal" @input="updateMin"
                class="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-paper [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-paper [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            />
            <!-- Max thumb -->
            <input type="range" :min="min" :max="max" :step="step"
                :value="maxVal" @input="updateMax"
                class="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-paper [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-paper [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            />
        </div>
    </div>
</template>
