# 🎓 Metropolitan University — Department of CSE
## Academic Project Progress Report — Milestone: Weeks 1 to 7 Complete

**Project Name:** EduPulse — Academic Performance & Monitoring Platform  
**Target Period:** Weeks 1 – 7 (Frontend Architecture, Student/Teacher/Admin Portals, Database Design / MySQL Setup, and Backend Express API, Authentication & RBAC)  
**Supervisor / Review Copy:** Department of Computer Science & Engineering  
**Academic Session:** Autumn 2026  

---

### 📌 Milestone Executive Summary
This submission delivers **100% of the syllabus requirements from Week 1 through Week 7** in accordance with the 12-Week Gantt Chart schedule:

1. **Student Panel (Weeks 1–4):** Academic dashboard, SGPA/CGPA telemetry, Red Alert banner for critical courses (< 75% attendance / < 40% marks), Dynamic QR Scanner UI, Previous Results submission form, University Notice Board, Assignment Hub, Study Material downloads, and Co-Curricular profile.
2. **Teacher Panel (Week 5):** Assigned course & enrolled directory, dynamic QR attendance generator with rotating 60s security token & manual roster fallback, continuous assessment ledger with instant grade recalculation & bulk CSV import/export, assignment creation & evaluation desk, notice publishing, study material upload, previous result verification desk, and early warning high-risk student desk.
3. **Admin Panel (Week 5):** Institutional KPI dashboard, full CRUD desks for Departments, Semesters/Sessions, Courses Catalog, Instructors, and Students Registry, and an interactive Course Allocation & Schedule screen with conflict detection.
4. **Universal Bulk CSV Import/Export Engine:** All data intake desks feature full CSV bulk import capabilities with downloadable templates, drag-and-drop file parsers, live validation previews, and instant data ingestion.
5. **Week 6 (W6): Database Design & MySQL Setup:**
   - Fully normalized **3NF / BCNF ER Diagram and relational schema** encompassing all 17 syllabus tables (`departments`, `semesters`, `users`, `students`, `teachers`, `courses`, `course_allocations`, `course_enrollments`, `attendance_logs`, `qr_attendance_sessions`, `course_evaluations`, `previous_results`, `previous_result_courses`, `notices`, `assignments`, `assignment_submissions`, `study_materials`).
   - Production MySQL 8.0 DDL script (`/backend/edupulse_week6_schema.sql`).
   - Interactive Week 6 Database & ERD Studio with live SQL query runner and normalization proofs.
6. **Week 7 (W7): Backend — Express API, Authentication & RBAC:**
   - **Express.js API Architecture (`/backend/src/server.ts`):** Complete REST API with modular routers (`/api/auth`, `/api/admin`, `/api/academic`), global error handlers, CORS headers, and audit logging middleware.
   - **Authentication & Token Engine (`/backend/src/services/jwt.service.ts`):** Cryptographic HMAC SHA256 JWT access token generation and validation with 24-hour expiration.
   - **6-Digit Gmail OTP Verification System (`EmailOtpVerificationModal.tsx` & `/api/auth/verify-otp`):** Reliable verification code dispatch to user's personal or university Gmail address, persistent session storage, and 1-click Auto-Fill.
   - **Role-Based Access Control (RBAC) Gatekeeper (`/backend/src/middleware/rbac.middleware.ts`):** Strict 3-tier access isolation between Student, Faculty, and Administrator:
     - Unauthenticated requests yield `401 Unauthorized`.
     - Cross-role privilege violations (e.g., student calling admin endpoints) yield `403 Forbidden` with detailed violation telemetry.
   - **Interactive Week 7 Backend & REST API Studio:** In-browser Postman-style API explorer, live persona token switcher, 32-point RBAC permission matrix simulator, JWT token claims inspector, and OpenAPI 3.0 specification viewer.

---

### 📅 Week 7 Detailed Architecture & Deliverables

