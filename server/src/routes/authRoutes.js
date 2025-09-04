import { Router } from 'express';
import { createUsers, loginUser } from '../controller/userController.js';

const router = Router();

router.post('/register', createUsers);
router.post('/login', loginUser);

export default router;