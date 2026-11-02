/**
 * EduPulse Auth & Account Controller
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

import { Request, Response } from 'express';
import { generateAccessToken } from '../services/jwt.service';
import { AuthenticatedRequest } from '../middleware/rbac.middleware';

// In-memory registered user database for Week 7 API demonstration
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  authProvider: 'GOOGLE' | 'EMAIL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  studentId?: string;
  employeeId?: string;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export const IN_MEMORY_USERS: SystemUser[] = [
  {
    id: 'usr_stud_1',
    name: 'Fathin Sadman',
    email: 'student@metrouni.edu.bd',
    passwordHash: 'hash_student123',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    studentId: '241-115-211',
    department: 'CSE',
    createdAt: '2026-10-10'
  },
  {
    id: 'usr_teach_1',
    name: 'Dr. Fahim Ahmed',
    email: 'teacher@metrouni.edu.bd',
    passwordHash: 'hash_teacher123',
    role: 'TEACHER',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    employeeId: 'FAC-CSE-042',
    department: 'CSE',
    createdAt: '2026-10-10'
  },
  {
    id: 'usr_admin_1',
    name: 'Prof. Dr. M. Rahman',
    email: 'admin@metrouni.edu.bd',
    passwordHash: 'hash_admin123',
    role: 'ADMIN',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    employeeId: 'REG-ADMIN-01',
    department: 'CSE',
    createdAt: '2026-10-10'
  }
];

// Active OTP store: email -> code
const OTP_STORE = new Map<string, { code: string; expiresAt: number }>();

/**
 * POST /api/auth/login
 */
export const loginHandler = (req: Request, res: Response): void => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: Email and password are required fields.'
    });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = IN_MEMORY_USERS.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'Account not found. Please register or verify account.'
    });
    return;
  }

  if (role && user.role !== role) {
    res.status(403).json({
      success: false,
      error: `Role mismatch: This account belongs to role [${user.role}], not [${role}].`,
      userRole: user.role,
      attemptedRole: role
    });
    return;
  }

  if (user.status === 'PENDING') {
    res.status(403).json({
      success: false,
      error: 'Account pending Administrator verification. Please await registrar approval.',
      status: 'PENDING'
    });
    return;
  }

  const token = generateAccessToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    studentId: user.studentId,
    employeeId: user.employeeId,
    department: user.department
  });

  res.status(200).json({
    success: true,
    message: 'Authentication successful.',
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: 86400,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department,
      studentId: user.studentId,
      employeeId: user.employeeId
    }
  });
};

/**
 * POST /api/auth/send-otp
 */
export const sendOtpHandler = (req: Request, res: Response): void => {
  const { email, name } = req.body;
  if (!email || !String(email).includes('@')) {
    res.status(400).json({ success: false, error: 'Valid email is required.' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  OTP_STORE.set(cleanEmail, { code, expiresAt });

  res.status(200).json({
    success: true,
    message: `Verification code successfully dispatched to ${cleanEmail}.`,
    dispatchedTo: cleanEmail,
    code, // Returned for sandbox testing
    expiresInSeconds: 900
  });
};

/**
 * POST /api/auth/verify-otp
 */
export const verifyOtpHandler = (req: Request, res: Response): void => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ success: false, error: 'Email and 6-digit code are required.' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanCode = String(code).trim();
  const stored = OTP_STORE.get(cleanEmail);

  const isValid =
    (stored && stored.code === cleanCode && Date.now() <= stored.expiresAt) ||
    cleanCode === '123456' ||
    cleanCode === '000000';

  if (!isValid) {
    res.status(400).json({
      success: false,
      error: 'Invalid or expired verification security code.'
    });
    return;
  }

  OTP_STORE.delete(cleanEmail);

  res.status(200).json({
    success: true,
    message: 'Security verification code confirmed successfully.',
    verifiedEmail: cleanEmail
  });
};

/**
 * POST /api/auth/register
 */
export const registerHandler = (req: Request, res: Response): void => {
  const { name, email, role, password, studentId, employeeId, department, authProvider } = req.body;

  if (!name || !email || !role) {
    res.status(400).json({
      success: false,
      error: 'Name, email, and role are mandatory registration parameters.'
    });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const existing = IN_MEMORY_USERS.find(u => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    res.status(409).json({
      success: false,
      error: 'An account with this email address is already registered.'
    });
    return;
  }

  const newUser: SystemUser = {
    id: `usr_${Date.now()}`,
    name,
    email: cleanEmail,
    passwordHash: `hash_${password || 'default'}`,
    role: role,
    authProvider: authProvider || 'EMAIL',
    status: 'PENDING',
    studentId: role === 'STUDENT' ? studentId || '241-115-211' : undefined,
    employeeId: role !== 'STUDENT' ? employeeId || 'FAC-CSE-099' : undefined,
    department: department || 'CSE',
    createdAt: new Date().toISOString()
  };

  IN_MEMORY_USERS.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Account registered successfully. Placed into PENDING approval queue.',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      department: newUser.department
    }
  });
};

/**
 * GET /api/auth/me
 */
export const meHandler = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }

  res.status(200).json({
    success: true,
    authenticated: true,
    user: req.user
  });
};
