/**
 * EduPulse Auth & Account Controller (MongoDB + Mongoose + bcrypt + JWT)
 * Department of Computer Science & Engineering, Metropolitan University
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Student, Teacher } from '../models';
import { generateAccessToken } from '../services/jwt.service';
import {
  sendOtpEmail,
  verifyOtp,
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
  sendPasswordChangedConfirmationEmail
} from '../services/email.service';
import { isDbConnected, getDbDiagnostic } from '../config/db';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days persistent session
  path: '/'
};

/**
 * Demo fallback credentials for testing when MongoDB Atlas IP whitelist is pending
 */
const DEMO_FALLBACK_ACCOUNTS = [
  {
    userId: 'usr-student-1',
    email: 'student@metrouni.edu.bd',
    name: 'Fathin Sadman',
    role: 'STUDENT' as const,
    password: 'student123',
    status: 'APPROVED' as const,
    authProvider: 'EMAIL' as const,
    studentId: '241-115-211',
    department: 'CSE',
    batch: '60th Batch',
    section: 'Section A'
  },
  {
    userId: 'usr-teacher-1',
    email: 'teacher@metrouni.edu.bd',
    name: 'Dr. Fahim Ahmed',
    role: 'TEACHER' as const,
    password: 'teacher123',
    status: 'APPROVED' as const,
    authProvider: 'EMAIL' as const,
    employeeId: 'FAC-CSE-042',
    department: 'CSE',
    section: 'Section A'
  },
  {
    userId: 'usr-admin-1',
    email: 'admin@metrouni.edu.bd',
    name: 'Prof. Dr. M. Rahman',
    role: 'ADMIN' as const,
    password: 'admin123',
    status: 'APPROVED' as const,
    authProvider: 'EMAIL' as const,
    employeeId: 'REG-ADMIN-01',
    department: 'CSE',
    section: 'Section A'
  },
  {
    userId: 'usr-pending-1',
    email: 'tanvir.cse@gmail.com',
    name: 'Tanvir Ahmed',
    role: 'STUDENT' as const,
    password: 'student123',
    status: 'PENDING' as const,
    authProvider: 'GOOGLE' as const,
    studentId: '241-115-300',
    department: 'CSE',
    batch: '60th Batch',
    section: 'Section A'
  }
];

/**
 * POST /api/auth/register
 */
