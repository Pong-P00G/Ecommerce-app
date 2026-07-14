import * as roleService from '../services/roleService.js';

export const getUserPermissions = async (req, res) => {
    try {
        const roleId = req.user.role_id;
        const role = await roleService.getRoleDetail(roleId);
        if (!role) {
            return res.json({ success: true, data: [] });
        }
        const permissionKeys = role.permissions.map(p => p.permission_key);
        res.json({ success: true, data: permissionKeys });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
