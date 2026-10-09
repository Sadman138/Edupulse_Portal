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
  Download
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { attendanceLogs, setActiveTab, studentCourses } = useApp();
  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Attendance Log & Verification History
          </h2>
          <p className="text-xs text-slate-400">
            Real-time biometric & dynamic QR session attendance logs
          </p>
        </div>

        <button
          onClick={() => setActiveTab('qr-scanner')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all w-fit"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Sessions</p>
          <p className="text-2xl font-black text-white mt-1">{totalSessions}</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <p className="text-xs font-semibold uppercase">Present</p>
          <p className="text-2xl font-black mt-1">{presentCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <p className="text-xs font-semibold uppercase">Late</p>
          <p className="text-2xl font-black mt-1">{lateCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <p className="text-xs font-semibold uppercase">Absent</p>
          <p className="text-2xl font-black mt-1">{absentCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[#111827] border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filter Logs:</span>
        </div>

        <select
          value={filterCourse}
          onChange={e => setFilterCourse(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="ALL">All Enrolled Courses</option>
          {studentCourses.map(c => (
            <option key={c.courseId} value={c.courseCode}>{c.courseCode} - {c.courseTitle}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="PRESENT">Present Only</option>
          <option value="LATE">Late Only</option>
          <option value="ABSENT">Absent Only</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Course Code & Title</th>
                <th className="px-5 py-3.5">Classroom</th>
                <th className="px-5 py-3.5">Verification Method</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono">
                    <p className="font-semibold text-white">{log.date}</p>
                    <p className="text-[11px] text-slate-500">{log.timeSlot}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{log.courseCode}</p>
                    <p className="text-slate-400 text-xs">{log.courseTitle}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-medium">
                    {log.room}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                      {log.verifiedVia === 'DYNAMIC_QR' ? '⚡ DYNAMIC QR TOKEN' : '📋 MANUAL TEACHER ROSTER'}
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
