import {
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
  ClassRoutineItem
} from '../types';

export const CURRENT_STUDENT: StudentProfile = {
  id: 'usr_stu_1',
  name: 'Fathin Sadman',
  email: 'fathin.sadman@metrouni.edu.bd',
  role: 'STUDENT',
  avatarInitials: 'FA',
  departmentId: 'dept_cse',
  studentIdNo: '241-115-211',
  currentSemester: '6th Semester',
  academicYear: 'Spring 2026',
  cgpa: 3.52,
  currentSgpa: 3.45,
  targetSgpa: 3.75,
  totalCredits: 98,
  overallAttendance: 78,
  skills: ['TypeScript', 'React.js', 'Python', 'MySQL', 'Database Systems', 'Algorithms'],
  clubs: ['MU Computer Club (Vice President)', 'MU Research Community', 'MU Debate Society']
};

export const SECOND_STUDENT: StudentProfile = {
  id: 'usr_stu_2',
  name: 'Raiyan Chowdhury',
  email: 'student2@metrouni.edu.bd',
  role: 'STUDENT',
  avatarInitials: 'RC',
  departmentId: 'dept_cse',
  studentIdNo: '241-115-210',
  currentSemester: '6th Semester',
  academicYear: 'Spring 2026',
  cgpa: 3.82,
  currentSgpa: 3.88,
  targetSgpa: 3.95,
  totalCredits: 98,
  overallAttendance: 91,
  skills: ['C++', 'Competitive Programming', 'Algorithms', 'Data Structures', 'Linux', 'Node.js'],
  clubs: ['MU Programming Club (Lead)', 'MU Sports Society']
};

export const CURRENT_TEACHER: TeacherProfile = {
  id: 'usr_tea_1',
  name: 'Dr. Fahim Ahmed',
  email: 'fahim.ahmed@metrouni.edu.bd',
  role: 'TEACHER',
  avatarInitials: 'FA',
  departmentId: 'dept_cse',
  teacherIdNo: 'FAC-CSE-042',
  designation: 'Associate Professor & Course Coordinator',
  assignedCourseCodes: ['CSE 301', 'CSE 303', 'CSE 305', 'CSE 307'],
  officeRoom: 'Faculty Building Room 412'
};

export const CURRENT_ADMIN: AdminProfile = {
  id: 'usr_adm_1',
  name: 'Prof. Dr. Mekdad Ajmol',
  email: 'm.ajmol@metrouni.edu.bd',
  role: 'ADMIN',
  avatarInitials: 'MA',
  departmentId: 'dept_cse',
  adminIdNo: 'ADM-SYS-001',
  designation: 'Dean, School of Science & Technology'
};

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept_cse',
    deptCode: 'CSE',
    deptName: 'Computer Science & Engineering',
    totalStudents: 480,
    totalFaculty: 24,
    headOfDept: 'Prof. Dr. Mekdad Ajmol'
  },
  {
    id: 'dept_eee',
    deptCode: 'EEE',
    deptName: 'Electrical & Electronic Engineering',
    totalStudents: 320,
    totalFaculty: 18,
    headOfDept: 'Dr. Tanvir Hossain'
  },
  {
    id: 'dept_bba',
    deptCode: 'BBA',
    deptName: 'Business Administration',
    totalStudents: 540,
    totalFaculty: 26,
    headOfDept: 'Dr. Nusrat Jahan'
  },
  {
    id: 'dept_eng',
    deptCode: 'ENG',
    deptName: 'Department of English',
    totalStudents: 260,
    totalFaculty: 14,
    headOfDept: 'Dr. Rebecca Gomez'
  }
];

export const SEMESTERS: Semester[] = [
  {
    id: 'sem_sp26',
    semesterName: 'Spring 2026',
    academicYear: '2025-2026',
    isActive: true,
    startDate: '2026-01-15',
    endDate: '2026-06-20'
  },
  {
    id: 'sem_fl25',
    semesterName: 'Fall 2025',
    academicYear: '2025-2026',
    isActive: false,
    startDate: '2025-08-01',
    endDate: '2025-12-24'
  },
  {
    id: 'sem_sm25',
    semesterName: 'Summer 2025',
    academicYear: '2024-2025',
    isActive: false,
    startDate: '2025-05-01',
    endDate: '2025-07-28'
  },
  {
    id: 'sem_sp25',
    semesterName: 'Spring 2025',
    academicYear: '2024-2025',
    isActive: false,
    startDate: '2025-01-10',
    endDate: '2025-04-30'
  }
];

