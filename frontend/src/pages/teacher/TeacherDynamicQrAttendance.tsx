import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'qrcode';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  QrCode,
  Radio,
  Clock,
  RefreshCw,
  Maximize2,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  SlidersHorizontal,
  Minimize2
} from 'lucide-react';

export const TeacherDynamicQrAttendance: React.FC = () => {
  const {
    teacherRoster,
    updateStudentAttendanceStatus,
    qrSession,
    startQrSession,
    stopQrSession
  } = useApp();

  const [courseCode, setCourseCode] = useState('CSE 311');
  const [section, setSection] = useState('Section A');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [sessionToken, setSessionToken] = useState<string>('EP-CSE311-8912');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRosterTab, setShowRosterTab] = useState<'QR' | 'ROSTER'>('QR');

  // Generate dynamic QR image whenever token changes
  useEffect(() => {
    const payload = `EDUPULSE:SESSION:${sessionToken}:SECTION:${section}:TIME:${Date.now()}`;
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('QR code generation failed', err);
    });
  }, [sessionToken, section]);

  // Live countdown timer: regenerates token every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          const newToken = `EP-${courseCode.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
          setSessionToken(newToken);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [courseCode]);

  const refreshSessionImmediately = () => {
    const newToken = `EP-${courseCode.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionToken(newToken);
    setSecondsRemaining(60);
  };

  const presentCount = teacherRoster.filter(s => s.attendanceStatus === 'PRESENT').length;
  const lateCount = teacherRoster.filter(s => s.attendanceStatus === 'LATE').length;
  const absentCount = teacherRoster.filter(s => s.attendanceStatus === 'ABSENT').length;
  const attendanceRate = Math.round(((presentCount + lateCount * 0.5) / teacherRoster.length) * 100);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#090d16] p-6 overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dynamic QR Attendance & Classroom Roster
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rotating security token with anti-proxy geofence and live teacher manual roster fallback
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between QR View & Manual Roster */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setShowRosterTab('QR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showRosterTab === 'QR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Projector QR
            </button>
            <button
              onClick={() => setShowRosterTab('ROSTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showRosterTab === 'ROSTER' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Manual Roster
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Toggle Classroom Fullscreen Projection"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Course Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#111827] border border-slate-800">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Selected Course</label>
          <select
            value={courseCode}
            onChange={e => setCourseCode(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="CSE 311">CSE 311: Database Management Systems</option>
            <option value="CSE 312">CSE 312: Database Systems Lab</option>
            <option value="CSE 419">CSE 419: Distributed Systems</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Classroom Section</label>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Section A">Section A (Room 402)</option>
            <option value="Section B">Section B (Room 505)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Live Check-in Rate</label>
          <p className="mt-1 text-base font-extrabold text-emerald-400">
            {presentCount} / {teacherRoster.length} Checked In ({attendanceRate}%)
          </p>
        </div>

        <div className="flex items-end">
          <button
            onClick={refreshSessionImmediately}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Refresh Token</span>
          </button>
        </div>
      </div>

      {showRosterTab === 'QR' ? (
        /* Projector Big Screen Display */
        <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-b from-[#111e2f] to-[#0b1320] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          {/* Subtle Background Rings */}
          <div className="absolute w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-emerald-500/5 pointer-events-none" />

          {/* Header Info */}
          <div className="space-y-1 mb-6">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              CLASSROOM ATTENDANCE SESSION
            </span>
            <h3 className="text-3xl font-black text-white mt-2">
              {courseCode} • {section}
            </h3>
            <p className="text-xs text-slate-400">
              Scan with your EduPulse Student App to automatically record classroom attendance
            </p>
          </div>

          {/* QR Code Container */}
          <div className="relative p-5 bg-white rounded-3xl shadow-2xl border-4 border-emerald-400/80 mb-6">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Dynamic Attendance QR"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-900 font-bold">
                Generating Dynamic QR...
              </div>
            )}
            <div className="absolute -bottom-3 inset-x-6 bg-slate-900 text-white text-[11px] font-mono py-1 rounded-full text-center border border-slate-700 font-bold shadow-md">
              Session PIN: <span className="text-emerald-400">{sessionToken}</span>
            </div>
          </div>

          {/* Countdown timer & anti-proxy notice */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Token auto-rotates in:</span>
              <span className="font-mono font-black text-emerald-400 text-lg">
                {secondsRemaining}s
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Geofence: Al-Hamra Campus Active • Screenshot protection enabled
            </p>
          </div>
        </div>
      ) : (
        /* Manual Roster Fallback Table */
        <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">Manual Attendance Roster Fallback</h3>
              <p className="text-xs text-slate-400">
                Directly mark attendance for students with battery or camera issues
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  teacherRoster.forEach(s => updateStudentAttendanceStatus(s.studentId, 'PRESENT'));
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs transition-colors"
              >
                Mark All Present
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Student Name & ID</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Overall Attendance</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {teacherRoster.map(s => (
                  <tr key={s.studentId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-white">{s.studentName}</p>
                      <p className="font-mono text-slate-400 text-[11px]">{s.studentId}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-300">
                      Section {s.section}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-mono font-bold ${s.attendanceRate >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {s.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={s.attendanceStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => updateStudentAttendanceStatus(s.studentId, 'PRESENT')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            s.attendanceStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => updateStudentAttendanceStatus(s.studentId, 'LATE')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            s.attendanceStatus === 'LATE'
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => updateStudentAttendanceStatus(s.studentId, 'ABSENT')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            s.attendanceStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
