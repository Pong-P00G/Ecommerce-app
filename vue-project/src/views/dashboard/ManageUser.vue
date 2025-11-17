<script setup>
import { ref, reactive, computed } from 'vue';
import { Plus, Pencil, Trash2, X, Save, Users, Shield, UserCheck, Sparkles, Search, Filter } from 'lucide-vue-next';
import { getAllUsers, createUsers, updateUser, deleteUser } from '../../api/api.js';
import { onMounted } from 'vue';
import { useToast } from '../../composables/useToast.js';

const { success, error } = useToast();

const users = ref([]);

async function fetchUsers() {
  try {
    const response = await getAllUsers();
    users.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(fetchUsers);

const search = ref('');
const roleFilter = ref('all');

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const editingId = ref(null);

const form = reactive({
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  role: 'User',
  status: 'Active'
});

const errors = reactive({
  username: '',
  firstname: '',
  lastname: '',
  email: ''
});

const roles = ['Admin', 'User'];
const statuses = ['Active', 'Suspended'];

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase();
  return users.value.filter(u => {
    const matchesTerm =
      !term ||
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term);
    const matchesRole = roleFilter.value === 'all' || u.role === roleFilter.value;
    return matchesTerm && matchesRole;
  });
});

const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.status === 'Active').length,
  admins: users.value.filter(u => u.role === 'Admin').length,
}));

function resetForm() {
  form.username = '';
  form.firstname = '';
  form.lastname = '';
  form.email = '';
  form.role = 'User';
  form.status = 'Active';
  errors.username = '';
  errors.firstname = '';
  errors.lastname = '';
  errors.email = '';
  editingId.value = null;
}

function openCreate() {
  resetForm();
  isModalOpen.value = true;
}

function openEdit(user) {
  form.username = user.username;
  form.firstname = user.firstname || '';
  form.lastname = user.lastname || '';
  form.email = user.email;
  form.role = user.role;
  form.status = user.status;
  errors.username = '';
  errors.firstname = '';
  errors.lastname = '';
  errors.email = '';
  editingId.value = user.id;
  isModalOpen.value = true;
}

function validate() {
  let ok = true;
  errors.username = form.username.trim() ? '' : 'Username is required';
  errors.firstname = form.firstname.trim() ? '' : 'First name is required';
  errors.lastname = form.lastname.trim() ? '' : 'Last name is required';

  if (!form.email.trim()) {
    errors.email = 'Email is required';
    ok = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email';
    ok = false;
  } else {
    errors.email = '';
  }

  if (!form.username.trim() || !form.firstname.trim() || !form.lastname.trim()) ok = false;
  return ok;
}

