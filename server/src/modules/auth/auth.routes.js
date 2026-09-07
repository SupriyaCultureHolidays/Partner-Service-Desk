import { Router } from 'express';
import { login, verifyOtp, refresh, logout, me } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, me);

export default router;
