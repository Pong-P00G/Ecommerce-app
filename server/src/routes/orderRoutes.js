import express from 'express';
import * as orderController from '../controller/orderController.js';
import * as paymentController from '../controller/paymentController.js';
import protect, { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.post('/:id/pay', protect, paymentController.recordPayment);
router.get('/:id/payments', protect, paymentController.getOrderPayments);
router.put('/:id/status', protect, isAdmin, orderController.updateStatus);

export default router;
