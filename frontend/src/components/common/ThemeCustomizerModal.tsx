import React from 'react';
import { useApp } from '../../context/AppContext';
import { PRESET_ACCENTS } from '../../theme/epTheme';
import { X, Moon, Sun, Check, Palette, Layout, Sparkles } from 'lucide-react';

export const ThemeCustomizerModal: React.FC = () => {
  const { isThemeModalOpen, setIsThemeModalOpen, theme, updateTheme } = useApp();

  if (!isThemeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032]">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Portal Theme & Appearance</h3>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Light / Dark Mode */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateTheme({ mode: 'dark' })}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  theme.mode === 'dark'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Theme</span>
              </button>

              <button
                onClick={() => updateTheme({ mode: 'light' })}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  theme.mode === 'light'
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          {/* Accent Color Palette */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Accent Color Palette
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_ACCENTS.map(preset => {
                const isSelected = theme.accentColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    onClick={() => updateTheme({ accentColor: preset.color, accentName: preset.name })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-white ring-2 ring-white/20 bg-slate-800'
                        : 'border-slate-800 hover:border-slate-600 bg-slate-900/50'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Dock Position */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Navigation Dock
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['left', 'top'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => updateTheme({ sidebarPosition: pos })}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    theme.sidebarPosition === pos
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
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
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#162032] flex justify-end">
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
