import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  isDarkMode?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'text-cyan-500 dark:text-[#6cd3f7]',
  isDarkMode: propIsDarkMode
}) => {
  const { isDarkMode: contextIsDarkMode } = useApp();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
        isDarkMode
          ? 'bg-[#101726] border-[#1d273a] shadow-md text-white'
          : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 text-slate-900'
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`font-sans text-[11px] uppercase tracking-wider font-extrabold ${
            isDarkMode ? 'text-slate-400' : 'text-slate-800'
          }`}
        >
          {title}
        </span>
        {icon && (
          <span className={`material-symbols-outlined ${iconColor} text-xl shrink-0 font-bold`}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <span
          className={`font-sans text-3xl font-black tracking-tight tabular-nums ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          {value}
        </span>
        {subtitle && (
          <div
            className={`mt-1 font-sans text-xs flex items-center justify-between font-bold ${
              isDarkMode ? 'text-slate-400' : 'text-slate-700'
            }`}
          >
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};
