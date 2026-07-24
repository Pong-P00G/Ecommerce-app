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

// GET /api/payments/methods/all  (admin only)
export const getAllPaymentMethods = async (req, res) => {
    try {
        const methods = await paymentService.getAllPaymentMethods(req.user.role_id);
        res.json({ success: true, data: methods });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

// PUT /api/payments/methods/:id  (admin only)
export const updatePaymentMethod = async (req, res) => {
    try {
        const methodId = Number(req.params.id);
        const method = await paymentService.updatePaymentMethod(methodId, req.body, req.user.role_id);
        res.json({ success: true, message: 'Payment method updated', data: method });
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
    }
};

// DELETE /api/payments/methods/:id  (admin only)
export const deletePaymentMethod = async (req, res) => {
    try {
        const methodId = Number(req.params.id);
        const result = await paymentService.deletePaymentMethod(methodId, req.user.role_id);
        res.json({ success: true, message: 'Payment method deleted', data: result });
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
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

// PUT /api/orders/:id/mark-paid  (admin only — enforced in service)
export const markPaymentAsPaid = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const payment = await paymentService.markPaymentAsPaid(
            req.user.id,
            req.user.role_id,
            orderId
        );
        res.json({
            success: true,
            message: 'Payment marked as paid',
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
