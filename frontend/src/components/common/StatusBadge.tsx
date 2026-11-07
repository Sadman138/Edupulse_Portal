import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status?: 'SAFE' | 'WARNING' | 'CRITICAL' | 'PRESENT' | 'ABSENT' | 'LATE' | 'PENDING' | 'SUBMITTED' | 'GRADED' | 'VERIFIED' | 'REJECTED' | 'Active' | 'Probation' | 'Inactive' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const { theme } = useApp();
  const isLight = theme?.mode === 'light';

  if (!status) return null;

  const normalized = status.toUpperCase();

  let badgeColor = isLight
    ? 'bg-slate-100 text-slate-800 border-slate-300 font-bold shadow-2xs'
    : 'bg-slate-700/60 text-slate-300 border-slate-600/40 font-semibold';
  let dotColor = isLight ? 'bg-slate-600' : 'bg-slate-400';

  let inlineStyle: React.CSSProperties = {};
  if (isLight) {
    if (normalized === 'SAFE' || normalized === 'PRESENT' || normalized === 'VERIFIED' || normalized === 'GRADED' || normalized === 'ACTIVE') {
      badgeColor = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-black shadow-2xs';
      dotColor = 'bg-emerald-600 animate-pulse';
      inlineStyle = { color: '#064e3b', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' };
    } else if (normalized === 'WARNING' || normalized === 'LATE' || normalized === 'PENDING' || normalized === 'IMPORTANT') {
      badgeColor = 'bg-amber-50 text-amber-950 border-amber-300 font-black shadow-2xs';
      dotColor = 'bg-amber-600';
      inlineStyle = { color: '#78350f', backgroundColor: '#fffbeb', borderColor: '#fde68a' };
    } else if (normalized === 'CRITICAL' || normalized === 'ABSENT' || normalized === 'REJECTED' || normalized === 'OVERDUE' || normalized === 'URGENT' || normalized === 'PROBATION') {
      badgeColor = 'bg-rose-50 text-rose-950 border-rose-300 font-black shadow-2xs';
      dotColor = 'bg-rose-600 animate-ping';
      inlineStyle = { color: '#881337', backgroundColor: '#fff1f2', borderColor: '#fecdd3' };
    } else if (normalized === 'SUBMITTED') {
      badgeColor = 'bg-blue-50 text-blue-950 border-blue-300 font-black shadow-2xs';
      dotColor = 'bg-blue-600';
      inlineStyle = { color: '#1e3a8a', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' };
    } else {
      inlineStyle = { color: '#0f172a', backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' };
    }
  } else {
    if (normalized === 'SAFE' || normalized === 'PRESENT' || normalized === 'VERIFIED' || normalized === 'GRADED' || normalized === 'ACTIVE') {
      badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold';
      dotColor = 'bg-emerald-400 animate-pulse';
    } else if (normalized === 'WARNING' || normalized === 'LATE' || normalized === 'PENDING' || normalized === 'IMPORTANT') {
      badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold';
      dotColor = 'bg-amber-400';
    } else if (normalized === 'CRITICAL' || normalized === 'ABSENT' || normalized === 'REJECTED' || normalized === 'OVERDUE' || normalized === 'URGENT' || normalized === 'PROBATION') {
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold';
      dotColor = 'bg-rose-500 animate-ping';
    } else if (normalized === 'SUBMITTED') {
      badgeColor = 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold';
      dotColor = 'bg-blue-400';
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-3.5 py-1.5'
  };

  return (
    <span
      style={inlineStyle}
      className={`inline-flex items-center gap-1.5 rounded-full border ${badgeColor} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="leading-tight font-black">{status}</span>
    </span>
  );
};