export const COURSES: Course[] = [
  {
    id: 'crs_301',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    creditHours: 3,
    departmentId: 'dept_cse',
    departmentName: 'Computer Science & Engineering',
    totalClassesHeld: 24,
    totalStudents: 38,
    batch: '58th Batch'
  },
  {
    id: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    departmentId: 'dept_cse',
    departmentName: 'Computer Science & Engineering',
    totalClassesHeld: 25,
    totalStudents: 32,
    batch: '58th Batch'
  },
  {
    id: 'crs_305',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering',
    creditHours: 3,
    departmentId: 'dept_cse',
    departmentName: 'Computer Science & Engineering',
    totalClassesHeld: 24,
    totalStudents: 40,
    batch: '58th Batch'
  },
  {
    id: 'crs_307',
    courseCode: 'CSE 307',
    courseName: 'Computer Networks',
    creditHours: 4,
    departmentId: 'dept_cse',
    departmentName: 'Computer Science & Engineering',
    totalClassesHeld: 26,
    totalStudents: 36,
    batch: '58th Batch'
  }
];

export const ALLOCATIONS: CourseAllocation[] = [
  {
    id: 'alloc_1',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    courseId: 'crs_301',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    semesterId: 'sem_sp26',
    section: 'Section A',
    batch: '58th Batch',
    departmentName: 'CSE',
    enrolledStudentsCount: 38,
    scheduleTime: '10:00 AM - 11:30 AM',
    room: 'Lab 302'
  },
  {
    id: 'alloc_2',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    semesterId: 'sem_sp26',
    section: 'Section A',
    batch: '58th Batch',
    departmentName: 'CSE',
    enrolledStudentsCount: 32,
    scheduleTime: '01:30 PM - 03:00 PM',
    room: 'Room 405'
  },
  {
    id: 'alloc_3',
    teacherId: 'usr_tea_2',
    teacherName: 'Engr. Raiyan Chowdhury',
    courseId: 'crs_305',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering',
    semesterId: 'sem_sp26',
    section: 'Section B',
    batch: '58th Batch',
    departmentName: 'CSE',
    enrolledStudentsCount: 40,
    scheduleTime: '11:45 AM - 01:15 PM',
    room: 'Room 304'
  },
  {
    id: 'alloc_4',
    teacherId: 'usr_tea_3',
    teacherName: 'Dr. Sumaiya Parveen',
    courseId: 'crs_307',
    courseCode: 'CSE 307',
    courseName: 'Computer Networks',
    semesterId: 'sem_sp26',
    section: 'Section A',
    batch: '58th Batch',
    departmentName: 'CSE',
    enrolledStudentsCount: 36,
    scheduleTime: '03:15 PM - 04:45 PM',
    room: 'Lab 101'
  }
];

