import * as wishlistModel from '../model/wishlistModel.js';

/**
 * Get all wishlist items for a user.
 */
export const getWishlist = async (userId) => {
    return await wishlistModel.getWishlistByUserId(userId);
};

/**
 * Toggle a product in/out of the user's wishlist.
 * Returns { action: 'added' | 'removed' }.
 */
export const toggleItem = async (userId, productId) => {
    const exists = await wishlistModel.isInWishlist(userId, productId);
    if (exists) {
        await wishlistModel.removeWishlistItem(userId, productId);
        return { action: 'removed' };
    } else {
        await wishlistModel.addWishlistItem(userId, productId);
        return { action: 'added' };
    }
};

/**
 * Add a product to the user's wishlist (no-op if already present).
 */
export const addItem = async (userId, productId) => {
    await wishlistModel.addWishlistItem(userId, productId);
};

/**
 * Remove a product from the user's wishlist.
 */
export const removeItem = async (userId, productId) => {
    const removed = await wishlistModel.removeWishlistItem(userId, productId);
    if (!removed) {
        const err = new Error('Wishlist item not found');
        err.status = 404;
        throw err;
    }
};

/**
 * Clear the entire wishlist for a user.
 */
export const clearWishlist = async (userId) => {
    await wishlistModel.clearWishlist(userId);
};

/**
 * Replace the user's wishlist with the given set of product IDs.
 * Deletes all existing items, then bulk-inserts the new ones.
 */
export const syncWishlist = async (userId, productIds) => {
    // Clear existing items
    await wishlistModel.clearWishlist(userId);
    // Bulk-add new items
    if (productIds.length > 0) {
        return await wishlistModel.bulkAddWishlistItems(userId, productIds);
    }
    return 0;
};
