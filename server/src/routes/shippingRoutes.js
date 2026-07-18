import express from 'express';
import * as shippingController from '../controller/shippingController.js';

const router = express.Router();

router.post('/rates', shippingController.getRates);
router.post('/validate', shippingController.validateAddress);

export default router;
