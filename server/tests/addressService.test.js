import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/model/addressModel.js', () => ({
    getAddressesByUserId: vi.fn(),
    getAddressById: vi.fn(),
    createAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
}));

import * as AddressModel from '../src/model/addressModel.js';
import * as addressService from '../src/services/addressService.js';

const mockAddress = {
    addressId: 100,
    userId: 42,
    label: 'Home',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US',
    isDefault: true,
    createdAt: '2026-07-01T00:00:00Z',
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getAddresses
// ═══════════════════════════════════════════════════════════════════════════════

describe('addressService — getAddresses', () => {
    it('returns addresses for a user', async () => {
        AddressModel.getAddressesByUserId.mockResolvedValue([mockAddress]);

        const result = await addressService.getAddresses(42);

        expect(result).toHaveLength(1);
        expect(result[0].addressId).toBe(100);
        expect(AddressModel.getAddressesByUserId).toHaveBeenCalledWith(42);
    });

    it('returns empty array when user has no addresses', async () => {
        AddressModel.getAddressesByUserId.mockResolvedValue([]);

        const result = await addressService.getAddresses(42);
        expect(result).toEqual([]);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  createAddress
// ═══════════════════════════════════════════════════════════════════════════════

describe('addressService — createAddress', () => {
    it('creates an address successfully', async () => {
        AddressModel.createAddress.mockResolvedValue(mockAddress);

        const result = await addressService.createAddress(42, {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
            firstName: 'John',
            lastName: 'Doe',
        });

        expect(result.addressId).toBe(100);
        expect(AddressModel.createAddress).toHaveBeenCalledWith(42, {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
            firstName: 'John',
            lastName: 'Doe',
        });
    });

    it('throws 400 when street is missing', async () => {
        await expect(
            addressService.createAddress(42, { city: 'NY', state: 'NY', zipCode: '10001', country: 'US' })
        ).rejects.toMatchObject({ status: 400, message: /street/i });
    });

    it('throws 400 when city is missing', async () => {
        await expect(
            addressService.createAddress(42, { street: '123 Main', state: 'NY', zipCode: '10001', country: 'US' })
        ).rejects.toMatchObject({ status: 400, message: /city/i });
    });

    it('throws 400 when state is missing', async () => {
        await expect(
            addressService.createAddress(42, { street: '123 Main', city: 'NY', zipCode: '10001', country: 'US' })
        ).rejects.toMatchObject({ status: 400, message: /state/i });
    });

    it('throws 400 when zipCode is missing', async () => {
        await expect(
            addressService.createAddress(42, { street: '123 Main', city: 'NY', state: 'NY', country: 'US' })
        ).rejects.toMatchObject({ status: 400, message: /zipCode/i });
    });

    it('throws 400 when country is missing', async () => {
        await expect(
            addressService.createAddress(42, { street: '123 Main', city: 'NY', state: 'NY', zipCode: '10001' })
        ).rejects.toMatchObject({ status: 400, message: /country/i });
    });

    it('throws 400 when all required fields are missing', async () => {
        await expect(
            addressService.createAddress(42, {})
        ).rejects.toMatchObject({ status: 400, message: /Street, city/i });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  updateAddress
// ═══════════════════════════════════════════════════════════════════════════════

describe('addressService — updateAddress', () => {
    beforeEach(() => {
        AddressModel.getAddressById.mockResolvedValue(mockAddress);
        AddressModel.updateAddress.mockResolvedValue({ ...mockAddress, street: '456 Oak Ave' });
    });

    it('updates an address successfully', async () => {
        const result = await addressService.updateAddress(42, 100, {
            street: '456 Oak Ave',
        });

        expect(result.street).toBe('456 Oak Ave');
        expect(AddressModel.updateAddress).toHaveBeenCalledWith(100, 42, {
            street: '456 Oak Ave',
        });
    });

    it('throws 404 when address not found', async () => {
        AddressModel.getAddressById.mockResolvedValue(null);

        await expect(
            addressService.updateAddress(42, 999, { street: 'New St' })
        ).rejects.toMatchObject({ status: 404, message: /Address not found/i });
    });

    it('throws 403 when updating another user address', async () => {
        AddressModel.getAddressById.mockResolvedValue({ ...mockAddress, userId: 99 });

        await expect(
            addressService.updateAddress(42, 100, { street: 'New St' })
        ).rejects.toMatchObject({ status: 403, message: /Not authorized/i });
    });

    it('throws 500 when update returns no data', async () => {
        AddressModel.updateAddress.mockResolvedValue(null);

        await expect(
            addressService.updateAddress(42, 100, { street: 'New St' })
        ).rejects.toMatchObject({ status: 500, message: /Failed to update/i });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  deleteAddress
// ═══════════════════════════════════════════════════════════════════════════════

describe('addressService — deleteAddress', () => {
    beforeEach(() => {
        AddressModel.getAddressById.mockResolvedValue(mockAddress);
        AddressModel.deleteAddress.mockResolvedValue(true);
    });

    it('deletes an address successfully', async () => {
        const result = await addressService.deleteAddress(42, 100);

        expect(result).toBe(true);
        expect(AddressModel.deleteAddress).toHaveBeenCalledWith(100, 42);
    });

    it('throws 404 when address not found', async () => {
        AddressModel.getAddressById.mockResolvedValue(null);

        await expect(
            addressService.deleteAddress(42, 999)
        ).rejects.toMatchObject({ status: 404, message: /Address not found/i });
    });

    it('throws 403 when deleting another user address', async () => {
        AddressModel.getAddressById.mockResolvedValue({ ...mockAddress, userId: 99 });

        await expect(
            addressService.deleteAddress(42, 100)
        ).rejects.toMatchObject({ status: 403, message: /Not authorized/i });
    });

    it('throws 500 when delete returns false', async () => {
        AddressModel.deleteAddress.mockResolvedValue(false);

        await expect(
            addressService.deleteAddress(42, 100)
        ).rejects.toMatchObject({ status: 500, message: /Failed to delete/i });
    });
});
