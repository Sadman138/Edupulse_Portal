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
  Course,
  SyllabusChapter,
  UpcomingExamItem
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_student_01',
    name: 'Fathin Anzum Sadman',
    email: 'fathinanzumsadman@gmail.com',
    role: 'STUDENT',
    department: 'CSE',
    departmentName: 'Computer Science & Engineering',
    institution: 'Metropolitan University, Sylhet',
    studentId: '241-115-211',
    batch: '60th Batch',
    section: 'Section E',
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
    dueDate: '2026-10-25',
    totalPoints: 20,
    status: 'SUBMITTED',
    submissionDate: '2026-10-05',
    submittedFileName: 'Fathin_Sadman_CSE311_Assignment1.pdf',
    submittedStudentName: 'Fathin Anzum Sadman',
    submittedStudentId: '241-115-211',
    obtainedScore: 19,
    facultyFeedback: 'Excellent ER model diagram and clear decomposition proofs.',
    attachments: ['CSE311_Assignment1_Specification_DrTariqul.pdf'],
    attachmentPdfName: 'CSE311_Assignment1_Specification_DrTariqul.pdf',
    attachmentPdfData: `METROPOLITAN UNIVERSITY
Department of Computer Science & Engineering
Course: CSE 311 — Database Management Systems
Instructor: Dr. Tariqul Islam
Assignment #1: ER Diagram & Relational Normalization
Total Marks: 20 Marks

OBJECTIVE & PROBLEM SPECIFICATION:
1. Develop an enterprise Entity-Relationship (ER) diagram for Metropolitan University Hospital Information System.
2. Formulate relational tables with primary keys, composite keys, and foreign key integrity constraints.
3. Provide rigorous mathematical proofs for 1NF, 2NF, 3NF, and BCNF canonical decomposition.
4. Provide verified SQL DDL scripts with CHECK constraints and cascade behaviors.

SUBMISSION RULES:
- Submit solution in PDF format.
- Strictly adhere to the deadline; system closes submissions automatically upon deadline expiry.`,
    submittedPdfData: `METROPOLITAN UNIVERSITY — STUDENT ASSIGNMENT ANSWER SHEET
Student Name: Fathin Anzum Sadman
Student ID: 241-115-211
Batch: 60th Batch | Section: Section E
Course: CSE 311 (Database Management Systems)
Instructor: Dr. Tariqul Islam

ANSWER DELIVERABLE & PROOFS:
1. ER Diagram Structure:
   - Primary Entities: Patient, Physician, Ward, Appointment, Prescription, BillingRecord.
   - Cardinality: Physician (1:N) Appointment (N:1) Patient.

2. Normalization Steps:
   - Initial relation R(PatientId, DoctorId, Date, Treatment, Diagnosis, Fee) decomposed.
   - Decomposed into R1(PatientId, Treatment, Diagnosis) and R2(DoctorId, Date, Fee).
   - Lossless-join and Dependency preservation tested and satisfied.

3. SQL Schema Script:
   CREATE TABLE hospital_patient (
     patient_id VARCHAR(15) PRIMARY KEY,
     full_name VARCHAR(100) NOT NULL,
     date_of_birth DATE NOT NULL
   );`
  },
  {
    id: 'asg-02',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    title: 'Lexical Analyzer Implementation in C++/Flex',
    description: 'Construct a DFA-based tokenizer supporting arithmetic expressions, keywords, and floating-point literals with error tokens.',
    assignedDate: '2026-10-03',
    dueDate: '2026-10-30',
    totalPoints: 25,
    status: 'PENDING',
    attachments: ['CSE313_Lexical_Analyzer_Project_Spec.pdf'],
    attachmentPdfName: 'CSE313_Lexical_Analyzer_Project_Spec.pdf',
    attachmentPdfData: `METROPOLITAN UNIVERSITY
Department of Computer Science & Engineering
Course: CSE 313 — Compiler Design
Faculty: Dept. of Computer Science & Engineering
Assignment #2: Lexical Analyzer Specification & Implementation
Total Marks: 25 Marks

ASSIGNMENT TASK & SPECIFICATIONS:
1. Construct a deterministic finite automaton (DFA) that identifies language tokens:
   - Keywords: if, else, while, for, int, float, return.
   - Identifiers: [a-zA-Z_][a-zA-Z0-9_]*
   - Constants: Integer literals and Floating point numbers with exponents.
   - Relational and Arithmetic Operators: ==, !=, <=, >=, +, -, *, /, %
2. Implement symbol table storage for identifier lookup.
3. Implement lexical error reporting with line numbers and character positions.

DELIVERABLE REQUIRED:
- Submit your source code documentation and DFA state transition table in PDF format.
- Answer submission must be uploaded through the student portal.`
  },
  {
    id: 'asg-03',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    title: 'Packet Sniffing and Wireshark TCP Handshake Analysis',
    description: 'Capture 3-way TCP handshake and dissect sequence numbers, window scaling, and HTTP headers in Wireshark trace file.',
    assignedDate: '2026-09-25',
    dueDate: '2026-10-28',
    totalPoints: 15,
    status: 'GRADED',
    submissionDate: '2026-10-04',
    submittedFileName: 'Wireshark_Report_241-115-211.pdf',
    submittedStudentName: 'Fathin Anzum Sadman',
    submittedStudentId: '241-115-211',
    obtainedScore: 14,
    facultyFeedback: 'Good capture analysis. Minor omission on TCP SYN flag retransmission timing.',
    attachments: ['CSE315_Lab_Wireshark_Experiment_Spec.pdf'],
    attachmentPdfName: 'CSE315_Lab_Wireshark_Experiment_Spec.pdf',
    attachmentPdfData: `METROPOLITAN UNIVERSITY
Department of Computer Science & Engineering
Course: CSE 315 — Computer Networks
Assignment #3: Wireshark Protocol Analysis Laboratory
Total Marks: 15 Marks

LABORATORY INSTRUCTIONS:
1. Capture a clean HTTP GET session using Wireshark on local network interface.
2. Locate the SYN, SYN-ACK, and ACK packets establishing the TCP connection.
3. Document initial sequence numbers (ISN) and calculate relative sequence numbers.
4. Graph Round-Trip Time (RTT) against throughput.

SUBMISSION REQUIREMENTS:
- Submit full Wireshark annotated trace report in PDF format.`
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
  },
  {
    id: 'rt-06',
    day: 'Monday',
    timeSlot: '09:30 AM - 11:00 AM',
    courseCode: 'CSE 221',
    courseTitle: 'Data Structures & Algorithms',
    instructor: 'Lecturer Sadia Afrin',
    room: 'Room 401',
    type: 'Theory'
  },
  {
    id: 'rt-07',
    day: 'Monday',
    timeSlot: '11:30 AM - 01:00 PM',
    courseCode: 'CE 201',
    courseTitle: 'Structural Analysis & Design',
    instructor: 'Prof. Dr. Ariful Haque',
    room: 'CE Hall 101',
    type: 'Theory'
  },
  {
    id: 'rt-08',
    day: 'Monday',
    timeSlot: '02:00 PM - 03:30 PM',
    courseCode: 'SWE 301',
    courseTitle: 'DevOps & Cloud Architecture',
    instructor: 'Assoc. Prof. Fahmida Hossain',
    room: 'Room 406',
    type: 'Theory'
  },
  {
    id: 'rt-09',
    day: 'Wednesday',
    timeSlot: '09:00 AM - 10:30 AM',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    instructor: 'Dr. Tariqul Islam',
    room: 'Room 402',
    type: 'Theory'
  },
  {
    id: 'rt-10',
    day: 'Wednesday',
    timeSlot: '11:00 AM - 01:30 PM',
    courseCode: 'CSE 222',
    courseTitle: 'Data Structures Lab',
    instructor: 'Lecturer Sadia Afrin',
    room: 'Lab 201',
    type: 'Lab'
  },
  {
    id: 'rt-11',
    day: 'Wednesday',
    timeSlot: '01:30 PM - 03:00 PM',
    courseCode: 'PHARM 301',
    courseTitle: 'Pharmacology & Therapeutics I',
    instructor: 'Dr. Munirul Islam',
    room: 'Pharma Lab 3',
    type: 'Theory'
  },
  {
    id: 'rt-12',
    day: 'Thursday',
    timeSlot: '09:00 AM - 10:30 AM',
    courseCode: 'BBA 201',
    courseTitle: 'Financial & Managerial Accounting',
    instructor: 'Prof. Dr. Taher Choudhury',
    room: 'BBA Hall 1',
    type: 'Theory'
  },
  {
    id: 'rt-13',
    day: 'Thursday',
    timeSlot: '02:00 PM - 03:30 PM',
    courseCode: 'LAW 205',
    courseTitle: 'Cyber Law, Ethics & Intellectual Property',
    instructor: 'Dr. Shamsul Huda',
    room: 'Law Moot Court',
    type: 'Theory'
  },
  {
    id: 'rt-14',
    day: 'Sunday',
    timeSlot: '09:00 AM - 01:00 PM',
    courseCode: 'ARC 102',
    courseTitle: 'Basic Architectural Design Studio',
    instructor: 'Assoc. Prof. Nusrat Sharmin',
    room: 'Architecture Studio 1',
    type: 'Lab'
  }
];