export const INITIAL_EVALUATIONS: CourseEvaluation[] = [
  {
    id: 'eval_1',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    courseId: 'crs_301',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    creditHours: 3,
    attendancePercent: 88,
    ctMarks: [18, 16, 19],
    bestCtAverage: 18.5,
    midtermMarks: 22,
    continuousAssessmentTotal: 44.3,
    quizMarks: 18,
    assignmentMarks: 17,
    attendanceMarks: 8.8,
    finalExamMarks: 42,
    totalMarks: 86,
    grade: 'A+',
    gradePoint: 4.00,
    riskLevel: 'SAFE',
    batch: '58th Batch',
    section: 'Section A',
    lastUpdated: '2026-09-30 14:20',
    statusToday: 'PRESENT'
  },
  {
    id: 'eval_2',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    attendancePercent: 68,
    ctMarks: [10, 8, 12],
    bestCtAverage: 11.0,
    midtermMarks: 12,
    continuousAssessmentTotal: 31.8,
    quizMarks: 12,
    assignmentMarks: 14,
    attendanceMarks: 6.8,
    finalExamMarks: 28,
    totalMarks: 61,
    grade: 'B',
    gradePoint: 3.00,
    riskLevel: 'CRITICAL',
    batch: '58th Batch',
    section: 'Section A',
    remarks: 'Attendance fallen below institutional 70% threshold. Immediate advisory notice issued.',
    lastUpdated: '2026-10-01 09:15',
    statusToday: 'ABSENT'
  },
  {
    id: 'eval_3',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    courseId: 'crs_305',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering',
    creditHours: 3,
    attendancePercent: 75,
    ctMarks: [15, 14, 16],
    bestCtAverage: 15.5,
    midtermMarks: 18,
    continuousAssessmentTotal: 39.0,
    quizMarks: 15,
    assignmentMarks: 16,
    attendanceMarks: 7.5,
    finalExamMarks: 36,
    totalMarks: 75,
    grade: 'A',
    gradePoint: 3.75,
    riskLevel: 'SAFE',
    batch: '58th Batch',
    section: 'Section A',
    remarks: 'Borderline attendance at 75%. Keep monitoring.',
    lastUpdated: '2026-09-28 11:30',
    statusToday: 'PRESENT'
  },
  {
    id: 'eval_4',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    courseId: 'crs_307',
    courseCode: 'CSE 307',
    courseName: 'Computer Networks',
    creditHours: 4,
    attendancePercent: 82,
    ctMarks: [16, 17, 15],
    bestCtAverage: 16.5,
    midtermMarks: 20,
    continuousAssessmentTotal: 39.7,
    quizMarks: 16,
    assignmentMarks: 15,
    attendanceMarks: 8.2,
    finalExamMarks: 38,
    totalMarks: 77,
    grade: 'A',
    gradePoint: 3.75,
    riskLevel: 'SAFE',
    batch: '58th Batch',
    section: 'Section A',
    lastUpdated: '2026-09-29 16:45',
    statusToday: 'PRESENT'
  },
  // Additional students for Teacher / Admin rosters
  {
    id: 'eval_5',
    studentId: 'usr_stu_2',
    studentName: 'Raiyan Chowdhury Rifath',
    studentIdNo: '241-115-210',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    attendancePercent: 92,
    ctMarks: [19, 18, 20],
    bestCtAverage: 19.5,
    midtermMarks: 24,
    continuousAssessmentTotal: 46.7,
    quizMarks: 19,
    assignmentMarks: 18,
    attendanceMarks: 9.2,
    finalExamMarks: 46,
    totalMarks: 92,
    grade: 'A+',
    gradePoint: 4.00,
    riskLevel: 'SAFE',
    batch: '58th Batch',
    section: 'Section A',
    lastUpdated: '2026-09-30 11:00',
    statusToday: 'PRESENT'
  },
  {
    id: 'eval_6',
    studentId: 'usr_stu_3',
    studentName: 'Tanzeem Rahman',
    studentIdNo: '241-115-218',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    attendancePercent: 64,
    ctMarks: [9, 11, 8],
    bestCtAverage: 10.0,
    midtermMarks: 10,
    continuousAssessmentTotal: 28.4,
    quizMarks: 10,
    assignmentMarks: 12,
    attendanceMarks: 6.4,
    finalExamMarks: 24,
    totalMarks: 52,
    grade: 'C+',
    gradePoint: 2.50,
    riskLevel: 'CRITICAL',
    batch: '58th Batch',
    section: 'Section A',
    remarks: 'Discollegiate threat: Attendance is 64%. CT scores in bottom 10th percentile.',
    lastUpdated: '2026-09-29 10:15',
    statusToday: 'ABSENT'
  },
  {
    id: 'eval_7',
    studentId: 'usr_stu_4',
    studentName: 'Sabrina Mustari',
    studentIdNo: '241-115-224',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    attendancePercent: 71,
    quizMarks: 13,
    assignmentMarks: 14,
    attendanceMarks: 7.1,
    finalExamMarks: 32,
    totalMarks: 66,
    grade: 'B-',
    gradePoint: 2.75,
    riskLevel: 'WARNING',
    remarks: 'Attendance 71% in warning band.',
    lastUpdated: '2026-09-29 17:10',
    statusToday: 'PRESENT'
  },
  {
    id: 'eval_8',
    studentId: 'usr_stu_5',
    studentName: 'Nazmul Islam',
    studentIdNo: '241-115-230',
    courseId: 'crs_301',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    creditHours: 3,
    attendancePercent: 62,
    quizMarks: 10,
    assignmentMarks: 12,
    attendanceMarks: 6.2,
    finalExamMarks: 26,
    totalMarks: 54,
    grade: 'D+',
    gradePoint: 1.50,
    riskLevel: 'CRITICAL',
    remarks: 'Missed mid evaluation quiz and 3 lectures.',
    lastUpdated: '2026-09-30 15:45',
    statusToday: 'ABSENT'
  },
  {
    id: 'eval_9',
    studentId: 'usr_stu_6',
    studentName: 'Tasnim Hasan',
    studentIdNo: '241-115-235',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    attendancePercent: 84,
    quizMarks: 16,
    assignmentMarks: 17,
    attendanceMarks: 8.4,
    finalExamMarks: 39,
    totalMarks: 80,
    grade: 'A+',
    gradePoint: 4.00,
    riskLevel: 'SAFE',
    lastUpdated: '2026-09-30 12:15',
    statusToday: 'PRESENT'
  },
  {
    id: 'eval_10',
    studentId: 'usr_stu_7',
    studentName: 'Mahmudul Karim',
    studentIdNo: '241-115-242',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    creditHours: 3,
    attendancePercent: 73,
    quizMarks: 14,
    assignmentMarks: 15,
    attendanceMarks: 7.3,
    finalExamMarks: 31,
    totalMarks: 67,
    grade: 'B',
    gradePoint: 3.00,
    riskLevel: 'WARNING',
    remarks: 'Borderline attendance in warning band.',
    lastUpdated: '2026-09-29 14:00',
    statusToday: 'PRESENT'
  }
];

