<script setup>
import { ref, computed, onMounted } from 'vue';
import { reviewAPI } from '../../api/reviewApi.js';
import { useToast } from '../../composables/useToast.js';
import {
    Star,
    MessageSquare,
    CheckCircle,
    XCircle,
    Loader2,
    RefreshCw,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Filter,
    Trash2,
} from 'lucide-vue-next';

const toast = useToast();

const reviews = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const pageSize = 10;
const totalItems = ref(0);
const totalPages = ref(0);
const statusFilter = ref('pending');
const actingReviewId = ref(null);

const paginationStart = computed(() => ((currentPage.value - 1) * pageSize) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize, totalItems.value));

const statusTabs = [
    { value: 'pending',  label: 'Pending',  icon: Clock },
    { value: 'approved', label: 'Approved', icon: ThumbsUp },
    { value: 'rejected', label: 'Rejected', icon: ThumbsDown },
    { value: 'all',      label: 'All',      icon: Filter },
];

const fetchReviews = async () => {
    try {
        loading.value = true;
        error.value = null;

        if (statusFilter.value === 'pending') {
            const res = await reviewAPI.getPendingReviews(currentPage.value, pageSize);
            if (res.success) {
                reviews.value = res.data.items || [];
                totalItems.value = res.data.totalItems || 0;
                totalPages.value = res.data.totalPages || 0;
            } else {
                error.value = res.message || 'Failed to load reviews';
            }
        } else {
            const s = statusFilter.value === 'all' ? null : statusFilter.value;
            const res = await reviewAPI.getAllReviews(currentPage.value, pageSize, s);
            if (res.success) {
                reviews.value = res.data.items || [];
                totalItems.value = res.data.totalItems || 0;
                totalPages.value = res.data.totalPages || 0;
            } else {
                error.value = res.message || 'Failed to load reviews';
            }
        }
    } catch (err) {
        console.error('Error fetching reviews:', err);
        error.value = err.response?.data?.message || 'Failed to load reviews';
    } finally {
        loading.value = false;
    }
};

const moderateReview = async (reviewId, status, note) => {
    actingReviewId.value = reviewId;
    try {
        const res = await reviewAPI.moderateReview(reviewId, {
            status,
            moderation_note: note || null,
        });
        if (res.success) {
            toast.success('Review ' + status);
            await fetchReviews();
        } else {
            toast.error(res.message || 'Moderation failed');
        }
    } catch (err) {
        console.error('Moderation error:', err);
        toast.error(err.response?.data?.message || 'Moderation failed');
    } finally {
        actingReviewId.value = null;
    }
};

const approveReview = (id) => moderateReview(id, 'approved');
const rejectReview = (id) => moderateReview(id, 'rejected');

const deleteReview = async (reviewId) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    actingReviewId.value = reviewId;
    try {
        const res = await reviewAPI.deleteReview(reviewId);
        if (res.success) {
            toast.success('Review deleted');
            await fetchReviews();
        } else {
            toast.error(res.message || 'Delete failed');
        }
    } catch (err) {
        console.error('Delete error:', err);
        toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
        actingReviewId.value = null;
    }
};

const switchTab = (tab) => {
    statusFilter.value = tab;
    currentPage.value = 1;
    fetchReviews();
};

const goToPage = (page) => {
    currentPage.value = page;
    fetchReviews();
};

const getPageNumbers = () => {
    const total = totalPages.value;
    const current = currentPage.value;
    const maxVisible = 5;
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => i < rating);
};

const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const showNoteInput = ref(null);
const moderationNote = ref('');

const openNoteInput = (reviewId) => {
    showNoteInput.value = reviewId;
    moderationNote.value = '';
};

const submitWithNote = (reviewId, status) => {
    moderateReview(reviewId, status, moderationNote.value || null);
    showNoteInput.value = null;
    moderationNote.value = '';
};

onMounted(() => {
    fetchReviews();
});
</script>

