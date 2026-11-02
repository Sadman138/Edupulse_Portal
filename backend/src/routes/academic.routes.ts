/**
 * EduPulse Academic Catalog Routes
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticateToken, authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticateToken);

// Departments Catalog
router.get('/departments', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', head: 'Prof. Dr. M. Rahman', activeStudents: 540 },
      { id: 'EEE', name: 'Electrical & Electronic Engineering', code: 'EEE', head: 'Dr. K. Alam', activeStudents: 310 },
      { id: 'BBA', name: 'Business Administration', code: 'BBA', head: 'Dr. S. Parveen', activeStudents: 420 },
      { id: 'ENG', name: 'Department of English', code: 'ENG', head: 'Dr. T. Haque', activeStudents: 220 }
    ]
  });
});

// Semesters Catalog
router.get('/semesters', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 'SEM-AUTUMN-2026', title: 'Autumn 2026 (Active)', year: 2026, status: 'ACTIVE' },
      { id: 'SEM-SPRING-2026', title: 'Spring 2026', year: 2026, status: 'COMPLETED' },
      { id: 'SEM-SUMMER-2026', title: 'Summer 2026', year: 2026, status: 'COMPLETED' }
    ]
  });
});

// Courses Catalog
router.get('/courses', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: [
      { code: 'CSE-311', title: 'Database Management Systems', credits: 3.0, type: 'THEORY', dept: 'CSE' },
      { code: 'CSE-312', title: 'Database Systems Lab', credits: 1.5, type: 'LAB', dept: 'CSE' },
      { code: 'CSE-323', title: 'Operating Systems & System Programming', credits: 3.0, type: 'THEORY', dept: 'CSE' },
      { code: 'CSE-324', title: 'Operating Systems Lab', credits: 1.5, type: 'LAB', dept: 'CSE' },
      { code: 'CSE-331', title: 'Software Engineering & Information Systems', credits: 3.0, type: 'THEORY', dept: 'CSE' }
    ]
  });
});

// Teacher Only Route (RBAC Test)
router.get('/teacher/roster', authorizeRoles('TEACHER', 'ADMIN'), (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    requestedBy: req.user?.name,
    teacherRole: req.user?.role,
    courseCode: 'CSE-311',
    enrolledCount: 42,
    message: 'Teacher course roster accessed successfully.'
  });
});

// Student Only Route (RBAC Test)
router.get('/student/grades', authorizeRoles('STUDENT', 'ADMIN'), (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    requestedBy: req.user?.name,
    studentRole: req.user?.role,
    currentSgpa: 3.82,
    currentCgpa: 3.76,
    creditsCompleted: 78.5,
    message: 'Student academic performance records accessed successfully.'
  });
});

export default router;
