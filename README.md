# EduPulse — Academic Performance & Monitoring Platform
### Metropolitan University &bull; Department of Computer Science & Engineering
**Team Delta (CSE 58th Batch):** Raiyan Chowdhury (241-115-210), Fathin Sadman (241-115-211), Md Al Mekdad Ajmol (241-115-223)

---

## 🎯 Current Milestone: Weeks 1 – 5 Complete (Full Frontend)

This release delivers the complete frontend architecture and feature sets spanning **Week 1 through Week 5** as outlined in the university syllabus:

- ✅ **Week 1:** Requirement Analysis & Project Planning, RBAC matrix, Early Warning rules (< 75% attendance / < 40% marks).
- ✅ **Week 2:** UI/UX Design System, dark/light themes, color palettes, responsive universal layout (Header, multi-dock Sidebar, Footer).
- ✅ **Week 3:** Login gateway with form validation, Student Academic Dashboard (SGPA/CGPA, credits, marks, attendance %), course-wise risk badges (`SAFE`, `WARNING`, `CRITICAL`), and Red Alert banner.
- ✅ **Week 4:** Dynamic QR Attendance Scanner UI, previous result submission form with verification tracker, notice board with PDF preview, assignment hub (file uploads & rubrics), study material downloads, co-curricular profile, and class timetable routine.
- ✅ **Week 5 (Teacher):** Teacher overview dashboard, enrolled student directory with section filters, dynamic QR generator with live 60s countdown timer & manual attendance fallback roster, continuous assessment spreadsheet with instant grade recalculation & bulk CSV import/export, assignment creation & grading desk, notice publishing, study material upload, previous result verification desk, and early warning high-risk student alert desk.
- ✅ **Week 5 (Admin):** Institutional admin dashboard with metrics (Total Students, Average Attendance, Pass Rate, Active Faculty), full CRUD desks for Departments, Semesters/Sessions, Courses Catalog, Faculty Instructors Directory, and Students Registry, plus an interactive Course Allocation & Schedule screen with conflict detection.

---

## 📂 Repository Architecture

```
edupulse-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # AuthScreen, AuthModal, SwitchAccountModal
│   │   │   ├── common/        # StatCard, StatusBadge, PDFDocumentModal, ThemeCustomizerModal
│   │   │   └── layout/        # Header, Sidebar (Role-based), Footer
│   │   ├── context/           # Central AppContext (State persistence & operations)
│   │   ├── data/              # Realistic mock data for Student, Teacher, Admin
│   │   ├── pages/
│   │   │   ├── student/       # 9 Student Feature Screens (W3-W4)
│   │   │   ├── teacher/       # 9 Teacher Console Screens (W5)
│   │   │   └── admin/         # 7 Admin Console Screens & CRUD Desks (W5)
│   │   ├── theme/             # Palette definitions & customizer
│   │   ├── types/             # TypeScript interfaces for all roles & entities
│   │   ├── App.tsx            # Universal dynamic router & view dispatcher
│   │   ├── main.tsx           # Application root entry point
│   │   └── index.css          # Tailwind CSS v4 setup & theme styles
│   └── README.md
│
├── backend/                   # Node.js + Express API Server
│   ├── README.md
│   └── server.ts
│
├── index.html                 # HTML Entry with fonts and metadata
├── package.json               # Root scripts & dependencies
├── tsconfig.json              # TypeScript compilation config
├── vite.config.ts             # Vite bundler config
└── WEEK_1_TO_5_PROJECT_DELIVERABLES.md # Comprehensive syllabus progress report
```

---

## ⚡ 1-Click Evaluation Credentials

Use the **"Switch Role"** pill button at the top header to instantly switch between personas:

| Role | Persona Name | Institutional Email | Key Access Scope |
|---|---|---|---|
| 🎓 **Student** | Fathin Sadman | `student@metrouni.edu.bd` | Course grades, QR scanner, assignments, notices, routine |
| 👨‍🏫 **Teacher** | Dr. Tariqul Islam | `tariqul.cse@metrouni.edu.bd` | Live QR session, marks spreadsheet, CSV import, verifications |
| 🛡️ **Admin** | Prof. Dr. M. Rahman | `admin.registrar@metrouni.edu.bd` | KPIs, CRUD for Depts, Semesters, Courses, Faculty, Students & Allocations |

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run Vite dev server
npm run dev
```

Application runs at `http://localhost:3000`.
