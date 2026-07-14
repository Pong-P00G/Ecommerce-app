<script setup>
import { ref, computed, onMounted } from 'vue';
import { userAPI } from '../../api/userApi';
import { useToast } from '../../composables/useToast.js';
import {
    Users,
    UserCheck,
    Shield,
    Search,
    Plus,
    AlertCircle,
    RefreshCw,
    Loader2,
    Trash2,
    Pencil,
    X
} from 'lucide-vue-next';

const toast = useToast();

// State
const users = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref(null);
const searchQuery = ref('');
const filterRole = ref('all');
const filterStatus = ref('all');
const showUserModal = ref(false);
const selectedUser = ref(null);
const isEditMode = ref(false);
const showDeleteConfirm = ref(false);
const userToDelete = ref(null);
const deletingId = ref(null);

const newUser = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role_id: 3, // Default to customer/user (3)
  status: 'active'
});

// Fetch users from API
const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await userAPI.getAllUsers();
    users.value = response.map(user => ({
      ...user,
      role: user.role_id === 1 || user.role_id === 2 ? 'Admin' : 'Customer',
      status: 'active', // Database doesn't have status field yet
      orders: 0, // Will be populated when orders are implemented
      created: user.created_at
    }));
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = err.message || 'Failed to load users';
  } finally {
    loading.value = false;
  }
};

// Computed
const filteredUsers = computed(() => {
  let result = users.value;

  // Search
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    result = result.filter(u =>
      u.username?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search)
    );
  }

  // Role filter
  if (filterRole.value !== 'all') {
    result = result.filter(u => u.role === filterRole.value);
  }

  // Status filter
  if (filterStatus.value !== 'all') {
    result = result.filter(u => u.status === filterStatus.value);
  }

  return result;
});

const totalUsers = computed(() => users.value.length);
const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length);
const adminCount = computed(() => users.value.filter(u => u.role === 'Admin').length);

const savingLabel = computed(() => isEditMode.value ? 'Updating...' : 'Creating...');

// Methods
const openCreateModal = () => {
  isEditMode.value = false;
  newUser.value = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 3,
    status: 'active'
  };
  showUserModal.value = true;
};

const openEditModal = (user) => {
  isEditMode.value = true;
  selectedUser.value = user;
  newUser.value = {
    username: user.username,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email,
    role_id: user.role_id,
    status: user.status,
    password: ''
  };
  showUserModal.value = true;
};

const closeModal = () => {
  showUserModal.value = false;
  selectedUser.value = null;
  isEditMode.value = false;
};

