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
  const { setActiveTab } = useApp();

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
        dark: '#06b6d4', // Vibrant Electric Cyan modules
        light: '#050b14' // Dark midnight background
      }
    }).then(url => {
      setQrImageUrl(url);
    }).catch(err => {
      console.error('QR creation error', err);
    });
  }, [tokenCounter]);

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
      {/* TOP ROW: 4 KPI Metrics Cards matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Courses */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-slate-800/90 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              ASSIGNED COURSES
            </span>
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-3xl font-black text-white tracking-tight">
              2 Core
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              CSE 301 • CSE 303
            </p>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-slate-800/90 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              TOTAL STUDENTS
            </span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-3xl font-black text-white tracking-tight">
              70 Enrolled
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Across Assigned Classes
            </p>
          </div>
        </div>

        {/* Card 3: Average Attendance */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-slate-800/90 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              AVERAGE ATTENDANCE
            </span>
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-black text-white tracking-tight">
              81%
            </p>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              Above 75% institutional requirement
            </p>
          </div>
        </div>

        {/* Card 4: Risk Flagged */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-rose-950/40 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-rose-400/90">
              RISK FLAGGED
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-[#f43f5e] tracking-tight">
              3 Critical
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              2 in warning band
            </p>
          </div>
        </div>
      </div>

      {/* FEATURED CENTER CARD: Active Classroom Lecture Session */}
      <div className="p-6 rounded-3xl bg-[#0c1424] border border-slate-800/90 shadow-2xl space-y-6">
        {/* Top Header Row of the Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Active Classroom Lecture Session
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            Live Session {sessionSeconds}s
          </div>
        </div>

        {/* Session Body (Left QR Box + Right Details & Actions) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left: Electric Cyan QR Box with Dark Background */}
          <div className="flex flex-col items-center shrink-0">
            <div className="p-4 rounded-2xl bg-[#050b14] border-2 border-cyan-500/40 shadow-xl shadow-cyan-950/50">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="Dynamic Session QR"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-cyan-400 font-mono text-xs">
                  Loading QR Code...
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-white mt-3 text-center">
              Dynamic QR Code (2-Min Timer)
            </p>
            <p className="text-[11px] text-slate-400 text-center mt-0.5">
              Time-Extended Anti-Proxy Protection
            </p>
          </div>

          {/* Right: Course Details & Action Buttons */}
          <div className="flex-1 space-y-4 text-left w-full">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
                CSE 303
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Compiler Design & Grammars
              </h3>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Room: <strong>405 (Faculty Building)</strong> • Section A
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Today, <strong>10:30 AM - 12:00 PM</strong> • 32 Enrolled
                </span>
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setActiveTab('teacher-qr')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
              >
                <Tv className="w-4 h-4" />
                <span>Open Projector QR</span>
              </button>

              <button
                onClick={handleAddMoreTime}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+60s More Time</span>
              </button>

              <button
                onClick={handleRotateToken}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-bold text-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rotate Token</span>
              </button>

              <button
                onClick={() => setActiveTab('teacher-manual-attendance')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Manual Attendance Roster</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 3 Action/Feature Cards from Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Class Routine & Master Directory */}
        <div className="p-6 rounded-2xl bg-[#0c1424] border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Class Routine & Master Directory
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                View your personal class routine or toggle to the full campus routine to inspect which room has which department and subject.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('teacher-routine')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors pt-2 text-left"
          >
            <span>Check Routine & Rooms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Manual Roll Call Console */}
        <div className="p-6 rounded-2xl bg-[#0c1424] border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Manual Roll Call Console
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Mark today's attendance per student or run batch check-ins with one click.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('teacher-manual-attendance')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors pt-2 text-left"
          >
            <span>Open Roll Call Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: UGC Best-of-N CT Grading Desk */}
        <div className="p-6 rounded-2xl bg-[#0c1424] border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                UGC Best-of-N CT Grading Desk
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Calculate best 2 of 3 class tests, midterms, and export official PDF grade sheets.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('teacher-assessments')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors pt-2 text-left"
          >
            <span>Open Assessments Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
