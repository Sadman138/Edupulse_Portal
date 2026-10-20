-- =====================================================================
-- EduPulse Academic Monitoring & Early Warning Platform
-- Syllabus Milestone: Week 6 — Database Design & MySQL Setup
-- Normalization Standard: 3NF / BCNF Compliant Schema
-- Database Engine: MySQL 8.0+ / MariaDB 10.5+ (InnoDB, utf8mb4)
-- Metropolitan University — Department of Computer Science & Engineering
-- =====================================================================

DROP DATABASE IF EXISTS edupulse_db;
CREATE DATABASE edupulse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edupulse_db;

-- ---------------------------------------------------------------------
-- 1. Departments Table
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- 2. Semesters Table
-- ---------------------------------------------------------------------
CREATE TABLE semesters (
    semester_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g. 'Spring 2026'
    session_code VARCHAR(20) NOT NULL UNIQUE, -- e.g. 'SP-2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    max_credits DECIMAL(4,1) NOT NULL DEFAULT 15.0,
    enrollment_deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_semester_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. Users Table (Central Authentication & RBAC)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL, -- Nullable for OAuth accounts
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

-- ---------------------------------------------------------------------
-- 4. Students Table
-- ---------------------------------------------------------------------
CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    roll_number VARCHAR(30) NOT NULL UNIQUE, -- e.g. '241-115-211'
    full_name VARCHAR(150) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    batch VARCHAR(30) NOT NULL, -- e.g. '59th Batch'
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

-- ---------------------------------------------------------------------
-- 5. Teachers Table
-- ---------------------------------------------------------------------
CREATE TABLE teachers (
    teacher_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    employee_id VARCHAR(30) NOT NULL UNIQUE, -- e.g. 'FAC-CSE-042'
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

-- ---------------------------------------------------------------------
-- 6. Courses Table (Catalog)
-- ---------------------------------------------------------------------
CREATE TABLE courses (
    course_id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(15) NOT NULL UNIQUE, -- e.g. 'CSE311'
    title VARCHAR(150) NOT NULL,
    credits DECIMAL(3,1) NOT NULL CHECK (credits > 0.0 AND credits <= 6.0),
    department_id VARCHAR(36) NOT NULL,
    type ENUM('Theory', 'Lab', 'Project') NOT NULL DEFAULT 'Theory',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON UPDATE CASCADE,
    INDEX idx_course_dept (department_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. Course Allocations Table (Teacher assignments & Timetable)
-- ---------------------------------------------------------------------
CREATE TABLE course_allocations (
    allocation_id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    day_of_week ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    time_slot VARCHAR(30) NOT NULL, -- e.g. '09:00 AM - 10:30 AM'
    room_number VARCHAR(30) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON UPDATE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON UPDATE CASCADE,
    UNIQUE KEY uq_schedule_conflict (semester_id, day_of_week, time_slot, room_number),
    UNIQUE KEY uq_teacher_conflict (semester_id, day_of_week, time_slot, teacher_id),
    INDEX idx_alloc_sem_course (semester_id, course_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. Course Enrollments Table (Student-Course mapping)
-- ---------------------------------------------------------------------
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
    UNIQUE KEY uq_student_allocation (student_id, allocation_id),
    INDEX idx_enroll_student (student_id),
    INDEX idx_enroll_allocation (allocation_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. QR Attendance Sessions Table (Dynamic 60s Tokens)
-- ---------------------------------------------------------------------
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
    FOREIGN KEY (allocation_id) REFERENCES course_allocations(allocation_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_qr_active (allocation_id, is_active)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. Attendance Logs Table (Verified check-ins)
-- ---------------------------------------------------------------------
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
    UNIQUE KEY uq_attendance_entry (enrollment_id, date),
    INDEX idx_att_date_status (date, status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. Course Evaluations Table (Continuous Assessment & Final Exam)
-- ---------------------------------------------------------------------
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
    FOREIGN KEY (evaluated_by) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_eval_grade (letter_grade, gpa)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. Previous Results Table (Retake / Improvement Claims)
-- ---------------------------------------------------------------------
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
    FOREIGN KEY (verified_by) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_prev_res_status (status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 13. Previous Result Courses Table (Breakdown)
-- ---------------------------------------------------------------------
CREATE TABLE previous_result_courses (
    course_item_id VARCHAR(36) PRIMARY KEY,
    submission_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(15) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    credits DECIMAL(3,1) NOT NULL,
    obtained_grade VARCHAR(5) NOT NULL,
    obtained_gpa DECIMAL(3,2) NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES previous_results(submission_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_prc_sub (submission_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 14. Notices Table
-- ---------------------------------------------------------------------
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
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_notice_filter (target_audience, priority, published_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 15. Assignments Table
-- ---------------------------------------------------------------------
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
    FOREIGN KEY (allocation_id) REFERENCES course_allocations(allocation_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_asg_due (due_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 16. Assignment Submissions Table
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- 17. Study Materials Table
-- ---------------------------------------------------------------------
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
    FOREIGN KEY (uploaded_by) REFERENCES teachers(teacher_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_material_topic (topic)
) ENGINE=InnoDB;

-- =====================================================================
-- SAMPLE SEED DATA (Normalized Relational Instances)
-- =====================================================================

-- 1. Departments Seed
INSERT INTO departments (dept_id, code, name, chair_person, established_year, email, faculty_count, student_count) VALUES
('dept-1', 'CSE', 'Computer Science & Engineering', 'Prof. Dr. Tariqul Islam', 2003, 'cse@metrouni.edu.bd', 28, 620),
('dept-2', 'EEE', 'Electrical & Electronic Engineering', 'Dr. Mahbubur Rahman', 2005, 'eee@metrouni.edu.bd', 18, 340),
('dept-3', 'BBA', 'Business Administration', 'Prof. Dr. Nazmul Huda', 2003, 'bba@metrouni.edu.bd', 22, 510);

-- 2. Semesters Seed
INSERT INTO semesters (semester_id, name, session_code, start_date, end_date, is_active, max_credits, enrollment_deadline) VALUES
('sem-1', 'Spring 2026', 'SP-2026', '2026-01-10', '2026-05-30', TRUE, 15.0, '2026-01-25'),
('sem-2', 'Summer 2026', 'SU-2026', '2026-06-15', '2026-10-15', FALSE, 12.0, '2026-06-25'),
('sem-3', 'Autumn 2025', 'AU-2025', '2025-08-10', '2025-12-20', FALSE, 15.0, '2025-08-20');

-- 3. Users Seed
INSERT INTO users (user_id, email, password_hash, role, status, auth_provider, avatar_url) VALUES
('usr-student-1', 'student@metrouni.edu.bd', 'student123_hash', 'STUDENT', 'APPROVED', 'EMAIL', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'),
('usr-teacher-1', 'teacher@metrouni.edu.bd', 'teacher123_hash', 'TEACHER', 'APPROVED', 'EMAIL', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'),
('usr-admin-1', 'admin@metrouni.edu.bd', 'admin123_hash', 'ADMIN', 'APPROVED', 'EMAIL', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'),
('usr-pending-1', 'tanvir.cse@gmail.com', NULL, 'STUDENT', 'PENDING', 'GOOGLE', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120');

-- 4. Students Seed
INSERT INTO students (student_id, user_id, roll_number, full_name, department_id, batch, current_semester_id, cgpa, overall_attendance, risk_level, phone, admission_date) VALUES
('stu-1', 'usr-student-1', '241-115-211', 'Fathin Sadman', 'dept-1', '59th Batch', 'sem-1', 3.78, 86.50, 'SAFE', '+880 1711-000211', '2024-01-15');

-- 5. Teachers Seed
INSERT INTO teachers (teacher_id, user_id, employee_id, full_name, designation, department_id, room_number, phone, status, joined_date) VALUES
('tea-1', 'usr-teacher-1', 'FAC-CSE-042', 'Dr. Fahim Ahmed', 'Assistant Professor', 'dept-1', 'Lab 402', '+880 1712-000042', 'Active', '2019-08-01');

-- 6. Courses Seed
INSERT INTO courses (course_id, code, title, credits, department_id, type, description) VALUES
('crs-1', 'CSE311', 'Database Management Systems', 3.0, 'dept-1', 'Theory', 'Relational database architecture, SQL, 3NF normalization, and transaction control.'),
('crs-2', 'CSE312', 'Database Management Systems Lab', 1.5, 'dept-1', 'Lab', 'MySQL workbench, schema scripting, stored procedures, and triggers.'),
('crs-3', 'CSE321', 'Software Engineering & Design', 3.0, 'dept-1', 'Theory', 'Software lifecycle models, agile sprints, UML architecture, and testing.');

-- 7. Course Allocations Seed
INSERT INTO course_allocations (allocation_id, course_id, teacher_id, semester_id, section, day_of_week, time_slot, room_number) VALUES
('alc-1', 'crs-1', 'tea-1', 'sem-1', 'A', 'Sunday', '09:00 AM - 10:30 AM', 'Room 304 (Academic Bldg 1)'),
('alc-2', 'crs-2', 'tea-1', 'sem-1', 'A', 'Tuesday', '11:00 AM - 01:00 PM', 'Computer Software Lab 3');

-- 8. Course Enrollments Seed
INSERT INTO course_enrollments (enrollment_id, student_id, allocation_id, semester_id, enrollment_status) VALUES
('enr-1', 'stu-1', 'alc-1', 'sem-1', 'ENROLLED'),
('enr-2', 'stu-1', 'alc-2', 'sem-1', 'ENROLLED');

-- 9. QR Attendance Sessions Seed
INSERT INTO qr_attendance_sessions (session_id, allocation_id, session_date, start_time, duration_seconds, session_pin, qr_token_hash, is_active) VALUES
('qrs-1', 'alc-1', '2026-10-18', '09:05:00', 60, '849201', 'token_hash_a849201f92e', TRUE);

-- 10. Attendance Logs Seed
INSERT INTO attendance_logs (log_id, enrollment_id, session_id, date, time_slot, status, verified_via, token_used) VALUES
('att-1', 'enr-1', 'qrs-1', '2026-10-18', '09:00 AM - 10:30 AM', 'PRESENT', 'DYNAMIC_QR', '849201');

-- 11. Course Evaluations Seed
INSERT INTO course_evaluations (eval_id, enrollment_id, quiz1, quiz2, midterm, assignment, final_exam, letter_grade, gpa, evaluated_by) VALUES
('eval-1', 'enr-1', 18.00, 19.00, 26.50, 9.50, 35.00, 'A+', 4.00, 'tea-1');

-- 12. Notices Seed
INSERT INTO notices (notice_id, title, category, priority, content, target_audience, department_id, author_id) VALUES
('not-1', 'Midterm Examination Schedule Announcement', 'Exam', 'URGENT', 'The Spring 2026 Midterm Examinations commence on Nov 15. All students must bring valid digital ID.', 'ALL', 'dept-1', 'usr-admin-1');

-- 13. Assignments Seed
INSERT INTO assignments (assignment_id, allocation_id, title, description, assigned_date, due_date, total_points) VALUES
('asg-1', 'alc-1', 'ERD Normalization & SQL DDL Design', 'Model university schema in 3NF and provide executable SQL creation script with constraints.', '2026-10-10', '2026-10-25', 10);

-- 14. Assignment Submissions Seed
INSERT INTO assignment_submissions (submission_id, assignment_id, student_id, submitted_file_name, status, obtained_score, faculty_feedback, graded_by) VALUES
('sub-1', 'asg-1', 'stu-1', 'CSE311_ERD_Fathin_211.pdf', 'GRADED', 9.50, 'Excellent 3NF normalization breakdown and composite keys.', 'tea-1');

-- 15. Study Materials Seed
INSERT INTO study_materials (material_id, allocation_id, topic, unit_module, description, file_type, file_size_kb, download_count, uploaded_by) VALUES
('mat-1', 'alc-1', 'Relational Algebra & Normalization 3NF', 'Module 04', 'Comprehensive lecture deck detailing functional dependencies and BCNF.', 'PDF', 4120, 142, 'tea-1');

-- End of EduPulse Week 6 Database Setup