// Week 5 Teacher Mock Data - Comprehensive Roster (28 Students across Sections)
export const INITIAL_TEACHER_STUDENTS = [
  { studentId: '241-115-211', studentName: 'Fathin Anzum Sadman', rollNumber: '211', email: 'fathinanzumsadman@gmail.com', section: 'E', attendanceRate: 88, currentMarks: 88, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-212', studentName: 'Tahsin Ahmed', rollNumber: '212', email: 'tahsin.ahmed@metrouni.edu.bd', section: 'A', attendanceRate: 92, currentMarks: 92, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-213', studentName: 'Nusrat Jahan', rollNumber: '213', email: 'nusrat.jahan@metrouni.edu.bd', section: 'A', attendanceRate: 72, currentMarks: 61, riskLevel: 'WARNING' as const, attendanceStatus: 'LATE' as const },
  { studentId: '241-115-214', studentName: 'Shahriar Kabir', rollNumber: '214', email: 'shahriar.kabir@metrouni.edu.bd', section: 'A', attendanceRate: 54, currentMarks: 39, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-215', studentName: 'Ayesha Siddiqua', rollNumber: '215', email: 'ayesha.s@metrouni.edu.bd', section: 'A', attendanceRate: 85, currentMarks: 81, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-216', studentName: 'Mahmudul Hasan', rollNumber: '216', email: 'mahmudul.h@metrouni.edu.bd', section: 'A', attendanceRate: 64, currentMarks: 47, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-217', studentName: 'Zubair Hossain', rollNumber: '217', email: 'zubair.h@metrouni.edu.bd', section: 'B', attendanceRate: 80, currentMarks: 76, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-218', studentName: 'Farhana Yeasmin', rollNumber: '218', email: 'farhana.y@metrouni.edu.bd', section: 'A', attendanceRate: 94, currentMarks: 94, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-219', studentName: 'Raiyan Chowdhury', rollNumber: '219', email: 'raiyan.c@metrouni.edu.bd', section: 'A', attendanceRate: 89, currentMarks: 86, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-220', studentName: 'Sabbir Ahmed', rollNumber: '220', email: 'sabbir.a@metrouni.edu.bd', section: 'B', attendanceRate: 74, currentMarks: 64, riskLevel: 'WARNING' as const, attendanceStatus: 'LATE' as const },
  { studentId: '241-115-221', studentName: 'Tasnim Ferdous', rollNumber: '221', email: 'tasnim.f@metrouni.edu.bd', section: 'A', attendanceRate: 91, currentMarks: 90, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-222', studentName: 'Imran Nazir', rollNumber: '222', email: 'imran.n@metrouni.edu.bd', section: 'B', attendanceRate: 58, currentMarks: 42, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-223', studentName: 'Md Al Mekdad Ajmol', rollNumber: '223', email: 'mekdad.a@metrouni.edu.bd', section: 'A', attendanceRate: 87, currentMarks: 85, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-224', studentName: 'Sadia Sultana', rollNumber: '224', email: 'sadia.s@metrouni.edu.bd', section: 'A', attendanceRate: 86, currentMarks: 79, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-225', studentName: 'Anik Debnath', rollNumber: '225', email: 'anik.d@metrouni.edu.bd', section: 'B', attendanceRate: 68, currentMarks: 58, riskLevel: 'WARNING' as const, attendanceStatus: 'LATE' as const },
  { studentId: '241-115-226', studentName: 'Nafis Fuad', rollNumber: '226', email: 'nafis.f@metrouni.edu.bd', section: 'B', attendanceRate: 95, currentMarks: 96, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-227', studentName: 'Mehjabin Haque', rollNumber: '227', email: 'mehjabin.h@metrouni.edu.bd', section: 'A', attendanceRate: 90, currentMarks: 89, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-228', studentName: 'Wasim Akram', rollNumber: '228', email: 'wasim.a@metrouni.edu.bd', section: 'B', attendanceRate: 52, currentMarks: 34, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-229', studentName: 'Rifat Bin Alam', rollNumber: '229', email: 'rifat.a@metrouni.edu.bd', section: 'A', attendanceRate: 84, currentMarks: 82, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-230', studentName: 'Samia Parveen', rollNumber: '230', email: 'samia.p@metrouni.edu.bd', section: 'B', attendanceRate: 77, currentMarks: 71, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-231', studentName: 'Ashraful Haque', rollNumber: '231', email: 'ashraful.h@metrouni.edu.bd', section: 'A', attendanceRate: 86, currentMarks: 88, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-232', studentName: 'Fariha Jannat', rollNumber: '232', email: 'fariha.j@metrouni.edu.bd', section: 'B', attendanceRate: 93, currentMarks: 95, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-233', studentName: 'Kazi Mahir', rollNumber: '233', email: 'kazi.m@metrouni.edu.bd', section: 'A', attendanceRate: 71, currentMarks: 55, riskLevel: 'WARNING' as const, attendanceStatus: 'LATE' as const },
  { studentId: '241-115-234', studentName: 'Nusrat Fariha', rollNumber: '234', email: 'nusrat.f@metrouni.edu.bd', section: 'B', attendanceRate: 89, currentMarks: 91, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-235', studentName: 'Tanvir Hossain', rollNumber: '235', email: 'tanvir.h@metrouni.edu.bd', section: 'A', attendanceRate: 82, currentMarks: 80, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-236', studentName: 'Sadman Sakib', rollNumber: '236', email: 'sadman.s@metrouni.edu.bd', section: 'B', attendanceRate: 61, currentMarks: 46, riskLevel: 'CRITICAL' as const, attendanceStatus: 'ABSENT' as const },
  { studentId: '241-115-237', studentName: 'Anika Tabassum', rollNumber: '237', email: 'anika.t@metrouni.edu.bd', section: 'A', attendanceRate: 91, currentMarks: 92, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const },
  { studentId: '241-115-238', studentName: 'Jannatul Ferdous', rollNumber: '238', email: 'jannat.f@metrouni.edu.bd', section: 'B', attendanceRate: 79, currentMarks: 75, riskLevel: 'SAFE' as const, attendanceStatus: 'PRESENT' as const }
];

export const INITIAL_ASSESSMENT_RECORDS: AssessmentRecord[] = [
  { studentId: '241-115-211', studentName: 'Fathin Anzum Sadman', rollNumber: '211', quiz1: 18, quiz2: 19, quiz3: 20, bestTwoCtAverage: 19.5, midterm: 26, assignment: 9, finalExam: 36, total: 91, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-212', studentName: 'Tahsin Ahmed', rollNumber: '212', quiz1: 20, quiz2: 18, quiz3: 19, bestTwoCtAverage: 19.5, midterm: 28, assignment: 10, finalExam: 36, total: 94, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-213', studentName: 'Nusrat Jahan', rollNumber: '213', quiz1: 12, quiz2: 14, quiz3: 11, bestTwoCtAverage: 13.0, midterm: 18, assignment: 7, finalExam: 24, total: 62, letterGrade: 'B', gpa: 3.0 },
  { studentId: '241-115-214', studentName: 'Shahriar Kabir', rollNumber: '214', quiz1: 8, quiz2: 9, quiz3: 6, bestTwoCtAverage: 8.5, midterm: 11, assignment: 4, finalExam: 15, total: 39, letterGrade: 'F', gpa: 0.0 },
  { studentId: '241-115-215', studentName: 'Ayesha Siddiqua', rollNumber: '215', quiz1: 16, quiz2: 17, quiz3: 18, bestTwoCtAverage: 17.5, midterm: 24, assignment: 8, finalExam: 32, total: 82, letterGrade: 'A', gpa: 3.75 },
  { studentId: '241-115-216', studentName: 'Mahmudul Hasan', rollNumber: '216', quiz1: 10, quiz2: 8, quiz3: 12, bestTwoCtAverage: 11.0, midterm: 14, assignment: 5, finalExam: 18, total: 48, letterGrade: 'C', gpa: 2.25 },
  { studentId: '241-115-217', studentName: 'Zubair Hossain', rollNumber: '217', quiz1: 15, quiz2: 16, quiz3: 17, bestTwoCtAverage: 16.5, midterm: 22, assignment: 8, finalExam: 30, total: 77, letterGrade: 'A', gpa: 3.75 },
  { studentId: '241-115-218', studentName: 'Farhana Yeasmin', rollNumber: '218', quiz1: 19, quiz2: 20, quiz3: 19, bestTwoCtAverage: 19.5, midterm: 29, assignment: 10, finalExam: 38, total: 97, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-219', studentName: 'Raiyan Chowdhury', rollNumber: '219', quiz1: 17, quiz2: 18, quiz3: 19, bestTwoCtAverage: 18.5, midterm: 25, assignment: 9, finalExam: 34, total: 87, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-220', studentName: 'Sabbir Ahmed', rollNumber: '220', quiz1: 13, quiz2: 13, quiz3: 15, bestTwoCtAverage: 14.0, midterm: 19, assignment: 7, finalExam: 25, total: 65, letterGrade: 'B+', gpa: 3.25 },
  { studentId: '241-115-221', studentName: 'Tasnim Ferdous', rollNumber: '221', quiz1: 18, quiz2: 19, quiz3: 20, bestTwoCtAverage: 19.5, midterm: 27, assignment: 9, finalExam: 37, total: 93, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-222', studentName: 'Imran Nazir', rollNumber: '222', quiz1: 9, quiz2: 8, quiz3: 10, bestTwoCtAverage: 9.5, midterm: 12, assignment: 4, finalExam: 17, total: 43, letterGrade: 'D', gpa: 2.0 },
  { studentId: '241-115-223', studentName: 'Md Al Mekdad Ajmol', rollNumber: '223', quiz1: 17, quiz2: 18, quiz3: 18, bestTwoCtAverage: 18.0, midterm: 24, assignment: 9, finalExam: 34, total: 85, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-224', studentName: 'Sadia Sultana', rollNumber: '224', quiz1: 15, quiz2: 16, quiz3: 17, bestTwoCtAverage: 16.5, midterm: 24, assignment: 8, finalExam: 31, total: 80, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-225', studentName: 'Anik Debnath', rollNumber: '225', quiz1: 11, quiz2: 12, quiz3: 13, bestTwoCtAverage: 12.5, midterm: 17, assignment: 6, finalExam: 22, total: 58, letterGrade: 'B-', gpa: 2.75 },
  { studentId: '241-115-226', studentName: 'Nafis Fuad', rollNumber: '226', quiz1: 20, quiz2: 20, quiz3: 19, bestTwoCtAverage: 20.0, midterm: 30, assignment: 10, finalExam: 39, total: 99, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-227', studentName: 'Mehjabin Haque', rollNumber: '227', quiz1: 18, quiz2: 18, quiz3: 19, bestTwoCtAverage: 18.5, midterm: 27, assignment: 9, finalExam: 35, total: 90, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-228', studentName: 'Wasim Akram', rollNumber: '228', quiz1: 7, quiz2: 6, quiz3: 5, bestTwoCtAverage: 6.5, midterm: 10, assignment: 3, finalExam: 14, total: 34, letterGrade: 'F', gpa: 0.0 },
  { studentId: '241-115-229', studentName: 'Rifat Bin Alam', rollNumber: '229', quiz1: 16, quiz2: 17, quiz3: 16, bestTwoCtAverage: 16.5, midterm: 25, assignment: 9, finalExam: 32, total: 83, letterGrade: 'A', gpa: 3.75 },
  { studentId: '241-115-230', studentName: 'Samia Parveen', rollNumber: '230', quiz1: 14, quiz2: 15, quiz3: 16, bestTwoCtAverage: 15.5, midterm: 21, assignment: 7, finalExam: 28, total: 72, letterGrade: 'A-', gpa: 3.50 },
  { studentId: '241-115-231', studentName: 'Ashraful Haque', rollNumber: '231', quiz1: 17, quiz2: 16, quiz3: 18, bestTwoCtAverage: 17.5, midterm: 26, assignment: 9, finalExam: 35, total: 88, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-232', studentName: 'Fariha Jannat', rollNumber: '232', quiz1: 19, quiz2: 18, quiz3: 20, bestTwoCtAverage: 19.5, midterm: 28, assignment: 10, finalExam: 37, total: 95, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-233', studentName: 'Kazi Mahir', rollNumber: '233', quiz1: 12, quiz2: 10, quiz3: 14, bestTwoCtAverage: 13.0, midterm: 16, assignment: 6, finalExam: 20, total: 55, letterGrade: 'B-', gpa: 2.75 },
  { studentId: '241-115-234', studentName: 'Nusrat Fariha', rollNumber: '234', quiz1: 18, quiz2: 19, quiz3: 17, bestTwoCtAverage: 18.5, midterm: 27, assignment: 9, finalExam: 36, total: 91, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-235', studentName: 'Tanvir Hossain', rollNumber: '235', quiz1: 16, quiz2: 17, quiz3: 16, bestTwoCtAverage: 16.5, midterm: 24, assignment: 8, finalExam: 32, total: 80, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-236', studentName: 'Sadman Sakib', rollNumber: '236', quiz1: 9, quiz2: 10, quiz3: 8, bestTwoCtAverage: 9.5, midterm: 14, assignment: 5, finalExam: 18, total: 46, letterGrade: 'C', gpa: 2.25 },
  { studentId: '241-115-237', studentName: 'Anika Tabassum', rollNumber: '237', quiz1: 19, quiz2: 18, quiz3: 20, bestTwoCtAverage: 19.5, midterm: 27, assignment: 9, finalExam: 36, total: 92, letterGrade: 'A+', gpa: 4.0 },
  { studentId: '241-115-238', studentName: 'Jannatul Ferdous', rollNumber: '238', quiz1: 15, quiz2: 16, quiz3: 15, bestTwoCtAverage: 15.5, midterm: 22, assignment: 8, finalExam: 30, total: 75, letterGrade: 'A', gpa: 3.75 }
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
    marksScore: 48,
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
    marksScore: 62,
    riskFactor: 'Borderline attendance (72%). 1 absence away from debarment.',
    status: 'MEETING_SCHEDULED',
    interventionHistory: [
      { date: '2026-10-06', action: 'Counseling Session Scheduled', note: 'Meeting fixed for Sunday 11:30 AM in Room 402.', by: 'Dr. Tariqul Islam' }
    ]
  },
  {
    id: 'hra-04',
    studentId: '241-115-228',
    studentName: 'Wasim Akram',
    courseCode: 'CSE 311',
    attendanceRate: 52,
    marksScore: 34,
    riskFactor: 'Critical risk: 52% attendance & 34 overall mark (Debarment warning).',
    status: 'ACTIVE_ALERT',
    interventionHistory: [
      { date: '2026-10-10', action: 'Dean Referral Letter Generated', note: 'Referred to Academic Committee for attendance exemption review.', by: 'Dr. Fahim Ahmed' }
    ]
  }
];

// Week 5 Admin Mock Data
export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept-01', code: 'CSE', name: 'Computer Science & Engineering', chairPerson: 'Prof. Dr. Nazrul Islam', facultyCount: 26, studentCount: 540, establishedYear: 2003, email: 'head.cse@metrouni.edu.bd' },
  { id: 'dept-02', code: 'EEE', name: 'Electrical & Electronic Engineering', chairPerson: 'Prof. Dr. M. A. Karim', facultyCount: 18, studentCount: 320, establishedYear: 2005, email: 'head.eee@metrouni.edu.bd' },
  { id: 'dept-03', code: 'SWE', name: 'Software Engineering', chairPerson: 'Assoc. Prof. Fahmida Hossain', facultyCount: 14, studentCount: 260, establishedYear: 2014, email: 'head.swe@metrouni.edu.bd' },
  { id: 'dept-04', code: 'BBA', name: 'Business Administration', chairPerson: 'Prof. Dr. Taher Choudhury', facultyCount: 18, studentCount: 420, establishedYear: 2003, email: 'head.bba@metrouni.edu.bd' },
  { id: 'dept-05', code: 'ENG', name: 'English Language & Literature', chairPerson: 'Assoc. Prof. Sanjida Khan', facultyCount: 10, studentCount: 180, establishedYear: 2004, email: 'head.eng@metrouni.edu.bd' },
  { id: 'dept-06', code: 'LAW', name: 'Department of Law & Justice', chairPerson: 'Dr. Shamsul Huda', facultyCount: 11, studentCount: 210, establishedYear: 2008, email: 'head.law@metrouni.edu.bd' },
  { id: 'dept-07', code: 'ARC', name: 'Department of Architecture', chairPerson: 'Assoc. Prof. Nusrat Sharmin', facultyCount: 12, studentCount: 190, establishedYear: 2016, email: 'head.arc@metrouni.edu.bd' },
  { id: 'dept-08', code: 'CE', name: 'Civil Engineering', chairPerson: 'Prof. Dr. Ariful Haque', facultyCount: 15, studentCount: 280, establishedYear: 2012, email: 'head.ce@metrouni.edu.bd' },
  { id: 'dept-09', code: 'PHARM', name: 'Department of Pharmacy', chairPerson: 'Dr. Munirul Islam', facultyCount: 16, studentCount: 250, establishedYear: 2015, email: 'head.pharm@metrouni.edu.bd' }
];

