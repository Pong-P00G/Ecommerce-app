import * as userNotificationService from '../services/userNotificationService.js';

// GET /api/notifications — paginated user notifications
export const getUserNotifications = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, type } = req.query;
        const result = await userNotificationService.getUserNotifications(
            req.user.id,
            parseInt(page),
            parseInt(pageSize),
            type || null
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/notifications/recent — recent user notifications (for dropdown)
export const getRecentUserNotifications = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const result = await userNotificationService.getRecentUserNotifications(
            req.user.id,
            parseInt(limit)
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/notifications/unread-count
export const getUserUnreadCount = async (req, res) => {
    try {
        const count = await userNotificationService.getUserUnreadCount(req.user.id);
        res.json({ success: true, data: { unreadCount: count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/notifications/:id — single notification detail
export const getUserNotificationById = async (req, res) => {
    try {
        const notification = await userNotificationService.getUserNotificationById(
            req.user.id,
            parseInt(req.params.id)
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/notifications/:id/read — mark as read
export const markNotificationRead = async (req, res) => {
    try {
        const updated = await userNotificationService.markNotificationRead(
            req.user.id,
            parseInt(req.params.id)
        );
        if (updated) {
            res.json({ success: true, message: 'Notification marked as read' });
        } else {
            res.status(404).json({ success: false, message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/notifications/read-all — mark all as read
export const markAllNotificationsRead = async (req, res) => {
    try {
        await userNotificationService.markAllNotificationsRead(req.user.id);
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
