/**
 * EduPulse Admin & RBAC Controller (MongoDB + Mongoose)
 * Department of Computer Science & Engineering, Metropolitan University
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbac.middleware';
import { User, Student, Teacher, Department, Course, Semester } from '../models';
import { RBAC_PERMISSIONS_CATALOG } from '../config/rbac.matrix';
import { isDbConnected } from '../config/db';

/**
 * GET /api/admin/users/pending (ADMIN ONLY)
 */
export const getPendingUsersHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        totalPending: 1,
        databaseNotice: 'Live Atlas connection pending. Serving initial registry queue.',
        users: [
          {
            id: 'usr-pending-1',
            name: 'Tanvir Ahmed',
            email: 'tanvir.cse@gmail.com',
            role: 'STUDENT',
            status: 'PENDING',
            authProvider: 'GOOGLE',
            studentId: '241-115-300',
            department: 'CSE',
            batch: '60th Batch',
            section: 'Section A',
            createdAt: new Date().toISOString()
          }
        ]
      });
      return;
    }

    const pendingUsers = await User.find({ status: 'PENDING' }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      pendingUsers.map(async u => {
        let student = null;
        let teacher = null;

        if (u.role === 'STUDENT') {
          student = await Student.findOne({ userId: u.userId });
        } else if (u.role === 'TEACHER') {
          teacher = await Teacher.findOne({ userId: u.userId });
        }

        return {
          id: u.userId,
          name: student?.fullName || teacher?.fullName || u.email.split('@')[0],
          email: u.email,
          role: u.role,
          status: u.status,
          authProvider: u.authProvider,
          studentId: student?.rollNumber,
          employeeId: teacher?.employeeId,
          department: student?.departmentId || teacher?.departmentId || 'CSE',
          batch: student?.batch,
          section: 'Section A',
          createdAt: u.createdAt
        };
      })
    );

    res.status(200).json({
      success: true,
      totalPending: enriched.length,
      users: enriched
    });
  } catch (err: any) {
    console.error('[Get Pending Users Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch pending approval users'
    });
  }
};

/**
 * PATCH /api/admin/users/:id/approve (ADMIN ONLY)
 */
export const approveUserHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }

    user.status = 'APPROVED';
    user.rejectionReason = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account [${user.email}] successfully APPROVED by Academic Administrator.`,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    console.error('[Approve User Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to approve user'
    });
  }
};

/**
 * PATCH /api/admin/users/:id/reject (ADMIN ONLY)
 */
export const rejectUserHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }

    user.status = 'REJECTED';
    user.rejectionReason = reason || 'Incomplete institutional credential verification.';
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account [${user.email}] rejected.`,
      user: {
        id: user.userId,
        status: user.status,
        reason: user.rejectionReason
      }
    });
  } catch (err: any) {
    console.error('[Reject User Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to reject user'
    });
  }
};

/**
 * DELETE /api/admin/users/:id (ADMIN ONLY)
 */
export const deleteUserHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }

    await User.deleteOne({ userId: id });
    await Student.deleteOne({ userId: id });
    await Teacher.deleteOne({ userId: id });

    res.status(200).json({
      success: true,
      message: `Account [${user.email}] permanently deleted from MongoDB.`
    });
  } catch (err: any) {
    console.error('[Delete User Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete user'
    });
  }
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
export const getSystemHealthHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let deptCount = 3, courseCount = 3, studentCount = 1, teacherCount = 1, activeSemesterName = 'Spring 2026';
    if (isDbConnected()) {
      const [d, c, s, t, sem] = await Promise.all([
        Department.countDocuments(),
        Course.countDocuments(),
        Student.countDocuments(),
        Teacher.countDocuments(),
        Semester.findOne({ isActive: true })
      ]);
      deptCount = d;
      courseCount = c;
      studentCount = s;
      teacherCount = t;
      activeSemesterName = sem?.name || 'Spring 2026';
    }

    res.status(200).json({
      success: true,
      service: 'EduPulse MERN Academic API Server Engine',
      environment: process.env.NODE_ENV || 'development',
      database: {
        engine: 'MongoDB Atlas',
        odm: 'Mongoose',
        connected: isDbConnected(),
        status: isDbConnected() ? 'ONLINE' : 'PENDING_CONFIG_OR_WHITELIST'
      },
      academicMetrics: {
        departments: deptCount,
        courses: courseCount,
        students: studentCount,
        teachers: teacherCount,
        activeSemester: activeSemesterName
      },
      security: {
        authentication: 'Standard JWT (HS256)',
        passwordHashing: 'bcrypt (10 rounds)',
        authorization: 'RBAC (3 Roles, 10 Matrix Policies)',
        emailVerification: 'Nodemailer Gmail SMTP'
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[System Health Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve system health'
    });
  }
};