const saveUser = async () => {
  try {
    saving.value = true;

    if (isEditMode.value) {
      const updateData = {
        username: newUser.value.username,
        first_name: newUser.value.first_name,
        last_name: newUser.value.last_name,
        email: newUser.value.email
      };

      await userAPI.updateUser(selectedUser.value.user_id, updateData);
      toast.success('User updated successfully!');
    } else {
      const createData = {
        username: newUser.value.username,
        first_name: newUser.value.first_name,
        last_name: newUser.value.last_name,
        email: newUser.value.email,
        password: newUser.value.password,
        role_id: newUser.value.role_id
      };

      await userAPI.createUser(createData);
      toast.success('User created successfully!');
    }

    await fetchUsers();
    closeModal();
  } catch (err) {
    console.error('Error saving user:', err);
    toast.error(err.response?.data?.message || 'Failed to save user');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteConfirm.value = true;
};

const executeDelete = async () => {
  if (!userToDelete.value) return;
  const user = userToDelete.value;
  try {
    deletingId.value = user.user_id;
    await userAPI.deleteUser(user.user_id);
    toast.success(`User "${user.username}" deleted`);
    await fetchUsers();
  } catch (err) {
    console.error('Error deleting user:', err);
    toast.error(err.response?.data?.message || 'Failed to delete user');
  } finally {
    deletingId.value = null;
    showDeleteConfirm.value = false;
    userToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  userToDelete.value = null;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

onMounted(() => {
  fetchUsers();
});


</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-ink">User Management</h1>
          <p class="text-neutral-600 mt-1 text-sm sm:text-base">Manage customer and admin accounts</p>
        </div>
        <button @click="openCreateModal" class="btn-accent text-sm gap-2">
          <Plus class="w-4 h-4" />
          Add User
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div class="card-flat p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-info" />
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Total Users</p>
          <p class="text-3xl font-bold text-ink">{{ totalUsers }}</p>
        </div>

        <div class="card-flat p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <UserCheck class="w-6 h-6 text-accent" />
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Active Users</p>
          <p class="text-3xl font-bold text-ink">{{ activeUsers }}</p>
        </div>

        <div class="card-flat p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-ink/10 rounded-lg flex items-center justify-center">
              <Shield class="w-6 h-6 text-ink" />
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Administrators</p>
          <p class="text-3xl font-bold text-ink">{{ adminCount }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="card-flat p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-1">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search users..." :disabled="loading"
                class="input-base pl-10 disabled:opacity-50" />
              <Search class="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          <!-- Role Filter -->
          <select v-model="filterRole" :disabled="loading" class="input-base disabled:opacity-50">
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>

          <!-- Status Filter -->
          <select v-model="filterStatus" :disabled="loading" class="input-base disabled:opacity-50">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="card-flat border-l-4 border-danger p-6 mb-6">
        <div class="flex items-center gap-3">
          <AlertCircle class="w-6 h-6 text-danger shrink-0" />
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-ink text-sm">Error Loading Users</h3>
            <p class="text-neutral-600 text-sm mt-0.5 truncate">{{ error }}</p>
          </div>
          <button @click="fetchUsers" class="btn-primary text-sm shrink-0 gap-1.5">
            <RefreshCw class="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && users.length === 0" class="card-flat p-12 text-center">
        <Loader2 class="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
        <p class="text-neutral-500 text-sm">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="card-flat overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-200">
            <thead class="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">User</th>
                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Role</th>
                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Status</th>
                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Orders</th>
                <th class="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Joined</th>
                <th class="px-6 py-4 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-neutral-50 transition-colors">
                <!-- User -->
                <td class="px-6 py-4">
                  <div>
                    <p class="font-semibold text-ink">{{ user.username }}</p>
                    <p class="text-sm text-neutral-500">{{ user.email }}</p>
                  </div>
                </td>

                <!-- Role -->
                <td class="px-6 py-4">
                  <span :class="user.role === 'Admin' ? 'bg-ink/10 text-ink' : 'bg-info/10 text-info'"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Shield v-if="user.role === 'Admin'" class="w-3 h-3" />
                    {{ user.role }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span :class="user.status === 'active' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold">
                    <span :class="user.status === 'active' ? 'bg-accent' : 'bg-warning'" class="w-1.5 h-1.5 rounded-full"></span>
                    {{ user.status }}
                  </span>
                </td>

                <!-- Orders -->
                <td class="px-6 py-4">
                  <span class="text-sm font-semibold text-ink">{{ user.orders }}</span>
                </td>

                <!-- Joined -->
                <td class="px-6 py-4">
                  <span class="text-sm text-neutral-600">{{ formatDate(user.created) }}</span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(user)" class="btn-ghost text-xs gap-1.5" :disabled="deletingId === user.user_id">
                      <Pencil class="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button @click="confirmDelete(user)" class="btn-ghost text-xs gap-1.5 text-danger hover:bg-danger/10"
                      :disabled="deletingId === user.user_id">
                      <Trash2 class="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-16">
          <Users class="mx-auto w-12 h-12 text-neutral-300 mb-4" />
          <p class="text-neutral-500 text-sm">No users found</p>
        </div>
      </div>
    </div>

    <!-- User Modal (Create/Edit) -->
    <div v-if="showUserModal" @click="closeModal"
      class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="card-flat p-5 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-ink">
            {{ isEditMode ? 'Edit User' : 'Add New User' }}
          </h3>
          <button @click="closeModal" class="btn-ghost p-1.5 -mr-1.5">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveUser" class="space-y-4">
          <!-- First Name -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">First Name</label>
            <input v-model="newUser.first_name" type="text" required class="input-base" placeholder="John" />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Last Name</label>
            <input v-model="newUser.last_name" type="text" required class="input-base" placeholder="Doe" />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Username</label>
            <input v-model="newUser.username" type="text" required class="input-base" placeholder="johndoe" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Email</label>
            <input v-model="newUser.email" type="email" required class="input-base" placeholder="john@example.com" />
          </div>

          <!-- Password (only for create) -->
          <div v-if="!isEditMode">
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Password</label>
            <input v-model="newUser.password" type="password" required class="input-base" placeholder="••••••••" />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Role</label>
            <select v-model="newUser.role_id" class="input-base">
              <option :value="3">Customer</option>
              <option :value="2">Admin</option>
              <option :value="1">Superadmin</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Status</label>
            <select v-model="newUser.status" class="input-base">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal" class="btn-outline flex-1" :disabled="saving">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="btn-accent flex-1">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? savingLabel : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" @click="cancelDelete"
      class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="card-flat p-6 sm:p-8 max-w-sm w-full text-center">
        <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 class="w-6 h-6 text-danger" />
        </div>
        <h3 class="text-lg font-bold text-ink mb-2">Delete User</h3>
        <p class="text-sm text-neutral-600 mb-6">
          Are you sure you want to delete <strong class="text-ink">{{ userToDelete?.username }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button @click="cancelDelete" class="btn-outline flex-1" :disabled="deletingId">Cancel</button>
          <button @click="executeDelete" :disabled="deletingId" class="btn-danger flex-1">
            <Loader2 v-if="deletingId === userToDelete?.user_id" class="w-4 h-4 animate-spin" />
            {{ deletingId === userToDelete?.user_id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>