async function saveUser() {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    const payload = {
      username: form.username.trim(),
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    };
    if (editingId.value == null) {
      await createUsers(payload);
      success('User created successfully!');
    } else {
      await updateUser(editingId.value, payload);
      success('User updated successfully!');
    }
    fetchUsers();
    closeModal();
  } catch (err) {
    error('Failed to save user.');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDeleteUser(user) {
  const confirmed = window.confirm(`Delete user "${user.username}"? This cannot be undone.`);
  if (!confirmed) return;
  try {
    await deleteUser(user.id);
    await fetchUsers();
    success('User deleted successfully!');
  } catch (err) {
    error('Failed to delete user.');
  }
}

function closeModal() {
  isModalOpen.value = false;
  resetForm();
}
</script>

<template>
  <div class="min-h-screen p-6 space-y-8 bg-linear-to-br from-slate-50 via-gray-50 to-zinc-50">
    <!-- Modern Header -->
    <div class="relative">
      <div class="absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 blur-3xl opacity-20 rounded-3xl"></div>
      <div class="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg">
              <Users class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-4xl font-black bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p class="text-gray-500 mt-1 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                Control user accounts and permissions
              </p>
            </div>
          </div>
          <button
            @click="openCreate"
            class="group px-6 py-3 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-bold">
            <Plus class="w-5 h-5" />
            Add New User
          </button>
        </div>
      </div>
    </div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        <div class="absolute inset-0 bg-linear-to-br from-violet-500 to-purple-600 opacity-5 rounded-3xl"></div>
        <div class="relative space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Users</p>
              <h3 class="text-4xl font-black text-gray-900 mt-2">{{ stats.total }}</h3>
            </div>
            <div class="p-4 bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
              <Users class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div class="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        <div class="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-600 opacity-5 rounded-3xl"></div>
        <div class="relative space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Users</p>
              <h3 class="text-4xl font-black text-gray-900 mt-2">{{ stats.active }}</h3>
            </div>
            <div class="p-4 bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
              <UserCheck class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div class="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        <div class="absolute inset-0 bg-linear-to-br from-amber-500 to-orange-600 opacity-5 rounded-3xl"></div>
        <div class="relative space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-500 uppercase tracking-wide">Administrators</p>
              <h3 class="text-4xl font-black text-gray-900 mt-2">{{ stats.admins }}</h3>
            </div>
            <div class="p-4 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <Shield class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Filters Section -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl">
          <Filter class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-2xl font-black text-gray-900">Filters</h2>
      </div>
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="flex-1">
          <label for="search" class="block text-sm font-bold text-gray-900 mb-2">Search</label>
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="search"
              v-model="search"
              type="text"
              placeholder="Search by name, email, or role..."
              class="w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
            />
          </div>
        </div>
        <div class="sm:w-64">
          <label for="roleFilter" class="block text-sm font-bold text-gray-900 mb-2">Role</label>
          <select
            id="roleFilter"
            v-model="roleFilter"
            class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 font-medium">
            <option value="all">All roles</option>
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>
    </div>
    <!-- Users Table -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b-2 border-gray-200 bg-gray-50/50">
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">User</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Email</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Role</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Status</th>
              <th class="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wide">Created</th>
              <th class="px-6 py-4 text-right text-sm font-black text-gray-900 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <Users class="w-16 h-16 text-gray-300" />
                  <p class="text-gray-500 font-medium">No users found</p>
                </div>
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id"
              class="border-b border-gray-100 hover:bg-violet-50/50 transition-colors duration-200">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-sm">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-black text-gray-900">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-600 font-medium">{{ user.email }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-3 py-1 rounded-xl text-xs font-black"
                  :class="user.role === 'Admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-3 py-1 rounded-xl text-xs font-black"
                  :class="user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ user.createdAt }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="group px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                    @click="openEdit(user)">
                    <Pencil class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    class="group px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                    @click="handleDeleteUser(user)">
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-black bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            {{ editingId == null ? 'Add New User' : 'Edit User' }}
          </h2>
          <button
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            @click="closeModal">
            <X class="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <form @submit.prevent="saveUser" class="space-y-6">
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="firstname" class="block text-sm font-bold text-gray-900 mb-2">First Name</label>
              <input
                id="firstname"
                v-model="form.firstname"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.firstname }"
                placeholder="Enter first name"
              />
              <p v-if="errors.firstname" class="mt-2 text-sm text-red-600 font-bold">{{ errors.firstname }}</p>
            </div>
            <div>
              <label for="lastname" class="block text-sm font-bold text-gray-900 mb-2">Last Name</label>
              <input
                id="lastname"
                v-model="form.lastname"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                :class="{ 'border-red-500': errors.lastname }"
                placeholder="Enter last name"
              />
              <p v-if="errors.lastname" class="mt-2 text-sm text-red-600 font-bold">{{ errors.lastname }}</p>
            </div>
          </div>
          <div>
            <label for="username" class="block text-sm font-bold text-gray-900 mb-2">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
              :class="{ 'border-red-500': errors.username }"
              placeholder="Enter username"
            />
            <p v-if="errors.username" class="mt-2 text-sm text-red-600 font-bold">{{ errors.username }}</p>
          </div>
          <div>
            <label for="email" class="block text-sm font-bold text-gray-900 mb-2">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
              :class="{ 'border-red-500': errors.email }"
              placeholder="user@example.com"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600 font-bold">{{ errors.email }}</p>
          </div>
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="role" class="block text-sm font-bold text-gray-900 mb-2">Role</label>
              <select
                id="role"
                v-model="form.role"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 font-medium">
                <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div>
              <label for="status" class="block text-sm font-bold text-gray-900 mb-2">Status</label>
              <select
                id="status"
                v-model="form.status"
                class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-gray-900 font-medium">
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-end gap-4 pt-4 border-t-2 border-gray-100">
            <button
              type="button"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-2xl transition-all duration-300 font-bold"
              @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting">
              <Save class="w-5 h-5" />
              {{ isSubmitting ? 'Saving...' : (editingId == null ? 'Create User' : 'Save Changes') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
