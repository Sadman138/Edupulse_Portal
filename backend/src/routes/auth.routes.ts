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
  meHandler
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/rbac.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/send-otp', sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);

// Protected Auth Endpoints (Requires valid JWT Bearer token)
router.get('/me', authenticateToken, meHandler);

export default router;
