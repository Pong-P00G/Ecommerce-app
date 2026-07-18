import { describe, it, expect, vi, beforeEach } from 'vitest';

// Shared reference so vi.mock factory and test hooks use the same client instance
const mockClientRef = { current: null };

vi.mock('../src/database/dbpool.js', () => ({
    default: {
        query: vi.fn(),
        connect: vi.fn().mockImplementation(async () => mockClientRef.current),
    },
}));

let mockClient;

beforeEach(() => {
    mockClient = { query: vi.fn(), release: vi.fn() };
    mockClientRef.current = mockClient;
});

// Mock cart model
vi.mock('../src/model/cartModel.js', () => ({
    getCartByUserId: vi.fn(),
    getOrCreateCart: vi.fn(),
}));

// Mock order model
vi.mock('../src/model/orderModel.js', () => ({
    createOrder: vi.fn(),
    addOrderItem: vi.fn(),
    getOrderById: vi.fn(),
    getOrdersByUserId: vi.fn(),
    getAllOrders: vi.fn(),
    updateOrderStatus: vi.fn(),
}));

// Mock dashboardService (fire-and-forget notifications)
vi.mock('../src/services/dashboardService.js', () => ({
    notifyNewOrder: vi.fn().mockResolvedValue(),
    notifyOrderStatusChange: vi.fn().mockResolvedValue(),
}));

import db from '../src/database/dbpool.js';
import * as CartModel from '../src/model/cartModel.js';
import * as OrderModel from '../src/model/orderModel.js';
import * as orderService from '../src/services/orderService.js';

// ── Shared test data ─────────────────────────────────────────────────────────

const mockCart = {
    cartId: 100,
    userId: 42,
    items: [
        {
            cartItemId: 1,
            productId: 1,
            product_name: 'Test Product',
            variantId: 5,
            quantity: 2,
            currentPrice: 29.99,
            lineTotal: 59.98,
        },
        {
            cartItemId: 2,
            productId: 2,
            product_name: 'Simple Product',
            variantId: null,
            quantity: 1,
            currentPrice: 9.99,
            lineTotal: 9.99,
        },
    ],
};

const mockOrder = {
    orderId: 500,
    userId: 42,
    status: 'pending',
    totalAmount: 69.97,
    username: 'testuser',
    email: 'test@example.com',
    items: [
        { orderItemId: 1, productId: 1, quantity: 2, unitPrice: 29.99 },
        { orderItemId: 2, productId: 2, quantity: 1, unitPrice: 9.99 },
    ],
};

// ═══════════════════════════════════════════════════════════════════════════════
//  createOrderFromCart
// ═══════════════════════════════════════════════════════════════════════════════

