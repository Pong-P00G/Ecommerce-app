import express from 'express';
import * as settingsController from '../controller/settingsController.js';
import protect from '../middleware/authMiddleWare.js';
import { isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/', protect, settingsController.getSettings);
router.put('/', protect, isAdmin, settingsController.updateSettings);

export default router;
