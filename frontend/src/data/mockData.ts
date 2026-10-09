import {
  UserProfile,
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
  Course
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_student_01',
    name: 'Fathin Sadman',
    email: 'student@metrouni.edu.bd',
    role: 'STUDENT',
    department: 'CSE',
    departmentName: 'Computer Science & Engineering',
    institution: 'Metropolitan University, Sylhet',
    studentId: '241-115-211',
    batch: '59th Batch',
    currentSemester: '5th Semester (Spring 2026)',
    cgpa: 3.42,
    overallAttendance: 84.5,
    riskLevel: 'SAFE',
    advisor: 'Dr. Tariqul Islam'
  },
  teacher: {
    id: 'usr_teacher_01',
    name: 'Dr. Fahim Ahmed',
    email: 'fahim.cse@metrouni.edu.bd',
    role: 'TEACHER',
    department: 'CSE',
    departmentName: 'Computer Science & Engineering',
    institution: 'Metropolitan University, Sylhet',
    employeeId: 'FAC-CSE-042',
    designation: 'Associate Professor & Academic Coordinator',
    roomNumber: 'Room 405 (Faculty Building)',
    phone: '+880 1712-345678',
    assignedCoursesCount: 2
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Prof. Dr. M. Rahman',
    email: 'admin.registrar@metrouni.edu.bd',
    role: 'ADMIN',
    department: 'REG',
    departmentName: 'Office of the Academic Registrar',
    institution: 'Metropolitan University, Sylhet',
    adminDesignation: 'Academic Registrar & System Administrator',
    permissions: ['ALL_PERMISSIONS', 'MANAGE_USERS', 'MANAGE_ALLOCATIONS', 'AUDIT_LOGS']
  }
};

export const INITIAL_STUDENT_COURSES: StudentCourseRecord[] = [
  {
    courseId: 'cse-311',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    credits: 3.0,
    instructor: 'Dr. Tariqul Islam',
    section: 'Section A',
    attendancePercentage: 88.0,
    totalClasses: 25,
    attendedClasses: 22,
    quizScore: 18,
    midtermScore: 26,
    assignmentScore: 9,
    finalExamScore: 34,
    totalMarksObtained: 87,
    totalMarksPossible: 100,
    currentGrade: 'A+',
    currentGPA: 4.00,
    riskLevel: 'SAFE',
    riskFactorNotes: 'Consistent attendance & stellar lab performance.',
    redAlert: false
  },
  {
    courseId: 'cse-313',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    credits: 3.0,
    instructor: 'Asst. Prof. Mahfuzur Rahman',
    section: 'Section B',
    attendancePercentage: 68.0, // < 75% -> WARNING / CRITICAL
    totalClasses: 22,
    attendedClasses: 15,
    quizScore: 11,
    midtermScore: 16,
    assignmentScore: 6,
    finalExamScore: 22,
    totalMarksObtained: 55,
    totalMarksPossible: 100,
    currentGrade: 'B-',
    currentGPA: 2.75,
    riskLevel: 'CRITICAL',
    riskFactorNotes: 'Attendance fell below 70%. Exam eligibility at risk without makeup classes.',
    redAlert: true
  },
  {
    courseId: 'cse-315',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    credits: 3.0,
    instructor: 'Dr. Nazmul Huda',
    section: 'Section A',
    attendancePercentage: 74.0, // WARNING
    totalClasses: 23,
    attendedClasses: 17,
    quizScore: 14,
    midtermScore: 21,
    assignmentScore: 8,
    finalExamScore: 28,
    totalMarksObtained: 71,
    totalMarksPossible: 100,
    currentGrade: 'A-',
    currentGPA: 3.50,
    riskLevel: 'WARNING',
    riskFactorNotes: 'Borderline attendance (74%). Needs 2 more consecutive presences to reach 75%.',
    redAlert: false
  },
  {
    courseId: 'cse-317',
    courseCode: 'CSE 317',
    courseTitle: 'Software Engineering & Agile',
    credits: 3.0,
    instructor: 'Lecturer Sharmin Akter',
    section: 'Section A',
    attendancePercentage: 92.0,
    totalClasses: 25,
    attendedClasses: 23,
    quizScore: 19,
    midtermScore: 27,
    assignmentScore: 10,
    finalExamScore: 36,
    totalMarksObtained: 92,
    totalMarksPossible: 100,
    currentGrade: 'A+',
    currentGPA: 4.00,
    riskLevel: 'SAFE',
    riskFactorNotes: 'Exemplary project contributions and full attendance.',
    redAlert: false
  },
  {
    courseId: 'cse-312',
    courseCode: 'CSE 312',
    courseTitle: 'Database Systems Lab',
    credits: 1.5,
    instructor: 'Dr. Tariqul Islam',
    section: 'Section A1',
    attendancePercentage: 94.0,
    totalClasses: 16,
    attendedClasses: 15,
    quizScore: 19,
    midtermScore: 28,
    assignmentScore: 10,
    finalExamScore: 37,
    totalMarksObtained: 94,
    totalMarksPossible: 100,
    currentGrade: 'A+',
    currentGPA: 4.00,
    riskLevel: 'SAFE',
    riskFactorNotes: 'All SQL lab assessments completed with distinction.',
    redAlert: false
  }
];

