# 🎓 Metropolitan University — Department of CSE
## Academic Project Progress Report — Milestone: Weeks 1 to 4 Complete

**Project Name:** EduPulse — Academic Performance & Monitoring Platform  
**Target Syllabus Period:** Weeks 1 – 4 (Frontend Student Features & Architecture)  
**Supervisor / Course Teacher Review Copy**  

---

### 📌 Executive Summary
This submission package contains all deliverables specified in the course syllabus from **Week 1 to Week 4**. The architecture is structured with a modular, scalable React SPA, dark/light theme engine, and all 9 interactive Student Portal features.

In accordance with your project development phases:
1. **Single Demo Student Account:** `Fathin Sadman` (`student@metrouni.edu.bd` / `241-115-211`).
2. **Weeks 1 to 4 Scope:** Pure client-side frontend architecture with local state persistence.
3. **Teacher and Admin Consoles:** Scheduled for development in **Week 5** sprint.

---

## 📅 Weekly Task Breakdown & File Mapping

### ✅ Week 1 (W1): Requirement Analysis & Project Planning
> **Syllabus Tasks:** Problem statement and objectives; user roles (student, teacher, admin); functional and non-functional requirements; Phase 1 (MVP) vs Phase 2 scope; tech stack selection; early warning rules; project plan and Gantt chart.

* **Delivered Features & Artifacts:**
  1. **User Roles & RBAC Matrix:** Defined in `src/types/index.ts` (`STUDENT`, `TEACHER`, `ADMIN`).
  2. **Early Warning Rules Engine:** Automated criteria based on minimum CGPA threshold (< 2.50) and attendance threshold (< 75%) with risk categorizations (`SAFE`, `WARNING`, `CRITICAL`).
  3. **Tech Stack Selection:** React 19, TypeScript, Tailwind CSS, Lucide React icons, and QR Code generation.
  4. **Phase 1 (W1–W4) vs Phase 2 (W5+) Scope Boundary:** Focused strictly on core architecture, design system, login gateway, layout, and complete Student Portal features for W1–W4. Teacher/Admin deep desks are planned for Week 5 sprint.
* **Key Files:**
  - `src/types/index.ts`
  - `src/data/mockData.ts`
  - `WEEK_1_TO_4_PROJECT_DELIVERABLES.md`

---

### ✅ Week 2 (W2): UI/UX Design & React Project Setup
> **Syllabus Tasks:** Wireframes and page flow for all three panels; design system (colors, typography, components); React project setup with Tailwind CSS; folder structure; routing setup.

* **Delivered Features & Artifacts:**
  1. **Clean Decoupled Folder Structure:**
     - `src/pages/student/` — Student views (Dashboard, Attendance, QR, Assignments, etc.)
     - `src/components/layout/` — Header, Sidebar, and University Footer
     - `src/components/common/` — StatCard, StatusBadge, RoutineTracker, ThemeCustomizer
     - `src/context/` — Central AppContext managing reactive state and persistence
  2. **Design System & Theming:**
     - Complete dark & light mode support (`src/theme/epTheme.ts` & `src/index.css`).
     - Customizable accent color palette (Cyan, Emerald, Blue, Indigo, Purple, Amber, Rose, Custom HEX picker).
     - Typography with Google Fonts (*Inter*, *Plus Jakarta Sans*, *JetBrains Mono*).
  3. **Universal Layout Architecture:**
     - Responsive `Header` with role badge, account switcher, and theme controls.
     - Dynamic multi-dock `Sidebar` (supports Left, Top, and Right navigation docks).
     - Comprehensive institutional `Footer` with Metropolitan University accreditations.
