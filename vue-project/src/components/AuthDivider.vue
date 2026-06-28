<template>
    <div class="relative my-6 sm:my-8">
        <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-neutral-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-paper text-neutral-500 tracking-wide">
                <slot>OR</slot>
            </span>
        </div>
    </div>
</template>