export const INITIAL_PREVIOUS_RESULTS: PreviousResult[] = [
  {
    id: 'pr_1',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    semesterName: '1st Semester (Spring 2024)',
    sgpa: 3.30,
    creditsCompleted: 19,
    status: 'VERIFIED',
    submittedAt: '2024-06-10',
    verifiedBy: 'Dr. Fahim Ahmed',
    verifiedAt: '2024-06-15'
  },
  {
    id: 'pr_2',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    semesterName: '2nd Semester (Summer 2024)',
    sgpa: 3.45,
    creditsCompleted: 20,
    status: 'VERIFIED',
    submittedAt: '2024-10-12',
    verifiedBy: 'Dr. Fahim Ahmed',
    verifiedAt: '2024-10-16'
  },
  {
    id: 'pr_3',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    semesterName: '3rd Semester (Fall 2024)',
    sgpa: 3.40,
    creditsCompleted: 20,
    status: 'VERIFIED',
    submittedAt: '2025-02-14',
    verifiedBy: 'Dr. Sumaiya Parveen',
    verifiedAt: '2025-02-18'
  },
  {
    id: 'pr_4',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    semesterName: '4th Semester (Spring 2025)',
    sgpa: 3.35,
    creditsCompleted: 19,
    status: 'VERIFIED',
    submittedAt: '2025-06-18',
    verifiedBy: 'Dr. Fahim Ahmed',
    verifiedAt: '2025-06-22'
  },
  {
    id: 'pr_5',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    semesterName: '5th Semester (Fall 2025)',
    sgpa: 3.65,
    creditsCompleted: 20,
    status: 'VERIFIED',
    submittedAt: '2026-01-05',
    verifiedBy: 'Dr. Fahim Ahmed',
    verifiedAt: '2026-01-10'
  },
  {
    id: 'pr_6',
    studentId: 'usr_stu_3',
    studentName: 'Tanzeem Rahman',
    studentIdNo: '241-115-218',
    semesterName: '5th Semester (Fall 2025)',
    sgpa: 2.85,
    creditsCompleted: 18,
    status: 'PENDING',
    submittedAt: '2026-09-28 19:40'
  },
  {
    id: 'pr_7',
    studentId: 'usr_stu_4',
    studentName: 'Sabrina Mustari',
    studentIdNo: '241-115-224',
    semesterName: '5th Semester (Fall 2025)',
    sgpa: 3.20,
    creditsCompleted: 19,
    status: 'PENDING',
    submittedAt: '2026-09-29 11:20'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'ntc_1',
    title: 'Mid-Semester Lab Evaluation Schedule (Spring 2026)',
    content: 'All 6th semester CSE students are advised that lab practical evaluations for CSE 301 and CSE 303 will take place between October 10 and October 15. Ensure all lab manuals are duly signed.',
    type: 'COURSE_SPECIFIC',
    targetCourseId: 'crs_303',
    targetCourseCode: 'CSE 303',
    createdByName: 'Dr. Fahim Ahmed',
    createdByRole: 'Associate Professor',
    createdAt: '2026-09-29 10:00',
    isPinned: true
  },
  {
    id: 'ntc_2',
    title: 'University Holiday Notice: Durga Puja & Autumn Recess',
    content: 'Metropolitan University will remain closed from October 20 to October 24 on account of Durga Puja. Regular academic lectures and lab sessions will resume on October 25.',
    type: 'UNIVERSITY_HOLIDAY',
    createdByName: 'Prof. Dr. Mekdad Ajmol',
    createdByRole: 'Dean & Head of Administration',
    createdAt: '2026-09-26 14:30',
    isPinned: true
  },
  {
    id: 'ntc_3',
    title: 'ACM ICPC Regional Preliminary Registration Open',
    content: 'Interested teams from CSE Department are requested to submit team rosters to the Club coordinator by October 8, 2026. Coaching sessions will be conducted in Lab 302.',
    type: 'GENERAL',
    createdByName: 'Engr. Raiyan Chowdhury',
    createdByRole: 'Senior Lecturer',
    createdAt: '2026-09-25 09:15',
    isPinned: false
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    title: 'Assignment 3: LL(1) Parser Implementation in Python/C++',
    description: 'Construct a predictive parsing table for the specified grammar, calculate FIRST and FOLLOW sets, and parse tokenized input strings.',
    attachmentName: 'CSE303_Assignment3_Grammar.pdf',
    totalMarks: 20,
    dueDate: '2026-10-06 23:59',
    createdAt: '2026-09-24 10:00'
  },
  {
    id: 'asg_2',
    courseId: 'crs_301',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    title: 'Assignment 2: Schema Normalization (BCNF & 3NF) & Triggers',
    description: 'Decompose relation R into BCNF/3NF and write SQL trigger procedures for transaction validation.',
    attachmentName: 'CSE301_HW2_Specifications.pdf',
    totalMarks: 20,
    dueDate: '2026-10-08 18:00',
    createdAt: '2026-09-27 15:30'
  },
  {
    id: 'asg_3',
    courseId: 'crs_305',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering',
    teacherId: 'usr_tea_2',
    teacherName: 'Engr. Raiyan Chowdhury',
    title: 'Assignment 3: Architectural Design & Microservices Sequence Diagram',
    description: 'Design comprehensive UML sequence and component diagrams for the EduPulse architecture.',
    attachmentName: 'CSE305_Arch_Rubric.pdf',
    totalMarks: 20,
    dueDate: '2026-09-30 23:59',
    createdAt: '2026-09-20 11:00'
  }
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub_1',
    assignmentId: 'asg_3',
    assignmentTitle: 'Assignment 3: Architectural Design & Microservices Sequence Diagram',
    studentId: 'usr_stu_1',
    studentName: 'Fathin Sadman',
    studentIdNo: '241-115-211',
    fileName: 'Fathin_241115211_CSE305_ArchDesign.pdf',
    fileSize: '2.4 MB',
    submittedAt: '2026-09-30 18:42',
    marksObtained: 18,
    feedback: 'Excellent component separation and sequence flow. Well documented.',
    status: 'GRADED'
  },
  {
    id: 'sub_2',
    assignmentId: 'asg_1',
    assignmentTitle: 'Assignment 3: LL(1) Parser Implementation in Python/C++',
    studentId: 'usr_stu_2',
    studentName: 'Raiyan Chowdhury Rifath',
    studentIdNo: '241-115-210',
    fileName: 'Raiyan_241115210_LL1_Parser.zip',
    fileSize: '4.1 MB',
    submittedAt: '2026-09-29 20:15',
    marksObtained: 19,
    feedback: 'Clean grammar parsing code, thorough unit test coverage.',
    status: 'GRADED'
  },
  {
    id: 'sub_3',
    assignmentId: 'asg_1',
    assignmentTitle: 'Assignment 3: LL(1) Parser Implementation in Python/C++',
    studentId: 'usr_stu_3',
    studentName: 'Tanzeem Rahman',
    studentIdNo: '241-115-218',
    fileName: 'Tanzeem_CSE303_Parser_Draft.pdf',
    fileSize: '1.2 MB',
    submittedAt: '2026-10-01 02:10',
    marksObtained: undefined,
    feedback: undefined,
    status: 'SUBMITTED'
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_1',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    title: 'Lecture 08: Bottom-Up LR(0) and SLR(1) Parsing Tables',
    category: 'LECTURE_SLIDE',
    weekNumber: 8,
    fileName: 'CSE303_Lecture08_LR_Parsing.pdf',
    fileSize: '4.8 MB',
    fileUrl: '#',
    uploadedAt: '2026-09-28 14:00'
  },
  {
    id: 'mat_2',
    courseId: 'crs_303',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    title: 'Lab Manual 04: Lexical Analyzer Generator (FLEX & BISON)',
    category: 'LAB_MANUAL',
    weekNumber: 7,
    fileName: 'CSE303_Lab04_Flex_Bison_Guide.pdf',
    fileSize: '2.1 MB',
    fileUrl: '#',
    uploadedAt: '2026-09-21 16:30'
  },
  {
    id: 'mat_3',
    courseId: 'crs_301',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    teacherId: 'usr_tea_1',
    teacherName: 'Dr. Fahim Ahmed',
    title: 'Lecture 09: Concurrency Control, ACID Properties & 2PL',
    category: 'LECTURE_SLIDE',
    weekNumber: 9,
    fileName: 'CSE301_Lecture09_Transactions_2PL.pdf',
    fileSize: '3.6 MB',
    fileUrl: '#',
    uploadedAt: '2026-09-29 11:20'
  },
  {
    id: 'mat_4',
    courseId: 'crs_307',
    courseCode: 'CSE 307',
    courseName: 'Computer Networks',
    teacherId: 'usr_tea_3',
    teacherName: 'Dr. Sumaiya Parveen',
    title: 'Packet Tracer Lab 05: OSPF Dynamic Routing Configuration',
    category: 'CODE_REPO',
    weekNumber: 8,
    fileName: 'CSE307_OSPF_Topology.pkt',
    fileSize: '1.5 MB',
    fileUrl: '#',
    uploadedAt: '2026-09-25 10:15'
  }
];

