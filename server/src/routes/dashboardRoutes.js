import express from 'express';
import * as dashboardController from '../controller/dashboardController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get comprehensive dashboard statistics
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

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data
// @access  Private/Admin
router.get('/analytics', protect, isAdmin, dashboardController.getAnalytics);

export default router;
