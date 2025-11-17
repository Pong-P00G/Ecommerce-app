<script setup>
import { useToast } from '@/composables/useToast.js'
const { toasts, remove } = useToast()

function toastType(type) {
  switch (type) {
    case 'success': return 'bg-green-500'
    case 'error': return 'bg-red-500'
    case 'warning': return 'bg-yellow-500 text-black'
    default: return 'bg-blue-500'
  }
}
</script>

<template>
  <div class="fixed top-15 right-5 flex flex-col gap-3 z-[9999]">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" :class="['px-4 py-3 rounded-xl text-white shadow-lg flex items-center gap-2',toastType(t.type)]">
        <span>{{ t.message }}</span>
<!--        <button @click="remove(t.id)" class="ml-2 opacity-60 hover:opacity-100">✖</button>-->
      </div>
    </transition-group>
  </div>
</template>


<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
