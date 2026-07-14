import * as paymentService from '../services/paymentService.js';

// GET /api/payments/methods
export const getPaymentMethods = async (req, res) => {
    try {
        const methods = await paymentService.getPaymentMethods();
        res.json({
            success: true,
            data: methods
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/payments/methods  (admin only — enforced by isAdmin middleware)
export const createPaymentMethod = async (req, res) => {
    try {
        const method = await paymentService.createPaymentMethod(req.body, req.user.role_id);
        res.status(201).json({
            success: true,
            message: 'Payment method created',
            data: method
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/orders/:id/pay
export const recordPayment = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const payment = await paymentService.recordPayment(
            req.user.id,
            req.user.role_id,
            orderId,
            req.body
        );
        res.status(201).json({
            success: true,
            message: 'Payment recorded',
            data: payment
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// GET /api/orders/:id/payments
export const getOrderPayments = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const payments = await paymentService.getOrderPayments(
            req.user.id,
            req.user.role_id,
            orderId
        );
        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};
