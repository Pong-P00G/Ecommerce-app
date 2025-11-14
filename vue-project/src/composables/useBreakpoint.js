import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const handleResize = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  // Tailwind default breakpoints
  const isSm = computed(() => width.value < 640);
  const isMd = computed(() => width.value < 768);
  const isLgDown = computed(() => width.value < 1024);
  const isMobile = computed(() => width.value < 1024);

  return {
    width,
    isSm,
    isMd,
    isLgDown,
    isMobile
  };
}

export default useBreakpoint;
