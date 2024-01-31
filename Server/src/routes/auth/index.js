// routes/auth.js
import { Router } from 'express';
import { loginController, signupController } from '../../controllers/index.js';
const router = Router();
// Signup route
router.post('/signup', signupController);

// Login route
router.post('/login', loginController);

export default router;
