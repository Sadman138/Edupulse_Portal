/**
 * EduPulse Admin & RBAC Routes
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

import { Router } from 'express';
import {
  getPendingUsersHandler,
  approveUserHandler,
  rejectUserHandler,
  getRbacMatrixHandler,
  getSystemHealthHandler
} from '../controllers/admin.controller';
import { authenticateToken, authorizeRoles, requirePermission } from '../middleware/rbac.middleware';

const router = Router();

// Apply Authentication to all Admin Routes
router.use(authenticateToken);

// Apply strict ADMIN role authorization
router.use(authorizeRoles('ADMIN'));

// Admin User Approval Endpoints
router.get('/users/pending', requirePermission('ADMIN_USER_APPROVAL_MANAGE'), getPendingUsersHandler);
router.patch('/users/:id/approve', requirePermission('ADMIN_USER_APPROVAL_MANAGE'), approveUserHandler);
router.patch('/users/:id/reject', requirePermission('ADMIN_USER_APPROVAL_MANAGE'), rejectUserHandler);

// Admin RBAC & Audit Endpoints
router.get('/rbac/matrix', requirePermission('SECURITY_RBAC_INSPECT'), getRbacMatrixHandler);
router.get('/system/health', getSystemHealthHandler);

export default router;