export const INITIAL_EARLY_WARNING_RULES: EarlyWarningRules = {
  safeAttendanceThreshold: 75,
  warningAttendanceThreshold: 70,
  safeMarksThreshold: 50,
  warningMarksThreshold: 40,
  autoSendAdvisoryEmail: true,
  requireFacultyInterventionOnCritical: true
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    action: 'DYNAMIC_QR_SESSION_CREATED',
    user: 'Dr. Fahim Ahmed',
    role: 'TEACHER',
    details: 'Generated 120-sec rotating QR session for CSE 303 (Room 405)',
    timestamp: '2026-10-01 01:30 PM',
    type: 'INFO'
  },
  {
    id: 'log_2',
    action: 'RISK_THRESHOLD_TRIGGERED',
    user: 'EduPulse Engine',
    role: 'SYSTEM',
    details: 'CRITICAL alert dispatched for Student 241-115-211 in CSE 303 (Attendance: 68%)',
    timestamp: '2026-10-01 09:15 AM',
    type: 'ALERT'
  },
  {
    id: 'log_3',
    action: 'ASSESSMENT_MARKS_UPDATED',
    user: 'Dr. Fahim Ahmed',
    role: 'TEACHER',
    details: 'Batch quiz marks committed for 42 students in CSE 301',
    timestamp: '2026-09-30 02:20 PM',
    type: 'INFO'
  },
  {
    id: 'log_4',
    action: 'PREVIOUS_RESULT_VERIFIED',
    user: 'Dr. Fahim Ahmed',
    role: 'TEACHER',
    details: 'Approved 5th Semester SGPA 3.65 for Fathin Sadman',
    timestamp: '2026-01-10 11:00 AM',
    type: 'INFO'
  }
];

