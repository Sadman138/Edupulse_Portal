/**
 * EduPulse Express RBAC Middleware & Security Filters
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../services/jwt.service';
import { UserRole, checkPermission } from '../config/rbac.matrix';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware: Verify Bearer JWT Token
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing Authorization header. Provide a valid Bearer token.',
      code: 'AUTH_HEADER_MISSING'
    });
    return;
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  const result = verifyAccessToken(token);

  if (!result.valid || !result.payload) {
    res.status(401).json({
      success: false,
      error: `Unauthorized: ${result.error || 'Invalid or expired token'}`,
      code: 'INVALID_TOKEN'
    });
    return;
  }

  req.user = result.payload;
  next();
};

/**
 * Middleware: Authorize specific Roles (RBAC Guard)
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required before evaluating role permissions.',
        code: 'UNAUTHENTICATED'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: User role [${req.user.role}] is not authorized to access this resource. Allowed roles: [${allowedRoles.join(', ')}]`,
        code: 'RBAC_ACCESS_DENIED',
        attemptedRole: req.user.role,
        requiredRoles: allowedRoles
      });
      return;
    }

    next();
  };
};

/**
 * Middleware: Check granular Permission Capability
 */
export const requirePermission = (permissionId: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required.',
        code: 'UNAUTHENTICATED'
      });
      return;
    }

    const hasPerm = checkPermission(req.user.role, permissionId);
    if (!hasPerm) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Role [${req.user.role}] lacks permission [${permissionId}].`,
        code: 'PERMISSION_DENIED',
        permissionRequired: permissionId,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

/**
 * Middleware: Institutional Audit Logger
 */
export const auditLogger = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userTag = req.user ? `${req.user.email} (${req.user.role})` : 'Anonymous';
    console.log(`[AUDIT] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | User: ${userTag} | ${duration}ms`);
  });
  next();
};
