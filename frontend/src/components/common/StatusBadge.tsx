import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { isDarkMode } = useApp();

  const getStyles = () => {
    const s = status?.toUpperCase();
    if (isDarkMode) {
      switch (s) {
        case 'SAFE':
          return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
        case 'WARNING':
          return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
        case 'CRITICAL':
          return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
        case 'SUBMITTED':
        case 'VERIFIED':
          return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
        case 'PENDING':
          return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
        case 'REJECTED':
          return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
        default:
          return 'bg-slate-500/15 text-slate-300 border-slate-500/40';
      }
    } else {
      // Light Mode: High contrast, saturated, crystal clear and bold
      switch (s) {
        case 'SAFE':
          return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold shadow-2xs';
        case 'WARNING':
          return 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold shadow-2xs';
        case 'CRITICAL':
          return 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold shadow-2xs';
        case 'SUBMITTED':
        case 'VERIFIED':
          return 'bg-sky-100 text-sky-900 border-sky-300 font-extrabold shadow-2xs';
        case 'PENDING':
          return 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold shadow-2xs';
        case 'REJECTED':
          return 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold shadow-2xs';
        default:
          return 'bg-slate-200 text-slate-900 border-slate-300 font-extrabold shadow-2xs';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold border tracking-wider uppercase transition-colors ${getStyles()}`}
    >
      {status}
    </span>
  );
};
