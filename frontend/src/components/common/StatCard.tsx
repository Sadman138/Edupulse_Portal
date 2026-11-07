import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type StatCardGradientType = 'purple' | 'indigo' | 'emerald' | 'cyan' | 'rose';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
  gradientType?: StatCardGradientType;
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
  gradientType,
  onClick
}) => {
  const { theme } = useApp();
  const isLight = theme?.mode === 'light';

  // Determine gradient identity based on gradientType or fallback colorScheme
  const gType: StatCardGradientType = gradientType || (
    colorScheme === 'purple' ? 'purple' :
    colorScheme === 'emerald' ? 'emerald' :
    colorScheme === 'cyan' ? 'cyan' :
    colorScheme === 'rose' || colorScheme === 'amber' ? 'rose' : 'indigo'
  );

  // Gradient themes matching user specifications:
  // Current SGPA: Purple → Violet gradient, Icon: Purple glow
  // Cumulative CGPA: Blue → Indigo gradient, Icon: Blue glow
  // Overall Attendance: Emerald → Teal gradient, Icon: Emerald glow
  // Enrolled Credits: Cyan → Blue gradient, Icon: Cyan glow
  // Academic Risk Status: Rose → Red gradient, Icon: Red glow
  const gradientConfigs: Record<
    StatCardGradientType,
    {
      gradientBg: string;
      hoverBorderClass: string;
      hoverShadowClass: string;
      topBarClass: string;
      iconBaseClass: string;
      iconHoverClass: string;
      cornerGlowColor: string;
      highlightBadgeClass: string;
    }
  > = {
    purple: {
      gradientBg: isLight
        ? 'linear-gradient(135deg, rgba(243, 232, 255, 0.95) 0%, rgba(233, 213, 255, 0.85) 50%, rgba(216, 180, 254, 0.6) 100%)'
        : 'linear-gradient(135deg, rgba(147, 51, 234, 0.28) 0%, rgba(139, 92, 246, 0.22) 50%, rgba(109, 40, 217, 0.14) 100%)',
      hoverBorderClass: 'hover:border-purple-500/75 focus-visible:border-purple-500/75',
      hoverShadowClass: 'hover:shadow-[0_12px_32px_-4px_rgba(168,85,247,0.38),0_0_15px_rgba(168,85,247,0.2)] focus-visible:shadow-[0_12px_32px_-4px_rgba(168,85,247,0.38),0_0_15px_rgba(168,85,247,0.2)]',
      topBarClass: 'from-purple-500 via-violet-500 to-purple-400',
      iconBaseClass: isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
      iconHoverClass: 'group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(168,85,247,0.65)] group-focus-visible:bg-purple-600 group-focus-visible:text-white group-focus-visible:shadow-[0_0_22px_rgba(168,85,247,0.65)]',
      cornerGlowColor: 'rgba(168, 85, 247, 0.45)',
      highlightBadgeClass: isLight ? 'text-purple-800' : 'text-purple-300'
    },
    indigo: {
      gradientBg: isLight
        ? 'linear-gradient(135deg, rgba(224, 231, 255, 0.95) 0%, rgba(199, 210, 254, 0.85) 50%, rgba(165, 180, 252, 0.6) 100%)'
        : 'linear-gradient(135deg, rgba(37, 99, 235, 0.28) 0%, rgba(79, 70, 229, 0.22) 50%, rgba(67, 56, 202, 0.14) 100%)',
      hoverBorderClass: 'hover:border-indigo-500/75 focus-visible:border-indigo-500/75',
      hoverShadowClass: 'hover:shadow-[0_12px_32px_-4px_rgba(99,102,241,0.38),0_0_15px_rgba(99,102,241,0.2)] focus-visible:shadow-[0_12px_32px_-4px_rgba(99,102,241,0.38),0_0_15px_rgba(99,102,241,0.2)]',
      topBarClass: 'from-blue-500 via-indigo-500 to-blue-400',
      iconBaseClass: isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
      iconHoverClass: 'group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(59,130,246,0.65)] group-focus-visible:bg-blue-600 group-focus-visible:text-white group-focus-visible:shadow-[0_0_22px_rgba(59,130,246,0.65)]',
      cornerGlowColor: 'rgba(99, 102, 241, 0.45)',
      highlightBadgeClass: isLight ? 'text-indigo-800' : 'text-indigo-300'
    },
    emerald: {
      gradientBg: isLight
        ? 'linear-gradient(135deg, rgba(209, 250, 229, 0.95) 0%, rgba(167, 243, 208, 0.85) 50%, rgba(110, 231, 183, 0.6) 100%)'
        : 'linear-gradient(135deg, rgba(5, 150, 105, 0.28) 0%, rgba(13, 148, 136, 0.22) 50%, rgba(16, 185, 129, 0.14) 100%)',
      hoverBorderClass: 'hover:border-emerald-500/75 focus-visible:border-emerald-500/75',
      hoverShadowClass: 'hover:shadow-[0_12px_32px_-4px_rgba(16,185,129,0.38),0_0_15px_rgba(16,185,129,0.2)] focus-visible:shadow-[0_12px_32px_-4px_rgba(16,185,129,0.38),0_0_15px_rgba(16,185,129,0.2)]',
      topBarClass: 'from-emerald-500 via-teal-500 to-emerald-400',
      iconBaseClass: isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
      iconHoverClass: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(16,185,129,0.65)] group-focus-visible:bg-emerald-600 group-focus-visible:text-white group-focus-visible:shadow-[0_0_22px_rgba(16,185,129,0.65)]',
      cornerGlowColor: 'rgba(16, 185, 129, 0.45)',
      highlightBadgeClass: isLight ? 'text-emerald-800' : 'text-emerald-300'
    },
    cyan: {
      gradientBg: isLight
        ? 'linear-gradient(135deg, rgba(207, 250, 254, 0.95) 0%, rgba(165, 243, 252, 0.85) 50%, rgba(103, 232, 249, 0.6) 100%)'
        : 'linear-gradient(135deg, rgba(6, 182, 212, 0.28) 0%, rgba(2, 132, 199, 0.22) 50%, rgba(14, 165, 233, 0.14) 100%)',
      hoverBorderClass: 'hover:border-cyan-500/75 focus-visible:border-cyan-500/75',
      hoverShadowClass: 'hover:shadow-[0_12px_32px_-4px_rgba(6,182,212,0.38),0_0_15px_rgba(6,182,212,0.2)] focus-visible:shadow-[0_12px_32px_-4px_rgba(6,182,212,0.38),0_0_15px_rgba(6,182,212,0.2)]',
      topBarClass: 'from-cyan-400 via-sky-500 to-blue-500',
      iconBaseClass: isLight ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
      iconHoverClass: 'group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(6,182,212,0.65)] group-focus-visible:bg-cyan-600 group-focus-visible:text-white group-focus-visible:shadow-[0_0_22px_rgba(6,182,212,0.65)]',
      cornerGlowColor: 'rgba(6, 182, 212, 0.45)',
      highlightBadgeClass: isLight ? 'text-cyan-800' : 'text-cyan-300'
    },
    rose: {
      gradientBg: isLight
        ? 'linear-gradient(135deg, rgba(255, 228, 230, 0.95) 0%, rgba(254, 205, 211, 0.85) 50%, rgba(253, 164, 175, 0.6) 100%)'
        : 'linear-gradient(135deg, rgba(225, 29, 72, 0.28) 0%, rgba(220, 38, 38, 0.22) 50%, rgba(190, 18, 60, 0.14) 100%)',
      hoverBorderClass: 'hover:border-rose-500/75 focus-visible:border-rose-500/75',
      hoverShadowClass: 'hover:shadow-[0_12px_32px_-4px_rgba(244,63,94,0.38),0_0_15px_rgba(244,63,94,0.2)] focus-visible:shadow-[0_12px_32px_-4px_rgba(244,63,94,0.38),0_0_15px_rgba(244,63,94,0.2)]',
      topBarClass: 'from-rose-500 via-red-500 to-rose-400',
      iconBaseClass: isLight ? 'bg-rose-100 text-rose-700' : 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
      iconHoverClass: 'group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(244,63,94,0.65)] group-focus-visible:bg-rose-600 group-focus-visible:text-white group-focus-visible:shadow-[0_0_22px_rgba(244,63,94,0.65)]',
      cornerGlowColor: 'rgba(244, 63, 94, 0.45)',
      highlightBadgeClass: isLight ? 'text-rose-800' : 'text-rose-300'
    }
  };

  const config = gradientConfigs[gType];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={0}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #172235)',
        borderColor: isLight ? '#e2e8f0' : 'var(--ep-border, rgba(148, 163, 184, 0.16))',
        boxShadow: isLight
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          : '0 4px 12px -2px rgba(0, 0, 0, 0.25)',
        transition: 'all 350ms ease'
      }}
      className={`group stat-card-interactive stat-card-${gType} relative overflow-hidden rounded-3xl border p-5 sm:p-6 lg:p-6 xl:p-7 min-h-[180px] sm:min-h-[195px] flex flex-col justify-between backdrop-blur-md select-none outline-none cursor-pointer ${config.hoverBorderClass} ${config.hoverShadowClass}`}
    >
      {/* 1. Smooth Hover Gradient Overlay Layer (crossfades seamlessly on mouseenter/leave) */}
      <div
        className="pointer-events-none absolute inset-0 stat-card-overlay z-0"
        style={{
          background: config.gradientBg
        }}
      />

      {/* 2. Top Glowing Accent Bar on Hover */}
      <div
        className={`pointer-events-none absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.topBarClass} stat-card-topbar z-10`}
      />

      {/* 3. Ambient Corner Glow */}
      <div
        className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-2xl stat-card-glow z-0"
        style={{
          background: config.cornerGlowColor
        }}
      />

      {/* Card Content (Relative z-10 for perfect contrast) */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              style={{
                color: isLight ? '#475569' : '#94a3b8'
              }}
              className="text-xs sm:text-sm font-bold tracking-wider uppercase leading-snug group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300"
            >
              {title}
            </p>
            {/* Subtle pulse indicator on hover */}
            <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 animate-pulse shrink-0" />
          </div>
          <p
            style={{
              color: isLight ? '#0f172a' : '#f8fafc'
            }}
            className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[40px] font-black tracking-tight leading-none group-hover:scale-[1.02] origin-left transition-transform duration-300"
          >
            {value}
          </p>
        </div>

        {/* 4. Animated Icon Container (Scale 1.1 + slight rotation + vibrant glow on hover) */}
        <div
          className={`stat-card-icon p-3.5 sm:p-4 rounded-2xl shrink-0 ${config.iconBaseClass} ${config.iconHoverClass}`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            borderColor: isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.14)'
          }}
          className="relative z-10 mt-4 flex items-center justify-between text-xs sm:text-sm pt-3 border-t font-semibold group-hover:border-white/10 dark:group-hover:border-white/15 transition-colors duration-350 gap-2"
        >
          {subtitle && (
            <span
              style={{
                color: isLight ? '#475569' : '#94a3b8'
              }}
              className="text-xs sm:text-[13px] leading-tight group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-350 truncate"
            >
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={`font-black text-xs sm:text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md shrink-0 group-hover:scale-105 transition-transform duration-350 ${
                trendPositive
                  ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
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

export default StatCard;
