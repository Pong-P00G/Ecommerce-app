import * as wishlistService from '../services/wishlistService.js';

// GET /api/wishlist
export const getWishlist = async (req, res) => {
    try {
        const items = await wishlistService.getWishlist(req.user.id);
        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/wishlist/toggle
export const toggleItem = async (req, res) => {
    try {
        const product_id = Number(req.body.product_id);
        if (!Number.isInteger(product_id) || product_id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'product_id is required and must be a positive integer'
            });
        }
        const result = await wishlistService.toggleItem(req.user.id, product_id);
        res.json({
            success: true,
            message: result.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist',
            data: result
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/wishlist/add
export const addItem = async (req, res) => {
    try {
        const product_id = Number(req.body.product_id);
        if (!Number.isInteger(product_id) || product_id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'product_id is required and must be a positive integer'
            });
        }
        await wishlistService.addItem(req.user.id, product_id);
        res.status(201).json({
            success: true,
            message: 'Added to wishlist'
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE /api/wishlist/:productId
export const removeItem = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'productId must be a valid positive integer'
            });
        }
        await wishlistService.removeItem(req.user.id, productId);
        res.json({
            success: true,
            message: 'Removed from wishlist'
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE /api/wishlist
export const clearWishlist = async (req, res) => {
    try {
        await wishlistService.clearWishlist(req.user.id);
        res.json({
            success: true,
            message: 'Wishlist cleared'
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/wishlist/sync
export const syncWishlist = async (req, res) => {
    try {
        const { product_ids } = req.body;
        if (!Array.isArray(product_ids)) {
            return res.status(400).json({
                success: false,
                message: 'product_ids must be an array of integers'
            });
        }
        const count = await wishlistService.syncWishlist(
            req.user.id,
            product_ids.filter(id => Number.isInteger(id))
        );
        res.json({
            success: true,
            message: 'Wishlist synced',
            data: { inserted: count }
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};
