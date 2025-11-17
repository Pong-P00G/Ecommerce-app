<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const props = defineProps({
  products: { type: Array, default: () => [] },
  interval: { type: Number, default: 3500 }
})

const carousel = ref(null)
const currentIndex = ref(0)
let autoPlayTimer = null

const scrollToIndex = (i) => {
  currentIndex.value = i
  carousel.value?.scrollTo({
    left: i * carousel.value.clientWidth,
    behavior: 'smooth'
  })
}

const next = () => {
  if (!carousel.value) return
  const max = props.products.length - 1
  currentIndex.value = currentIndex.value >= max ? 0 : currentIndex.value + 1
  scrollToIndex(currentIndex.value)
}

const prev = () => {
  if (!carousel.value) return
  const max = props.products.length - 1
  currentIndex.value = currentIndex.value <= 0 ? max : currentIndex.value - 1
  scrollToIndex(currentIndex.value)
}

onMounted(() => {
  autoPlayTimer = setInterval(next, props.interval)
})
onUnmounted(() => {
  clearInterval(autoPlayTimer)
})
</script>

<template>
  <div class="relative w-full">
    <!-- Slides -->
    <div ref="carousel"
        class="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth
                gap-6 pb-6 select-none">
      <div v-for="p in props.products" :key="p.id"
          class="snap-center w-full sm:w-[70%] md:w-[45%] lg:w-[72%]
              bg-white rounded-2xl shadow-lg p-5 shrink-0
              transition-transform duration-300
              hover:scale-[1.03] hover:shadow-2xl relative">
        <RouterLink :to="p.href" class="block group">
          <!-- Image -->
          <div class="rounded-xl overflow-hidden bg-slate-200 h-64 flex items-center justify-center">
            <img :src="p.image" :alt="p.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <!-- Info -->
          <div class="mt-4">
            <span class="text-sm font-semibold text-cyan-600">{{ p.tag }}</span>
            <h3 class="mt-1 font-bold text-lg group-hover:text-cyan-700 transition-colors">
              {{ p.title }}
            </h3>
            <p class="mt-1 text-sm text-slate-600 line-clamp-2">
              {{ p.description }}
            </p>
            <p class="mt-3 font-bold text-slate-900">${{ p.price }}</p>
          </div>
        </RouterLink>
        <!-- Quick Action Button -->
        <RouterLink
            :to="p.href"
            class="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold
                opacity-0 scale-90 transition-all duration-300
                group-hover:opacity-100 group-hover:scale-100 hover:bg-cyan-700">
          View
        </RouterLink>
      </div>
    </div>
    <!-- Navigation Buttons -->
    <button @click="prev"
      class="absolute top-1/2 -left-3 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md
      flex items-center justify-center hover:scale-110 transition-transform">
      <ChevronLeft class="w-5 h-5 text-slate-700" />
    </button>
    <button @click="next"
      class="absolute top-1/2 -right-3 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md
      flex items-center justify-center hover:scale-110 transition-transform">
      <ChevronRight class="w-5 h-5 text-slate-700" />
    </button>
    <!-- Pagination Dots -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 mt-2">
      <div v-for="(p, i) in props.products" :key="i"
          @click="scrollToIndex(i)"
          class="h-2.5 w-2.5 rounded-full bg-slate-300 cursor-pointer transition hover:bg-cyan-500"
          :class="{ 'bg-cyan-600!': i === currentIndex }">
      </div>
    </div>
  </div>
</template>
