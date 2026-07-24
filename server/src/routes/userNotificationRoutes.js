import express from 'express';
import * as userNotificationController from '../controller/userNotificationController.js';
import protect from '../middleware/authMiddleWare.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get paginated user notifications (with optional type filter)
// @access  Private
router.get('/', protect, userNotificationController.getUserNotifications);

// @route   GET /api/notifications/recent
// @desc    Get recent user notifications (for dropdown)
// @access  Private
router.get('/recent', protect, userNotificationController.getRecentUserNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count for the current user
// @access  Private
router.get('/unread-count', protect, userNotificationController.getUserUnreadCount);

// @route   GET /api/notifications/:id
// @desc    Get a single notification detail
// @access  Private
router.get('/:id', protect, userNotificationController.getUserNotificationById);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
router.put('/:id/read', protect, userNotificationController.markNotificationRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, userNotificationController.markAllNotificationsRead);

export default router;
