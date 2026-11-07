import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Lock,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number | string;
  badgeColor?: string;
  danger?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    theme,
    highRiskAlerts,
    registeredUsers,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useApp();

  const pendingApprovalsCount = registeredUsers?.filter(u => u.status === 'PENDING').length || 0;

  // Teacher Nav
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

  // Student Nav (strictly matches user brief)
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
    {
      id: 'admin-approvals',
      label: 'Account Approvals',
      icon: UserCheck,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-black'
    },
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

  const isLight = theme.mode === 'light';
  const isTop = theme.sidebarPosition === 'top';

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  };

  // Top Position View
  if (isTop) {
    return (
      <nav
        className="w-full border-b px-4 sm:px-6 py-2 overflow-x-auto flex items-center select-none sticky top-[61px] z-30 backdrop-blur-xl transition-colors scrollbar-thin shadow-sm"
        style={{
          backgroundColor: isLight ? 'var(--color-sidebar, rgba(255, 255, 255, 0.95))' : 'var(--color-sidebar, #0B1220)',
          borderColor: 'var(--color-border, rgba(148, 163, 184, 0.16))'
        }}
      >
        <div className="flex items-center gap-1.5 min-w-max mx-auto max-w-7xl w-full">
          {currentNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={isActive ? {
                  background: `linear-gradient(to right, ${theme.primary || '#10B981'}, ${theme.secondary || '#06B6D4'})`,
                  color: '#ffffff',
                  boxShadow: `0 4px 14px ${theme.glow || 'rgba(16, 185, 129, 0.35)'}`
                } : {}}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'shadow-md text-white'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-rose-500 text-white shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Sidebar Inner Content Component
  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full select-none gap-6">
      <div className="space-y-5">
        {/* Role Locked Banner Card */}
        <div
          className="px-4 py-3.5 rounded-2xl border flex items-center justify-between transition-all duration-300 backdrop-blur-md shadow-xs"
          style={{
            backgroundColor: isLight ? '#f8fafc' : '#172235',
            borderColor: isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.16)'
          }}
        >
          <div>
            <div className={`flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>ROLE LOCKED</span>
            </div>
            <p
              className="text-sm font-black mt-1 tracking-tight"
              style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
            >
              {scopeTitle}
            </p>
          </div>
          <div
            className={`p-2 rounded-xl border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                : 'bg-[#1D2B40] border-[rgba(148,163,184,0.2)] text-cyan-400'
            }`}
          >
            <Terminal className="w-4.5 h-4.5 text-cyan-400" />
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="space-y-1.5">
          {currentNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={isActive ? {
                  background: isLight
                    ? `linear-gradient(to right, ${theme.primary || '#10B981'}25, ${theme.secondary || '#06B6D4'}15, transparent)`
                    : `linear-gradient(to right, ${theme.primary || '#10B981'}30, ${theme.secondary || '#06B6D4'}20, transparent)`,
                  borderColor: isLight ? `${theme.primary || '#10B981'}60` : `${theme.primary || '#10B981'}70`,
                  color: isLight ? '#0f172a' : '#ffffff'
                } : {}}
                className={`group relative w-full flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-[15px] transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border font-black shadow-lg shadow-cyan-500/5'
                    : item.danger
                    ? isLight
                      ? 'text-rose-600 hover:bg-gradient-to-r hover:from-rose-100/60 hover:to-transparent hover:text-rose-800 font-bold'
                      : 'text-rose-400 hover:bg-gradient-to-r hover:from-rose-500/15 hover:via-rose-500/5 hover:to-transparent hover:text-rose-200 font-bold'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-gradient-to-r hover:from-slate-100 hover:to-transparent font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent font-bold'
                }`}
              >
                {/* Active animated indicator on the left, or subtle indicator on hover */}
                {isActive ? (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full shadow-sm"
                    style={{
                      background: `linear-gradient(to bottom, ${theme.primary || '#10B981'}, ${theme.secondary || '#06B6D4'})`,
                      boxShadow: `0 0 10px ${theme.glow || 'rgba(16, 185, 129, 0.4)'}`
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                ) : (
                  <span
                    className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xs"
                    style={{
                      background: `linear-gradient(to bottom, ${theme.primary || '#10B981'}, ${theme.secondary || '#06B6D4'})`
                    }}
                  />
                )}

                <div className="flex items-center gap-3.5 min-w-0 pl-1">
                  <Icon
                    className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      color: isActive
                        ? isLight ? (theme.primary || '#10B981') : (theme.primary || '#06b6d4')
                        : item.danger
                        ? isLight ? '#e11d48' : '#f43f5e'
                        : undefined
                    }}
                  />
                  <span className={`truncate font-bold tracking-tight ${isActive ? 'font-black' : 'group-hover:text-white dark:group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || (isLight ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* University Accreditation Footer */}
      <div
        className={`pt-4 border-t px-2 text-xs ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <p className={`font-black text-xs sm:text-sm ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Metropolitan University
          </p>
        </div>
        <p className={`text-[11px] mt-1 pl-6 font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Academic Early Warning Portal
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Dock */}
      <aside
        className="hidden md:flex w-64 lg:w-72 xl:w-80 border-r p-4 sm:p-5 shrink-0 min-h-[calc(100vh-70px)] select-none transition-colors duration-300 backdrop-blur-xl"
        style={{
          backgroundColor: isLight ? 'var(--color-sidebar, rgba(255, 255, 255, 0.95))' : 'var(--color-sidebar, #0B1220)',
          borderColor: 'var(--color-border, rgba(148, 163, 184, 0.16))'
        }}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile Responsive Slide-In Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-In Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-72 max-w-[85vw] h-full p-4 flex flex-col justify-between shadow-2xl z-10 backdrop-blur-2xl border-r"
              style={{
                backgroundColor: isLight ? 'var(--color-sidebar, #ffffff)' : 'var(--color-sidebar, #0B1220)',
                borderColor: 'var(--color-border, rgba(148, 163, 184, 0.2))'
              }}
            >
              {/* Drawer Top Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-black tracking-wider uppercase text-cyan-400">
                  Navigation Menu
                </span>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Close Navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {renderSidebarContent()}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
