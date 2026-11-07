import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CalendarCheck,
  QrCode,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { attendanceLogs, setActiveTab, studentCourses, theme } = useApp();
  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const isLight = theme.mode === 'light';

  const filteredLogs = attendanceLogs.filter(log => {
    if (filterCourse !== 'ALL' && log.courseCode !== filterCourse) return false;
    if (filterStatus !== 'ALL' && log.status !== filterStatus) return false;
    return true;
  });

  const totalSessions = attendanceLogs.length;
  const presentCount = attendanceLogs.filter(l => l.status === 'PRESENT').length;
  const lateCount = attendanceLogs.filter(l => l.status === 'LATE').length;
  const absentCount = attendanceLogs.filter(l => l.status === 'ABSENT').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-2xl sm:text-3xl font-black tracking-tight"
          >
            Attendance Log & Verification History
          </h2>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
            Real-time biometric & dynamic 5-minute QR classroom session records
          </p>
        </div>

        <button
          onClick={() => setActiveTab('qr-scanner')}
          style={{ backgroundColor: theme.accentColor }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl !text-white text-xs font-black shadow-lg transition-all w-fit cursor-pointer hover:brightness-110 active:scale-95"
        >
          <QrCode className="w-4 h-4 text-white" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div
          style={{
            backgroundColor: 'var(--ep-bg-card, #0d1627)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-4 rounded-2xl border shadow-md"
        >
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Sessions</p>
          <p
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-2xl sm:text-3xl font-black mt-1"
          >
            {totalSessions}
          </p>
        </div>

        <div
          style={{
            backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.1)',
            borderColor: isLight ? '#a7f3d0' : 'rgba(16, 185, 129, 0.25)'
          }}
          className="p-4 rounded-2xl border text-emerald-500 shadow-md"
        >
          <p className="text-xs font-bold uppercase tracking-wider">Present</p>
          <p className="text-2xl sm:text-3xl font-black mt-1">{presentCount}</p>
        </div>

        <div
          style={{
            backgroundColor: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.1)',
            borderColor: isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.25)'
          }}
          className="p-4 rounded-2xl border text-amber-500 shadow-md"
        >
          <p className="text-xs font-bold uppercase tracking-wider">Late</p>
          <p className="text-2xl sm:text-3xl font-black mt-1">{lateCount}</p>
        </div>

        <div
          style={{
            backgroundColor: isLight ? '#fef2f2' : 'rgba(244, 63, 94, 0.1)',
            borderColor: isLight ? '#fecdd3' : 'rgba(244, 63, 94, 0.25)'
          }}
          className="p-4 rounded-2xl border text-rose-500 shadow-md"
        >
          <p className="text-xs font-bold uppercase tracking-wider">Absent</p>
          <p className="text-2xl sm:text-3xl font-black mt-1">{absentCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border shadow-md"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filter Logs:</span>
        </div>

        <select
          value={filterCourse}
          onChange={e => setFilterCourse(e.target.value)}
          className={`rounded-xl px-3 py-2 text-xs font-bold border transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
          }`}
        >
          <option value="ALL">All Enrolled Courses</option>
          {studentCourses.map(c => (
            <option key={c.courseId} value={c.courseCode}>
              {c.courseCode} - {c.courseTitle}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className={`rounded-xl px-3 py-2 text-xs font-bold border transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
          }`}
        >
          <option value="ALL">All Statuses</option>
          <option value="PRESENT">Present Only</option>
          <option value="LATE">Late Only</option>
          <option value="ABSENT">Absent Only</option>
        </select>
      </div>

      {/* Logs Table */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="rounded-3xl border overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              style={{
                backgroundColor: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
                color: isLight ? '#334155' : '#94a3b8',
                borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="uppercase tracking-wider font-extrabold border-b"
            >
              <tr>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Course Code & Title</th>
                <th className="px-5 py-3.5">Classroom</th>
                <th className="px-5 py-3.5">Verification Method</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody
              style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
              className="divide-y"
            >
              {filteredLogs.map(log => (
                <tr
                  key={log.id}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-5 py-4 font-mono">
                    <p
                      style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                      className="font-bold text-xs"
                    >
                      {log.date}
                    </p>
                    <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-[11px] font-semibold mt-0.5">
                      {log.timeSlot}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p
                      style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                      className="font-black text-sm"
                    >
                      {log.courseCode}
                    </p>
                    <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
                      {log.courseTitle}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-bold" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                    {log.room}
                  </td>

                  <td className="px-5 py-4">
                    {/* Fixed Verification Badge: light theme friendly, no black blocks! */}
                    <span
                      style={{
                        backgroundColor: isLight
                          ? log.verifiedVia === 'DYNAMIC_QR'
                            ? '#e0f2fe'
                            : '#f1f5f9'
                          : log.verifiedVia === 'DYNAMIC_QR'
                          ? 'rgba(6, 182, 212, 0.15)'
                          : 'rgba(255, 255, 255, 0.08)',
                        borderColor: isLight
                          ? log.verifiedVia === 'DYNAMIC_QR'
                            ? '#7dd3fc'
                            : '#cbd5e1'
                          : log.verifiedVia === 'DYNAMIC_QR'
                          ? 'rgba(6, 182, 212, 0.35)'
                          : 'rgba(255, 255, 255, 0.15)',
                        color: isLight
                          ? log.verifiedVia === 'DYNAMIC_QR'
                            ? '#0369a1'
                            : '#1e293b'
                          : log.verifiedVia === 'DYNAMIC_QR'
                          ? '#38bdf8'
                          : '#e2e8f0'
                      }}
                      className="font-mono text-[11px] font-extrabold px-3 py-1.5 rounded-xl border inline-flex items-center gap-1.5 shadow-xs"
                    >
                      {log.verifiedVia === 'DYNAMIC_QR' ? (
                        <>
                          <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          <span>DYNAMIC QR TOKEN</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
                          <span>MANUAL TEACHER ROSTER</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
