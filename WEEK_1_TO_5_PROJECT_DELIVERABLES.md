# 🎓 Metropolitan University — Department of CSE
## Academic Project Progress Report — Milestone: Weeks 1 to 5 Complete

**Project Name:** EduPulse — Academic Performance & Monitoring Platform  
**Target Period:** Weeks 1 – 5 (Frontend Architecture, Student Features, Teacher Console & Admin CRUD)  
**Supervisor / Review Copy:** Department of Computer Science & Engineering  

---

### 📌 Milestone Executive Summary
This submission delivers **100% of the syllabus requirements from Week 1 through Week 5**. The entire frontend now features full interactive suites for all three roles (**Student**, **Teacher**, and **Admin**):

1. **Student Panel (Weeks 1–4):** Academic dashboard, SGPA/CGPA telemetry, Red Alert banner for critical courses (< 75% attendance / < 40% marks), Dynamic QR Scanner UI, Previous Results submission form, University Notice Board, Assignment Hub, Study Material downloads, and Co-Curricular profile.
2. **Teacher Panel (Week 5):** Assigned course & enrolled directory, dynamic QR attendance generator with rotating 60s security token & manual roster fallback, continuous assessment ledger with instant grade recalculation & bulk CSV import/export, assignment creation & evaluation desk, notice publishing, study material upload, previous result verification desk, and early warning high-risk student desk.
3. **Admin Panel (Week 5):** Institutional KPI dashboard (Total Students, Pass Rate, Avg Attendance, Active Faculty), full CRUD desks for Departments, Semesters/Sessions, Courses Catalog, Instructors, and Students Registry, and an interactive Course Allocation & Schedule screen with conflict detection.

---

## 📅 Detailed Week-by-Week Breakdown

### ✅ Week 1 (W1): Requirement Analysis & Project Planning
- **Deliverables:**
  - Problem statement & core objectives defined.
  - Role-based Access Control (RBAC) matrix for Student, Teacher, and Admin (`src/types/index.ts`).
  - Early warning rules engine (Minimum attendance threshold: 75%; minimum marks threshold: 40%).
  - Tech stack: React 19, TypeScript, Tailwind CSS, Lucide icons, QRCode.

### ✅ Week 2 (W2): UI/UX Design & React Project Setup
- **Deliverables:**
  - Complete dark & light theme system (`src/theme/epTheme.ts` & `src/index.css`) with 7 customizable accent palettes.
  - Universal layout with sticky responsive Header, multi-dock Sidebar, and institutional Footer.
  - Centralized state management & reactive persistence in `src/context/AppContext.tsx`.

### ✅ Week 3 (W3): Frontend — Login, Layout & Student Dashboard
- **Deliverables:**
  - Institutional login gateway (`AuthScreen.tsx`) with 1-click evaluation personas.
  - Student Academic Dashboard (`StudentDashboard.tsx`) with Top 5 KPIs (SGPA, CGPA, Attendance, Credits, Risk Level).
  - Prominent **Dynamic Red Alert Banner** flagging critical courses with counseling action links.
  - Course-wise academic performance table with color-coded risk status badges (`SAFE`, `WARNING`, `CRITICAL`).

### ✅ Week 4 (W4): Frontend — Student Features
- **Deliverables:**
  - **Dynamic QR Attendance Scanner UI** (`StudentQrScanner.tsx`): Simulated viewfinder, animated laser scanline, auto-refreshed token countdown, and manual PIN fallback.
  - **Previous Result Submission Form** (`StudentPreviousResults.tsx`): Retake/improvement result claims with PDF slip attachment and advisor status pipeline (`PENDING` -> `VERIFIED`).
  - **Notice Board** (`StudentNotices.tsx`): Categorized notices with priority filters and in-browser official PDF preview modal.
  - **Assignment Hub** (`StudentAssignments.tsx`): Course deliverables, upload modal, score tracker, and teacher feedback view.
  - **Study Materials** (`StudentStudyMaterials.tsx`): Downloadable lecture slides, notes, lab code, and download counters.
  - **Co-Curricular Profile** (`StudentCoCurricular.tsx`): Club leadership, hackathons, and sports achievements.

### ✅ Week 5 (W5): Frontend — Teacher & Admin Dashboards & Features
- **Teacher Console:**
  - **Teacher Dashboard** (`TeacherDashboard.tsx`): Course cards, student counts, pending reviews, risk summary, and quick action launchpads.
  - **Course & Enrolled Student Directory** (`TeacherCourseDirectory.tsx`): Filter by section, search by student name/roll, risk badges, and student modal.
  - **Dynamic QR Generator Screen with Manual Attendance Fallback** (`TeacherDynamicQrAttendance.tsx`): Live `qrcode` canvas generation, 60s countdown timer with auto-rotating session PIN, fullscreen projector mode, and interactive manual attendance roster with instant Present/Late/Absent toggling.
  - **Assessment Entry & Bulk CSV Import** (`TeacherAssessmentEntry.tsx`): Spreadsheet table for Quizzes, Midterm, Assignments, and Final Exam with instant Total/Grade/GPA recalculation, sample CSV template download, and bulk CSV parser.
  - **Assignment Desk** (`TeacherAssignmentDesk.tsx`): Create assignments with deadlines & points, review student uploads, and award scores with constructive feedback.
  - **Notice Publishing Desk** (`TeacherNoticePublishing.tsx`): Broadcast notices with audience targeting (All, Department, Students) and urgency flags.
  - **Study Material Upload Desk** (`TeacherStudyMaterialUpload.tsx`): Upload lecture slides, lab manuals, and reference files.
  - **Verification Desk** (`TeacherVerificationDesk.tsx`): Review queue for student-submitted previous semester results and backlog claims with approve/reject workflows.
  - **High-Risk Alert Desk** (`TeacherHighRiskAlertDesk.tsx`): Early warning monitor for students with attendance < 75% or marks < 40%, dispatch formal warning slips, schedule counseling sessions, and log faculty interventions.
- **Admin Console:**
  - **Admin Dashboard** (`AdminDashboard.tsx`): Institutional KPIs (1,480 Students, 83.4% Attendance, 95.2% Pass Rate, 84 Faculty), department performance grid, and system health.
  - **Departments CRUD** (`AdminDepartmentsCrud.tsx`): Full Add, Edit, Delete for university faculties with chairs, student count, and contact emails.
  - **Semesters CRUD** (`AdminSemestersCrud.tsx`): Manage academic terms, toggle active semester, enrollment deadlines, and credit limits.
  - **Courses Catalog CRUD** (`AdminCoursesCrud.tsx`): Add, Edit, Delete courses with code, title, credits, department, and Theory/Lab type.
  - **Instructors Directory CRUD** (`AdminInstructorsCrud.tsx`): Add, Edit, Delete faculty with employee ID, designation, and contact info.
  - **Students Registry CRUD** (`AdminStudentsCrud.tsx`): Add, Edit, Delete student admissions with CGPA, attendance, and probation status.
  - **Course Allocation Desk** (`AdminCourseAllocation.tsx`): Assign course sections to faculty, allocate days, time slots, and room numbers with automated timetable conflict detection.
