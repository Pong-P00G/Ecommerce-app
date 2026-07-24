<script setup>
import { ref, computed, onMounted } from 'vue';
import { paymentAPI } from '../../api/paymentApi.js';
import { useToast } from '../../composables/useToast.js';
import {
    CreditCard,
    DollarSign,
    Plus,
    Search,
    AlertCircle,
    RefreshCw,
    Loader2,
    Pencil,
    Trash2,
    X,
    ToggleLeft,
    ToggleRight,
} from 'lucide-vue-next';

const toast = useToast();

const methods = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref(null);
const searchQuery = ref('');

const showModal = ref(false);
const isEditMode = ref(false);
const selectedMethod = ref(null);
const form = ref({
    methodName: '',
    description: '',
    fee: 0,
    isActive: true,
});

const showDeleteConfirm = ref(false);
const methodToDelete = ref(null);
const deletingId = ref(null);

const filteredMethods = computed(() => {
    let result = methods.value;
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(m =>
            m.methodName?.toLowerCase().includes(q) ||
            m.description?.toLowerCase().includes(q)
        );
    }
    return result;
});

const activeCount = computed(() => methods.value.filter(m => m.isActive).length);
const totalCount = computed(() => methods.value.length);
const formTitle = computed(() => isEditMode.value ? 'Edit Payment Method' : 'Add Payment Method');
const savingLabel = computed(() => isEditMode.value ? 'Saving...' : 'Creating...');

const fetchMethods = async () => {
    try {
        loading.value = true;
        error.value = null;
        const res = await paymentAPI.getAllPaymentMethods();
        if (res.success) {
            methods.value = res.data;
        } else {
            error.value = res.message || 'Failed to load payment methods';
        }
    } catch (err) {
        console.error('Error fetching payment methods:', err);
        error.value = err.response?.data?.message || 'Failed to load payment methods';
    } finally {
        loading.value = false;
    }
};

const openCreateModal = () => {
    isEditMode.value = false;
    selectedMethod.value = null;
    form.value = { methodName: '', description: '', fee: 0, isActive: true };
    showModal.value = true;
};

const openEditModal = (method) => {
    isEditMode.value = true;
    selectedMethod.value = method;
    form.value = {
        methodName: method.methodName,
        description: method.description || '',
        fee: Number(method.fee) || 0,
        isActive: method.isActive,
    };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedMethod.value = null;
    isEditMode.value = false;
};

const saveMethod = async () => {
    try {
        saving.value = true;
        const payload = {
            method_name: form.value.methodName.trim(),
            description: form.value.description.trim() || null,
            fee: Number(form.value.fee) || 0,
            is_active: form.value.isActive,
        };

        if (isEditMode.value) {
            const res = await paymentAPI.updatePaymentMethod(selectedMethod.value.methodId, payload);
            if (res.success) {
                toast.success('Payment method updated');
            } else {
                throw new Error(res.message || 'Failed to update');
            }
        } else {
            const res = await paymentAPI.createPaymentMethod(payload);
            if (res.success) {
                toast.success('Payment method created');
            } else {
                throw new Error(res.message || 'Failed to create');
            }
        }

        await fetchMethods();
        closeModal();
    } catch (err) {
        console.error('Error saving payment method:', err);
        toast.error(err.response?.data?.message || err.message || 'Failed to save payment method');
    } finally {
        saving.value = false;
    }
};

const toggleActive = async (method) => {
    try {
        const res = await paymentAPI.updatePaymentMethod(method.methodId, { is_active: !method.isActive });
        if (res.success) {
            method.isActive = !method.isActive;
            toast.success(`"${method.methodName}" ${method.isActive ? 'activated' : 'deactivated'}`);
        } else {
            toast.error(res.message || 'Failed to toggle status');
        }
    } catch (err) {
        console.error('Error toggling payment method:', err);
        toast.error(err.response?.data?.message || 'Failed to toggle status');
    }
};

const confirmDelete = (method) => {
    methodToDelete.value = method;
    showDeleteConfirm.value = true;
};

const executeDelete = async () => {
    if (!methodToDelete.value) return;
    const method = methodToDelete.value;
    try {
        deletingId.value = method.methodId;
        const res = await paymentAPI.deletePaymentMethod(method.methodId);
        if (res.success) {
            toast.success(`"${method.methodName}" deleted`);
            await fetchMethods();
        } else {
            toast.error(res.message || 'Failed to delete');
        }
    } catch (err) {
        console.error('Error deleting payment method:', err);
        toast.error(err.response?.data?.message || 'Failed to delete payment method');
    } finally {
        deletingId.value = null;
        showDeleteConfirm.value = false;
        methodToDelete.value = null;
    }
};

const cancelDelete = () => {
    showDeleteConfirm.value = false;
    methodToDelete.value = null;
};

const methodIcon = (name) => {
    if (!name) return CreditCard;
    return name.toLowerCase().includes('cash') || name.toLowerCase().includes('cod')
        ? DollarSign
        : CreditCard;
};

