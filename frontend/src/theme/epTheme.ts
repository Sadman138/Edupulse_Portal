import React from 'react';

export type ThemeColor =
  | 'cyan'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'amber'
  | 'rose'
  | 'teal'
  | 'orange'
  | 'slate'
  | 'custom';

export interface ThemeDefinition {
  name: string;
  primary: string;
  primaryHover: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  gradient: string;
  ring: string;
}

export const themePalette: Record<string, ThemeDefinition> = {
  cyan: {
    name: 'Cyber Cyan',
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    accentBg: 'bg-cyan-500/15',
    accentText: 'text-cyan-500 dark:text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    gradient: 'from-cyan-500 to-blue-600',
    ring: 'ring-cyan-400'
  },
  emerald: {
    name: 'Emerald Mint',
    primary: '#10b981',
    primaryHover: '#059669',
    accentBg: 'bg-emerald-500/15',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    accentBorder: 'border-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-400'
  },
  blue: {
    name: 'Ocean Blue',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    accentBg: 'bg-blue-500/15',
    accentText: 'text-blue-600 dark:text-blue-400',
    accentBorder: 'border-blue-500/30',
    gradient: 'from-blue-600 to-cyan-600',
    ring: 'ring-blue-500'
  },
  indigo: {
    name: 'Deep Indigo',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    accentBg: 'bg-indigo-500/15',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    accentBorder: 'border-indigo-500/30',
    gradient: 'from-indigo-600 to-violet-600',
    ring: 'ring-indigo-500'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#9333ea',
    primaryHover: '#7e22ce',
    accentBg: 'bg-purple-500/15',
    accentText: 'text-purple-600 dark:text-purple-400',
    accentBorder: 'border-purple-500/30',
    gradient: 'from-purple-600 to-pink-600',
    ring: 'ring-purple-400'
  },
  amber: {
    name: 'Golden Amber',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    accentBg: 'bg-amber-500/15',
    accentText: 'text-amber-600 dark:text-amber-400',
    accentBorder: 'border-amber-500/30',
    gradient: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-400'
  },
  orange: {
    name: 'Vibrant Sunset',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    accentBg: 'bg-orange-500/15',
    accentText: 'text-orange-600 dark:text-orange-400',
    accentBorder: 'border-orange-500/30',
    gradient: 'from-orange-500 to-rose-600',
    ring: 'ring-orange-500'
  },
  rose: {
    name: 'Ruby Rose',
    primary: '#e11d48',
    primaryHover: '#be123c',
    accentBg: 'bg-rose-500/15',
    accentText: 'text-rose-600 dark:text-rose-400',
    accentBorder: 'border-rose-500/30',
    gradient: 'from-rose-500 to-red-600',
    ring: 'ring-rose-400'
  },
  teal: {
    name: 'Nordic Teal',
    primary: '#0d9488',
    primaryHover: '#0f766e',
    accentBg: 'bg-teal-500/15',
    accentText: 'text-teal-600 dark:text-teal-400',
    accentBorder: 'border-teal-500/30',
    gradient: 'from-teal-500 to-emerald-600',
    ring: 'ring-teal-400'
  },
  slate: {
    name: 'Minimal Slate',
    primary: '#475569',
    primaryHover: '#334155',
    accentBg: 'bg-slate-500/15',
    accentText: 'text-slate-700 dark:text-slate-300',
    accentBorder: 'border-slate-500/30',
    gradient: 'from-slate-600 to-zinc-800',
    ring: 'ring-slate-400'
  }
};

export const themeVars = (isDarkMode: boolean, themeColor: ThemeColor, customHex?: string) => {
  let primaryColor = themePalette[themeColor]?.primary || themePalette.cyan.primary;
  if (themeColor === 'custom' && customHex) {
    primaryColor = customHex;
  }

  return {
    '--ep-primary': primaryColor,
    '--ep-bg': isDarkMode ? '#09111e' : '#f8fafc',
    '--ep-card-bg': isDarkMode ? '#101726' : '#ffffff',
    '--ep-border': isDarkMode ? '#1e293b' : '#cbd5e1',
    '--ep-text': isDarkMode ? '#f8fafc' : '#0f172a',
    '--ep-text-muted': isDarkMode ? '#94a3b8' : '#334155'
  } as React.CSSProperties;
};
