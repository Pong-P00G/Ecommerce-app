import * as AddressModel from '../model/addressModel.js';

export const getAddresses = async (userId) => {
    return await AddressModel.getAddressesByUserId(userId);
};

export const createAddress = async (userId, addressData) => {
    const { street, city, state, zipCode, country } = addressData;
    if (!street || !city || !state || !zipCode || !country) {
        const err = new Error('Street, city, state, zipCode, and country are required');
        err.status = 400;
        throw err;
    }
    return await AddressModel.createAddress(userId, addressData);
};

export const updateAddress = async (userId, addressId, addressData) => {
    const existing = await AddressModel.getAddressById(addressId);
    if (!existing) {
        const err = new Error('Address not found');
        err.status = 404;
        throw err;
    }
    if (existing.userId !== userId) {
        const err = new Error('Not authorized to update this address');
        err.status = 403;
        throw err;
    }
    const updated = await AddressModel.updateAddress(addressId, userId, addressData);
    if (!updated) {
        const err = new Error('Failed to update address');
        err.status = 500;
        throw err;
    }
    return updated;
};

export const deleteAddress = async (userId, addressId) => {
    const existing = await AddressModel.getAddressById(addressId);
    if (!existing) {
        const err = new Error('Address not found');
        err.status = 404;
        throw err;
    }
    if (existing.userId !== userId) {
        const err = new Error('Not authorized to delete this address');
        err.status = 403;
        throw err;
    }
    const deleted = await AddressModel.deleteAddress(addressId, userId);
    if (!deleted) {
        const err = new Error('Failed to delete address');
        err.status = 500;
        throw err;
    }
    return true;
};
