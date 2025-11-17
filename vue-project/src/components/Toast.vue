<script setup>
import { useToast } from '../composables/useToast'
const { toasts } = useToast()
</script>


<template>
  <div class="fixed right-6 top-6 z-50 flex flex-col gap-3">
    <div v-for="t in toasts" :key="t.id"
         class="min-w-[220px] max-w-sm bg-white shadow-lg rounded-lg p-3 text-sm
                border border-slate-100">
      {{ t.message }}
    </div>
  </div>
</template>