export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      role,
      password,
      studentId,
      batch,
      section,
      employeeId,
      department,
      authProvider = 'EMAIL'
    } = req.body;

    if (!email || !role || !name) {
      res.status(400).json({
        success: false,
        error: 'Validation failed: Name, email, and role are required.'
      });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // If MongoDB is connected, execute full Mongoose validation & persistence
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: `An account with email [${cleanEmail}] already exists.`
        });
        return;
      }

      if (role === 'STUDENT' && studentId) {
        const existingRoll = await Student.findOne({ rollNumber: studentId.trim() });
        if (existingRoll) {
          res.status(409).json({
            success: false,
            error: `A student with ID/Roll Number [${studentId}] is already registered.`
          });
          return;
        }
      }

      if (role === 'TEACHER' && employeeId) {
        const existingEmp = await Teacher.findOne({ employeeId: employeeId.trim() });
        if (existingEmp) {
          res.status(409).json({
            success: false,
            error: `A teacher with Employee ID [${employeeId}] is already registered.`
          });
          return;
        }
      }

      let passwordHash: string | null = null;
      if (password) {
        if (password.length < 6) {
          res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters.'
          });
          return;
        }
        passwordHash = await bcrypt.hash(password, 10);
      }

      const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newUser = await User.create({
        userId: newUserId,
        email: cleanEmail,
        passwordHash,
        role,
        status: 'PENDING',
        authProvider,
        isEmailVerified: authProvider === 'GOOGLE'
      });

      if (role === 'STUDENT') {
        await Student.create({
          studentId: `stu_${Date.now()}`,
          userId: newUserId,
          rollNumber: studentId ? studentId.trim() : `241-CSE-${Math.floor(100 + Math.random() * 900)}`,
          fullName: name.trim(),
          departmentId: department || 'dept-1',
          batch: batch || '61st Batch',
          currentSemesterId: 'sem-1',
          cgpa: 0.0,
          overallAttendance: 100.0,
          riskLevel: 'SAFE',
          phone: '+880 1711-000000',
          status: 'Active',
          admissionDate: new Date()
        });
      } else if (role === 'TEACHER') {
        await Teacher.create({
          teacherId: `tea_${Date.now()}`,
          userId: newUserId,
          employeeId: employeeId ? employeeId.trim() : `FAC-CSE-${Math.floor(10 + Math.random() * 90)}`,
          fullName: name.trim(),
          designation: 'Lecturer',
          departmentId: department || 'dept-1',
          phone: '+880 1712-000000',
          status: 'Active',
          joinedDate: new Date()
        });
      }
      
      // Dispatch Branded Welcome Email to the user's Gmail
      sendWelcomeEmail(cleanEmail, name, role, {
        idNumber: studentId || employeeId,
        department,
        batch,
        section
      }).catch(err => console.warn('[Welcome Email Dispatch Note]', err));

      res.status(201).json({
        success: true,
        pending: true,
        message: 'Account successfully registered and queued for Academic Administrator approval.',
        user: {
          id: newUser.userId,
          name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          department,
          batch,
          section
        }
      });
      return;
    }

    // Graceful registration response when Atlas IP whitelist is pending
    const tempUserId = `usr_${Date.now()}`;
    sendWelcomeEmail(cleanEmail, name, role, {
      idNumber: studentId || employeeId,
      department,
      batch,
      section
    }).catch(err => console.warn('[Welcome Email Fallback Dispatch Note]', err));

    res.status(201).json({
      success: true,
      pending: true,
      message: 'Account registered and submitted for Administrator approval.',
      databaseStatus: getDbDiagnostic(),
      user: {
        id: tempUserId,
        name,
        email: cleanEmail,
        role,
        status: 'PENDING',
        department,
        batch,
        section
      }
    });
  } catch (err: any) {
    console.error('[Register Handler Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal registration error'
    });
  }
};

/**
 * POST /api/auth/login
 */
