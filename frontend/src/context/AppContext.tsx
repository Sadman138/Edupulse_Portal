import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  StudentCourseRecord,
  AttendanceRecord,
  AssignmentItem,
  NoticeItem,
  StudyMaterialItem,
  PreviousResultSubmission,
  CoCurricularActivity,
  ClassRoutineItem,
  AssessmentRecord,
  HighRiskAlert,
  DepartmentItem,
  SemesterItem,
  InstructorItem,
  StudentRegistryItem,
  CourseAllocationItem,
  QrAttendanceSession,
  StudentRosterItem,
  RegisteredUser
} from '../types';
import {
  DEMO_USERS,
  INITIAL_STUDENT_COURSES,
  INITIAL_ATTENDANCE_LOG,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTICES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_PREVIOUS_RESULTS,
  INITIAL_CO_CURRICULAR,
  INITIAL_ROUTINE,
  INITIAL_TEACHER_STUDENTS,
  INITIAL_ASSESSMENT_RECORDS,
  INITIAL_HIGH_RISK_ALERTS,
  INITIAL_DEPARTMENTS,
  INITIAL_SEMESTERS,
  INITIAL_INSTRUCTORS,
  INITIAL_ADMIN_COURSES,
  INITIAL_STUDENTS_REGISTRY,
  INITIAL_COURSE_ALLOCATIONS
} from '../data/mockData';
import { ThemeConfig, DEFAULT_THEME } from '../theme/epTheme';

interface AppContextType {
  // Auth & Role
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  pendingApprovalUser: RegisteredUser | null;
  clearPendingApproval: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string, reason?: string) => void;
  deleteUser: (userId: string) => void;
  setRegisteredUsers: (users: RegisteredUser[]) => void;
  login: (
    email: string,
    role?: UserRole,
    password?: string,
    customProfile?: Partial<UserProfile>
  ) => { success: boolean; error?: string; pending?: boolean };
  loginWithGoogle: (
    googleProfile: {
      name: string;
      email: string;
      avatarUrl?: string;
      role: UserRole;
      studentId?: string;
      employeeId?: string;
      department?: string;
    },
    isSignUp?: boolean
  ) => { success: boolean; error?: string; pending?: boolean };
  registerAccount: (accountData: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    studentId?: string;
    employeeId?: string;
    department?: string;
    authProvider: 'GOOGLE' | 'EMAIL';
  }) => { success: boolean; pending: boolean; error?: string };
  logout: () => void;
  registeredUsers: RegisteredUser[];

  // Active view navigation & RBAC Guards
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTabAllowedForRole: (tab: string, role: UserRole) => boolean;
  unauthorizedAttempt: { attemptedTab: string; userRole: UserRole } | null;
  clearUnauthorizedAttempt: () => void;

  // Theming
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;

  // Student State
  studentCourses: StudentCourseRecord[];
  attendanceLogs: AttendanceRecord[];
  assignments: AssignmentItem[];
  notices: NoticeItem[];
  studyMaterials: StudyMaterialItem[];
  previousResults: PreviousResultSubmission[];
  coCurricular: CoCurricularActivity[];
  routine: ClassRoutineItem[];

  // Student Actions
  submitAssignment: (assignmentId: string, fileName: string) => void;
  submitPreviousResult: (submission: Omit<PreviousResultSubmission, 'id' | 'submissionDate' | 'status'>) => void;
  addCoCurricular: (item: Omit<CoCurricularActivity, 'id' | 'status'>) => void;
  recordQrAttendance: (courseCode: string, token: string) => { success: boolean; message: string };

  // Teacher State & Actions
  teacherRoster: StudentRosterItem[];
  updateStudentAttendanceStatus: (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => void;
  qrSession: QrAttendanceSession | null;
  startQrSession: (courseCode: string, section: string, durationSeconds?: number) => void;
  stopQrSession: () => void;
  assessmentRecords: AssessmentRecord[];
  updateAssessmentRecord: (studentId: string, field: keyof AssessmentRecord, value: number) => void;
  bulkImportAssessments: (records: AssessmentRecord[]) => void;
  createAssignment: (assignment: Omit<AssignmentItem, 'id' | 'assignedDate' | 'status'>) => void;
  gradeAssignment: (assignmentId: string, score: number, feedback: string) => void;
  publishNotice: (notice: Omit<NoticeItem, 'id' | 'date'>) => void;
  uploadStudyMaterial: (material: Omit<StudyMaterialItem, 'id' | 'uploadDate' | 'downloadCount'>) => void;
  verifyResultSubmission: (submissionId: string, status: 'VERIFIED' | 'REJECTED', remarks: string) => void;
  highRiskAlerts: HighRiskAlert[];
  updateHighRiskStatus: (alertId: string, status: HighRiskAlert['status'], note: string) => void;

  // Admin State & Actions
  departments: DepartmentItem[];
  addDepartment: (dept: Omit<DepartmentItem, 'id'>) => void;
  bulkAddDepartments: (depts: Omit<DepartmentItem, 'id'>[]) => void;
  updateDepartment: (id: string, dept: Partial<DepartmentItem>) => void;
  deleteDepartment: (id: string) => void;

  semesters: SemesterItem[];
  addSemester: (sem: Omit<SemesterItem, 'id'>) => void;
  bulkAddSemesters: (sems: Omit<SemesterItem, 'id'>[]) => void;
  updateSemester: (id: string, sem: Partial<SemesterItem>) => void;
  deleteSemester: (id: string) => void;
  setActiveSemester: (id: string) => void;

  adminCourses: any[];
  addCourse: (course: any) => void;
  bulkAddCourses: (courses: any[]) => void;
  updateCourse: (id: string, course: any) => void;
  deleteCourse: (id: string) => void;

  instructors: InstructorItem[];
  addInstructor: (inst: Omit<InstructorItem, 'id'>) => void;
  bulkAddInstructors: (insts: Omit<InstructorItem, 'id'>[]) => void;
  updateInstructor: (id: string, inst: Partial<InstructorItem>) => void;
  deleteInstructor: (id: string) => void;

  studentsRegistry: StudentRegistryItem[];
  addStudentToRegistry: (student: Omit<StudentRegistryItem, 'id'>) => void;
  bulkAddStudents: (students: Omit<StudentRegistryItem, 'id'>[]) => void;
  updateStudentInRegistry: (id: string, student: Partial<StudentRegistryItem>) => void;
  deleteStudentFromRegistry: (id: string) => void;

  courseAllocations: CourseAllocationItem[];
  addCourseAllocation: (alloc: Omit<CourseAllocationItem, 'id'>) => void;
  bulkAddCourseAllocations: (allocs: Omit<CourseAllocationItem, 'id'>[]) => void;
  deleteCourseAllocation: (id: string) => void;

  // Modals & UI Controls
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isSwitchAccountModalOpen: boolean;
  setIsSwitchAccountModalOpen: (open: boolean) => void;
  pdfModalDoc: { title: string; category?: string; content?: string } | null;
  setPdfModalDoc: (doc: { title: string; category?: string; content?: string } | null) => void;
}

