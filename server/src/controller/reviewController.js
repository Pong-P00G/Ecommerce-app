import * as reviewService from '../services/reviewService.js';

// ── SUBMIT REVIEW ───────────────────────────────────────────────────────────

export const submitReview = async (req, res) => {
    try {
        const { rating, title, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;

        const review = await reviewService.createReview({
            product_id: parseInt(productId),
            user_id: userId,
            rating: parseInt(rating),
            title,
            comment,
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted and pending moderation',
            data: review,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ── GET PRODUCT REVIEWS ─────────────────────────────────────────────────────

export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await reviewService.getProductReviews(parseInt(productId));

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── GET USER'S REVIEWS ──────────────────────────────────────────────────────

export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await reviewService.getUserReviews(userId);

        res.json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── UPDATE REVIEW ───────────────────────────────────────────────────────────

export const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const review = await reviewService.updateReview(
            parseInt(reviewId),
            userId,
            req.body
        );

        res.json({
            success: true,
            message: 'Review updated and pending re-moderation',
            data: review,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ── DELETE REVIEW ───────────────────────────────────────────────────────────

export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;
        const isAdmin = req.user.role_id === 1 || req.user.role_id === 2;

        await reviewService.deleteReview(parseInt(reviewId), userId, isAdmin);

        res.json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ── ADMIN: GET ALL REVIEWS (with optional status filter) ────────────────────

export const getAllReviews = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, status } = req.query;
        const result = await reviewService.getAllReviews(
            parseInt(page),
            parseInt(pageSize),
            status || null
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── ADMIN: GET PENDING REVIEWS ──────────────────────────────────────────────

export const getPendingReviews = async (req, res) => {
    try {
        const { page = 1, pageSize = 20 } = req.query;
        const result = await reviewService.getPendingReviews(
            parseInt(page),
            parseInt(pageSize)
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ── ADMIN: MODERATE REVIEW (approve/reject) ─────────────────────────────────

export const moderateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const { status, moderation_note } = req.body;

        const review = await reviewService.moderateReview(
            parseInt(reviewId),
            status,
            moderation_note || null
        );

        res.json({
            success: true,
            message: `Review ${status} successfully`,
            data: review,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
