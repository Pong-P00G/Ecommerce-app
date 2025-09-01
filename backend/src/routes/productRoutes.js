import express from 'express';
import * as productController from '../controller/productController.js';
import authenticateToken from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/:id', productController.getAllProductById);
router.post('/', authenticateToken, productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;