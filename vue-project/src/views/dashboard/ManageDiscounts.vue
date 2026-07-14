<script setup>
import { ref, computed, onMounted } from 'vue';
import { discountAPI } from '../../api/products/discountApi.js';
import { productAPI } from '../../api/products/productApi.js';
import { useToast } from '../../composables/useToast.js';
import {
    Tag,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    AlertTriangle,
    Plus,
    Pencil,
    Trash2,
    X,
} from 'lucide-vue-next';

const toast = useToast();

const discounts = ref([]);
const products = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref(null);
const searchQuery = ref('');
const showFormModal = ref(false);
const editingDiscount = ref(null);
const showDeleteConfirm = ref(false);
const deletingDiscount = ref(null);
const deleting = ref(false);

const form = ref({
    product_id: null,
    discount_amount: '',
    start_date: '',
    end_date: '',
});

const filteredDiscounts = computed(() => {
    if (!searchQuery.value) return discounts.value;
    const q = searchQuery.value.toLowerCase();
    return discounts.value.filter(d =>
        (d.product_name || '').toLowerCase().includes(q) ||
        String(d.discount_id).includes(q)
    );
});

const statusStyle = (discount) => {
    const now = new Date();
    const start = new Date(discount.start_date);
    const end = new Date(discount.end_date);
    if (now < start) return { label: 'Scheduled', cls: 'bg-info/10 text-info border-info/20' };
    if (now > end) return { label: 'Expired', cls: 'bg-neutral-100 text-neutral-500 border-neutral-200' };
    return { label: 'Active', cls: 'bg-accent/10 text-accent border-accent/20' };
};

const fetchDiscounts = async () => {
    try {
        loading.value = true;
        error.value = null;
        const response = await discountAPI.getAllDiscounts();
        if (response.success) {
            discounts.value = response.data;
        } else {
            error.value = response.message || 'Failed to load discounts';
        }
    } catch (err) {
        console.error('Error fetching discounts:', err);
        error.value = err.response?.data?.message || 'Failed to load discounts';
    } finally {
        loading.value = false;
    }
};

const openCreateForm = async () => {
    editingDiscount.value = null;
    form.value = { product_id: null, discount_amount: '', start_date: '', end_date: '' };
    showFormModal.value = true;
    if (products.value.length === 0) {
        try {
            const resp = await productAPI.getAllProducts();
            products.value = resp.data || [];
        } catch (err) {
            console.error(err);
        }
    }
};

const openEditForm = async (discount) => {
    editingDiscount.value = discount;
    form.value = {
        product_id: discount.product_id,
        discount_amount: discount.discount_amount,
        start_date: discount.start_date ? discount.start_date.split('T')[0] : '',
        end_date: discount.end_date ? discount.end_date.split('T')[0] : '',
    };
    showFormModal.value = true;
    if (products.value.length === 0) {
        try {
            const resp = await productAPI.getAllProducts();
            products.value = resp.data || [];
        } catch (err) {
            console.error(err);
        }
    }
};

const closeForm = () => {
    showFormModal.value = false;
    editingDiscount.value = null;
};

const saveDiscount = async () => {
    if (!form.value.product_id || !form.value.discount_amount || !form.value.start_date || !form.value.end_date) {
        toast.error('All fields are required');
        return;
    }
    saving.value = true;
    try {
        if (editingDiscount.value) {
            const resp = await discountAPI.updateDiscount(editingDiscount.value.discount_id, {
                discount_amount: parseFloat(form.value.discount_amount),
                start_date: form.value.start_date,
                end_date: form.value.end_date,
            });
            if (resp.success) {
                toast.success('Discount updated successfully');
            } else {
                toast.error(resp.message || 'Failed to update discount');
            }
        } else {
            const resp = await discountAPI.applyDiscount(form.value.product_id, {
                discount_amount: parseFloat(form.value.discount_amount),
                start_date: form.value.start_date,
                end_date: form.value.end_date,
            });
            if (resp.success) {
                toast.success('Discount created successfully');
            } else {
                toast.error(resp.message || 'Failed to create discount');
            }
        }
        closeForm();
        await fetchDiscounts();
    } catch (err) {
        console.error('Error saving discount:', err);
        toast.error(err.response?.data?.message || 'Failed to save discount');
    } finally {
        saving.value = false;
    }
};

const openDeleteConfirm = (discount) => {
    deletingDiscount.value = discount;
    showDeleteConfirm.value = true;
};

const executeDelete = async () => {
    if (!deletingDiscount.value) return;
    deleting.value = true;
    try {
        const resp = await discountAPI.deleteDiscount(deletingDiscount.value.discount_id);
        if (resp.success) {
            toast.success('Discount deleted');
            await fetchDiscounts();
        } else {
            toast.error(resp.message || 'Failed to delete discount');
        }
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to delete discount');
    } finally {
        deleting.value = false;
        showDeleteConfirm.value = false;
        deletingDiscount.value = null;
    }
};

const cancelDelete = () => {
    showDeleteConfirm.value = false;
    deletingDiscount.value = null;
};

const formatPrice = (p) => parseFloat(p || 0).toFixed(2);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

