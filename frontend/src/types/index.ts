export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  departmentName: string;
  institution: string;
  // Student specific
  studentId?: string;
  batch?: string;
  currentSemester?: string;
  cgpa?: number;
  overallAttendance?: number;
  riskLevel?: RiskLevel;
  advisor?: string;
  // Teacher specific
  employeeId?: string;
  designation?: string;
  roomNumber?: string;
  phone?: string;
  assignedCoursesCount?: number;
  // Admin specific
  adminDesignation?: string;
  permissions?: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  department: string;
  semester: string;
  type: 'Theory' | 'Lab' | 'Project';
  instructorName?: string;
  instructorId?: string;
  section?: string;
  schedule?: string;
  room?: string;
}

export interface StudentCourseRecord {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  instructor: string;
  section: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  // Marks breakdown
  quizScore: number; // out of 20
  midtermScore: number; // out of 30
  assignmentScore: number; // out of 10
  finalExamScore: number; // out of 40 (or expected)
  totalMarksObtained: number;
  totalMarksPossible: number;
  currentGrade: string;
  currentGPA: number;
  riskLevel: RiskLevel;
  riskFactorNotes: string;
  redAlert: boolean;
}

export interface AttendanceRecord {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  timeSlot: string;
  room: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  verifiedVia: 'DYNAMIC_QR' | 'MANUAL_ROSTER' | 'BIOMETRIC';
  tokenUsed?: string;
}

export interface AssignmentItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  totalPoints: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  submissionDate?: string;
  submittedFileName?: string;
  obtainedScore?: number;
  facultyFeedback?: string;
  attachments?: string[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'General' | 'Exam' | 'Academic' | 'Holiday' | 'Emergency';
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  date: string;
  authorName: string;
  authorRole: string;
  content: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'DEPARTMENT';
  targetDepartment?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

export interface StudyMaterialItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  topic: string;
  unit: string;
  description: string;
  fileType: 'PDF' | 'SLIDES' | 'ZIP' | 'DOC' | 'CODE';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  downloadCount: number;
  downloadUrl?: string;
}

export interface PreviousResultSubmission {
  id: string;
  studentId: string;
  studentName: string;
  semesterName: string;
  completedCredits: number;
  gpa: number;
  type: 'Regular' | 'Retake' | 'Improvement' | 'Backlog';
  submissionDate: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verificationDate?: string;
  remarks?: string;
  documentName: string;
}

export interface CoCurricularActivity {
  id: string;
  title: string;
  category: 'Club' | 'Competition' | 'Sports' | 'Volunteering' | 'Research' | 'Leadership';
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  certificateProvided: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'VERIFIED';
}

export interface ClassRoutineItem {
  id: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  room: string;
  type: 'Theory' | 'Lab';
}

// Week 5 Teacher Types
export interface QrAttendanceSession {
  sessionId: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  date: string;
  startTime: string;
  expiresInSeconds: number;
  qrPayload: string;
  totalEnrolled: number;
  checkedInCount: number;
  isActive: boolean;
}

export interface StudentRosterItem {
  studentId: string;
  studentName: string;
  email: string;
  section: string;
  attendanceRate: number;
  currentMarks: number;
  riskLevel: RiskLevel;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface AssessmentRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  quiz1: number;
  quiz2: number;
  midterm: number;
  assignment: number;
  finalExam: number;
  total: number;
  letterGrade: string;
  gpa: number;
}

export interface HighRiskAlert {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  attendanceRate: number;
  marksScore: number;
  riskFactor: string;
  status: 'ACTIVE_ALERT' | 'INTERVENTION_SENT' | 'MEETING_SCHEDULED' | 'RESOLVED';
  interventionHistory: {
    date: string;
    action: string;
    note: string;
    by: string;
  }[];
}

// Week 5 Admin Types
export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  chairPerson: string;
  facultyCount: number;
  studentCount: number;
  establishedYear: number;
  email: string;
}

export interface SemesterItem {
  id: string;
  name: string; // e.g. "Spring 2026"
  sessionCode: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxCredits: number;
  enrollmentDeadline: string;
}

export interface InstructorItem {
  id: string;
  employeeId: string;
  name: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Adjunct Faculty';
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Sabbatical';
  coursesAllocatedCount: number;
}

export interface StudentRegistryItem {
  id: string;
  studentId: string;
  name: string;
  department: string;
  batch: string;
  currentSemester: string;
  cgpa: number;
  attendance: number;
  riskLevel: RiskLevel;
  email: string;
  phone: string;
  status: 'Active' | 'Probation' | 'Inactive' | 'Graduated';
}

export interface CourseAllocationItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  section: string;
  department: string;
  semester: string;
  day: string;
  timeSlot: string;
  room: string;
}
