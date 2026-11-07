import React from 'react';
import { useApp } from '../../context/AppContext';
import { EDU_PULSE_THEMES, PRESET_ACCENTS, getThemeById } from '../../theme/epTheme';
import { X, Moon, Sun, Check, Palette, Layout, Sparkles } from 'lucide-react';

export const ThemeCustomizerModal: React.FC = () => {
  const { isThemeModalOpen, setIsThemeModalOpen, theme, updateTheme } = useApp();

  if (!isThemeModalOpen) return null;

  const activeTheme = getThemeById(theme.themeId);
  const isLight = theme.mode === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111827] border-slate-700/80 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#162032] border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5" style={{ color: activeTheme.primary }} />
            <div>
              <h3 className="font-black text-base" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>Portal Theme & Appearance Studio</h3>
              <p className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                8 Global Color Themes • Metropolitan University
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 8 Global Color Themes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-xs font-black uppercase tracking-wider block ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                8 Global Dynamic Themes
              </label>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Live application-wide
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EDU_PULSE_THEMES.map(t => {
                const isSelected = (theme.themeId || 'midnight-emerald') === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateTheme({ themeId: t.id })}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? isLight
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/60 shadow-md scale-[1.02]'
                          : 'border-white/80 ring-2 ring-white/20 bg-white/10 shadow-lg scale-[1.02]'
                        : isLight
                        ? 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 shadow-2xs'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-md relative overflow-hidden border border-white/20"
                      style={{ background: t.previewGradient }}
                    >
                      {isSelected && <Check className="w-5 h-5 text-white stroke-[3] drop-shadow" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-black truncate ${isSelected ? (isLight ? 'text-emerald-950 font-black' : 'text-white') : isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                          {t.name}
                        </p>
                        {isSelected && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {t.tagline}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: t.primary }} title={`Primary: ${t.primary}`} />
                        <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: t.secondary }} title={`Secondary: ${t.secondary}`} />
                        <span className="text-[9px] font-mono text-slate-400 ml-1 uppercase">{t.id.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Light / Dark Mode */}
          <div>
            <label className={`text-xs font-black uppercase tracking-wider block mb-2.5 ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              Theme Mode (Light / Dark)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateTheme({ mode: 'dark' })}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  theme.mode === 'dark'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/40 text-white font-bold'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Theme</span>
              </button>

              <button
                onClick={() => updateTheme({ mode: 'light' })}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  theme.mode === 'light'
                    ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50 text-slate-900 font-black shadow-xs'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          {/* Accent Color Palette */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider block mb-2.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Interactive Accent Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {PRESET_ACCENTS.map(preset => {
                const isSelected = theme.accentColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    onClick={() => updateTheme({ accentColor: preset.color, accentName: preset.name })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? isLight
                          ? 'border-indigo-600 ring-2 ring-indigo-500/40 bg-indigo-50/80 shadow-md scale-105'
                          : 'border-white ring-2 ring-white/30 bg-slate-800/80 shadow-md scale-105'
                        : isLight
                        ? 'border-slate-300 hover:border-slate-400 bg-slate-100'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-md shrink-0"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                    <span className={`text-[10px] font-bold truncate w-full ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Dock Position */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider block mb-2.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Navigation Layout Dock
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['left', 'top'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => updateTheme({ sidebarPosition: pos })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    theme.sidebarPosition === pos
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-900/20 font-bold'
                      : isLight
                      ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layout className="w-4 h-4" />
                  <span>{pos === 'left' ? 'Sidebar (Left)' : 'Top Header Bar'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between transition-colors ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#162032] border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
              Active: <strong>{theme.accentName}</strong>
            </span>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-5 py-2 text-xs font-bold rounded-xl text-white shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: theme.accentColor }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
