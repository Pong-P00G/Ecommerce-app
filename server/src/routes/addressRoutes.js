import express from 'express';
import * as addressController from '../controller/addressController.js';
import protect from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/', protect, addressController.getAddresses);
router.post('/', protect, addressController.createAddress);
router.put('/:addressId', protect, addressController.updateAddress);
router.delete('/:addressId', protect, addressController.deleteAddress);

export default router;
