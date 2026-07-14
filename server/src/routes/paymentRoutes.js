import express from 'express';
import * as paymentController from '../controller/paymentController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/methods', protect, paymentController.getPaymentMethods);
router.post('/methods', protect, isAdmin, paymentController.createPaymentMethod);

export default router;
