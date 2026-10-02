import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { attendanceLog } from '../../data/studentModuleData';

interface StudentAttendanceProps {
  isDarkMode?: boolean;
}

export const StudentAttendance: React.FC<StudentAttendanceProps> = ({ isDarkMode = true }) => {
  const { evaluations, student } = useApp();
  const studentEvals = evaluations.filter((e) => e.studentId === student.id);

  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl'
    : 'bg-white border-slate-200 shadow-sm text-slate-800';

  const filteredLogs = attendanceLog.filter((log) => {
    const matchCourse = filterCourse === 'ALL' || log.code === filterCourse;
    const matchStatus = filterStatus === 'ALL' || log.status === filterStatus;
    return matchCourse && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Attendance Telemetry & Session Audit</h2>
          <p className="text-xs opacity-70">
            Course-wise classroom presence audits, derived continuous attendance marks, and live shortage alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#141b2c] border border-[#1e273a] px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <span className="text-slate-400">Institutional Threshold:</span>
            <span className="text-emerald-400 font-bold">&ge; 75% Required</span>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studentEvals.map((course) => {
          const isEligible = course.attendancePercent >= 75;
          return (
            <div
              key={course.id}
              className={`p-5 rounded-2xl border space-y-3.5 transition-all ${cardStyle} ${
                !isEligible ? 'border-rose-900/60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{course.courseCode}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isEligible
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isEligible ? 'ELIGIBLE' : 'SHORTAGE'}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white truncate">{course.courseName}</h3>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Continuous Marks: <strong className="text-cyan-400">{course.attendanceMarks} / 10</strong>
                </span>
              </div>
              <div className="space-y-1.5 pt-1 border-t border-[#1a2336]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Attendance Rate</span>
                  <span className={`font-bold tabular-nums ${isEligible ? 'text-white' : 'text-rose-400'}`}>
                    {course.attendancePercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isEligible ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${course.attendancePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Audit Logs Table */}
      <div className={`p-5 rounded-2xl border space-y-4 ${cardStyle}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2538] pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400">event_available</span>
              <span>Classroom Attendance Session Logs</span>
            </h3>
            <p className="text-xs text-slate-400">
              Individual class check-in events recorded via dynamic QR scans and faculty manual roll calls.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="bg-[#141b2c] border border-[#222d44] text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Courses</option>
              <option value="CSE 301">CSE 301</option>
              <option value="CSE 303">CSE 303</option>
              <option value="CSE 305">CSE 305</option>
              <option value="CSE 307">CSE 307</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#141b2c] border border-[#222d44] text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1b2538] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">COURSE CODE</th>
                <th className="py-3 px-4">SCHEDULE TIME</th>
                <th className="py-3 px-4">ROOM / LAB</th>
                <th className="py-3 px-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033] text-slate-200">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-500/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300">{log.date}</td>
                  <td className="py-3 px-4 font-bold text-cyan-400 font-mono">{log.code}</td>
                  <td className="py-3 px-4 text-slate-400">{log.time || '10:00 AM'}</td>
                  <td className="py-3 px-4 text-slate-300">{log.room || 'Lab 302'}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        log.status === 'present'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {log.status === 'present' ? 'check' : 'close'}
                      </span>
                      <span>{log.status}</span>
                    </span>
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
