import express from 'express';
import * as roleController from '../controller/roleController.js';
import protect, { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

// Permission routes must come BEFORE /:id param routes
router.get('/permissions', protect, isAdmin, roleController.getPermissions);
router.post('/permissions', protect, isAdmin, roleController.createPermission);
router.put('/permissions/:permissionId', protect, isAdmin, roleController.updatePermission);
router.delete('/permissions/:permissionId', protect, isAdmin, roleController.deletePermission);

// Role routes
router.get('/', protect, isAdmin, roleController.getRoles);
router.post('/', protect, isAdmin, roleController.createRole);
router.get('/:id', protect, isAdmin, roleController.getRole);
router.put('/:roleId', protect, isAdmin, roleController.updateRole);
router.put('/:roleId/permissions', protect, isAdmin, roleController.updatePermissions);
router.delete('/:roleId', protect, isAdmin, roleController.deleteRole);

export default router;
