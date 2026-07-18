import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/model/reviewModel.js', () => ({
    createReview: vi.fn(),
    getReviewById: vi.fn(),
    getReviewsByProduct: vi.fn(),
    getProductRatingSummary: vi.fn(),
    getReviewsByUser: vi.fn(),
    getPendingReviews: vi.fn(),
    getAllReviews: vi.fn(),
    moderateReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    userHasReviewed: vi.fn(),
}));

import * as ReviewModel from '../src/model/reviewModel.js';
import * as reviewService from '../src/services/reviewService.js';

const mockReview = {
    review_id: 10,
    product_id: 1,
    user_id: 42,
    username: 'testuser',
    rating: 5,
    title: 'Great product',
    comment: 'Really love it',
    status: 'approved',
    created_at: '2026-07-01T00:00:00Z',
};

const mockRatingSummary = {
    total_reviews: 1,
    average_rating: 5.0,
    five_star: 1,
    four_star: 0,
    three_star: 0,
    two_star: 0,
    one_star: 0,
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ═══════════════════════════════════════════════════════════════════════════════
//  createReview
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — createReview', () => {
    beforeEach(() => {
        ReviewModel.userHasReviewed.mockResolvedValue(false);
        ReviewModel.createReview.mockResolvedValue(10);
        ReviewModel.getReviewById.mockResolvedValue(mockReview);
    });

    it('creates a review successfully', async () => {
        const result = await reviewService.createReview({
            product_id: 1,
            user_id: 42,
            rating: 5,
            title: 'Great product',
            comment: 'Really love it',
        });

        expect(result.review_id).toBe(10);
        expect(ReviewModel.createReview).toHaveBeenCalledWith({
            product_id: 1,
            user_id: 42,
            rating: 5,
            title: 'Great product',
            comment: 'Really love it',
        });
    });

    it('throws when product_id is missing', async () => {
        await expect(
            reviewService.createReview({ user_id: 42, rating: 5 })
        ).rejects.toThrow(/Product ID/i);
    });

    it('throws when user_id is missing', async () => {
        await expect(
            reviewService.createReview({ product_id: 1, rating: 5 })
        ).rejects.toThrow(/User ID/i);
    });

    it('throws when rating is below 1', async () => {
        await expect(
            reviewService.createReview({ product_id: 1, user_id: 42, rating: 0 })
        ).rejects.toThrow(/Rating.*between 1 and 5/i);
    });

    it('throws when rating is above 5', async () => {
        await expect(
            reviewService.createReview({ product_id: 1, user_id: 42, rating: 6 })
        ).rejects.toThrow(/Rating.*between 1 and 5/i);
    });

    it('throws when rating is missing', async () => {
        await expect(
            reviewService.createReview({ product_id: 1, user_id: 42 })
        ).rejects.toThrow(/Rating.*between 1 and 5/i);
    });

    it('throws when user already reviewed this product', async () => {
        ReviewModel.userHasReviewed.mockResolvedValue(true);

        await expect(
            reviewService.createReview({ product_id: 1, user_id: 42, rating: 4 })
        ).rejects.toThrow(/already reviewed/i);
    });

    it('passes null for optional title and comment when not provided', async () => {
        await reviewService.createReview({ product_id: 1, user_id: 42, rating: 3 });

        expect(ReviewModel.createReview).toHaveBeenCalledWith({
            product_id: 1,
            user_id: 42,
            rating: 3,
            title: null,
            comment: null,
        });
    });

    it('returns the full review after creation', async () => {
        const result = await reviewService.createReview({
            product_id: 1, user_id: 42, rating: 4,
        });

        expect(ReviewModel.getReviewById).toHaveBeenCalledWith(10);
        expect(result.rating).toBe(5);
        expect(result.username).toBe('testuser');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getReviewById
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — getReviewById', () => {
    it('returns review by ID', async () => {
        ReviewModel.getReviewById.mockResolvedValue(mockReview);

        const result = await reviewService.getReviewById(10);
        expect(result.review_id).toBe(10);
    });

    it('throws when review not found', async () => {
        ReviewModel.getReviewById.mockResolvedValue(null);

        await expect(reviewService.getReviewById(999))
            .rejects.toThrow(/Review not found/i);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getProductReviews
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — getProductReviews', () => {
    it('returns reviews and rating summary for a product', async () => {
        ReviewModel.getReviewsByProduct.mockResolvedValue([mockReview]);
        ReviewModel.getProductRatingSummary.mockResolvedValue(mockRatingSummary);

        const result = await reviewService.getProductReviews(1);

        expect(result.reviews).toHaveLength(1);
        expect(result.reviews[0].review_id).toBe(10);
        expect(result.summary.average_rating).toBe(5.0);
        expect(ReviewModel.getReviewsByProduct).toHaveBeenCalledWith(1, 'approved');
    });

    it('returns empty reviews array when no reviews exist', async () => {
        ReviewModel.getReviewsByProduct.mockResolvedValue([]);
        ReviewModel.getProductRatingSummary.mockResolvedValue({
            total_reviews: 0, average_rating: 0,
            five_star: 0, four_star: 0, three_star: 0, two_star: 0, one_star: 0,
        });

        const result = await reviewService.getProductReviews(1);

        expect(result.reviews).toEqual([]);
        expect(result.summary.total_reviews).toBe(0);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getUserReviews
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — getUserReviews', () => {
    it('returns reviews by a user', async () => {
        ReviewModel.getReviewsByUser.mockResolvedValue([mockReview]);

        const result = await reviewService.getUserReviews(42);

        expect(result).toHaveLength(1);
        expect(result[0].user_id).toBe(42);
    });

    it('returns empty array when user has no reviews', async () => {
        ReviewModel.getReviewsByUser.mockResolvedValue([]);

        const result = await reviewService.getUserReviews(42);
        expect(result).toEqual([]);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  getPendingReviews / getAllReviews
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — getPendingReviews / getAllReviews', () => {
    it('returns pending reviews with pagination', async () => {
        ReviewModel.getPendingReviews.mockResolvedValue({
            page: 1, pageSize: 20, totalItems: 1, totalPages: 1,
            items: [mockReview],
        });

        const result = await reviewService.getPendingReviews(1, 20);

        expect(result.items).toHaveLength(1);
        expect(ReviewModel.getPendingReviews).toHaveBeenCalledWith(1, 20);
    });

    it('returns all reviews with optional status filter', async () => {
        ReviewModel.getAllReviews.mockResolvedValue({
            page: 1, pageSize: 10, totalItems: 1, totalPages: 1,
            items: [mockReview],
        });

        const result = await reviewService.getAllReviews(1, 10, 'approved');

        expect(result.items).toHaveLength(1);
        expect(ReviewModel.getAllReviews).toHaveBeenCalledWith(1, 10, 'approved');
    });

    it('returns all reviews without status filter', async () => {
        ReviewModel.getAllReviews.mockResolvedValue({
            page: 1, pageSize: 20, totalItems: 0, totalPages: 0, items: [],
        });

        const result = await reviewService.getAllReviews(1, 20, null);

        expect(result.items).toEqual([]);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  moderateReview
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — moderateReview', () => {
    beforeEach(() => {
        ReviewModel.getReviewById.mockResolvedValue(mockReview);
        ReviewModel.moderateReview.mockResolvedValue(true);
    });

    it('approves a review', async () => {
        ReviewModel.getReviewById
            .mockResolvedValueOnce(mockReview)     // first call: check exists
            .mockResolvedValueOnce({ ...mockReview, status: 'approved' }); // second: return updated

        const result = await reviewService.moderateReview(10, 'approved');

        expect(result.status).toBe('approved');
        expect(ReviewModel.moderateReview).toHaveBeenCalledWith(10, 'approved', null);
    });

    it('rejects a review with moderation note', async () => {
        ReviewModel.getReviewById
            .mockResolvedValueOnce(mockReview)
            .mockResolvedValueOnce({ ...mockReview, status: 'rejected', moderation_note: 'Inappropriate' });

        const result = await reviewService.moderateReview(10, 'rejected', 'Inappropriate');

        expect(result.status).toBe('rejected');
        expect(ReviewModel.moderateReview).toHaveBeenCalledWith(10, 'rejected', 'Inappropriate');
    });

    it('throws for invalid moderation status', async () => {
        await expect(
            reviewService.moderateReview(10, 'invalid_status')
        ).rejects.toThrow(/approved.*rejected/i);
    });

    it('throws when review not found', async () => {
        ReviewModel.getReviewById.mockResolvedValue(null);

        await expect(
            reviewService.moderateReview(999, 'approved')
        ).rejects.toThrow(/Review not found/i);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  updateReview
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — updateReview', () => {
    beforeEach(() => {
        ReviewModel.getReviewById.mockResolvedValue(mockReview);
        ReviewModel.updateReview.mockResolvedValue(true);
        ReviewModel.moderateReview.mockResolvedValue(true);
    });

    it('updates review rating, title, and comment', async () => {
        ReviewModel.getReviewById
            .mockResolvedValueOnce(mockReview)
            .mockResolvedValueOnce({ ...mockReview, rating: 4, title: 'Updated', comment: 'Changed my mind' });

        const result = await reviewService.updateReview(10, 42, {
            rating: 4,
            title: 'Updated',
            comment: 'Changed my mind',
        });

        expect(result.rating).toBe(4);
        expect(ReviewModel.updateReview).toHaveBeenCalledWith(10, {
            rating: 4,
            title: 'Updated',
            comment: 'Changed my mind',
        });
    });

    it('resets review status to pending on edit', async () => {
        ReviewModel.getReviewById
            .mockResolvedValueOnce(mockReview)
            .mockResolvedValueOnce({ ...mockReview, status: 'pending' });

        await reviewService.updateReview(10, 42, { rating: 3 });

        expect(ReviewModel.moderateReview).toHaveBeenCalledWith(10, 'pending', null);
    });

    it('throws when review not found', async () => {
        ReviewModel.getReviewById.mockResolvedValue(null);

        await expect(
            reviewService.updateReview(999, 42, { rating: 3 })
        ).rejects.toThrow(/Review not found/i);
    });

    it('throws when user is not the author', async () => {
        await expect(
            reviewService.updateReview(10, 99, { rating: 3 })
        ).rejects.toThrow(/Not authorized/i);
    });

    it('throws when rating is out of range', async () => {
        await expect(
            reviewService.updateReview(10, 42, { rating: 6 })
        ).rejects.toThrow(/Rating.*between 1 and 5/i);
    });

    it('preserves existing title and comment when not provided in update', async () => {
        ReviewModel.getReviewById
            .mockResolvedValueOnce(mockReview)
            .mockResolvedValueOnce(mockReview);

        await reviewService.updateReview(10, 42, { rating: 5 });

        expect(ReviewModel.updateReview).toHaveBeenCalledWith(10, {
            rating: 5,
            title: 'Great product',
            comment: 'Really love it',
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  deleteReview
// ═══════════════════════════════════════════════════════════════════════════════

describe('reviewService — deleteReview', () => {
    beforeEach(() => {
        ReviewModel.getReviewById.mockResolvedValue(mockReview);
        ReviewModel.deleteReview.mockResolvedValue(true);
    });

    it('deletes own review as regular user', async () => {
        const result = await reviewService.deleteReview(10, 42, false);

        expect(result).toBe(true);
        expect(ReviewModel.deleteReview).toHaveBeenCalledWith(10);
    });

    it('deletes any review as admin', async () => {
        const result = await reviewService.deleteReview(10, 99, true);

        expect(result).toBe(true);
    });

    it('throws when review not found', async () => {
        ReviewModel.getReviewById.mockResolvedValue(null);

        await expect(
            reviewService.deleteReview(999, 42)
        ).rejects.toThrow(/Review not found/i);
    });

    it('throws when non-admin tries to delete another user review', async () => {
        await expect(
            reviewService.deleteReview(10, 99, false)
        ).rejects.toThrow(/Not authorized/i);
    });
});
