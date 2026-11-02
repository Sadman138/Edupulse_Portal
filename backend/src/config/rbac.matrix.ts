/**
 * EduPulse — Role-Based Access Control (RBAC) Permission Matrix
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface PermissionDefinition {
  id: string;
  name: string;
  category: 'AUTHENTICATION' | 'STUDENT_PORTAL' | 'TEACHER_CONSOLE' | 'ADMIN_CONTROL' | 'SECURITY_AUDIT';
  description: string;
  allowedRoles: UserRole[];
}

export const RBAC_PERMISSIONS_CATALOG: PermissionDefinition[] = [
  // Authentication & Profile
  {
    id: 'AUTH_LOGIN',
    name: 'User Authentication',
    category: 'AUTHENTICATION',
    description: 'Log in using Google OAuth or institutional email/password.',
    allowedRoles: ['STUDENT', 'TEACHER', 'ADMIN']
  },
  {
    id: 'AUTH_VERIFY_OTP',
    name: 'Email OTP Verification',
    category: 'AUTHENTICATION',
    description: 'Verify 6-digit cryptographic security code dispatched to Gmail.',
    allowedRoles: ['STUDENT', 'TEACHER', 'ADMIN']
  },
  {
    id: 'AUTH_PROFILE_VIEW',
    name: 'View Personal Profile',
    category: 'AUTHENTICATION',
    description: 'Access authenticated profile details and role tokens.',
    allowedRoles: ['STUDENT', 'TEACHER', 'ADMIN']
  },

  // Student Portal Permissions
  {
    id: 'STUDENT_DASHBOARD_VIEW',
    name: 'Student Dashboard Access',
    category: 'STUDENT_PORTAL',
    description: 'View personal CGPA, SGPA, credits, and critical course warnings.',
    allowedRoles: ['STUDENT']
  },
  {
    id: 'STUDENT_ATTENDANCE_VIEW',
    name: 'View Personal Attendance',
    category: 'STUDENT_PORTAL',
    description: 'View class attendance percentage and color-coded eligibility logs.',
    allowedRoles: ['STUDENT']
  },
  {
    id: 'STUDENT_QR_SCAN',
    name: 'Scan Dynamic QR Attendance',
    category: 'STUDENT_PORTAL',
    description: 'Scan teacher generated dynamic rotating QR token to record attendance.',
    allowedRoles: ['STUDENT']
  },
  {
    id: 'STUDENT_ASSIGNMENT_SUBMIT',
    name: 'Submit Course Deliverable',
    category: 'STUDENT_PORTAL',
    description: 'Upload homework and assignments before deadline.',
    allowedRoles: ['STUDENT']
  },
  {
    id: 'STUDENT_RETRO_RESULT_SUBMIT',
    name: 'Submit Previous Term Results',
    category: 'STUDENT_PORTAL',
    description: 'Claim retake/improvement course grades with grade sheet slip.',
    allowedRoles: ['STUDENT']
  },
  {
    id: 'STUDENT_NOTICE_VIEW',
    name: 'View Official Notices',
    category: 'STUDENT_PORTAL',
    description: 'Read department notices and preview signed PDF circulars.',
    allowedRoles: ['STUDENT', 'TEACHER', 'ADMIN']
  },
  {
    id: 'STUDENT_STUDY_MATERIAL_DOWNLOAD',
    name: 'Download Study Materials',
    category: 'STUDENT_PORTAL',
    description: 'Download faculty-uploaded lecture slides and syllabus notes.',
    allowedRoles: ['STUDENT', 'TEACHER']
  },

  // Teacher Console Permissions
  {
    id: 'TEACHER_DASHBOARD_VIEW',
    name: 'Teacher Dashboard Access',
    category: 'TEACHER_CONSOLE',
    description: 'Access assigned courses roster, teaching load, and high-risk flags.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_QR_GENERATE',
    name: 'Generate Dynamic QR Attendance',
    category: 'TEACHER_CONSOLE',
    description: 'Create time-expiring (60s) cryptographic dynamic QR sessions.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_MANUAL_ATTENDANCE',
    name: 'Override Class Attendance',
    category: 'TEACHER_CONSOLE',
    description: 'Manually mark Present, Absent, or Late in continuous roster.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_MARKS_ENTRY',
    name: 'Continuous Assessment Grading',
    category: 'TEACHER_CONSOLE',
    description: 'Input and recalculate attendance, quiz, mid, and final exam marks.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_MARKS_BULK_CSV',
    name: 'Bulk CSV Marks Import/Export',
    category: 'TEACHER_CONSOLE',
    description: 'Import continuous assessment marks ledger from CSV spreadsheet.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_ASSIGNMENT_CREATE',
    name: 'Publish Assignment Task',
    category: 'TEACHER_CONSOLE',
    description: 'Create assignments with deadline, maximum marks, and guidelines.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_ASSIGNMENT_GRADE',
    name: 'Evaluate Assignment Submissions',
    category: 'TEACHER_CONSOLE',
    description: 'Score student submissions and attach rubric feedback comments.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_RETRO_RESULT_VERIFY',
    name: 'Verify Improvement Result Claims',
    category: 'TEACHER_CONSOLE',
    description: 'Review student retake submissions and verify against transcript slips.',
    allowedRoles: ['TEACHER']
  },
  {
    id: 'TEACHER_EARLY_WARNING_ACTION',
    name: 'Counsel High-Risk Students',
    category: 'TEACHER_CONSOLE',
    description: 'Trigger academic counseling alerts for students with marks < 40% or att < 75%.',
    allowedRoles: ['TEACHER']
  },

  // Administrator Control Permissions
  {
    id: 'ADMIN_DASHBOARD_VIEW',
    name: 'Institutional KPI Dashboard',
    category: 'ADMIN_CONTROL',
    description: 'Monitor university-wide KPIs, pass rates, risk telemetry, and audit logs.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_USER_APPROVAL_MANAGE',
    name: 'Account Approval Desk',
    category: 'ADMIN_CONTROL',
    description: 'Approve, reject, or terminate self-registered and Google sign-up accounts.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_DEPARTMENTS_CRUD',
    name: 'Departments Catalog CRUD',
    category: 'ADMIN_CONTROL',
    description: 'Create, update, bulk import, and decommission academic departments.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_SEMESTERS_CRUD',
    name: 'Semesters / Sessions CRUD',
    category: 'ADMIN_CONTROL',
    description: 'Configure active academic calendar terms and session boundaries.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_COURSES_CRUD',
    name: 'Course Curriculum Catalog CRUD',
    category: 'ADMIN_CONTROL',
    description: 'Add courses with credit weightings, theory/lab types, and prerequisites.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_INSTRUCTORS_CRUD',
    name: 'Faculty Registry CRUD',
    category: 'ADMIN_CONTROL',
    description: 'Manage instructor profiles, designations, and departmental postings.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_STUDENTS_CRUD',
    name: 'Student Body Registry CRUD',
    category: 'ADMIN_CONTROL',
    description: 'Manage enrolled student records, ID allocations, and registration states.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_TIMETABLE_ALLOCATION',
    name: 'Course & Faculty Timetable Allocation',
    category: 'ADMIN_CONTROL',
    description: 'Assign courses to instructors and schedule slots with collision prevention.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'ADMIN_DATABASE_STUDIO_ACCESS',
    name: 'Database Schema & Query Studio',
    category: 'ADMIN_CONTROL',
    description: 'Inspect 3NF ERD models, execute DDL scripts, and run SQL audit sandboxes.',
    allowedRoles: ['ADMIN']
  },

  // Security & Audit
  {
    id: 'SECURITY_RBAC_INSPECT',
    name: 'RBAC Policy & JWT Audit',
    category: 'SECURITY_AUDIT',
    description: 'Audit active token claims, scope permissions, and security violations.',
    allowedRoles: ['ADMIN']
  },
  {
    id: 'SECURITY_API_STUDIO',
    name: 'Backend REST API Explorer',
    category: 'SECURITY_AUDIT',
    description: 'Test Express backend endpoints with custom Bearer tokens and payloads.',
    allowedRoles: ['ADMIN']
  }
];

export const checkPermission = (role: UserRole, permissionId: string): boolean => {
  const perm = RBAC_PERMISSIONS_CATALOG.find(p => p.id === permissionId);
  if (!perm) return false;
  return perm.allowedRoles.includes(role);
};
