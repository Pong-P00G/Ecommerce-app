<script setup>
/**
 * Reusable skeleton loading components.
 * Usage:
 *   <SkeletonLoader type="product-card" :count="6" />
 *   <SkeletonLoader type="product-detail" />
 *   <SkeletonLoader type="order-card" :count="3" />
 *   <SkeletonLoader type="text" :lines="4" />
 *   <SkeletonLoader type="avatar" />
 *   <SkeletonLoader type="chart" />
 *   <SkeletonLoader type="table-row" :count="5" />
 */

defineProps({
    type: { type: String, default: 'text' },
    count: { type: Number, default: 1 },
    lines: { type: Number, default: 3 },
})
</script>

<template>
    <div class="space-y-4">
        <!-- Product Card Skeleton -->
        <div v-if="type === 'product-card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="i in count" :key="'pc-' + i" class="bg-paper border border-neutral-200 rounded-2xl overflow-hidden">
                <div class="h-48 sm:h-56 bg-neutral-200 animate-pulse"></div>
                <div class="p-5 space-y-3">
                    <div class="h-3 w-16 bg-neutral-200 animate-pulse rounded"></div>
                    <div class="h-5 w-40 bg-neutral-200 animate-pulse rounded"></div>
                    <div class="h-3 w-52 bg-neutral-200 animate-pulse rounded"></div>
                    <div class="flex items-center justify-between pt-2">
                        <div class="h-6 w-16 bg-neutral-200 animate-pulse rounded"></div>
                        <div class="h-4 w-12 bg-neutral-200 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Product Detail Skeleton -->
        <div v-else-if="type === 'product-detail'" class="grid md:grid-cols-2 gap-8">
            <div class="aspect-square bg-neutral-200 animate-pulse rounded-3xl"></div>
            <div class="space-y-4">
                <div class="h-4 w-20 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-8 w-72 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-6 w-24 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-4 w-full bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-4 w-3/4 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-4 w-1/2 bg-neutral-200 animate-pulse rounded"></div>
                <div class="pt-4 space-y-3">
                    <div class="h-12 w-full bg-neutral-200 animate-pulse rounded-full"></div>
                    <div class="h-12 w-32 bg-neutral-200 animate-pulse rounded-full"></div>
                </div>
            </div>
        </div>

        <!-- Order Card Skeleton -->
        <div v-else-if="type === 'order-card'" class="space-y-3">
            <div v-for="i in count" :key="'oc-' + i" class="bg-paper border border-neutral-200 rounded-2xl p-5">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-neutral-200 animate-pulse rounded-xl shrink-0"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 w-32 bg-neutral-200 animate-pulse rounded"></div>
                        <div class="h-3 w-48 bg-neutral-200 animate-pulse rounded"></div>
                    </div>
                    <div class="text-right space-y-2">
                        <div class="h-4 w-20 bg-neutral-200 animate-pulse rounded ml-auto"></div>
                        <div class="h-6 w-24 bg-neutral-200 animate-pulse rounded-full ml-auto"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Text Lines Skeleton -->
        <div v-else-if="type === 'text'" class="space-y-2">
            <div v-for="i in lines" :key="'tl-' + i"
                class="h-4 bg-neutral-200 animate-pulse rounded"
                :style="{ width: i === lines ? '60%' : '100%' }">
            </div>
        </div>

        <!-- Avatar + Text Skeleton -->
        <div v-else-if="type === 'avatar'" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-neutral-200 animate-pulse rounded-full shrink-0"></div>
            <div class="flex-1 space-y-1.5">
                <div class="h-4 w-32 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-3 w-20 bg-neutral-200 animate-pulse rounded"></div>
            </div>
        </div>

        <!-- Chart / Analytics Skeleton -->
        <div v-else-if="type === 'chart'" class="bg-paper border border-neutral-200 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-6">
                <div class="h-5 w-40 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-8 w-24 bg-neutral-200 animate-pulse rounded-full"></div>
            </div>
            <div class="space-y-3">
                <div v-for="i in 5" :key="'ch-' + i" class="flex items-center gap-4">
                    <div class="h-3 w-16 bg-neutral-200 animate-pulse rounded shrink-0"></div>
                    <div class="flex-1 h-8 bg-neutral-200 animate-pulse rounded"></div>
                </div>
            </div>
        </div>

        <!-- Table Row Skeleton -->
        <div v-else-if="type === 'table-row'" class="space-y-2">
            <div v-for="i in count" :key="'tr-' + i" class="flex items-center gap-4 p-4 bg-paper border border-neutral-200 rounded-xl">
                <div class="w-8 h-8 bg-neutral-200 animate-pulse rounded shrink-0"></div>
                <div class="h-4 w-24 bg-neutral-200 animate-pulse rounded shrink-0"></div>
                <div class="h-4 flex-1 bg-neutral-200 animate-pulse rounded"></div>
                <div class="h-4 w-20 bg-neutral-200 animate-pulse rounded shrink-0"></div>
                <div class="h-6 w-16 bg-neutral-200 animate-pulse rounded-full shrink-0"></div>
            </div>
        </div>

        <!-- Default / Generic Block -->
        <div v-else class="space-y-3 animate-pulse">
            <div v-for="i in count" :key="'def-' + i" class="bg-neutral-200 animate-pulse rounded-2xl" :style="{ height: (80 + Math.random() * 60) + 'px' }"></div>
        </div>
    </div>
</template>
