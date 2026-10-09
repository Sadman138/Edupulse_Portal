export interface ThemeConfig {
  mode: 'dark' | 'light';
  accentColor: string; // Hex code or tailwind color name
  accentName: string;
  sidebarPosition: 'left' | 'top' | 'right';
  compactDensity: boolean;
}

export const PRESET_ACCENTS = [
  { name: 'University Indigo', color: '#6366f1', textClass: 'text-indigo-400', bgClass: 'bg-indigo-600' },
  { name: 'Royal Purple', color: '#8b5cf6', textClass: 'text-purple-400', bgClass: 'bg-purple-600' },
  { name: 'Emerald Scholar', color: '#10b981', textClass: 'text-emerald-400', bgClass: 'bg-emerald-600' },
  { name: 'Cyan Tech', color: '#06b6d4', textClass: 'text-cyan-400', bgClass: 'bg-cyan-600' },
  { name: 'Ocean Blue', color: '#3b82f6', textClass: 'text-blue-400', bgClass: 'bg-blue-600' },
  { name: 'Amber Alert', color: '#f59e0b', textClass: 'text-amber-400', bgClass: 'bg-amber-600' },
  { name: 'Rose Crimson', color: '#f43f5e', textClass: 'text-rose-400', bgClass: 'bg-rose-600' },
];

export const DEFAULT_THEME: ThemeConfig = {
  mode: 'dark',
  accentColor: '#06b6d4',
  accentName: 'Cyan Tech',
  sidebarPosition: 'left',
  compactDensity: false,
};
