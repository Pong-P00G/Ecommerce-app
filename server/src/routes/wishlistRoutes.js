import express from 'express';
import * as wishlistController from '../controller/wishlistController.js';
import protect from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/', protect, wishlistController.getWishlist);
router.post('/toggle', protect, wishlistController.toggleItem);
router.post('/add', protect, wishlistController.addItem);
router.post('/sync', protect, wishlistController.syncWishlist);
router.delete('/:productId', protect, wishlistController.removeItem);
router.delete('/', protect, wishlistController.clearWishlist);

export default router;
