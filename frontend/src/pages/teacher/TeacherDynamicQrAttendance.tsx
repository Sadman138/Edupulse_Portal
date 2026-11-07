import React, { useState, useEffect } from 'react';
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
  Play,
  Square,
  Minimize2
} from 'lucide-react';

export const TeacherDynamicQrAttendance: React.FC = () => {
  const {
    teacherRoster,
    updateStudentAttendanceStatus,
    qrSession,
    startQrSession,
    stopQrSession,
    theme
  } = useApp();

  const isLight = theme.mode === 'light';

  const [courseCode, setCourseCode] = useState('CSE 311');
  const [section, setSection] = useState('Section A');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRosterTab, setShowRosterTab] = useState<'QR' | 'ROSTER'>('QR');

  // Track 5-minute session countdown based on qrSession
  useEffect(() => {
    if (!qrSession || !qrSession.isActive) {
      setSecondsRemaining(0);
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - (qrSession.createdTimestamp || Date.now())) / 1000);
      const remaining = Math.max(0, (qrSession.expiresInSeconds || 300) - elapsed);
      setSecondsRemaining(remaining);
      if (remaining <= 0 && qrSession.isActive) {
        stopQrSession();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [qrSession]);

  // Generate QR code for the active session payload
  useEffect(() => {
    if (!qrSession || !qrSession.isActive) {
      setQrDataUrl('');
      return;
    }

    QRCode.toDataURL(qrSession.qrPayload, {
      width: 340,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff'
      }
    })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('QR code generation failed', err);
      });
  }, [qrSession?.qrPayload, qrSession?.isActive]);

  const handleStartSession = () => {
    startQrSession(courseCode, section, 300); // exactly 5 minutes (300 seconds)
  };

  const handleStopSession = () => {
    stopQrSession();
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const presentCount = teacherRoster.filter(s => s.attendanceStatus === 'PRESENT').length;
  const lateCount = teacherRoster.filter(s => s.attendanceStatus === 'LATE').length;
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
            <h2
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-xl sm:text-2xl font-black tracking-tight"
            >
              5-Minute Dynamic QR Attendance Generator
            </h2>
          </div>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold mt-0.5">
            Teacher attendance console with 5-minute strict countdown, real-time check-in feed, and manual roster fallback
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between QR View & Manual Roster */}
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card-sub, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="flex p-1 rounded-xl border shadow-sm"
          >
            <button
              onClick={() => setShowRosterTab('QR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                showRosterTab === 'QR' ? '!text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              style={showRosterTab === 'QR' ? { backgroundColor: theme.accentColor } : {}}
            >
              Projector QR
            </button>
            <button
              onClick={() => setShowRosterTab('ROSTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                showRosterTab === 'ROSTER' ? '!text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              style={showRosterTab === 'ROSTER' ? { backgroundColor: theme.accentColor } : {}}
            >
              Manual Roster
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Toggle Classroom Fullscreen Projection"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Course Controls Bar */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0d1627)',
          borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 p-4 rounded-2xl border shadow-xl transition-colors"
      >
        <div>
          <label className="text-[11px] font-black uppercase" style={{ color: isLight ? '#334155' : '#94a3b8' }}>Assigned Course</label>
          <select
            value={courseCode}
            onChange={e => setCourseCode(e.target.value)}
            disabled={qrSession?.isActive}
            className={`w-full mt-1 rounded-xl px-3 py-2 text-xs font-black focus:outline-none transition-colors ${
              isLight
                ? 'bg-slate-50 border-2 border-slate-300 text-slate-900 shadow-2xs focus:border-indigo-600 focus:bg-white'
                : 'bg-slate-900 border border-slate-700 text-white'
            }`}
          >
            <option value="CSE 311">CSE 311: Database Management Systems</option>
            <option value="CSE 313">CSE 313: Compiler Design</option>
            <option value="CSE 315">CSE 315: Computer Networks</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-black uppercase" style={{ color: isLight ? '#334155' : '#94a3b8' }}>Classroom Section</label>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            disabled={qrSession?.isActive}
            className={`w-full mt-1 rounded-xl px-3 py-2 text-xs font-black focus:outline-none transition-colors ${
              isLight
                ? 'bg-slate-50 border-2 border-slate-300 text-slate-900 shadow-2xs focus:border-indigo-600 focus:bg-white'
                : 'bg-slate-900 border border-slate-700 text-white'
            }`}
          >
            <option value="Section A">Section A (Academic Block 3 - Room 402)</option>
            <option value="Section B">Section B (Academic Block 3 - Lab 301)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-black uppercase" style={{ color: isLight ? '#334155' : '#94a3b8' }}>Real-Time Attendance</label>
          <p className="mt-1.5 text-base font-black font-mono" style={{ color: isLight ? '#047857' : '#34d399' }}>
            {presentCount} / {teacherRoster.length} Checked In ({attendanceRate}%)
          </p>
        </div>

        <div className="flex items-end">
          {qrSession?.isActive ? (
            <button
              onClick={handleStopSession}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 !text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Square className="w-4 h-4 fill-white text-white" />
              <span className="text-white">Close Session Manually</span>
            </button>
          ) : (
            <button
              onClick={handleStartSession}
              style={{ backgroundColor: theme.accentColor }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl !text-white text-xs font-black shadow-lg transition-all cursor-pointer active:scale-95 hover:brightness-110"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span className="text-white">Start 5-Min Attendance</span>
            </button>
          )}
        </div>
      </div>

      {showRosterTab === 'QR' ? (
        /* Projector Big Screen Display */
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0d1627)',
            borderColor: qrSession?.isActive ? theme.accentColor : (isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))')
          }}
          className="rounded-3xl border-2 p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden transition-colors"
        >
          {/* Subtle Background Rings */}
          <div className="absolute w-96 h-96 rounded-full border border-cyan-500/10 pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/5 pointer-events-none" />

          {/* Header Info */}
          <div className="space-y-1 mb-6">
            <span
              style={{
                backgroundColor: isLight ? `${theme.accentColor}18` : `${theme.accentColor}25`,
                color: isLight ? '#0369a1' : theme.accentColor,
                borderColor: isLight ? '#93c5fd' : 'rgba(6, 182, 212, 0.3)'
              }}
              className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border"
            >
              DYNAMIC CLASSROOM ATTENDANCE SESSION
            </span>
            <h3
              style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
              className="text-2xl sm:text-3xl font-black mt-2"
            >
              {courseCode} • {section}
            </h3>
            <p style={{ color: isLight ? '#334155' : 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-bold">
              Students must scan with EduPulse Student Portal before the 5-minute timer expires
            </p>
          </div>

          {/* QR Code Container or Inactive Session Notice */}
          {qrSession?.isActive && qrDataUrl ? (
            <div className="relative p-5 bg-white rounded-3xl shadow-2xl border-4 border-emerald-500 mb-6">
              <img
                src={qrDataUrl}
                alt="Dynamic Attendance QR"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
              />
              <div className="absolute -bottom-3 inset-x-6 bg-slate-900 text-white text-[11px] font-mono py-1 rounded-full text-center border border-slate-700 font-bold shadow-md">
                Session ID: <span className="text-emerald-400 font-black">{qrSession.sessionId}</span>
              </div>
            </div>
          ) : (
            <div className={`w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center mb-6 ${
              isLight ? 'bg-slate-50 border-slate-300 shadow-inner' : 'border-slate-700 bg-slate-900/40'
            }`}>
              <QrCode className={`w-12 h-12 mb-2 ${isLight ? 'text-slate-600' : 'text-slate-500'}`} />
              <p
                style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                className="font-black text-sm"
              >
                {secondsRemaining === 0 && !qrSession ? 'QR Code Expired' : 'No Active Session'}
              </p>
              <p style={{ color: isLight ? '#334155' : 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs mt-1 font-bold">
                Click "Start 5-Min Attendance" above to generate a new secure session code.
              </p>
            </div>
          )}

          {/* Countdown timer & anti-proxy notice */}
          <div className="space-y-2">
            <div
              className="flex items-center justify-center gap-2 text-sm"
              style={{ color: isLight ? '#0f172a' : '#cbd5e1' }}
            >
              <Clock className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
              <span className="font-black">Session Expiration Countdown:</span>
              <span
                className={`font-mono font-black text-xl px-3.5 py-1 rounded-xl border ${
                  secondsRemaining <= 60
                    ? isLight
                      ? 'bg-rose-100 text-rose-950 border-rose-300 font-black shadow-xs'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : isLight
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-black shadow-xs'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {timeFormatted}
              </span>
            </div>
            <p className={isLight ? 'text-xs text-slate-700 font-bold' : 'text-[11px] text-slate-500'}>
              Strict 5-minute window enforced. Expired sessions automatically reject check-ins.
            </p>
          </div>

          {/* Real-time Submissions Stream */}
          <div
            className="w-full max-w-xl mt-8 pt-6 border-t text-left"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(51, 65, 85, 0.7)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4
                style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                className="font-black text-xs uppercase tracking-wider"
              >
                Live Scanned Students ({presentCount})
              </h4>
              <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                Auto-updating
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {teacherRoster
                .filter(s => s.attendanceStatus === 'PRESENT')
                .map(s => (
                  <div
                    key={s.studentId}
                    style={{
                      backgroundColor: isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.8)',
                      borderColor: isLight ? '#cbd5e1' : '#1e293b'
                    }}
                    className="p-3.5 rounded-xl border flex items-center justify-between text-xs shadow-xs scanned-student-box"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} style={isLight ? { color: '#047857' } : {}} />
                      <span
                        data-student-name="true"
                        className="scanned-student-name font-black text-sm"
                        style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                      >
                        {s.studentName}
                      </span>
                      <span
                        data-student-id="true"
                        className="scanned-student-id font-mono text-xs font-black"
                        style={{ color: isLight ? '#312e81' : 'var(--ep-accent-secondary, #818cf8)' }}
                      >
                        ({s.studentId})
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-mono font-bold"
                      style={{ color: isLight ? '#1e293b' : '#94a3b8' }}
                    >
                      {s.checkInTime || 'Just now'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* Manual Roster Fallback Table */
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #0d1627)',
            borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="rounded-2xl border overflow-hidden shadow-xl space-y-4 p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e293b' }}>
            <div>
              <h3
                style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                className="font-black text-base"
              >
                Manual Attendance Roster Fallback
              </h3>
              <p style={{ color: isLight ? '#334155' : 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
                Directly mark attendance for students with battery or device camera issues
              </p>
            </div>

            <button
              onClick={() => {
                teacherRoster.forEach(s => updateStudentAttendanceStatus(s.studentId, 'PRESENT'));
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Mark All Present
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                style={{
                  backgroundColor: isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.8)',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  color: isLight ? '#0f172a' : '#94a3b8'
                }}
                className="uppercase tracking-wider font-extrabold border-b text-[11px]"
              >
                <tr>
                  <th className="px-4 py-3" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Student Name & ID</th>
                  <th className="px-4 py-3" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Section</th>
                  <th className="px-4 py-3" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Overall Attendance</th>
                  <th className="px-4 py-3" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Current Status</th>
                  <th className="px-4 py-3 text-right" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Quick Toggle</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{
                  borderColor: isLight ? '#e2e8f0' : 'rgba(30, 41, 59, 0.8)'
                }}
              >
                {teacherRoster.map(s => (
                  <tr
                    key={s.studentId}
                    className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="px-4 py-3.5">
                      <p
                        data-student-name="true"
                        className="student-name font-black text-sm"
                        style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                      >
                        {s.studentName}
                      </p>
                      <p
                        data-student-id="true"
                        className="student-id font-mono text-[11px] font-black mt-0.5"
                        style={{ color: isLight ? '#312e81' : 'var(--ep-accent-secondary, #94a3b8)' }}
                      >
                        {s.studentId}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3.5 font-black text-sm"
                      style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}
                    >
                      Section {s.section}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-mono font-black ${s.attendanceRate >= 75 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                        {s.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={s.attendanceStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className={`inline-flex gap-1 p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
                        <button
                          onClick={() => updateStudentAttendanceStatus(s.studentId, 'PRESENT')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            s.attendanceStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => updateStudentAttendanceStatus(s.studentId, 'LATE')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            s.attendanceStatus === 'LATE'
                              ? 'bg-amber-600 text-white shadow-sm'
                              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => updateStudentAttendanceStatus(s.studentId, 'ABSENT')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            s.attendanceStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
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
