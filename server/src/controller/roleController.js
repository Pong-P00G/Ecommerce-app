import * as roleService from '../services/roleService.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRole = async (req, res) => {
    try {
        const role = await roleService.getRoleDetail(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createRole = async (req, res) => {
    try {
        const { role_name, description, level } = req.body;
        if (!role_name) {
            return res.status(400).json({ success: false, message: 'Role name is required' });
        }
        const performedBy = req.user?.username || 'system';
        const role = await roleService.createRole(role_name, description || '', performedBy, level || 3);
        res.status(201).json({ success: true, data: role, message: 'Role created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { role_name, description, level } = req.body;
        if (!role_name) {
            return res.status(400).json({ success: false, message: 'Role name is required' });
        }
        const performedBy = req.user?.username || 'system';
        const role = await roleService.updateRole(Number(req.params.roleId), role_name, description || '', performedBy, level);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.json({ success: true, data: role, message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const roleId = Number(req.params.roleId);
        if (roleId <= 3) {
            return res.status(400).json({ success: false, message: 'Cannot delete default system roles' });
        }
        const performedBy = req.user?.username || 'system';
        await roleService.deleteRole(roleId, performedBy);
        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPermissions = async (req, res) => {
    try {
        const permissions = await roleService.getAllPermissions();
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPermission = async (req, res) => {
    try {
        const { permission_key, permission_name, module, description, type } = req.body;
        if (!permission_key || !permission_name || !module) {
            return res.status(400).json({ success: false, message: 'permission_key, permission_name, and module are required' });
        }
        const performedBy = req.user?.username || 'system';
        const perm = await roleService.createPermission(permission_key, permission_name, module, description || '', performedBy, type || 'backend');
        res.status(201).json({ success: true, data: perm, message: 'Permission created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePermission = async (req, res) => {
    try {
        const { permission_key, permission_name, module, description, type } = req.body;
        if (!permission_key || !permission_name || !module) {
            return res.status(400).json({ success: false, message: 'permission_key, permission_name, and module are required' });
        }
        const performedBy = req.user?.username || 'system';
        const perm = await roleService.updatePermission(Number(req.params.permissionId), permission_key, permission_name, module, description || '', performedBy, type);
        if (!perm) {
            return res.status(404).json({ success: false, message: 'Permission not found' });
        }
        res.json({ success: true, data: perm, message: 'Permission updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePermission = async (req, res) => {
    try {
        const performedBy = req.user?.username || 'system';
        await roleService.deletePermission(Number(req.params.permissionId), performedBy);
        res.json({ success: true, message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { permission_ids } = req.body;
        
        if (!permission_ids || !Array.isArray(permission_ids)) {
            return res.status(400).json({ success: false, message: 'permission_ids array required' });
        }

        const performedBy = req.user?.username || 'system';
        await roleService.updateRolePermissions(Number(roleId), permission_ids, performedBy);
        
        const role = await roleService.getRoleDetail(Number(roleId));
        res.json({ success: true, data: role, message: 'Permissions updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
