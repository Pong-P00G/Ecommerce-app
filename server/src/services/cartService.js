import * as CartModel from '../model/cartModel.js';
import { productExists } from '../model/products/productModel.js';

/**
 * Confirm a cart item belongs to a given user. Used for ownership checks before
 * mutating an item that the URL exposes by primary key.
 * Returns the cart item row (with cartId) when valid; throws otherwise.
 */
const assertItemOwnership = async (userId, cartItemId) => {
    const item = await CartModel.getCartItemById(cartItemId);
    if (!item) {
        const err = new Error('Cart item not found');
        err.status = 404;
        throw err;
    }

    const cart = await CartModel.getOrCreateCart(userId);
    if (item.cartId !== cart.cartId) {
        const err = new Error('Cart item does not belong to this user');
        err.status = 403;
        throw err;
    }
    return item;
};

/**
 * Return the full cart (with items) for a user.
 */
export const getCart = async (userId) => {
    return await CartModel.getCartByUserId(userId);
};

/**
 * Add an item to a user's cart. Creates the cart if it does not exist yet.
 * Increments quantity when the (product, variant) tuple is already in the cart.
 */
export const addItem = async (userId, { product_id, variant_id, quantity }) => {
    // Coerce and validate quantity
    const qty = Number.isInteger(quantity) ? quantity : parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty <= 0) {
        const err = new Error('Quantity must be a positive integer');
        err.status = 400;
        throw err;
    }

    // Coerce and validate product_id
    const pid = Number.isInteger(product_id) ? product_id : parseInt(product_id, 10);
    if (!Number.isInteger(pid)) {
        const err = new Error('product_id is required');
        err.status = 400;
        throw err;
    }

    if (!(await productExists(pid))) {
        const err = new Error('Product not found');
        err.status = 404;
        throw err;
    }

    // Coerce variant_id (can be null)
    const vid = variant_id != null
        ? (Number.isInteger(variant_id) ? variant_id : parseInt(variant_id, 10))
        : null;

    const cart = await CartModel.getOrCreateCart(userId);
    return await CartModel.addCartItem(cart.cartId, pid, vid, qty);
};

/**
 * Update the quantity of an existing cart item owned by the user.
 */
export const updateItem = async (userId, cartItemId, { quantity }) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        const err = new Error('Quantity must be a positive integer');
        err.status = 400;
        throw err;
    }

    await assertItemOwnership(userId, cartItemId);
    return await CartModel.updateCartItemQuantity(cartItemId, quantity);
};

/**
 * Remove a single cart item owned by the user.
 */
export const removeItem = async (userId, cartItemId) => {
    await assertItemOwnership(userId, cartItemId);
    const deleted = await CartModel.deleteCartItem(cartItemId);
    if (!deleted) {
        const err = new Error('Cart item not found');
        err.status = 404;
        throw err;
    }
    return true;
};

/**
 * Clear every item from the user's cart.
 */
export const clearCart = async (userId) => {
    const cart = await CartModel.getOrCreateCart(userId);
    const removed = await CartModel.clearCart(cart.cartId);
    return { cartId: cart.cartId, removedItems: removed };
};
