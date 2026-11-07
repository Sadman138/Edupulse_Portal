/**
 * EduPulse Auth Routes
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
  sendOtpHandler,
  verifyOtpHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getCurrentUserHandler,
  logoutHandler
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/rbac.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/send-otp', sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);
router.post('/logout', logoutHandler);

// Protected Auth Endpoints (Requires valid JWT Bearer token or cookie)
router.get('/me', authenticateToken, getCurrentUserHandler);

export default router;