onMounted(fetchDiscounts);
</script>
<template>
    <div class="min-h-screen bg-neutral-100">
        <div class="section py-6 sm:py-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
                        <Tag class="w-3.5 h-3.5" />
                        Discounts
                    </span>
                    <h1 class="text-2xl sm:text-3xl font-bold text-ink">Discount management</h1>
                    <p class="text-neutral-500 mt-1 text-sm">Create and manage product discounts</p>
                </div>
                <button @click="openCreateForm" class="btn-accent text-sm gap-2">
                    <Plus class="w-4 h-4" />
                    Add Discount
                </button>
            </div>

            <div class="card-flat p-4 sm:p-6 mb-6">
                <div class="flex gap-4">
                    <div class="flex-1 relative">
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search discounts by product name..." class="input-base pl-11" aria-label="Search discounts" />
                    </div>
                </div>
            </div>

            <div v-if="error && discounts.length === 0" class="card-flat border-l-4 border-danger p-6 mb-6">
                <div class="flex items-center gap-3">
                    <AlertCircle class="w-6 h-6 text-danger shrink-0" />
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-ink text-sm">Error Loading Discounts</h3>
                        <p class="text-neutral-600 text-sm mt-0.5">{{ error }}</p>
                    </div>
                    <button @click="fetchDiscounts" class="btn-primary text-sm gap-1.5">
                        <RefreshCw class="w-3.5 h-3.5" />
                        Retry
                    </button>
                </div>
            </div>

            <div v-if="loading && discounts.length === 0" class="card-flat overflow-hidden animate-pulse">
                <div class="p-4 sm:p-6">
                    <div class="h-12 bg-neutral-200 rounded-xl"></div>
                </div>
                <div class="divide-y divide-neutral-100">
                    <div class="px-6 py-3.5 bg-neutral-50">
                        <div class="grid grid-cols-6 gap-4">
                            <div v-for="i in 6" :key="i" class="h-3 bg-neutral-200 rounded w-3/4"></div>
                        </div>
                    </div>
                    <div v-for="row in 4" :key="row" class="px-6 py-5">
                        <div class="grid grid-cols-6 gap-4 items-center">
                            <div class="space-y-2">
                                <div class="h-3.5 bg-neutral-200 rounded w-36"></div>
                                <div class="h-3 bg-neutral-200 rounded w-20"></div>
                            </div>
                            <div><div class="h-4 bg-neutral-200 rounded w-14"></div></div>
                            <div><div class="h-3.5 bg-neutral-200 rounded w-24"></div></div>
                            <div><div class="h-3.5 bg-neutral-200 rounded w-24"></div></div>
                            <div><div class="h-6 bg-neutral-200 rounded-full w-20"></div></div>
                            <div class="flex justify-end gap-2">
                                <div class="h-8 bg-neutral-200 rounded-lg w-16"></div>
                                <div class="h-8 bg-neutral-200 rounded-lg w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="card-flat overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[700px]">
                        <thead class="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Product</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Amount</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Start Date</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">End Date</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Status</th>
                                <th class="px-6 py-4 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr v-for="d in filteredDiscounts" :key="d.discount_id" class="hover:bg-neutral-50 transition-colors">
                                <td class="px-6 py-4">
                                    <p class="font-semibold text-ink text-sm">{{ d.product_name }}</p>
                                    <p class="text-xs text-neutral-500">ID: {{ d.product_id }}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="font-bold text-accent tabular-nums">${{ formatPrice(d.discount_amount) }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-neutral-600">{{ formatDate(d.start_date) }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-neutral-600">{{ formatDate(d.end_date) }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', statusStyle(d).cls]">
                                        {{ statusStyle(d).label }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="openEditForm(d)" class="btn-ghost text-xs gap-1.5">
                                            <Pencil class="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button @click="openDeleteConfirm(d)" class="btn-ghost text-xs gap-1.5 text-danger hover:bg-danger/10">
                                            <Trash2 class="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="filteredDiscounts.length === 0" class="text-center py-16">
                    <Tag class="mx-auto w-12 h-12 text-neutral-300 mb-4" />
                    <p class="text-neutral-500 text-sm font-medium">No discounts found</p>
                    <p class="text-xs text-neutral-400 mt-1">Click Add Discount to create one</p>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm" @click="cancelDelete" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-6 max-w-sm w-full text-center">
                <div class="w-14 h-14 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle class="w-7 h-7 text-danger" />
                </div>
                <h3 class="text-lg font-bold text-ink mb-2">Delete Discount</h3>
                <p class="text-sm text-neutral-600 mb-6">
                    Delete discount for <strong class="text-ink">{{ deletingDiscount?.product_name }}</strong>?
                </p>
                <div class="flex gap-3">
                    <button @click="cancelDelete" class="btn-outline flex-1" :disabled="deleting">Cancel</button>
                    <button @click="executeDelete" :disabled="deleting" class="btn-danger flex-1">
                        <Loader2 v-if="deleting" class="w-4 h-4 animate-spin" />
                        {{ deleting ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showFormModal" @click="closeForm" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-5 sm:p-8 max-w-md w-full">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-ink">{{ editingDiscount ? 'Edit Discount' : 'Add Discount' }}</h3>
                    <button @click="closeForm" class="btn-ghost p-1.5 -mr-1.5">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Product</label>
                        <select v-model="form.product_id" class="input-base" :disabled="!!editingDiscount" aria-label="Select product">
                            <option :value="null">Select a product...</option>
                            <option v-for="p in products" :key="p.product_id" :value="p.product_id">
                                {{ p.product_name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Discount Amount ($)</label>
                        <input v-model="form.discount_amount" type="number" step="0.01" min="0.01" class="input-base" placeholder="9.99" aria-label="Discount amount" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Start Date</label>
                            <input v-model="form.start_date" type="date" class="input-base" aria-label="Discount start date" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">End Date</label>
                            <input v-model="form.end_date" type="date" class="input-base" aria-label="Discount end date" />
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
                    <button @click="closeForm" class="btn-outline flex-1" :disabled="saving">Cancel</button>
                    <button @click="saveDiscount" :disabled="saving" class="btn-accent flex-1">
                        <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                        {{ saving ? 'Saving...' : (editingDiscount ? 'Update' : 'Create') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
