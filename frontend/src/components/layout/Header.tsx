import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EduPulseLogo } from '../common/EduPulseLogo';
import { EDU_PULSE_THEMES, getThemeById } from '../../theme/epTheme';
import {
  Sun,
  Moon,
  Palette,
  AlignLeft,
  Columns,
  Lock,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Check,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    setIsThemeModalOpen,
    setIsSwitchAccountModalOpen,
    theme,
    updateTheme,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useApp();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const activeThemeObj = getThemeById(theme.themeId);

  const getPortalCode = () => {
    if (currentUser.role === 'TEACHER') return currentUser.employeeId || 'FAC-CSE-042';
    if (currentUser.role === 'STUDENT') return currentUser.studentId || '241-115-211';
    return 'REG-ADMIN-01';
  };

  const getInitials = () => {
    return (
      currentUser.name
        .split(' ')
        .filter(n => !n.startsWith('Dr.') && !n.startsWith('Prof.'))
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'FA'
    );
  };

  const isLight = theme.mode === 'light';

  return (
    <header
      className="sticky top-0 z-40 w-full border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 transition-colors duration-300 backdrop-blur-xl"
      style={{
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(8, 13, 25, 0.88)',
        borderColor: isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.16)'
      }}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-5 max-w-[1720px] mx-auto w-full">
        {/* Left Section: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2.5 rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#172235',
              borderColor: isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.2)'
            }}
            title={isMobileNavOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileNavOpen ? (
              <X className="w-5 h-5 text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-cyan-400" />
            )}
          </button>

          {/* Gorgeous EduPulse Brand Logo */}
          <EduPulseLogo size="md" />
        </div>

        {/* Center: Portal Badge - Strictly Locked to Role with Student ID */}
        <div
          className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold shadow-inner backdrop-blur-md"
          style={{
            backgroundColor: isLight ? '#f8fafc' : '#172235',
            borderColor: isLight ? 'rgba(6, 182, 212, 0.3)' : 'rgba(148, 163, 184, 0.2)'
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50" />
          <span className="font-extrabold text-cyan-400 uppercase tracking-wide">
            {currentUser.role} PORTAL
          </span>
          <span className="text-slate-500">•</span>
          <span
            className="font-mono text-xs sm:text-sm font-bold"
            style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
          >
            {getPortalCode()}
          </span>
          <span className="text-slate-500 hidden lg:inline">•</span>
          <span className="hidden lg:inline-flex text-emerald-400 items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role Locked</span>
          </span>
        </div>

        {/* Right Controls Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Layout density toggles [Left Dock] [Top Dock] */}
          <div
            className="hidden xl:flex items-center rounded-xl border p-0.5"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#172235',
              borderColor: isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.16)'
            }}
          >
            <button
              onClick={() => updateTheme({ sidebarPosition: 'left' })}
              title="Sidebar Left Dock"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme.sidebarPosition === 'left'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateTheme({ sidebarPosition: 'top' })}
              title="Top Dock"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme.sidebarPosition === 'top'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 8 Global Premium Theme Swatches + Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-2xl border px-2.5 py-1.5 backdrop-blur-md transition-all shadow-xs"
              style={{
                backgroundColor: isLight ? 'rgba(241, 245, 249, 0.9)' : 'rgba(23, 34, 53, 0.9)',
                borderColor: isLight ? '#cbd5e1' : 'var(--color-border, rgba(148, 163, 184, 0.2))'
              }}
            >
              {/* Desktop 8 Circular Swatches */}
              <div className="hidden lg:flex items-center gap-2">
                {EDU_PULSE_THEMES.map(t => {
                  const isSelected = (theme.themeId || 'midnight-emerald') === t.id;
                  return (
                    <button
                      key={t.id}
                      title={`${t.name} • ${t.tagline}`}
                      onClick={() => updateTheme({ themeId: t.id })}
                      aria-label={`Select ${t.name} theme`}
                      className={`group relative w-5 h-5 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'scale-115 ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-lg'
                          : 'opacity-80 hover:opacity-100 hover:scale-120'
                      }`}
                      style={{
                        background: t.previewGradient,
                        boxShadow: isSelected ? `0 0 14px ${t.glow}` : undefined
                      }}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white stroke-[3] drop-shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile / Tablet Compact Active Theme Indicator */}
              <div className="flex lg:hidden items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full ring-2 ring-white/50 shrink-0"
                  style={{ background: activeThemeObj.previewGradient }}
                />
                <span className="text-xs font-bold hidden sm:inline" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>
                  {activeThemeObj.name.split(' ')[0]}
                </span>
              </div>

              {/* "Themes" Dropdown / Popover Toggle Button */}
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-500 pl-1.5 flex items-center gap-1.5 border-l border-slate-300 dark:border-slate-700/80 cursor-pointer transition-colors"
                title="Switch between 8 Global Color Themes"
              >
                <Palette className="w-3.5 h-3.5" style={{ color: activeThemeObj.primary }} />
                <span
                  className="font-extrabold hidden md:inline"
                  style={{ color: isLight ? '#0f172a' : '#f1f5f9' }}
                >
                  Themes
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Premium Themes Dropdown Popover */}
            {isThemeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border p-3 shadow-2xl z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 select-none"
                style={{
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)',
                  borderColor: isLight ? '#cbd5e1' : 'var(--color-border, rgba(148, 163, 184, 0.25))',
                  boxShadow: `0 20px 40px -10px ${activeThemeObj.glow}`
                }}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: activeThemeObj.primary }} />
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                      8 Global Color Themes
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">Live Switch</span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {EDU_PULSE_THEMES.map(t => {
                    const isSelected = (theme.themeId || 'midnight-emerald') === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          updateTheme({ themeId: t.id });
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? isLight
                              ? 'bg-slate-100 border-slate-400 font-black shadow-xs'
                              : 'bg-white/10 border-white/40 font-black shadow-md'
                            : isLight
                            ? 'border-transparent hover:bg-slate-100 hover:border-slate-300'
                            : 'border-transparent hover:bg-white/5 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center shadow-md ${
                              isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''
                            }`}
                            style={{ background: t.previewGradient }}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {t.name}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {t.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.primary }} title={`Primary: ${t.primary}`} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.secondary }} title={`Secondary: ${t.secondary}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsThemeDropdownOpen(false);
                      setIsThemeModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-cyan-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Palette className="w-3 h-3" />
                    <span>Theme Studio & Appearance</span>
                  </button>
                  <button
                    onClick={() => setIsThemeDropdownOpen(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 font-bold px-2 py-0.5 rounded cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sun / Moon Light Toggle - High Contrast in Light & Dark Mode */}
          <button
            onClick={() => {
              const nextMode = theme.mode === 'dark' ? 'light' : 'dark';
              updateTheme({
                mode: nextMode,
                backgroundId: nextMode === 'light' ? 'soft-slate' : 'midnight'
              });
            }}
            title={theme.mode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
            style={{
              backgroundColor: theme.mode === 'light' ? '#e2e8f0' : '#172235',
              borderColor: theme.mode === 'light' ? '#94a3b8' : 'rgba(148, 163, 184, 0.2)'
            }}
          >
            {theme.mode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-800 dark:text-indigo-400 fill-indigo-800/30" />
            )}
          </button>

          {/* User Profile Badge (Click to view account security & details) */}
          <div
            onClick={() => setIsSwitchAccountModalOpen(true)}
            title="View Account Profile & Role Security"
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-700/60 cursor-pointer group"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-cyan-500/50 group-hover:scale-105 transition-transform shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                {getInitials()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p
                className="text-xs sm:text-sm font-extrabold leading-tight group-hover:text-cyan-400 transition-colors"
                style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
              >
                {currentUser.name}
              </p>
              <p className="text-[11px] sm:text-xs text-cyan-400 font-bold uppercase tracking-wider leading-tight flex items-center gap-1 mt-0.5">
                <span>{currentUser.role}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </p>
            </div>
          </div>

          {/* Direct Log Out Button */}
          <button
            onClick={logout}
            title="Log Out (Switch User)"
            className="p-2 sm:p-2.5 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border transition-colors cursor-pointer"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#172235',
              borderColor: isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.2)'
            }}
          >
            <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