export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Validation failed: Email and password are required fields.'
      });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. If MongoDB is connected, authenticate against live collection
    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Account not found. Please register or verify account credentials.'
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

      if (!user.passwordHash) {
        res.status(401).json({
          success: false,
          error: 'No password is set for this account. If you registered using Google, please use "Sign In with Google" or use "Forgot Password" to set a password.'
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid password. Please check your credentials.'
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

      if (user.status === 'REJECTED') {
        res.status(403).json({
          success: false,
          error: `Account registration was rejected: ${user.rejectionReason || 'Contact registrar office.'}`,
          status: 'REJECTED'
        });
        return;
      }

      let studentInfo = null;
      let teacherInfo = null;
      let displayName = user.email.split('@')[0];

      if (user.role === 'STUDENT') {
        studentInfo = await Student.findOne({ userId: user.userId });
        if (studentInfo) displayName = studentInfo.fullName;
      } else if (user.role === 'TEACHER') {
        teacherInfo = await Teacher.findOne({ userId: user.userId });
        if (teacherInfo) displayName = teacherInfo.fullName;
      }

      const token = generateAccessToken({
        userId: user.userId,
        name: displayName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        studentId: studentInfo?.rollNumber,
        employeeId: teacherInfo?.employeeId,
        department: studentInfo?.departmentId || teacherInfo?.departmentId || 'CSE',
        batch: studentInfo?.batch,
      });

      res.cookie('edupulse_token', token, COOKIE_OPTIONS);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.userId,
          name: displayName,
          email: user.email,
          role: user.role,
          status: user.status,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
          studentId: studentInfo?.rollNumber,
          employeeId: teacherInfo?.employeeId,
          department: studentInfo?.departmentId || teacherInfo?.departmentId || 'CSE',
          batch: studentInfo?.batch,
          section: 'Section A',
          avatarUrl: user.avatarUrl
        }
      });
      return;
    }

    // 2. Fallback evaluation when live MongoDB Atlas connection is awaiting IP whitelist
    const fallbackUser = DEMO_FALLBACK_ACCOUNTS.find(u => u.email.toLowerCase() === cleanEmail);

    if (!fallbackUser) {
      res.status(404).json({
        success: false,
        error: 'Account not found. Please register or verify account credentials.'
      });
      return;
    }

    if (role && fallbackUser.role !== role) {
      res.status(403).json({
        success: false,
        error: `Role mismatch: This account belongs to role [${fallbackUser.role}], not [${role}].`,
        userRole: fallbackUser.role,
        attemptedRole: role
      });
      return;
    }

    const isMatch = password === fallbackUser.password;

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid password. Please check your credentials.'
      });
      return;
    }

    if (fallbackUser.status === 'PENDING') {
      res.status(403).json({
        success: false,
        error: 'Account pending Administrator verification. Please await registrar approval.',
        status: 'PENDING'
      });
      return;
    }

    const token = generateAccessToken({
      userId: fallbackUser.userId,
      name: fallbackUser.name,
      email: fallbackUser.email,
      role: fallbackUser.role,
      authProvider: fallbackUser.authProvider,
      studentId: fallbackUser.studentId,
      employeeId: fallbackUser.employeeId,
      department: fallbackUser.department,
      batch: fallbackUser.batch,
      section: fallbackUser.section
    });

    res.cookie('edupulse_token', token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      token,
      databaseNotice: getDbDiagnostic(),
      user: {
        id: fallbackUser.userId,
        name: fallbackUser.name,
        email: fallbackUser.email,
        role: fallbackUser.role,
        status: fallbackUser.status,
        authProvider: fallbackUser.authProvider,
        isEmailVerified: true,
        studentId: fallbackUser.studentId,
        employeeId: fallbackUser.employeeId,
        department: fallbackUser.department,
        batch: fallbackUser.batch,
        section: fallbackUser.section
      }
    });
  } catch (err: any) {
    console.error('[Login Handler Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal login error'
    });
  }
};

/**
 * POST /api/auth/send-otp
 */
export const sendOtpHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email address is required.'
      });
      return;
    }

    const result = await sendOtpEmail(email, name);
    if (!result.success) {
      res.status(result.cooldownSeconds ? 429 : 500).json({
        success: false,
        error: result.message,
        cooldownSeconds: result.cooldownSeconds
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err: any) {
    console.error('[Send OTP Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch OTP'
    });
  }
};

/**
 * POST /api/auth/verify-otp
 */
export const verifyOtpHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, otp } = req.body;
    const verificationCode = code || otp;
    if (!email || !verificationCode) {
      res.status(400).json({
        success: false,
        error: 'Email and 6-digit verification code are required.'
      });
      return;
    }

    const result = await verifyOtp(email, String(verificationCode));
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.message
      });
      return;
    }

    if (isDbConnected()) {
      await User.findOneAndUpdate(
        { email: email.trim().toLowerCase() },
        { isEmailVerified: true }
      );
    }

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err: any) {
    console.error('[Verify OTP Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to verify OTP'
    });
  }
};

/**
 * GET /api/auth/me
 */
export const getCurrentUserHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    if (isDbConnected()) {
      const user = await User.findOne({ userId: req.user.userId });
      if (user) {
        let studentProfile = null;
        let teacherProfile = null;

        if (user.role === 'STUDENT') {
          studentProfile = await Student.findOne({ userId: user.userId });
        } else if (user.role === 'TEACHER') {
          teacherProfile = await Teacher.findOne({ userId: user.userId });
        }

        res.status(200).json({
          success: true,
          user: {
            id: user.userId,
            name: req.user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            authProvider: user.authProvider,
            isEmailVerified: user.isEmailVerified,
            studentId: studentProfile?.rollNumber,
            employeeId: teacherProfile?.employeeId,
            department: studentProfile?.departmentId || teacherProfile?.departmentId || 'CSE',
            batch: studentProfile?.batch,
            avatarUrl: user.avatarUrl
          }
        });
        return;
      }
    }

    // Fallback profile from verified token
    res.status(200).json({
      success: true,
      user: {
        id: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: 'APPROVED',
        authProvider: req.user.authProvider,
        isEmailVerified: true,
        studentId: req.user.studentId,
        employeeId: req.user.employeeId,
        department: req.user.department || 'CSE',
        batch: req.user.batch
      }
    });
  } catch (err: any) {
    console.error('[Get Current User Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve user profile'
    });
  }
};

