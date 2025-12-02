<script setup>

const emit = defineEmits(['close'])

</script>

<template>
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity animate-fadeIn">
        <!-- Modal -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[90%] max-w-md p-6 transform animate-scaleIn">
            <h2 class="text-lg font-semibold mb-2">Need Help?</h2>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Welcome to your Admin Panel <br>
                <span class="flex gap-10 px-3">
                    Use the sidebar to navigate between Dashboard, Stock, Users, 
                    Analytics, Reports, and Product management.
                </span>
            </p>
            <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mb-4 px-3">
                <li>
                    Manage your store in one place. <br>
                    <a href="/add-product" class="text-blue-500 px-6">Manage Product</a>
                </li>
                <li>
                    View real-time analytics. <br>
                    <a href="/manage-stock" class="text-blue-500 px-6">Manage Stock</a>
                </li>
                <li>
                    Update product stock and details. <br>
                    <a href="/add-product" class="text-blue-500 px-6">Manage User</a>
                </li>
                <li>
                    Generate reports instantly. <br>
                    <a href="/add-product" class="text-blue-500 px-6">Report</a>
                </li>
            </ul>
            <button
                @click="emit('close')"
                class="w-full rounded-md bg-indigo-600 py-2 text-white text-sm hover:bg-indigo-700">
                Close
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Fade in */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.animate-fadeIn {
    animation: fadeIn 0.25s ease;
}

/* Scale in */
@keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
.animate-scaleIn {
    animation: scaleIn 0.25s ease;
}
</style>