export const INITIAL_SEMESTERS: SemesterItem[] = [
  { id: 'sem-01', name: 'Spring 2026', sessionCode: '261', startDate: '2026-01-15', endDate: '2026-05-30', isActive: true, maxCredits: 21.0, enrollmentDeadline: '2026-01-25' },
  { id: 'sem-02', name: 'Summer 2026', sessionCode: '262', startDate: '2026-06-01', endDate: '2026-09-20', isActive: false, maxCredits: 15.0, enrollmentDeadline: '2026-06-10' },
  { id: 'sem-03', name: 'Fall 2025', sessionCode: '253', startDate: '2025-09-01', endDate: '2025-12-28', isActive: false, maxCredits: 21.0, enrollmentDeadline: '2025-09-12' },
  { id: 'sem-04', name: 'Spring 2025', sessionCode: '251', startDate: '2025-01-15', endDate: '2025-05-25', isActive: false, maxCredits: 21.0, enrollmentDeadline: '2025-01-25' }
];

export const INITIAL_INSTRUCTORS: InstructorItem[] = [
  { id: 'inst-01', employeeId: 'EMP-CSE-042', name: 'Dr. Tariqul Islam', designation: 'Associate Professor', department: 'CSE', email: 'tariqul.cse@metrouni.edu.bd', phone: '+880 1712-345678', status: 'Active', coursesAllocatedCount: 3 },
  { id: 'inst-02', employeeId: 'EMP-CSE-055', name: 'Asst. Prof. Mahfuzur Rahman', designation: 'Assistant Professor', department: 'CSE', email: 'mahfuz.cse@metrouni.edu.bd', phone: '+880 1711-223344', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-03', employeeId: 'EMP-CSE-061', name: 'Dr. Nazmul Huda', designation: 'Professor', department: 'CSE', email: 'nazmul.cse@metrouni.edu.bd', phone: '+880 1718-998877', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-04', employeeId: 'EMP-CSE-078', name: 'Lecturer Sharmin Akter', designation: 'Lecturer', department: 'CSE', email: 'sharmin.cse@metrouni.edu.bd', phone: '+880 1819-445566', status: 'Active', coursesAllocatedCount: 3 },
  { id: 'inst-05', employeeId: 'EMP-EEE-019', name: 'Prof. Dr. M. A. Karim', designation: 'Professor', department: 'EEE', email: 'karim.eee@metrouni.edu.bd', phone: '+880 1912-778899', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-06', employeeId: 'EMP-SWE-033', name: 'Assoc. Prof. Fahmida Hossain', designation: 'Associate Professor', department: 'SWE', email: 'fahmida.swe@metrouni.edu.bd', phone: '+880 1715-667788', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-07', employeeId: 'EMP-BBA-012', name: 'Prof. Dr. Taher Choudhury', designation: 'Professor', department: 'BBA', email: 'taher.bba@metrouni.edu.bd', phone: '+880 1811-990011', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-08', employeeId: 'EMP-CSE-089', name: 'Lecturer Sadia Afrin', designation: 'Lecturer', department: 'CSE', email: 'sadia.cse@metrouni.edu.bd', phone: '+880 1612-334455', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-09', employeeId: 'EMP-EEE-028', name: 'Dr. Kamal Uddin', designation: 'Associate Professor', department: 'EEE', email: 'kamal.eee@metrouni.edu.bd', phone: '+880 1714-556677', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-10', employeeId: 'EMP-ENG-005', name: 'Assoc. Prof. Sanjida Khan', designation: 'Associate Professor', department: 'ENG', email: 'sanjida.eng@metrouni.edu.bd', phone: '+880 1716-112233', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-11', employeeId: 'EMP-LAW-008', name: 'Dr. Shamsul Huda', designation: 'Associate Professor', department: 'LAW', email: 'shamsul.law@metrouni.edu.bd', phone: '+880 1717-334455', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-12', employeeId: 'EMP-CSE-095', name: 'Dr. Tanvir Anjum', designation: 'Assistant Professor', department: 'CSE', email: 'tanvir.cse@metrouni.edu.bd', phone: '+880 1719-778811', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-13', employeeId: 'EMP-CE-014', name: 'Prof. Dr. Ariful Haque', designation: 'Professor', department: 'CE', email: 'ariful.ce@metrouni.edu.bd', phone: '+880 1713-112244', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-14', employeeId: 'EMP-ARC-021', name: 'Assoc. Prof. Nusrat Sharmin', designation: 'Associate Professor', department: 'ARC', email: 'nusrat.arc@metrouni.edu.bd', phone: '+880 1715-334466', status: 'Active', coursesAllocatedCount: 2 },
  { id: 'inst-15', employeeId: 'EMP-PHARM-007', name: 'Dr. Munirul Islam', designation: 'Associate Professor', department: 'PHARM', email: 'munirul.pharm@metrouni.edu.bd', phone: '+880 1716-556677', status: 'Active', coursesAllocatedCount: 2 }
];

export const INITIAL_ADMIN_COURSES: Course[] = [
  { id: 'crs-01', code: 'CSE 311', title: 'Database Management Systems', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Tariqul Islam', section: 'A', schedule: 'Sun/Wed 09:00 AM', room: 'Room 402' },
  { id: 'crs-02', code: 'CSE 312', title: 'Database Systems Lab', credits: 1.5, department: 'CSE', semester: 'Spring 2026', type: 'Lab', instructorName: 'Dr. Tariqul Islam', section: 'A1', schedule: 'Tue 09:00 AM', room: 'Lab 302' },
  { id: 'crs-03', code: 'CSE 313', title: 'Compiler Design', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Asst. Prof. Mahfuzur Rahman', section: 'A', schedule: 'Sun/Tue 11:00 AM', room: 'Lab 301' },
  { id: 'crs-04', code: 'CSE 315', title: 'Computer Networks', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Nazmul Huda', section: 'A', schedule: 'Tue/Thu 12:00 PM', room: 'Room 505' },
  { id: 'crs-05', code: 'CSE 317', title: 'Software Engineering & Agile', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Lecturer Sharmin Akter', section: 'A', schedule: 'Thu 10:00 AM', room: 'Auditorium 2' },
  { id: 'crs-06', code: 'EEE 211', title: 'Signals and Systems', credits: 3.0, department: 'EEE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Prof. Dr. M. A. Karim', section: 'A', schedule: 'Mon/Wed 02:00 PM', room: 'Room 304' },
  { id: 'crs-07', code: 'CSE 221', title: 'Data Structures & Algorithms', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Lecturer Sadia Afrin', section: 'A', schedule: 'Mon/Thu 09:30 AM', room: 'Room 401' },
  { id: 'crs-08', code: 'CSE 222', title: 'Data Structures Lab', credits: 1.5, department: 'CSE', semester: 'Spring 2026', type: 'Lab', instructorName: 'Lecturer Sadia Afrin', section: 'A1', schedule: 'Wed 11:00 AM', room: 'Lab 201' },
  { id: 'crs-09', code: 'CSE 411', title: 'Artificial Intelligence & Machine Learning', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Nazmul Huda', section: 'A', schedule: 'Sun/Wed 01:30 PM', room: 'Room 502' },
  { id: 'crs-10', code: 'SWE 301', title: 'DevOps & Cloud Architecture', credits: 3.0, department: 'SWE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Assoc. Prof. Fahmida Hossain', section: 'A', schedule: 'Mon/Wed 10:30 AM', room: 'Room 406' },
  { id: 'crs-11', code: 'BBA 201', title: 'Financial & Managerial Accounting', credits: 3.0, department: 'BBA', semester: 'Spring 2026', type: 'Theory', instructorName: 'Prof. Dr. Taher Choudhury', section: 'A', schedule: 'Tue/Thu 09:00 AM', room: 'BBA Hall 1' },
  { id: 'crs-12', code: 'EEE 101', title: 'Electrical Circuit Analysis I', credits: 3.0, department: 'EEE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Kamal Uddin', section: 'A', schedule: 'Sun/Tue 02:30 PM', room: 'EEE Lab 2' },
  { id: 'crs-13', code: 'ENG 101', title: 'Technical English & Professional Communication', credits: 3.0, department: 'ENG', semester: 'Spring 2026', type: 'Theory', instructorName: 'Assoc. Prof. Sanjida Khan', section: 'A', schedule: 'Mon/Wed 08:30 AM', room: 'Room 204' },
  { id: 'crs-14', code: 'LAW 205', title: 'Cyber Law, Ethics & Intellectual Property', credits: 2.0, department: 'LAW', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Shamsul Huda', section: 'A', schedule: 'Thu 02:00 PM', room: 'Law Moot Court' },
  { id: 'crs-15', code: 'CSE 401', title: 'Distributed Systems & Microservices', credits: 3.0, department: 'CSE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Tanvir Anjum', section: 'A', schedule: 'Sun/Tue 03:00 PM', room: 'Room 504' },
  { id: 'crs-16', code: 'CE 201', title: 'Structural Analysis & Design', credits: 3.0, department: 'CE', semester: 'Spring 2026', type: 'Theory', instructorName: 'Prof. Dr. Ariful Haque', section: 'A', schedule: 'Mon/Wed 11:30 AM', room: 'CE Hall 101' },
  { id: 'crs-17', code: 'ARC 102', title: 'Basic Architectural Design & Visual Studies', credits: 4.0, department: 'ARC', semester: 'Spring 2026', type: 'Lab', instructorName: 'Assoc. Prof. Nusrat Sharmin', section: 'A', schedule: 'Sun/Tue 09:00 AM', room: 'Architecture Studio 1' },
  { id: 'crs-18', code: 'PHARM 301', title: 'Pharmacology & Therapeutics I', credits: 3.0, department: 'PHARM', semester: 'Spring 2026', type: 'Theory', instructorName: 'Dr. Munirul Islam', section: 'A', schedule: 'Wed/Thu 01:00 PM', room: 'Pharma Lab 3' }
];

export const INITIAL_STUDENTS_REGISTRY: StudentRegistryItem[] = [
  { id: 'reg-01', studentId: '241-115-211', name: 'Fathin Anzum Sadman', department: 'CSE', batch: '60th Batch', currentSemester: '5th Semester', cgpa: 3.78, attendance: 88.0, riskLevel: 'SAFE', email: 'fathinanzumsadman@gmail.com', phone: '+880 1799-112233', status: 'Active' },
  { id: 'reg-02', studentId: '241-115-212', name: 'Tahsin Ahmed', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.91, attendance: 92.0, riskLevel: 'SAFE', email: 'tahsin.ahmed@metrouni.edu.bd', phone: '+880 1788-223344', status: 'Active' },
  { id: 'reg-03', studentId: '241-115-213', name: 'Nusrat Jahan', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.85, attendance: 72.0, riskLevel: 'WARNING', email: 'nusrat.jahan@metrouni.edu.bd', phone: '+880 1777-334455', status: 'Active' },
  { id: 'reg-04', studentId: '241-115-214', name: 'Shahriar Kabir', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.12, attendance: 54.0, riskLevel: 'CRITICAL', email: 'shahriar.kabir@metrouni.edu.bd', phone: '+880 1766-445566', status: 'Probation' },
  { id: 'reg-05', studentId: '241-115-215', name: 'Ayesha Siddiqua', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.65, attendance: 85.0, riskLevel: 'SAFE', email: 'ayesha.s@metrouni.edu.bd', phone: '+880 1755-556677', status: 'Active' },
  { id: 'reg-06', studentId: '241-115-216', name: 'Mahmudul Hasan', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.38, attendance: 64.0, riskLevel: 'CRITICAL', email: 'mahmudul.h@metrouni.edu.bd', phone: '+880 1744-667788', status: 'Active' },
  { id: 'reg-07', studentId: '241-115-217', name: 'Zubair Hossain', department: 'CSE', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 3.52, attendance: 80.0, riskLevel: 'SAFE', email: 'zubair.h@metrouni.edu.bd', phone: '+880 1733-112233', status: 'Active' },
  { id: 'reg-08', studentId: '241-115-218', name: 'Farhana Yeasmin', department: 'SWE', batch: '58th Batch', currentSemester: '7th Semester', cgpa: 3.95, attendance: 94.0, riskLevel: 'SAFE', email: 'farhana.y@metrouni.edu.bd', phone: '+880 1722-445566', status: 'Active' },
  { id: 'reg-09', studentId: '241-115-219', name: 'Raiyan Chowdhury', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.82, attendance: 89.0, riskLevel: 'SAFE', email: 'raiyan.c@metrouni.edu.bd', phone: '+880 1711-224466', status: 'Active' },
  { id: 'reg-10', studentId: '241-115-220', name: 'Sabbir Ahmed', department: 'EEE', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 2.92, attendance: 74.0, riskLevel: 'WARNING', email: 'sabbir.a@metrouni.edu.bd', phone: '+880 1812-334455', status: 'Active' },
  { id: 'reg-11', studentId: '241-115-221', name: 'Tasnim Ferdous', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.88, attendance: 91.0, riskLevel: 'SAFE', email: 'tasnim.f@metrouni.edu.bd', phone: '+880 1911-556677', status: 'Active' },
  { id: 'reg-12', studentId: '241-115-222', name: 'Imran Nazir', department: 'BBA', batch: '61st Batch', currentSemester: '1st Semester', cgpa: 2.20, attendance: 58.0, riskLevel: 'CRITICAL', email: 'imran.n@metrouni.edu.bd', phone: '+880 1611-778899', status: 'Probation' },
  { id: 'reg-13', studentId: '241-115-223', name: 'Md Al Mekdad Ajmol', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.75, attendance: 87.0, riskLevel: 'SAFE', email: 'mekdad.a@metrouni.edu.bd', phone: '+880 1715-998811', status: 'Active' },
  { id: 'reg-14', studentId: '241-115-224', name: 'Sadia Sultana', department: 'CSE', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 3.68, attendance: 86.0, riskLevel: 'SAFE', email: 'sadia.s@metrouni.edu.bd', phone: '+880 1726-114477', status: 'Active' },
  { id: 'reg-15', studentId: '241-115-225', name: 'Anik Debnath', department: 'EEE', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 2.78, attendance: 68.0, riskLevel: 'WARNING', email: 'anik.d@metrouni.edu.bd', phone: '+880 1735-889922', status: 'Active' },
  { id: 'reg-16', studentId: '241-115-226', name: 'Nafis Fuad', department: 'SWE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.98, attendance: 95.0, riskLevel: 'SAFE', email: 'nafis.f@metrouni.edu.bd', phone: '+880 1748-332211', status: 'Active' },
  { id: 'reg-17', studentId: '241-115-227', name: 'Mehjabin Haque', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.84, attendance: 90.0, riskLevel: 'SAFE', email: 'mehjabin.h@metrouni.edu.bd', phone: '+880 1759-445566', status: 'Active' },
  { id: 'reg-18', studentId: '241-115-228', name: 'Wasim Akram', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 1.95, attendance: 52.0, riskLevel: 'CRITICAL', email: 'wasim.a@metrouni.edu.bd', phone: '+880 1761-228899', status: 'Probation' },
  { id: 'reg-19', studentId: '241-115-229', name: 'Rifat Bin Alam', department: 'ENG', batch: '61st Batch', currentSemester: '1st Semester', cgpa: 3.60, attendance: 84.0, riskLevel: 'SAFE', email: 'rifat.a@metrouni.edu.bd', phone: '+880 1772-556633', status: 'Active' },
  { id: 'reg-20', studentId: '241-115-230', name: 'Samia Parveen', department: 'BBA', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 3.45, attendance: 77.0, riskLevel: 'SAFE', email: 'samia.p@metrouni.edu.bd', phone: '+880 1783-667744', status: 'Active' },
  { id: 'reg-21', studentId: '241-115-231', name: 'Ashraful Haque', department: 'CE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.72, attendance: 86.0, riskLevel: 'SAFE', email: 'ashraful.h@metrouni.edu.bd', phone: '+880 1712-445577', status: 'Active' },
  { id: 'reg-22', studentId: '241-115-232', name: 'Fariha Jannat', department: 'ARC', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 3.89, attendance: 93.0, riskLevel: 'SAFE', email: 'fariha.j@metrouni.edu.bd', phone: '+880 1714-889900', status: 'Active' },
  { id: 'reg-23', studentId: '241-115-233', name: 'Kazi Mahir', department: 'PHARM', batch: '61st Batch', currentSemester: '1st Semester', cgpa: 2.82, attendance: 71.0, riskLevel: 'WARNING', email: 'kazi.m@metrouni.edu.bd', phone: '+880 1716-223355', status: 'Active' },
  { id: 'reg-24', studentId: '241-115-234', name: 'Nusrat Fariha', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.90, attendance: 89.0, riskLevel: 'SAFE', email: 'nusrat.f@metrouni.edu.bd', phone: '+880 1718-446688', status: 'Active' },
  { id: 'reg-25', studentId: '241-115-235', name: 'Tanvir Hossain', department: 'SWE', batch: '60th Batch', currentSemester: '3rd Semester', cgpa: 3.65, attendance: 82.0, riskLevel: 'SAFE', email: 'tanvir.h@metrouni.edu.bd', phone: '+880 1720-668899', status: 'Active' },
  { id: 'reg-26', studentId: '241-115-236', name: 'Sadman Sakib', department: 'EEE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.35, attendance: 61.0, riskLevel: 'CRITICAL', email: 'sadman.s@metrouni.edu.bd', phone: '+880 1722-113355', status: 'Probation' },
  { id: 'reg-27', studentId: '241-115-237', name: 'Anika Tabassum', department: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.81, attendance: 91.0, riskLevel: 'SAFE', email: 'anika.t@metrouni.edu.bd', phone: '+880 1724-335577', status: 'Active' },
  { id: 'reg-28', studentId: '241-115-238', name: 'Jannatul Ferdous', department: 'BBA', batch: '61st Batch', currentSemester: '1st Semester', cgpa: 3.42, attendance: 79.0, riskLevel: 'SAFE', email: 'jannat.f@metrouni.edu.bd', phone: '+880 1726-557799', status: 'Active' }
];

export const INITIAL_COURSE_ALLOCATIONS: CourseAllocationItem[] = [
  { id: 'alc-01', courseId: 'crs-01', courseCode: 'CSE 311', courseTitle: 'Database Management Systems', instructorId: 'inst-01', instructorName: 'Dr. Tariqul Islam', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Sunday & Wednesday', timeSlot: '09:00 AM - 10:30 AM', room: 'Room 402' },
  { id: 'alc-02', courseId: 'crs-02', courseCode: 'CSE 312', courseTitle: 'Database Systems Lab', instructorId: 'inst-01', instructorName: 'Dr. Tariqul Islam', section: 'A1', department: 'CSE', semester: 'Spring 2026', day: 'Tuesday', timeSlot: '09:00 AM - 11:30 AM', room: 'Lab 302' },
  { id: 'alc-03', courseId: 'crs-03', courseCode: 'CSE 313', courseTitle: 'Compiler Design', instructorId: 'inst-02', instructorName: 'Asst. Prof. Mahfuzur Rahman', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Sunday & Tuesday', timeSlot: '11:00 AM - 12:30 PM', room: 'Lab 301' },
  { id: 'alc-04', courseId: 'crs-04', courseCode: 'CSE 315', courseTitle: 'Computer Networks', instructorId: 'inst-03', instructorName: 'Dr. Nazmul Huda', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Tuesday & Thursday', timeSlot: '12:00 PM - 01:30 PM', room: 'Room 505' },
  { id: 'alc-05', courseId: 'crs-05', courseCode: 'CSE 317', courseTitle: 'Software Engineering & Agile', instructorId: 'inst-04', instructorName: 'Lecturer Sharmin Akter', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Thursday', timeSlot: '10:00 AM - 11:30 AM', room: 'Auditorium 2' },
  { id: 'alc-06', courseId: 'crs-07', courseCode: 'CSE 221', courseTitle: 'Data Structures & Algorithms', instructorId: 'inst-08', instructorName: 'Lecturer Sadia Afrin', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Monday & Thursday', timeSlot: '09:30 AM - 11:00 AM', room: 'Room 401' },
  { id: 'alc-07', courseId: 'crs-10', courseCode: 'SWE 301', courseTitle: 'DevOps & Cloud Architecture', instructorId: 'inst-06', instructorName: 'Assoc. Prof. Fahmida Hossain', section: 'A', department: 'SWE', semester: 'Spring 2026', day: 'Monday & Wednesday', timeSlot: '10:30 AM - 12:00 PM', room: 'Room 406' },
  { id: 'alc-08', courseId: 'crs-11', courseCode: 'BBA 201', courseTitle: 'Financial & Managerial Accounting', instructorId: 'inst-07', instructorName: 'Prof. Dr. Taher Choudhury', section: 'A', department: 'BBA', semester: 'Spring 2026', day: 'Tuesday & Thursday', timeSlot: '09:00 AM - 10:30 AM', room: 'BBA Hall 1' },
  { id: 'alc-09', courseId: 'crs-13', courseCode: 'ENG 101', courseTitle: 'Technical English & Professional Communication', instructorId: 'inst-10', instructorName: 'Assoc. Prof. Sanjida Khan', section: 'A', department: 'ENG', semester: 'Spring 2026', day: 'Monday & Wednesday', timeSlot: '08:30 AM - 10:00 AM', room: 'Room 204' },
  { id: 'alc-10', courseId: 'crs-14', courseCode: 'LAW 205', courseTitle: 'Cyber Law, Ethics & Intellectual Property', instructorId: 'inst-11', instructorName: 'Dr. Shamsul Huda', section: 'A', department: 'LAW', semester: 'Spring 2026', day: 'Thursday', timeSlot: '02:00 PM - 03:30 PM', room: 'Law Moot Court' },
  { id: 'alc-11', courseId: 'crs-15', courseCode: 'CSE 401', courseTitle: 'Distributed Systems & Microservices', instructorId: 'inst-12', instructorName: 'Dr. Tanvir Anjum', section: 'A', department: 'CSE', semester: 'Spring 2026', day: 'Sunday & Tuesday', timeSlot: '03:00 PM - 04:30 PM', room: 'Room 504' }
];

export const INITIAL_SYLLABUS_CHAPTERS: SyllabusChapter[] = [
  {
    id: 'syl-ch-01',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    chapterNumber: 1,
    chapterTitle: 'Relational Database Fundamentals & ER Modeling',
    topics: [
      { id: 'top-101', title: 'Database System Concepts & Three-Schema Architecture', estimatedHours: 3, status: 'COMPLETED', teachingNotes: 'Covered physical, logical and view levels with Metropolitan University SIS diagram.', completionDate: '2026-01-20' },
      { id: 'top-102', title: 'Entity-Relationship (ER) & Enhanced ER (EER) Modeling', estimatedHours: 4, status: 'COMPLETED', teachingNotes: 'In-class exercises with university enrollment mini-world.', completionDate: '2026-01-28' },
      { id: 'top-103', title: 'Relational Model Constraints & Relational Algebra', estimatedHours: 4, status: 'COMPLETED', teachingNotes: 'Select, Project, Cartesian Product, Join and Division operators.', completionDate: '2026-02-05' }
    ]
  },
  {
    id: 'syl-ch-02',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    chapterNumber: 2,
    chapterTitle: 'SQL Querying, Triggers & Advanced DDL/DML',
    topics: [
      { id: 'top-201', title: 'Complex Queries, Nested Subqueries & Correlated Subqueries', estimatedHours: 4, status: 'COMPLETED', teachingNotes: 'Covered aggregate queries, HAVING, and window functions.', completionDate: '2026-02-18' },
      { id: 'top-202', title: 'Views, Assertions, Integrity Constraints & Indexes (B+ Trees)', estimatedHours: 3, status: 'COMPLETED', teachingNotes: 'Demonstrated index scans vs seq scans in PostgreSQL/MongoDB.', completionDate: '2026-02-26' },
      { id: 'top-203', title: 'Stored Procedures, Functions and Database Triggers', estimatedHours: 4, status: 'IN_PROGRESS', teachingNotes: 'Audit log trigger assignment ongoing.' }
    ]
  },
  {
    id: 'syl-ch-03',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    chapterNumber: 3,
    chapterTitle: 'Relational Database Design & Normalization',
    topics: [
      { id: 'top-301', title: 'Functional Dependencies & Armstrong Axioms', estimatedHours: 3, status: 'IN_PROGRESS', teachingNotes: 'Closure computation and minimal cover examples.' },
      { id: 'top-302', title: '1NF, 2NF, 3NF and Boyce-Codd Normal Form (BCNF)', estimatedHours: 4, status: 'NOT_STARTED' },
      { id: 'top-303', title: 'Multivalued Dependencies (4NF) & Lossless Join Decomposition', estimatedHours: 3, status: 'NOT_STARTED' }
    ]
  },
  {
    id: 'syl-ch-04',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    chapterNumber: 4,
    chapterTitle: 'Transaction Processing, ACID & Concurrency Control',
    topics: [
      { id: 'top-401', title: 'Transaction States, ACID Properties & Serializability Schedules', estimatedHours: 3, status: 'NOT_STARTED' },
      { id: 'top-402', title: 'Lock-Based Protocols (2PL, Strict 2PL) & Timestamp Ordering', estimatedHours: 4, status: 'NOT_STARTED' },
      { id: 'top-403', title: 'Deadlock Detection, Prevention and Recovery Techniques (ARIES)', estimatedHours: 3, status: 'NOT_STARTED' }
    ]
  },
  {
    id: 'syl-ch-05',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    chapterNumber: 1,
    chapterTitle: 'Lexical Analysis & Regular Expressions',
    topics: [
      { id: 'top-501', title: 'Phases of a Compiler & Lexical Token Specification', estimatedHours: 3, status: 'COMPLETED', teachingNotes: 'Thompson construction DFA walkthrough.', completionDate: '2026-01-22' },
      { id: 'top-502', title: 'NFA to DFA Conversion & DFA State Minimization', estimatedHours: 4, status: 'COMPLETED', teachingNotes: 'LEX/Flex tool demonstrations.', completionDate: '2026-02-04' }
    ]
  },
  {
    id: 'syl-ch-06',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    chapterNumber: 2,
    chapterTitle: 'Syntax Analysis & Parsing Algorithms',
    topics: [
      { id: 'top-601', title: 'Context-Free Grammars, Ambiguity & Left Recursion Elimination', estimatedHours: 4, status: 'COMPLETED', teachingNotes: 'Left factoring exercises.', completionDate: '2026-02-15' },
      { id: 'top-602', title: 'Top-Down Parsing: LL(1) Parsing Table Construction', estimatedHours: 4, status: 'COMPLETED', teachingNotes: 'FIRST and FOLLOW sets derivation.', completionDate: '2026-02-28' },
      { id: 'top-603', title: 'Bottom-Up Parsing: SLR(1), LR(1), and LALR(1) Parsing Tables', estimatedHours: 5, status: 'IN_PROGRESS', teachingNotes: 'Conflict resolution: Shift-Reduce and Reduce-Reduce.' }
    ]
  },
  {
    id: 'syl-ch-07',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    chapterNumber: 1,
    chapterTitle: 'Application & Transport Layer Architecture',
    topics: [
      { id: 'top-701', title: 'OSI vs TCP/IP Protocols & Socket Programming', estimatedHours: 3, status: 'COMPLETED', completionDate: '2026-01-25' },
      { id: 'top-702', title: 'Reliable Data Transfer (rdt 3.0, Go-Back-N, Selective Repeat)', estimatedHours: 4, status: 'COMPLETED', completionDate: '2026-02-10' },
      { id: 'top-703', title: 'TCP Congestion Control (AIMD, Slow Start, Fast Recovery)', estimatedHours: 4, status: 'IN_PROGRESS' }
    ]
  }
];

export const INITIAL_UPCOMING_EXAMINATIONS: UpcomingExamItem[] = [
  {
    id: 'exam-01',
    title: 'Midterm Examination: Database Systems',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    type: 'MIDTERM',
    date: '2026-03-15',
    startTime: '10:00 AM',
    durationMinutes: 90,
    room: 'Room 402 & 403',
    instructorName: 'Dr. Tariqul Islam',
    instructions: 'Non-programmable calculators allowed. Closed-book exam. Bring valid student ID card.',
    totalMarks: 30,
    section: 'Section A & B',
    status: 'SCHEDULED'
  },
  {
    id: 'exam-02',
    title: 'Class Test 3 (Surprise Quiz): Compiler LR Parsing',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    type: 'CLASS_TEST',
    date: '2026-03-08',
    startTime: '11:15 AM',
    durationMinutes: 30,
    room: 'Lab 301',
    instructorName: 'Asst. Prof. Mahfuzur Rahman',
    instructions: 'Constructing SLR(1) parsing table from augmented grammar. Best 2 of 3 CT marks count.',
    totalMarks: 20,
    section: 'Section A',
    status: 'SCHEDULED'
  },
  {
    id: 'exam-03',
    title: 'Practical Lab Exam & Code Viva: DBMS',
    courseCode: 'CSE 312',
    courseTitle: 'Database Systems Lab',
    type: 'LAB_EXAM',
    date: '2026-03-22',
    startTime: '09:00 AM',
    durationMinutes: 120,
    room: 'Lab 302',
    instructorName: 'Dr. Tariqul Islam',
    instructions: 'Hands-on query execution, PL/pgSQL stored procedures, and schema normalization viva.',
    totalMarks: 25,
    section: 'Section A1',
    status: 'SCHEDULED'
  },
  {
    id: 'exam-04',
    title: 'Networks Protocol Design Presentation',
    courseCode: 'CSE 315',
    courseTitle: 'Computer Networks',
    type: 'PRESENTATION',
    date: '2026-03-26',
    startTime: '12:00 PM',
    durationMinutes: 60,
    room: 'Room 505',
    instructorName: 'Dr. Nazmul Huda',
    instructions: 'Group presentations on custom application layer protocol implementation in Python.',
    totalMarks: 15,
    section: 'Section A',
    status: 'SCHEDULED'
  },
  {
    id: 'exam-05',
    title: 'Semester Final Examination: Compiler Design',
    courseCode: 'CSE 313',
    courseTitle: 'Compiler Design',
    type: 'FINAL',
    date: '2026-05-18',
    startTime: '09:30 AM',
    durationMinutes: 180,
    room: 'Main Examination Hall',
    instructorName: 'Asst. Prof. Mahfuzur Rahman',
    instructions: 'Central controller examination. Mandatory university admit card required. Strict exam hall rules apply.',
    totalMarks: 40,
    section: 'All Sections',
    status: 'SCHEDULED'
  }
];


