<script setup>
import { toRefs, reactive, watch } from 'vue'
const props = defineProps({
  variants: { type: Object, default: () => ({ colors: [], sizes: [] }) },
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])
const selected = reactive({ ...props.modelValue })

watch(() => props.modelValue, v => {
  Object.assign(selected, v || {})
})

function select(part) {
  Object.assign(selected, part)
  emit('update:modelValue', { ...selected })
}
</script>


<template>
  <div class="flex gap-4 items-center">
    <div v-if="variants.colors?.length" class="flex items-center gap-2">
      <label class="text-sm font-medium">Color</label>
      <div class="flex gap-2">
        <button v-for="c in variants.colors" :key="c"
                @click="select({ color: c })"
                :class="['w-8 h-8 rounded-md border transition-transform',
                         (selected.color === c) ? 'ring-2 ring-cyan-500 scale-105' : '']">
          <div class="w-full h-full rounded-sm" :style="{ background: c }"></div>
        </button>
      </div>
    </div>

    <div v-if="variants.sizes?.length" class="flex items-center gap-2">
      <label class="text-sm font-medium">Size</label>
      <div class="flex gap-2">
        <button v-for="s in variants.sizes" :key="s"
                @click="select({ size: s })"
                :class="['px-3 py-1 rounded-md border text-sm transition-colors',
                         (selected.size === s) ? 'bg-cyan-600 text-white' : 'bg-white']">
          {{ s }}
        </button>
      </div>
    </div>
  </div>
</template>