onMounted(fetchMethods);
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-ink">Payment Methods</h1>
                    <p class="text-neutral-600 mt-1 text-sm">Manage payment methods, fees, and availability</p>
                </div>
                <button @click="openCreateModal" class="btn-accent text-sm gap-2">
                    <Plus class="w-4 h-4" /> Add Method
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div class="card-flat p-6">
                    <p class="text-neutral-600 text-sm mb-1">Total Methods</p>
                    <p class="text-3xl font-bold text-ink tabular-nums">{{ totalCount }}</p>
                </div>
                <div class="card-flat p-6">
                    <p class="text-neutral-600 text-sm mb-1">Active</p>
                    <p class="text-3xl font-bold text-emerald-600 tabular-nums">{{ activeCount }}</p>
                </div>
                <div class="card-flat p-6">
                    <p class="text-neutral-600 text-sm mb-1">Inactive</p>
                    <p class="text-3xl font-bold text-neutral-400 tabular-nums">{{ totalCount - activeCount }}</p>
                </div>
            </div>

            <div class="card-flat p-4 sm:p-6 mb-6">
                <div class="relative max-w-md">
                    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input v-model="searchQuery" type="text" placeholder="Search payment methods..."
                        aria-label="Search payment methods" class="input-base pl-11" />
                </div>
            </div>

            <div v-if="error && methods.length === 0" class="card-flat border-l-4 border-danger p-6 mb-6">
                <div class="flex items-center gap-3">
                    <AlertCircle class="w-6 h-6 text-danger shrink-0" />
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-ink text-sm">Error Loading Payment Methods</h3>
                        <p class="text-neutral-600 text-sm mt-0.5">{{ error }}</p>
                    </div>
                    <button @click="fetchMethods" class="btn-primary text-sm shrink-0 gap-1.5">
                        <RefreshCw class="w-3.5 h-3.5" /> Retry
                    </button>
                </div>
            </div>

            <div v-if="loading && methods.length === 0" class="card-flat p-12 text-center">
                <Loader2 class="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
                <p class="text-neutral-500 text-sm">Loading payment methods...</p>
            </div>

            <div v-else class="card-flat overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[700px]">
                        <thead class="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Method</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Description</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Fee</th>
                                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Status</th>
                                <th class="px-6 py-4 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr v-for="method in filteredMethods" :key="method.methodId"
                                class="hover:bg-neutral-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                                            <component :is="methodIcon(method.methodName)" class="w-4 h-4 text-neutral-600" />
                                        </div>
                                        <span class="font-semibold text-ink">{{ method.methodName }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="text-sm text-neutral-600 max-w-xs truncate">{{ method.description || '—' }}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="font-semibold text-ink tabular-nums">${{ Number(method.fee).toFixed(2) }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <button @click="toggleActive(method)"
                                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                                        :class="method.isActive
                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'">
                                        <component :is="method.isActive ? ToggleRight : ToggleLeft" class="w-3.5 h-3.5" />
                                        {{ method.isActive ? 'Active' : 'Inactive' }}
                                    </button>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="openEditModal(method)" class="btn-ghost text-xs gap-1.5">
                                            <Pencil class="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button @click="confirmDelete(method)" class="btn-ghost text-xs gap-1.5 text-danger hover:bg-danger/10">
                                            <Trash2 class="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="filteredMethods.length === 0" class="text-center py-16">
                    <CreditCard class="mx-auto w-12 h-12 text-neutral-300 mb-4" />
                    <p class="text-neutral-500 text-sm font-medium">No payment methods found</p>
                    <p v-if="searchQuery" class="text-xs text-neutral-400 mt-1">Try a different search term</p>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showModal" @click="closeModal" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-ink">{{ formTitle }}</h3>
                    <button @click="closeModal" class="btn-ghost p-1.5 -mr-1.5"><X class="w-5 h-5" /></button>
                </div>
                <form @submit.prevent="saveMethod" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Method Name *</label>
                        <input v-model="form.methodName" type="text" required class="input-base" placeholder="e.g. Bank Transfer, PayPal" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Description</label>
                        <textarea v-model="form.description" rows="2" class="input-base resize-none" placeholder="Brief description shown to customers..."></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Service Fee ($)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold text-sm">$</span>
                            <input v-model.number="form.fee" type="number" step="0.01" min="0" class="input-base pl-7" placeholder="0.00" />
                        </div>
                        <p class="text-[10px] text-neutral-400 mt-1">Extra charge applied when customers choose this method. Set to 0 for no fee.</p>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                            <p class="text-sm font-semibold text-ink">Active</p>
                            <p class="text-xs text-neutral-500">Customers can use this method during checkout</p>
                        </div>
                        <button type="button" @click="form.isActive = !form.isActive"
                            class="relative w-11 h-6 rounded-full transition-colors"
                            :class="form.isActive ? 'bg-emerald-500' : 'bg-neutral-300'">
                            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                                :class="form.isActive ? 'translate-x-5' : ''"></span>
                        </button>
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button type="button" @click="closeModal" class="btn-outline flex-1" :disabled="saving">Cancel</button>
                        <button type="submit" :disabled="saving || !form.methodName.trim()" class="btn-accent flex-1">
                            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                            {{ saving ? savingLabel : (isEditMode ? 'Save Changes' : 'Create Method') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation -->
        <div v-if="showDeleteConfirm" @click="cancelDelete" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-6 sm:p-8 max-w-sm w-full text-center">
                <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 class="w-6 h-6 text-danger" />
                </div>
                <h3 class="text-lg font-bold text-ink mb-2">Delete Payment Method</h3>
                <p class="text-sm text-neutral-600 mb-6">
                    Are you sure you want to delete <strong class="text-ink">{{ methodToDelete?.methodName }}</strong>?
                    This action cannot be undone. Existing payments using this method will be preserved.
                </p>
                <div class="flex gap-3">
                    <button @click="cancelDelete" class="btn-outline flex-1" :disabled="deletingId">Cancel</button>
                    <button @click="executeDelete" :disabled="deletingId" class="btn-danger flex-1">
                        <Loader2 v-if="deletingId" class="w-4 h-4 animate-spin" />
                        {{ deletingId ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
