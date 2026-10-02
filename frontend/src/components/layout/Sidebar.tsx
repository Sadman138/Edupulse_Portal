import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  QrCode,
  GraduationCap,
  FileText,
  BookOpen,
  BellRing,
  Calendar,
  CalendarCheck,
  BarChart3,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeColor, themePalette } from '../../theme/epTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  forcedRole?: 'TEACHER' | 'ADMIN';
  dock?: 'left' | 'top' | 'right';
  themeColor?: ThemeColor;
  isDarkMode?: boolean;
  customHex?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  isDanger?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  forcedRole,
  dock = 'left',
  themeColor = 'cyan',
  isDarkMode = true,
  customHex
}) => {
  const { currentRole, activeNav, setActiveNav } = useApp();
  const role = forcedRole || currentRole;

  const getNavItems = (): NavItem[] => {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'class-routine', label: 'Class Routine & Rooms', icon: Calendar },
      { id: 'performance', label: 'Academic Performance', icon: BarChart3 },
      { id: 'attendance', label: 'Attendance Telemetry', icon: ClipboardCheck },
      { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
      { id: 'previous-results', label: 'Previous Results', icon: GraduationCap },
      { id: 'assignments', label: 'Assignments', icon: FileText },
      { id: 'study-materials', label: 'Study Materials', icon: BookOpen },
      { id: 'notices', label: 'Notices', icon: BellRing },
      { id: 'co-curricular', label: 'Co-Curricular', icon: Award },
      {
        id: 'weekly-progress',
        label: 'Week 1-4 Syllabus Tracker',
        icon: CalendarCheck,
        badge: 'W4 Done',
        badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
      }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (onClose) onClose();
  };

  const activeStyles: Record<string, string> = {
    cyan: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30',
    blue: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30',
    indigo: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30',
    purple: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30',
    amber: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30',
    orange: 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-lg shadow-orange-600/30',
    rose: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30',
    teal: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/30',
    slate: 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-700/30'
  };

  const activeClass =
    themeColor === 'custom'
      ? 'text-white shadow-lg'
      : activeStyles[themeColor] || activeStyles.cyan;

  const customActiveStyle =
    themeColor === 'custom' && customHex
      ? { backgroundColor: customHex }
      : undefined;

  // Inactive style based on light vs dark mode
  const inactiveClass = isDarkMode
    ? 'text-slate-400 hover:text-slate-200 hover:bg-[#121927]'
    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-extrabold';

  // Top Dock: Horizontal Navbar Strip
  if (dock === 'top') {
    return (
      <nav
        className={`fixed left-0 right-0 top-16 h-12 z-30 border-b backdrop-blur-xl flex items-center gap-1.5 px-4 overflow-x-auto select-none transition-colors ${
          isDarkMode
            ? 'bg-[#090d16]/95 border-[#1c2436] text-slate-200'
            : 'bg-white/95 border-slate-200 text-slate-800'
        }`}
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={isActive ? customActiveStyle : undefined}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? activeClass
                  : item.isDanger
                  ? 'text-rose-500 hover:text-rose-600 dark:hover:text-rose-200 hover:bg-rose-50 dark:hover:bg-[#191522]'
                  : inactiveClass
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    item.badgeColor || 'bg-violet-500/20 text-violet-600 dark:text-violet-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  // Left or Right Vertical Dock
  const sideBorder =
    dock === 'right'
      ? isDarkMode
        ? 'right-0 border-l border-[#1c2436]'
        : 'right-0 border-l border-slate-200'
      : isDarkMode
      ? 'left-0 border-r border-[#1c2436]'
      : 'left-0 border-r border-slate-200';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-60 ${sideBorder} flex flex-col justify-between p-4 fixed md:static inset-y-0 z-30 transform transition-all duration-200 ease-in-out shrink-0 select-none ${
          isDarkMode ? 'bg-[#090d16] text-slate-200' : 'bg-white text-slate-800 shadow-sm'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div>
          {/* Console Scope Header */}
          <div className="mb-4">
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                isDarkMode
                  ? 'border-[#1b2538] bg-[#101726]'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Console Scope
                </span>
                <span
                  className={`text-xs font-bold capitalize mt-0.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {role.toLowerCase()} Panel
                </span>
              </div>
              <span className="material-symbols-outlined text-base text-slate-400">terminal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={isActive ? customActiveStyle : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? activeClass
                      : item.isDanger
                      ? 'text-rose-500 hover:text-rose-600 dark:hover:text-rose-200 hover:bg-rose-50 dark:hover:bg-[#191522]'
                      : inactiveClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : item.isDanger
                          ? 'text-rose-500'
                          : isDarkMode
                          ? 'text-slate-400'
                          : 'text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.badgeColor || 'bg-violet-500/20 text-violet-600 dark:text-violet-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div
          className={`pt-4 border-t text-[11px] ${
            isDarkMode ? 'border-[#192236] text-slate-500' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between font-mono">
            <span>Spring 2026</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