describe('orderService — createOrderFromCart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockClient.query.mockReset();
        mockClient.release.mockReset();
        // Default: transaction succeeds
        mockClient.query.mockResolvedValue({ rows: [] });
    });

    it('creates an order from cart with correct flow', async () => {
        CartModel.getCartByUserId.mockResolvedValue(mockCart);
        OrderModel.createOrder.mockResolvedValue({ orderId: 500, userId: 42 });
        OrderModel.addOrderItem.mockResolvedValue({ orderItemId: 1 });
        OrderModel.getOrderById.mockResolvedValue(mockOrder);

        // Mock the price lookup query
        mockClient.query
            .mockResolvedValueOnce({ rows: [] }) // BEGIN
            .mockResolvedValueOnce({ rows: [{ basePrice: 29.99 }] }) // Product 1 price
            .mockResolvedValueOnce({ rows: [{ basePrice: 9.99 }] })  // Product 2 price
            .mockResolvedValueOnce({ rows: [{ total: 69.97 }] })     // SUM total
            .mockResolvedValueOnce({ rows: [] })                     // UPDATE total
            .mockResolvedValueOnce({ rows: [] })                     // Decrement stock item 1
            .mockResolvedValueOnce({ rows: [] })                     // Decrement stock item 2
            .mockResolvedValueOnce({ rows: [] })                     // DELETE cart items
            .mockResolvedValueOnce({ rows: [] });                    // COMMIT

        const result = await orderService.createOrderFromCart(42);

        expect(result.orderId).toBe(500);
        expect(result.totalAmount).toBe(69.97);
        expect(OrderModel.createOrder).toHaveBeenCalledWith(42, 0, mockClient);
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    });

    it('throws 400 when cart is empty', async () => {
        CartModel.getCartByUserId.mockResolvedValue({ cartId: 100, userId: 42, items: [] });

        await expect(orderService.createOrderFromCart(42))
            .rejects.toMatchObject({ status: 400, message: /Cart is empty/i });

        expect(db.connect).not.toHaveBeenCalled();
    });

    it('throws 400 when cart does not exist', async () => {
        CartModel.getCartByUserId.mockResolvedValue(null);

        await expect(orderService.createOrderFromCart(42))
            .rejects.toMatchObject({ status: 400, message: /Cart is empty/i });
    });

    it('rolls back transaction and re-throws on stock failure', async () => {
        CartModel.getCartByUserId.mockResolvedValue(mockCart);
        OrderModel.createOrder.mockResolvedValue({ orderId: 500, userId: 42 });
        OrderModel.addOrderItem.mockResolvedValue({ orderItemId: 1 });

        mockClient.query
            .mockResolvedValueOnce({ rows: [] })     // BEGIN
            .mockResolvedValueOnce({ rows: [{ basePrice: 29.99 }] }) // Product 1 price
            .mockResolvedValueOnce({ rows: [{ basePrice: 9.99 }] })  // Product 2 price
            .mockResolvedValueOnce({ rows: [{ total: 69.97 }] })     // SUM total
            .mockResolvedValueOnce({ rows: [] })     // UPDATE total
            .mockResolvedValueOnce({ rows: [] })     // Decrement stock item 1 — success
            .mockResolvedValueOnce({ rowCount: 0 }); // Decrement stock item 2 — FAIL (insufficient)

        // ROLLBACK mock
        mockClient.query.mockResolvedValueOnce({ rows: [] });

        await expect(orderService.createOrderFromCart(42))
            .rejects.toMatchObject({ status: 409, message: /Insufficient stock/i });

        expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
        expect(mockClient.release).toHaveBeenCalled();
    });

    it('rolls back transaction when a product is not found', async () => {
        CartModel.getCartByUserId.mockResolvedValue(mockCart);
        OrderModel.createOrder.mockResolvedValue({ orderId: 500, userId: 42 });

        mockClient.query
            .mockResolvedValueOnce({ rows: [] })     // BEGIN
            .mockResolvedValueOnce({ rows: [] });     // Product price query — empty (not found)

        await expect(orderService.createOrderFromCart(42))
            .rejects.toMatchObject({ status: 404, message: /not found/i });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getUserOrders
// ═══════════════════════════════════════════════════════════════════════════════

describe('orderService — getUserOrders', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns orders for a user', async () => {
        OrderModel.getOrdersByUserId.mockResolvedValue([mockOrder]);

        const result = await orderService.getUserOrders(42);
        expect(result).toHaveLength(1);
        expect(result[0].orderId).toBe(500);
        expect(OrderModel.getOrdersByUserId).toHaveBeenCalledWith(42);
    });

    it('returns empty array when user has no orders', async () => {
        OrderModel.getOrdersByUserId.mockResolvedValue([]);

        const result = await orderService.getUserOrders(42);
        expect(result).toEqual([]);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getOrder
// ═══════════════════════════════════════════════════════════════════════════════

describe('orderService — getOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns order when user owns it', async () => {
        OrderModel.getOrderById.mockResolvedValue({ ...mockOrder, userId: 42 });

        const result = await orderService.getOrder(42, 500, 3);
        expect(result.orderId).toBe(500);
    });

    it('returns order when admin requests any order', async () => {
        OrderModel.getOrderById.mockResolvedValue({ ...mockOrder, userId: 99 });

        const result = await orderService.getOrder(42, 500, 1);
        expect(result.orderId).toBe(500);
    });

    it('throws 403 when non-admin user requests another user order', async () => {
        OrderModel.getOrderById.mockResolvedValue({ ...mockOrder, userId: 99 });

        await expect(orderService.getOrder(42, 500, 3))
            .rejects.toMatchObject({ status: 403, message: /Not authorized/i });
    });

    it('throws 404 when order does not exist', async () => {
        OrderModel.getOrderById.mockResolvedValue(null);

        await expect(orderService.getOrder(42, 999, 3))
            .rejects.toMatchObject({ status: 404, message: /Order not found/i });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  updateStatus
// ═══════════════════════════════════════════════════════════════════════════════

describe('orderService — updateStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('updates order status successfully', async () => {
        OrderModel.getOrderById.mockResolvedValue(mockOrder);
        OrderModel.updateOrderStatus.mockResolvedValue({ ...mockOrder, status: 'shipped' });

        const result = await orderService.updateStatus(500, 'shipped', 1, 1);
        expect(result.status).toBe('shipped');
        expect(OrderModel.updateOrderStatus).toHaveBeenCalledWith(500, 'shipped');
    });

    it('throws 400 for invalid status value', async () => {
        await expect(orderService.updateStatus(500, 'invalid_status', 1, 1))
            .rejects.toMatchObject({ status: 400, message: /Invalid status/i });

        expect(OrderModel.getOrderById).not.toHaveBeenCalled();
    });

    it('throws 400 for lowercased but invalid status', async () => {
        await expect(orderService.updateStatus(500, 'Pending', 1, 1))
            .rejects.toMatchObject({ status: 400, message: /Invalid status/i });
    });

    it('throws 404 when order does not exist', async () => {
        OrderModel.getOrderById.mockResolvedValue(null);

        await expect(orderService.updateStatus(999, 'confirmed', 1, 1))
            .rejects.toMatchObject({ status: 404, message: /Order not found/i });
    });

    it('notifies about order status change', async () => {
        const { notifyOrderStatusChange } = await import('../src/services/dashboardService.js');
        OrderModel.getOrderById.mockResolvedValue(mockOrder);
        OrderModel.updateOrderStatus.mockResolvedValue({ ...mockOrder, status: 'delivered' });

        await orderService.updateStatus(500, 'delivered', 1, 1);

        expect(notifyOrderStatusChange).toHaveBeenCalledWith(
            500, 42, 'testuser', 'test@example.com', 'delivered'
        );
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getAllOrders
// ═══════════════════════════════════════════════════════════════════════════════

describe('orderService — getAllOrders', () => {
    it('returns all orders', async () => {
        OrderModel.getAllOrders.mockResolvedValue([mockOrder]);

        const result = await orderService.getAllOrders();
        expect(result).toHaveLength(1);
    });

    it('returns empty array when no orders exist', async () => {
        OrderModel.getAllOrders.mockResolvedValue([]);

        const result = await orderService.getAllOrders();
        expect(result).toEqual([]);
    });
});