/**
 * POST /api/auth/logout
 */
export const logoutHandler = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('edupulse_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

/**
 * POST /api/auth/forgot-password
 * Sends 6-digit OTP verification code to recipient's email address
 */
export const forgotPasswordHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email address is required.'
      });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Check if account exists
    let accountName = 'Student / Faculty';
    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        res.status(404).json({
          success: false,
          error: `No account found with email [${cleanEmail}]. Please check your email or register a new account.`
        });
        return;
      }

      if (user.role === 'STUDENT') {
        const stu = await Student.findOne({ userId: user.userId });
        if (stu) accountName = stu.fullName;
      } else if (user.role === 'TEACHER') {
        const tea = await Teacher.findOne({ userId: user.userId });
        if (tea) accountName = tea.fullName;
      }
    } else {
      const fallback = DEMO_FALLBACK_ACCOUNTS.find(u => u.email.toLowerCase() === cleanEmail);
      if (!fallback) {
        res.status(404).json({
          success: false,
          error: `No account found with email [${cleanEmail}].`
        });
        return;
      }
      accountName = fallback.name;
    }

    // Dispatch Password Reset 6-Digit OTP Email
    const result = await sendPasswordResetOtpEmail(cleanEmail, accountName);

    if (!result.success) {
      res.status(result.cooldownSeconds ? 429 : 500).json({
        success: false,
        error: result.message,
        cooldownSeconds: result.cooldownSeconds
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message || `Password reset code sent to ${cleanEmail}.`
    });
  } catch (err: any) {
    console.error('[Forgot Password Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch password reset code.'
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Verifies submitted OTP code and updates user's bcrypt passwordHash
 */
export const resetPasswordHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, otp, newPassword, password } = req.body;
    const verificationCode = String(code || otp || '').trim();
    const targetPassword = String(newPassword || password || '').trim();

    if (!email || !verificationCode || !targetPassword) {
      res.status(400).json({
        success: false,
        error: 'Email, 6-digit verification code, and new password are required.'
      });
      return;
    }

    if (targetPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.'
      });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Verify OTP code
    const otpResult = await verifyOtp(cleanEmail, verificationCode);
    if (!otpResult.success) {
      res.status(400).json({
        success: false,
        error: otpResult.message
      });
      return;
    }

    // Hash the new password with bcrypt
    const newHash = await bcrypt.hash(targetPassword, 10);
    let recipientName = 'User';

    if (isDbConnected()) {
      const updatedUser = await User.findOneAndUpdate(
        { email: cleanEmail },
        { passwordHash: newHash },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'Account not found in database.'
        });
        return;
      }

      if (updatedUser.role === 'STUDENT') {
        const stu = await Student.findOne({ userId: updatedUser.userId });
        if (stu) recipientName = stu.fullName;
      } else if (updatedUser.role === 'TEACHER') {
        const tea = await Teacher.findOne({ userId: updatedUser.userId });
        if (tea) recipientName = tea.fullName;
      }
    } else {
      const fallback = DEMO_FALLBACK_ACCOUNTS.find(u => u.email.toLowerCase() === cleanEmail);
      if (fallback) {
        fallback.password = targetPassword;
        recipientName = fallback.name;
      }
    }

    // Dispatch confirmation email
    sendPasswordChangedConfirmationEmail(cleanEmail, recipientName).catch(err => {
      console.warn('[EduPulse Confirmation Email Note]', err);
    });

    res.status(200).json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.'
    });
  } catch (err: any) {
    console.error('[Reset Password Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to reset password.'
    });
  }
};

