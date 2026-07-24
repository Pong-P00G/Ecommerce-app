import * as NotificationModel from '../model/notificationModel.js';

export const getUserNotifications = async (userId, page = 1, pageSize = 20, type = null) => {
    return await NotificationModel.getUserNotifications(userId, page, pageSize, type);
};

export const getRecentUserNotifications = async (userId, limit = 10) => {
    const [notifications, unreadCount] = await Promise.all([
        NotificationModel.getUserRecentNotifications(userId, limit),
        NotificationModel.getUserUnreadCount(userId),
    ]);
    return { notifications, unreadCount };
};

export const getUserUnreadCount = async (userId) => {
    return await NotificationModel.getUserUnreadCount(userId);
};

export const getUserNotificationById = async (userId, notificationId) => {
    return await NotificationModel.getUserNotificationById(userId, notificationId);
};

export const markNotificationRead = async (userId, notificationId) => {
    return await NotificationModel.markUserNotificationAsRead(userId, notificationId);
};

export const markAllNotificationsRead = async (userId) => {
    return await NotificationModel.markAllUserNotificationsAsRead(userId);
};
