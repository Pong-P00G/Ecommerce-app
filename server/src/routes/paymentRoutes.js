import express from 'express';
import * as paymentController from '../controller/paymentController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/methods', protect, paymentController.getPaymentMethods);
router.get('/methods/all', protect, isAdmin, paymentController.getAllPaymentMethods);
router.post('/methods', protect, isAdmin, paymentController.createPaymentMethod);
router.put('/methods/:id', protect, isAdmin, paymentController.updatePaymentMethod);
router.delete('/methods/:id', protect, isAdmin, paymentController.deletePaymentMethod);

export default router;
