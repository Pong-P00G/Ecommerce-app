import express from 'express';
import * as imageController from '../controller/imageController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

// @route   POST /api/images/upload
// @desc    Upload single image
// @access  Private/Admin
router.post('/upload', protect, isAdmin, imageController.uploadImage);

// @route   POST /api/images/upload-multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/upload-multiple', protect, isAdmin, imageController.uploadMultipleImages);

// @route   GET /api/images
// @desc    Get all uploaded images
// @access  Public
router.get('/', imageController.getAllImages);

// @route   DELETE /api/images/:filename
// @desc    Delete image by filename
// @access  Private/Admin
router.delete('/:filename', protect, isAdmin, imageController.deleteImage);

export default router;
