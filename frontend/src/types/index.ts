export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL';
export type ResultStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type NoticeType = 'GENERAL' | 'UNIVERSITY_HOLIDAY' | 'COURSE_SPECIFIC';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  idNumber: string; // studentIdNo, teacherIdNo, or adminIdNo
  departmentId: string;
  departmentName: string;
  designation?: string;
  semester?: string;
  batch?: string; // e.g. '58th Batch'
  section?: string; // e.g. 'Section A'
  enrolledCourses?: string[]; // e.g. ['CSE 301', 'CSE 303']
  assignedCourses?: string[]; // e.g. ['CSE 301', 'CSE 303']
  avatarInitials: string;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  idNumber: string;
  departmentId: string;
  departmentName?: string;
  designation?: string;
  semester?: string;
  batch?: string;
  section?: string;
  enrolledCourses?: string[];
  assignedCourses?: string[];
}

export interface CourseEnrollmentSummary {
  courseCode: string;
  courseName: string;
  departmentName: string;
  creditHours: number;
  assignedTeacher: string;
  totalStudents: number;
  sections: { section: string; studentCount: number }[];
  batches: { batch: string; studentCount: number }[];
  students: {
    studentIdNo: string;
    name: string;
    batch: string;
    section: string;
    email: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  departmentId: string;
}

export interface StudentProfile extends User {
  studentIdNo: string;
  currentSemester: string;
  academicYear: string;
  cgpa: number;
  currentSgpa: number;
  targetSgpa: number;
  totalCredits: number;
  overallAttendance: number;
  skills: string[];
  clubs: string[];
}

export interface TeacherProfile extends User {
  teacherIdNo: string;
  designation: string;
  assignedCourseCodes: string[];
  officeRoom: string;
}

export interface AdminProfile extends User {
  adminIdNo: string;
  designation: string;
}

export interface Department {
  id: string;
  deptCode: string;
  deptName: string;
  totalStudents: number;
  totalFaculty: number;
  headOfDept: string;
}

export interface Semester {
  id: string;
  semesterName: string;
  academicYear: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  creditHours: number;
  departmentId: string;
  departmentName?: string;
  totalClassesHeld: number;
  totalStudents?: number;
  batch?: string;
}

export interface CourseAllocation {
  id: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  semesterId: string;
  section: string;
  batch?: string;
  departmentName?: string;
  enrolledStudentsCount?: number;
  scheduleTime: string;
  room: string;
}

export interface CourseEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  studentIdNo: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  creditHours: number;
  attendancePercent: number;
  ctMarks?: [number, number, number]; // CT1, CT2, CT3
  bestCtAverage?: number; // Best 2 of 3
  midtermMarks?: number; // Midterm exam marks
  continuousAssessmentTotal?: number; // Combined internal (CT + Assignment + Attendance)
  quizMarks: number;
  assignmentMarks: number;
  attendanceMarks: number;
  finalExamMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
  riskLevel: RiskLevel;
  batch?: string;
  section?: string;
  remarks?: string;
  lastUpdated: string;
  statusToday?: 'PRESENT' | 'ABSENT' | 'LATE';
  lowAttendanceWarningSent?: boolean;
  warningSentAt?: string;
  counselingStatus?: 'NONE' | 'SCHEDULED' | 'COMPLETED';
  counselingNotes?: string;
}

export interface ClassRoutineItem {
  id: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  teacherId?: string;
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  startTime: string; // e.g. "09:30 AM"
  endTime: string;   // e.g. "11:00 AM"
  room: string;      // e.g. "Room 402" or "Lab 3"
  building?: string; // e.g. "Academic Building 1, 4th Floor"
  batch: string;     // e.g. "58th Batch"
  section: string;   // e.g. "Section A"
  type: 'THEORY' | 'LAB';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentIdNo: string;
  courseId: string;
  courseCode: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  verificationMethod: 'QR_SCAN' | 'MANUAL_OVERRIDE';
}

export interface ActiveQRSession {
  sessionId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  section: string;
  room: string;
  token: string;
  previousToken?: string;
  createdAt: number;
  expiresInSeconds: number;
  remainingSeconds: number;
  isPaused?: boolean;
  attendeesScanned: {
    studentId: string;
    studentName: string;
    studentIdNo: string;
    scannedAt: string;
  }[];
}

export interface PreviousResult {
  id: string;
  studentId: string;
  studentName: string;
  studentIdNo: string;
  semesterName: string;
  sgpa: number;
  creditsCompleted: number;
  status: ResultStatus;
  submittedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: NoticeType;
  targetCourseId?: string;
  targetCourseCode?: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
  isPinned: boolean;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  attachmentUrl?: string;
  attachmentName?: string;
  totalMarks: number;
  dueDate: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentIdNo: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  marksObtained?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
}

export interface StudyMaterial {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  category: 'LECTURE_SLIDE' | 'LAB_MANUAL' | 'HANDOUT' | 'CODE_REPO';
  weekNumber: number;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface EarlyWarningRules {
  safeAttendanceThreshold: number;
  warningAttendanceThreshold: number;
  safeMarksThreshold: number;
  warningMarksThreshold: number;
  autoSendAdvisoryEmail: boolean;
  requireFacultyInterventionOnCritical: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  details: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ALERT';
}
