import * as addressService from '../services/addressService.js';

export const getAddresses = async (req, res) => {
    try {
        const addresses = await addressService.getAddresses(req.user.id);
        res.json({ success: true, data: addresses });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export const createAddress = async (req, res) => {
    try {
        const address = await addressService.createAddress(req.user.id, req.body);
        res.status(201).json({ success: true, message: 'Address created', data: address });
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const addressId = Number(req.params.addressId);
        const address = await addressService.updateAddress(req.user.id, addressId, req.body);
        res.json({ success: true, message: 'Address updated', data: address });
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const addressId = Number(req.params.addressId);
        await addressService.deleteAddress(req.user.id, addressId);
        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
    }
};