export const INITIAL_ATTENDANCE_LOG: AttendanceRecord[] = [
  {
    id: 'att-101',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    date: '2026-10-08',
    timeSlot: '09:00 AM - 10:30 AM',
    room: 'Academic Block 3 - Room 402',
    status: 'PRESENT',
    verifiedVia: 'DYNAMIC_QR',
    tokenUsed: 'EP-QR-98231'
  },
  {
    id: 'att-102',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    date: '2026-10-07',
    timeSlot: '11:00 AM - 12:30 PM',
    room: 'Lab 301',
    status: 'ABSENT',
    verifiedVia: 'MANUAL_ROSTER'
  },
  {
    id: 'att-103',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    date: '2026-10-06',
    timeSlot: '02:00 PM - 03:30 PM',
    room: 'Room 505',
    status: 'LATE',
    verifiedVia: 'DYNAMIC_QR',
    tokenUsed: 'EP-QR-77215'
  },
  {
    id: 'att-104',
    courseCode: 'CSE 317',
    courseTitle: 'Software Engineering',
    date: '2026-10-05',
    timeSlot: '10:00 AM - 11:30 AM',
    room: 'Auditorium 2',
    status: 'PRESENT',
    verifiedVia: 'DYNAMIC_QR',
    tokenUsed: 'EP-QR-11492'
  }
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-01',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    title: 'ER Diagram & Relational Schema Normalization',
    description: 'Design a 3NF normalized schema for Metropolitan University Hospital Management system including BCNF decomposition proofs.',
    assignedDate: '2026-10-01',
    dueDate: '2026-10-15',
    totalPoints: 20,
    status: 'SUBMITTED',
    submissionDate: '2026-10-05',
    submittedFileName: 'Fathin_Sadman_CSE311_Assignment1.pdf',
    obtainedScore: 19,
    facultyFeedback: 'Excellent ER model diagram and clear decomposition proofs.'
  },
  {
    id: 'asg-02',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    title: 'Lexical Analyzer Implementation in C++/Flex',
    description: 'Construct a DFA-based tokenizer supporting arithmetic expressions, keywords, and floating-point literals with error tokens.',
    assignedDate: '2026-10-03',
    dueDate: '2026-10-18',
    totalPoints: 25,
    status: 'PENDING',
    attachments: ['compiler_assignment_spec_v2.pdf']
  },
  {
    id: 'asg-03',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    title: 'Packet Sniffing and Wireshark TCP Handshake Analysis',
    description: 'Capture 3-way TCP handshake and dissect sequence numbers, window scaling, and HTTP headers in Wireshark trace file.',
    assignedDate: '2026-09-25',
    dueDate: '2026-10-08',
    totalPoints: 15,
    status: 'GRADED',
    submissionDate: '2026-10-04',
    submittedFileName: 'Wireshark_Report_241-115-211.pdf',
    obtainedScore: 14,
    facultyFeedback: 'Good capture analysis. Minor omission on TCP SYN flag retransmission timing.'
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not-01',
    title: 'Mid-Term Examination Schedule - Spring 2026',
    category: 'Exam',
    priority: 'URGENT',
    date: '2026-10-08',
    authorName: 'Office of the Controller of Examinations',
    authorRole: 'University Exam Controller',
    content: 'All undergraduate students of the CSE Department are notified that the Spring 2026 Mid-Term Examinations will commence on October 25, 2026. Admit cards will be available for download from October 18 for students with clearance.',
    targetAudience: 'ALL',
    hasAttachment: true,
    attachmentName: 'MidTerm_Exam_Routine_Spring2026.pdf'
  },
  {
    id: 'not-02',
    title: 'Attendance Policy & 75% Minimum Threshold Compliance',
    category: 'Academic',
    priority: 'IMPORTANT',
    date: '2026-10-06',
    authorName: 'Dr. Tariqul Islam',
    authorRole: 'Academic Coordinator, CSE',
    content: 'Students having attendance below 75% are strictly cautioned. The Early Warning System has flagged critical candidates. Students in Critical or Warning status must consult their respective course teachers immediately.',
    targetAudience: 'STUDENTS',
    targetDepartment: 'CSE',
    hasAttachment: false
  },
  {
    id: 'not-03',
    title: 'Metropolitan University Intra-University Hackathon 2026',
    category: 'General',
    priority: 'NORMAL',
    date: '2026-10-02',
    authorName: 'MU Computer Club (MUCC)',
    authorRole: 'Club Executive Committee',
    content: 'Registration is now open for the 36-hour Hackathon on AI & Cloud Innovation. Attractive prize money, mentorship from industry architects, and direct internship opportunities available.',
    targetAudience: 'ALL',
    hasAttachment: true,
    attachmentName: 'Hackathon_Rules_and_Prizes.pdf'
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterialItem[] = [
  {
    id: 'sm-01',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    topic: 'Relational Algebra & SQL Query Optimization',
    unit: 'Unit 3: Query Processing',
    description: 'Comprehensive slides covering cost estimation, B+ tree indexing, and join algorithms with sample query execution plans.',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    uploadDate: '2026-10-03',
    uploadedBy: 'Dr. Tariqul Islam',
    downloadCount: 142
  },
  {
    id: 'sm-02',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    topic: 'Syntax-Directed Translation and LR Parsing Tables',
    unit: 'Unit 2: Parsing Techniques',
    description: 'Detailed lecture notes on SLR(1), CLR(1), and LALR(1) parsing tables with step-by-step conflict resolution examples.',
    fileType: 'SLIDES',
    fileSize: '7.2 MB',
    uploadDate: '2026-09-29',
    uploadedBy: 'Asst. Prof. Mahfuzur Rahman',
    downloadCount: 98
  },
  {
    id: 'sm-03',
    courseCode: 'CSE 312',
    courseTitle: 'Database Systems Lab',
    topic: 'PostgreSQL Stored Procedures & Triggers Blueprint',
    unit: 'Lab Manual 4',
    description: 'Hands-on code examples for writing PL/pgSQL functions, event triggers, and audit logging for enterprise databases.',
    fileType: 'CODE',
    fileSize: '1.2 MB',
    uploadDate: '2026-10-01',
    uploadedBy: 'Dr. Tariqul Islam',
    downloadCount: 110
  }
];

export const INITIAL_PREVIOUS_RESULTS: PreviousResultSubmission[] = [
  {
    id: 'pr-01',
    studentId: '241-115-211',
    studentName: 'Fathin Sadman',
    semesterName: '4th Semester (Fall 2025)',
    completedCredits: 19.5,
    gpa: 3.58,
    type: 'Regular',
    submissionDate: '2026-01-15',
    status: 'VERIFIED',
    verifiedBy: 'Dr. Tariqul Islam',
    verificationDate: '2026-01-20',
    remarks: 'Official grade sheet verified against university registrar records.',
    documentName: 'Fall2025_Gradesheet_241115211.pdf'
  },
  {
    id: 'pr-02',
    studentId: '241-115-211',
    studentName: 'Fathin Sadman',
    semesterName: '3rd Semester (Summer 2025)',
    completedCredits: 18.0,
    gpa: 3.32,
    type: 'Regular',
    submissionDate: '2025-09-10',
    status: 'VERIFIED',
    verifiedBy: 'Dr. Tariqul Islam',
    verificationDate: '2025-09-14',
    remarks: 'Verified successfully.',
    documentName: 'Summer2025_Gradesheet_241115211.pdf'
  },
  {
    id: 'pr-03',
    studentId: '241-115-211',
    studentName: 'Fathin Sadman',
    semesterName: '2nd Semester (Spring 2025) Retake: MAT 121',
    completedCredits: 3.0,
    gpa: 3.75,
    type: 'Improvement',
    submissionDate: '2026-10-02',
    status: 'PENDING',
    remarks: 'Awaiting faculty advisor endorsement.',
    documentName: 'MAT121_Improvement_Submission_Slip.pdf'
  }
];

export const INITIAL_CO_CURRICULAR: CoCurricularActivity[] = [
  {
    id: 'cc-01',
    title: 'Vice President of Technical Affairs',
    category: 'Club',
    organization: 'MU Computer Club (MUCC)',
    role: 'Core Executive Organizer',
    startDate: 'Jan 2025',
    endDate: 'Present',
    description: 'Spearheaded 4 national programming workshops and coordinated the Annual ICPC Preliminary Onsite camp.',
    certificateProvided: true,
    status: 'ACTIVE'
  },
  {
    id: 'cc-02',
    title: 'Runner Up - Sylhet Regional Hackathon 2025',
    category: 'Competition',
    organization: 'IEEE Bangladesh Section',
    role: 'Lead Full-Stack Developer',
    startDate: 'Nov 2025',
    description: 'Engineered an AI-powered automated smart emergency ambulance routing system using WebSockets and OpenStreetMap.',
    certificateProvided: true,
    status: 'VERIFIED'
  },
  {
    id: 'cc-03',
    title: 'University Cricket Team - Inter-Dept Champion',
    category: 'Sports',
    organization: 'Metropolitan University Sports Board',
    role: 'All-Rounder',
    startDate: 'Feb 2025',
    description: 'Represented CSE Department in inter-department championship, securing championship trophy.',
    certificateProvided: true,
    status: 'VERIFIED'
  }
];

export const INITIAL_ROUTINE: ClassRoutineItem[] = [
  {
    id: 'rt-01',
    day: 'Sunday',
    timeSlot: '09:00 AM - 10:30 AM',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    instructor: 'Dr. Tariqul Islam',
    room: 'Room 402',
    type: 'Theory'
  },
  {
    id: 'rt-02',
    day: 'Sunday',
    timeSlot: '11:00 AM - 12:30 PM',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    instructor: 'Asst. Prof. Mahfuzur Rahman',
    room: 'Lab 301',
    type: 'Theory'
  },
  {
    id: 'rt-03',
    day: 'Tuesday',
    timeSlot: '09:00 AM - 11:30 AM',
    courseCode: 'CSE 312',
    courseTitle: 'Database Systems Lab',
    instructor: 'Dr. Tariqul Islam',
    room: 'Lab 302',
    type: 'Lab'
  },
  {
    id: 'rt-04',
    day: 'Tuesday',
    timeSlot: '12:00 PM - 01:30 PM',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    instructor: 'Dr. Nazmul Huda',
    room: 'Room 505',
    type: 'Theory'
  },
  {
    id: 'rt-05',
    day: 'Thursday',
    timeSlot: '10:00 AM - 11:30 AM',
    courseCode: 'CSE 317',
    courseTitle: 'Software Engineering & Agile',
    instructor: 'Lecturer Sharmin Akter',
    room: 'Auditorium 2',
    type: 'Theory'
  }
];

// Week 5 Teacher Mock Data
export const INITIAL_TEACHER_STUDENTS = [
  { studentId: '241-115-211', studentName: 'Fathin Sadman', rollNumber: '211', email: 'fathin.sadman@metrouni.edu.bd', section: 'A', attendanceRate: 88, currentMarks: 87, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-212', studentName: 'Tahsin Ahmed', rollNumber: '212', email: 'tahsin.ahmed@metrouni.edu.bd', section: 'A', attendanceRate: 92, currentMarks: 91, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-213', studentName: 'Nusrat Jahan', rollNumber: '213', email: 'nusrat.jahan@metrouni.edu.bd', section: 'A', attendanceRate: 72, currentMarks: 58, riskLevel: 'WARNING' as const, attendanceStatus: 'LATE' as const },
  { studentId: '241-115-214', studentName: 'Shahriar Kabir', rollNumber: '214', email: 'shahriar.kabir@metrouni.edu.bd', section: 'A', attendanceRate: 54, currentMarks: 38, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-215', studentName: 'Ayesha Siddiqua', rollNumber: '215', email: 'ayesha.s@metrouni.edu.bd', section: 'A', attendanceRate: 85, currentMarks: 82, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-216', studentName: 'Mahmudul Hasan', rollNumber: '216', email: 'mahmudul.h@metrouni.edu.bd', section: 'A', attendanceRate: 64, currentMarks: 44, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-217', studentName: 'Zubair Hossain', rollNumber: '217', email: 'zubair.h@metrouni.edu.bd', section: 'B', attendanceRate: 78, currentMarks: 70, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const }
];

export const INITIAL_ASSESSMENT_RECORDS: AssessmentRecord[] = [
  { studentId: '241-115-211', studentName: 'Fathin Sadman', rollNumber: '211', quiz1: 18, quiz2: 19, midterm: 26, assignment: 9, finalExam: 35, total: 88, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-212', studentName: 'Tahsin Ahmed', rollNumber: '212', quiz1: 20, quiz2: 18, midterm: 28, assignment: 10, finalExam: 36, total: 92, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-213', studentName: 'Nusrat Jahan', rollNumber: '213', quiz1: 12, quiz2: 14, midterm: 18, assignment: 7, finalExam: 24, total: 61, letterGrade: 'B', gpa: 3.0 },
  { studentId: '241-115-214', studentName: 'Shahriar Kabir', rollNumber: '214', quiz1: 8, quiz2: 9, midterm: 11, assignment: 4, finalExam: 15, total: 39, letterGrade: 'F', gpa: 0.0 },
  { studentId: '241-115-215', studentName: 'Ayesha Siddiqua', rollNumber: '215', quiz1: 16, quiz2: 17, midterm: 24, assignment: 8, finalExam: 32, total: 81, letterGrade: 'A', gpa: 3.75 },
  { studentId: '241-115-216', studentName: 'Mahmudul Hasan', rollNumber: '216', quiz1: 10, quiz2: 8, midterm: 14, assignment: 5, finalExam: 18, total: 47, letterGrade: 'C', gpa: 2.25 }
];

export const INITIAL_HIGH_RISK_ALERTS: HighRiskAlert[] = [
  {
    id: 'hra-01',
    studentId: '241-115-214',
    studentName: 'Shahriar Kabir',
    courseCode: 'CSE 311',
    attendanceRate: 54,
    marksScore: 39,
    riskFactor: 'Severe attendance deficit (54%) & failed Midterm exam (11/30).',
    status: 'ACTIVE_ALERT',
    interventionHistory: [
      { date: '2026-10-02', action: 'Automated Red Alert generated', note: 'Attendance breached 60% threshold.', by: 'System' }
    ]
  },
  {
    id: 'hra-02',
    studentId: '241-115-216',
    studentName: 'Mahmudul Hasan',
    courseCode: 'CSE 311',
    attendanceRate: 64,
    marksScore: 47,
    riskFactor: 'Attendance 64%, repeated lab absences, missing assignment #1.',
    status: 'INTERVENTION_SENT',
    interventionHistory: [
      { date: '2026-10-04', action: 'Official Academic Warning Issued', note: 'Notice dispatched to student portal with CC to guardian.', by: 'Dr. Tariqul Islam' }
    ]
  },
  {
    id: 'hra-03',
    studentId: '241-115-213',
    studentName: 'Nusrat Jahan',
    courseCode: 'CSE 311',
    attendanceRate: 72,
    marksScore: 61,
    riskFactor: 'Borderline attendance (72%). 1 absence away from debarment.',
    status: 'MEETING_SCHEDULED',
    interventionHistory: [
      { date: '2026-10-06', action: 'Counseling Session Scheduled', note: 'Meeting fixed for Sunday 11:30 AM in Room 402.', by: 'Dr. Tariqul Islam' }
    ]
  }
];

// Week 5 Admin Mock Data
export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept-01', code: 'CSE', name: 'Computer Science & Engineering', chairPerson: 'Prof. Dr. Nazrul Islam', facultyCount: 24, studentCount: 520, establishedYear: 2003, email: 'head.cse@metrouni.edu.bd' },
  { id: 'dept-02', code: 'EEE', name: 'Electrical & Electronic Engineering', chairPerson: 'Prof. Dr. M. A. Karim', facultyCount: 16, studentCount: 310, establishedYear: 2005, email: 'head.eee@metrouni.edu.bd' },
  { id: 'dept-03', code: 'SWE', name: 'Software Engineering', chairPerson: 'Assoc. Prof. Fahmida Hossain', facultyCount: 12, studentCount: 240, establishedYear: 2014, email: 'head.swe@metrouni.edu.bd' },
  { id: 'dept-04', code: 'BBA', name: 'Business Administration', chairPerson: 'Prof. Dr. Taher Choudhury', facultyCount: 18, studentCount: 420, establishedYear: 2003, email: 'head.bba@metrouni.edu.bd' },
  { id: 'dept-05', code: 'ENG', name: 'English Language & Literature', chairPerson: 'Assoc. Prof. Sanjida Khan', facultyCount: 10, studentCount: 180, establishedYear: 2004, email: 'head.eng@metrouni.edu.bd' },
  { id: 'dept-06', code: 'LAW', name: 'Department of Law & Justice', chairPerson: 'Dr. Shamsul Huda', facultyCount: 11, studentCount: 210, establishedYear: 2008, email: 'head.law@metrouni.edu.bd' }
];

export const INITIAL_SEMESTERS: SemesterItem[] = [
  { id: 'sem-01', name: 'Spring 2026', sessionCode: '261', startDate: '2026-01-15', endDate: '2026-05-30', isActive: true, maxCredits: 21.0, enrollmentDeadline: '2026-01-25' },
  { id: 'sem-02', name: 'Summer 2026', sessionCode: '262', startDate: '2026-06-01', endDate: '2026-09-20', isActive: false, maxCredits: 15.0, enrollmentDeadline: '2026-06-10' },
  { id: 'sem-03', name: 'Fall 2025', sessionCode: '253', startDate: '2025-09-01', endDate: '2025-12-28', isActive: false, maxCredits: 21.0, enrollmentDeadline: '2025-09-12' }
];

export const INITIAL_INSTRUCTORS: InstructorItem[] = [
  { id: 'inst-01', employeeId: 'EMP-CSE-042', name: 'Dr. Tariqul Islam', designation: 'Associate Professor', department: 'CSE', email: 'tariqul.cse@metrouni.edu.bd', phone: '+880 1712-345678', status: 'Active', coursesAllocatedCount: 3 },
  { id: 'inst-02', employeeId: 'EMP-CSE-055', name: 'Asst. Prof. Mahfuzur Rahman', designation: 'Assistant Professor', department: 'CSE', email: 'mahfuz.cse@metrouni.edu.bd', phone: '+880 1711-223344', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-03', employeeId: 'EMP-CSE-061', name: 'Dr. Nazmul Huda', designation: 'Professor', department: 'CSE', email: 'nazmul.cse@metrouni.edu.bd', phone: '+880 1718-998877', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-04', employeeId: 'EMP-CSE-078', name: 'Lecturer Sharmin Akter', designation: 'Lecturer', department: 'CSE', email: 'sharmin.cse@metrouni.edu.bd', phone: '+880 1819-445566', status: 'Active', coursesAllocatedCount: 3 },
  { id: 'inst-05', employeeId: 'EMP-EEE-019', name: 'Prof. Dr. M. A. Karim', designation: 'Professor', department: 'EEE', email: 'karim.eee@metrouni.edu.bd', phone: '+880 1912-778899', status: 'Active', coursesAllocatedCount: 2 }
];

export const INITIAL_ADMIN_COURSES: Course[] = [
  { id: 'crs-01', code: 'CSE 311', title: 'Database Management Systems', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Tariqul Islam', section: 'A', schedule: 'Sun/Wed 09:00 AM', room: 'Room 402' },
  { id: 'crs-02', code: 'CSE 312', title: 'Database Systems Lab', credits: 1.5, department: 'CSE', semester: 'Spring 2026', type: 'Lab', instructorName: 'Dr. Tariqul Islam', section: 'A1', schedule: 'Tue 09:00 AM', room: 'Lab 302' },
  { id: 'crs-03', code: 'CSE 313', title: 'Compiler Design', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Asst. Prof. Mahfuzur Rahman', section: 'A', schedule: 'Sun/Tue 11:00 AM', room: 'Lab 301' },
  { id: 'crs-04', code: 'CSE 315', title: 'Computer Networks', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Nazmul Huda', section: 'A', schedule: 'Tue/Thu 12:00 PM', room: 'Room 505' },
  { id: 'crs-05', code: 'CSE 317', title: 'Software Engineering & Agile', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Lecturer Sharmin Akter', section: 'A', schedule: 'Thu 10:00 AM', room: 'Auditorium 2' },
  { id: 'crs-06', code: 'EEE 211', title: 'Signals and Systems', credits: 3.0, department: 'EEE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Prof. Dr. M. A. Karim', section: 'A', schedule: 'Mon/Wed 02:00 PM', room: 'Room 304' }
];

export const INITIAL_STUDENTS_REGISTRY: StudentRegistryItem[] = [
  { id: 'reg-01', studentId: '241-115-211', name: 'Fathin Sadman', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.42, attendance: 84.5, riskLevel: 'SAFE', email: 'student@metrouni.edu.bd', phone: '+880 1799-112233', status: 'Active' },
  { id: 'reg-02', studentId: '241-115-212', name: 'Tahsin Ahmed', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.91, attendance: 92.0, riskLevel: 'SAFE', email: 'tahsin.ahmed@metrouni.edu.bd', phone: '+880 1788-223344', status: 'Active' },
  { id: 'reg-03', studentId: '241-115-213', name: 'Nusrat Jahan', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.85, attendance: 72.0, riskLevel: 'WARNING', email: 'nusrat.jahan@metrouni.edu.bd', phone: '+880 1777-334455', status: 'Active' },
  { id: 'reg-04', studentId: '241-115-214', name: 'Shahriar Kabir', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.12, attendance: 54.0, riskLevel: 'CRITICAL', email: 'shahriar.kabir@metrouni.edu.bd', phone: '+880 1766-445566', status: 'Probation' },
  { id: 'reg-05', studentId: '241-115-215', name: 'Ayesha Siddiqua', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.65, attendance: 85.0, riskLevel: 'SAFE', email: 'ayesha.s@metrouni.edu.bd', phone: '+880 1755-556677', status: 'Active' },
  { id: 'reg-06', studentId: '241-115-216', name: 'Mahmudul Hasan', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.38, attendance: 64.0, riskLevel: 'CRITICAL', email: 'mahmudul.h@metrouni.edu.bd', phone: '+880 1744-667788', status: 'Active' }
];

export const INITIAL_COURSE_ALLOCATIONS: CourseAllocationItem[] = [
  { id: 'alc-01', courseId: 'crs-01', courseCode: 'CSE 311', courseTitle: 'Database Management Systems', instructorId: 'inst-01', instructorName: 'Dr. Tariqul Islam', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Sunday & Wednesday', timeSlot: '09:00 AM - 10:30 AM', room: 'Room 402' },
  { id: 'alc-02', courseId: 'crs-02', courseCode: 'CSE 312', courseTitle: 'Database Systems Lab', instructorId: 'inst-01', instructorName: 'Dr. Tariqul Islam', section: 'A1', department: 'CSE', semester: 'Spring 2026', day: 'Tuesday', timeSlot: '09:00 AM - 11:30 AM', room: 'Lab 302' },
  { id: 'alc-03', courseId: 'crs-03', courseCode: 'CSE 313', courseTitle: 'Compiler Design', instructorId: 'inst-02', instructorName: 'Asst. Prof. Mahfuzur Rahman', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Sunday & Tuesday', timeSlot: '11:00 AM - 12:30 PM', room: 'Lab 301' },
  { id: 'alc-04', courseId: 'crs-04', courseCode: 'CSE 315', courseTitle: 'Computer Networks', instructorId: 'inst-03', instructorName: 'Dr. Nazmul Huda', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Tuesday & Thursday', timeSlot: '12:00 PM - 01:30 PM', room: 'Room 505' },
  { id: 'alc-05', courseId: 'crs-05', courseCode: 'CSE 317', courseTitle: 'Software Engineering & Agile', instructorId: 'inst-04', instructorName: 'Lecturer Sharmin Akter', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Thursday', timeSlot: '10:00 AM - 11:30 AM', room: 'Auditorium 2' }
];
