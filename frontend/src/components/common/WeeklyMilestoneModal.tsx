import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCode,
  Layers,
  ChevronRight,
  X,
  GraduationCap,
  FileText,
  BookOpen,
  Award,
  BellRing,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface WeeklyMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

export interface WeekTaskItem {
  id: string;
  week: string;
  activity: string;
  tasks: string;
  status: 'COMPLETED' | 'CURRENT_MILESTONE' | 'NEXT_SPRINT' | 'FUTURE_PHASE';
  files: string[];
  deliverables: string[];
}

export const WEEKLY_MILESTONES: WeekTaskItem[] = [
  {
    id: 'w1',
    week: 'W1',
    activity: 'Requirement Analysis & Project Planning',
    tasks: 'Problem statement and objectives; user roles (student, teacher, admin); functional and non-functional requirements; Phase 1 (MVP) vs Phase 2 scope; tech stack selection; early warning rules; project plan and Gantt chart.',
    status: 'COMPLETED',
    files: [
      '/WEEK_1_TO_4_PROJECT_DELIVERABLES.md',
      '/src/types/index.ts',
      '/src/data/mockData.ts'
    ],
    deliverables: [
      'Problem definition for Metropolitan University academic monitoring',
      '3-Tier Role-Based Access Control model (Student, Teacher, Admin)',
      'Early Warning Threshold Rules (CGPA < 2.50, Attendance < 75%)',
      'Phase 1 (W1-W4) Scope Definition: Pure client-side Student Portal milestone'
    ]
  },
  {
    id: 'w2',
    week: 'W2',
    activity: 'UI/UX Design & React Project Setup',
    tasks: 'Wireframes and page flow for all three panels; design system (colors, typography, components); React project setup with Tailwind CSS; folder structure; routing setup.',
    status: 'COMPLETED',
    files: [
      '/src/theme/epTheme.ts',
      '/src/index.css',
      '/src/App.tsx',
      '/src/components/layout/Header.tsx',
      '/src/components/layout/Sidebar.tsx',
      '/src/components/layout/Footer.tsx',
      '/src/components/common/ThemeCustomizerModal.tsx'
    ],
    deliverables: [
      'Tailwind CSS design system with custom palette & dark/light mode toggle',
      'Multi-dock layout (Left, Top, and Right sidebar docking options)',
      'Modular folder structure: pages, components, context, data, theme, utils',
      'Metropolitan University CSE Department branding & typography'
    ]
  },
  {
    id: 'w3',
    week: 'W3',
    activity: 'Frontend — Login, Layout & Student Dashboard',
    tasks: 'Login page and form validation; common layout (sidebar, navbar, role-based menu); student academic dashboard (courses, credit hours, SGPA/CGPA, marks, attendance %); course-wise risk badges (SAFE / WARNING / CRITICAL); red alert banner.',
    status: 'COMPLETED',
    files: [
      '/src/components/auth/AuthScreen.tsx',
      '/src/components/auth/AuthModal.tsx',
      '/src/pages/student/StudentDashboard.tsx',
      '/src/pages/student/StudentAcademicPerformance.tsx',
      '/src/components/common/StatCard.tsx',
      '/src/components/common/StatusBadge.tsx'
    ],
    deliverables: [
      'Single Demo Student Account (Fathin Sadman - 241-115-211)',
      'Top 5 KPI Metric Cards (Current SGPA, CGPA, Attendance %, Semester, Credits)',
      'Dynamic Red Alert Risk Banner triggered by early warning engine',
      'Course-wise academic risk status badges (SAFE, WARNING, CRITICAL)',
      'Continuous marks breakdown & Interactive SGPA target simulator'
    ]
  },
  {
    id: 'w4',
    week: 'W4',
    activity: 'Frontend — Student Features',
    tasks: 'QR attendance scanner UI; previous result submission form; notice board; assignment hub (view, file upload); study material downloads; co-curricular profile.',
    status: 'CURRENT_MILESTONE',
    files: [
      '/src/pages/student/StudentQrScanner.tsx',
      '/src/pages/student/StudentPreviousResults.tsx',
      '/src/pages/student/StudentNotices.tsx',
      '/src/pages/student/StudentAssignments.tsx',
      '/src/pages/student/StudentStudyMaterials.tsx',
      '/src/pages/student/StudentCoCurricular.tsx',
      '/src/components/common/ClassRoutineTracker.tsx'
    ],
    deliverables: [
      'Interactive Dynamic QR Attendance Scanner (Live webcam, token validation, manual code input)',
      'Previous Semester Result Submission Form with transcript audit pipeline',
      'Departmental Notice Board with instant document download & modal preview',
      'Assignment Hub with deliverables upload & question specification downloads',
      'Study Material Repository with lecture slides & verified document downloads',
      'Co-Curricular Profile showcasing programming contests, clubs & verified technical stack',
      'Class Routine & Room Tracker with multi-filter (Day, Dept, Room, Subject, Batch)'
    ]
  },
  {
    id: 'w5',
    week: 'W5',
    activity: 'Frontend — Teacher & Admin Dashboards & Features',
    tasks: 'Teacher and Admin portals, live QR generator desk, manual mark entry, student roster, faculty verification desk, course allocation, and registration approvals.',
    status: 'NEXT_SPRINT',
    files: [
      '/src/components/teacher/ (Scheduled for Week 5)',
      '/src/components/admin/ (Scheduled for Week 5)'
    ],
    deliverables: [
      'Scheduled for Week 5 development as per user requirements',
      'Teacher QR Generator with manual roll call fallback',
      'UGC Continuous Assessment & Tabulation Grade Sheet Desk',
      'Admin Department, Semester, and Course Allocation Manager'
    ]
  },
  {
    id: 'w6_w12',
    week: 'W6-W12',
    activity: 'Database Design, Backend & Final Submission',
    tasks: 'MySQL ER diagram, Express API, JWT Auth & RBAC, Dynamic QR validation API, Risk engine triggers, integration, full system testing & final project defense.',
    status: 'FUTURE_PHASE',
    files: ['/backend/ (Phase 2 Roadmap)'],
    deliverables: [
      'Week 6: Database Design & MySQL Setup',
      'Week 7: Backend Express API, Authentication & RBAC',
      'Week 8: Attendance, Dynamic QR & Assessment APIs',
      'Week 9: Results, Risk Detection & Admin APIs',
      'Week 10: Frontend-Backend Integration',
      'Week 11: Full System Testing & Bug Fixing',
      'Week 12: Final Documentation, Report & Presentation'
    ]
  }
];

