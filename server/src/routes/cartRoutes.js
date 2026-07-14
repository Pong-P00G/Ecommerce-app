import express from 'express';
import * as cartController from '../controller/cartController.js';
import protect from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/', protect, cartController.getCart);
router.post('/items', protect, cartController.addItem);
router.put('/items/:cartItemId', protect, cartController.updateItem);
router.delete('/items/:cartItemId', protect, cartController.removeItem);
router.delete('/', protect, cartController.clearCart);

export default router;
