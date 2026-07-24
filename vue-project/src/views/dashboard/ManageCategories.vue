<script setup>
import { ref, computed, onMounted } from 'vue';
import { categoryAPI } from '../../api/products/categoryApi.js';
import { useToast } from '../../composables/useToast.js';
import {
    Tag,
    Plus,
    Search,
    AlertCircle,
    RefreshCw,
    Loader2,
    Pencil,
    Trash2,
    X,
    Layers,
    Calendar,
} from 'lucide-vue-next';

const toast = useToast();

const categories = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref(null);
const searchQuery = ref('');

// Create / Rename modal
const showModal = ref(false);
const isEditMode = ref(false);
const selectedCategory = ref(null);
const nameInput = ref('');

// Delete confirmation
const showDeleteConfirm = ref(false);
const categoryToDelete = ref(null);
const deletingId = ref(null);

// ── Computed ──────────────────────────────────────────────────────────────────

const filteredCategories = computed(() => {
    let result = categories.value;
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(c =>
            c.name?.toLowerCase().includes(q)
        );
    }
    return result;
});

const totalCount = computed(() => categories.value.length);

const formTitle = computed(() =>
    isEditMode.value ? 'Rename Category' : 'Create Category'
);

const saveButtonLabel = computed(() => {
    if (saving.value) return isEditMode.value ? 'Saving...' : 'Creating...';
    return isEditMode.value ? 'Save Changes' : 'Create Category';
});

// ── Format helpers ────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
};

// ── API ───────────────────────────────────────────────────────────────────────

const fetchCategories = async () => {
    try {
        loading.value = true;
        error.value = null;
        const res = await categoryAPI.getAllCategories();
        if (res.success) {
            categories.value = res.data;
        } else {
            error.value = res.message || 'Failed to load categories';
        }
    } catch (err) {
        console.error('Error fetching categories:', err);
        error.value = err.response?.data?.message || 'Failed to load categories';
    } finally {
        loading.value = false;
    }
};

// ── Create / Rename ──────────────────────────────────────────────────────────

const openCreateModal = () => {
    isEditMode.value = false;
    selectedCategory.value = null;
    nameInput.value = '';
    showModal.value = true;
};

const openRenameModal = (category) => {
    isEditMode.value = true;
    selectedCategory.value = category;
    nameInput.value = category.name;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedCategory.value = null;
    isEditMode.value = false;
    nameInput.value = '';
};

const saveCategory = async () => {
    const name = nameInput.value.trim();
    if (!name) return;

    try {
        saving.value = true;

        if (isEditMode.value) {
            const res = await categoryAPI.updateCategory(selectedCategory.value.category_id, name);
            if (res.success) {
                toast.success(`Category renamed to "${name}"`);
            } else {
                throw new Error(res.message || 'Failed to rename');
            }
        } else {
            const res = await categoryAPI.createCategory(name);
            if (res.success) {
                toast.success(`Category "${name}" created`);
            } else {
                throw new Error(res.message || 'Failed to create');
            }
        }

        await fetchCategories();
        closeModal();
    } catch (err) {
        console.error('Error saving category:', err);
        toast.error(err.response?.data?.message || err.message || 'Failed to save category');
    } finally {
        saving.value = false;
    }
};

// ── Delete ────────────────────────────────────────────────────────────────────

const confirmDelete = (category) => {
    categoryToDelete.value = category;
    showDeleteConfirm.value = true;
};

const executeDelete = async () => {
    if (!categoryToDelete.value) return;
    const category = categoryToDelete.value;
    try {
        deletingId.value = category.category_id;
        const res = await categoryAPI.deleteCategory(category.category_id);
        if (res.success) {
            toast.success(`"${category.name}" deleted`);
            await fetchCategories();
        } else {
            toast.error(res.message || 'Failed to delete');
        }
    } catch (err) {
        console.error('Error deleting category:', err);
        const msg = err.response?.data?.message || 'Failed to delete category';
        toast.error(msg);
    } finally {
        deletingId.value = null;
        showDeleteConfirm.value = false;
        categoryToDelete.value = null;
    }
};

const cancelDelete = () => {
    showDeleteConfirm.value = false;
    categoryToDelete.value = null;
};

// ── Init ──────────────────────────────────────────────────────────────────────

