import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  Layout,
  AlignLeft,
  Columns,
  Grid
} from 'lucide-react';
import { PRESET_ACCENTS } from '../../theme/epTheme';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setIsThemeModalOpen,
    setIsSwitchAccountModalOpen,
    theme,
    updateTheme
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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

        {/* Center: Portal Badge with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1627] hover:bg-[#121e35] border border-cyan-500/30 text-xs font-semibold text-slate-300 transition-all shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-cyan-400 uppercase tracking-wide">
              {currentUser.role} PORTAL
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300 text-[11px]">{getPortalCode()}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 flex items-center gap-1">
              Switch Portal <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </button>

          {/* Quick Portal Switcher Dropdown */}
          {roleDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => { switchRole('STUDENT'); setRoleDropdownOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentUser.role === 'STUDENT' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Student Portal</span>
                <span className="text-[10px] text-slate-500 font-mono">241-115-211</span>
              </button>
              <button
                onClick={() => { switchRole('TEACHER'); setRoleDropdownOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentUser.role === 'TEACHER' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Teacher Portal</span>
                <span className="text-[10px] text-slate-500 font-mono">FAC-CSE-042</span>
              </button>
              <button
                onClick={() => { switchRole('ADMIN'); setRoleDropdownOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentUser.role === 'ADMIN' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Admin Console</span>
                <span className="text-[10px] text-slate-500 font-mono">REGISTRAR</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Controls Bar */}
        <div className="flex items-center gap-2.5">
          {/* Layout density toggles [F] [T] [=] */}
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
              className="text-[11px] font-bold text-slate-300 hover:text-white pl-1 flex items-center gap-1 border-l border-slate-700/80"
            >
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>Colors</span>
            </button>
          </div>

          {/* Sun / Moon Light Toggle */}
          <button
            onClick={() => updateTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' })}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-xl bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors"
          >
            {theme.mode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User Profile Badge from Screenshot */}
          <div
            onClick={() => setIsSwitchAccountModalOpen(true)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-800 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              {getInitials()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider leading-tight flex items-center gap-0.5">
                <span>{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 text-cyan-400" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
