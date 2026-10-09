import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ClipboardCheck,
  QrCode,
  Users,
  FileSpreadsheet,
  FileCheck2,
  BookMarked,
  Bell,
  AlertTriangle,
  Terminal,
  GraduationCap,
  Award,
  Layers,
  Building,
  CalendarDays,
  UserCheck,
  UserPlus,
  GitBranch,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, theme, highRiskAlerts } = useApp();

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number | string;
    badgeColor?: string;
    danger?: boolean;
  }

  // Teacher Nav (matches image screenshot exactly)
  const teacherNav: NavItem[] = [
    { id: 'teacher-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teacher-routine', label: 'Class Routine & Rooms', icon: Calendar },
    { id: 'teacher-courses', label: 'My Courses', icon: BookOpen },
    { id: 'teacher-manual-attendance', label: 'Manual Attendance', icon: ClipboardCheck },
    { id: 'teacher-qr', label: 'QR Generator', icon: QrCode },
    { id: 'teacher-roster', label: 'Students Roster', icon: Users },
    { id: 'teacher-assessments', label: 'Assessments Desk', icon: FileSpreadsheet },
    { id: 'teacher-assignments', label: 'Assignments', icon: FileCheck2 },
    { id: 'teacher-materials', label: 'Study Materials', icon: BookMarked },
    { id: 'teacher-notices', label: 'Notices', icon: Bell },
    {
      id: 'teacher-risk-desk',
      label: 'High-Risk Alerts',
      icon: AlertTriangle,
      danger: true,
      badge: highRiskAlerts.length || 3,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    }
  ];

  // Student Nav
  const studentNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academic-performance', label: 'Academic Performance', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance Log', icon: ClipboardCheck },
    { id: 'qr-scanner', label: 'QR Attendance Scanner', icon: QrCode },
    { id: 'class-routine', label: 'Class Routine & Rooms', icon: Calendar },
    { id: 'syllabus-tracker', label: 'Syllabus Tracker', icon: Layers },
    { id: 'assignments', label: 'Assignments Hub', icon: FileCheck2 },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'study-materials', label: 'Study Materials', icon: BookMarked },
    { id: 'previous-results', label: 'Previous Results', icon: FileSpreadsheet },
    { id: 'co-curricular', label: 'Co-Curricular Profile', icon: Award }
  ];

  // Admin Nav
  const adminNav: NavItem[] = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-departments', label: 'Departments (CRUD)', icon: Building },
    { id: 'admin-semesters', label: 'Semesters (CRUD)', icon: CalendarDays },
    { id: 'admin-courses', label: 'Courses Catalog', icon: BookMarked },
    { id: 'admin-instructors', label: 'Faculty Directory', icon: UserCheck },
    { id: 'admin-students', label: 'Students Registry', icon: UserPlus },
    { id: 'admin-allocations', label: 'Course Allocations', icon: GitBranch }
  ];

  let currentNav = teacherNav;
  let scopeTitle = 'Teacher Panel';
  if (currentUser.role === 'STUDENT') {
    currentNav = studentNav;
    scopeTitle = 'Student Panel';
  } else if (currentUser.role === 'ADMIN') {
    currentNav = adminNav;
    scopeTitle = 'Administrator Panel';
  }

  const isTop = theme.sidebarPosition === 'top';

  if (isTop) {
    return (
      <nav className="w-full bg-[#080d1a] border-b border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        {currentNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <aside className="w-64 bg-[#080d1a] border-r border-slate-800/90 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-62px)] select-none">
      <div className="space-y-4">
        {/* Top CONSOLE SCOPE card from Screenshot */}
        <div className="px-4 py-3 rounded-2xl bg-[#0d1627] border border-slate-800/90 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              CONSOLE SCOPE
            </p>
            <p className="text-xs font-bold text-white mt-0.5">
              {scopeTitle}
            </p>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          {currentNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-600/20'
                    : item.danger
                    ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : item.danger
                        ? 'text-rose-400'
                        : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* University Accreditation Footer */}
      <div className="pt-4 border-t border-slate-800/80 px-2 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">Metropolitan University</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Academic Early Warning Architecture</p>
      </div>
    </aside>
  );
};
