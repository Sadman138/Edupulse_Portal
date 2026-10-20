# 🎓 Metropolitan University — Department of CSE
## Academic Project Progress Report — Milestone: Weeks 1 to 6 Complete

**Project Name:** EduPulse — Academic Performance & Monitoring Platform  
**Target Period:** Weeks 1 – 6 (Frontend Architecture, Student Features, Teacher Console, Admin CRUD & Database Design / MySQL Setup)  
**Supervisor / Review Copy:** Department of Computer Science & Engineering  

---

### 📌 Milestone Executive Summary
This submission delivers **100% of the syllabus requirements from Week 1 through Week 6**.
The application features:
1. **Student Panel (Weeks 1–4):** Academic dashboard, SGPA/CGPA telemetry, Red Alert banner for critical courses (< 75% attendance / < 40% marks), Dynamic QR Scanner UI, Previous Results submission form, University Notice Board, Assignment Hub, Study Material downloads, and Co-Curricular profile.
2. **Teacher Panel (Week 5):** Assigned course & enrolled directory, dynamic QR attendance generator with rotating 60s security token & manual roster fallback, continuous assessment ledger with instant grade recalculation & bulk CSV import/export, assignment creation & evaluation desk, notice publishing, study material upload, previous result verification desk, and early warning high-risk student desk.
3. **Admin Panel (Week 5):** Institutional KPI dashboard (Total Students, Pass Rate, Avg Attendance, Active Faculty), full CRUD desks for Departments, Semesters/Sessions, Courses Catalog, Instructors, and Students Registry, and an interactive Course Allocation & Schedule screen with conflict detection.
4. **Universal Bulk CSV Import/Export Engine:** All data intake desks (Add Students, Add Marks, Add Departments, Add Courses, Add Instructors) now feature full CSV bulk import capabilities with downloadable templates, drag-and-drop file parsers, live validation previews, and instant data ingestion.
5. **Role-Based Authentication & Security Gatekeeper:**
   - Strict access isolation: Student cannot access Teacher/Admin portals; Teacher cannot access Student/Admin portals; Admin cannot access Student/Teacher portals.
   - Dedicated Demo Accounts with 1-click evaluation:
     - **Student Demo:** `student@metrouni.edu.bd` / `student123`
     - **Teacher Demo:** `teacher@metrouni.edu.bd` / `teacher123`
     - **Admin Demo:** `admin@metrouni.edu.bd` / `admin123`
   - Self-registration & Google Sign-up accounts are placed into a `PENDING` state until approved by the University Administrator in the **Central Account Approval Desk**.
6. **Week 6 (W6): Database Design & MySQL Setup:**
   - Fully normalized **3NF / BCNF ER Diagram and relational schema** encompassing all 17 required syllabus tables:
     1. `departments`
     2. `semesters`
     3. `users`
     4. `students`
     5. `teachers`
     6. `courses`
     7. `course_allocations`
     8. `course_enrollments`
     9. `attendance_logs`
     10. `qr_attendance_sessions`
     11. `course_evaluations`
     12. `previous_results`
     13. `previous_result_courses`
     14. `notices`
     15. `assignments`
     16. `assignment_submissions`
     17. `study_materials`
   - Fully executable MySQL 8.0 DDL script (`/backend/edupulse_week6_schema.sql` and `/public/edupulse_week6_schema.sql`) complete with InnoDB engine, utf8mb4 collation, primary keys, cascade foreign keys, check constraints, composite uniqueness guards, and realistic initial seed records.
   - Interactive **Week 6 MySQL & ERD Studio** in the Admin Console featuring visual table node inspection, DDL viewer, live SQL query runner sandbox, and academic normalization proofs.

---

## 📅 Detailed Week-by-Week Breakdown

### ✅ Week 1 (W1): Requirement Analysis & Project Planning
- Problem statement & core objectives defined.
- Role-based Access Control (RBAC) matrix for Student, Teacher, and Admin (`src/types/index.ts`).
- Early warning rules engine (Minimum attendance threshold: 75%; minimum marks threshold: 40%).
- Tech stack: React 19, TypeScript, Tailwind CSS, Lucide icons, QRCode.

### ✅ Week 2 (W2): UI/UX Design & React Project Setup
- Complete dark & light theme system (`src/theme/epTheme.ts` & `src/index.css`) with 7 customizable accent palettes.
- Universal layout with sticky responsive Header, multi-dock Sidebar, and institutional Footer.
- Centralized state management & reactive persistence in `src/context/AppContext.tsx`.

### ✅ Week 3 (W3): Frontend — Login, Layout & Student Dashboard
- Institutional login gateway (`AuthScreen.tsx`) with 1-click evaluation personas.
- Student Academic Dashboard (`StudentDashboard.tsx`) with Top 5 KPIs (SGPA, CGPA, Attendance, Credits, Risk Level).
- Prominent **Dynamic Red Alert Banner** flagging critical courses with counseling action links.
- Course-wise academic performance table with color-coded risk status badges (`SAFE`, `WARNING`, `CRITICAL`).

### ✅ Week 4 (W4): Frontend — Student Features
- **Dynamic QR Attendance Scanner UI** (`StudentQrScanner.tsx`): Simulated viewfinder, animated laser scanline, auto-refreshed token countdown, and manual PIN fallback.
- **Previous Result Submission Form** (`StudentPreviousResults.tsx`): Retake/improvement result claims with PDF slip attachment and advisor status pipeline (`PENDING` -> `VERIFIED`).
- **Notice Board** (`StudentNotices.tsx`): Categorized notices with priority filters and in-browser official PDF preview modal.
- **Assignment Hub** (`StudentAssignments.tsx`): Course deliverables, upload modal, score tracker, and teacher feedback view.
- **Study Materials** (`StudentStudyMaterials.tsx`): Downloadable lecture slides, notes, lab code, and download counters.
- **Co-Curricular Profile** (`StudentCoCurricular.tsx`): Club leadership, hackathons, and sports achievements.

### ✅ Week 5 (W5): Frontend — Teacher & Admin Dashboards & Features
- **Teacher Console:**
  - Teacher Dashboard, Course Directory, Dynamic QR Attendance Generator with 60s rotating PIN, Continuous Assessment Desk with CSV import/export, Assignment Desk, Notice Publishing, Study Material Upload, Result Verification, High-Risk Early Warning Desk.
- **Admin Console:**
  - Institutional KPI Dashboard, CRUD Desks for Departments, Semesters, Courses, Instructors, and Students Registry, Timetable Course Allocations Desk, Central Account Approval Desk.

### ✅ Week 6 (W6): Database Design & MySQL Setup
- **Interactive Visual ER Diagram:** Visual schema explorer for all 17 tables with PK/FK links, attribute inspectors, and sample rows.
- **MySQL 8.0 Schema DDL:** Normalized 3NF/BCNF script with constraints, cascades, indexes, and seed records (`edupulse_week6_schema.sql`).
- **Live SQL Sandbox & Query Runner:** Preloaded with critical early warning audits, teaching loads, and continuous assessment grade ledger queries.
- **Normalization Proof:** Documented 1NF, 2NF, 3NF, and BCNF justification conforming to CSE accreditation standards.
