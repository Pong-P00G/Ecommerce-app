<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, ArrowRight, Package } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close'])

const props = defineProps({
    show: { type: Boolean, default: false },
})

const query = ref('')
const results = ref([])
const searching = ref(false)
let debounceTimer = null

const api = null // Would integrate with actual product API

// Sample suggestions
const suggestions = [
    'New arrivals', 'Summer collection', 'Best sellers', 'Sale items',
]

watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!val || val.trim().length < 2) {
        results.value = []
        return
    }
    searching.value = true
    debounceTimer = setTimeout(async () => {
        // Simulated search - would call actual API
        await new Promise(r => setTimeout(r, 300))
        results.value = [
            { id: 1, name: 'Classic White Shirt', price: 89, category: 'Tops' },
            { id: 2, name: 'Tailored Blazer', price: 245, category: 'Outerwear' },
            { id: 3, name: 'Slim Fit Denim', price: 120, category: 'Bottoms' },
        ].filter(p => p.name.toLowerCase().includes(val.toLowerCase()))
        searching.value = false
    }, 300)
})

const navigate = (path) => {
    close()
    router.push(path)
}

const close = () => {
    query.value = ''
    results.value = []
    emit('close')
}

const handleKeydown = (e) => {
    if (e.key === 'Escape') close()
}

onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
    <transition name="search-fade">
        <div v-if="props.show" class="fixed inset-0 z-[70]" @keydown="handleKeydown">
            <div class="absolute inset-0 bg-ink/80 backdrop-blur-md" @click="close"></div>
            <div class="relative max-w-2xl mx-auto pt-24 px-4">
                <div class="bg-paper rounded-3xl shadow-2xl overflow-hidden">
                    <!-- Search input -->
                    <div class="relative p-4 border-b border-neutral-200">
                        <Search class="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                        <input
                            ref="searchInput"
                            v-model="query"
                            type="text"
                            placeholder="Search products, categories, brands..."
                            class="w-full pl-10 pr-12 py-4 bg-transparent text-xl text-ink placeholder:text-neutral-300 focus:outline-none"
                            autofocus
                        />
                        <button @click="close" class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink transition-colors">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Suggestions -->
                    <div v-if="!query && suggestions.length" class="p-4">
                        <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-2">Quick suggestions</p>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="s in suggestions" :key="s" @click="query = s"
                                class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm font-medium text-ink transition-colors">
                                {{ s }}
                            </button>
                        </div>
                    </div>

                    <!-- Results -->
                    <div v-if="query.length >= 2" class="max-h-80 overflow-y-auto p-2">
                        <div v-if="searching" class="p-8 text-center">
                            <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p class="text-sm text-neutral-500">Searching...</p>
                        </div>
                        <div v-else-if="results.length === 0" class="p-8 text-center">
                            <Search class="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                            <p class="text-sm font-bold text-ink">No results found</p>
                            <p class="text-xs text-neutral-500 mt-1">Try a different search term</p>
                        </div>
                        <div v-else class="space-y-1">
                            <button v-for="p in results" :key="p.id" @click="navigate('/product/' + p.id)"
                                class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left group">
                                <div class="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                                    <Package class="w-5 h-5 text-neutral-500" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-bold text-ink truncate">{{ p.name }}</p>
                                    <p class="text-xs text-neutral-500">{{ p.category }} &middot; ${{ p.price }}</p>
                                </div>
                                <ArrowRight class="w-4 h-4 text-neutral-400 group-hover:text-accent transition-colors shrink-0" />
                            </button>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                        <span><kbd class="bg-paper border border-neutral-300 px-1.5 py-0.5 rounded font-bold text-ink">ESC</kbd> to close</span>
                        <RouterLink to="/product" @click="close" class="text-ink font-bold hover:text-accent transition-colors">
                            Browse all products
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.search-fade-enter-active,
.search-fade-leave-active { transition: all 0.25s ease; }
.search-fade-enter-from,
.search-fade-leave-to { opacity: 0; }
.search-fade-enter-from > div:last-child { transform: translateY(-20px); }
.search-fade-leave-to > div:last-child { transform: translateY(-20px); }
</style>
