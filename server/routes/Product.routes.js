const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller.js');

router.get('/Products', productController.getAllProducts);
router.get('/Products:id', productController.getProductById);
router.post('/Products', productController.createProduct);
router.put('/Products:id', productController.updateProduct);
router.delete('/Products:id', productController.deleteProduct);

module.exports = router;