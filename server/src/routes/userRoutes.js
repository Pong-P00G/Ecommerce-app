import express from 'express';
import * as userController from '../controller/userController.js';
import protect from '../middleware/authMiddleWare.js';
import { validateUpdate } from '../middleware/validationMiddleWare.js';

const router = express.Router();


router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserById);
router.post('/', protect, userController.createUsers);
router.put('/', protect, validateUpdate, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

router.get('/check-username/:username', userController.checkUsername);
// Protected routes (user must be authenticated)
router.put('/profile', protect, userController.updateUser);

export default router;