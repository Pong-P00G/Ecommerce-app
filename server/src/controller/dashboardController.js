import * as dashboardService from '../services/dashboardService.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const stats = await dashboardService.getUserStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get product statistics
export const getProductStats = async (req, res) => {
    try {
        const stats = await dashboardService.getProductStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const activities = await dashboardService.getRecentActivities(parseInt(limit));
        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
    try {
        const { timeframe = 'month' } = req.query;
        const analytics = await dashboardService.getAnalytics(timeframe);
        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