// QR Code Session: Default to 120 seconds (2 minutes) so students have plenty of time to scan!
export const INITIAL_ACTIVE_QR: ActiveQRSession = {
  sessionId: 'qr_sess_live_9921',
  courseId: 'crs_303',
  courseCode: 'CSE 303',
  courseName: 'Compiler Design',
  teacherId: 'usr_tea_1',
  section: 'Section A',
  room: 'Room 405',
  token: 'METRO_CSE303_LIVE_TOKEN_8472',
  previousToken: 'METRO_CSE303_LIVE_TOKEN_8471',
  createdAt: Date.now(),
  expiresInSeconds: 120,
  remainingSeconds: 110,
  isPaused: false,
  attendeesScanned: [
    {
      studentId: 'usr_stu_2',
      studentName: 'Raiyan Chowdhury Rifath',
      studentIdNo: '241-115-210',
      scannedAt: '01:32:14 PM'
    },
    {
      studentId: 'usr_stu_4',
      studentName: 'Sabrina Mustari',
      studentIdNo: '241-115-224',
      scannedAt: '01:33:02 PM'
    }
  ]
};

export const INITIAL_STUDENT_METRICS = {
  sgpa: 3.45,
  targetSgpa: 3.75,
  cgpa: 3.52,
  attendance: 78,
  credits: 98,
  totalCredits: 98,
  currentSemester: '6th Semester',
  academicYear: 'Spring 2026',
  criticalCourses: 1
};

export interface CourseDataItem {
  code: string;
  name: string;
  credit: number;
  attendance: number;
  quiz: number;
  assignment: number;
  finalExam: number;
  total: number;
  grade: string;
  gradePoint: number;
  risk: 'SAFE' | 'WARNING' | 'CRITICAL';
  classesHeld?: number;
  classesAttended?: number;
}

