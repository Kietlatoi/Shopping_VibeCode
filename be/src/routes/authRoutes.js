import express from 'express';
import { register, login, refresh, forgotPassword } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', protect, refresh);
router.post('/forgot-password', forgotPassword);

export default router;
