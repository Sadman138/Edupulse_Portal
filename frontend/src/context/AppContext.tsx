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
  RegisteredUser,
  SyllabusChapter,
  SyllabusTopic,
  SyllabusTopicStatus,
  UpcomingExamItem
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
  INITIAL_COURSE_ALLOCATIONS,
  INITIAL_SYLLABUS_CHAPTERS,
  INITIAL_UPCOMING_EXAMINATIONS
} from '../data/mockData';
import { ThemeConfig, DEFAULT_THEME, getThemeBackground, getThemeById, EDU_PULSE_THEMES, EduPulseTheme } from '../theme/epTheme';
import { authApi, adminApi } from '../services/api';

export type AuthStatus = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

interface AppContextType {
  // Auth & Role
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  authStatus: AuthStatus;
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
  ) => Promise<{ success: boolean; error?: string; pending?: boolean }>;
  loginWithGoogle: (
    googleProfile: {
      name: string;
      email: string;
      avatarUrl?: string;
      role: UserRole;
      studentId?: string;
      batch?: string;
      section?: string;
      employeeId?: string;
      department?: string;
    },
    isSignUp?: boolean
  ) => Promise<{ success: boolean; error?: string; pending?: boolean }>;
  registerAccount: (accountData: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    studentId?: string;
    batch?: string;
    section?: string;
    employeeId?: string;
    department?: string;
    authProvider: 'GOOGLE' | 'EMAIL';
  }) => { success: boolean; pending: boolean; error?: string };
  resetUserPassword: (email: string, newPassword: string) => void;
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
  submitAssignment: (assignmentId: string, fileName: string, pdfDataUrl?: string) => void;
  submitPreviousResult: (submission: Omit<PreviousResultSubmission, 'id' | 'submissionDate' | 'status'>) => void;
  addCoCurricular: (item: Omit<CoCurricularActivity, 'id' | 'status'>) => void;
  recordQrAttendance: (courseCode: string, token: string) => { success: boolean; message: string };

  // Syllabus Tracker & Exams (Sections 2 & 7)
  syllabusChapters: SyllabusChapter[];
  updateTopicStatus: (
    chapterId: string,
    topicId: string,
    status: SyllabusTopicStatus,
    teachingNotes?: string,
    completedDate?: string
  ) => void;
  addSyllabusChapter: (
    chapter: Omit<SyllabusChapter, 'id' | 'topics'> & { topics?: Omit<SyllabusTopic, 'id'>[] }
  ) => void;
  addSyllabusTopic: (chapterId: string, topic: Omit<SyllabusTopic, 'id'>) => void;
  upcomingExams: UpcomingExamItem[];
  addUpcomingExam: (exam: Omit<UpcomingExamItem, 'id'>) => void;
  updateUpcomingExam: (examId: string, updates: Partial<UpcomingExamItem>) => void;
  extendAssignmentDeadline: (assignmentId: string, newDueDate: string, reason: string) => void;

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
  sendAdvisorWarningNotification: (studentId: string, courseCode: string, note?: string) => void;

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
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  pdfModalDoc: { title: string; category?: string; content?: string; pdfUrl?: string; fileName?: string } | null;
  setPdfModalDoc: (doc: { title: string; category?: string; content?: string; pdfUrl?: string; fileName?: string } | null) => void;
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
    'admin-allocations'
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
    name: 'Fathin Anzum Sadman',
    email: 'student@metrouni.edu.bd',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'student123',
    studentId: '241-115-211',
    batch: '60th Batch',
    section: 'Section E',
    department: 'CSE',
    createdAt: '2026-10-10 09:15 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_demo_student_alias',
    name: 'Fathin Anzum Sadman',
    email: 'student@edupulse.edu',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    status: 'APPROVED',
    password: 'student123',
    studentId: '241-115-211',
    batch: '60th Batch',
    section: 'Section E',
    department: 'CSE',
    createdAt: '2026-10-10 09:15 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr_g_student',
    name: 'Fathin Anzum Sadman',
    email: 'fathinanzumsadman@gmail.com',
    role: 'STUDENT',
    authProvider: 'GOOGLE',
    status: 'APPROVED',
    studentId: '241-115-211',
    batch: '60th Batch',
    section: 'Section E',
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
    batch: '61st Batch',
    section: 'Section B',
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
          // ensure every user has a status and update Fathin's details
          return parsed.map((u: any) => {
            if (u.role === 'STUDENT' && (u.name?.includes('Fathin') || u.studentId === '241-115-211' || u.email === 'student@metrouni.edu.bd' || u.email === 'fathinanzumsadman@gmail.com')) {
              return {
                ...u,
                name: 'Fathin Anzum Sadman',
                batch: '60th Batch',
                section: 'Section E',
                status: u.status || 'APPROVED'
              };
            }
            return {
              ...u,
              status: u.status || 'APPROVED'
            };
          });
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
    adminApi.approveUser(userId).catch(() => null);
    const updated = registeredUsers.map(u => (u.id === userId ? { ...u, status: 'APPROVED' as const } : u));
    saveRegisteredUsers(updated);
    if (pendingApprovalUser?.id === userId) {
      setPendingApprovalUser(null);
    }
  };

  const rejectUser = (userId: string, reason?: string) => {
    adminApi.rejectUser(userId, reason).catch(() => null);
    const updated = registeredUsers.map(u =>
      u.id === userId
        ? { ...u, status: 'REJECTED' as const, rejectionReason: reason || 'Application rejected by Admin.' }
        : u
    );
    saveRegisteredUsers(updated);
  };

  const deleteUser = (userId: string) => {
    adminApi.deleteUser(userId).catch(() => null);
    const updated = registeredUsers.filter(u => u.id !== userId);
    saveRegisteredUsers(updated);
    if (pendingApprovalUser?.id === userId) {
      setPendingApprovalUser(null);
    }
  };

  // Auth state & session initialization lifecycle
  const [authStatus, setAuthStatus] = useState<AuthStatus>('INITIALIZING');

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('edupulse_user');
      const authFlag = localStorage.getItem('edupulse_auth');
      if (authFlag === 'true' && savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Ignore parse errors on startup
    }
    return DEMO_USERS.student;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authFlag = localStorage.getItem('edupulse_auth');
    return authFlag === 'true';
  });

  const [activeTab, setActiveTabRaw] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('edupulse_user');
      const authFlag = localStorage.getItem('edupulse_auth');
      if (authFlag === 'true' && savedUser) {
        const u = JSON.parse(savedUser);
        if (u.role && ROLE_DEFAULT_TAB[u.role as UserRole]) {
          return ROLE_DEFAULT_TAB[u.role as UserRole];
        }
      }
    } catch {}
    return 'dashboard';
  });

  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState<{ attemptedTab: string; userRole: UserRole } | null>(null);

  const clearUnauthorizedAttempt = () => setUnauthorizedAttempt(null);

  const isTabAllowedForRole = (tab: string, role: UserRole) => {
    return ROLE_ALLOWED_TABS[role]?.includes(tab) ?? false;
  };

  // Startup Auth Verification against Backend (JWT / Cookie Session)
  useEffect(() => {
    let isCancelled = false;

    async function verifyAuthSession() {
      try {
        const res = await authApi.getCurrentUser();
        if (isCancelled) return;

        if (res?.success && res?.user) {
          const u = res.user;
          const restoredRole = (u.role as UserRole) || 'STUDENT';
          const restoredProfile: UserProfile = {
            id: u.id || u.userId || `usr_${Date.now()}`,
            name: u.name || 'EduPulse User',
            email: u.email,
            role: restoredRole,
            status: (u.status || 'APPROVED') as any,
            authProvider: u.authProvider || 'EMAIL',
            isEmailVerified: u.isEmailVerified !== false,
            studentId: u.studentId,
            employeeId: u.employeeId,
            department: u.department || 'CSE',
            departmentName: 'Computer Science & Engineering',
            institution: 'Metropolitan University, Sylhet',
            batch: u.batch,
            section: u.section,
            avatarUrl: u.avatarUrl || (DEMO_USERS[restoredRole.toLowerCase() as keyof typeof DEMO_USERS]?.avatarUrl)
          };

          setCurrentUser(restoredProfile);
          setIsAuthenticated(true);
          setAuthStatus('AUTHENTICATED');
          localStorage.setItem('edupulse_user', JSON.stringify(restoredProfile));
          localStorage.setItem('edupulse_auth', 'true');

          setActiveTabRaw(prevTab => {
            if (isTabAllowedForRole(prevTab, restoredRole)) {
              return prevTab;
            }
            return ROLE_DEFAULT_TAB[restoredRole] || 'dashboard';
          });
          return;
        }
      } catch (err) {
        console.warn('[EduPulse Auth Lifecycle] Backend verification check:', err);
      }

      if (isCancelled) return;

      // If backend validation did not succeed, verify local persistence fallback
      const authFlag = localStorage.getItem('edupulse_auth');
      const savedUser = localStorage.getItem('edupulse_user');

      if (authFlag !== 'true' || !savedUser) {
        setIsAuthenticated(false);
        setAuthStatus('UNAUTHENTICATED');
        localStorage.removeItem('edupulse_auth');
        localStorage.removeItem('edupulse_user');
        localStorage.removeItem('edupulse_jwt_token');
        return;
      }

      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.role && parsed.email) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
          setAuthStatus('AUTHENTICATED');
          setActiveTabRaw(prevTab => {
            if (isTabAllowedForRole(prevTab, parsed.role)) {
              return prevTab;
            }
            return ROLE_DEFAULT_TAB[parsed.role as UserRole] || 'dashboard';
          });
          return;
        }
      } catch {}

      // Corrupt session data
      setIsAuthenticated(false);
      setAuthStatus('UNAUTHENTICATED');
      localStorage.removeItem('edupulse_auth');
      localStorage.removeItem('edupulse_user');
      localStorage.removeItem('edupulse_jwt_token');
    }

    verifyAuthSession();

    return () => {
      isCancelled = true;
    };
  }, []);

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

  const login = async (
    email: string,
    role?: UserRole,
    password?: string,
    customProfile?: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string; pending?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Authenticate against real Express + MongoDB Atlas backend
    try {
      const res = await authApi.login(cleanEmail, password, role);

      if (res && res.success === true && res.user) {
        const u = res.user;
        const effectiveRole = (u.role as UserRole) || role || 'STUDENT';
        const baseProfile = DEMO_USERS[effectiveRole.toLowerCase() as keyof typeof DEMO_USERS] || DEMO_USERS.student;

        const finalProfile: UserProfile = {
          ...baseProfile,
          id: u.id || u.userId || `usr_${Date.now()}`,
          name: u.name || customProfile?.name || baseProfile.name,
          email: u.email || cleanEmail,
          role: effectiveRole,
          status: 'APPROVED',
          authProvider: u.authProvider || 'EMAIL',
          isEmailVerified: u.isEmailVerified !== false,
          studentId: u.studentId || (effectiveRole === 'STUDENT' ? baseProfile.studentId : undefined),
          batch: u.batch || (effectiveRole === 'STUDENT' ? baseProfile.batch || '60th Batch' : undefined),
          section: u.section || (effectiveRole === 'STUDENT' ? baseProfile.section || 'Section A' : undefined),
          employeeId: u.employeeId || (effectiveRole !== 'STUDENT' ? baseProfile.employeeId : undefined),
          department: u.department || baseProfile.department,
          departmentName: 'Computer Science & Engineering',
          institution: 'Metropolitan University, Sylhet',
          avatarUrl: u.avatarUrl || customProfile?.avatarUrl || baseProfile.avatarUrl,
          ...(customProfile || {})
        };

        if (res.token) {
          localStorage.setItem('edupulse_jwt_token', res.token);
        }
        localStorage.setItem('edupulse_user', JSON.stringify(finalProfile));
        localStorage.setItem('edupulse_auth', 'true');

        setCurrentUser(finalProfile);
        setIsAuthenticated(true);
        setAuthStatus('AUTHENTICATED');
        setPendingApprovalUser(null);
        setUnauthorizedAttempt(null);
        const targetTab = ROLE_DEFAULT_TAB[effectiveRole] || 'dashboard';
        setActiveTabRaw(targetTab);

        return { success: true };
      }

      // If backend explicitly rejected with invalid password, pending, or role mismatch
      if (res && res.success === false) {
        if (res.status === 'PENDING') {
          return {
            success: false,
            pending: true,
            error: res.error || 'Account pending administrator verification.'
          };
        }
        return {
          success: false,
          error: res.error || 'Authentication failed. Please check your credentials.'
        };
      }
    } catch (err: any) {
      console.warn('[EduPulse Backend Login Error]', err);
    }

    // 2. Fallback to local accounts if backend is temporarily unreachable
    const existing = registeredUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
    if (!existing) {
      return {
        success: false,
        error: 'Unregistered email! No account exists with this email address. Please create an account first.'
      };
    }

    if (existing.authProvider === 'EMAIL' && existing.password) {
      if (!password) {
        return {
          success: false,
          error: 'Password is required to sign in to this account.'
        };
      }

      const isMatch = existing.password === password;

      if (!isMatch) {
        return {
          success: false,
          error: 'Invalid password. Please check your credentials.'
        };
      }
    }

    if (role && existing.role !== role) {
      return {
        success: false,
        error: `Role mismatch: This account belongs to role [${existing.role}], not [${role}].`
      };
    }

    if (existing.status === 'PENDING') {
      setPendingApprovalUser(existing);
      setIsAuthenticated(false);
      localStorage.removeItem('edupulse_auth');
      return {
        success: false,
        pending: true,
        error: 'Account pending administrator approval.'
      };
    }

    if (existing.status === 'REJECTED') {
      return {
        success: false,
        error: `Account registration was rejected by Administrator: ${existing.rejectionReason || 'Contact registrar office.'}`
      };
    }

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
      studentId: existing.studentId,
      batch: existing.batch,
      section: existing.section,
      employeeId: existing.employeeId,
      department: existing.department || baseProfile.department,
      departmentName: 'Computer Science & Engineering',
      institution: 'Metropolitan University, Sylhet',
      avatarUrl: existing.avatarUrl || customProfile?.avatarUrl || baseProfile.avatarUrl,
      ...(customProfile || {})
    };

    setCurrentUser(finalProfile);
    setIsAuthenticated(true);
    setAuthStatus('AUTHENTICATED');
    setPendingApprovalUser(null);
    setUnauthorizedAttempt(null);
    const targetTab = ROLE_DEFAULT_TAB[effectiveRole] || 'dashboard';
    setActiveTabRaw(targetTab);
    localStorage.setItem('edupulse_user', JSON.stringify(finalProfile));
    localStorage.setItem('edupulse_auth', 'true');

    return { success: true };
  };

  const loginWithGoogle = async (
    googleProfile: {
      name: string;
      email: string;
      avatarUrl?: string;
      role: UserRole;
      studentId?: string;
      batch?: string;
      section?: string;
      employeeId?: string;
      department?: string;
    },
    isSignUp?: boolean
  ): Promise<{ success: boolean; error?: string; pending?: boolean }> => {
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
      return await login(existing.email, existing.role);
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
      batch: googleProfile.batch || (googleProfile.role === 'STUDENT' ? '61st Batch' : undefined),
      section: googleProfile.section || (googleProfile.role === 'STUDENT' ? 'Section A' : undefined),
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

    // Register with MongoDB Express backend & dispatch welcome email
    authApi.register({
      name: googleProfile.name,
      email: googleProfile.email,
      role: googleProfile.role,
      studentId: googleProfile.studentId,
      batch: googleProfile.batch,
      section: googleProfile.section,
      employeeId: googleProfile.employeeId,
      department: googleProfile.department || 'CSE',
      authProvider: 'GOOGLE'
    }).catch(err => {
      console.warn('[EduPulse Google Register Sync]', err);
    });

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
    batch?: string;
    section?: string;
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
      password: accountData.password,
      studentId: accountData.role === 'STUDENT' ? accountData.studentId || '241-115-211' : undefined,
      batch: accountData.batch || (accountData.role === 'STUDENT' ? '60th Batch' : undefined),
      section: accountData.section || (accountData.role === 'STUDENT' ? 'Section E' : undefined),
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

    // Register with MongoDB Express backend
    authApi.register({
      name: accountData.name,
      email: accountData.email,
      role: accountData.role,
      password: accountData.password,
      studentId: accountData.studentId,
      batch: accountData.batch,
      section: accountData.section,
      employeeId: accountData.employeeId,
      department: accountData.department,
      authProvider: accountData.authProvider
    }).catch(err => {
      console.warn('[EduPulse Backend Register Sync]', err);
    });

    return {
      success: false,
      pending: true,
      error: 'Account submitted successfully and is awaiting Administrator approval.'
    };
  };

  const logout = () => {
    authApi.logout().catch(() => null);
    setIsAuthenticated(false);
    setAuthStatus('UNAUTHENTICATED');
    setUnauthorizedAttempt(null);
    setActiveTabRaw('dashboard');
    localStorage.removeItem('edupulse_auth');
    localStorage.removeItem('edupulse_user');
    localStorage.removeItem('edupulse_jwt_token');
    localStorage.removeItem('edupulse_pending_user');
  };

  const resetUserPassword = (email: string, newPassword: string) => {
    const clean = email.trim().toLowerCase();
    const updated = registeredUsers.map(u =>
      u.email.trim().toLowerCase() === clean ? { ...u, password: newPassword } : u
    );
    saveRegisteredUsers(updated);
  };

  // Theme State
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('edupulse_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        const themeDef = getThemeById(parsed.themeId || parsed.backgroundId || 'midnight-emerald');
        return {
          ...DEFAULT_THEME,
          ...parsed,
          themeId: themeDef.id,
          accentColor: themeDef.primary,
          accentName: themeDef.name,
          primary: themeDef.primary,
          secondary: themeDef.secondary,
          gradientStart: themeDef.gradientStart,
          gradientEnd: themeDef.gradientEnd,
          glow: themeDef.glow,
          backgroundId: themeDef.id
        };
      }
      return DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prev => {
      const targetThemeId = newTheme.themeId || (newTheme.backgroundId ? getThemeById(newTheme.backgroundId).id : prev.themeId);
      const themeDef = getThemeById(targetThemeId);
      const nextMode = newTheme.mode || prev.mode;
      const updated: ThemeConfig = {
        ...prev,
        ...newTheme,
        themeId: themeDef.id,
        mode: nextMode,
        accentColor: themeDef.primary,
        accentName: themeDef.name,
        primary: themeDef.primary,
        secondary: themeDef.secondary,
        gradientStart: themeDef.gradientStart,
        gradientEnd: themeDef.gradientEnd,
        glow: themeDef.glow,
        backgroundId: themeDef.id
      };
      localStorage.setItem('edupulse_theme', JSON.stringify(updated));
      return updated;
    });
  };

  // Dynamically apply theme to document root and body with centralized CSS properties
  useEffect(() => {
    const root = document.documentElement;
    const themeDef = getThemeById(theme.themeId);
    const isLight = theme.mode === 'light';

    // Set data-theme on <html> root element
    root.setAttribute('data-theme', themeDef.id);

    if (isLight) {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }

    const bg = isLight ? themeDef.light.background : themeDef.background;
    const sidebar = isLight ? themeDef.light.sidebar : themeDef.sidebar;
    const card = isLight ? themeDef.light.card : themeDef.card;
    const cardSub = isLight ? themeDef.light.cardSub : themeDef.cardSub;
    const cardHover = isLight ? themeDef.light.cardHover : themeDef.cardHover;
    const border = isLight ? themeDef.light.border : themeDef.border;
    const textPrimary = isLight ? themeDef.light.textPrimary : themeDef.textPrimary;
    const textSecondary = isLight ? themeDef.light.textSecondary : themeDef.textSecondary;
    const button = isLight ? themeDef.light.button : themeDef.button;
    const buttonHover = isLight ? themeDef.light.buttonHover : themeDef.buttonHover;
    const inputBg = isLight ? themeDef.light.inputBackground : themeDef.inputBackground;
    const glow = isLight ? themeDef.light.glow : themeDef.glow;

    // Centralized theme variables (Section 5 requirements)
    root.style.setProperty('--color-primary', themeDef.primary);
    root.style.setProperty('--color-secondary', themeDef.secondary);
    root.style.setProperty('--color-background', bg);
    root.style.setProperty('--color-sidebar', sidebar);
    root.style.setProperty('--color-card', card);
    root.style.setProperty('--color-card-sub', cardSub);
    root.style.setProperty('--color-card-hover', cardHover);
    root.style.setProperty('--color-border', border);
    root.style.setProperty('--color-text-primary', textPrimary);
    root.style.setProperty('--color-text-secondary', textSecondary);
    root.style.setProperty('--color-gradient-start', themeDef.gradientStart);
    root.style.setProperty('--color-gradient-end', themeDef.gradientEnd);
    root.style.setProperty('--color-glow', glow);
    root.style.setProperty('--color-button', button);
    root.style.setProperty('--color-button-hover', buttonHover);
    root.style.setProperty('--color-input-background', inputBg);

    // Sync legacy/component variables
    root.style.setProperty('--ep-bg-body', bg);
    root.style.setProperty('--ep-bg-card', card);
    root.style.setProperty('--ep-bg-card-sub', cardSub);
    root.style.setProperty('--ep-bg-header', sidebar);
    root.style.setProperty('--ep-bg-sidebar', sidebar);
    root.style.setProperty('--ep-border', border);
    root.style.setProperty('--ep-text-primary', textPrimary);
    root.style.setProperty('--ep-text-secondary', textSecondary);
    root.style.setProperty('--ep-accent-color', themeDef.primary);
    root.style.setProperty('--ep-accent-secondary', themeDef.secondary);
    root.style.setProperty('--ep-accent-gradient', `linear-gradient(135deg, ${themeDef.gradientStart}, ${themeDef.gradientEnd})`);
    root.style.setProperty('--ep-glow', glow);

    document.body.style.backgroundColor = bg;
    document.body.style.color = textPrimary;
  }, [theme]);

  // UI Modals
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSwitchAccountModalOpen, setIsSwitchAccountModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [pdfModalDoc, setPdfModalDoc] = useState<{ title: string; category?: string; content?: string; pdfUrl?: string; fileName?: string } | null>(null);

  // Student State
  const [studentCourses] = useState<StudentCourseRecord[]>(INITIAL_STUDENT_COURSES);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_LOG);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialItem[]>(INITIAL_STUDY_MATERIALS);
  const [previousResults, setPreviousResults] = useState<PreviousResultSubmission[]>(INITIAL_PREVIOUS_RESULTS);
  const [coCurricular, setCoCurricular] = useState<CoCurricularActivity[]>(INITIAL_CO_CURRICULAR);
  const [routine] = useState<ClassRoutineItem[]>(INITIAL_ROUTINE);

  // Syllabus Tracker & Exams (Sections 2 & 7)
  const [syllabusChapters, setSyllabusChapters] = useState<SyllabusChapter[]>(INITIAL_SYLLABUS_CHAPTERS);
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExamItem[]>(INITIAL_UPCOMING_EXAMINATIONS);

  const updateTopicStatus = (
    chapterId: string,
    topicId: string,
    status: SyllabusTopicStatus,
    teachingNotes?: string,
    completedDate?: string
  ) => {
    setSyllabusChapters(prev =>
      prev.map(ch => {
        if (ch.id !== chapterId) return ch;
        return {
          ...ch,
          topics: ch.topics.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  status,
                  teachingNotes: teachingNotes !== undefined ? teachingNotes : t.teachingNotes,
                  completedDate: status === 'COMPLETED' ? (completedDate || new Date().toISOString().split('T')[0]) : undefined
                }
              : t
          )
        };
      })
    );
  };

  const addSyllabusChapter = (
    chapter: Omit<SyllabusChapter, 'id' | 'topics'> & { topics?: Omit<SyllabusTopic, 'id'>[] }
  ) => {
    const newChap: SyllabusChapter = {
      ...chapter,
      id: `ch-${Date.now()}`,
      topics: (chapter.topics || []).map((t, idx) => ({
        ...t,
        id: `tp-${Date.now()}-${idx}`
      }))
    };
    setSyllabusChapters(prev => [...prev, newChap]);
  };

  const addSyllabusTopic = (chapterId: string, topic: Omit<SyllabusTopic, 'id'>) => {
    const newTopic: SyllabusTopic = {
      ...topic,
      id: `tp-${Date.now()}`
    };
    setSyllabusChapters(prev =>
      prev.map(ch =>
        ch.id === chapterId ? { ...ch, topics: [...ch.topics, newTopic] } : ch
      )
    );
  };

  const addUpcomingExam = (exam: Omit<UpcomingExamItem, 'id'>) => {
    const newExam: UpcomingExamItem = {
      ...exam,
      id: `exam-${Date.now()}`
    };
    setUpcomingExams(prev => [...prev, newExam]);
  };

  const updateUpcomingExam = (examId: string, updates: Partial<UpcomingExamItem>) => {
    setUpcomingExams(prev =>
      prev.map(ex => (ex.id === examId ? { ...ex, ...updates } : ex))
    );
  };

  const extendAssignmentDeadline = (assignmentId: string, newDueDate: string, reason: string) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id !== assignmentId) return a;
        const history = a.extensionHistory || [];
        const original = a.originalDueDate || a.dueDate;
        return {
          ...a,
          dueDate: newDueDate,
          originalDueDate: original,
          isExtended: true,
          extensionReason: reason,
          status: a.status === 'OVERDUE' ? 'PENDING' : a.status,
          extensionHistory: [
            ...history,
            {
              date: new Date().toISOString().split('T')[0],
              previousDueDate: a.dueDate,
              newDueDate,
              reason,
              extendedBy: currentUser.name
            }
          ]
        };
      })
    );
  };

  // Student Actions
  const submitAssignment = (assignmentId: string, fileName: string, pdfDataUrl?: string) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (!target) return;
    
    // Strict Deadline Validation:
    const deadlineTime = new Date(`${target.dueDate}T23:59:59`).getTime();
    if (Date.now() > deadlineTime) {
      return;
    }

    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'SUBMITTED',
              submissionDate: new Date().toISOString().split('T')[0],
              submittedFileName: fileName,
              submittedPdfData: pdfDataUrl,
              submittedStudentName: currentUser.name || 'Fathin Anzum Sadman',
              submittedStudentId: currentUser.studentId || '241-115-211'
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

  // Week 5 Teacher State & Actions
  const [teacherRoster, setTeacherRoster] = useState<StudentRosterItem[]>(INITIAL_TEACHER_STUDENTS);
  const [assessmentRecords, setAssessmentRecords] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENT_RECORDS);
  const [highRiskAlerts, setHighRiskAlerts] = useState<HighRiskAlert[]>(INITIAL_HIGH_RISK_ALERTS);
  const [qrSession, setQrSession] = useState<QrAttendanceSession | null>(null);

  // Dynamic QR Attendance Verification (Section 3: Strict Rules)
  const recordQrAttendance = (courseCode: string, token: string): { success: boolean; message: string } => {
    // 1. Must have an active teacher session
    if (!qrSession || !qrSession.isActive) {
      return { success: false, message: 'QR Code Expired' };
    }

    // 2. Strict 5-minute expiration check (300 seconds)
    const elapsedSeconds = (Date.now() - (qrSession.createdTimestamp || 0)) / 1000;
    if (elapsedSeconds > (qrSession.expiresInSeconds || 300)) {
      return { success: false, message: 'QR Code Expired' };
    }

    // 3. Token authenticity and format check
    const cleanToken = token.trim();
    if (!cleanToken || (!cleanToken.includes('EDUPULSE:SESSION') && cleanToken !== qrSession.qrPayload && !cleanToken.includes(qrSession.sessionId))) {
      return { success: false, message: 'Invalid QR Code' };
    }

    // 4. Scanned QR must belong to the selected course
    if (qrSession.courseCode.trim().toLowerCase() !== courseCode.trim().toLowerCase()) {
      return { success: false, message: 'Invalid QR Code' };
    }

    // 5. Student must be enrolled in this course
    const isEnrolled = studentCourses.some(
      c => c.courseCode.trim().toLowerCase() === courseCode.trim().toLowerCase()
    );
    if (!isEnrolled) {
      return { success: false, message: 'You are not enrolled in this course' };
    }

    // 6. Prevent duplicate attendance (submit once per session)
    const alreadySubmitted = attendanceLogs.some(
      log => log.sessionId === qrSession.sessionId && log.studentId === currentUser.studentId
    );
    if (alreadySubmitted) {
      return { success: false, message: 'Attendance Already Submitted' };
    }

    const matchedCourse = studentCourses.find(
      c => c.courseCode.trim().toLowerCase() === courseCode.trim().toLowerCase()
    )!;

    const newLog: AttendanceRecord = {
      id: `att-${Date.now()}`,
      sessionId: qrSession.sessionId,
      studentId: currentUser.studentId || '241-115-211',
      studentName: currentUser.name,
      teacherId: qrSession.teacherId || 'FAC-CSE-042',
      courseId: matchedCourse.courseId,
      courseCode: matchedCourse.courseCode,
      courseTitle: matchedCourse.courseTitle,
      date: new Date().toISOString().split('T')[0],
      timeSlot: qrSession.startTime,
      room: qrSession.room || 'Academic Block 3 - Room 402',
      status: 'PRESENT',
      verifiedVia: 'DYNAMIC_QR',
      tokenUsed: cleanToken,
      timestamp: new Date().toISOString()
    };

    setAttendanceLogs(prev => [newLog, ...prev]);

    // Real-time teacher roster update
    setTeacherRoster(prev =>
      prev.map(s =>
        s.studentId === (currentUser.studentId || '241-115-211')
          ? {
              ...s,
              attendanceStatus: 'PRESENT',
              checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : s
      )
    );

    // Update checkedInCount in session
    setQrSession(prev => (prev ? { ...prev, checkedInCount: (prev.checkedInCount || 0) + 1 } : null));

    return { success: true, message: 'Attendance Successfully Recorded' };
  };

  const updateStudentAttendanceStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setTeacherRoster(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, attendanceStatus: status } : s))
    );
  };

  // Exactly 5 minutes (300 seconds) default QR session
  const startQrSession = (courseCode: string, section: string, durationSeconds = 300) => {
    const sessionId = `ses-${Date.now()}`;
    const token = `EP-${courseCode.replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`;
    setQrSession({
      sessionId,
      courseCode,
      courseTitle: courseCode === 'CSE 311' ? 'Database Management Systems' : courseCode === 'CSE 313' ? 'Compiler Design' : 'Course Session',
      section,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresInSeconds: durationSeconds,
      createdTimestamp: Date.now(),
      qrPayload: `EDUPULSE:SESSION:${sessionId}:${token}:CSE:2026`,
      totalEnrolled: teacherRoster.length,
      checkedInCount: teacherRoster.filter(s => s.attendanceStatus === 'PRESENT').length,
      isActive: true,
      teacherId: currentUser.employeeId || 'FAC-CSE-042',
      teacherName: currentUser.name,
      room: 'Academic Block 3 - Room 402'
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

        // SRS FR-TEA-14: Best 2 of 3 CT Calculation
        const ctScores = [updated.quiz1 || 0, updated.quiz2 || 0, updated.quiz3 !== undefined ? updated.quiz3 : (updated.quiz2 || 0)];
        ctScores.sort((a, b) => b - a);
        const bestTwoCtAverage = Math.round(((ctScores[0] + ctScores[1]) / 2) * 10) / 10;

        // Total 100 = Best 2 of 3 CT (20) + Midterm (30) + Assignment (10) + Final (40)
        const total = Math.min(100, Math.round(bestTwoCtAverage + (updated.midterm || 0) + (updated.assignment || 0) + (updated.finalExam || 0)));

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
          bestTwoCtAverage,
          total,
          letterGrade,
          gpa
        };
      })
    );
  };

  // SRS FR-TEA-17: Notify Student & Assigned Academic Advisor
  const sendAdvisorWarningNotification = (studentId: string, courseCode: string, note?: string) => {
    setAssessmentRecords(prev =>
      prev.map(r => r.studentId === studentId ? { ...r, advisorNotified: true } : r)
    );
    // Also log in high-risk alert history
    setHighRiskAlerts(prev => {
      const existing = prev.find(h => h.studentId === studentId);
      if (existing) {
        return prev.map(h => h.studentId === studentId ? {
          ...h,
          status: 'INTERVENTION_SENT',
          interventionHistory: [
            ...h.interventionHistory,
            {
              date: new Date().toISOString().split('T')[0],
              action: 'Official Academic Warning Dispatched',
              note: note || `Debarment alert & low performance notice sent to student and Departmental Advisor.`,
              by: currentUser.name
            }
          ]
        } : h);
      }
      return [
        {
          id: `hra-${Date.now()}`,
          studentId,
          studentName: assessmentRecords.find(a => a.studentId === studentId)?.studentName || 'Student',
          courseCode: courseCode || 'CSE 311',
          attendanceRate: 64,
          marksScore: assessmentRecords.find(a => a.studentId === studentId)?.total || 45,
          riskFactor: note || 'Academic performance warning triggered by Course Teacher.',
          status: 'INTERVENTION_SENT',
          interventionHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              action: 'Early Warning Dispatched',
              note: note || 'Dispatched warning notification to student and Departmental Advisor.',
              by: currentUser.name
            }
          ]
        },
        ...prev
      ];
    });
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
        authStatus,
        pendingApprovalUser,
        clearPendingApproval,
        approveUser,
        rejectUser,
        deleteUser,
        setRegisteredUsers,
        login,
        loginWithGoogle,
        registerAccount,
        resetUserPassword,
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
        sendAdvisorWarningNotification,
        bulkImportAssessments,
        createAssignment,
        gradeAssignment,
        publishNotice,
        uploadStudyMaterial,
        verifyResultSubmission,
        highRiskAlerts,
        updateHighRiskStatus,
        syllabusChapters,
        updateTopicStatus,
        addSyllabusChapter,
        addSyllabusTopic,
        upcomingExams,
        addUpcomingExam,
        updateUpcomingExam,
        extendAssignmentDeadline,
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
        isMobileNavOpen,
        setIsMobileNavOpen,
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
