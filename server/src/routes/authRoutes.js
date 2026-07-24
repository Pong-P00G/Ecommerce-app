import  express  from 'express';
import { registerUser, loginUser, logoutUser, getMe, checkEmail, checkUsername } from '../controller/userController.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleWare.js';
import protect from '../middleware/authMiddleWare.js';
import { getUserPermissions } from '../controller/authController.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);
router.get('/permissions', protect, getUserPermissions);

export default router;