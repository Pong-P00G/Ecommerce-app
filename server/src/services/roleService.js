import * as RoleModel from '../model/roleModel.js';
import * as NotificationModel from '../model/notificationModel.js';

export const getAllRoles = async () => {
    const roles = await RoleModel.getAllRoles();
    const result = [];
    for (const role of roles) {
        const permissions = await RoleModel.getRolePermissions(role.role_id);
        const users = await RoleModel.getUsersByRole(role.role_id);
        result.push({
            ...role,
            permissions: permissions.map(p => p.permission_key),
            user_count: users.length
        });
    }
    return result.sort((a, b) => (a.level || 99) - (b.level || 99));
};

export const getRoleDetail = async (roleId) => {
    const role = await RoleModel.getRoleById(roleId);
    if (!role) return null;
    const permissions = await RoleModel.getRolePermissions(roleId);
    const users = await RoleModel.getUsersByRole(roleId);
    return {
        ...role,
        permissions: permissions.map(p => ({
            permission_id: p.permission_id,
            permission_key: p.permission_key,
            permission_name: p.permission_name,
            module: p.module
        })),
        user_count: users.length
    };
};

export const createRole = async (roleName, description, performedBy = 'system', level = 3) => {
    const role = await RoleModel.createRole(roleName, description, level);
    // Give new role default view permissions
    const allPerms = await RoleModel.getAllPermissions();
    const basicIds = allPerms
        .filter(p => p.permission_key.endsWith('.read') || p.permission_key.endsWith('.view'))
        .map(p => p.permission_id);
    if (basicIds.length > 0) {
        await RoleModel.setRolePermissions(role.role_id, basicIds);
    }
    // Audit log
    try {
        await NotificationModel.createAuditLog({
            action: 'create',
            entity_type: 'role',
            entity_id: role.role_id,
            entity_name: roleName,
            performed_by: performedBy,
            details: `Created role "${roleName}"`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return role;
};

export const updateRole = async (roleId, roleName, description, performedBy = 'system', level) => {
    const oldRole = await RoleModel.getRoleById(roleId);
    const result = await RoleModel.updateRole(roleId, roleName, description, level);
    // Audit log
    try {
        const oldName = oldRole?.role_name || 'Unknown';
        await NotificationModel.createAuditLog({
            action: 'update',
            entity_type: 'role',
            entity_id: roleId,
            entity_name: roleName,
            performed_by: performedBy,
            details: `Updated role "${oldName}" → "${roleName}"`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return result;
};

export const deleteRole = async (roleId, performedBy = 'system') => {
    const oldRole = await RoleModel.getRoleById(roleId);
    const result = await RoleModel.deleteRole(roleId);
    // Audit log
    try {
        await NotificationModel.createAuditLog({
            action: 'delete',
            entity_type: 'role',
            entity_id: roleId,
            entity_name: oldRole?.role_name || 'Unknown',
            performed_by: performedBy,
            details: `Deleted role "${oldRole?.role_name || 'Unknown'}"`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return result;
};

export const getAllPermissions = async () => {
    return await RoleModel.getAllPermissions();
};

export const createPermission = async (permissionKey, permissionName, module, description, performedBy = 'system', type = 'backend') => {
    const result = await RoleModel.createPermission(permissionKey, permissionName, module, description, type);
    // Audit log
    try {
        await NotificationModel.createAuditLog({
            action: 'create',
            entity_type: 'permission',
            entity_id: result.permission_id,
            entity_name: permissionName,
            performed_by: performedBy,
            details: `Created permission "${permissionName}" (${permissionKey}) in module "${module}" [${type}]`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return result;
};

export const updatePermission = async (permissionId, permissionKey, permissionName, module, description, performedBy = 'system', type) => {
    const result = await RoleModel.updatePermission(permissionId, permissionKey, permissionName, module, description, type);
    // Audit log
    try {
        await NotificationModel.createAuditLog({
            action: 'update',
            entity_type: 'permission',
            entity_id: permissionId,
            entity_name: permissionName,
            performed_by: performedBy,
            details: `Updated permission to "${permissionName}" (${permissionKey}) in module "${module}"${type ? ' [' + type + ']' : ''}`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return result;
};

export const deletePermission = async (permissionId, performedBy = 'system') => {
    // Get name before deletion
    const allPerms = await RoleModel.getAllPermissions();
    const perm = allPerms.find(p => p.permission_id === permissionId);
    const result = await RoleModel.deletePermission(permissionId);
    // Audit log
    try {
        await NotificationModel.createAuditLog({
            action: 'delete',
            entity_type: 'permission',
            entity_id: permissionId,
            entity_name: perm?.permission_name || 'Unknown',
            performed_by: performedBy,
            details: `Deleted permission "${perm?.permission_name || 'Unknown'}" (${perm?.permission_key || ''})`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return result;
};

export const updateRolePermissions = async (roleId, permissionIds, performedBy = 'system') => {
    const oldRole = await RoleModel.getRoleById(roleId);
    const result = await RoleModel.setRolePermissions(roleId, permissionIds);
    // Audit log
    try {
        await NotificationModel.createAuditLog({
            action: 'update_permissions',
            entity_type: 'role',
            entity_id: roleId,
            entity_name: oldRole?.role_name || 'Unknown',
            performed_by: performedBy,
            details: `Updated permissions for role "${oldRole?.role_name || 'Unknown'}" (${permissionIds.length} permissions assigned)`
        });
    } catch (err) {
        console.warn('Failed to audit log:', err.message);
    }
    return result;
};

export const seedDefaultPermissions = async () => {
    const exists = await RoleModel.tableExists('permissions');
    if (!exists) return { created: false, reason: 'permissions table does not exist' };

    const existing = await RoleModel.getAllPermissions();
    if (existing.length > 0) return { created: false, reason: 'permissions already seeded' };

    const defaultPerms = [
        // ── FRONT-END permissions (page access / UI) ──
        { key: 'pages.dashboard', name: 'Dashboard Page', module: 'pages', desc: 'Access the admin dashboard page', type: 'frontend' },
        { key: 'pages.products', name: 'Products Page', module: 'pages', desc: 'View products listing and details page', type: 'frontend' },
        { key: 'pages.orders', name: 'Orders Page', module: 'pages', desc: 'View orders management page', type: 'frontend' },
        { key: 'pages.users', name: 'Users Page', module: 'pages', desc: 'View user management page', type: 'frontend' },
        { key: 'pages.roles', name: 'Roles Page', module: 'pages', desc: 'View roles & permissions page', type: 'frontend' },
        { key: 'pages.settings', name: 'Settings Page', module: 'pages', desc: 'Access store settings page', type: 'frontend' },
        { key: 'pages.reports', name: 'Reports Page', module: 'pages', desc: 'View reports and analytics page', type: 'frontend' },
        { key: 'pages.reviews', name: 'Reviews Page', module: 'pages', desc: 'Access reviews moderation page', type: 'frontend' },
        { key: 'pages.discounts', name: 'Discounts Page', module: 'pages', desc: 'View discounts management page', type: 'frontend' },
        { key: 'pages.stock', name: 'Stock Page', module: 'pages', desc: 'View inventory/stock page', type: 'frontend' },

        // ── BACK-END permissions (API operations / CRUD) ──
        { key: 'dashboard.view', name: 'View Dashboard', module: 'dashboard', desc: 'Access the admin dashboard', type: 'backend' },
        { key: 'reports.view', name: 'View Reports', module: 'dashboard', desc: 'Access reports and analytics', type: 'backend' },
        { key: 'products.create', name: 'Create Products', module: 'products', desc: 'Add new products', type: 'backend' },
        { key: 'products.read', name: 'View Products', module: 'products', desc: 'View product catalog', type: 'backend' },
        { key: 'products.update', name: 'Edit Products', module: 'products', desc: 'Modify existing products', type: 'backend' },
        { key: 'products.delete', name: 'Delete Products', module: 'products', desc: 'Remove products', type: 'backend' },
        { key: 'categories.manage', name: 'Manage Categories', module: 'products', desc: 'Create and edit categories', type: 'backend' },
        { key: 'stock.view', name: 'View Stock', module: 'inventory', desc: 'View stock levels', type: 'backend' },
        { key: 'stock.manage', name: 'Manage Stock', module: 'inventory', desc: 'Adjust stock quantities', type: 'backend' },
        { key: 'orders.create', name: 'Create Orders', module: 'orders', desc: 'Place new orders', type: 'backend' },
        { key: 'orders.read', name: 'View Orders', module: 'orders', desc: 'View order details', type: 'backend' },
        { key: 'orders.update', name: 'Update Orders', module: 'orders', desc: 'Modify order status', type: 'backend' },
        { key: 'orders.delete', name: 'Delete Orders', module: 'orders', desc: 'Cancel/remove orders', type: 'backend' },
        { key: 'users.create', name: 'Create Users', module: 'users', desc: 'Add new user accounts', type: 'backend' },
        { key: 'users.read', name: 'View Users', module: 'users', desc: 'View user list and details', type: 'backend' },
        { key: 'users.update', name: 'Edit Users', module: 'users', desc: 'Modify user accounts', type: 'backend' },
        { key: 'users.delete', name: 'Delete Users', module: 'users', desc: 'Remove user accounts', type: 'backend' },
        { key: 'roles.view', name: 'View Roles', module: 'roles', desc: 'View role configurations', type: 'backend' },
        { key: 'roles.manage', name: 'Manage Roles', module: 'roles', desc: 'Create, edit, and assign roles and permissions', type: 'backend' },
        { key: 'reviews.moderate', name: 'Moderate Reviews', module: 'reviews', desc: 'Approve, reject, or manage reviews', type: 'backend' },
        { key: 'discounts.manage', name: 'Manage Discounts', module: 'discounts', desc: 'Create and manage product discounts', type: 'backend' },
        { key: 'settings.view', name: 'View Settings', module: 'settings', desc: 'Access store settings', type: 'backend' },
        { key: 'settings.manage', name: 'Manage Settings', module: 'settings', desc: 'Modify store configuration', type: 'backend' },
    ];

    const created = {};
    for (const perm of defaultPerms) {
        const result = await RoleModel.createPermission(perm.key, perm.name, perm.module, perm.desc, perm.type);
        created[perm.key] = result.permission_id;
    }

    await RoleModel.setRolePermissions(1, Object.values(created));

    const adminKeys = Object.keys(created).filter(k => k !== 'roles.manage' && k !== 'settings.manage');
    await RoleModel.setRolePermissions(2, adminKeys.map(k => created[k]));

    const userKeys = ['products.read', 'orders.create', 'orders.read', 'stock.view'];
    await RoleModel.setRolePermissions(3, userKeys.map(k => created[k]));

    return { created: true, count: Object.keys(created).length };
};