export const COURSES_DATA: CourseDataItem[] = [
  {
    code: 'CSE 301',
    name: 'Database Systems',
    credit: 3.0,
    attendance: 88,
    quiz: 18,
    assignment: 17,
    finalExam: 42,
    total: 86,
    grade: 'A+',
    gradePoint: 4.0,
    risk: 'SAFE',
    classesHeld: 24,
    classesAttended: 21
  },
  {
    code: 'CSE 303',
    name: 'Compiler Design',
    credit: 3.0,
    attendance: 68,
    quiz: 12,
    assignment: 14,
    finalExam: 28,
    total: 61,
    grade: 'B',
    gradePoint: 3.0,
    risk: 'CRITICAL',
    classesHeld: 25,
    classesAttended: 17
  },
  {
    code: 'CSE 305',
    name: 'Software Engineering',
    credit: 3.0,
    attendance: 75,
    quiz: 15,
    assignment: 16,
    finalExam: 36,
    total: 75,
    grade: 'A',
    gradePoint: 3.75,
    risk: 'SAFE',
    classesHeld: 24,
    classesAttended: 18
  },
  {
    code: 'CSE 307',
    name: 'Computer Networks',
    credit: 4.0,
    attendance: 82,
    quiz: 16,
    assignment: 15,
    finalExam: 38,
    total: 77,
    grade: 'A',
    gradePoint: 3.75,
    risk: 'SAFE',
    classesHeld: 26,
    classesAttended: 21
  }
];

export const GPA_TREND_DATA = [
  { semester: 'Sem 1', sgpa: 3.65, cgpa: 3.65 },
  { semester: 'Sem 2', sgpa: 3.70, cgpa: 3.68 },
  { semester: 'Sem 3', sgpa: 3.55, cgpa: 3.64 },
  { semester: 'Sem 4', sgpa: 3.40, cgpa: 3.58 },
  { semester: 'Sem 5', sgpa: 3.60, cgpa: 3.58 },
  { semester: 'Sem 6', sgpa: 3.45, cgpa: 3.52 }
];

export const ATTENDANCE_TREND_DATA = [
  { week: 'Wk 1', attendance: 85 },
  { week: 'Wk 2', attendance: 90 },
  { week: 'Wk 3', attendance: 70 },
  { week: 'Wk 4', attendance: 80 },
  { week: 'Wk 5', attendance: 75 },
  { week: 'Wk 6', attendance: 65 },
  { week: 'Wk 7', attendance: 85 },
  { week: 'Wk 8', attendance: 78 },
  { week: 'Wk 9', attendance: 82 }
];

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: 'Quiz 2 Result Published',
    course: 'CSE 301 - Database Systems',
    time: '2 hours ago'
  },
  {
    id: 2,
    title: 'Assignment 3 Uploaded',
    course: 'CSE 305 - Software Engineering',
    time: '1 day ago'
  },
  {
    id: 3,
    title: 'Attendance Logged (Dynamic QR)',
    course: 'CSE 307 - Computer Networks',
    time: '2 days ago'
  },
  {
    id: 4,
    title: 'Risk Alert: Low Attendance (68%)',
    course: 'CSE 303 - Compiler Design',
    time: '3 days ago'
  }
];

export const UPCOMING_CLASSES = [
  {
    id: 1,
    code: 'CSE 301',
    name: 'Database Systems',
    time: '10:00 AM - 11:30 AM',
    room: 'Lab 302',
    status: 'ONGOING'
  },
  {
    id: 2,
    code: 'CSE 305',
    name: 'Software Engineering',
    time: '11:45 AM - 01:15 PM',
    room: 'Room 304',
    status: 'UPCOMING'
  },
  {
    id: 3,
    code: 'CSE 303',
    name: 'Compiler Design',
    time: '01:30 PM - 03:00 PM',
    room: 'Room 405',
    status: 'UPCOMING'
  }
];

export const ASSIGNMENTS_DATA = [
  {
    id: 1,
    course: 'CSE 301 - Database Systems',
    title: 'Assignment 2: Complex Relational Schema & Normalization',
    deadline: 'Tomorrow, 11:59 PM',
    marks: '17 / 20 (Graded)',
    status: 'GRADED',
    feedback: 'Excellent 3NF decomposition, minor anomaly in synthetic key constraint.'
  },
  {
    id: 2,
    course: 'CSE 303 - Compiler Design',
    title: 'Assignment 1: Lexical Analyzer & LL(1) Grammar Parsing',
    deadline: 'Oct 08, 2026',
    marks: 'Pending Evaluation',
    status: 'SUBMITTED',
    feedback: 'Under review by faculty course coordinator.'
  },
  {
    id: 3,
    course: 'CSE 305 - Software Engineering',
    title: 'Assignment 3: SRS Specification & Architectural UML Model',
    deadline: 'Oct 14, 2026',
    marks: 'Ungraded (Max: 20)',
    status: 'PENDING',
    feedback: 'Deliverable pending submission before cutoff.'
  },
  {
    id: 4,
    course: 'CSE 307 - Computer Networks',
    title: 'Lab Report 2: Packet Tracer VLAN & Subnet Routing',
    deadline: 'Oct 20, 2026',
    marks: 'Ungraded (Max: 20)',
    status: 'PENDING',
    feedback: 'Submission portal active.'
  }
];