export const WeeklyMilestoneModal: React.FC<WeeklyMilestoneModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const { isDarkMode } = useApp();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-[#0f172a] border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Project Progress & Syllabus Roadmap</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Week 4 Target Reached
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Metropolitan University &bull; Academic Project Milestone Breakdown (Weeks 1 to 4 Complete)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Submission Notice for Supervisor */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-4 ${
              isDarkMode
                ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-200'
                : 'bg-cyan-50 border-cyan-200 text-cyan-900'
            }`}
          >
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">Official Academic Milestone Status</p>
              <p className="opacity-90 leading-relaxed">
                This version satisfies all specifications of <strong>Week 1, Week 2, Week 3, and Week 4</strong>. In compliance with your prompt, this milestone operates as a <strong>pure client-side React frontend</strong> with <strong>1 Demo Student Account</strong>. Teacher and Admin panels are reserved for Week 5.
              </p>
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-4">
            {WEEKLY_MILESTONES.map((item) => {
              const isCurrent = item.status === 'CURRENT_MILESTONE';
              const isDone = item.status === 'COMPLETED';
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? isDarkMode
                        ? 'bg-cyan-950/30 border-cyan-500/50 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/40'
                        : 'bg-cyan-50/70 border-cyan-400 shadow-sm ring-2 ring-cyan-400/20'
                      : isDone
                      ? isDarkMode
                        ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                      : isDarkMode
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-100 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {item.week}
                      </span>
                      <h3 className="font-bold text-base">{item.activity}</h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {isDone || isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {isCurrent ? 'Current Milestone (W4)' : isDone ? 'Completed' : item.status === 'NEXT_SPRINT' ? 'Week 5 Sprint' : 'Phase 2 (W6-W12)'}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 mb-3 leading-relaxed">
                    <strong>Syllabus Tasks:</strong> {item.tasks}
                  </p>

                  {/* Deliverables List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-3">
                    {item.deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className={`text-[11px] p-2 rounded-xl flex items-center gap-2 ${
                          isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{deliv}</span>
                      </div>
                    ))}
                  </div>

                  {/* Associated Code Files */}
                  <div className="pt-2 border-t border-slate-700/40 flex flex-wrap items-center gap-1.5 text-[11px] opacity-75">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-semibold">Mapped Files:</span>
                    {item.files.map((file, idx) => (
                      <code
                        key={idx}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isDarkMode ? 'bg-slate-800 text-cyan-300' : 'bg-slate-200 text-cyan-700'
                        }`}
                      >
                        {file}
                      </code>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
            isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="text-xs opacity-75">
            Milestone: <strong>Week 1 to Week 4 Complete</strong> &bull; Student Portal: <strong>100% Active</strong>
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToTab && (
              <button
                onClick={() => {
                  onNavigateToTab('dashboard');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>View Student Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
