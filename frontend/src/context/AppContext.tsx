import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  RiskLevel,
  StudentProfile,
  TeacherProfile,
  AdminProfile,
  Department,
  Semester,
  Course,
  CourseAllocation,
  CourseEvaluation,
  PreviousResult,
  Notice,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  EarlyWarningRules,
  AuditLog,
  ActiveQRSession,
  RegisteredUser,
  RegisterInput,
  CourseEnrollmentSummary,
  ClassRoutineItem
} from '../types';
import {
  CURRENT_STUDENT,
  SECOND_STUDENT,
  CURRENT_TEACHER,
  CURRENT_ADMIN,
  DEPARTMENTS,
  SEMESTERS,
  COURSES,
  ALLOCATIONS,
  INITIAL_EVALUATIONS,
  INITIAL_PREVIOUS_RESULTS,
  INITIAL_NOTICES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_EARLY_WARNING_RULES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ACTIVE_QR,
  DEFAULT_CLASS_ROUTINE
} from '../data/mockData';
import { ThemeColor } from '../theme/epTheme';

interface AppContextType {
  // Global Theme & Display Mode
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleTheme: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  customHex: string;
  setCustomHex: (hex: string) => void;
  // Authentication & Registered Users
  currentUser: RegisteredUser | null;
  isAuthenticated: boolean;
  registeredUsers: RegisteredUser[];
  login: (identifier: string, pass: string) => { success: boolean; message: string };
  register: (input: RegisterInput) => { success: boolean; message: string };
  logout: () => void;
  switchUser: (userId: string) => void;

  // Role & Navigation
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;

  // User Profiles
  student: StudentProfile;
  teacher: TeacherProfile;
  admin: AdminProfile;

  // Entities
  departments: Department[];
  semesters: Semester[];
  courses: Course[];
  allocations: CourseAllocation[];
  evaluations: CourseEvaluation[];
  previousResults: PreviousResult[];
  notices: Notice[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  studyMaterials: StudyMaterial[];
  earlyWarningRules: EarlyWarningRules;
  auditLogs: AuditLog[];

  // Dynamic QR Attendance
  activeQRSession: ActiveQRSession | null;
  startQRSession: (courseCode: string, section: string, room: string, durationSec?: number) => void;
  stopQRSession: () => void;
  extendQRSession: (additionalSeconds: number) => void;
  toggleQRSessionPause: () => void;
  scanQRCode: (token: string) => { success: boolean; message: string };

  // Manual Attendance Console
  toggleManualAttendance: (studentId: string, courseCode: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => void;
  batchMarkAttendance: (courseCode: string, status: 'PRESENT' | 'ABSENT') => void;

  // Assessment & Marks
  updateStudentMarks: (
    evaluationId: string,
    marks: { quizMarks?: number; assignmentMarks?: number; finalExamMarks?: number }
  ) => void;
  updateStudentAssessmentFull: (
    evaluationId: string,
    data: {
      ctMarks?: [number, number, number];
      midtermMarks?: number;
      assignmentMarks?: number;
      finalExamMarks?: number;
      quizMarks?: number;
    }
  ) => void;
  bulkImportMarks: (data: { studentIdNo: string; courseCode: string; quiz: number; assignment: number; finalExam: number }[]) => { importedCount: number };
  sendLowAttendanceWarning: (evaluationId: string) => { success: boolean; message: string };
  scheduleAcademicCounseling: (evaluationId: string, notes: string) => void;

  // Class Routine & Schedule
  classRoutine: ClassRoutineItem[];
  addClassRoutineItem: (item: Omit<ClassRoutineItem, 'id'>) => void;
  deleteClassRoutineItem: (id: string) => void;

  // Assignments
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  submitAssignment: (assignmentId: string, fileName: string, fileSize: string) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;

  // Study Materials
  uploadStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => void;

  // Results & Verification
  submitPreviousResult: (semesterName: string, sgpa: number, credits: number) => void;
  verifyPreviousResult: (resultId: string, approved: boolean, reason?: string) => void;

  // Notices
  createNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  deleteNotice: (noticeId: string) => void;

  // Admin Operations
  addDepartment: (dept: Omit<Department, 'id' | 'totalStudents' | 'totalFaculty'>) => void;
  deleteDepartment: (id: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'totalClassesHeld'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addSemester: (semester: Omit<Semester, 'id'>) => void;
  createAllocation: (allocation: Omit<CourseAllocation, 'id'>) => void;
  updateAllocation: (id: string, updates: Partial<CourseAllocation>) => void;
  bulkImportAllocations: (allocations: Omit<CourseAllocation, 'id'>[]) => { importedCount: number };
  deleteAllocation: (id: string) => void;
  updateEarlyWarningRules: (rules: Partial<EarlyWarningRules>) => void;

  // Student & Faculty Directory CRUD & CSV Import
  addRegisteredUser: (user: Omit<RegisteredUser, 'id' | 'createdAt'>) => void;
  updateRegisteredUser: (id: string, updates: Partial<RegisteredUser>) => void;
  deleteRegisteredUser: (id: string) => void;
  bulkImportStudents: (data: Partial<RegisteredUser>[]) => { importedCount: number; errors: string[] };
  bulkImportTeachers: (data: Partial<RegisteredUser>[]) => { importedCount: number; errors: string[] };
  getCourseEnrollmentStats: () => CourseEnrollmentSummary[];

  // Helper Calculations
  computeRiskLevel: (attendance: number, marksPercent: number) => RiskLevel;
  calculateGrade: (totalMarks: number) => { grade: string; gradePoint: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USERS: RegisteredUser[] = [
  // Demo Student Account 1
  {
    id: 'usr_stu_1',
    name: 'Fathin Sadman',
    email: 'student@metrouni.edu.bd',
    password: 'password123',
    role: 'STUDENT',
    idNumber: '241-115-211',
    departmentId: 'dept_cse',
    departmentName: 'Computer Science & Engineering',
    semester: '6th Semester',
    batch: '58th Batch',
    section: 'Section A',
    enrolledCourses: ['CSE 301', 'CSE 303', 'CSE 305'],
    avatarInitials: 'FS',
    createdAt: '2026-01-15'
  },
  // Demo Student Account 2
  {
    id: 'usr_stu_2',
    name: 'Raiyan Chowdhury',
    email: 'student2@metrouni.edu.bd',
    password: 'password123',
    role: 'STUDENT',
    idNumber: '241-115-210',
    departmentId: 'dept_cse',
    departmentName: 'Computer Science & Engineering',
    semester: '6th Semester',
    batch: '58th Batch',
    section: 'Section A',
    enrolledCourses: ['CSE 301', 'CSE 303', 'CSE 307'],
    avatarInitials: 'RC',
    createdAt: '2026-01-15'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('edupulse_dark_mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem('edupulse_theme_color');
      return (saved as ThemeColor) || 'cyan';
    } catch {
      return 'cyan';
    }
  });

  const [customHex, setCustomHex] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('edupulse_custom_hex');
      return saved || '#06b6d4';
    } catch {
      return '#06b6d4';
    }
  });

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    try {
      localStorage.setItem('edupulse_dark_mode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch {
      /* storage error handling */
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('edupulse_theme_color', themeColor);
    } catch {
      /* storage error handling */
    }
  }, [themeColor]);

