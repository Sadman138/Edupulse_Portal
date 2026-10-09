import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Radio,
  MapPin,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const StudentQrScanner: React.FC = () => {
  const { studentCourses, recordQrAttendance } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(studentCourses[0].courseCode);
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(true);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulatedScan = () => {
    const randomToken = `EP-${selectedCourse.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const result = recordQrAttendance(selectedCourse, randomToken);
    setFeedback(result);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    const result = recordQrAttendance(selectedCourse, manualToken);
    setFeedback(result);
    setManualToken('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time Dynamic Session Gateway</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          QR Attendance Scanner
        </h2>
        <p className="text-xs text-slate-400">
          Hold your device camera steadily towards the teacher's projected classroom screen
        </p>
      </div>

      {/* Select active classroom course */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="text-xs font-bold text-slate-300 block">Classroom Course Target:</label>
          <p className="text-[11px] text-slate-500">Confirm the lecture you are attending</p>
        </div>
        <select
          value={selectedCourse}
          onChange={e => {
            setSelectedCourse(e.target.value);
            setFeedback(null);
          }}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {studentCourses.map(c => (
            <option key={c.courseId} value={c.courseCode}>
              {c.courseCode} — {c.courseTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Camera Viewfinder Simulation */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-950 p-6 flex flex-col items-center justify-center min-h-[340px] shadow-2xl">
        {/* Animated laser beam */}
        <div className="absolute inset-x-8 top-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse blur-xs" />

        {/* Viewfinder crosshairs */}
        <div className="relative w-64 h-64 border-2 border-indigo-500/40 rounded-3xl flex flex-col items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          {/* Corner borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl" />

          <Camera className="w-12 h-12 text-indigo-400/60 animate-pulse mb-3" />
          <p className="text-xs font-semibold text-slate-300 text-center">
            Point camera at dynamic QR
          </p>
          <span className="text-[10px] text-slate-500 mt-1">Geo-fence: Al-Hamra Campus (Match)</span>

          <button
            onClick={handleSimulatedScan}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Simulate Quick Scan</span>
          </button>
        </div>

        {/* Dynamic Countdown */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dynamic Session Token Auto-Refreshes in:</span>
          <span className="font-mono font-bold text-indigo-300">{countdown}s</span>
        </div>
      </div>

      {/* Result Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 animate-in fade-in duration-200 ${
            feedback.success
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="text-xs">
            <h4 className="font-bold">{feedback.success ? 'Attendance Recorded!' : 'Check-In Error'}</h4>
            <p className="mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Manual Attendance Token Fallback */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="font-bold text-white text-sm">Manual Session Code Fallback</h4>
            <p className="text-xs text-slate-400">If camera is disabled or blurred, enter the 6-digit session pin displayed on projector</p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. EP-CSE311-9821"
            value={manualToken}
            onChange={e => setManualToken(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            Submit Token
          </button>
        </form>
      </div>
    </div>
  );
};