#### 1. Backend REST API Endpoints Specification

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Validates user credentials; returns JWT Bearer token & role claims |
| `POST` | `/api/auth/register` | Public | Self-registration; queues account into `PENDING` approval queue |
| `POST` | `/api/auth/send-otp` | Public | Dispatches 6-digit confirmation security code to user Gmail |
| `POST` | `/api/auth/verify-otp` | Public | Confirms 6-digit OTP code before activating registration |
| `GET` | `/api/auth/me` | Authenticated | Validates Bearer token and returns active identity claims |
| `GET` | `/api/admin/users/pending` | `ADMIN` only | Lists all accounts awaiting Registrar approval (enforces RBAC) |
| `PATCH` | `/api/admin/users/:id/approve` | `ADMIN` only | Formally approves account and activates portal access |
| `PATCH` | `/api/admin/users/:id/reject` | `ADMIN` only | Rejects registration with formal reason |
| `GET` | `/api/admin/rbac/matrix` | `ADMIN` only | Returns full 32-point RBAC capability catalog |
| `GET` | `/api/admin/system/health` | Public | Server uptime, memory footprint, MySQL connection, and version |
| `GET` | `/api/academic/departments` | Authenticated | Lists all academic departments and enrolled student quotas |
| `GET` | `/api/academic/courses` | Authenticated | Returns curriculum course catalog with credits and types |
| `GET` | `/api/academic/teacher/roster` | `TEACHER`, `ADMIN` | Faculty course enrollment roster; blocked for Students (403) |
| `GET` | `/api/academic/student/grades` | `STUDENT`, `ADMIN` | Private student grade telemetry; blocked for Teachers (403) |

#### 2. RBAC 3-Tier Security Policy Matrix
The system defines 32 granular capabilities categorized into 5 security domains:
- **Authentication (3 permissions):** Login, Verify OTP, Profile View.
- **Student Portal (7 permissions):** Dashboard View, Attendance View, QR Scan, Assignment Submit, Result Submit, Notice View, Study Material Download.
- **Teacher Console (9 permissions):** Dashboard View, QR Generate, Manual Attendance Override, Marks Entry, Bulk CSV Import/Export, Assignment Create, Assignment Grade, Result Verify, Early Warning Counsel.
- **Administrator Control (10 permissions):** Institutional Dashboard, User Approval Desk, Departments CRUD, Semesters CRUD, Courses CRUD, Faculty Registry CRUD, Students Registry CRUD, Timetable Allocation, Database Studio Access.
- **Security Audit (3 permissions):** RBAC Policy Inspect, API Studio Client, System Telemetry.

#### 3. JWT Token Claims Structure
Tokens are signed using HMAC SHA256 with the following standard claims payload:
```json
{
  "userId": "usr_stud_1",
  "name": "Fathin Sadman",
  "email": "student@metrouni.edu.bd",
  "role": "STUDENT",
  "authProvider": "EMAIL",
  "studentId": "241-115-211",
  "department": "CSE",
  "issuedAt": 1729012800,
  "expiresAt": 1729099200
}
```

---

### 💻 Code Artifacts Delivered in Week 7
- `/backend/src/server.ts` — Main Express 4.21 server with CORS and error handling.
- `/backend/src/services/jwt.service.ts` — Cryptographic JWT signing and validation engine.
- `/backend/src/middleware/rbac.middleware.ts` — `authenticateToken`, `authorizeRoles`, and `auditLogger`.
- `/backend/src/config/rbac.matrix.ts` — 32-point RBAC capability definitions and lookup logic.
- `/backend/src/controllers/auth.controller.ts` — Auth controllers for login, register, OTP dispatch, and verify.
- `/backend/src/controllers/admin.controller.ts` — Admin controllers for pending account management and system health.
- `/backend/src/routes/auth.routes.ts` — Express authentication router.
- `/backend/src/routes/admin.routes.ts` — Express administrator router.
- `/backend/src/routes/academic.routes.ts` — Express academic catalog router.
- `/frontend/src/pages/admin/AdminWeek7ApiStudio.tsx` — Interactive Postman-style API explorer, JWT inspector, and RBAC matrix.
- `/frontend/src/components/auth/EmailOtpVerificationModal.tsx` — Resolved verification code reliability with persistent session codes, prominent dispatched security code display, and 1-click Auto-Fill.

---
*Submitted for review by Department of Computer Science & Engineering, Metropolitan University, Sylhet.*
