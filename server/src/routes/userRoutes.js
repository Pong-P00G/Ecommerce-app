import express from 'express';
import * as userController from '../controller/userController.js';
import protect from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUsers);
router.put('/profile', protect, userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;