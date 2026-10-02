import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div
    className={`rounded-2xl border border-[#1d273a] bg-[#101726] p-5 shadow-lg backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
);

export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action
}) => (
  <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="space-y-1">
      <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const Stat: React.FC<{ label: string; value: string | number; hint?: string }> = ({
  label,
  value,
  hint
}) => (
  <div className="rounded-2xl border border-[#1d273a] bg-[#101726] p-4 shadow-md">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-extrabold text-white tabular-nums">{value}</p>
    {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
  </div>
);

export const RiskBadge: React.FC<{ level: 'GREEN' | 'YELLOW' | 'RED' | string }> = ({ level }) => {
  const styles: Record<string, string> = {
    GREEN: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    YELLOW: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    RED: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono tracking-wider ${
        styles[level] || styles.GREEN
      }`}
    >
      {level}
    </span>
  );
};

export const Pill: React.FC<{ kind?: string; children: React.ReactNode }> = ({ kind, children }) => {
  const styles: Record<string, string> = {
    verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase font-mono tracking-wider ${
        (kind && styles[kind]) || 'bg-slate-800 text-slate-300 border-slate-700'
      }`}
    >
      {children}
    </span>
  );
};

export const Bar: React.FC<{ percent: number; level?: string }> = ({ percent, level }) => {
  const barColors: Record<string, string> = {
    GREEN: 'bg-emerald-500',
    YELLOW: 'bg-amber-500',
    RED: 'bg-rose-500',
  };
  return (
    <div className="relative h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          (level && barColors[level]) || 'bg-cyan-500'
        }`}
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      />
    </div>
  );
};

export const inputCls =
  'w-full px-3.5 py-2 rounded-xl bg-[#09111e] border border-[#1d273a] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors';
export const btnPrimary =
  'px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer';
export const btnGhost =
  'px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer';
