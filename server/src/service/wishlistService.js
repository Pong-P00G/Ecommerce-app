import * as WishlistModel from '../model/wishlistModel.js';

/**
 * Return the full wishlist for a user.
 */
export const getWishlist = async (userId) => {
    return await WishlistModel.getWishlistByUserId(userId);
};

/**
 * Toggle a product in the user's wishlist.
 * If present, remove it. If absent, add it.
 * Returns { action: 'added' | 'removed' }
 */
export const toggleItem = async (userId, productId) => {
    const exists = await WishlistModel.isInWishlist(userId, productId);
    if (exists) {
        await WishlistModel.removeWishlistItem(userId, productId);
        return { action: 'removed' };
    } else {
        await WishlistModel.addWishlistItem(userId, productId);
        return { action: 'added' };
    }
};

/**
 * Add a product to the wishlist (no-op if already present).
 */
export const addItem = async (userId, productId) => {
    return await WishlistModel.addWishlistItem(userId, productId);
};

/**
 * Remove a product from the wishlist.
 */
export const removeItem = async (userId, productId) => {
    return await WishlistModel.removeWishlistItem(userId, productId);
};

/**
 * Clear the entire wishlist for a user.
 */
export const clearWishlist = async (userId) => {
    return await WishlistModel.clearWishlist(userId);
};

/**
 * Sync an array of product IDs as the user's wishlist.
 * Replaces the backend wishlist with the provided set.
 * Returns the count of items inserted.
 */
export const syncWishlist = async (userId, productIds) => {
    await WishlistModel.clearWishlist(userId);
    if (productIds && productIds.length > 0) {
        return await WishlistModel.bulkAddWishlistItems(userId, productIds);
    }
    return 0;
};
