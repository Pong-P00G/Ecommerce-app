<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { Home, ArrowLeft, AlertCircle } from 'lucide-vue-next';

const router = useRouter();

const goBack = () => {
    // If there's no history to go back to, fall back to home
    if (window.history.length > 1) {
        router.back();
    } else {
        router.push('/');
    }
};
</script>

<template>
    <div class="min-h-screen bg-[#f9fafb] relative flex items-center justify-center px-4 py-12">
        <!-- Dotted background -->
        <div
            class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[18px_18px]">
        </div>

        <div class="relative w-full max-w-md text-center">
            <!-- Icon badge -->
            <div
                class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
                <AlertCircle class="h-7 w-7" />
            </div>

            <!-- 404 heading -->
            <h1 class="text-7xl font-bold tracking-tight text-gray-900 sm:text-8xl">
                404
            </h1>

            <!-- Subheading -->
            <h2 class="mt-4 text-2xl font-semibold text-gray-900">
                Page Not Found
            </h2>

            <!-- Message -->
            <p class="mt-3 text-sm text-gray-500">
                The page you are looking for doesn't exist or has been moved.
            </p>

            <!-- Card with actions -->
            <div class="mt-8 rounded-2xl bg-white p-8 shadow-lg">
                <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <!-- Go Home -->
                    <RouterLink to="/"
                        class="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                        <Home class="h-4 w-4" />
                        Go Home
                    </RouterLink>

                    <!-- Go Back -->
                    <button type="button" @click="goBack"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                        <ArrowLeft class="h-4 w-4" />
                        Go Back
                    </button>
                </div>
            </div>

            <!-- Footer hint -->
            <p class="mt-6 text-xs text-gray-400">
                Need help? Try heading back to the homepage.
            </p>
        </div>
    </div>
</template>

<style scoped>
.bg-size-\[18px_18px\] {
    background-size: 18px 18px;
}
</style>
