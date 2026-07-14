import * as ReviewModel from '../model/reviewModel.js';

export const createReview = async ({ product_id, user_id, rating, title, comment }) => {
    if (!product_id || !user_id) {
        throw new Error('Product ID and User ID are required');
    }

    if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    const hasReviewed = await ReviewModel.userHasReviewed(product_id, user_id);
    if (hasReviewed) {
        throw new Error('You have already reviewed this product');
    }

    const reviewId = await ReviewModel.createReview({
        product_id,
        user_id,
        rating,
        title: title || null,
        comment: comment || null,
    });

    return await getReviewById(reviewId);
};

export const getReviewById = async (reviewId) => {
    const review = await ReviewModel.getReviewById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }
    return review;
};

export const getProductReviews = async (productId) => {
    const [reviews, summary] = await Promise.all([
        ReviewModel.getReviewsByProduct(productId, 'approved'),
        ReviewModel.getProductRatingSummary(productId),
    ]);
    return { reviews, summary };
};

export const getUserReviews = async (userId) => {
    return await ReviewModel.getReviewsByUser(userId);
};

export const getPendingReviews = async (page = 1, pageSize = 20) => {
    return await ReviewModel.getPendingReviews(page, pageSize);
};

export const getAllReviews = async (page = 1, pageSize = 20, statusFilter = null) => {
    return await ReviewModel.getAllReviews(page, pageSize, statusFilter);
};

export const moderateReview = async (reviewId, status, moderationNote = null) => {
    if (!['approved', 'rejected'].includes(status)) {
        throw new Error('Status must be "approved" or "rejected"');
    }

    const review = await ReviewModel.getReviewById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    await ReviewModel.moderateReview(reviewId, status, moderationNote);
    return await getReviewById(reviewId);
};

export const updateReview = async (reviewId, userId, data) => {
    const review = await ReviewModel.getReviewById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    if (review.user_id !== userId) {
        throw new Error('Not authorized to update this review');
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
    }

    // Reset to pending on edit
    await ReviewModel.updateReview(reviewId, {
        rating: data.rating || review.rating,
        title: data.title !== undefined ? data.title : review.title,
        comment: data.comment !== undefined ? data.comment : review.comment,
    });

    await ReviewModel.moderateReview(reviewId, 'pending', null);

    return await getReviewById(reviewId);
};

export const deleteReview = async (reviewId, userId, isAdmin = false) => {
    const review = await ReviewModel.getReviewById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    if (!isAdmin && review.user_id !== userId) {
        throw new Error('Not authorized to delete this review');
    }

    return await ReviewModel.deleteReview(reviewId);
};

