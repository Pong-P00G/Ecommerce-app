<script setup>
import { ref, onMounted } from 'vue'
import { getProducts, deleteProduct, updateProduct } from '../../api/api'
import { ArrowLeft } from 'lucide-vue-next'


const products = ref([])
const loading = ref(true)
const error = ref(null)
const editingIndex = ref(null)
const editingProduct = ref(null)

// fetch products from  server
async function fetchProducts() {
    try {
        loading.value = true
        const response = await getProducts()
        products.value = response.data
    } catch (err) {
        error.value = 'Failed to fetch products.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

// Fetch products when the component is mounted
onMounted(fetchProducts)

// Function to delete a product
async function handleDeleteProduct(id, index) {
    if (confirm('Delete this product?')) {
        try {
        await deleteProduct(id)
        products.value.splice(index, 1)
        } catch (err) {
        alert('Failed to delete product.')
        console.error(err)
        }
    }
}

// Function to open the edit modal
function editProduct(index) {
    editingIndex.value = index
    editingProduct.value = { ...products.value[index] }
}

// Function close the edit modal
function cancelEdit() {
    editingIndex.value = null
    editingProduct.value = null
}

// Function save the edited product
async function saveEdit() {
    if (editingIndex.value !== null && editingProduct.value) {
        try {
        const productToUpdate = editingProduct.value
        await updateProduct(productToUpdate._id, productToUpdate)
        products.value[editingIndex.value] = { ...productToUpdate }
        cancelEdit()
        } catch (err) {
        alert('Failed to save changes.')
        console.error(err)
        }
    }
}
</script>

<template>
    <div class="bg-gradient-to-br from-[#e0f7ff] to-[#fdfbfb] min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
                    📦 <span class="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Products List</span>
                </h2>
                <div class="flex gap-4">
                    <button
                        @click="fetchProducts"
                        class="px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        🔄 Refresh
                    </button>
                    <router-link
                        to="/dashboard"
                        class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all font-medium border px-4 py-2 rounded-xl hover:bg-gray-50">
                        <ArrowLeft class="w-5 h-5" />
                        Dashboard
                    </router-link>
                </div>
            </div>
            <!-- Loading State -->
            <div v-if="loading" class="text-center text-gray-500 py-16 animate-pulse text-lg">
                ⏳ Loading products...
            </div>
            <!-- Error State -->
            <div v-if="error" class="text-center text-red-500 font-semibold py-6">
                ⚠️ {{ error }}
            </div>
            <!-- Products Grid -->
            <div v-if="!loading && !error && products.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-col-3 lg:grid-cols-4 gap-8">
                <div
                    v-for="(p, index) in products"
                    :key="p._id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex flex-col transform hover:-translate-y-1 hover:scale-[1.02] transition duration-300">
                    
                    <!-- Product Image -->
                    <div class="relative group">
                        <img v-if="p.image" :src="p.image" alt="Product Image"
                            class="w-full h-52 object-cover group-hover:opacity-90 transition"/>
                        <div v-else class="h-52 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            No Image
                        </div>
                        <span v-if="p.discount"
                            class="absolute top-3 right-3 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                            -{{ p.discount }}%
                        </span>
                    </div>
                    <!-- Product Info -->
                    <div class="p-5 flex-1 flex flex-col">
                        <h3 class="font-semibold text-lg text-gray-900 truncate">{{ p.name }}</h3>
                        <p class="text-sm text-gray-500 mt-1">Category: {{ p.category }}</p>
                        <p class="text-sm text-gray-500">
                            Size: {{ p.size || "-" }} | Color: {{ p.color || "-" }}
                        </p>
                        <!-- Price -->
                        <div class="mt-3 mb-4">
                            <span class="text-rose-600 font-bold text-xl">${{ p.price }}</span>
                        </div>
                        <!-- Actions -->
                        <div class="mt-auto flex gap-3">
                            <button @click="editProduct(index)"
                                class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-xl transition shadow-md">
                                ✏️ Edit
                            </button>
                            <button @click="handleDeleteProduct(p._id, index)"
                                class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition shadow-md">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Empty State -->
            <div v-if="!loading && !error && !products.length" class="text-center text-gray-500 py-16 text-lg">
                No products found.  
                <RouterLink to="/addproduct" class="text-rose-600 font-semibold hover:underline">
                    ➕ Add Product
                </RouterLink>
            </div>
            <!-- Edit Modal -->
            <div v-if="editingIndex !== null && editingProduct"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn border border-gray-100">
                    <h3 class="text-xl font-bold mb-6 text-gray-800">✏️ Edit Product</h3>
                    
                    <!-- Form Fields -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Name</label>
                            <input v-model="editingProduct.name" type="text"
                                class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Price</label>
                            <input v-model.number="editingProduct.price" type="number"
                                class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Discount</label>
                            <input v-model.number="editingProduct.discount" type="number"
                                class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <input v-model="editingProduct.category" type="text"
                                class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                    </div>
                    <!-- Modal Actions -->
                    <div class="flex justify-end gap-3 mt-6">
                        <button @click="cancelEdit"
                            class="px-5 py-2 border rounded-xl hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button @click="saveEdit"
                            class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
.animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
}
</style>
