import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'qrcode';
import {
  BookOpen,
  Users,
  Calendar,
  AlertTriangle,
  MapPin,
  Clock,
  Maximize2,
  PlusCircle,
  RotateCcw,
  ClipboardCheck,
  FileSpreadsheet,
  ArrowRight,
  Radio,
  FileCheck2,
  Tv
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { setActiveTab, currentUser, theme } = useApp();
  const isLight = theme.mode === 'light';

  // Dynamic QR state matching the screenshot
  const [sessionSeconds, setSessionSeconds] = useState(26);
  const [tokenCounter, setTokenCounter] = useState(1);
  const [qrImageUrl, setQrImageUrl] = useState('');

  // Generate glowing cyan-on-black QR Code matching the screenshot!
  useEffect(() => {
    const payload = `EDUPULSE:CLASSROOM:CSE303:ROOM405:TOKEN-${tokenCounter}-${Date.now()}`;
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      color: {
        dark: theme.accentColor || '#06b6d4',
        light: isLight ? '#ffffff' : '#050b14'
      }
    }).then(url => {
      setQrImageUrl(url);
    }).catch(err => {
      console.error('QR creation error', err);
    });
  }, [tokenCounter, theme.accentColor, isLight]);

  // Countdown timer for live session
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => {
        if (prev <= 1) {
          setTokenCounter(c => c + 1);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddMoreTime = () => {
    setSessionSeconds(prev => prev + 60);
  };

  const handleRotateToken = () => {
    setTokenCounter(c => c + 1);
    setSessionSeconds(60);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Banner with Dynamic Theme Accent */}
      <div
        style={{
          background: isLight
            ? `linear-gradient(135deg, #ffffff 0%, ${theme.accentColor}18 55%, #f1f5f9 100%)`
            : `linear-gradient(135deg, #090d16 0%, ${theme.accentColor}28 55%, #030712 100%)`,
          borderColor: isLight ? `${theme.accentColor}40` : `${theme.accentColor}50`
        }}
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              style={{
                backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                borderColor: `${theme.accentColor}50`
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                className="font-extrabold tracking-wide"
              >
                Metropolitan University • Faculty of CSE
              </span>
            </div>
            <h1
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Welcome back, {currentUser.name}! 👨‍🏫
            </h1>
            <p
              style={{ color: isLight ? '#334155' : '#cbd5e1' }}
              className="text-sm max-w-2xl leading-relaxed font-bold"
            >
              Designation: <strong style={{ color: theme.accentColor }} className="font-extrabold">{currentUser.designation || 'Associate Professor'}</strong> • Room: <strong style={{ color: theme.accentColor }} className="font-extrabold">{currentUser.roomNumber || 'Room 405'}</strong> • Employee ID: <strong style={{ color: theme.accentColor }} className="font-extrabold">{currentUser.employeeId || 'FAC-CSE-042'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('teacher-assessments')}
              style={{ backgroundColor: theme.accentColor }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span className="text-white">Assessments Desk</span>
            </button>
            <button
              onClick={() => setActiveTab('teacher-risk-desk')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span className="text-white">High-Risk Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP ROW: 4 KPI Metrics Cards matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Courses */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
              ASSIGNED COURSES
            </span>
            <BookOpen className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              2 Core
            </p>
            <p className="text-xs font-bold mt-1" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
              CSE 301 • CSE 303
            </p>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
              TOTAL STUDENTS
            </span>
            <Users className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              70 Enrolled
            </p>
            <p className="text-xs font-bold mt-1" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
              Across Assigned Classes
            </p>
          </div>
        </div>

        {/* Card 3: Average Attendance */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
              AVERAGE ATTENDANCE
            </span>
            <Calendar className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              81%
            </p>
            <p className="text-xs font-black mt-1" style={{ color: isLight ? '#047857' : '#34d399' }}>
              Above 75% institutional requirement
            </p>
          </div>
        </div>

        {/* Card 4: Risk Flagged */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#fca5a5' : 'rgba(244, 63, 94, 0.3)'
          }}
          className="p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: isLight ? '#9f1239' : 'rgba(251, 113, 133, 0.9)' }}>
              RISK FLAGGED
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tight" style={{ color: isLight ? '#e11d48' : '#f43f5e' }}>
              3 Critical
            </p>
            <p className="text-xs font-bold mt-1" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
              2 in warning band
            </p>
          </div>
        </div>
      </div>

      {/* FEATURED CENTER CARD: Active Classroom Lecture Session */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
          borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="p-6 rounded-3xl border shadow-2xl space-y-6 transition-colors"
      >
        {/* Top Header Row of the Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
            <span className="text-sm font-black tracking-wide" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              Active Classroom Lecture Session
            </span>
          </div>

          <div className={`px-3 py-1 rounded-full border text-xs font-black font-mono ${
            isLight
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-2xs'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            Live Session {sessionSeconds}s
          </div>
        </div>

        {/* Session Body (Left QR Box + Right Details & Actions) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left: Electric Cyan QR Box with Dynamic Background */}
          <div className="flex flex-col items-center shrink-0">
            <div
              style={{
                backgroundColor: isLight ? '#f8fafc' : '#050b14',
                borderColor: isLight ? '#38bdf8' : 'rgba(6, 182, 212, 0.4)'
              }}
              className="p-4 rounded-2xl border-2 shadow-xl"
            >
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="Dynamic Session QR"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-cyan-500 font-mono text-xs">
                  Loading QR Code...
                </div>
              )}
            </div>
            <p className="text-xs font-black mt-3 text-center" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              Dynamic QR Code (2-Min Timer)
            </p>
            <p className="text-[11px] font-bold text-center mt-0.5" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
              Time-Extended Anti-Proxy Protection
            </p>
          </div>

          {/* Right: Course Details & Action Buttons */}
          <div className="flex-1 space-y-4 text-left w-full">
            <div className="space-y-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-md font-mono text-xs font-black ${
                isLight ? 'bg-cyan-100 text-cyan-950 border border-cyan-300' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                CSE 303
              </span>
              <h3 className="text-2xl font-black tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                Compiler Design & Grammars
              </h3>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="flex items-center gap-2" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>
                  Room: <strong className="font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>405 (Faculty Building)</strong> • Section A
                </span>
              </p>
              <p className="flex items-center gap-2" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>
                  Today, <strong className="font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>10:30 AM - 12:00 PM</strong> • 32 Enrolled
                </span>
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setActiveTab('teacher-qr')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 !text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Tv className="w-4 h-4 text-white" />
                <span className="text-white">Open Projector QR</span>
              </button>

              <button
                onClick={handleAddMoreTime}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border font-black text-xs transition-colors cursor-pointer ${
                  isLight
                    ? 'border-amber-400 bg-amber-50 text-amber-950 hover:bg-amber-100 shadow-2xs'
                    : 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>+60s More Time</span>
              </button>

              <button
                onClick={handleRotateToken}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-2xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rotate Token</span>
              </button>

              <button
                onClick={() => setActiveTab('teacher-manual-attendance')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 !text-white font-black text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-white" />
                <span className="text-white">Manual Attendance Roster</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 3 Action/Feature Cards from Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Class Routine & Master Directory */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-lg"
        >
          <div className="space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-cyan-100 text-cyan-900 border-cyan-300' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-base" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                Class Routine & Master Directory
              </h4>
              <p className="text-xs leading-relaxed mt-1 font-semibold" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                View your personal class routine or toggle to the full campus routine to inspect which room has which department and subject.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('teacher-routine')}
            className="text-xs font-black text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1.5 transition-colors pt-2 text-left cursor-pointer"
          >
            <span>Check Routine & Rooms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Manual Roll Call Console */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-lg"
        >
          <div className="space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-blue-500/15 text-blue-400 border-blue-500/20'
            }`}>
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-base" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                Manual Roll Call Console
              </h4>
              <p className="text-xs leading-relaxed mt-1 font-semibold" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                Mark today's attendance per student or run batch check-ins with one click.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('teacher-manual-attendance')}
            className="text-xs font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors pt-2 text-left cursor-pointer"
          >
            <span>Open Roll Call Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: UGC Best-of-N CT Grading Desk */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0c1424)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-lg"
        >
          <div className="space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-purple-500/15 text-purple-400 border-purple-500/20'
            }`}>
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-base" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                UGC Best-of-N CT Grading Desk
              </h4>
              <p className="text-xs leading-relaxed mt-1 font-semibold" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                Calculate best 2 of 3 class tests, midterms, and export official PDF grade sheets.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('teacher-assessments')}
            className="text-xs font-black text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1.5 transition-colors pt-2 text-left cursor-pointer"
          >
            <span>Open Assessment Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
