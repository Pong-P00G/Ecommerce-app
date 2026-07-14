import express from 'express';
import * as dashboardController from '../controller/dashboardController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get comprehensive dashboard statistics (products, users, revenue, orders)
// @access  Private/Admin
router.get('/stats', protect, isAdmin, dashboardController.getDashboardStats);

// @route   GET /api/dashboard/users
// @desc    Get user statistics
// @access  Private/Admin
router.get('/users', protect, isAdmin, dashboardController.getUserStats);

// @route   GET /api/dashboard/products
// @desc    Get product statistics
// @access  Private/Admin
router.get('/products', protect, isAdmin, dashboardController.getProductStats);

// @route   GET /api/dashboard/activities
// @desc    Get recent activities
// @access  Private/Admin
router.get('/activities', protect, isAdmin, dashboardController.getRecentActivities);

// @route   GET /api/dashboard/search
// @desc    Global search (products, orders, users)
// @access  Private/Admin
router.get('/search', protect, isAdmin, dashboardController.globalSearch);

// @route   GET /api/dashboard/reviews
// @desc    Get review statistics (total, approval, rating)
// @access  Private/Admin
router.get('/reviews', protect, isAdmin, dashboardController.getReviewStats);

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data
// @access  Private/Admin
router.get('/analytics', protect, isAdmin, dashboardController.getAnalytics);

// @route   GET /api/dashboard/revenue
// @desc    Get revenue statistics (today, week, month, growth)
// @access  Private/Admin
router.get('/revenue', protect, isAdmin, dashboardController.getRevenue);

// @route   GET /api/dashboard/orders
// @desc    Get order statistics (status counts)
// @access  Private/Admin
router.get('/orders', protect, isAdmin, dashboardController.getOrderStats);

// @route   GET /api/dashboard/recent-orders
// @desc    Get recent orders with customer info
// @access  Private/Admin
router.get('/recent-orders', protect, isAdmin, dashboardController.getRecentOrders);

// @route   GET /api/dashboard/top-products
// @desc    Get top selling products
// @access  Private/Admin
router.get('/top-products', protect, isAdmin, dashboardController.getTopProducts);

// ── LOW-STOCK CHECK ROUTE ───────────────────────────────────────────────────

// @route   POST /api/dashboard/check-low-stock
// @desc    Manually trigger a low-stock check from the Inventory page
// @access  Private/Admin
router.post('/check-low-stock', protect, isAdmin, dashboardController.checkLowStock);

// ── NOTIFICATION ROUTES ────────────────────────────────────────────────────

// @route   GET /api/dashboard/notifications/all
// @desc    Get all notifications (paginated, with type filter)
// @access  Private/Admin
router.get('/notifications/all', protect, isAdmin, dashboardController.getAllNotifications);

// @route   GET /api/dashboard/notifications
// @desc    Get recent notifications (unread first)
// @access  Private/Admin
router.get('/notifications', protect, isAdmin, dashboardController.getNotifications);

// @route   PUT /api/dashboard/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private/Admin
router.put('/notifications/:id/read', protect, isAdmin, dashboardController.markNotificationRead);

// @route   PUT /api/dashboard/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private/Admin
router.put('/notifications/read-all', protect, isAdmin, dashboardController.markAllNotificationsRead);

// ── NOTIFICATION PREFERENCES ROUTES ──────────────────────────────────────────

// @route   GET /api/dashboard/notification-preferences
// @desc    Get the current user's notification preferences
// @access  Private/Admin
router.get('/notification-preferences', protect, isAdmin, dashboardController.getNotificationPreferences);

// @route   PUT /api/dashboard/notification-preferences
// @desc    Update the current user's notification preferences
// @access  Private/Admin
router.put('/notification-preferences', protect, isAdmin, dashboardController.updateNotificationPreferences);

// ── PUSH SUBSCRIPTION ROUTES ────────────────────────────────────────────────

// @route   GET /api/dashboard/vapid-public-key
// @desc    Get the VAPID public key for push notification subscription
// @access  Private/Admin
router.get('/vapid-public-key', protect, isAdmin, dashboardController.getVapidPublicKey);

// @route   POST /api/dashboard/push-subscribe
// @desc    Save a push notification subscription
// @access  Private/Admin
router.post('/push-subscribe', protect, isAdmin, dashboardController.savePushSubscription);

// @route   DELETE /api/dashboard/push-subscribe
// @desc    Remove a push notification subscription
// @access  Private/Admin
router.delete('/push-subscribe', protect, isAdmin, dashboardController.removePushSubscription);

// ── ACTIVITIES ROUTES ────────────────────────────────────────────────────────

// @route   GET /api/dashboard/activities/all
// @desc    Get all activities (paginated, with type filter)
// @access  Private/Admin
router.get('/activities/all', protect, isAdmin, dashboardController.getAllActivities);

// @route   POST /api/dashboard/reports/generate
// @desc    Generate a report on-the-fly (sales, inventory, customer, financial)
// @access  Private/Admin
router.post('/reports/generate', protect, isAdmin, dashboardController.generateReport);

export default router;
