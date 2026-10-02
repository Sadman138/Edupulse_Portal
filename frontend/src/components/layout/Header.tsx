import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  KeyRound,
  Palette
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ThemeColor, themePalette } from '../../theme/epTheme';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isDualView?: boolean;
  onToggleDualView?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  themeColor?: ThemeColor;
  onSelectColor?: (color: ThemeColor) => void;
  dock?: 'left' | 'top' | 'right';
  onDockChange?: (dock: 'left' | 'top' | 'right') => void;
  onOpenSwitchAccount?: () => void;
  onOpenAuthModal?: (tab: 'login' | 'register') => void;
  customHex?: string;
  onSelectCustomHex?: (hex: string) => void;
  onOpenThemeCustomizer?: () => void;
  onOpenMilestoneModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isDualView,
  onToggleDualView,
  isDarkMode = true,
  onToggleTheme,
  themeColor = 'cyan',
  onSelectColor,
  dock = 'left',
  onDockChange,
  onOpenSwitchAccount,
  onOpenAuthModal,
  customHex,
  onOpenThemeCustomizer,
  onOpenMilestoneModal
}) => {
  const { currentRole, setCurrentRole, currentUser, isAuthenticated, logout } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickThemes: { id: ThemeColor; color: string; ring: string; name: string }[] = [
    { id: 'cyan', color: 'bg-cyan-500', ring: 'ring-cyan-400', name: 'Cyan' },
    { id: 'emerald', color: 'bg-emerald-500', ring: 'ring-emerald-400', name: 'Emerald' },
    { id: 'blue', color: 'bg-blue-600', ring: 'ring-blue-500', name: 'Blue' },
    { id: 'indigo', color: 'bg-indigo-600', ring: 'ring-indigo-500', name: 'Indigo' },
    { id: 'purple', color: 'bg-purple-600', ring: 'ring-purple-400', name: 'Purple' },
    { id: 'amber', color: 'bg-amber-500', ring: 'ring-amber-400', name: 'Amber' },
    { id: 'rose', color: 'bg-rose-500', ring: 'ring-rose-400', name: 'Rose' }
  ];

  const profile = {
    name:
      currentUser?.name ||
      (currentRole === 'STUDENT'
        ? 'Fathin Sadman'
        : currentRole === 'TEACHER'
        ? 'Dr. Fahim Ahmed'
        : 'Prof. Dr. Mekdad Ajmol'),
    initials:
      currentUser?.avatarInitials ||
      (currentRole === 'STUDENT' ? 'FA' : currentRole === 'TEACHER' ? 'FA' : 'MA'),
    idNumber:
      currentUser?.idNumber ||
      (currentRole === 'STUDENT'
        ? '241-115-211'
        : currentRole === 'TEACHER'
        ? 'FAC-CSE-042'
        : 'ADM-SYS-001'),
    roleTag: currentRole,
    roleColor:
      currentRole === 'STUDENT'
        ? 'text-cyan-600 dark:text-cyan-400'
        : currentRole === 'TEACHER'
        ? 'text-sky-600 dark:text-sky-400'
        : 'text-purple-600 dark:text-purple-400'
  };

  const handleSwitchAccountClick = () => {
    setUserDropdownOpen(false);
    if (onOpenSwitchAccount) {
      onOpenSwitchAccount();
    }
  };

  const handleRegisterClick = () => {
    setUserDropdownOpen(false);
    if (onOpenAuthModal) {
      onOpenAuthModal('register');
    }
  };

  const activeAccentHex =
    themeColor === 'custom' && customHex
      ? customHex
      : themePalette[themeColor]?.primary || '#06b6d4';

  return (
    <header
      className={`h-16 px-4 md:px-6 border-b flex items-center justify-between sticky top-0 z-40 select-none transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#090d16] border-[#1c2436] text-white'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs backdrop-blur-md'
      }`}
    >
      {/* Left: Brand Identity & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {dock !== 'top' && (
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg transition-colors md:hidden cursor-pointer ${
              isDarkMode
                ? 'text-slate-400 hover:text-slate-200 hover:bg-[#161d2f]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/25 ring-1 ring-white/20 text-white"
            style={{ backgroundColor: activeAccentHex }}
          >
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-base font-extrabold tracking-tight leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              EduPulse
            </span>
            <span
              className={`text-[10px] font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              CSE Dept &bull; Metropolitan University
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Strict Portal Role Indicator & Switch Account Trigger */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xs transition-colors ${
            isDarkMode
              ? 'bg-[#101726] border-[#1d273a]'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                currentRole === 'STUDENT'
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : currentRole === 'TEACHER'
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-purple-600 dark:text-purple-400'
              }`}
            >
              {currentRole} PORTAL
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">&bull;</span>

          <span
            className={`text-xs font-mono font-medium hidden sm:inline ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {profile.idNumber}
          </span>

          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">&bull;</span>

          <button
            type="button"
            onClick={handleSwitchAccountClick}
            className={`text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              isDarkMode
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-700 hover:text-slate-900'
            }`}
            title="Switch authenticated account to change portal"
          >
            <span>Switch Portal</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Week 4 Milestone Syllabus Tracker Button */}
        {onOpenMilestoneModal && (
          <button
            type="button"
            onClick={onOpenMilestoneModal}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isDarkMode
                ? 'bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border-cyan-800/80 shadow-xs'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300 shadow-xs'
            }`}
            title="View Week 1 - Week 4 Syllabus Deliverables for Academic Supervisor"
          >
            <span className="material-symbols-outlined text-sm text-cyan-400">task_alt</span>
            <span>Week 4 Milestone</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
        )}
      </div>

      {/* Right: Layout Position, Palette, Theme Toggle & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Navigation Dock Selector: left, top, right */}
        {onDockChange && (
          <div
            className={`hidden lg:flex items-center p-1 rounded-xl border ${
              isDarkMode ? 'bg-[#101726] border-[#1d273a]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {(['left', 'top', 'right'] as const).map((d) => (
              <button
                key={d}
                onClick={() => onDockChange(d)}
                className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  dock === d
                    ? isDarkMode
                      ? 'bg-[#182338] text-cyan-400 font-bold'
                      : 'bg-white shadow-xs text-cyan-600 font-bold'
                    : isDarkMode
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title={`Move sidebar dock to ${d}`}
              >
                <span className="material-symbols-outlined text-base block">
                  {d === 'left' ? 'align_horizontal_left' : d === 'top' ? 'align_vertical_top' : 'align_horizontal_right'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Theme Swatches */}
        {onSelectColor && (
          <div
            className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-xl border ${
              isDarkMode ? 'border-[#1d273a] bg-[#101726]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {quickThemes.slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectColor(t.id)}
                className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${t.color} ${
                  themeColor === t.id
                    ? `ring-2 ring-offset-2 ${t.ring} ${isDarkMode ? 'ring-offset-[#090d16]' : 'ring-offset-white'} scale-110`
                    : 'opacity-40 hover:opacity-100'
                }`}
                title={`${t.name} Theme Accent`}
              />
            ))}

            {/* Customizer Modal Trigger Icon */}
            {onOpenThemeCustomizer && (
              <button
                type="button"
                onClick={onOpenThemeCustomizer}
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ml-1 ${
                  themeColor === 'custom'
                    ? 'text-white'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
                style={themeColor === 'custom' ? { backgroundColor: activeAccentHex } : undefined}
                title="Full Theme & Color Customizer"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Full Palette Customizer Button */}
        {onOpenThemeCustomizer && (
          <button
            type="button"
            onClick={onOpenThemeCustomizer}
            className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:text-white bg-[#101726] border-[#1d273a] hover:bg-[#19243a]'
                : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
            title="Open Color & Theme Customizer"
          >
            <Palette className="w-4 h-4 text-cyan-500" />
            <span className="hidden xl:inline">Colors</span>
          </button>
        )}

        {/* Light / Dark Mode Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#161d2f] border-[#1d273a]'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white shadow-xs'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        )}

        {/* User Profile / Auth Area */}
        <div
          className={`relative pl-2 border-l ${isDarkMode ? 'border-[#1d273a]' : 'border-slate-200'}`}
          ref={dropdownRef}
        >
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-2.5 cursor-pointer group text-left p-1 rounded-xl transition-colors ${
                isDarkMode ? 'hover:bg-[#121a2c]' : 'hover:bg-slate-100'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm ring-1 ring-white/10 shrink-0"
                style={{ backgroundColor: activeAccentHex }}
              >
                {profile.initials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span
                  className={`text-xs font-bold leading-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {profile.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold tracking-wider ${profile.roleColor}`}>
                    {profile.roleTag}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#162035] hover:bg-[#1d2a45] text-cyan-300 border-cyan-500/30'
                    : 'bg-white hover:bg-slate-50 text-cyan-700 border-cyan-300 shadow-xs'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* User Account Dropdown Menu */}
          {userDropdownOpen && isAuthenticated && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl py-2 z-50 text-xs animate-fadeIn ${
                isDarkMode
                  ? 'bg-[#0f1524] border-[#232f48] text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div
                className={`px-4 py-3 border-b ${
                  isDarkMode ? 'border-[#1b253b]' : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div
                  className={`font-bold text-sm ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {currentUser?.name || profile.name}
                </div>
                <div
                  className={`text-[11px] font-mono mt-0.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {currentUser?.email || 'user@metrouni.edu.bd'}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                      currentRole === 'STUDENT'
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                        : currentRole === 'TEACHER'
                        ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30'
                        : 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {currentRole}
                  </span>
                  <span
                    className={`text-[11px] font-mono ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {currentUser?.idNumber || profile.idNumber}
                  </span>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={handleSwitchAccountClick}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2 cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-[#172138]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-cyan-500" />
                  <span>Switch Account Profile</span>
                </button>
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2 cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-[#172138]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-purple-500" />
                  <span>Register Another Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2 cursor-pointer transition-colors border-t mt-1 pt-2 ${
                    isDarkMode
                      ? 'border-[#1a2336] text-rose-300 hover:text-rose-200 hover:bg-rose-500/15'
                      : 'border-slate-100 text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Lock Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