* **Key Files:**
  - `src/theme/epTheme.ts`
  - `src/index.css`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/common/ThemeCustomizerModal.tsx`

---

### ✅ Week 3 (W3): Frontend — Login, Layout & Student Dashboard
> **Syllabus Tasks:** Login page and form validation; common layout (sidebar, navbar, role-based menu); student academic dashboard (courses, credit hours, SGPA/CGPA, marks, attendance %); course-wise risk badges (SAFE / WARNING / CRITICAL); red alert banner.

* **Delivered Features & Artifacts:**
  1. **Authentication Gateway & Form Validation:**
     - 3-panel login screen (`AuthScreen.tsx`) and popup authentication modal (`AuthModal.tsx`).
     - One-click demo credentials for fast demonstration (Student: `Fathin Sadman`).
     - Form validation for institutional emails (`@metrouni.edu.bd`).
  2. **Student Academic Dashboard (`StudentDashboard.tsx`):**
     - **Top 5 KPI Metric Cards:** Current SGPA, Cumulative CGPA, Overall Attendance (%), Current Semester, and Total Credits Completed.
     - **Dynamic Red Alert Banner:** Prominently flags courses in `CRITICAL` state, showing immediate counseling suggestions and faculty contacts.
     - **Course-Wise Academic Performance Table:** Breakdown of course code, course title, credit hours, marks distribution, attendance %, and color-coded risk badges (`SAFE`, `WARNING`, `CRITICAL`).
     - **Academic GPA Progression & Attendance Trend Charts:** Visual progress analytics across semesters.
* **Key Files:**
  - `src/components/auth/AuthScreen.tsx`
  - `src/components/auth/AuthModal.tsx`
  - `src/pages/student/StudentDashboard.tsx`
  - `src/pages/student/StudentAcademicPerformance.tsx`
  - `src/components/common/StatCard.tsx`
  - `src/components/common/StatusBadge.tsx`

---

### ✅ Week 4 (W4): Frontend — Student Features
> **Syllabus Tasks:** QR attendance scanner UI; previous result submission form; notice board; assignment hub (view, file upload); study material downloads; co-curricular profile.

* **Delivered Features & Artifacts:**
  1. **QR Attendance Scanner UI (`StudentQrScanner.tsx`):**
     - Live webcam camera stream interface with front/back camera toggling.
     - Scanning status indicator, countdown timer, and location verification simulation.
     - Manual session token input fallback for devices without camera access.
  2. **Previous Result Submission Form (`StudentPreviousResults.tsx`):**
     - Form to submit retake, backlog, or improvement results with semester name, SGPA, and credits.
     - Historical GPA progression table and status pipeline (`PENDING` -> `VERIFIED`).
  3. **Notice Board (`StudentNotices.tsx`):**
     - Categorized university notices (General, Holiday, Course-Specific, Examination).
     - In-browser PDF preview modal and downloadable document generation.
  4. **Assignment Hub (`StudentAssignments.tsx`):**
     - Active & past assignments with deadlines, course codes, and points.
     - Interactive modal for file upload deliverables with submission timestamp tracking.
     - **Direct File Downloads:** Real, instant file downloads for assignment problem specifications.
  5. **Study Material Downloads (`StudentStudyMaterials.tsx`):**
     - Course-wise repository for lecture slides, textbook references, and lab manuals.
     - **Direct File Downloads:** Real, instant file downloads for all course lecture modules.
  6. **Co-Curricular Profile (`StudentCoCurricular.tsx`):**
     - Profiles student participation in programming contests (IUPC), robotics workshops, hackathons, and sports with earned points and verification status.
  7. **Class Routine & Room Tracker (`ClassRoutineTracker.tsx`):**
     - Filter schedules by Day, Room Number, Department, and Subject with teacher details.
  8. **Weekly Syllabus Tracker (`WeeklySyllabusTracker.tsx` & `WeeklyMilestoneModal.tsx`):**
     - Direct in-app display of the syllabus progress table matching the supervisor's requirements.
* **Key Files:**
  - `src/pages/student/StudentQrScanner.tsx`
  - `src/pages/student/StudentPreviousResults.tsx`
  - `src/pages/student/StudentNotices.tsx`
  - `src/pages/student/StudentAssignments.tsx`
  - `src/pages/student/StudentStudyMaterials.tsx`
  - `src/pages/student/StudentCoCurricular.tsx`
  - `src/pages/student/WeeklySyllabusTracker.tsx`
  - `src/components/common/WeeklyMilestoneModal.tsx`
  - `src/components/common/ClassRoutineTracker.tsx`

---

## 🔮 Upcoming Week 5 Milestone (Next Sprint)
* **Week 5 Activity:** Frontend — Teacher & Admin Desks / Routine Allocation.
* **Tasks to be unlocked:**
  - Teacher live QR generation desk & continuous assessment grading.
  - Teacher student roster and verification desk.
  - Admin course allocation and department entity management.
  - Admin registration approval desk.

---

## 🚀 How to Run & Verify for Supervisor Presentation
1. Start the application:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000`.
3. Select **"Student Portal"** from the login screen (Demo: `student@metrouni.edu.bd` / `password123`).
4. Click on **"Week 4 Milestone"** in the top navigation bar or **"Week 1-4 Syllabus Tracker"** in the sidebar to review the syllabus completion checklist.
5. Tour through all student modules (Dashboard, QR Scanner, Past Results, Notices, Assignments, Study Materials, Co-Curricular).
