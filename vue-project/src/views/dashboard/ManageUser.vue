<script setup>
import { ref, computed, onMounted } from 'vue';
import { userAPI } from '../../api/userApi';

// State
const users = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const filterRole = ref('all');
const filterStatus = ref('all');
const showUserModal = ref(false);
const selectedUser = ref(null);
const isEditMode = ref(false);

const newUser = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role_id: 2, // Default to customer (2)
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
      role: user.role_id === 1 ? 'Admin' : 'Customer',
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

// Methods
const openCreateModal = () => {
  isEditMode.value = false;
  newUser.value = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 2,
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
    loading.value = true;

    if (isEditMode.value) {
      // Update user - API expects specific format
      const updateData = {
        username: newUser.value.username,
        first_name: newUser.value.first_name,
        last_name: newUser.value.last_name,
        email: newUser.value.email
      };

      await userAPI.updateUser(selectedUser.value.user_id, updateData);
      alert('User updated successfully!');
    } else {
      // Create new user - use register endpoint
      const createData = {
        username: newUser.value.username,
        first_name: newUser.value.first_name,
        last_name: newUser.value.last_name,
        email: newUser.value.email,
        password: newUser.value.password,
        role_id: newUser.value.role_id
      };

      await userAPI.createUser(createData);
      alert('User created successfully!');
    }

    // Refresh user list
    await fetchUsers();
    closeModal();
  } catch (err) {
    console.error('Error saving user:', err);
    alert(err.response?.data?.message || 'Failed to save user');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
    try {
      loading.value = true;
      await userAPI.deleteUser(user.user_id);
      alert('User deleted successfully!');
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      loading.value = false;
    }
  }
};

const getStatusClass = (status) => {
  return status === 'active'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';
};

const getRoleClass = (role) => {
  return role === 'Admin'
    ? 'bg-purple-100 text-purple-700'
    : 'bg-blue-100 text-blue-700';
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
        <button @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-ink text-white rounded-lg hover:bg-neutral-800 transition-colors font-semibold text-sm">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div class="bg-paper rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Total Users</p>
          <p class="text-3xl font-bold text-ink">{{ totalUsers }}</p>
        </div>

        <div class="bg-paper rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Active Users</p>
          <p class="text-3xl font-bold text-ink">{{ activeUsers }}</p>
        </div>

        <div class="bg-paper rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 text-sm mb-1">Administrators</p>
          <p class="text-3xl font-bold text-ink">{{ adminCount }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-paper rounded-2xl shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-1">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search users..." :disabled="loading"
                class="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50" />
              <svg class="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Role Filter -->
          <select v-model="filterRole" :disabled="loading"
            class="px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-paper disabled:opacity-50">
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>

          <!-- Status Filter -->
          <select v-model="filterStatus" :disabled="loading"
            class="px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-paper disabled:opacity-50">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
        <div class="flex items-center gap-3">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-red-900 font-semibold">Error Loading Users</h3>
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
          <button @click="fetchUsers"
            class="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && users.length === 0" class="bg-paper rounded-2xl shadow-sm p-12 text-center">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
        <p class="text-neutral-500">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-paper rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">User</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Orders</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Joined</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions
                </th>
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
                  <span :class="getRoleClass(user.role)" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ user.role }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span :class="getStatusClass(user.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
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
                  <div class="flex items-center justify-end gap-2 flex-wrap">
                    <button @click="openEditModal(user)"
                      class="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                      Edit
                    </button>
                    <button @click="deleteUser(user)"
                      class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-neutral-500">No users found</p>
        </div>
      </div>
    </div>

    <!-- User Modal (Create/Edit) -->
    <div v-if="showUserModal" @click="closeModal"
      class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-paper rounded-2xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-ink mb-6">
          {{ isEditMode ? 'Edit User' : 'Add New User' }}
        </h3>

        <form @submit.prevent="saveUser" class="space-y-4">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-semibold text-ink mb-2">First Name</label>
            <input v-model="newUser.first_name" type="text" required
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="John" />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-semibold text-ink mb-2">Last Name</label>
            <input v-model="newUser.last_name" type="text" required
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="Doe" />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-semibold text-ink mb-2">Username</label>
            <input v-model="newUser.username" type="text" required
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="johndoe" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-ink mb-2">Email</label>
            <input v-model="newUser.email" type="email" required
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="john@example.com" />
          </div>

          <!-- Password (only for create) -->
          <div v-if="!isEditMode">
            <label class="block text-sm font-semibold text-ink mb-2">Password</label>
            <input v-model="newUser.password" type="password" required
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="••••••••" />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-semibold text-ink mb-2">Role</label>
            <select v-model="newUser.role_id"
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-paper">
              <option :value="2">Customer</option>
              <option :value="1">Admin</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-ink mb-2">Status</label>
            <select v-model="newUser.status"
              class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-paper">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal"
              class="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-semibold">
              Cancel
            </button>
            <button type="submit" :disabled="loading"
              class="flex-1 px-6 py-3 bg-ink text-white rounded-lg hover:bg-neutral-800 transition-colors font-semibold disabled:opacity-50">
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>