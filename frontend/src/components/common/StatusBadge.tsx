import React from 'react';
import { RiskLevel } from '../../types';

interface StatusBadgeProps {
  status?: 'SAFE' | 'WARNING' | 'CRITICAL' | 'PRESENT' | 'ABSENT' | 'LATE' | 'PENDING' | 'SUBMITTED' | 'GRADED' | 'VERIFIED' | 'REJECTED' | 'Active' | 'Probation' | 'Inactive' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  if (!status) return null;

  let badgeColor = 'bg-slate-700/60 text-slate-300 border-slate-600/40';
  let dotColor = 'bg-slate-400';

  const normalized = status.toUpperCase();

  if (normalized === 'SAFE' || normalized === 'PRESENT' || normalized === 'VERIFIED' || normalized === 'GRADED' || normalized === 'ACTIVE') {
    badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400 animate-pulse';
  } else if (normalized === 'WARNING' || normalized === 'LATE' || normalized === 'PENDING' || normalized === 'IMPORTANT') {
    badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (normalized === 'CRITICAL' || normalized === 'ABSENT' || normalized === 'REJECTED' || normalized === 'OVERDUE' || normalized === 'URGENT' || normalized === 'PROBATION') {
    badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500 animate-ping';
  } else if (normalized === 'SUBMITTED') {
    badgeColor = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    dotColor = 'bg-blue-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-semibold',
    lg: 'text-base px-3.5 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${badgeColor} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