onMounted(fetchCategories);
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-ink">Categories</h1>
                    <p class="text-neutral-600 mt-1 text-sm">Organise products by creating and managing categories</p>
                </div>
                <button @click="openCreateModal" class="btn-accent text-sm gap-2">
                    <Plus class="w-4 h-4" /> Create Category
                </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div class="card-flat p-6">
                    <p class="text-neutral-600 text-sm mb-1">Total Categories</p>
                    <p class="text-3xl font-bold text-ink tabular-nums">{{ totalCount }}</p>
                </div>
                <div class="card-flat p-6">
                    <p class="text-neutral-600 text-sm mb-1">With Products</p>
                    <p class="text-3xl font-bold text-accent tabular-nums">
                        {{ categories.filter(c => c.product_count > 0).length }}
                    </p>
                </div>
                <div class="card-flat p-6">
                    <p class="text-neutral-600 text-sm mb-1">Empty</p>
                    <p class="text-3xl font-bold text-neutral-400 tabular-nums">
                        {{ categories.filter(c => !c.product_count).length }}
                    </p>
                </div>
            </div>

            <!-- Search -->
            <div class="card-flat p-4 sm:p-6 mb-6">
                <div class="relative max-w-md">
                    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search categories..."
                        aria-label="Search categories"
                        class="input-base pl-11"
                    />
                </div>
            </div>

            <!-- Error banner -->
            <div
                v-if="error && categories.length === 0"
                class="card-flat border-l-4 border-danger p-6 mb-6"
            >
                <div class="flex items-center gap-3">
                    <AlertCircle class="w-6 h-6 text-danger shrink-0" />
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-ink text-sm">Error Loading Categories</h3>
                        <p class="text-neutral-600 text-sm mt-0.5">{{ error }}</p>
                    </div>
                    <button @click="fetchCategories" class="btn-primary text-sm shrink-0 gap-1.5">
                        <RefreshCw class="w-3.5 h-3.5" /> Retry
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading && categories.length === 0" class="card-flat p-12 text-center">
                <Loader2 class="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
                <p class="text-neutral-500 text-sm">Loading categories...</p>
            </div>

            <!-- Table -->
            <div v-else class="card-flat overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[600px]">
                        <thead class="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Category</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Created</th>
                                <th class="px-6 py-4 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr
                                v-for="category in filteredCategories"
                                :key="category.category_id"
                                class="hover:bg-neutral-50 transition-colors"
                            >
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                            <Tag class="w-4 h-4 text-accent" />
                                        </div>
                                        <div>
                                            <span class="font-semibold text-ink">{{ category.name }}</span>
                                            <p v-if="category.parent_id" class="text-xs text-neutral-400 mt-0.5">
                                                Subcategory of ID {{ category.parent_id }}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <Calendar class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                        <span class="text-sm text-neutral-600">{{ formatDate(category.created_at) }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button
                                            @click="openRenameModal(category)"
                                            class="btn-ghost text-xs gap-1.5"
                                            :disabled="deletingId === category.category_id"
                                        >
                                            <Pencil class="w-3.5 h-3.5" /> Rename
                                        </button>
                                        <button
                                            @click="confirmDelete(category)"
                                            class="btn-ghost text-xs gap-1.5 text-danger hover:bg-danger/10"
                                            :disabled="deletingId === category.category_id"
                                        >
                                            <Trash2 class="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty state -->
                <div v-if="filteredCategories.length === 0" class="text-center py-16">
                    <Layers class="mx-auto w-12 h-12 text-neutral-300 mb-4" />
                    <p v-if="searchQuery" class="text-neutral-500 text-sm font-medium">
                        No categories matching "{{ searchQuery }}"
                    </p>
                    <p v-else class="text-neutral-500 text-sm font-medium">
                        No categories yet
                    </p>
                    <p v-if="!searchQuery" class="text-xs text-neutral-400 mt-1">
                        Create your first category to start organizing products.
                    </p>
                </div>
            </div>
        </div>

        <!-- Create / Rename Modal -->
        <div
            v-if="showModal"
            @click="closeModal"
            class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4"
        >
            <div @click.stop class="card-flat p-5 sm:p-8 max-w-md w-full">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-ink">{{ formTitle }}</h3>
                    <button @click="closeModal" class="btn-ghost p-1.5 -mr-1.5"><X class="w-5 h-5" /></button>
                </div>
                <form @submit.prevent="saveCategory" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">
                            Category Name *
                        </label>
                        <input
                            v-model="nameInput"
                            type="text"
                            required
                            class="input-base"
                            placeholder="e.g. Electronics, Clothing, Home & Garden"
                            autofocus
                        />
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button type="button" @click="closeModal" class="btn-outline flex-1" :disabled="saving">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="saving || !nameInput.trim()"
                            class="btn-accent flex-1"
                        >
                            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                            {{ saveButtonLabel }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="showDeleteConfirm"
            @click="cancelDelete"
            class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4"
        >
            <div @click.stop class="card-flat p-6 sm:p-8 max-w-sm w-full text-center">
                <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 class="w-6 h-6 text-danger" />
                </div>
                <h3 class="text-lg font-bold text-ink mb-2">Delete Category</h3>
                <p class="text-sm text-neutral-600 mb-6">
                    Are you sure you want to delete
                    <strong class="text-ink">{{ categoryToDelete?.name }}</strong>?
                    Products in this category will not be deleted but will become uncategorised.
                </p>
                <div class="flex gap-3">
                    <button @click="cancelDelete" class="btn-outline flex-1" :disabled="deletingId">
                        Cancel
                    </button>
                    <button @click="executeDelete" :disabled="deletingId" class="btn-danger flex-1">
                        <Loader2 v-if="deletingId" class="w-4 h-4 animate-spin" />
                        {{ deletingId ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