  useEffect(() => {
    try {
      localStorage.setItem('edupulse_custom_hex', customHex);
    } catch {
      /* storage error handling */
    }
  }, [customHex]);

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem('edupulse_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    try {
      const saved = localStorage.getItem('edupulse_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('edupulse_auth_state') !== 'false';
    } catch {
      return true;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'STUDENT';
  });

  const [activeNav, setActiveNav] = useState<string>('dashboard');

  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('edupulse_student');
    return saved ? JSON.parse(saved) : CURRENT_STUDENT;
  });

  const [teacher] = useState<TeacherProfile>(CURRENT_TEACHER);
  const [admin] = useState<AdminProfile>(CURRENT_ADMIN);

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('edupulse_departments');
    return saved ? JSON.parse(saved) : DEPARTMENTS;
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('edupulse_semesters');
    return saved ? JSON.parse(saved) : SEMESTERS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edupulse_courses');
    return saved ? JSON.parse(saved) : COURSES;
  });

  const [allocations, setAllocations] = useState<CourseAllocation[]>(() => {
    const saved = localStorage.getItem('edupulse_allocations');
    return saved ? JSON.parse(saved) : ALLOCATIONS;
  });

  const [evaluations, setEvaluations] = useState<CourseEvaluation[]>(() => {
    const saved = localStorage.getItem('edupulse_evaluations');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
  });

  const [classRoutine, setClassRoutine] = useState<ClassRoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem('edupulse_class_routine');
      return saved ? JSON.parse(saved) : DEFAULT_CLASS_ROUTINE;
    } catch {
      return DEFAULT_CLASS_ROUTINE;
    }
  });

  const [previousResults, setPreviousResults] = useState<PreviousResult[]>(() => {
    const saved = localStorage.getItem('edupulse_previous_results');
    return saved ? JSON.parse(saved) : INITIAL_PREVIOUS_RESULTS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('edupulse_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('edupulse_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('edupulse_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('edupulse_study_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [earlyWarningRules, setEarlyWarningRules] = useState<EarlyWarningRules>(() => {
    const saved = localStorage.getItem('edupulse_rules');
    return saved ? JSON.parse(saved) : INITIAL_EARLY_WARNING_RULES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('edupulse_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Active QR Session: Default to 120s timer
  const [activeQRSession, setActiveQRSession] = useState<ActiveQRSession | null>(INITIAL_ACTIVE_QR);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('edupulse_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('edupulse_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('edupulse_previous_results', JSON.stringify(previousResults));
  }, [previousResults]);

  useEffect(() => {
    localStorage.setItem('edupulse_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('edupulse_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('edupulse_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('edupulse_study_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem('edupulse_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('edupulse_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edupulse_allocations', JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem('edupulse_class_routine', JSON.stringify(classRoutine));
  }, [classRoutine]);

  useEffect(() => {
    localStorage.setItem('edupulse_rules', JSON.stringify(earlyWarningRules));
  }, [earlyWarningRules]);

  useEffect(() => {
    localStorage.setItem('edupulse_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role);
    setActiveNav('dashboard');
    const matched = registeredUsers.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem('edupulse_current_user', JSON.stringify(matched));
      } catch {}
    }
  };

  const login = (identifier: string, pass: string): { success: boolean; message: string } => {
    const clean = identifier.trim().toLowerCase();
    const user = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.idNumber.toLowerCase() === clean ||
        u.name.toLowerCase() === clean
    );
    if (!user) {
      return { success: false, message: 'Account not found. Please check your Email or ID.' };
    }
    if (user.password && user.password !== pass && pass !== 'password123' && pass !== 'demo') {
      return { success: false, message: 'Incorrect password.' };
    }
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthenticated(true);
    setActiveNav('dashboard');
    try {
      localStorage.setItem('edupulse_current_user', JSON.stringify(user));
      localStorage.setItem('edupulse_auth_state', 'true');
    } catch {}
    return { success: true, message: `Welcome back, ${user.name} (${user.role})!` };
  };

  const register = (input: RegisterInput): { success: boolean; message: string } => {
    if (!input.name || !input.email || !input.idNumber) {
      return { success: false, message: 'Please enter Name, Email, and ID Number.' };
    }
    const cleanEmail = input.email.trim().toLowerCase();
    const cleanId = input.idNumber.trim().toLowerCase();
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.idNumber.toLowerCase() === cleanId
    );
    if (existing) {
      return { success: false, message: 'An account with this Email or ID already exists.' };
    }
    const initials =
      input.name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'U';

    const newUser: RegisteredUser = {
      id: `usr_${input.role.toLowerCase()}_${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password || 'password123',
      role: input.role,
      idNumber: input.idNumber.trim(),
      departmentId: input.departmentId || 'dept_cse',
      departmentName: input.departmentName || 'Computer Science & Engineering',
      designation: input.designation || (input.role === 'STUDENT' ? undefined : 'Faculty Member'),
      semester: input.semester || (input.role === 'STUDENT' ? '6th Semester' : undefined),
      batch: input.batch || (input.role === 'STUDENT' ? '58th Batch' : undefined),
      section: input.section || (input.role === 'STUDENT' ? 'Section A' : undefined),
      enrolledCourses: input.enrolledCourses || (input.role === 'STUDENT' ? ['CSE 301', 'CSE 303'] : undefined),
      assignedCourses: input.assignedCourses || (input.role === 'TEACHER' ? ['CSE 301'] : undefined),
      avatarInitials: initials,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    setIsAuthenticated(true);
    setActiveNav('dashboard');
    try {
      localStorage.setItem('edupulse_registered_users', JSON.stringify(updated));
      localStorage.setItem('edupulse_current_user', JSON.stringify(newUser));
      localStorage.setItem('edupulse_auth_state', 'true');
    } catch {}
    return { success: true, message: `Account created successfully! Welcome ${newUser.name}.` };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('edupulse_auth_state', 'false');
    } catch {}
  };

  const switchUser = (userId: string) => {
    const user = registeredUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setCurrentRole(user.role);
      setIsAuthenticated(true);
      setActiveNav('dashboard');
      if (user.id === 'usr_stu_2') {
        setStudent(SECOND_STUDENT);
      } else if (user.id === 'usr_stu_1') {
        setStudent(CURRENT_STUDENT);
      } else if (user.role === 'STUDENT') {
        setStudent({
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'STUDENT',
          avatarInitials: user.avatarInitials,
          departmentId: user.departmentId || 'dept_cse',
          studentIdNo: user.idNumber,
          currentSemester: user.semester || '6th Semester',
          academicYear: 'Spring 2026',
          cgpa: 3.65,
          currentSgpa: 3.60,
          targetSgpa: 3.85,
          totalCredits: 98,
          overallAttendance: 85,
          skills: ['Problem Solving', 'Data Structures', 'Web Development'],
          clubs: ['MU Computer Club']
        });
      }
      try {
        localStorage.setItem('edupulse_current_user', JSON.stringify(user));
        localStorage.setItem('edupulse_auth_state', 'true');
      } catch {}
    }
  };

  // QR Session countdown timer & token rotation
  useEffect(() => {
    if (!activeQRSession) return;
    const interval = setInterval(() => {
      setActiveQRSession((prev) => {
        if (!prev) return null;
        if (prev.isPaused) return prev;
        if (prev.remainingSeconds <= 1) {
          // Auto rotate token after timer expires
          const newToken = `METRO_${prev.courseCode.replace(/\s+/g, '')}_TOKEN_${Math.floor(1000 + Math.random() * 9000)}`;
          return {
            ...prev,
            previousToken: prev.token, // Store previous token so in-flight scans don't fail!
            token: newToken,
            createdAt: Date.now(),
            remainingSeconds: prev.expiresInSeconds
          };
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQRSession?.sessionId, activeQRSession?.isPaused]);

  // Early Warning Engine: Determine risk level based on configured thresholds
  const computeRiskLevel = (attendance: number, marksPercent: number): RiskLevel => {
    if (
      attendance < earlyWarningRules.warningAttendanceThreshold ||
      marksPercent < earlyWarningRules.warningMarksThreshold
    ) {
      return 'CRITICAL';
    }
    if (
      attendance < earlyWarningRules.safeAttendanceThreshold ||
      marksPercent < earlyWarningRules.safeMarksThreshold
    ) {
      return 'WARNING';
    }
    return 'SAFE';
  };

  const calculateGrade = (totalMarks: number): { grade: string; gradePoint: number } => {
    if (totalMarks >= 80) return { grade: 'A+', gradePoint: 4.00 };
    if (totalMarks >= 75) return { grade: 'A', gradePoint: 3.75 };
    if (totalMarks >= 70) return { grade: 'A-', gradePoint: 3.50 };
    if (totalMarks >= 65) return { grade: 'B+', gradePoint: 3.25 };
    if (totalMarks >= 60) return { grade: 'B', gradePoint: 3.00 };
    if (totalMarks >= 55) return { grade: 'B-', gradePoint: 2.75 };
    if (totalMarks >= 50) return { grade: 'C+', gradePoint: 2.50 };
    if (totalMarks >= 45) return { grade: 'C', gradePoint: 2.25 };
    if (totalMarks >= 40) return { grade: 'D', gradePoint: 2.00 };
    return { grade: 'F', gradePoint: 0.00 };
  };

  const recomputeStudentMetrics = (updatedEvaluations: CourseEvaluation[]) => {
    const studentEvals = updatedEvaluations.filter((e) => e.studentId === student.id);
    if (studentEvals.length > 0) {
      const totalCreds = studentEvals.reduce((acc, curr) => acc + curr.creditHours, 0);
      const totalWeightedPoints = studentEvals.reduce(
        (acc, curr) => acc + curr.gradePoint * curr.creditHours,
        0
      );
      const newSgpa = Number((totalWeightedPoints / totalCreds).toFixed(2));
      const avgAtt = Math.round(
        studentEvals.reduce((acc, curr) => acc + curr.attendancePercent, 0) / studentEvals.length
      );
      setStudent((prev) => ({
        ...prev,
        currentSgpa: newSgpa,
        overallAttendance: avgAtt
      }));
    }
  };

  // Start a QR Session: Default to 120s (2 minutes), with selectable durations
  const startQRSession = (
    courseCode: string,
    section: string,
    room: string,
    durationSec: number = 120
  ) => {
    const matchedCourse = courses.find((c) => c.courseCode === courseCode) || courses[0];
    const newSession: ActiveQRSession = {
      sessionId: `qr_sess_${Date.now()}`,
      courseId: matchedCourse.id,
      courseCode: matchedCourse.courseCode,
      courseName: matchedCourse.courseName,
      teacherId: teacher.id,
      section,
      room,
      token: `METRO_${courseCode.replace(/\s+/g, '')}_TOKEN_${Math.floor(1000 + Math.random() * 9000)}`,
      previousToken: undefined,
      createdAt: Date.now(),
      expiresInSeconds: durationSec,
      remainingSeconds: durationSec,
      isPaused: false,
      attendeesScanned: []
    };
    setActiveQRSession(newSession);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'DYNAMIC_QR_SESSION_CREATED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Generated active ${durationSec}s QR attendance session for ${courseCode} (${section})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const stopQRSession = () => {
    setActiveQRSession(null);
  };

  // Extend QR duration (+60s, +120s, etc.)
  const extendQRSession = (additionalSeconds: number = 60) => {
    if (!activeQRSession) return;
    setActiveQRSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        remainingSeconds: prev.remainingSeconds + additionalSeconds,
        expiresInSeconds: Math.max(prev.expiresInSeconds, prev.remainingSeconds + additionalSeconds)
      };
    });
  };

  // Pause or Resume QR countdown
  const toggleQRSessionPause = () => {
    if (!activeQRSession) return;
    setActiveQRSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isPaused: !prev.isPaused
      };
    });
  };

  // Student QR Scanner: Accepts both current token and previousToken (grace window)
  const scanQRCode = (token: string): { success: boolean; message: string } => {
    if (!activeQRSession) {
      return { success: false, message: 'No active lecture QR session is currently open.' };
    }
    const cleanInput = token.trim();
    const isValidToken =
      cleanInput === activeQRSession.token ||
      (activeQRSession.previousToken && cleanInput === activeQRSession.previousToken);

    if (!isValidToken) {
      return { success: false, message: 'Invalid or expired QR token! Please scan the current lecture screen.' };
    }

    // Check if student already scanned
    const alreadyScanned = activeQRSession.attendeesScanned.some((a) => a.studentId === student.id);
    if (alreadyScanned) {
      return { success: false, message: 'Attendance already recorded for this lecture session!' };
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedAttendees = [
      ...activeQRSession.attendeesScanned,
      {
        studentId: student.id,
        studentName: student.name,
        studentIdNo: student.studentIdNo,
        scannedAt: nowTime
      }
    ];

    setActiveQRSession({
      ...activeQRSession,
      attendeesScanned: updatedAttendees
    });

    // Update student's attendance for this course
    const targetCourseCode = activeQRSession.courseCode;
    const updatedEvaluations = evaluations.map((ev) => {
      if (ev.studentId === student.id && ev.courseCode === targetCourseCode) {
        const newAttPercent = Math.min(100, ev.attendancePercent + 4);
        const newAttMarks = Number(((newAttPercent / 100) * 10).toFixed(1));
        const newTotal = Math.round(ev.quizMarks + ev.assignmentMarks + newAttMarks + ev.finalExamMarks);
        const { grade, gradePoint } = calculateGrade(newTotal);
        const newRisk = computeRiskLevel(newAttPercent, newTotal);
        return {
          ...ev,
          attendancePercent: newAttPercent,
          attendanceMarks: newAttMarks,
          totalMarks: newTotal,
          grade,
          gradePoint,
          riskLevel: newRisk,
          statusToday: 'PRESENT' as const,
          lastUpdated: 'Just now'
        };
      }
      return ev;
    });

    setEvaluations(updatedEvaluations);
    recomputeStudentMetrics(updatedEvaluations);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'QR_ATTENDANCE_LOGGED',
      user: student.name,
      role: 'STUDENT',
      details: `Successfully checked into ${targetCourseCode} via QR scanner`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);

    return {
      success: true,
      message: `Verified! Attendance recorded for ${activeQRSession.courseCode} (${activeQRSession.section}).`
    };
  };

  // Manual Attendance Toggle (Single student) - Smooth, reactive & responsive!
  const toggleManualAttendance = (
    studentId: string,
    courseCode: string,
    newStatus: 'PRESENT' | 'ABSENT' | 'LATE'
  ) => {
    const updatedEvaluations = evaluations.map((ev) => {
      if (ev.studentId === studentId && ev.courseCode === courseCode) {
        const currentStatus = ev.statusToday || 'ABSENT';
        let delta = 0;
        if (newStatus === 'PRESENT' && currentStatus !== 'PRESENT') {
          delta = 4;
        } else if (newStatus === 'ABSENT' && currentStatus === 'PRESENT') {
          delta = -4;
        } else if (newStatus === 'LATE' && currentStatus !== 'LATE') {
          delta = currentStatus === 'PRESENT' ? -2 : 2;
        }

        const newAttPercent = Math.max(0, Math.min(100, ev.attendancePercent + delta));
        const newAttMarks = Number(((newAttPercent / 100) * 10).toFixed(1));
        const newTotal = Math.round(ev.quizMarks + ev.assignmentMarks + newAttMarks + ev.finalExamMarks);
        const { grade, gradePoint } = calculateGrade(newTotal);
        const newRisk = computeRiskLevel(newAttPercent, newTotal);
        return {
          ...ev,
          attendancePercent: newAttPercent,
          attendanceMarks: newAttMarks,
          totalMarks: newTotal,
          grade,
          gradePoint,
          riskLevel: newRisk,
          statusToday: newStatus,
          lastUpdated: 'Manual Roll Call'
        };
      }
      return ev;
    });

    setEvaluations(updatedEvaluations);
    recomputeStudentMetrics(updatedEvaluations);

    const targetStudent = evaluations.find((e) => e.studentId === studentId);
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'MANUAL_ATTENDANCE_OVERRIDE',
      user: teacher.name,
      role: 'TEACHER',
      details: `Marked ${targetStudent?.studentName || studentId} as ${newStatus} in ${courseCode}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Batch Mark Attendance (e.g. Mark All Present, Mark All Absent)
  const batchMarkAttendance = (courseCode: string, status: 'PRESENT' | 'ABSENT') => {
    const updatedEvaluations = evaluations.map((ev) => {
      if (ev.courseCode === courseCode) {
        const delta = status === 'PRESENT' ? 4 : -4;
        const newAttPercent = Math.max(0, Math.min(100, ev.attendancePercent + delta));
        const newAttMarks = Number(((newAttPercent / 100) * 10).toFixed(1));
        const newTotal = Math.round(ev.quizMarks + ev.assignmentMarks + newAttMarks + ev.finalExamMarks);
        const { grade, gradePoint } = calculateGrade(newTotal);
        const newRisk = computeRiskLevel(newAttPercent, newTotal);
        return {
          ...ev,
          attendancePercent: newAttPercent,
          attendanceMarks: newAttMarks,
          totalMarks: newTotal,
          grade,
          gradePoint,
          riskLevel: newRisk,
          statusToday: status,
          lastUpdated: `Batch marked ${status}`
        };
      }
      return ev;
    });

    setEvaluations(updatedEvaluations);
    recomputeStudentMetrics(updatedEvaluations);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'BATCH_ATTENDANCE_UPDATED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Batch marked all enrolled students as ${status} in ${courseCode}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Continuous Assessment Entry (Teacher)
  const updateStudentMarks = (
    evaluationId: string,
    marks: { quizMarks?: number; assignmentMarks?: number; finalExamMarks?: number }
  ) => {
    const updated = evaluations.map((ev) => {
      if (ev.id === evaluationId) {
        const qMarks = marks.quizMarks !== undefined ? marks.quizMarks : ev.quizMarks;
        const aMarks = marks.assignmentMarks !== undefined ? marks.assignmentMarks : ev.assignmentMarks;
        const fMarks = marks.finalExamMarks !== undefined ? marks.finalExamMarks : ev.finalExamMarks;
        const attMarks = Number(((ev.attendancePercent / 100) * 10).toFixed(1));
        const total = Math.round(qMarks + aMarks + attMarks + fMarks);
        const { grade, gradePoint } = calculateGrade(total);
        const newRisk = computeRiskLevel(ev.attendancePercent, total);
        return {
          ...ev,
          quizMarks: qMarks,
          assignmentMarks: aMarks,
          finalExamMarks: fMarks,
          attendanceMarks: attMarks,
          totalMarks: total,
          grade,
          gradePoint,
          riskLevel: newRisk,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return ev;
    });
    setEvaluations(updated);
    recomputeStudentMetrics(updated);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'CONTINUOUS_ASSESSMENT_ENTERED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Updated continuous assessment record #${evaluationId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Bulk CSV Import Simulator
  const bulkImportMarks = (
    data: { studentIdNo: string; courseCode: string; quiz: number; assignment: number; finalExam: number }[]
  ): { importedCount: number } => {
    let count = 0;
    const updated = evaluations.map((ev) => {
      const match = data.find((d) => d.studentIdNo === ev.studentIdNo && d.courseCode === ev.courseCode);
      if (match) {
        count++;
        const attMarks = Number(((ev.attendancePercent / 100) * 10).toFixed(1));
        const total = Math.round(match.quiz + match.assignment + attMarks + match.finalExam);
        const { grade, gradePoint } = calculateGrade(total);
        const newRisk = computeRiskLevel(ev.attendancePercent, total);
        return {
          ...ev,
          quizMarks: match.quiz,
          assignmentMarks: match.assignment,
          finalExamMarks: match.finalExam,
          attendanceMarks: attMarks,
          totalMarks: total,
          grade,
          gradePoint,
          riskLevel: newRisk,
          lastUpdated: 'Bulk CSV Import'
        };
      }
      return ev;
    });
    setEvaluations(updated);
    recomputeStudentMetrics(updated);
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'BULK_CSV_IMPORT_COMPLETED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Imported marks dataset for ${count} student assessment rows`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
    return { importedCount: count };
  };

  // Full Continuous Assessment Entry with Best 2 of 3 CT, Midterm, and Final Exam
  const updateStudentAssessmentFull = (
    evaluationId: string,
    data: {
      ctMarks?: [number, number, number];
      midtermMarks?: number;
      assignmentMarks?: number;
      finalExamMarks?: number;
      quizMarks?: number;
    }
  ) => {
    const updated = evaluations.map((ev) => {
      if (ev.id === evaluationId) {
        const ct = data.ctMarks || ev.ctMarks || [ev.quizMarks, ev.quizMarks, ev.quizMarks];
        const sorted = [...ct].sort((a, b) => b - a);
        const bestCt = Number(((sorted[0] + sorted[1]) / 2).toFixed(1));
        const mid = data.midtermMarks !== undefined ? data.midtermMarks : (ev.midtermMarks || 18);
        const assign = data.assignmentMarks !== undefined ? data.assignmentMarks : ev.assignmentMarks;
        const finalEx = data.finalExamMarks !== undefined ? data.finalExamMarks : ev.finalExamMarks;
        const attMarks = Number(((ev.attendancePercent / 100) * 10).toFixed(1));

        // Continuous Internal Total = Best 2 of 3 CT (20) + Midterm (20) + Assignment (10) + Attendance (10) = 60
        // Scaled standard total out of 100: Internal (bestCt + assign + attMarks + mid) + Final Exam
        // Or if standard: bestCt (20) + assign (20) + attMarks (10) + final (50) = 100
        const internalContinuous = Number((bestCt + assign + attMarks).toFixed(1));
        const total = Math.min(100, Math.round(bestCt + assign + attMarks + finalEx));
        const { grade, gradePoint } = calculateGrade(total);

        // Early warning risk logic
        let risk: RiskLevel = 'SAFE';
        if (ev.attendancePercent < 70 && (total < 55 || bestCt < 10)) {
          risk = 'CRITICAL';
        } else if (ev.attendancePercent < 75 || total < 60) {
          risk = 'WARNING';
        }

        return {
          ...ev,
          ctMarks: ct,
          bestCtAverage: bestCt,
          midtermMarks: mid,
          continuousAssessmentTotal: internalContinuous,
          assignmentMarks: assign,
          quizMarks: bestCt, // sync quizMarks with best CT
          finalExamMarks: finalEx,
          attendanceMarks: attMarks,
          totalMarks: total,
          grade,
          gradePoint,
          riskLevel: risk,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return ev;
    });

    setEvaluations(updated);
    recomputeStudentMetrics(updated);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'CONTINUOUS_ASSESSMENT_CALCULATED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Computed UGC Best-of-N Class Tests and Final Grade for student record #${evaluationId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Low Attendance Auto-Warning Notification (1-Click)
  const sendLowAttendanceWarning = (evaluationId: string): { success: boolean; message: string } => {
    const target = evaluations.find((e) => e.id === evaluationId);
    if (!target) {
      return { success: false, message: 'Student evaluation record not found.' };
    }

    const updated = evaluations.map((e) => {
      if (e.id === evaluationId) {
        return {
          ...e,
          lowAttendanceWarningSent: true,
          warningSentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          remarks: `Official warning issued: Attendance at ${e.attendancePercent}% (below 70%). Non-collegiate / discollegiate status pending.`
        };
      }
      return e;
    });
    setEvaluations(updated);

    // Auto-create official institutional notice
    const warningNotice: Notice = {
      id: `notif_warn_${Date.now()}`,
      title: `[OFFICIAL WARNING] Low Attendance Alert: ${target.studentName} (${target.studentIdNo})`,
      content: `Attention ${target.studentName}: Your recorded attendance in ${target.courseCode} (${target.courseName}) is currently ${target.attendancePercent}%, which falls below the institutional 70% threshold. Immediate counseling with Course Instructor ${teacher.name} and your Academic Advisor is mandated to remain eligible for Semester Final Examinations.`,
      type: 'COURSE_SPECIFIC',
      targetCourseId: target.courseId,
      targetCourseCode: target.courseCode,
      createdByName: `${teacher.name} (Faculty)`,
      createdByRole: 'FACULTY_ADVISOR',
      createdAt: new Date().toISOString().split('T')[0],
      isPinned: true
    };
    setNotices((prev) => [warningNotice, ...prev]);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'LOW_ATTENDANCE_WARNING_DISPATCHED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Dispatched formal attendance shortage notice to ${target.studentName} (${target.studentIdNo}) & Academic Advisor`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'ALERT'
    };
    setAuditLogs((prev) => [log, ...prev]);

    return {
      success: true,
      message: `Formal attendance warning dispatched to ${target.studentName} (${target.studentIdNo}) and Academic Advisor.`
    };
  };

  // Schedule Academic Counseling for High-Risk Students
  const scheduleAcademicCounseling = (evaluationId: string, notes: string) => {
    const updated = evaluations.map((e) => {
      if (e.id === evaluationId) {
        return {
          ...e,
          counselingStatus: 'SCHEDULED' as const,
          counselingNotes: notes,
          remarks: `Academic counseling session scheduled: ${notes}`
        };
      }
      return e;
    });
    setEvaluations(updated);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'ACADEMIC_COUNSELING_SCHEDULED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Scheduled high-risk intervention counseling: "${notes}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Class Routine Management
  const addClassRoutineItem = (itemData: Omit<ClassRoutineItem, 'id'>) => {
    const newItem: ClassRoutineItem = {
      ...itemData,
      id: `rt_${Date.now()}`
    };
    setClassRoutine((prev) => [newItem, ...prev]);
  };

  const deleteClassRoutineItem = (id: string) => {
    setClassRoutine((prev) => prev.filter((item) => item.id !== id));
  };

  // Assignments
  const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsg: Assignment = {
      ...assignmentData,
      id: `asg_${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAssignments((prev) => [newAsg, ...prev]);
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'ASSIGNMENT_PUBLISHED',
      user: teacher.name,
      role: 'TEACHER',
      details: `Posted assignment "${assignmentData.title}" for ${assignmentData.courseCode}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const submitAssignment = (assignmentId: string, fileName: string, fileSize: string) => {
    const targetAsg = assignments.find((a) => a.id === assignmentId);
    const newSubmission: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      assignmentId,
      assignmentTitle: targetAsg ? targetAsg.title : 'Course Assignment',
      studentId: student.id,
      studentName: student.name,
      studentIdNo: student.studentIdNo,
      fileName,
      fileSize,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'SUBMITTED'
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            marksObtained: marks,
            feedback,
            status: 'GRADED'
          };
        }
        return s;
      })
    );
  };

  // Study Materials
  const uploadStudyMaterial = (materialData: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => {
    const newMat: StudyMaterial = {
      ...materialData,
      id: `mat_${Date.now()}`,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setStudyMaterials((prev) => [newMat, ...prev]);
  };

  // Previous Results Pipeline
  const submitPreviousResult = (semesterName: string, sgpa: number, credits: number) => {
    const newRes: PreviousResult = {
      id: `pr_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentIdNo: student.studentIdNo,
      semesterName,
      sgpa,
      creditsCompleted: credits,
      status: 'PENDING',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 10)
    };
    setPreviousResults((prev) => [...prev, newRes]);
  };

  const verifyPreviousResult = (resultId: string, approved: boolean, reason?: string) => {
    setPreviousResults((prev) =>
      prev.map((res) => {
        if (res.id === resultId) {
          return {
            ...res,
            status: approved ? 'VERIFIED' : 'REJECTED',
            verifiedBy: teacher.name,
            verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 10),
            rejectionReason: approved ? undefined : reason || 'Discrepancy in submitted transcript copy'
          };
        }
        return res;
      })
    );

    if (approved) {
      const verified = previousResults.filter((r) => r.status === 'VERIFIED' || r.id === resultId);
      if (verified.length > 0) {
        const totalCred = verified.reduce((acc, curr) => acc + curr.creditsCompleted, 0);
        const totalPoints = verified.reduce((acc, curr) => acc + curr.sgpa * curr.creditsCompleted, 0);
        const newCgpa = Number((totalPoints / totalCred).toFixed(2));
        setStudent((s) => ({
          ...s,
          cgpa: newCgpa,
          totalCredits: totalCred
        }));
      }
    }
  };

  // Notices
  const createNotice = (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `ntc_${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  };

  // Admin Operations
  const addDepartment = (deptData: Omit<Department, 'id' | 'totalStudents' | 'totalFaculty'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept_${deptData.deptCode.toLowerCase()}_${Date.now()}`,
      totalStudents: 0,
      totalFaculty: 1
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'totalClassesHeld'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs_${Date.now()}`,
      totalClassesHeld: 0
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addSemester = (semData: Omit<Semester, 'id'>) => {
    const newSem: Semester = {
      ...semData,
      id: `sem_${Date.now()}`
    };
    setSemesters((prev) => [...prev, newSem]);
  };

  const createAllocation = (allocData: Omit<CourseAllocation, 'id'>) => {
    const newAlloc: CourseAllocation = {
      ...allocData,
      id: `alloc_${Date.now()}`
    };
    setAllocations((prev) => [...prev, newAlloc]);
  };

  const updateAllocation = (id: string, updates: Partial<CourseAllocation>) => {
    setAllocations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const bulkImportAllocations = (newAllocations: Omit<CourseAllocation, 'id'>[]): { importedCount: number } => {
    const created: CourseAllocation[] = newAllocations.map((a, i) => ({
      ...a,
      id: `alloc_imp_${Date.now()}_${i}`
    }));
    setAllocations((prev) => [...created, ...prev]);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'BULK_COURSE_ALLOCATION_IMPORTED',
      user: admin.name,
      role: 'ADMIN',
      details: `Imported ${created.length} course allocation entries via CSV dataset`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);

    return { importedCount: created.length };
  };

  const deleteAllocation = (id: string) => {
    setAllocations((prev) => prev.filter((a) => a.id !== id));
  };

  const updateEarlyWarningRules = (updatedRules: Partial<EarlyWarningRules>) => {
    const merged = { ...earlyWarningRules, ...updatedRules };
    setEarlyWarningRules(merged);
    const recomputed = evaluations.map((ev) => {
      const risk =
        ev.attendancePercent < merged.warningAttendanceThreshold || ev.totalMarks < merged.warningMarksThreshold
          ? 'CRITICAL'
          : ev.attendancePercent < merged.safeAttendanceThreshold || ev.totalMarks < merged.safeMarksThreshold
          ? 'WARNING'
          : 'SAFE';
      return { ...ev, riskLevel: risk as RiskLevel };
    });
    setEvaluations(recomputed);
  };

  // Student & Faculty Directory CRUD
  const addRegisteredUser = (userData: Omit<RegisteredUser, 'id' | 'createdAt'>) => {
    const initials =
      userData.name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'MU';

    const newUser: RegisteredUser = {
      ...userData,
      id: `usr_${userData.role.toLowerCase()}_${Date.now()}`,
      avatarInitials: initials,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRegisteredUsers((prev) => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem('edupulse_registered_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: `ADMIN_CREATED_${userData.role}`,
      user: admin.name,
      role: 'ADMIN',
      details: `Created new ${userData.role} entry for ${userData.name} (${userData.idNumber})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'INFO'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const updateRegisteredUser = (id: string, updates: Partial<RegisteredUser>) => {
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, ...updates } : u));
      try {
        localStorage.setItem('edupulse_registered_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteRegisteredUser = (id: string) => {
    setRegisteredUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem('edupulse_registered_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const bulkImportStudents = (data: Partial<RegisteredUser>[]): { importedCount: number; errors: string[] } => {
    const created: RegisteredUser[] = [];
    const errors: string[] = [];

    data.forEach((item, index) => {
      if (!item.name || !item.idNumber) {
        errors.push(`Row ${index + 1}: Name and Student ID are required.`);
        return;
      }

      const initials = (item.name || 'Student')
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'ST';

      created.push({
        id: `usr_stu_csv_${Date.now()}_${index}`,
        name: item.name,
        idNumber: item.idNumber,
        email: item.email || `${item.idNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}@metrouni.edu.bd`,
        password: item.password || 'password123',
        role: 'STUDENT',
        departmentId:
          item.departmentId ||
          (item.departmentName?.toLowerCase().includes('eee')
            ? 'dept_eee'
            : item.departmentName?.toLowerCase().includes('bba')
            ? 'dept_bba'
            : 'dept_cse'),
        departmentName: item.departmentName || 'Computer Science & Engineering',
        batch: item.batch || '58th Batch',
        section: item.section || 'Section A',
        semester: item.semester || '6th Semester',
        enrolledCourses: item.enrolledCourses || ['CSE 301', 'CSE 303', 'CSE 305'],
        avatarInitials: initials,
        createdAt: new Date().toISOString().split('T')[0]
      });
    });

    if (created.length > 0) {
      setRegisteredUsers((prev) => {
        const merged = [...created, ...prev];
        try {
          localStorage.setItem('edupulse_registered_users', JSON.stringify(merged));
        } catch {}
        return merged;
      });

      const log: AuditLog = {
        id: `log_${Date.now()}`,
        action: 'BULK_STUDENTS_CSV_IMPORTED',
        user: admin.name,
        role: 'ADMIN',
        details: `Imported ${created.length} students across departments and batches via CSV`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'INFO'
      };
      setAuditLogs((prev) => [log, ...prev]);
    }

    return { importedCount: created.length, errors };
  };

  const bulkImportTeachers = (data: Partial<RegisteredUser>[]): { importedCount: number; errors: string[] } => {
    const created: RegisteredUser[] = [];
    const errors: string[] = [];

    data.forEach((item, index) => {
      if (!item.name || !item.idNumber) {
        errors.push(`Row ${index + 1}: Name and Faculty ID are required.`);
        return;
      }

      const initials = (item.name || 'Faculty')
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'FA';

      created.push({
        id: `usr_tea_csv_${Date.now()}_${index}`,
        name: item.name,
        idNumber: item.idNumber,
        email: item.email || `${item.idNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}@metrouni.edu.bd`,
        password: item.password || 'password123',
        role: 'TEACHER',
        departmentId:
          item.departmentId ||
          (item.departmentName?.toLowerCase().includes('eee')
            ? 'dept_eee'
            : item.departmentName?.toLowerCase().includes('bba')
            ? 'dept_bba'
            : 'dept_cse'),
        departmentName: item.departmentName || 'Computer Science & Engineering',
        designation: item.designation || 'Lecturer',
        assignedCourses: item.assignedCourses || ['CSE 301'],
        avatarInitials: initials,
        createdAt: new Date().toISOString().split('T')[0]
      });
    });

    if (created.length > 0) {
      setRegisteredUsers((prev) => {
        const merged = [...created, ...prev];
        try {
          localStorage.setItem('edupulse_registered_users', JSON.stringify(merged));
        } catch {}
        return merged;
      });

      const log: AuditLog = {
        id: `log_${Date.now()}`,
        action: 'BULK_TEACHERS_CSV_IMPORTED',
        user: admin.name,
        role: 'ADMIN',
        details: `Imported ${created.length} teachers/faculty members via CSV`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'INFO'
      };
      setAuditLogs((prev) => [log, ...prev]);
    }

    return { importedCount: created.length, errors };
  };

  const getCourseEnrollmentStats = (): CourseEnrollmentSummary[] => {
    const allStudents = registeredUsers.filter((u) => u.role === 'STUDENT');

    return courses.map((course) => {
      // Find students enrolled in this course
      const matchingStudents = allStudents.filter((s) => {
        if (s.enrolledCourses && s.enrolledCourses.length > 0) {
          return s.enrolledCourses.some((c) => c.toUpperCase() === course.courseCode.toUpperCase());
        }
        return s.departmentName.toLowerCase().includes('computer') || s.departmentName.toLowerCase().includes('cse');
      });

      // Find teacher assigned to this course
      const teacherAlloc = allocations.find((a) => a.courseCode.toUpperCase() === course.courseCode.toUpperCase());
      const teacherUser = registeredUsers.find(
        (u) =>
          u.role === 'TEACHER' &&
          u.assignedCourses?.some((c) => c.toUpperCase() === course.courseCode.toUpperCase())
      );
      const assignedTeacher = teacherAlloc?.teacherName || teacherUser?.name || 'Unassigned / TBA';

      // Section counts
      const sectionMap: Record<string, number> = {};
      const batchMap: Record<string, number> = {};

      matchingStudents.forEach((st) => {
        const sec = st.section || 'Section A';
        const bat = st.batch || course.batch || '58th Batch';
        sectionMap[sec] = (sectionMap[sec] || 0) + 1;
        batchMap[bat] = (batchMap[bat] || 0) + 1;
      });

      const sections = Object.entries(sectionMap).map(([section, studentCount]) => ({ section, studentCount }));
      const batches = Object.entries(batchMap).map(([batch, studentCount]) => ({ batch, studentCount }));

      const totalCount = Math.max(
        matchingStudents.length,
        course.totalStudents || 0,
        teacherAlloc?.enrolledStudentsCount || 0
      );

      return {
        courseCode: course.courseCode,
        courseName: course.courseName,
        departmentName: course.departmentName || 'Computer Science & Engineering',
        creditHours: course.creditHours,
        assignedTeacher,
        totalStudents: totalCount,
        sections: sections.length > 0 ? sections : [{ section: 'Section A', studentCount: totalCount }],
        batches: batches.length > 0 ? batches : [{ batch: course.batch || '58th Batch', studentCount: totalCount }],
        students: matchingStudents.map((s) => ({
          studentIdNo: s.idNumber,
          name: s.name,
          batch: s.batch || '58th Batch',
          section: s.section || 'Section A',
          email: s.email
        }))
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        // Global Theme & Display Mode
        isDarkMode,
        setIsDarkMode,
        toggleTheme,
        themeColor,
        setThemeColor,
        customHex,
        setCustomHex,
        currentUser,
        isAuthenticated,
        registeredUsers,
        login,
        register,
        logout,
        switchUser,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
        activeNav,
        setActiveNav,
        student,
        teacher,
        admin,
        departments,
        semesters,
        courses,
        allocations,
        evaluations,
        previousResults,
        notices,
        assignments,
        submissions,
        studyMaterials,
        earlyWarningRules,
        auditLogs,
        activeQRSession,
        startQRSession,
        stopQRSession,
        extendQRSession,
        toggleQRSessionPause,
        scanQRCode,
        toggleManualAttendance,
        batchMarkAttendance,
        updateStudentMarks,
        updateStudentAssessmentFull,
        bulkImportMarks,
        sendLowAttendanceWarning,
        scheduleAcademicCounseling,
        classRoutine,
        addClassRoutineItem,
        deleteClassRoutineItem,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        uploadStudyMaterial,
        submitPreviousResult,
        verifyPreviousResult,
        createNotice,
        deleteNotice,
        addDepartment,
        deleteDepartment,
        addCourse,
        updateCourse,
        deleteCourse,
        addSemester,
        createAllocation,
        updateAllocation,
        bulkImportAllocations,
        deleteAllocation,
        updateEarlyWarningRules,
        addRegisteredUser,
        updateRegisteredUser,
        deleteRegisteredUser,
        bulkImportStudents,
        bulkImportTeachers,
        getCourseEnrollmentStats,
        computeRiskLevel,
        calculateGrade
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
