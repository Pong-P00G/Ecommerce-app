import * as shippingService from '../services/shippingService.js';

export const getRates = async (req, res) => {
    try {
        const rates = await shippingService.calculateRates(req.body);
        res.json({ success: true, data: rates });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export const validateAddress = async (req, res) => {
    try {
        const result = await shippingService.validateShippingAddress(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};
