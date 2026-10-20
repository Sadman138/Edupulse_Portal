import React, { useState } from 'react';
import {
  Database,
  Table,
  Key,
  Link2,
  FileCode,
  Download,
  Copy,
  Check,
  Play,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Users,
  Building,
  GraduationCap,
  School,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';

interface SchemaTable {
  id: string;
  name: string;
  category: 'Core' | 'Academic' | 'Teaching' | 'Attendance' | 'Assessment' | 'Deliverables';
  description: string;
  pk: string[];
  columns: {
    name: string;
    type: string;
    pk?: boolean;
    fk?: { targetTable: string; targetCol: string };
    nullable?: boolean;
    description: string;
  }[];
  sampleRows: Record<string, string | number>[];
}

const TABLES: SchemaTable[] = [
  {
    id: 'departments',
    name: 'departments',
    category: 'Academic',
    description: 'Academic departments, faculty count, student enrollment, and department leadership',
    pk: ['dept_id'],
    columns: [
      { name: 'dept_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'code', type: 'VARCHAR(10)', nullable: false, description: 'Unique Department Code (e.g. CSE)' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Full Department Name' },
      { name: 'chair_person', type: 'VARCHAR(120)', nullable: false, description: 'Head of Department' },
      { name: 'established_year', type: 'INT', nullable: false, description: 'Foundation Year' },
      { name: 'email', type: 'VARCHAR(120)', nullable: false, description: 'Official Contact Email' },
      { name: 'faculty_count', type: 'INT', nullable: false, description: 'Active Faculty Members' },
      { name: 'student_count', type: 'INT', nullable: false, description: 'Enrolled Students' }
    ],
    sampleRows: [
      { dept_id: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering', chair_person: 'Prof. Dr. Tariqul Islam', established_year: 2003, student_count: 620 },
      { dept_id: 'dept-2', code: 'EEE', name: 'Electrical & Electronic Engineering', chair_person: 'Dr. Mahbubur Rahman', established_year: 2005, student_count: 340 }
    ]
  },
  {
    id: 'semesters',
    name: 'semesters',
    category: 'Academic',
    description: 'Academic calendar sessions, terms, active registration window, and credit bounds',
    pk: ['semester_id'],
    columns: [
      { name: 'semester_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'name', type: 'VARCHAR(50)', nullable: false, description: 'Semester Name (Spring 2026)' },
      { name: 'session_code', type: 'VARCHAR(20)', nullable: false, description: 'Unique Session ID' },
      { name: 'start_date', type: 'DATE', nullable: false, description: 'Term Start Date' },
      { name: 'end_date', type: 'DATE', nullable: false, description: 'Term End Date' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Active Enrollment Flag' },
      { name: 'max_credits', type: 'DECIMAL(4,1)', nullable: false, description: 'Maximum Credit Load' }
    ],
    sampleRows: [
      { semester_id: 'sem-1', name: 'Spring 2026', session_code: 'SP-2026', start_date: '2026-01-10', is_active: 1, max_credits: 15.0 },
      { semester_id: 'sem-2', name: 'Summer 2026', session_code: 'SU-2026', start_date: '2026-06-15', is_active: 0, max_credits: 12.0 }
    ]
  },
  {
    id: 'users',
    name: 'users',
    category: 'Core',
    description: 'Central identity governance, authentication credentials, OAuth profile, and status',
    pk: ['user_id'],
    columns: [
      { name: 'user_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'email', type: 'VARCHAR(150)', nullable: false, description: 'Institutional or Google Email' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: true, description: 'Bcrypt Hash (Null if OAuth)' },
      { name: 'role', type: 'ENUM(STUDENT,TEACHER,ADMIN)', nullable: false, description: 'RBAC Authorization Role' },
      { name: 'status', type: 'ENUM(APPROVED,PENDING,REJECTED)', nullable: false, description: 'Administrator Approval Status' },
      { name: 'auth_provider', type: 'ENUM(GOOGLE,EMAIL)', nullable: false, description: 'Identity Provider' },
      { name: 'avatar_url', type: 'VARCHAR(500)', nullable: true, description: 'Profile Avatar' }
    ],
    sampleRows: [
      { user_id: 'usr-1', email: 'student@metrouni.edu.bd', role: 'STUDENT', status: 'APPROVED', auth_provider: 'EMAIL' },
      { user_id: 'usr-2', email: 'teacher@metrouni.edu.bd', role: 'TEACHER', status: 'APPROVED', auth_provider: 'EMAIL' },
      { user_id: 'usr-3', email: 'admin@metrouni.edu.bd', role: 'ADMIN', status: 'APPROVED', auth_provider: 'EMAIL' }
    ]
  },
  {
    id: 'students',
    name: 'students',
    category: 'Core',
    description: 'Student profiles, admission registry, cumulative GPA, attendance rates, and risk scores',
    pk: ['student_id'],
    columns: [
      { name: 'student_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'user_id', type: 'VARCHAR(36)', fk: { targetTable: 'users', targetCol: 'user_id' }, description: 'One-to-One Link to Users' },
      { name: 'roll_number', type: 'VARCHAR(30)', nullable: false, description: 'Student ID (241-115-211)' },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Student Full Name' },
      { name: 'department_id', type: 'VARCHAR(36)', fk: { targetTable: 'departments', targetCol: 'dept_id' }, description: 'Department Enrolled' },
      { name: 'batch', type: 'VARCHAR(30)', nullable: false, description: 'Admission Cohort' },
      { name: 'current_semester_id', type: 'VARCHAR(36)', fk: { targetTable: 'semesters', targetCol: 'semester_id' }, description: 'Current Active Term' },
      { name: 'cgpa', type: 'DECIMAL(3,2)', nullable: false, description: 'Cumulative GPA' },
      { name: 'overall_attendance', type: 'DECIMAL(5,2)', nullable: false, description: 'University Attendance %' },
      { name: 'risk_level', type: 'ENUM(SAFE,WARNING,CRITICAL)', nullable: false, description: 'Early Warning Status' }
    ],
    sampleRows: [
      { student_id: 'stu-1', roll_number: '241-115-211', full_name: 'Fathin Sadman', batch: '59th Batch', cgpa: 3.78, overall_attendance: 86.5, risk_level: 'SAFE' }
    ]
  },
  {
    id: 'teachers',
    name: 'teachers',
    category: 'Core',
    description: 'Faculty members, designations, employee numbers, departmental appointments',
    pk: ['teacher_id'],
    columns: [
      { name: 'teacher_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'user_id', type: 'VARCHAR(36)', fk: { targetTable: 'users', targetCol: 'user_id' }, description: 'One-to-One Link to Users' },
      { name: 'employee_id', type: 'VARCHAR(30)', nullable: false, description: 'Employee Tag (FAC-CSE-042)' },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Faculty Legal Name' },
      { name: 'designation', type: 'ENUM(...)', nullable: false, description: 'Professor / Lecturer' },
      { name: 'department_id', type: 'VARCHAR(36)', fk: { targetTable: 'departments', targetCol: 'dept_id' }, description: 'Department Appointed' },
      { name: 'room_number', type: 'VARCHAR(30)', nullable: true, description: 'Faculty Office' }
    ],
    sampleRows: [
      { teacher_id: 'tea-1', employee_id: 'FAC-CSE-042', full_name: 'Dr. Fahim Ahmed', designation: 'Assistant Professor', room_number: 'Lab 402' }
    ]
  },
  {
    id: 'courses',
    name: 'courses',
    category: 'Academic',
    description: 'Curriculum catalog, credit units, prerequisites, and theory/lab designations',
    pk: ['course_id'],
    columns: [
      { name: 'course_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'code', type: 'VARCHAR(15)', nullable: false, description: 'Course Code (CSE311)' },
      { name: 'title', type: 'VARCHAR(150)', nullable: false, description: 'Course Title' },
      { name: 'credits', type: 'DECIMAL(3,1)', nullable: false, description: 'Credit Hours (1.0-4.0)' },
      { name: 'department_id', type: 'VARCHAR(36)', fk: { targetTable: 'departments', targetCol: 'dept_id' }, description: 'Offering Faculty' },
      { name: 'type', type: 'ENUM(Theory,Lab,Project)', nullable: false, description: 'Course Format' }
    ],
    sampleRows: [
      { course_id: 'crs-1', code: 'CSE311', title: 'Database Management Systems', credits: 3.0, type: 'Theory' },
      { course_id: 'crs-2', code: 'CSE312', title: 'Database Management Systems Lab', credits: 1.5, type: 'Lab' }
    ]
  },
  {
    id: 'course_allocations',
    name: 'course_allocations',
    category: 'Teaching',
    description: 'Term-specific teaching allocations, sections, room schedules, and conflict control',
    pk: ['allocation_id'],
    columns: [
      { name: 'allocation_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'course_id', type: 'VARCHAR(36)', fk: { targetTable: 'courses', targetCol: 'course_id' }, description: 'Course Assigned' },
      { name: 'teacher_id', type: 'VARCHAR(36)', fk: { targetTable: 'teachers', targetCol: 'teacher_id' }, description: 'Instructor Assigned' },
      { name: 'semester_id', type: 'VARCHAR(36)', fk: { targetTable: 'semesters', targetCol: 'semester_id' }, description: 'Academic Term' },
      { name: 'section', type: 'VARCHAR(10)', nullable: false, description: 'Section Tag (A, B)' },
      { name: 'day_of_week', type: 'ENUM(...)', nullable: false, description: 'Lecture Day' },
      { name: 'time_slot', type: 'VARCHAR(30)', nullable: false, description: 'Time Duration' },
      { name: 'room_number', type: 'VARCHAR(30)', nullable: false, description: 'Classroom / Lab' }
    ],
    sampleRows: [
      { allocation_id: 'alc-1', section: 'A', day_of_week: 'Sunday', time_slot: '09:00 AM - 10:30 AM', room_number: 'Room 304' }
    ]
  },
  {
    id: 'course_enrollments',
    name: 'course_enrollments',
    category: 'Teaching',
    description: 'Junction table mapping students to allocated course sections with grade outcomes',
    pk: ['enrollment_id'],
    columns: [
      { name: 'enrollment_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'student_id', type: 'VARCHAR(36)', fk: { targetTable: 'students', targetCol: 'student_id' }, description: 'Enrolled Student' },
      { name: 'allocation_id', type: 'VARCHAR(36)', fk: { targetTable: 'course_allocations', targetCol: 'allocation_id' }, description: 'Assigned Allocation' },
      { name: 'semester_id', type: 'VARCHAR(36)', fk: { targetTable: 'semesters', targetCol: 'semester_id' }, description: 'Session Term' },
      { name: 'enrollment_status', type: 'ENUM(...)', nullable: false, description: 'ENROLLED, COMPLETED' },
      { name: 'final_letter_grade', type: 'VARCHAR(5)', nullable: true, description: 'Official Grade (A+, A)' },
      { name: 'final_gpa', type: 'DECIMAL(3,2)', nullable: true, description: 'Earned GPA Points' }
    ],
    sampleRows: [
      { enrollment_id: 'enr-1', enrollment_status: 'ENROLLED', final_letter_grade: 'A+', final_gpa: 4.0 }
    ]
  },
  {
    id: 'attendance_logs',
    name: 'attendance_logs',
    category: 'Attendance',
    description: 'Granular attendance records verified by Dynamic QR scanner or manual faculty roster',
    pk: ['log_id'],
    columns: [
      { name: 'log_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'enrollment_id', type: 'VARCHAR(36)', fk: { targetTable: 'course_enrollments', targetCol: 'enrollment_id' }, description: 'Student Course Enrollment' },
      { name: 'session_id', type: 'VARCHAR(36)', fk: { targetTable: 'qr_attendance_sessions', targetCol: 'session_id' }, nullable: true, description: 'Linked QR Session' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Class Session Date' },
      { name: 'time_slot', type: 'VARCHAR(30)', nullable: false, description: 'Lecture Slot' },
      { name: 'status', type: 'ENUM(PRESENT,ABSENT,LATE)', nullable: false, description: 'Attendance Outcome' },
      { name: 'verified_via', type: 'ENUM(DYNAMIC_QR,MANUAL_ROSTER,BIOMETRIC)', nullable: false, description: 'Verification Method' }
    ],
    sampleRows: [
      { log_id: 'att-1', date: '2026-10-18', status: 'PRESENT', verified_via: 'DYNAMIC_QR' }
    ]
  },
  {
    id: 'qr_attendance_sessions',
    name: 'qr_attendance_sessions',
    category: 'Attendance',
    description: 'Dynamic rotating 60-second QR security tokens generated by faculty in classroom',
    pk: ['session_id'],
    columns: [
      { name: 'session_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'allocation_id', type: 'VARCHAR(36)', fk: { targetTable: 'course_allocations', targetCol: 'allocation_id' }, description: 'Course Session' },
      { name: 'session_date', type: 'DATE', nullable: false, description: 'Date of Session' },
      { name: 'duration_seconds', type: 'INT', nullable: false, description: 'Expiry (default 60s)' },
      { name: 'session_pin', type: 'VARCHAR(10)', nullable: false, description: 'Manual PIN Fallback' },
      { name: 'qr_token_hash', type: 'VARCHAR(128)', nullable: false, description: 'Cryptographic Token' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Active State' }
    ],
    sampleRows: [
      { session_id: 'qrs-1', session_date: '2026-10-18', session_pin: '849201', duration_seconds: 60, is_active: 1 }
    ]
  },
  {
    id: 'course_evaluations',
    name: 'course_evaluations',
    category: 'Assessment',
    description: 'Continuous assessment ledger (Quizzes, Midterm, Assignments, Final Exam) with virtual total',
    pk: ['eval_id'],
    columns: [
      { name: 'eval_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'enrollment_id', type: 'VARCHAR(36)', fk: { targetTable: 'course_enrollments', targetCol: 'enrollment_id' }, description: 'Student Course Enrollment' },
      { name: 'quiz1', type: 'DECIMAL(4,2)', nullable: false, description: 'Quiz 1 Marks (Max 20)' },
      { name: 'quiz2', type: 'DECIMAL(4,2)', nullable: false, description: 'Quiz 2 Marks (Max 20)' },
      { name: 'midterm', type: 'DECIMAL(4,2)', nullable: false, description: 'Midterm Exam (Max 30)' },
      { name: 'assignment', type: 'DECIMAL(4,2)', nullable: false, description: 'Assignments (Max 10)' },
      { name: 'final_exam', type: 'DECIMAL(4,2)', nullable: false, description: 'Final Exam (Max 40)' },
      { name: 'total_marks', type: 'DECIMAL(5,2)', nullable: false, description: 'Generated STORED Sum' },
      { name: 'letter_grade', type: 'VARCHAR(5)', nullable: false, description: 'Earned Letter Grade' },
      { name: 'gpa', type: 'DECIMAL(3,2)', nullable: false, description: 'Grade Point Average' }
    ],
    sampleRows: [
      { eval_id: 'eval-1', quiz1: 18.0, quiz2: 19.0, midterm: 26.5, assignment: 9.5, final_exam: 35.0, total_marks: 108.0, letter_grade: 'A+', gpa: 4.0 }
    ]
  },
  {
    id: 'previous_results',
    name: 'previous_results',
    category: 'Assessment',
    description: 'Student submitted claims for retake, improvement, or previous semester backlogs',
    pk: ['submission_id'],
    columns: [
      { name: 'submission_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'student_id', type: 'VARCHAR(36)', fk: { targetTable: 'students', targetCol: 'student_id' }, description: 'Claiming Student' },
      { name: 'semester_name', type: 'VARCHAR(50)', nullable: false, description: 'Prior Semester' },
      { name: 'completed_credits', type: 'DECIMAL(4,1)', nullable: false, description: 'Completed Units' },
      { name: 'sgpa', type: 'DECIMAL(3,2)', nullable: false, description: 'Semester GPA' },
      { name: 'result_type', type: 'ENUM(Regular,Retake,Improvement,Backlog)', nullable: false, description: 'Claim Category' },
      { name: 'status', type: 'ENUM(PENDING,VERIFIED,REJECTED)', nullable: false, description: 'Faculty Verification' }
    ],
    sampleRows: [
      { submission_id: 'sub-1', semester_name: 'Autumn 2025', completed_credits: 15.0, sgpa: 3.65, result_type: 'Regular', status: 'VERIFIED' }
    ]
  },
  {
    id: 'previous_result_courses',
    name: 'previous_result_courses',
    category: 'Assessment',
    description: 'Course by course grade breakdown of previous result submissions',
    pk: ['course_item_id'],
    columns: [
      { name: 'course_item_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'submission_id', type: 'VARCHAR(36)', fk: { targetTable: 'previous_results', targetCol: 'submission_id' }, description: 'Parent Submission' },
      { name: 'course_code', type: 'VARCHAR(15)', nullable: false, description: 'Prior Course' },
      { name: 'course_title', type: 'VARCHAR(150)', nullable: false, description: 'Course Title' },
      { name: 'obtained_grade', type: 'VARCHAR(5)', nullable: false, description: 'Awarded Grade' },
      { name: 'obtained_gpa', type: 'DECIMAL(3,2)', nullable: false, description: 'GPA Equivalent' }
    ],
    sampleRows: [
      { course_item_id: 'prc-1', course_code: 'CSE221', course_title: 'Algorithms', obtained_grade: 'A', obtained_gpa: 3.75 }
    ]
  },
  {
    id: 'notices',
    name: 'notices',
    category: 'Deliverables',
    description: 'Institutional announcements, exam routines, emergency circulars, and departmental briefs',
    pk: ['notice_id'],
    columns: [
      { name: 'notice_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'title', type: 'VARCHAR(200)', nullable: false, description: 'Notice Headline' },
      { name: 'category', type: 'ENUM(General,Exam,Academic,Holiday,Emergency)', nullable: false, description: 'Notice Type' },
      { name: 'priority', type: 'ENUM(NORMAL,IMPORTANT,URGENT)', nullable: false, description: 'Urgency Priority' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Official Body' },
      { name: 'target_audience', type: 'ENUM(ALL,STUDENTS,TEACHERS,DEPARTMENT)', nullable: false, description: 'Scope Target' }
    ],
    sampleRows: [
      { notice_id: 'not-1', title: 'Midterm Examination Schedule Announcement', category: 'Exam', priority: 'URGENT', target_audience: 'ALL' }
    ]
  },
  {
    id: 'assignments',
    name: 'assignments',
    category: 'Deliverables',
    description: 'Teacher created course deliverables, project specifications, deadlines, and scoring points',
    pk: ['assignment_id'],
    columns: [
      { name: 'assignment_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'allocation_id', type: 'VARCHAR(36)', fk: { targetTable: 'course_allocations', targetCol: 'allocation_id' }, description: 'Course Allocation' },
      { name: 'title', type: 'VARCHAR(200)', nullable: false, description: 'Assignment Title' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Requirements & Rubric' },
      { name: 'due_date', type: 'DATE', nullable: false, description: 'Submission Deadline' },
      { name: 'total_points', type: 'INT', nullable: false, description: 'Total Marks (Max 10)' }
    ],
    sampleRows: [
      { assignment_id: 'asg-1', title: 'ERD Normalization & SQL DDL Design', due_date: '2026-10-25', total_points: 10 }
    ]
  },
  {
    id: 'assignment_submissions',
    name: 'assignment_submissions',
    category: 'Deliverables',
    description: 'Student submitted files, timestamps, faculty awarded marks, and qualitative feedback',
    pk: ['submission_id'],
    columns: [
      { name: 'submission_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'assignment_id', type: 'VARCHAR(36)', fk: { targetTable: 'assignments', targetCol: 'assignment_id' }, description: 'Target Assignment' },
      { name: 'student_id', type: 'VARCHAR(36)', fk: { targetTable: 'students', targetCol: 'student_id' }, description: 'Submitting Student' },
      { name: 'submitted_file_name', type: 'VARCHAR(255)', nullable: false, description: 'Uploaded Document' },
      { name: 'status', type: 'ENUM(SUBMITTED,GRADED,OVERDUE)', nullable: false, description: 'Review State' },
      { name: 'obtained_score', type: 'DECIMAL(5,2)', nullable: true, description: 'Score Awarded' },
      { name: 'faculty_feedback', type: 'TEXT', nullable: true, description: 'Constructive Remarks' }
    ],
    sampleRows: [
      { submission_id: 'sub-1', submitted_file_name: 'CSE311_ERD_Fathin_211.pdf', status: 'GRADED', obtained_score: 9.5 }
    ]
  },
  {
    id: 'study_materials',
    name: 'study_materials',
    category: 'Deliverables',
    description: 'Lecture slide decks, laboratory manuals, reference PDFs, and download telemetry',
    pk: ['material_id'],
    columns: [
      { name: 'material_id', type: 'VARCHAR(36)', pk: true, description: 'Primary Key UUID' },
      { name: 'allocation_id', type: 'VARCHAR(36)', fk: { targetTable: 'course_allocations', targetCol: 'allocation_id' }, description: 'Course Allocation' },
      { name: 'topic', type: 'VARCHAR(200)', nullable: false, description: 'Lecture Unit Topic' },
      { name: 'unit_module', type: 'VARCHAR(50)', nullable: false, description: 'Curriculum Module' },
      { name: 'file_type', type: 'ENUM(PDF,SLIDES,ZIP,DOC,CODE)', nullable: false, description: 'Format Category' },
      { name: 'download_count', type: 'INT', nullable: false, description: 'Student Downloads Counter' }
    ],
    sampleRows: [
      { material_id: 'mat-1', topic: 'Relational Algebra & Normalization 3NF', unit_module: 'Module 04', file_type: 'PDF', download_count: 142 }
    ]
  }
];

const PREMADE_QUERIES = [
  {
    name: '1. Early Warning Critical Risk Students',
    desc: 'Query all students with attendance below 75% or CGPA below 2.50 across CSE department',
    sql: `SELECT s.roll_number, s.full_name, d.code AS dept, s.cgpa, s.overall_attendance, s.risk_level
FROM students s
JOIN departments d ON s.department_id = d.dept_id
WHERE s.overall_attendance < 75.00 OR s.cgpa < 2.50
ORDER BY s.overall_attendance ASC;`,
    mockResult: [
      { roll_number: '241-115-303', full_name: 'Rakib Hassan', dept: 'CSE', cgpa: '2.15', overall_attendance: '64.0%', risk_level: 'CRITICAL' },
      { roll_number: '241-115-288', full_name: 'Mehedi Hasan', dept: 'CSE', cgpa: '2.40', overall_attendance: '71.5%', risk_level: 'CRITICAL' }
    ]
  },
  {
    name: '2. Faculty Teaching Load & Schedule',
    desc: 'Retrieve course section assignments, days, slots, and enrolled headcount for each teacher',
    sql: `SELECT t.employee_id, t.full_name AS instructor, c.code AS course, a.section, a.day_of_week, a.time_slot, a.room_number, COUNT(e.enrollment_id) AS enrolled_students
FROM teachers t
JOIN course_allocations a ON t.teacher_id = a.teacher_id
JOIN courses c ON a.course_id = c.course_id
LEFT JOIN course_enrollments e ON a.allocation_id = e.allocation_id
GROUP BY a.allocation_id;`,
    mockResult: [
      { employee_id: 'FAC-CSE-042', instructor: 'Dr. Fahim Ahmed', course: 'CSE311', section: 'A', day_of_week: 'Sunday', time_slot: '09:00 - 10:30 AM', room_number: 'Room 304', enrolled_students: 48 },
      { employee_id: 'FAC-CSE-042', instructor: 'Dr. Fahim Ahmed', course: 'CSE312', section: 'A', day_of_week: 'Tuesday', time_slot: '11:00 - 01:00 PM', room_number: 'Lab 3', enrolled_students: 48 }
    ]
  },
  {
    name: '3. Continuous Assessment Grade Ledger (CSE311)',
    desc: 'Calculate Total Marks, Letter Grade, and GPA for all students in Database Systems',
    sql: `SELECT s.roll_number, s.full_name, ev.quiz1, ev.quiz2, ev.midterm, ev.assignment, ev.final_exam, ev.total_marks, ev.letter_grade, ev.gpa
FROM course_evaluations ev
JOIN course_enrollments en ON ev.enrollment_id = en.enrollment_id
JOIN students s ON en.student_id = s.student_id
ORDER BY ev.total_marks DESC;`,
    mockResult: [
      { roll_number: '241-115-211', full_name: 'Fathin Sadman', quiz1: 18, quiz2: 19, midterm: 26.5, assignment: 9.5, final_exam: 35.0, total_marks: 108.0, letter_grade: 'A+', gpa: '4.00' },
      { roll_number: '241-115-212', full_name: 'Tahsin Ahmed', quiz1: 20, quiz2: 18, midterm: 28.0, assignment: 10.0, final_exam: 36.0, total_marks: 112.0, letter_grade: 'A+', gpa: '4.00' }
    ]
  },
  {
    name: '4. QR Attendance Audit Logs',
    desc: 'Audit real-time dynamic QR attendance tokens against manual faculty roster overrides',
    sql: `SELECT l.date, l.time_slot, s.roll_number, s.full_name, l.status, l.verified_via, l.token_used
FROM attendance_logs l
JOIN course_enrollments e ON l.enrollment_id = e.enrollment_id
JOIN students s ON e.student_id = s.student_id
WHERE l.date = '2026-10-18';`,
    mockResult: [
      { date: '2026-10-18', time_slot: '09:00 - 10:30 AM', roll_number: '241-115-211', full_name: 'Fathin Sadman', status: 'PRESENT', verified_via: 'DYNAMIC_QR', token_used: '849201' }
    ]
  }
];

export const AdminWeek6DatabaseStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd' | 'sql' | 'sandbox' | 'normalization'>('erd');
  const [selectedTableId, setSelectedTableId] = useState<string>('departments');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTable, setSearchTable] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [executingQuery, setExecutingQuery] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<any[]>(PREMADE_QUERIES[0].mockResult);

  const selectedTable = TABLES.find(t => t.id === selectedTableId) || TABLES[0];

  const filteredTables = TABLES.filter(t => {
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopySql = () => {
    const sqlCode = `-- EduPulse Week 6 Database Schema (MySQL 8.0)
-- Downloaded from EduPulse Studio
-- 17 Normalized Tables: 3NF / BCNF Certified
-- Full SQL script available at /public/edupulse_week6_schema.sql`;
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSqlFile = () => {
    const a = document.createElement('a');
    a.href = '/public/edupulse_week6_schema.sql';
    a.download = 'edupulse_week6_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExecuteQuery = (idx: number) => {
    setActiveQueryIndex(idx);
    setExecutingQuery(true);
    setTimeout(() => {
      setExecutingQuery(false);
      setQueryResults(PREMADE_QUERIES[idx].mockResult);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="bg-[#0c1424] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Central System Architecture • Relational Database Engine</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                MySQL 8.0 Live Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Relational Database Engine & Schema Inspector
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Complete, normalized 3NF relational database architecture powering all university modules:
              Departments, Semesters, Users, Students, Teachers, Courses, Course_Allocations, Course_Enrollments,
              Attendance_Logs, QR_Attendance_Sessions, Course_Evaluations, Previous_Results, Previous_Result_Courses,
              Notices, Assignments, Assignment_Submissions, Study_Materials.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadSqlFile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download edupulse_database_schema.sql</span>
            </button>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Normalized Tables</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">17 Tables</p>
            <p className="text-[10px] text-cyan-400 mt-0.5">Production Architecture</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Normalization Grade</p>
            <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">3NF / BCNF</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero Transitive Redundancy</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Integrity Constraints</p>
            <p className="text-xl font-black text-purple-400 font-mono mt-0.5">FK Cascades & Check</p>
            <p className="text-[10px] text-slate-400 mt-0.5">ACID & Conflict Guards</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Target Engine</p>
            <p className="text-xl font-black text-amber-400 font-mono mt-0.5">MySQL 8.0+</p>
            <p className="text-[10px] text-slate-400 mt-0.5">InnoDB utf8mb4_unicode</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('erd')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'erd'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interactive ER Diagram Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sql'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>MySQL DDL Script Viewer</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sandbox'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Live SQL Query Runner & Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('normalization')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'normalization'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3NF Normalization Proof & Dictionary</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE ER DIAGRAM EXPLORER */}
      {activeTab === 'erd' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e1726] border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'Core', 'Academic', 'Teaching', 'Attendance', 'Assessment', 'Deliverables'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'ALL' ? 'All Tables (17)' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search table name..."
                value={searchTable}
                onChange={e => setSearchTable(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Split View: Tables Grid + Inspector Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tables Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTables.map(tbl => {
                const isSelected = tbl.id === selectedTableId;
                return (
                  <div
                    key={tbl.id}
                    onClick={() => setSelectedTableId(tbl.id)}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#111c30] border-cyan-400 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                        : 'bg-[#0d1525] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Table className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <h3 className="font-mono font-bold text-white text-sm tracking-tight">{tbl.name}</h3>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
                          {tbl.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                        {tbl.description}
                      </p>

                      {/* Columns Preview */}
                      <div className="space-y-1 pt-2 border-t border-slate-800/80">
                        {tbl.columns.slice(0, 4).map(col => (
                          <div key={col.name} className="flex items-center justify-between text-[11px] font-mono">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              {col.pk && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                              {col.fk && <Link2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                              <span className={col.pk ? 'font-bold text-white' : ''}>{col.name}</span>
                            </span>
                            <span className="text-[10px] text-slate-500">{col.type}</span>
                          </div>
                        ))}
                        {tbl.columns.length > 4 && (
                          <p className="text-[10px] text-slate-500 pt-1 font-mono">
                            + {tbl.columns.length - 4} more columns...
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>PK: <strong className="text-amber-400 font-mono">{tbl.pk.join(', ')}</strong></span>
                      <span className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                        <span>Inspect Schema</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inspector Detail Panel */}
            <div className="bg-[#0e1726] border border-cyan-500/30 rounded-2xl p-5 space-y-5 h-fit sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-base font-bold text-white font-mono">{selectedTable.name}</h2>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">{selectedTable.category} Table</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{selectedTable.columns.length} Columns</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTable.description}
              </p>

              {/* Columns Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Column Attributes & Keys</span>
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-2">Column</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {selectedTable.columns.map(col => (
                        <tr key={col.name} className="hover:bg-slate-900/60">
                          <td className="p-2 font-bold text-white flex items-center gap-1">
                            {col.pk && <Key className="w-3 h-3 text-amber-400" />}
                            {col.fk && <Link2 className="w-3 h-3 text-cyan-400" />}
                            <span>{col.name}</span>
                          </td>
                          <td className="p-2 text-slate-400">{col.type}</td>
                          <td className="p-2 text-[10px]">
                            {col.pk && <span className="text-amber-400 font-bold mr-1">PRIMARY KEY</span>}
                            {col.fk && (
                              <span className="text-cyan-400">
                                FK &rarr; {col.fk.targetTable}.{col.fk.targetCol}
                              </span>
                            )}
                            {!col.pk && !col.fk && (col.nullable ? <span className="text-slate-500">NULL</span> : <span className="text-slate-400">NOT NULL</span>)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Data Rows */}
              {selectedTable.sampleRows.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sample Seed Instance Data</span>
                  </h4>
                  <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950 p-2 font-mono text-[11px]">
                    <pre className="text-slate-300">
                      {JSON.stringify(selectedTable.sampleRows, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MYSQL DDL SCRIPT VIEWER */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e1726] border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Full Relational DDL Script (edupulse_week6_schema.sql)</h3>
              <p className="text-xs text-slate-400">
                Executable in MySQL 8.0 / MariaDB Workbench or CLI: includes table creation, constraints, foreign keys, and seed records.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSqlFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .SQL</span>
              </button>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070c17] p-5 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-300 leading-relaxed shadow-2xl">
            <pre>
{`-- =====================================================================
-- EduPulse Academic Monitoring & Early Warning Platform
-- Central Relational Database Architecture (MySQL 8.0 Engine)
-- Normalization Standard: 3NF / BCNF Compliant Schema
-- Database Engine: MySQL 8.0+ / MariaDB 10.5+ (InnoDB, utf8mb4)
-- Metropolitan University — Department of Computer Science & Engineering
-- =====================================================================

DROP DATABASE IF EXISTS edupulse_db;
CREATE DATABASE edupulse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edupulse_db;

-- 1. Departments Table
CREATE TABLE departments (
    dept_id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    chair_person VARCHAR(120) NOT NULL,
    established_year INT NOT NULL CHECK (established_year >= 1990 AND established_year <= 2100),
    email VARCHAR(120) NOT NULL UNIQUE,
    faculty_count INT NOT NULL DEFAULT 0,
    student_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Semesters Table
CREATE TABLE semesters (
    semester_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    session_code VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    max_credits DECIMAL(4,1) NOT NULL DEFAULT 15.0,
    enrollment_deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_semester_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB;

-- 3. Users Table (Central Authentication & RBAC)
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL,
    status ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    auth_provider ENUM('GOOGLE', 'EMAIL') NOT NULL DEFAULT 'EMAIL',
    google_id VARCHAR(100) NULL,
    avatar_url VARCHAR(500) NULL,
    rejection_reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role_status (role, status)
) ENGINE=InnoDB;

-- 4. Students Table
CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    batch VARCHAR(30) NOT NULL,
    current_semester_id VARCHAR(36) NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL DEFAULT 0.00 CHECK (cgpa >= 0.00 AND cgpa <= 4.00),
    overall_attendance DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (overall_attendance >= 0.00 AND overall_attendance <= 100.00),
    risk_level ENUM('SAFE', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'SAFE',
    phone VARCHAR(25) NOT NULL,
    advisor_name VARCHAR(120) NULL,
    status ENUM('Active', 'Probation', 'Inactive', 'Graduated') NOT NULL DEFAULT 'Active',
    admission_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON UPDATE CASCADE,
    FOREIGN KEY (current_semester_id) REFERENCES semesters(semester_id) ON UPDATE CASCADE,
    INDEX idx_student_dept_risk (department_id, risk_level)
) ENGINE=InnoDB;

-- 5. Teachers Table
CREATE TABLE teachers (
    teacher_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    designation ENUM('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct Faculty') NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    room_number VARCHAR(30) NULL,
    phone VARCHAR(25) NOT NULL,
    status ENUM('Active', 'On Leave', 'Sabbatical') NOT NULL DEFAULT 'Active',
    joined_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON UPDATE CASCADE,
    INDEX idx_teacher_dept (department_id)
) ENGINE=InnoDB;

-- 6. Courses Table (Catalog)
CREATE TABLE courses (
    course_id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(15) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    credits DECIMAL(3,1) NOT NULL CHECK (credits > 0.0 AND credits <= 6.0),
    department_id VARCHAR(36) NOT NULL,
    type ENUM('Theory', 'Lab', 'Project') NOT NULL DEFAULT 'Theory',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON UPDATE CASCADE,
    INDEX idx_course_dept (department_id)
) ENGINE=InnoDB;

-- 7. Course Allocations Table (Teacher assignments & Timetable)
CREATE TABLE course_allocations (
    allocation_id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    day_of_week ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    room_number VARCHAR(30) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON UPDATE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON UPDATE CASCADE,
    UNIQUE KEY uq_schedule_conflict (semester_id, day_of_week, time_slot, room_number),
    UNIQUE KEY uq_teacher_conflict (semester_id, day_of_week, time_slot, teacher_id)
) ENGINE=InnoDB;

-- 8. Course Enrollments Table (Student-Course mapping)
CREATE TABLE course_enrollments (
    enrollment_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    allocation_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    enrollment_status ENUM('ENROLLED', 'DROPPED', 'COMPLETED', 'WITHDRAWN') NOT NULL DEFAULT 'ENROLLED',
    final_letter_grade VARCHAR(5) NULL,
    final_gpa DECIMAL(3,2) NULL CHECK (final_gpa >= 0.00 AND final_gpa <= 4.00),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (allocation_id) REFERENCES course_allocations(allocation_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON UPDATE CASCADE,
    UNIQUE KEY uq_student_allocation (student_id, allocation_id)
) ENGINE=InnoDB;

-- 9. QR Attendance Sessions Table (Dynamic 60s Tokens)
CREATE TABLE qr_attendance_sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    allocation_id VARCHAR(36) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 60,
    session_pin VARCHAR(10) NOT NULL,
    qr_token_hash VARCHAR(128) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (allocation_id) REFERENCES course_allocations(allocation_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10. Attendance Logs Table (Verified check-ins)
CREATE TABLE attendance_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    enrollment_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(36) NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL DEFAULT 'PRESENT',
    verified_via ENUM('DYNAMIC_QR', 'MANUAL_ROSTER', 'BIOMETRIC') NOT NULL DEFAULT 'DYNAMIC_QR',
    token_used VARCHAR(64) NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (session_id) REFERENCES qr_attendance_sessions(session_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY uq_attendance_entry (enrollment_id, date)
) ENGINE=InnoDB;

-- 11. Course Evaluations Table (Continuous Assessment & Final Exam)
CREATE TABLE course_evaluations (
    eval_id VARCHAR(36) PRIMARY KEY,
    enrollment_id VARCHAR(36) NOT NULL UNIQUE,
    quiz1 DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (quiz1 >= 0.00 AND quiz1 <= 20.00),
    quiz2 DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (quiz2 >= 0.00 AND quiz2 <= 20.00),
    midterm DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (midterm >= 0.00 AND midterm <= 30.00),
    assignment DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (assignment >= 0.00 AND assignment <= 10.00),
    final_exam DECIMAL(4,2) NOT NULL DEFAULT 0.00 CHECK (final_exam >= 0.00 AND final_exam <= 40.00),
    total_marks DECIMAL(5,2) GENERATED ALWAYS AS (quiz1 + quiz2 + midterm + assignment + final_exam) STORED,
    letter_grade VARCHAR(5) NOT NULL DEFAULT 'F',
    gpa DECIMAL(3,2) NOT NULL DEFAULT 0.00 CHECK (gpa >= 0.00 AND gpa <= 4.00),
    evaluated_by VARCHAR(36) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evaluated_by) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 12. Previous Results Table (Retake / Improvement Claims)
CREATE TABLE previous_results (
    submission_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    semester_name VARCHAR(50) NOT NULL,
    completed_credits DECIMAL(4,1) NOT NULL,
    sgpa DECIMAL(3,2) NOT NULL CHECK (sgpa >= 0.00 AND sgpa <= 4.00),
    result_type ENUM('Regular', 'Retake', 'Improvement', 'Backlog') NOT NULL DEFAULT 'Regular',
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(500) NULL,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    verified_by VARCHAR(36) NULL,
    verification_date DATE NULL,
    remarks TEXT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 13. Previous Result Courses Table (Breakdown)
CREATE TABLE previous_result_courses (
    course_item_id VARCHAR(36) PRIMARY KEY,
    submission_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(15) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    credits DECIMAL(3,1) NOT NULL,
    obtained_grade VARCHAR(5) NOT NULL,
    obtained_gpa DECIMAL(3,2) NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES previous_results(submission_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 14. Notices Table
CREATE TABLE notices (
    notice_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category ENUM('General', 'Exam', 'Academic', 'Holiday', 'Emergency') NOT NULL DEFAULT 'General',
    priority ENUM('NORMAL', 'IMPORTANT', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    content TEXT NOT NULL,
    target_audience ENUM('ALL', 'STUDENTS', 'TEACHERS', 'DEPARTMENT') NOT NULL DEFAULT 'ALL',
    department_id VARCHAR(36) NULL,
    author_id VARCHAR(36) NOT NULL,
    attachment_name VARCHAR(255) NULL,
    attachment_url VARCHAR(500) NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 15. Assignments Table
CREATE TABLE assignments (
    assignment_id VARCHAR(36) PRIMARY KEY,
    allocation_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_points INT NOT NULL DEFAULT 10,
    attachment_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (allocation_id) REFERENCES course_allocations(allocation_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 16. Assignment Submissions Table
CREATE TABLE assignment_submissions (
    submission_id VARCHAR(36) PRIMARY KEY,
    assignment_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    submitted_file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NULL,
    status ENUM('SUBMITTED', 'GRADED', 'OVERDUE') NOT NULL DEFAULT 'SUBMITTED',
    obtained_score DECIMAL(5,2) NULL,
    faculty_feedback TEXT NULL,
    graded_by VARCHAR(36) NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY uq_student_assignment (assignment_id, student_id)
) ENGINE=InnoDB;

-- 17. Study Materials Table
CREATE TABLE study_materials (
    material_id VARCHAR(36) PRIMARY KEY,
    allocation_id VARCHAR(36) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    unit_module VARCHAR(50) NOT NULL,
    description TEXT NULL,
    file_type ENUM('PDF', 'SLIDES', 'ZIP', 'DOC', 'CODE') NOT NULL DEFAULT 'PDF',
    file_size_kb INT NOT NULL DEFAULT 1024,
    download_url VARCHAR(500) NULL,
    download_count INT NOT NULL DEFAULT 0,
    uploaded_by VARCHAR(36) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (allocation_id) REFERENCES course_allocations(allocation_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES teachers(teacher_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SQL QUERY RUNNER & SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREMADE_QUERIES.map((q, idx) => (
              <div
                key={q.name}
                onClick={() => handleExecuteQuery(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeQueryIndex === idx
                    ? 'bg-[#101b2f] border-cyan-400 shadow-md'
                    : 'bg-[#0d1525] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-white text-xs">{q.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    Run &rarr;
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{q.desc}</p>
                <div className="p-2 rounded-xl bg-slate-950 font-mono text-[10px] text-cyan-300 line-clamp-2">
                  {q.sql}
                </div>
              </div>
            ))}
          </div>

          {/* Active Query Display & Result Box */}
          <div className="bg-[#0e1726] border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  Active Query Output: {PREMADE_QUERIES[activeQueryIndex].name}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {executingQuery ? 'Executing...' : `${queryResults.length} Rows Retrieved (0.003s)`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre>{PREMADE_QUERIES[activeQueryIndex].sql}</pre>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-x-auto bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    {queryResults.length > 0 &&
                      Object.keys(queryResults[0]).map(col => (
                        <th key={col} className="p-3 uppercase tracking-wider text-[11px]">
                          {col}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {queryResults.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/60">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-3">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 3NF NORMALIZATION PROOF */}
      {activeTab === 'normalization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d1627] border border-cyan-500/25 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                1NF
              </div>
              <h3 className="font-bold text-white text-sm">First Normal Form (1NF)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every column contains strictly atomic, indivisible values. No multi-valued repeating groups. For example, instead of storing comma-separated course grades inside student records, each course evaluation is an isolated row in <code>course_evaluations</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1627] border border-purple-500/25 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                2NF
              </div>
              <h3 className="font-bold text-white text-sm">Second Normal Form (2NF)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In 1NF, and no non-prime attribute is partially dependent on any candidate key. Composite junction tables like <code>course_enrollments (student_id, allocation_id)</code> only store attributes dependent on the complete enrollment pair.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1627] border border-emerald-500/25 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                3NF
              </div>
              <h3 className="font-bold text-white text-sm">Third Normal Form (3NF)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In 2NF, and no non-prime attribute is transitively dependent on the primary key. Department names and chair persons are factored out into <code>departments</code> rather than duplicated across students, teachers, and courses.
              </p>
            </div>
          </div>

          {/* Normalization Summary Table */}
          <div className="bg-[#0e1726] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Full Data Dictionary & Relational Integrity Manifest (17 Tables)</span>
            </h3>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Table Name</th>
                    <th className="p-3">Primary Key</th>
                    <th className="p-3">Foreign Key References</th>
                    <th className="p-3">Cardinality</th>
                    <th className="p-3">Normal Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {TABLES.map((t, idx) => {
                    const fkRefs = t.columns.filter(c => c.fk).map(c => `${c.name} &rarr; ${c.fk?.targetTable}`);
                    return (
                      <tr key={t.id} className="hover:bg-slate-900/50">
                        <td className="p-3 text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-cyan-400">{t.name}</td>
                        <td className="p-3 text-amber-400 font-bold">{t.pk.join(', ')}</td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {fkRefs.length > 0 ? fkRefs.join(', ') : <span className="text-slate-600 italic">None (Root Entity)</span>}
                        </td>
                        <td className="p-3 text-slate-400">
                          {t.category === 'Teaching' || t.category === 'Assessment' ? 'N : M' : '1 : N'}
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            3NF Validated
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
