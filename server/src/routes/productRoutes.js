import express from 'express';
import * as productController from '../controller/productController.js';

const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/category/:name', productController.getProductCategory);
router.get('/:id', productController.getAllProductById);
router.post('/',  productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;