export const CO_CURRICULAR_DATA = {
  skills: [
    'TypeScript',
    'React.js',
    'Python',
    'MySQL',
    'Database Systems',
    'Compiler Design',
    'Git / GitHub',
    'Docker & Cloud Run'
  ],
  clubs: [
    'MU Computer Club (Vice President)',
    'MU Research & Innovation Community',
    'MU Debate Society (Executive Member)',
    'Metropolitan Sports Club'
  ]
};

export const DEFAULT_CLASS_ROUTINE: ClassRoutineItem[] = [
  // Sunday
  {
    id: 'rt_sun_1',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Sunday',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    room: 'Lab 302',
    building: 'Academic Building 1, 3rd Floor (Networking Lab)',
    batch: '58th Batch',
    section: 'Section A',
    type: 'LAB'
  },
  {
    id: 'rt_sun_2',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Sunday',
    startTime: '11:15 AM',
    endTime: '12:45 PM',
    room: 'Room 405',
    building: 'Academic Building 1, 4th Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'THEORY'
  },
  {
    id: 'rt_sun_3',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering',
    teacherName: 'Engr. Raiyan Chowdhury',
    teacherId: 'usr_tea_2',
    dayOfWeek: 'Sunday',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    room: 'Room 304',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'THEORY'
  },

  // Monday
  {
    id: 'rt_mon_1',
    courseCode: 'CSE 307',
    courseName: 'Computer Networks',
    teacherName: 'Dr. Sumaiya Parveen',
    teacherId: 'usr_tea_3',
    dayOfWeek: 'Monday',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    room: 'Lab 101',
    building: 'Main Campus, Ground Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'LAB'
  },
  {
    id: 'rt_mon_2',
    courseCode: 'CSE 301',
    courseName: 'Database Systems (Theory)',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Monday',
    startTime: '11:45 AM',
    endTime: '01:15 PM',
    room: 'Room 405',
    building: 'Academic Building 1, 4th Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'THEORY'
  },

  // Tuesday
  {
    id: 'rt_tue_1',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Tuesday',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    room: 'Room 405',
    building: 'Academic Building 1, 4th Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'THEORY'
  },
  {
    id: 'rt_tue_2',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering Lab',
    teacherName: 'Engr. Raiyan Chowdhury',
    teacherId: 'usr_tea_2',
    dayOfWeek: 'Tuesday',
    startTime: '11:15 AM',
    endTime: '01:15 PM',
    room: 'Lab 302',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'LAB'
  },

  // Wednesday
  {
    id: 'rt_wed_1',
    courseCode: 'CSE 307',
    courseName: 'Computer Networks (Theory)',
    teacherName: 'Dr. Sumaiya Parveen',
    teacherId: 'usr_tea_3',
    dayOfWeek: 'Wednesday',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    room: 'Room 304',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'THEORY'
  },
  {
    id: 'rt_wed_2',
    courseCode: 'CSE 301',
    courseName: 'Database Systems Query Optimization',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Wednesday',
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    room: 'Lab 302',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'LAB'
  },

  // Thursday
  {
    id: 'rt_thu_1',
    courseCode: 'CSE 303',
    courseName: 'Compiler Design Lab Session',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Thursday',
    startTime: '09:30 AM',
    endTime: '11:30 AM',
    room: 'Lab 302',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'LAB'
  },
  {
    id: 'rt_thu_2',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering Project Consultation',
    teacherName: 'Engr. Raiyan Chowdhury',
    teacherId: 'usr_tea_2',
    dayOfWeek: 'Thursday',
    startTime: '12:00 PM',
    endTime: '01:30 PM',
    room: 'Room 405',
    building: 'Academic Building 1, 4th Floor',
    batch: '58th Batch',
    section: 'Section A',
    type: 'THEORY'
  },

  // Section B classes
  {
    id: 'rt_secb_1',
    courseCode: 'CSE 301',
    courseName: 'Database Systems',
    teacherName: 'Dr. Fahim Ahmed',
    teacherId: 'usr_tea_1',
    dayOfWeek: 'Sunday',
    startTime: '11:15 AM',
    endTime: '12:45 PM',
    room: 'Lab 302',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section B',
    type: 'LAB'
  },
  {
    id: 'rt_secb_2',
    courseCode: 'CSE 305',
    courseName: 'Software Engineering',
    teacherName: 'Engr. Raiyan Chowdhury',
    teacherId: 'usr_tea_2',
    dayOfWeek: 'Monday',
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    room: 'Room 304',
    building: 'Academic Building 1, 3rd Floor',
    batch: '58th Batch',
    section: 'Section B',
    type: 'THEORY'
  }
];
