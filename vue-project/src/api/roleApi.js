import api from './api';

export const roleAPI = {
    async getAllRoles() {
        const { data } = await api.get('/roles');
        return data.data ?? data;
    },

    async getRoleDetail(id) {
        const { data } = await api.get(`/roles/${id}`);
        return data.data ?? data;
    },

    async createRole(roleData) {
        const { data } = await api.post('/roles', roleData);
        return data.data ?? data;
    },

    async updateRole(roleId, roleData) {
        const { data } = await api.put(`/roles/${roleId}`, roleData);
        return data.data ?? data;
    },

    async deleteRole(roleId) {
        const { data } = await api.delete(`/roles/${roleId}`);
        return data.data ?? data;
    },

    async getAllPermissions() {
        const { data } = await api.get('/roles/permissions');
        return data.data ?? data;
    },

    async createPermission(permData) {
        const { data } = await api.post('/roles/permissions', permData);
        return data.data ?? data;
    },

    async updatePermission(permissionId, permData) {
        const { data } = await api.put(`/roles/permissions/${permissionId}`, permData);
        return data.data ?? data;
    },

    async deletePermission(permissionId) {
        const { data } = await api.delete(`/roles/permissions/${permissionId}`);
        return data.data ?? data;
    },

    async updateRolePermissions(roleId, permissionIds) {
        const { data } = await api.put(`/roles/${roleId}/permissions`, {
            permission_ids: permissionIds
        });
        return data.data ?? data;
    }
};
