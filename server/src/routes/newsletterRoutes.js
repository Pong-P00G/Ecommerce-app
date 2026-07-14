import express from 'express';
import { subscribe } from '../controller/newsletterController.js';

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe an email to the newsletter
// @access  Public
router.post('/subscribe', subscribe);

export default router;
