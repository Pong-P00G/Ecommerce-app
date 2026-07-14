import * as cartService from '../services/cartService.js';

// GET /api/cart
export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/cart/items
export const addItem = async (req, res) => {
    try {
        const item = await cartService.addItem(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            data: item
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// PUT /api/cart/items/:cartItemId
export const updateItem = async (req, res) => {
    try {
        const cartItemId = Number(req.params.cartItemId);
        const item = await cartService.updateItem(req.user.id, cartItemId, req.body);
        res.json({
            success: true,
            message: 'Cart item updated',
            data: item
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE /api/cart/items/:cartItemId
export const removeItem = async (req, res) => {
    try {
        const cartItemId = Number(req.params.cartItemId);
        await cartService.removeItem(req.user.id, cartItemId);
        res.json({
            success: true,
            message: 'Cart item removed'
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
    try {
        const result = await cartService.clearCart(req.user.id);
        res.json({
            success: true,
            message: 'Cart cleared',
            data: result
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};