const ROLE_ALLOWED_TABS: Record<UserRole, string[]> = {
  STUDENT: [
    'dashboard',
    'academic-performance',
    'attendance',
    'qr-scanner',
    'class-routine',
    'syllabus-tracker',
    'assignments',
    'notices',
    'study-materials',
    'previous-results',
    'co-curricular'
  ],
  TEACHER: [
    'teacher-dashboard',
    'teacher-routine',
    'teacher-courses',
    'teacher-manual-attendance',
    'teacher-qr',
    'teacher-roster',
    'teacher-assessments',
    'teacher-assignments',
    'teacher-materials',
    'teacher-notices',
    'teacher-verifications',
    'teacher-risk-desk'
  ],
  ADMIN: [
    'admin-dashboard',
    'admin-approvals',
    'admin-departments',
    'admin-semesters',
    'admin-courses',
    'admin-instructors',
    'admin-students',
    'admin-allocations',
    'admin-database',
    'admin-week6-db'
  ]
};

const ROLE_DEFAULT_TAB: Record<UserRole, string> = {
  STUDENT: 'dashboard',
  TEACHER: 'teacher-dashboard',
  ADMIN: 'admin-dashboard'
};

const DEFAULT_REGISTERED_USERS: RegisteredUser[] = [
  // Demo Student Account (Pre-approved)
  {
    id: 'usr_demo_student',
    name: 'Fathin Sadman',
    email: 'student@metrouni.edu.bd',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'student123',
    studentId: '241-115-211',
    department: 'CSE',
    createdAt: '2026-10-10 09:15 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_demo_student_alias',
    name: 'Fathin Sadman',
    email: 'student@edupulse.edu',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'student123',
    studentId: '241-115-211',
    department: 'CSE',
    createdAt: '2026-10-10 09:15 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_g_student',
    name: 'Fathin Sadman',
    email: 'fathinanzumsadman@gmail.com',
    role: 'STUDENT',
    authProvider: 'GOOGLE',
    status: 'APPROVED',
    studentId: '241-115-211',
    department: 'CSE',
    createdAt: '2026-10-10 09:00 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  // Demo Teacher Account (Pre-approved)
  {
    id: 'usr_demo_teacher',
    name: 'Dr. Fahim Ahmed',
    email: 'teacher@metrouni.edu.bd',
    role: 'TEACHER',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'teacher123',
    employeeId: 'FAC-CSE-042',
    department: 'CSE',
    createdAt: '2026-10-09 11:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_demo_teacher_alias',
    name: 'Dr. Fahim Ahmed',
    email: 'teacher@edupulse.edu',
    role: 'TEACHER',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'teacher123',
    employeeId: 'FAC-CSE-042',
    department: 'CSE',
    createdAt: '2026-10-09 11:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_em_teacher_fahim',
    name: 'Dr. Fahim Ahmed',
    email: 'fahim.cse@metrouni.edu.bd',
    role: 'TEACHER',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'password123',
    employeeId: 'FAC-CSE-042',
    department: 'CSE',
    createdAt: '2026-10-09 11:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_g_teacher',
    name: 'Dr. Tariqul Islam',
    email: 'tariqul.islam@metrouni.edu.bd',
    role: 'TEACHER',
    authProvider: 'GOOGLE',
    status: 'APPROVED',
    employeeId: 'FAC-CSE-042',
    department: 'CSE',
    createdAt: '2026-10-09 11:30 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  // Demo Admin Account (Pre-approved)
  {
    id: 'usr_demo_admin',
    name: 'Prof. Dr. M. Rahman',
    email: 'admin@metrouni.edu.bd',
    role: 'ADMIN',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'admin123',
    employeeId: 'REG-ADMIN-01',
    department: 'ADMIN',
    createdAt: '2026-10-08 08:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_demo_admin_alias',
    name: 'Prof. Dr. M. Rahman',
    email: 'admin@edupulse.edu',
    role: 'ADMIN',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'admin123',
    employeeId: 'REG-ADMIN-01',
    department: 'ADMIN',
    createdAt: '2026-10-08 08:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_g_admin',
    name: 'Prof. Dr. M. Rahman',
    email: 'admin.office@metrouni.edu.bd',
    role: 'ADMIN',
    authProvider: 'GOOGLE',
    status: 'APPROVED',
    employeeId: 'REG-ADMIN-01',
    department: 'ADMIN',
    createdAt: '2026-10-08 08:30 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_em_admin',
    name: 'Prof. Dr. M. Rahman',
    email: 'admin.registrar@metrouni.edu.bd',
    role: 'ADMIN',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'password123',
    employeeId: 'REG-ADMIN-01',
    department: 'ADMIN',
    createdAt: '2026-10-08 08:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  // Pending Accounts for Testing Admin Approval
  {
    id: 'usr_pending_student',
    name: 'Tanvir Hasan',
    email: 'tanvir.cse@gmail.com',
    role: 'STUDENT',
    authProvider: 'GOOGLE',
    status: 'PENDING',
    studentId: '241-115-309',
    department: 'CSE',
    createdAt: '2026-10-15 10:20 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_pending_teacher',
    name: 'Farzana Yasmin',
    email: 'farzana.yasmin@metrouni.edu.bd',
    role: 'TEACHER',
    authProvider: 'EMAIL',
    status: 'PENDING',
    password: 'password123',
    employeeId: 'FAC-CSE-099',
    department: 'CSE',
    createdAt: '2026-10-15 11:45 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered accounts database
  const [registeredUsers, setRegisteredUsersState] = useState<RegisteredUser[]>(() => {
    try {
      const stored = localStorage.getItem('edupulse_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // ensure every user has a status
          return parsed.map((u: any) => ({
            ...u,
            status: u.status || 'APPROVED'
          }));
        }
      }
      return DEFAULT_REGISTERED_USERS;
    } catch {
      return DEFAULT_REGISTERED_USERS;
    }
  });

  const saveRegisteredUsers = (newUsers: RegisteredUser[]) => {
    setRegisteredUsersState(newUsers);
    localStorage.setItem('edupulse_registered_accounts', JSON.stringify(newUsers));
  };

  const setRegisteredUsers = (users: RegisteredUser[]) => {
    saveRegisteredUsers(users);
  };

  // Pending approval account tracking
  const [pendingApprovalUser, setPendingApprovalUserState] = useState<RegisteredUser | null>(() => {
    try {
      const stored = localStorage.getItem('edupulse_pending_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setPendingApprovalUser = (user: RegisteredUser | null) => {
    setPendingApprovalUserState(user);
    if (user) {
      localStorage.setItem('edupulse_pending_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edupulse_pending_user');
    }
  };

  const clearPendingApproval = () => {
    setPendingApprovalUser(null);
  };

  // Admin approval actions
  const approveUser = (userId: string) => {
    const updated = registeredUsers.map(u => (u.id === userId ? { ...u, status: 'APPROVED' as const } : u));
    saveRegisteredUsers(updated);
    if (pendingApprovalUser?.id === userId) {
      setPendingApprovalUser(null);
    }
  };

  const rejectUser = (userId: string, reason?: string) => {
    const updated = registeredUsers.map(u =>
      u.id === userId
        ? { ...u, status: 'REJECTED' as const, rejectionReason: reason || 'Application rejected by Admin.' }
        : u
    );
    saveRegisteredUsers(updated);
  };

  const deleteUser = (userId: string) => {
    const updated = registeredUsers.filter(u => u.id !== userId);
    saveRegisteredUsers(updated);
    if (pendingApprovalUser?.id === userId) {
      setPendingApprovalUser(null);
    }
  };

  // User Auth & Role with session persistence
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('edupulse_user');
      return savedUser ? JSON.parse(savedUser) : DEMO_USERS.student;
    } catch {
      return DEMO_USERS.student;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authFlag = localStorage.getItem('edupulse_auth');
    return authFlag !== null ? authFlag === 'true' : true;
  });

  const [activeTab, setActiveTabRaw] = useState<string>(() => {
    return ROLE_DEFAULT_TAB[currentUser.role] || 'dashboard';
  });

  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState<{ attemptedTab: string; userRole: UserRole } | null>(null);

  const clearUnauthorizedAttempt = () => setUnauthorizedAttempt(null);

  const isTabAllowedForRole = (tab: string, role: UserRole) => {
    return ROLE_ALLOWED_TABS[role]?.includes(tab) ?? false;
  };

  // Always keep activeTab within the authorized scope of currentUser.role
  useEffect(() => {
    if (!isTabAllowedForRole(activeTab, currentUser.role)) {
      setActiveTabRaw(ROLE_DEFAULT_TAB[currentUser.role] || 'dashboard');
    }
  }, [currentUser.role]);

  const setActiveTab = (tab: string) => {
    if (!isTabAllowedForRole(tab, currentUser.role)) {
      setUnauthorizedAttempt({ attemptedTab: tab, userRole: currentUser.role });
      return;
    }
    setUnauthorizedAttempt(null);
    setActiveTabRaw(tab);
  };

  // Strict role switch: enforces legitimate login for the role
  const switchRole = (role: UserRole) => {
    const matchingUser = registeredUsers.find(u => u.role === role && u.status === 'APPROVED');
    if (matchingUser) {
      login(matchingUser.email, role);
    }
  };

  const login = (
    email: string,
    role?: UserRole,
    password?: string,
    customProfile?: Partial<UserProfile>
  ): { success: boolean; error?: string; pending?: boolean } => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);

    // 1. Unregistered email check
    if (!existing) {
      return {
        success: false,
        error: 'Unregistered email! No account exists with this email address. Please create an account first.'
      };
    }

    // 2. Password check for email accounts
    if (existing.authProvider === 'EMAIL' && existing.password && password) {
      const isDemoMatch =
        existing.password === password ||
        (existing.role === 'STUDENT' && (password === 'student123' || password === 'password123')) ||
        (existing.role === 'TEACHER' && (password === 'teacher123' || password === 'password123')) ||
        (existing.role === 'ADMIN' && (password === 'admin123' || password === 'password123'));

      if (!isDemoMatch) {
        return {
          success: false,
          error: 'Incorrect password! Please check your credentials and try again.'
        };
      }
    }

    // 3. Role mismatch check
    if (role && existing.role !== role) {
      return {
        success: false,
        error: `Role mismatch! This account is registered as ${existing.role}, not ${role}. Access to this portal is unauthorized.`
      };
    }

    // 4. Admin approval check
    if (existing.status === 'PENDING') {
      setPendingApprovalUser(existing);
      setIsAuthenticated(false);
      localStorage.removeItem('edupulse_auth');
      return {
        success: false,
        pending: true,
        error: 'Account pending administrator approval. Access will be enabled once verified by the Registrar.'
      };
    }

    if (existing.status === 'REJECTED') {
      return {
        success: false,
        error: `Account registration was rejected by Administrator. Reason: ${existing.rejectionReason || 'Contact registrar office.'}`
      };
    }

    // 5. Approved user login
    const effectiveRole = existing.role;
    const baseProfile = DEMO_USERS[effectiveRole.toLowerCase() as keyof typeof DEMO_USERS] || DEMO_USERS.student;
    const finalProfile: UserProfile = {
      ...baseProfile,
      id: existing.id,
      name: existing.name || customProfile?.name || baseProfile.name,
      email: existing.email,
      role: effectiveRole,
      status: 'APPROVED',
      authProvider: existing.authProvider,
      studentId: existing.studentId || (effectiveRole === 'STUDENT' ? baseProfile.studentId : undefined),
      employeeId: existing.employeeId || (effectiveRole !== 'STUDENT' ? baseProfile.employeeId : undefined),
      department: existing.department || baseProfile.department,
      avatarUrl: existing.avatarUrl || customProfile?.avatarUrl || baseProfile.avatarUrl,
      ...(customProfile || {})
    };

    setCurrentUser(finalProfile);
    setIsAuthenticated(true);
    setPendingApprovalUser(null);
    setUnauthorizedAttempt(null);
    const targetTab = ROLE_DEFAULT_TAB[effectiveRole] || 'dashboard';
    setActiveTabRaw(targetTab);
    localStorage.setItem('edupulse_user', JSON.stringify(finalProfile));
    localStorage.setItem('edupulse_auth', 'true');
    return { success: true };
  };

  const loginWithGoogle = (
    googleProfile: {
      name: string;
      email: string;
      avatarUrl?: string;
      role: UserRole;
      studentId?: string;
      employeeId?: string;
      department?: string;
    },
    isSignUp?: boolean
  ): { success: boolean; error?: string; pending?: boolean } => {
    const cleanEmail = googleProfile.email.trim().toLowerCase();
    const existing = registeredUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.status === 'PENDING') {
        setPendingApprovalUser(existing);
        setIsAuthenticated(false);
        localStorage.removeItem('edupulse_auth');
        return {
          success: false,
          pending: true,
          error: 'Your Google account is registered but awaiting Administrator approval.'
        };
      }
      if (existing.status === 'REJECTED') {
        return {
          success: false,
          error: `Google account registration was rejected by Administrator. Reason: ${existing.rejectionReason || 'Contact registrar.'}`
        };
      }
      // Approved existing user!
      return login(existing.email, existing.role);
    }

    // User is NOT in registeredUsers
    if (!isSignUp) {
      return {
        success: false,
        error: 'Google account is not registered! Please switch to Create Account with Google to submit an access request for Administrator approval.'
      };
    }

    // Sign Up with Google: Creates PENDING user
    const newUser: RegisteredUser = {
      id: `usr_g_${Date.now()}`,
      name: googleProfile.name,
      email: googleProfile.email,
      role: googleProfile.role,
      authProvider: 'GOOGLE',
      status: 'PENDING',
      studentId: googleProfile.studentId || (googleProfile.role === 'STUDENT' ? '241-115-211' : undefined),
      employeeId:
        googleProfile.employeeId ||
        (googleProfile.role !== 'STUDENT' ? (googleProfile.role === 'TEACHER' ? 'FAC-CSE-042' : 'REG-ADMIN-01') : undefined),
      department: googleProfile.department || 'CSE',
      createdAt: new Date().toLocaleString(),
      avatarUrl:
        googleProfile.avatarUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleProfile.name)}`
    };

    saveRegisteredUsers([...registeredUsers, newUser]);
    setPendingApprovalUser(newUser);
    setIsAuthenticated(false);
    localStorage.removeItem('edupulse_auth');
    return {
      success: false,
      pending: true,
      error: 'Google account registered successfully! It is now pending Administrator approval before access is granted.'
    };
  };

  const registerAccount = (accountData: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    studentId?: string;
    employeeId?: string;
    department?: string;
    authProvider: 'GOOGLE' | 'EMAIL';
  }): { success: boolean; pending: boolean; error?: string } => {
    const cleanEmail = accountData.email.trim().toLowerCase();
    const existingIdx = registeredUsers.findIndex(u => u.email.trim().toLowerCase() === cleanEmail);

    const newUser: RegisteredUser = {
      id: existingIdx >= 0 ? registeredUsers[existingIdx].id : `usr_${Date.now()}`,
      name: accountData.name,
      email: accountData.email,
      role: accountData.role,
      authProvider: accountData.authProvider,
      status: 'PENDING',
      password: accountData.password || 'password123',
      studentId: accountData.role === 'STUDENT' ? accountData.studentId || '241-115-211' : undefined,
      employeeId:
        accountData.role !== 'STUDENT'
          ? accountData.employeeId || (accountData.role === 'TEACHER' ? 'FAC-CSE-042' : 'REG-ADMIN-01')
          : undefined,
      department: accountData.department || 'CSE',
      createdAt: new Date().toLocaleString(),
      avatarUrl:
        accountData.authProvider === 'GOOGLE'
          ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(accountData.name)}`
          : undefined
    };

    if (existingIdx >= 0) {
      const updated = [...registeredUsers];
      updated[existingIdx] = newUser;
      saveRegisteredUsers(updated);
    } else {
      saveRegisteredUsers([...registeredUsers, newUser]);
    }

    setPendingApprovalUser(newUser);
    setIsAuthenticated(false);
    localStorage.removeItem('edupulse_auth');
    return {
      success: false,
      pending: true,
      error: 'Account submitted successfully and is awaiting Administrator approval.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUnauthorizedAttempt(null);
    localStorage.removeItem('edupulse_auth');
  };

  // Theme State
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('edupulse_theme');
      return saved ? JSON.parse(saved) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prev => {
      const updated = { ...prev, ...newTheme };
      localStorage.setItem('edupulse_theme', JSON.stringify(updated));
      return updated;
    });
  };

  // UI Modals
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSwitchAccountModalOpen, setIsSwitchAccountModalOpen] = useState(false);
  const [pdfModalDoc, setPdfModalDoc] = useState<{ title: string; category?: string; content?: string } | null>(null);

  // Student State
  const [studentCourses] = useState<StudentCourseRecord[]>(INITIAL_STUDENT_COURSES);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_LOG);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialItem[]>(INITIAL_STUDY_MATERIALS);
  const [previousResults, setPreviousResults] = useState<PreviousResultSubmission[]>(INITIAL_PREVIOUS_RESULTS);
  const [coCurricular, setCoCurricular] = useState<CoCurricularActivity[]>(INITIAL_CO_CURRICULAR);
  const [routine] = useState<ClassRoutineItem[]>(INITIAL_ROUTINE);

  // Student Actions
  const submitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'SUBMITTED',
              submissionDate: new Date().toISOString().split('T')[0],
              submittedFileName: fileName
            }
          : a
      )
    );
  };

  const submitPreviousResult = (submission: Omit<PreviousResultSubmission, 'id' | 'submissionDate' | 'status'>) => {
    const newSub: PreviousResultSubmission = {
      ...submission,
      id: `pr-${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    setPreviousResults(prev => [newSub, ...prev]);
  };

  const addCoCurricular = (item: Omit<CoCurricularActivity, 'id' | 'status'>) => {
    const newItem: CoCurricularActivity = {
      ...item,
      id: `cc-${Date.now()}`,
      status: 'ACTIVE'
    };
    setCoCurricular(prev => [newItem, ...prev]);
  };

  const recordQrAttendance = (courseCode: string, token: string) => {
    if (!token || token.trim().length < 4) {
      return { success: false, message: 'Invalid or expired QR Attendance token.' };
    }
    const targetCourse = studentCourses.find(c => c.courseCode.toLowerCase() === courseCode.toLowerCase()) || studentCourses[0];
    const newLog: AttendanceRecord = {
      id: `att-${Date.now()}`,
      courseCode: targetCourse.courseCode,
      courseTitle: targetCourse.courseTitle,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Current Session',
      room: 'Academic Block 3 - Room 402',
      status: 'PRESENT',
      verifiedVia: 'DYNAMIC_QR',
      tokenUsed: token
    };
    setAttendanceLogs(prev => [newLog, ...prev]);
    return { success: true, message: `Successfully verified attendance for ${targetCourse.courseCode} via Dynamic QR!` };
  };

  // Week 5 Teacher State & Actions
  const [teacherRoster, setTeacherRoster] = useState<StudentRosterItem[]>(INITIAL_TEACHER_STUDENTS);
  const [assessmentRecords, setAssessmentRecords] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENT_RECORDS);
  const [highRiskAlerts, setHighRiskAlerts] = useState<HighRiskAlert[]>(INITIAL_HIGH_RISK_ALERTS);
  const [qrSession, setQrSession] = useState<QrAttendanceSession | null>(null);

  const updateStudentAttendanceStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setTeacherRoster(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, attendanceStatus: status } : s))
    );
  };

  const startQrSession = (courseCode: string, section: string, durationSeconds = 60) => {
    const token = `EP-${courseCode.replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`;
    setQrSession({
      sessionId: `ses-${Date.now()}`,
      courseCode,
      courseTitle: 'Database Management Systems',
      section,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresInSeconds: durationSeconds,
      qrPayload: `EDUPULSE:SESSION:${token}:CSE:2026`,
      totalEnrolled: teacherRoster.length,
      checkedInCount: teacherRoster.filter(s => s.attendanceStatus === 'PRESENT').length,
      isActive: true
    });
  };

  const stopQrSession = () => {
    setQrSession(null);
  };

  const updateAssessmentRecord = (studentId: string, field: keyof AssessmentRecord, value: number) => {
    setAssessmentRecords(prev =>
      prev.map(rec => {
        if (rec.studentId !== studentId) return rec;
        const updated = { ...rec, [field]: value };
        const total = (updated.quiz1 || 0) + (updated.quiz2 || 0) + (updated.midterm || 0) + (updated.assignment || 0) + (updated.finalExam || 0);
        let letterGrade = 'F';
        let gpa = 0.0;
        if (total >= 80) { letterGrade = 'A+'; gpa = 4.0; }
        else if (total >= 75) { letterGrade = 'A'; gpa = 3.75; }
        else if (total >= 70) { letterGrade = 'A-'; gpa = 3.50; }
        else if (total >= 65) { letterGrade = 'B+'; gpa = 3.25; }
        else if (total >= 60) { letterGrade = 'B'; gpa = 3.00; }
        else if (total >= 55) { letterGrade = 'B-'; gpa = 2.75; }
        else if (total >= 50) { letterGrade = 'C+'; gpa = 2.50; }
        else if (total >= 45) { letterGrade = 'C'; gpa = 2.25; }
        else if (total >= 40) { letterGrade = 'D'; gpa = 2.00; }
        return {
          ...updated,
          total,
          letterGrade,
          gpa
        };
      })
    );
  };

  const bulkImportAssessments = (records: AssessmentRecord[]) => {
    setAssessmentRecords(records);
  };

  const createAssignment = (assignment: Omit<AssignmentItem, 'id' | 'assignedDate' | 'status'>) => {
    const newAsg: AssignmentItem = {
      ...assignment,
      id: `asg-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    setAssignments(prev => [newAsg, ...prev]);
  };

  const gradeAssignment = (assignmentId: string, score: number, feedback: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'GRADED',
              obtainedScore: score,
              facultyFeedback: feedback
            }
          : a
      )
    );
  };

  const publishNotice = (notice: Omit<NoticeItem, 'id' | 'date'>) => {
    const newNot: NoticeItem = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNot, ...prev]);
  };

  const uploadStudyMaterial = (material: Omit<StudyMaterialItem, 'id' | 'uploadDate' | 'downloadCount'>) => {
    const newSm: StudyMaterialItem = {
      ...material,
      id: `sm-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0
    };
    setStudyMaterials(prev => [newSm, ...prev]);
  };

  const verifyResultSubmission = (submissionId: string, status: 'VERIFIED' | 'REJECTED', remarks: string) => {
    setPreviousResults(prev =>
      prev.map(pr =>
        pr.id === submissionId
          ? {
              ...pr,
              status,
              remarks,
              verifiedBy: currentUser.name,
              verificationDate: new Date().toISOString().split('T')[0]
            }
          : pr
      )
    );
  };

  const updateHighRiskStatus = (alertId: string, status: HighRiskAlert['status'], note: string) => {
    setHighRiskAlerts(prev =>
      prev.map(h =>
        h.id === alertId
          ? {
              ...h,
              status,
              interventionHistory: [
                ...h.interventionHistory,
                {
                  date: new Date().toISOString().split('T')[0],
                  action: status.replace(/_/g, ' '),
                  note,
                  by: currentUser.name
                }
              ]
            }
          : h
      )
    );
  };

  // Week 5 Admin State & CRUD Actions
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [semesters, setSemesters] = useState<SemesterItem[]>(INITIAL_SEMESTERS);
  const [adminCourses, setAdminCourses] = useState<any[]>(INITIAL_ADMIN_COURSES);
  const [instructors, setInstructors] = useState<InstructorItem[]>(INITIAL_INSTRUCTORS);
  const [studentsRegistry, setStudentsRegistry] = useState<StudentRegistryItem[]>(INITIAL_STUDENTS_REGISTRY);
  const [courseAllocations, setCourseAllocations] = useState<CourseAllocationItem[]>(INITIAL_COURSE_ALLOCATIONS);

  const addDepartment = (dept: Omit<DepartmentItem, 'id'>) => {
    const newD: DepartmentItem = { ...dept, id: `dept-${Date.now()}` };
    setDepartments(prev => [...prev, newD]);
  };
  const bulkAddDepartments = (depts: Omit<DepartmentItem, 'id'>[]) => {
    const newItems = depts.map((d, i) => ({ ...d, id: `dept-${Date.now()}-${i}` }));
    setDepartments(prev => [...prev, ...newItems]);
  };
  const updateDepartment = (id: string, dept: Partial<DepartmentItem>) => {
    setDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...dept } : d)));
  };
  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const addSemester = (sem: Omit<SemesterItem, 'id'>) => {
    const newS: SemesterItem = { ...sem, id: `sem-${Date.now()}` };
    setSemesters(prev => [...prev, newS]);
  };
  const bulkAddSemesters = (sems: Omit<SemesterItem, 'id'>[]) => {
    const newItems = sems.map((s, i) => ({ ...s, id: `sem-${Date.now()}-${i}` }));
    setSemesters(prev => [...prev, ...newItems]);
  };
  const updateSemester = (id: string, sem: Partial<SemesterItem>) => {
    setSemesters(prev => prev.map(s => (s.id === id ? { ...s, ...sem } : s)));
  };
  const deleteSemester = (id: string) => {
    setSemesters(prev => prev.filter(s => s.id !== id));
  };
  const setActiveSemester = (id: string) => {
    setSemesters(prev => prev.map(s => ({ ...s, isActive: s.id === id })));
  };

  const addCourse = (course: any) => {
    const newC = { ...course, id: `crs-${Date.now()}` };
    setAdminCourses(prev => [...prev, newC]);
  };
  const bulkAddCourses = (courses: any[]) => {
    const newItems = courses.map((c, i) => ({ ...c, id: `crs-${Date.now()}-${i}` }));
    setAdminCourses(prev => [...prev, ...newItems]);
  };
  const updateCourse = (id: string, course: any) => {
    setAdminCourses(prev => prev.map(c => (c.id === id ? { ...c, ...course } : c)));
  };
  const deleteCourse = (id: string) => {
    setAdminCourses(prev => prev.filter(c => c.id !== id));
  };

  const addInstructor = (inst: Omit<InstructorItem, 'id'>) => {
    const newI: InstructorItem = { ...inst, id: `inst-${Date.now()}` };
    setInstructors(prev => [...prev, newI]);
  };
  const bulkAddInstructors = (insts: Omit<InstructorItem, 'id'>[]) => {
    const newItems = insts.map((inst, i) => ({ ...inst, id: `inst-${Date.now()}-${i}` }));
    setInstructors(prev => [...prev, ...newItems]);
  };
  const updateInstructor = (id: string, inst: Partial<InstructorItem>) => {
    setInstructors(prev => prev.map(i => (i.id === id ? { ...i, ...inst } : i)));
  };
  const deleteInstructor = (id: string) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
  };

  const addStudentToRegistry = (student: Omit<StudentRegistryItem, 'id'>) => {
    const newS: StudentRegistryItem = { ...student, id: `reg-${Date.now()}` };
    setStudentsRegistry(prev => [...prev, newS]);
  };
  const bulkAddStudents = (students: Omit<StudentRegistryItem, 'id'>[]) => {
    const newItems = students.map((s, i) => ({ ...s, id: `reg-${Date.now()}-${i}` }));
    setStudentsRegistry(prev => [...prev, ...newItems]);
  };
  const updateStudentInRegistry = (id: string, student: Partial<StudentRegistryItem>) => {
    setStudentsRegistry(prev => prev.map(s => (s.id === id ? { ...s, ...student } : s)));
  };
  const deleteStudentFromRegistry = (id: string) => {
    setStudentsRegistry(prev => prev.filter(s => s.id !== id));
  };

  const addCourseAllocation = (alloc: Omit<CourseAllocationItem, 'id'>) => {
    const newA: CourseAllocationItem = { ...alloc, id: `alc-${Date.now()}` };
    setCourseAllocations(prev => [...prev, newA]);
  };
  const bulkAddCourseAllocations = (allocs: Omit<CourseAllocationItem, 'id'>[]) => {
    const newItems = allocs.map((a, i) => ({ ...a, id: `alc-${Date.now()}-${i}` }));
    setCourseAllocations(prev => [...prev, ...newItems]);
  };
  const deleteCourseAllocation = (id: string) => {
    setCourseAllocations(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        isAuthenticated,
        pendingApprovalUser,
        clearPendingApproval,
        approveUser,
        rejectUser,
        deleteUser,
        setRegisteredUsers,
        login,
        loginWithGoogle,
        registerAccount,
        logout,
        registeredUsers,
        activeTab,
        setActiveTab,
        isTabAllowedForRole,
        unauthorizedAttempt,
        clearUnauthorizedAttempt,
        theme,
        updateTheme,
        studentCourses,
        attendanceLogs,
        assignments,
        notices,
        studyMaterials,
        previousResults,
        coCurricular,
        routine,
        submitAssignment,
        submitPreviousResult,
        addCoCurricular,
        recordQrAttendance,
        teacherRoster,
        updateStudentAttendanceStatus,
        qrSession,
        startQrSession,
        stopQrSession,
        assessmentRecords,
        updateAssessmentRecord,
        bulkImportAssessments,
        createAssignment,
        gradeAssignment,
        publishNotice,
        uploadStudyMaterial,
        verifyResultSubmission,
        highRiskAlerts,
        updateHighRiskStatus,
        departments,
        addDepartment,
        bulkAddDepartments,
        updateDepartment,
        deleteDepartment,
        semesters,
        addSemester,
        bulkAddSemesters,
        updateSemester,
        deleteSemester,
        setActiveSemester,
        adminCourses,
        addCourse,
        bulkAddCourses,
        updateCourse,
        deleteCourse,
        instructors,
        addInstructor,
        bulkAddInstructors,
        updateInstructor,
        deleteInstructor,
        studentsRegistry,
        addStudentToRegistry,
        bulkAddStudents,
        updateStudentInRegistry,
        deleteStudentFromRegistry,
        courseAllocations,
        addCourseAllocation,
        bulkAddCourseAllocations,
        deleteCourseAllocation,
        isThemeModalOpen,
        setIsThemeModalOpen,
        isSwitchAccountModalOpen,
        setIsSwitchAccountModalOpen,
        pdfModalDoc,
        setPdfModalDoc
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
