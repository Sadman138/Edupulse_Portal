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
  StudentRosterItem
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
  login: (email: string, role: UserRole) => void;
  logout: () => void;

  // Active view navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

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
  updateDepartment: (id: string, dept: Partial<DepartmentItem>) => void;
  deleteDepartment: (id: string) => void;

  semesters: SemesterItem[];
  addSemester: (sem: Omit<SemesterItem, 'id'>) => void;
  updateSemester: (id: string, sem: Partial<SemesterItem>) => void;
  deleteSemester: (id: string) => void;
  setActiveSemester: (id: string) => void;

  adminCourses: any[];
  addCourse: (course: any) => void;
  updateCourse: (id: string, course: any) => void;
  deleteCourse: (id: string) => void;

  instructors: InstructorItem[];
  addInstructor: (inst: Omit<InstructorItem, 'id'>) => void;
  updateInstructor: (id: string, inst: Partial<InstructorItem>) => void;
  deleteInstructor: (id: string) => void;

  studentsRegistry: StudentRegistryItem[];
  addStudentToRegistry: (student: Omit<StudentRegistryItem, 'id'>) => void;
  updateStudentInRegistry: (id: string, student: Partial<StudentRegistryItem>) => void;
  deleteStudentFromRegistry: (id: string) => void;

  courseAllocations: CourseAllocationItem[];
  addCourseAllocation: (alloc: Omit<CourseAllocationItem, 'id'>) => void;
  deleteCourseAllocation: (id: string) => void;

  // Modals & UI Controls
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isSwitchAccountModalOpen: boolean;
  setIsSwitchAccountModalOpen: (open: boolean) => void;
  pdfModalDoc: { title: string; category?: string; content?: string } | null;
  setPdfModalDoc: (doc: { title: string; category?: string; content?: string } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Auth & Role
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.teacher);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('teacher-dashboard');

  // Theming
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

  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.style.setProperty('--accent-color', theme.accentColor);
  }, [theme]);

  // Modals
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSwitchAccountModalOpen, setIsSwitchAccountModalOpen] = useState(false);
  const [pdfModalDoc, setPdfModalDoc] = useState<{ title: string; category?: string; content?: string } | null>(null);

  // Switch Role
  const switchRole = (role: UserRole) => {
    if (role === 'STUDENT') {
      setCurrentUser(DEMO_USERS.student);
      setActiveTab('dashboard');
    } else if (role === 'TEACHER') {
      setCurrentUser(DEMO_USERS.teacher);
      setActiveTab('teacher-dashboard');
    } else if (role === 'ADMIN') {
      setCurrentUser(DEMO_USERS.admin);
      setActiveTab('admin-dashboard');
    }
  };

  const login = (email: string, role: UserRole) => {
    setIsAuthenticated(true);
    switchRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

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
  const deleteCourseAllocation = (id: string) => {
    setCourseAllocations(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
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
        updateDepartment,
        deleteDepartment,
        semesters,
        addSemester,
        updateSemester,
        deleteSemester,
        setActiveSemester,
        adminCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        instructors,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        studentsRegistry,
        addStudentToRegistry,
        updateStudentInRegistry,
        deleteStudentFromRegistry,
        courseAllocations,
        addCourseAllocation,
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
