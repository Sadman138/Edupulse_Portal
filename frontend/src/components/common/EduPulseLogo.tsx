import React from 'react';
import { useApp } from '../../context/AppContext';

interface EduPulseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  animated?: boolean;
}

export const EduPulseLogo: React.FC<EduPulseLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  subtitleText = 'CSE Dept • Metropolitan University',
  className = '',
  animated = true
}) => {
  const { theme } = useApp();
  const isLight = theme?.mode === 'light';
  const accent = theme?.accentColor || '#06b6d4';

  const sizeDimensions = {
    xs: { icon: 28, text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 36, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 44, text: 'text-lg sm:text-xl', sub: 'text-[11px]' },
    lg: { icon: 54, text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { icon: 68, text: 'text-3xl sm:text-4xl', sub: 'text-sm' }
  }[size];

  const dim = sizeDimensions.icon;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Gorgeous Emblem Icon with Gradient, Specular Glow & Animated Pulse Wave */}
      <div
        className="relative shrink-0 group cursor-pointer"
        style={{ width: dim, height: dim }}
      >
        {/* Ambient Outer Halo Glow */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-75 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg"
          style={{
            background: isLight
              ? `radial-gradient(circle, ${accent}30 0%, #3b82f620 60%, transparent 80%)`
              : `radial-gradient(circle, ${accent}60 0%, #6366f140 60%, transparent 80%)`
          }}
        />

        {/* Master SVG Emblem */}
        <svg
          viewBox="0 0 48 48"
          width={dim}
          height={dim}
          className="relative rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Primary Vibrant Gradient */}
            <linearGradient id="epGradBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Inner Shield Background: Dark glossy vs crisp light slate */}
            <linearGradient id="epShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? '#ffffff' : '#0f172a'} />
              <stop offset="100%" stopColor={isLight ? '#e2e8f0' : '#060a14'} />
            </linearGradient>

            {/* Pulse Wave Stroke Gradient: High contrast in both light & dark */}
            <linearGradient id="epPulseStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isLight ? '#0284c7' : '#38bdf8'} />
              <stop offset="50%" stopColor={isLight ? '#0891b2' : '#22d3ee'} />
              <stop offset="100%" stopColor={isLight ? '#7c3aed' : '#c084fc'} />
            </linearGradient>

            {/* Specular Highlight */}
            <linearGradient id="epGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={isLight ? "0.6" : "0.4"} />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity={isLight ? "0.05" : "0.2"} />
            </linearGradient>

            {/* Drop Shadow Filter */}
            <filter id="epNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation={isLight ? "1.2" : "2"} floodColor={isLight ? "#0284c7" : "#38bdf8"} floodOpacity={isLight ? "0.35" : "0.6"} />
            </filter>
          </defs>

          {/* Outer Rounded Container Border */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="14"
            fill="url(#epShieldBg)"
            stroke={isLight ? '#0284c7' : 'url(#epGradBase)'}
            strokeWidth={isLight ? "2" : "1.75"}
          />

          {/* Top Glass Highlight */}
          <rect
            x="3"
            y="3"
            width="42"
            height="21"
            rx="13"
            fill="url(#epGlass)"
          />

          {/* Academic Mortarboard Cap (Top Diamond) */}
          <path
            d="M24 9 L38 16.5 L24 24 L10 16.5 Z"
            fill="url(#epGradBase)"
            opacity="0.95"
          />

          {/* Cap Base Arch & Tassel */}
          <path
            d="M16 19.8 V24.5 C16 27.5 19.5 29.5 24 29.5 C28.5 29.5 32 27.5 32 24.5 V19.8"
            fill="none"
            stroke="url(#epGradBase)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Graduation Tassel with hanging knot */}
          <path
            d="M36 17.5 V26 C36 27 37 27.5 37.5 28.5"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="37.5" cy="29" r="1.3" fill="#f59e0b" />

          {/* Dynamic University Heartbeat / Pulse Wave */}
          <path
            d="M9 36 L16 36 L19 32 L22 41 L26 27 L29 38 L32 36 L39 36"
            fill="none"
            stroke="url(#epPulseStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#epNeonGlow)"
          />

          {/* Center Luminous Beacon / Pulse Node */}
          <circle
            cx="26"
            cy="27"
            r="2"
            fill="#ffffff"
            className={animated ? 'animate-ping' : ''}
            style={{ transformOrigin: '26px 27px', animationDuration: '2s' }}
          />
          <circle
            cx="26"
            cy="27"
            r="2"
            fill={isLight ? '#0284c7' : '#38bdf8'}
          />

          {/* Star Sparkle Top Right Corner */}
          <path
            d="M34 8 L35 11 L38 12 L35 13 L34 16 L33 13 L30 12 L33 11 Z"
            fill="#f59e0b"
            opacity="0.95"
            className={animated ? 'animate-pulse' : ''}
          />
        </svg>
      </div>

      {/* Brand Wordmark Typography */}
      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${sizeDimensions.text}`}
              style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
            >
              Edu
            </span>
            <span
              className={`font-black tracking-tight ${sizeDimensions.text} ${
                isLight
                  ? 'bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent font-black'
                  : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm'
              }`}
            >
              Pulse
            </span>

            {/* Micro Live Status Indicator */}
            <span className="relative flex h-2 w-2 ml-0.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: accent }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: accent }}
              />
            </span>
          </div>

          {showSubtitle && (
            <p
              className={`font-extrabold tracking-wider uppercase mt-1 leading-none ${sizeDimensions.sub}`}
              style={{ color: isLight ? '#475569' : '#94a3b8' }}
            >
              {subtitleText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EduPulseLogo;
