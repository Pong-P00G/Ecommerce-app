import  express  from 'express';
import { registerUser, loginUser, checkEmail, checkUsername } from '../controller/userController.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleWare.js'

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);

export default router;