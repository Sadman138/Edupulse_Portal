# EduPulse — Complete MERN Stack Academic Platform
### Metropolitan University &bull; Department of Computer Science & Engineering
**Team Delta (CSE 58th Batch):** Raiyan Chowdhury (241-115-210), Fathin Sadman (241-115-211), Md Al Mekdad Ajmol (241-115-223)

---

## 🎯 Final MERN Stack Architecture

The EduPulse Academic Monitoring & Early Warning Platform has been fully migrated from MySQL to an enterprise-grade **MERN Stack** architecture:

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
* **Backend:** Node.js + Express.js + TypeScript
* **Database:** MongoDB Atlas (All 17 normalized schemas migrated)
* **ODM:** Mongoose
* **Authentication:** Genuine JWT (HS256) + bcrypt (10 rounds password hashing)
* **Email Verification:** Nodemailer + Gmail SMTP (6-digit OTP with 5m TTL index & 60s cooldown)
* **Authorization:** Role-Based Access Control (RBAC) across Student, Teacher, and Administrator

> **Notice:** MySQL and mysql2 are **permanently discontinued**. MongoDB is now the single authoritative database.

---

## 🗄️ 17 Migrated Mongoose Models (+ OTPVerification)

1. `Department` (`departments`) — Department codes, chairpersons, faculty/student quotas
2. `Semester` (`semesters`) — Academic sessions, start/end dates, max credits, active flags
3. `User` (`users`) — Central authentication, bcrypt hash, role, approval status, `isEmailVerified`
4. `Student` (`students`) — Roll number, CGPA, attendance, batch, section, risk level
5. `Teacher` (`teachers`) — Employee ID, designation, department, contact info
6. `Course` (`courses`) — Course catalog, code, credits, theory/lab/project types
7. `CourseAllocation` (`course_allocations`) — Teacher-course timetable with conflict prevention indexes
8. `CourseEnrollment` (`course_enrollments`) — Student enrollments and final course grades
9. `QRAttendanceSession` (`qr_attendance_sessions`) — Dynamic 60-second QR session tokens
10. `AttendanceLog` (`attendance_logs`) — Verified attendance check-in logs
11. `CourseEvaluation` (`course_evaluations`) — Quizzes, midterms, assignments, finals, auto GPA/grade
12. `PreviousResult` (`previous_results`) — Retake and improvement claims with embedded courses
13. `PreviousResultCourse` (Embedded subdocument in PreviousResult)
14. `Notice` (`notices`) — Priority bulletins, category filters, target audience
15. `Assignment` (`assignments`) — Homework tasks, submission deadlines, total points
16. `AssignmentSubmission` (`assignment_submissions`) — Student file submissions, grading, feedback
17. `StudyMaterial` (`study_materials`) — Lecture notes, slides, modules, download metrics
18. `OTPVerification` — 6-digit hashed OTP, 5-minute TTL expiration, max 5 attempts, 60s resend cooldown

---

## 🚀 Running the Full-Stack Application

```bash
# Install dependencies
npm install

# Run full-stack dev server (Express API on /api and Vite React Frontend on port 3000)
npm run dev

# Seed MongoDB database with initial sample records
npm run seed

# Build production bundle
npm run build
```

---

## ⚡ Default Demo Credentials

| Role | Name | Institutional Email | Password |
|---|---|---|---|
| **Student** | Fathin Sadman | `student@metrouni.edu.bd` | `student123` |
| **Teacher** | Dr. Fahim Ahmed | `teacher@metrouni.edu.bd` | `teacher123` |
| **Admin** | Prof. Dr. M. Rahman | `admin@metrouni.edu.bd` | `admin123` |

---

## 🔒 Security Hardening

* **Helmet:** Security headers enabled.
* **CORS:** Controlled origin and method configurations.
* **Rate Limiting:** General API limiter (300 req/15m) and Auth limiter (50 req/15m).
* **Passwords:** 10 rounds bcrypt hashing.
* **JWT:** Standard HS256 tokens with 24-hour expiration.
* **Secrets:** Strict avoidance of exposing hashes, tokens, or credentials in responses.
