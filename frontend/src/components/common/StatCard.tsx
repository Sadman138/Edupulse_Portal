import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'indigo',
  onClick
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      iconBg: 'bg-indigo-500/20 text-indigo-300'
    },
    emerald: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-300'
    },
    amber: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-300'
    },
    rose: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      iconBg: 'bg-rose-500/20 text-rose-300'
    },
    cyan: {
      bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-300'
    },
    purple: {
      bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-300'
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg ${scheme.bg} ${
        onClick ? 'cursor-pointer hover:border-slate-400/30 hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl border border-white/5 ${scheme.iconBg}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
