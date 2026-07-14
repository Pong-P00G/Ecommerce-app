import express from 'express';
import * as reviewController from '../controller/reviewController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

// ═════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// @route   GET /api/reviews/product/:id
// @desc    Get all approved reviews for a product (with rating summary)
// @access  Public
router.get('/product/:id', reviewController.getProductReviews);

// ═════════════════════════════════════════════════════════════════════════════
// AUTHENTICATED USER ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// @route   POST /api/reviews/product/:id
// @desc    Submit a review for a product (requires auth)
// @access  Private
router.post('/product/:id', protect, reviewController.submitReview);

// @route   GET /api/reviews/mine
// @desc    Get current user's reviews
// @access  Private
router.get('/mine', protect, reviewController.getUserReviews);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete own review (admin can delete any)
// @access  Private
router.delete('/:reviewId', protect, reviewController.deleteReview);

// @route   PUT /api/reviews/:reviewId/moderate
// @desc    Approve or reject a review
// @access  Private/Admin
router.put('/:reviewId/moderate', protect, isAdmin, reviewController.moderateReview);

// @route   PUT /api/reviews/:reviewId
// @desc    Update own review (resets to pending)
// @access  Private
router.put('/:reviewId', protect, reviewController.updateReview);

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// @route   GET /api/reviews/all
// @desc    Get all reviews with optional status filter
// @access  Private/Admin
router.get('/all', protect, isAdmin, reviewController.getAllReviews);

// @route   GET /api/reviews/pending
// @desc    Get pending reviews for moderation
// @access  Private/Admin
router.get('/pending', protect, isAdmin, reviewController.getPendingReviews);

export default router;
