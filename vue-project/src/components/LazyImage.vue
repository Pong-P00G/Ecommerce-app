<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    rootMargin: { type: String, default: '200px' },
    wrapperClass: { type: String, default: '' },
    imgClass: { type: String, default: '' },
    aspectRatio: { type: String, default: '' },
});

const emit = defineEmits(['load', 'error']);

const isInView = ref(false);
const isLoaded = ref(false);
const hasError = ref(false);
const wrapperEl = ref(null);
let observer = null;

const showPlaceholder = computed(() => !isLoaded.value && !hasError.value);

onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') {
        isInView.value = true;
        return;
    }
    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                isInView.value = true;
                observer.disconnect();
            }
        },
        { rootMargin: props.rootMargin }
    );
    if (wrapperEl.value) observer.observe(wrapperEl.value);
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});

function onImageLoad() {
    isLoaded.value = true;
    emit('load');
}

function onImageError() {
    hasError.value = true;
    emit('error');
}
</script>

<template>
<div
    ref="wrapperEl"
    :class="['relative overflow-hidden bg-neutral-100', wrapperClass]"
    :style="aspectRatio ? { aspectRatio } : {}"
>
    <div
        v-if="showPlaceholder"
        class="absolute inset-0 transition-opacity duration-500"
        :class="{ 'opacity-0': isLoaded }"
    >
        <div class="w-full h-full animate-pulse bg-neutral-200"></div>
    </div>

    <div
        v-if="hasError"
        class="absolute inset-0 flex items-center justify-center bg-neutral-100"
    >
        <svg class="w-8 h-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>

    <img
        v-if="isInView"
        :src="src"
        :alt="alt"
        @load="onImageLoad"
        @error="onImageError"
        :class="[
            'w-full h-full object-cover transition-[opacity,transform] duration-500',
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            imgClass,
        ]"
    />
</div>
</template>
