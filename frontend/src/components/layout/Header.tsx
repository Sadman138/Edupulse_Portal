import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Sun,
  Moon,
  Palette,
  AlignLeft,
  Columns,
  Lock,
  LogOut,
  ShieldCheck,
  User
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    setIsThemeModalOpen,
    setIsSwitchAccountModalOpen,
    theme,
    updateTheme
  } = useApp();

  const getPortalCode = () => {
    if (currentUser.role === 'TEACHER') return currentUser.employeeId || 'FAC-CSE-042';
    if (currentUser.role === 'STUDENT') return currentUser.studentId || '241-115-211';
    return 'REG-ADMIN-01';
  };

  const getInitials = () => {
    return currentUser.name
      .split(' ')
      .filter(n => !n.startsWith('Dr.') && !n.startsWith('Prof.'))
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'FA';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d1a] border-b border-slate-800/90 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: EduPulse Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight leading-none">
                EduPulse
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
              CSE Dept • Metropolitan University
            </p>
          </div>
        </div>

        {/* Center: Portal Badge - Strictly Locked to Role */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1627] border border-cyan-500/30 text-xs font-semibold text-slate-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-cyan-400 uppercase tracking-wide">
            {currentUser.role} PORTAL
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-300 text-[11px]">{getPortalCode()}</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline-flex text-emerald-400 items-center gap-1 text-[11px] font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Role Locked</span>
          </span>
        </div>

        {/* Right Controls Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Layout density toggles [F] [T] */}
          <div className="hidden lg:flex items-center bg-[#0d1627] rounded-xl border border-slate-800 p-0.5">
            <button
              onClick={() => updateTheme({ sidebarPosition: 'left' })}
              title="Sidebar Left Dock"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                theme.sidebarPosition === 'left' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateTheme({ sidebarPosition: 'top' })}
              title="Top Dock"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                theme.sidebarPosition === 'top' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Palettes Dots + "Colors" button */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0d1627] rounded-xl border border-slate-800 px-2 py-1">
            <div className="flex items-center gap-1">
              {['#06b6d4', '#10b981', '#3b82f6', '#8b5cf6'].map(col => (
                <button
                  key={col}
                  onClick={() => updateTheme({ accentColor: col })}
                  className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${
                    theme.accentColor === col ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-110' : ''
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="text-[11px] font-bold text-slate-300 hover:text-white pl-1 flex items-center gap-1 border-l border-slate-700/80 cursor-pointer"
            >
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>Colors</span>
            </button>
          </div>

          {/* Sun / Moon Light Toggle */}
          <button
            onClick={() => updateTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' })}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-xl bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
          >
            {theme.mode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User Profile Badge (Click to view account security & details) */}
          <div
            onClick={() => setIsSwitchAccountModalOpen(true)}
            title="View Account Profile & Role Security"
            className="flex items-center gap-2.5 pl-2 border-l border-slate-800 cursor-pointer group"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-cyan-500/50 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                {getInitials()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider leading-tight flex items-center gap-1">
                <span>{currentUser.role}</span>
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
              </p>
            </div>
          </div>

          {/* Direct Log Out Button */}
          <button
            onClick={logout}
            title="Log Out (Switch User)"
            className="p-2 rounded-xl bg-[#0d1627] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
