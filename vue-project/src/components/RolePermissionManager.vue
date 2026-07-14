<script setup>import { ref, computed, onMounted } from 'vue';
import { roleAPI } from '../api/roleApi';
import { useToast } from '../composables/useToast.js';
import {
    Shield, ShieldCheck, ShieldAlert,
    Loader2, AlertCircle, RefreshCw,
    Plus, Pencil, Trash2, X,
    Check, ChevronRight, Layers,
    SlidersHorizontal, Save, FileKey,
} from 'lucide-vue-next';

const emit = defineEmits(['roles-updated']);
const toast = useToast();

const roles = ref([]);
const permissions = ref([]);
const loadingRoles = ref(false);
const rolesError = ref(null);
const expandedRoleId = ref(null);
const selectedPermissions = ref({});
const savingPermissions = ref(false);

const showRoleModal = ref(false);
const editingRole = ref(null);
const roleForm = ref({ role_name: '', description: '', level: 3 });
const savingRole = ref(false);

const showPermissionModal = ref(false);
const editingPermission = ref(null);
const permissionForm = ref({ permission_key: '', permission_name: '', module: '', description: '', type: 'backend' });
const savingPermission = ref(false);

const deleteTarget = ref(null);
const showDeleteRoleConfirm = ref(false);
const showDeletePermConfirm = ref(false);
const deletingTarget = ref(false);

const availableModules = computed(() => {
    const mods = new Set(permissions.value.map(p => p.module));
    return Array.from(mods).sort();
});

const permissionsByTypeAndModule = computed(() => {
    const grouped = {};
    for (const p of permissions.value) {
        const type = p.type || 'backend';
        if (!grouped[type]) grouped[type] = { type, modules: {} };
        if (!grouped[type].modules[p.module]) grouped[type].modules[p.module] = { module: p.module, permissions: [] };
        grouped[type].modules[p.module].permissions.push(p);
    }
    // Sort types: frontend first, then backend
    const sortedTypes = Object.values(grouped).sort((a, b) => {
        const order = { frontend: 0, backend: 1 };
        return (order[a.type] ?? 99) - (order[b.type] ?? 99);
    });
    // Sort modules within each type
    for (const t of sortedTypes) {
        t.modules = Object.values(t.modules).sort((a, b) => a.module.localeCompare(b.module));
    }
    return sortedTypes;
});

