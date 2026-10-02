import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Check,
  X,
  Sparkles,
  Eye,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { ThemeColor, themePalette } from '../../theme/epTheme';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  themeColor: ThemeColor;
  onSelectColor: (color: ThemeColor) => void;
  customHex?: string;
  onSelectCustomHex?: (hex: string) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleTheme,
  themeColor,
  onSelectColor,
  customHex = '#06b6d4',
  onSelectCustomHex
}) => {
  const [localHex, setLocalHex] = useState(customHex);

  if (!isOpen) return null;

  const handleCustomHexChange = (hex: string) => {
    setLocalHex(hex);
    if (onSelectCustomHex) {
      onSelectCustomHex(hex);
    }
    onSelectColor('custom');
  };

  const activeColorHex =
    themeColor === 'custom'
      ? localHex
      : themePalette[themeColor]?.primary || '#06b6d4';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border transition-all ${
          isDarkMode
            ? 'bg-[#0f172a] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-5 border-inherit">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md text-white"
              style={{ backgroundColor: activeColorHex }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Theme & Color Customizer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize your workspace palette, contrast, and visual mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Light / Dark Mode Toggle Section */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Appearance Mode (Light / Dark)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (isDarkMode) onToggleTheme();
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs cursor-pointer transition-all ${
                  !isDarkMode
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm ring-2 ring-amber-400/40'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className={`w-4 h-4 ${!isDarkMode ? 'text-amber-500' : ''}`} />
                <span>Light Mode (Clean & Crisp)</span>
                {!isDarkMode && <Check className="w-4 h-4 text-amber-500 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isDarkMode) onToggleTheme();
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs cursor-pointer transition-all ${
                  isDarkMode
                    ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-sm ring-2 ring-indigo-400/40'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : ''}`} />
                <span>Dark Mode (High Contrast)</span>
                {isDarkMode && <Check className="w-4 h-4 text-indigo-400 ml-1" />}
              </button>
            </div>
          </div>

          {/* Preset Palettes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Preset Color Palettes
              </span>
              <span className="text-[11px] text-slate-400 font-medium">10 Verified Accents</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {Object.entries(themePalette).map(([key, item]) => {
                const isSelected = themeColor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectColor(key as ThemeColor)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 dark:border-white ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-102 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-xl shadow-inner flex items-center justify-center text-white"
                      style={{ backgroundColor: item.primary }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="text-[11px] font-bold truncate max-w-full">
                      {item.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Custom Color Picker */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Custom Hex Color Picker
                </span>
              </div>
              {themeColor === 'custom' && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  Custom Active
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={localHex}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 shrink-0"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={localHex}
                  onChange={(e) => handleCustomHexChange(e.target.value)}
                  placeholder="#06b6d4"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                  style={{ borderColor: activeColorHex }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleCustomHexChange('#06b6d4')}
                className="p-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset to default cyan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Live Preview Sample */}
          <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Live UI Component Preview</span>
              </span>
              <span>{isDarkMode ? 'Dark Theme' : 'Light Theme'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                style={{ backgroundColor: activeColorHex }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Button</span>
              </button>

              <span
                className="px-3 py-1.5 rounded-xl font-bold text-xs border"
                style={{
                  color: activeColorHex,
                  backgroundColor: `${activeColorHex}15`,
                  borderColor: `${activeColorHex}40`
                }}
              >
                Accent Badge (100% Crisp)
              </span>

              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Headline Text
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Muted Paragraph
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-inherit flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
