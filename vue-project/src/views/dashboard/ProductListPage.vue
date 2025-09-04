<script setup>
import { ref, onMounted } from 'vue'
import { getProducts, deleteProduct, updateProduct } from '../../api/api'


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
    <div class="bg-[#daf0ff]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 class="text-3xl font-extrabold tracking-tight text-gray-800">📦 Products List</h2>
                <button
                    @click="fetchProducts"
                    class="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-md transition">
                    Refresh
                </button>
            </div>
            <!-- Loading State -->
            <div v-if="loading" class="text-center text-gray-500 py-12 animate-pulse">
                Loading products...
            </div>
            <!-- Error State -->
            <div v-if="error" class="text-center text-red-500 font-medium py-6">
                {{ error }}
            </div>
            <!-- Products Grid -->
            <div v-if="!loading && !error && products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="(p, index) in products" :key="p._id" class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:scale-[1.02] transition duration-300">
                    <!-- Product Image -->
                    <div class="relative group">
                        <img v-if="p.image" :src="p.image" alt="Product Image" class="w-full h-48 object-cover group-hover:opacity-90 transition"/>
                        <div v-else class="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                            No Image
                        </div>
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
                            <span class="text-rose-600 font-bold text-lg">${{ p.price }}</span>
                            <span v-if="p.discount" class="ml-2 text-green-600 text-sm font-medium">
                                {{ p.discount }}%
                            </span>
                        </div>
                        <!-- Actions -->
                        <div class="mt-auto flex gap-3">
                            <button @click="editProduct(index)" class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-xl transition shadow-md">
                                Edit
                            </button>
                            <button @click="handleDeleteProduct(p._id, index)" class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition shadow-md">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Empty State -->
            <div v-if="!loading && !error && !products.length" class="text-center text-gray-500 py-12">
                No products found. Go to
                <RouterLink to="/addproduct" class="text-rose-500 font-semibold">
                    Add Product
                </RouterLink>
            </div>
            <!-- Edit Modal -->
            <div v-if="editingIndex !== null && editingProduct" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div class="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fadeIn">
                    <h3 class="text-xl font-bold mb-6 text-gray-800">✏️ Edit Product</h3>
                    <!-- Form Fields -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-600">Name</label>
                            <input v-model="editingProduct.name" type="text" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600">Price</label>
                            <input v-model.number="editingProduct.price" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600">Discount</label>
                            <input v-model.number="editingProduct.discount" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600">Category</label>
                            <input v-model="editingProduct.category" type="text" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                    </div>
                    <!-- Modal Actions -->
                    <div class="flex justify-end gap-3 mt-6">
                        <button @click="cancelEdit" class="px-5 py-2 border rounded-xl hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button @click="saveEdit" class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition">
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
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
}
</style>