const typeConfig = {
    frontend: { label: 'Front-end', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    backend:  { label: 'Back-end',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const roleLevelConfig = {
    0: { label: 'Owner',      level: 'Level 0', color: 'bg-violet-600 text-white', icon: ShieldAlert },
    1: { label: 'Superadmin', level: 'Level 1', color: 'bg-ink text-paper', icon: ShieldAlert },
    2: { label: 'Admin',      level: 'Level 2', color: 'bg-info/10 text-info', icon: ShieldCheck },
    3: { label: 'Customer',   level: 'Level 3', color: 'bg-accent/10 text-accent', icon: Shield },
};

const getRoleLevel = (role) => {
    if (!role) return { label: 'Unknown', level: '', color: 'bg-neutral-100 text-neutral-500', icon: Shield };
    const roleId = typeof role === 'object' ? role.role_id : role;
    if (typeof role === 'object' && role.level !== null && role.level !== undefined) {
        const levelNum = Number(role.level);
        if (roleLevelConfig[levelNum]) {
            return { ...roleLevelConfig[levelNum], label: roleLevelConfig[levelNum].label + (roleId > 3 ? ' (' + role.role_name + ')' : '') };
        }
        return { label: 'Level ' + levelNum, level: 'Level ' + levelNum, color: 'bg-neutral-200 text-neutral-700', icon: Shield };
    }
    return roleLevelConfig[roleId] || { label: 'Custom', level: 'Custom', color: 'bg-neutral-200 text-neutral-700', icon: Shield };
};

const fetchRoles = async () => {
    try {
        loadingRoles.value = true;
        rolesError.value = null;
        const [rolesData, permsData] = await Promise.all([roleAPI.getAllRoles(), roleAPI.getAllPermissions()]);
        roles.value = rolesData.sort((a, b) => (a.level || 99) - (b.level || 99));
        permissions.value = permsData;
        const permsMap = {};
        for (const role of rolesData) {
            if (role.permissions) {
                const ids = role.permissions.map(k => permsData.find(p => p.permission_key === k)?.permission_id).filter(Boolean);
                permsMap[role.role_id] = new Set(ids);
            }
        }
        selectedPermissions.value = permsMap;
        emit('roles-updated', roles.value);
    } catch (err) {
        rolesError.value = err.message || 'Failed to load roles';
    } finally {
        loadingRoles.value = false;
    }
};

const toggleRoleExpand = (roleId) => {
    expandedRoleId.value = expandedRoleId.value === roleId ? null : roleId;
};

const togglePermission = (roleId, permissionId) => {
    if (!selectedPermissions.value[roleId]) selectedPermissions.value[roleId] = new Set();
    const set = selectedPermissions.value[roleId];
    set.has(permissionId) ? set.delete(permissionId) : set.add(permissionId);
    selectedPermissions.value = { ...selectedPermissions.value };
};

const toggleModule = (roleId, modulePerms) => {
    if (!selectedPermissions.value[roleId]) selectedPermissions.value[roleId] = new Set();
    const set = selectedPermissions.value[roleId];
    const allEnabled = modulePerms.every(p => set.has(p.permission_id));
    for (const p of modulePerms) allEnabled ? set.delete(p.permission_id) : set.add(p.permission_id);
    selectedPermissions.value = { ...selectedPermissions.value };
};

const isModuleFullyEnabled = (roleId, modulePerms) => {
    const set = selectedPermissions.value[roleId];
    return set ? modulePerms.every(p => set.has(p.permission_id)) : false;
};

const isModulePartiallyEnabled = (roleId, modulePerms) => {
    const set = selectedPermissions.value[roleId];
    if (!set) return false;
    const enabled = modulePerms.filter(p => set.has(p.permission_id));
    return enabled.length > 0 && enabled.length < modulePerms.length;
};

const saveRolePermissions = async (roleId) => {
    try {
        savingPermissions.value = true;
        const permIds = Array.from(selectedPermissions.value[roleId] || []);
        await roleAPI.updateRolePermissions(roleId, permIds);
        toast.success('Permissions updated');
        await fetchRoles();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save permissions');
    } finally {
        savingPermissions.value = false;
    }
};

const openCreateRole = () => {
    editingRole.value = null;
    roleForm.value = { role_name: '', description: '', level: 3 };
    showRoleModal.value = true;
};

const openEditRole = (role) => {
    editingRole.value = { ...role };
    roleForm.value = { role_name: role.role_name, description: role.description || '', level: role.level || 3 };
    showRoleModal.value = true;
};

const closeRoleModal = () => {
    showRoleModal.value = false;
    editingRole.value = null;
    roleForm.value = { role_name: '', description: '', level: 3 };
};

const saveRole = async () => {
    try {
        savingRole.value = true;
        if (editingRole.value) {
            await roleAPI.updateRole(editingRole.value.role_id, roleForm.value);
            toast.success('Role updated successfully');
        } else {
            await roleAPI.createRole(roleForm.value);
            toast.success('Role created successfully');
        }
        closeRoleModal();
        await fetchRoles();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save role');
    } finally {
        savingRole.value = false;
    }
};

const confirmDeleteRole = (role) => {
    if (role.role_id <= 3) {
        toast.error('Cannot delete default system roles');
        return;
    }
    deleteTarget.value = role;
    showDeleteRoleConfirm.value = true;
};

const executeDeleteRole = async () => {
    try {
        deletingTarget.value = true;
        await roleAPI.deleteRole(deleteTarget.value.role_id);
        toast.success('Role deleted');
        showDeleteRoleConfirm.value = false;
        deleteTarget.value = null;
        await fetchRoles();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete role');
    } finally {
        deletingTarget.value = false;
    }
};

const openCreatePermission = () => {
    editingPermission.value = null;
    permissionForm.value = { permission_key: '', permission_name: '', module: '', description: '', type: 'backend' };
    showPermissionModal.value = true;
};

const openEditPermission = (perm) => {            editingPermission.value = { ...perm };
    permissionForm.value = {
        permission_key: perm.permission_key,
        permission_name: perm.permission_name,
        module: perm.module,
        description: perm.description || '',
        type: perm.type || 'backend'
    };
    showPermissionModal.value = true;
};

const closePermissionModal = () => {
    showPermissionModal.value = false;
    editingPermission.value = null;
    permissionForm.value = { permission_key: '', permission_name: '', module: '', description: '', type: 'backend' };
};

const savePermission = async () => {
    try {
        savingPermission.value = true;
        if (editingPermission.value) {
            await roleAPI.updatePermission(editingPermission.value.permission_id, permissionForm.value);
            toast.success('Permission updated successfully');
        } else {
            await roleAPI.createPermission(permissionForm.value);
            toast.success('Permission created successfully');
        }
        closePermissionModal();
        await fetchRoles();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save permission');
    } finally {
        savingPermission.value = false;
    }
};

const confirmDeletePermission = (perm) => {
    deleteTarget.value = perm;
    showDeletePermConfirm.value = true;
};

const executeDeletePermission = async () => {
    try {
        deletingTarget.value = true;
        await roleAPI.deletePermission(deleteTarget.value.permission_id);
        toast.success('Permission deleted');
        showDeletePermConfirm.value = false;
        deleteTarget.value = null;
        await fetchRoles();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete permission');
    } finally {
        deletingTarget.value = false;
    }
};

onMounted(() => {
    fetchRoles();
});
</script>

<template>
<div>
        <div v-if="loadingRoles && roles.length === 0" class="card-flat p-12 text-center">
            <Loader2 class="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
            <p class="text-neutral-500 text-sm">Loading roles...</p>
        </div>

        <div v-else-if="rolesError" class="card-flat border-l-4 border-danger p-6 mb-6 flex items-center gap-3">
            <AlertCircle class="w-6 h-6 text-danger shrink-0" />
            <p class="text-sm text-neutral-600 flex-1">{{ rolesError }}</p>
            <button @click="fetchRoles" class="btn-primary text-sm shrink-0">
                <RefreshCw class="w-3.5 h-3.5" /> Retry
            </button>
        </div>

        <div v-else class="grid gap-6">
            <div v-for="role in roles" :key="role.role_id" class="card-flat overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center justify-between">
                        <div @click="toggleRoleExpand(role.role_id)" class="flex items-center gap-4 flex-1 min-w-0 cursor-pointer">
                            <div :class="['w-12 h-12 rounded-xl inline-flex items-center justify-center shrink-0', getRoleLevel(role).color]">
                                <component :is="getRoleLevel(role).icon" class="w-6 h-6" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3">
                                    <h3 class="font-bold text-ink text-lg truncate">{{ role.role_name }}</h3>
                                    <span v-if="role.role_id <= 3" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-600">System</span>
                                    <span v-if="role.level !== null && role.level !== undefined" :class="['inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold shrink-0', getRoleLevel(role).color]">L{{ role.level }}</span>
                                </div>
                                <p class="text-sm text-neutral-500 mt-0.5 truncate">{{ role.description || 'No description' }}</p>
                                <div class="flex items-center gap-3 mt-2">
                                    <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider', getRoleLevel(role).color]">
                                        <component :is="getRoleLevel(role).icon" class="w-3 h-3" />
                                        {{ getRoleLevel(role).level }}
                                    </span>
                                    <span class="text-xs text-neutral-300">·</span>
                                    <span class="text-xs text-neutral-500">{{ role.user_count }} user{{ role.user_count !== 1 ? 's' : '' }}</span>
                                    <span class="text-xs text-neutral-300">·</span>
                                    <span class="text-xs text-neutral-500">{{ role.permissions?.length || 0 }} permission{{ role.permissions?.length !== 1 ? 's' : '' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0 ml-4">
                            <button @click="openEditRole(role)" class="btn-ghost text-xs gap-1.5" :title="'Edit ' + role.role_name"><Pencil class="w-3.5 h-3.5" /></button>
                            <button v-if="role.role_id > 3" @click="confirmDeleteRole(role)" class="btn-ghost text-xs gap-1.5 text-danger hover:bg-danger/10" :title="'Delete ' + role.role_name"><Trash2 class="w-3.5 h-3.5" /></button>
                            <button @click="toggleRoleExpand(role.role_id)" class="btn-ghost p-1.5">
                                <ChevronRight class="w-5 h-5 text-neutral-400 transition-transform duration-200" :class="{ 'rotate-90': expandedRoleId === role.role_id }" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="expandedRoleId === role.role_id" class="border-t border-neutral-200 p-6 bg-neutral-50/50">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h4 class="font-bold text-ink text-sm flex items-center gap-2"><SlidersHorizontal class="w-4 h-4" /> Permission Settings</h4>
                            <p class="text-xs text-neutral-500 mt-0.5">Configure access rights for this role</p>
                        </div>
                        <button @click="saveRolePermissions(role.role_id)" :disabled="savingPermissions" class="btn-accent text-sm gap-2">
                            <Loader2 v-if="savingPermissions" class="w-4 h-4 animate-spin" />
                            <Save v-else class="w-4 h-4" />
                            {{ savingPermissions ? 'Saving...' : 'Save Permissions' }}
                        </button>
                    </div>

                    <div v-if="permissionsByTypeAndModule.length === 0" class="text-center py-8 text-neutral-400 text-sm">No permissions defined yet.</div>

                    <div v-else>
                        <div v-for="typeGroup in permissionsByTypeAndModule" :key="typeGroup.type" class="mb-6 last:mb-0">
                            <!-- Type header -->
                            <div class="flex items-center gap-2 mb-3 px-1">
                                <div :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border', typeConfig[typeGroup.type]?.color || 'bg-neutral-100 text-neutral-600 border-neutral-200']">
                                    <Settings2 class="w-3 h-3" />
                                    {{ typeConfig[typeGroup.type]?.label || typeGroup.type }}
                                </div>
                                <span class="text-[10px] text-neutral-400">— {{ typeGroup.modules.reduce((acc, m) => acc + m.permissions.length, 0) }} permission{{ typeGroup.modules.reduce((acc, m) => acc + m.permissions.length, 0) !== 1 ? 's' : '' }}</span>
                            </div>
                            <!-- Module groups -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div v-for="moduleGroup in typeGroup.modules" :key="moduleGroup.module" class="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                    <div @click="toggleModule(role.role_id, moduleGroup.permissions)" class="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition-colors">
                                        <div class="flex items-center gap-2">
                                            <Layers class="w-4 h-4 text-neutral-500" />
                                            <span class="text-xs font-bold uppercase tracking-wider text-neutral-600">{{ moduleGroup.module }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-[10px] text-neutral-400">{{ moduleGroup.permissions.filter(p => selectedPermissions[role.role_id]?.has(p.permission_id)).length }}/{{ moduleGroup.permissions.length }}</span>
                                            <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center transition-all', isModuleFullyEnabled(role.role_id, moduleGroup.permissions) ? 'bg-accent border-accent' : isModulePartiallyEnabled(role.role_id, moduleGroup.permissions) ? 'bg-accent/30 border-accent' : 'border-neutral-300']">
                                                <Check v-if="isModuleFullyEnabled(role.role_id, moduleGroup.permissions)" class="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="divide-y divide-neutral-100">
                                        <div v-for="perm in moduleGroup.permissions" :key="perm.permission_id" class="px-4 py-2.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition-colors group">
                                            <div @click="togglePermission(role.role_id, perm.permission_id)" class="flex items-center gap-3 flex-1 min-w-0">
                                                <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0', selectedPermissions[role.role_id]?.has(perm.permission_id) ? 'bg-accent border-accent' : 'border-neutral-300']">
                                                    <Check v-if="selectedPermissions[role.role_id]?.has(perm.permission_id)" class="w-3 h-3 text-white" />
                                                </div>
                                                <div>
                                                    <p class="text-sm font-medium text-ink">{{ perm.permission_name }}</p>
                                                    <p class="text-[10px] text-neutral-400 font-mono mt-0.5">{{ perm.permission_key }}</p>
                                                    <!-- Type badge on individual permission -->
                                                    <span v-if="perm.type" :class="['inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border mt-1', typeConfig[perm.type]?.color || 'bg-neutral-100 text-neutral-600 border-neutral-200']">
                                                        {{ (typeConfig[perm.type]?.label || perm.type).substring(0, 4) }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button @click.stop="openEditPermission(perm)" class="btn-ghost p-1 text-xs" title="Edit permission"><Pencil class="w-3.5 h-3.5" /></button>
                                                <button @click.stop="confirmDeletePermission(perm)" class="btn-ghost p-1 text-xs text-danger hover:bg-danger/10" title="Delete permission"><Trash2 class="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Role Modal -->
        <div v-if="showRoleModal" @click="closeRoleModal" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-5 sm:p-8 max-w-md w-full">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-ink">{{ editingRole ? 'Edit Role' : 'Add New Role' }}</h3>
                    <button @click="closeRoleModal" class="btn-ghost p-1.5 -mr-1.5"><X class="w-5 h-5" /></button>
                </div>
                <form @submit.prevent="saveRole" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Role Name</label>
                        <input v-model="roleForm.role_name" type="text" required class="input-base" placeholder="e.g. moderator" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Description</label>
                        <textarea v-model="roleForm.description" rows="3" class="input-base resize-none" placeholder="What this role can do..."></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Level</label>
                        <select v-model="roleForm.level" class="input-base">
                            <option :value="0">Level 0 Owner</option>
                            <option :value="1">Level 1 Superadmin</option>
                            <option :value="2">Level 2 Admin</option>
                            <option :value="3">Level 3 Customer</option>
                        </select>
                    </div>
                    <div v-if="!editingRole" class="text-xs text-neutral-400">New roles start with read/view permissions by default.</div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="closeRoleModal" class="btn-outline flex-1" :disabled="savingRole">Cancel</button>
                        <button type="submit" :disabled="savingRole" class="btn-accent flex-1">
                            <Loader2 v-if="savingRole" class="w-4 h-4 animate-spin" />
                            {{ savingRole ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Role Confirmation -->
        <div v-if="showDeleteRoleConfirm" @click="showDeleteRoleConfirm = false" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-6 sm:p-8 max-w-sm w-full text-center">
                <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 class="w-6 h-6 text-danger" />
                </div>
                <h3 class="text-lg font-bold text-ink mb-2">Delete Role</h3>
                <p class="text-sm text-neutral-600 mb-2">Are you sure you want to delete <strong class="text-ink">{{ deleteTarget?.role_name }}</strong>?</p>
                <p class="text-xs text-neutral-500 mb-6">Users assigned this role will be moved to the default Customer role.</p>
                <div class="flex gap-3">
                    <button @click="showDeleteRoleConfirm = false" class="btn-outline flex-1" :disabled="deletingTarget">Cancel</button>
                    <button @click="executeDeleteRole" :disabled="deletingTarget" class="btn-danger flex-1">
                        <Loader2 v-if="deletingTarget" class="w-4 h-4 animate-spin" />
                        {{ deletingTarget ? 'Deleting...' : 'Delete Role' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Permission Modal -->
        <div v-if="showPermissionModal" @click="closePermissionModal" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-5 sm:p-8 max-w-md w-full">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-ink">{{ editingPermission ? 'Edit Permission' : 'Add New Permission' }}</h3>
                    <button @click="closePermissionModal" class="btn-ghost p-1.5 -mr-1.5"><X class="w-5 h-5" /></button>
                </div>
                <form @submit.prevent="savePermission" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Permission Key</label>
                        <input v-model="permissionForm.permission_key" type="text" required class="input-base font-mono text-sm" placeholder="e.g. products.publish" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Display Name</label>
                        <input v-model="permissionForm.permission_name" type="text" required class="input-base" placeholder="e.g. Publish Products" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Module</label>
                        <div class="flex gap-2">
                            <input v-model="permissionForm.module" type="text" required class="input-base flex-1" placeholder="e.g. products" list="module-suggestions" />
                            <datalist id="module-suggestions">
                                <option v-for="mod in availableModules" :key="mod" :value="mod" />
                            </datalist>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Type</label>
                        <select v-model="permissionForm.type" class="input-base">
                            <option value="frontend">Front-end — Page access / UI visibility</option>
                            <option value="backend">Back-end — API operations / CRUD actions</option>
                        </select>
                        <p class="text-[10px] text-neutral-400 mt-1">Front-end controls page visibility; Back-end controls data operations.</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-[0.15em] text-ink mb-2">Description</label>
                        <textarea v-model="permissionForm.description" rows="2" class="input-base resize-none" placeholder="What this permission allows..."></textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="closePermissionModal" class="btn-outline flex-1" :disabled="savingPermission">Cancel</button>
                        <button type="submit" :disabled="savingPermission" class="btn-accent flex-1">
                            <Loader2 v-if="savingPermission" class="w-4 h-4 animate-spin" />
                            {{ savingPermission ? 'Saving...' : (editingPermission ? 'Update Permission' : 'Create Permission') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Permission Confirmation -->
        <div v-if="showDeletePermConfirm" @click="showDeletePermConfirm = false" class="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
            <div @click.stop class="card-flat p-6 sm:p-8 max-w-sm w-full text-center">
                <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 class="w-6 h-6 text-danger" />
                </div>
                <h3 class="text-lg font-bold text-ink mb-2">Delete Permission</h3>
                <p class="text-sm text-neutral-600 mb-6">Are you sure you want to delete <strong class="text-ink">{{ deleteTarget?.permission_name }}</strong>? This will remove it from all roles.</p>
                <div class="flex gap-3">
                    <button @click="showDeletePermConfirm = false" class="btn-outline flex-1" :disabled="deletingTarget">Cancel</button>
                    <button @click="executeDeletePermission" :disabled="deletingTarget" class="btn-danger flex-1">
                        <Loader2 v-if="deletingTarget" class="w-4 h-4 animate-spin" />
                        {{ deletingTarget ? 'Deleting...' : 'Delete Permission' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
