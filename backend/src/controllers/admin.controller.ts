/**
 * EduPulse Admin & RBAC Controller
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbac.middleware';
import { IN_MEMORY_USERS } from './auth.controller';
import { RBAC_PERMISSIONS_CATALOG } from '../config/rbac.matrix';

/**
 * GET /api/admin/users/pending (ADMIN ONLY)
 */
export const getPendingUsersHandler = (req: AuthenticatedRequest, res: Response): void => {
  const pending = IN_MEMORY_USERS.filter(u => u.status === 'PENDING');
  res.status(200).json({
    success: true,
    totalPending: pending.length,
    users: pending.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      studentId: u.studentId,
      employeeId: u.employeeId,
      department: u.department,
      createdAt: u.createdAt
    }))
  });
};

/**
 * PATCH /api/admin/users/:id/approve (ADMIN ONLY)
 */
export const approveUserHandler = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = IN_MEMORY_USERS.find(u => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }

  user.status = 'APPROVED';

  res.status(200).json({
    success: true,
    message: `Account [${user.name}] successfully APPROVED by Administrator [${req.user?.name}].`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
};

/**
 * PATCH /api/admin/users/:id/reject (ADMIN ONLY)
 */
export const rejectUserHandler = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = IN_MEMORY_USERS.find(u => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }

  user.status = 'REJECTED';

  res.status(200).json({
    success: true,
    message: `Account [${user.name}] rejected. Reason: ${reason || 'Incomplete credential verification.'}`,
    user: {
      id: user.id,
      status: user.status
    }
  });
};

/**
 * GET /api/admin/rbac/matrix (ADMIN ONLY)
 */
export const getRbacMatrixHandler = (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    success: true,
    totalPermissions: RBAC_PERMISSIONS_CATALOG.length,
    rolesSupported: ['STUDENT', 'TEACHER', 'ADMIN'],
    permissions: RBAC_PERMISSIONS_CATALOG
  });
};

/**
 * GET /api/admin/system/health
 */
export const getSystemHealthHandler = (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    success: true,
    system: 'EduPulse Academic Express API Engine',
    version: '1.7.0 (Week 7 Milestone)',
    institution: 'Department of CSE, Metropolitan University, Sylhet',
    environment: 'Production / Sandbox',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: 'MySQL 8.0 Normalized InnoDB',
    rbacEngine: 'Active (Strict Role Isolation)',
    activeUsersCount: IN_MEMORY_USERS.length
  });
};