<template>
    <div class="min-h-screen bg-neutral-100">
        <div class="section py-6 sm:py-8">
            <!-- Header -->
            <div class="mb-8">
                <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
                    <MessageSquare class="w-3.5 h-3.5" />
                    Reviews
                </span>
                <h1 class="text-2xl sm:text-3xl font-bold text-ink">Review Moderation</h1>
                <p class="text-neutral-500 mt-1 text-sm">Approve, reject, and manage product reviews</p>
            </div>

            <!-- Status Tabs -->
            <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    v-for="tab in statusTabs"
                    :key="tab.value"
                    @click="switchTab(tab.value)"
                    :class="[
                        'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0',
                        statusFilter === tab.value
                            ? 'bg-ink text-paper shadow-sm'
                            : 'bg-paper text-neutral-600 hover:bg-neutral-100'
                    ]"
                >
                    <component :is="tab.icon" class="w-4 h-4" />
                    {{ tab.label }}
                </button>
            </div>

            <!-- Error State -->
            <div v-if="error" class="card-flat p-5 sm:p-6 border-l-4 border-l-danger mb-6">
                <div class="flex items-center gap-4">
                    <XCircle class="w-10 h-10 text-danger shrink-0" />
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-ink text-sm">Error Loading Reviews</h3>
                        <p class="text-neutral-500 text-sm mt-0.5">{{ error }}</p>
                    </div>
                    <button @click="fetchReviews" class="btn-primary text-sm gap-1.5 shrink-0">
                        <RefreshCw class="w-3.5 h-3.5" />
                        Retry
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading && reviews.length === 0" class="card-flat p-12 sm:p-16 text-center">
                <Loader2 class="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
                <p class="text-neutral-500 text-sm font-medium">Loading reviews...</p>
            </div>

            <!-- Reviews List -->
            <div v-else class="space-y-4">
                <!-- Empty State -->
                <div v-if="reviews.length === 0 && !loading" class="card-flat p-12 text-center">
                    <MessageSquare class="w-14 h-14 text-neutral-200 mx-auto mb-4" />
                    <p class="text-neutral-500 text-sm font-semibold">
                        {{ statusFilter === 'pending' ? 'No pending reviews' : 'No reviews found' }}
                    </p>
                    <p class="text-xs text-neutral-400 mt-1">
                        New reviews from customers will appear here for moderation.
                    </p>
                </div>

                <!-- Review Card -->
                <div
                    v-for="review in reviews"
                    :key="review.review_id"
                    class="card-flat p-5 sm:p-6"
                    :class="{ 'border-l-4 border-l-amber-500': review.status === 'pending' }"
                >
                    <div class="flex items-start gap-4">
                        <!-- Avatar -->
                        <div class="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {{ (review.username || '?').charAt(0).toUpperCase() }}
                        </div>

                        <div class="flex-1 min-w-0 space-y-2">
                            <!-- Header -->
                            <div class="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <p class="font-bold text-sm text-ink">{{ review.username }}</p>
                                        <span class="text-xs text-neutral-400">|</span>
                                        <span class="text-xs text-neutral-500">{{ formatDate(review.created_at) }}</span>
                                    </div>
                                    <p class="text-xs text-neutral-500 mt-1">
                                        on <span class="font-semibold text-ink">{{ review.product_name || 'Product #' + review.product_id }}</span>
                                    </p>
                                </div>
                                <span v-if="review.status !== 'pending'"
                                    :class="[
                                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0',
                                        review.status === 'approved'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-red-50 text-red-700'
                                    ]"
                                >
                                    {{ review.status }}
                                </span>
                            </div>

                            <!-- Stars -->
                            <div class="flex items-center gap-0.5">
                                <Star
                                    v-for="(filled, i) in renderStars(review.rating)"
                                    :key="i"
                                    :class="['w-4 h-4', filled ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200']"
                                />
                            </div>

                            <p v-if="review.title" class="font-semibold text-sm text-ink">{{ review.title }}</p>
                            <p v-if="review.comment" class="text-sm text-neutral-600 leading-relaxed">{{ review.comment }}</p>
                            <p v-if="review.moderation_note" class="text-xs text-neutral-500 italic">
                                Note: {{ review.moderation_note }}
                            </p>

                            <!-- Actions -->
                            <div v-if="review.status === 'pending'" class="flex items-center gap-2 pt-2">
                                <button
                                    @click="approveReview(review.review_id)"
                                    :disabled="actingReviewId === review.review_id"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle class="w-4 h-4" />
                                    Approve
                                </button>
                                <button
                                    @click="openNoteInput(review.review_id)"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                                >
                                    <XCircle class="w-4 h-4" />
                                    Reject
                                </button>
                                <button
                                    @click="deleteReview(review.review_id)"
                                    :disabled="actingReviewId === review.review_id"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 class="w-4 h-4" />
                                    Delete
                                </button>
                                <div v-if="actingReviewId === review.review_id" class="ml-2">
                                    <Loader2 class="w-4 h-4 animate-spin text-accent" />
                                </div>
                            </div>
                            <div v-else class="flex items-center gap-2 pt-2">
                                <button
                                    @click="deleteReview(review.review_id)"
                                    :disabled="actingReviewId === review.review_id"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 class="w-4 h-4" />
                                    Delete
                                </button>
                            </div>

                            <!-- Moderation Note Input (when rejecting) -->
                            <div v-if="showNoteInput === review.review_id" class="pt-2 space-y-2">
                                <textarea
                                    v-model="moderationNote"
                                    placeholder="Reason for rejection (optional)..."
                                    class="input-base text-sm w-full"
                                    rows="2"
                                ></textarea>
                                <div class="flex gap-2">
                                    <button
                                        @click="submitWithNote(review.review_id, 'rejected')"
                                        :disabled="actingReviewId === review.review_id"
                                        class="px-3 py-1.5 bg-red-600 text-paper rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        Reject with note
                                    </button>
                                    <button
                                        @click="showNoteInput = null"
                                        class="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-bold hover:bg-neutral-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                    <div class="text-xs text-neutral-500 text-center sm:text-left">
                        Showing <span class="font-semibold text-ink">{{ paginationStart }}</span>
                        to <span class="font-semibold text-ink">{{ paginationEnd }}</span>
                        of <span class="font-semibold text-ink">{{ totalItems }}</span> reviews
                    </div>
                    <div class="flex items-center justify-center gap-1.5">
                        <button
                            v-for="page in getPageNumbers()"
                            :key="page"
                            @click="goToPage(page)"
                            :class="[
                                'min-w-9 h-9 rounded-lg text-sm font-bold transition-colors',
                                page === currentPage
                                    ? 'bg-ink text-paper shadow-sm'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                            ]"
                        >
                            {{ page }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
