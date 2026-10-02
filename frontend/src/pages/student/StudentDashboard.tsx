import React, { useState } from 'react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  GPA_TREND_DATA,
  ATTENDANCE_TREND_DATA,
  RECENT_ACTIVITIES
} from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { ClassRoutineTracker } from '../../components/common/ClassRoutineTracker';
import { Calendar, Clock, MapPin, X, Sparkles, Building2, ChevronRight } from 'lucide-react';
import { ThemeColor } from '../../theme/epTheme';

interface StudentDashboardProps {
  onNavigate?: (path: string) => void;
  isDarkMode?: boolean;
  themeColor?: ThemeColor;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  isDarkMode: propIsDarkMode,
  themeColor = 'cyan'
}) => {
  const { student, evaluations, activeQRSession, currentUser, isDarkMode: contextIsDarkMode } = useApp();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;
  const [showFullRoutineModal, setShowFullRoutineModal] = useState(false);

  const studentEvals = evaluations.filter((e) => e.studentId === student.id);
  const criticalCourse = studentEvals.find((e) => e.riskLevel === 'CRITICAL');

  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl text-slate-100'
    : 'bg-white border-slate-200/90 shadow-xs text-slate-900';

  const rowTextStyle = isDarkMode ? 'text-slate-200 font-bold' : 'text-slate-900 font-extrabold';
  const tableHeadStyle = isDarkMode
    ? 'bg-[#0a0f1d] text-slate-400 border-b border-[#1b2538]'
    : 'bg-slate-100 text-slate-800 border-b border-slate-200 font-extrabold';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Current SGPA"
          value={student.currentSgpa.toFixed(2)}
          subtitle={`Target: ${student.targetSgpa.toFixed(2)}`}
          icon="grade"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Overall CGPA"
          value={student.cgpa.toFixed(2)}
          subtitle="Semester 1-5 Verified"
          icon="school"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Attendance"
          value={`${student.overallAttendance}%`}
          subtitle="Min Required: 75%"
          icon="fact_check"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Current Semester"
          value={student.currentSemester}
          subtitle={student.academicYear}
          icon="calendar_today"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Total Credits"
          value={student.totalCredits}
          subtitle="Completed"
          icon="verified"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Dynamic Academic Risk Alert Banner */}
      {criticalCourse && (
        <div
          className={`p-4 rounded-2xl border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
            isDarkMode
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-100 shadow-rose-950/20'
              : 'bg-rose-50 border-rose-300 text-rose-950 shadow-rose-200/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isDarkMode ? 'bg-rose-500/30 text-rose-300' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <span className="material-symbols-outlined text-2xl block">warning</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold tracking-tight">
                  ACADEMIC RISK ALERT: WARNING
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    isDarkMode
                      ? 'bg-rose-500/30 text-rose-200'
                      : 'bg-rose-200 text-rose-800'
                  }`}
                >
                  ACTION REQUIRED
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Critical risk detected in {criticalCourse.courseName} ({criticalCourse.courseCode}). Immediate faculty advisory session recommended.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {studentEvals.map((c) => (
              <div
                key={c.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDarkMode
                    ? 'bg-[#141b2c] border-[#1d273a] text-slate-100'
                    : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <span>{c.courseCode}</span>
                <StatusBadge status={c.riskLevel} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Lecture Banner if teacher has one open */}
      {activeQRSession && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg transition-colors ${
            isDarkMode
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
              : 'bg-sky-50 border-sky-300 text-sky-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div>
              <span className={`font-bold text-sm block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Classroom Lecture Now Active: {activeQRSession.courseCode} ({activeQRSession.courseName})
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {activeQRSession.room} &bull; Rotating QR token active ({activeQRSession.remainingSeconds}s left)
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('qr-scanner')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
          >
            Launch QR Scanner
          </button>
        </div>
      )}

      {/* Main Performance Table (High-contrast in both Light & Dark modes) */}
      <div className={`p-5 rounded-2xl border space-y-4 ${cardStyle}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Academic Performance Overview
          </h2>
          <button
            onClick={() => onNavigate && onNavigate('performance')}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase text-[11px] ${tableHeadStyle}`}>
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Name</th>
                <th className="p-3">Credit</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Quiz (20)</th>
                <th className="p-3">Assign (20)</th>
                <th className="p-3">Final (50)</th>
                <th className="p-3">Total (100)</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Grade Point</th>
                <th className="p-3 text-right">Risk Status</th>
              </tr>
            </thead>
            <tbody
              className={
                isDarkMode
                  ? 'divide-y divide-[#1b2538] text-slate-200'
                  : 'divide-y divide-slate-200 text-slate-800'
              }
            >
              {studentEvals.map((course) => (
                <tr
                  key={course.id}
                  className={
                    isDarkMode
                      ? 'hover:bg-slate-500/5 transition-colors'
                      : 'hover:bg-slate-50 transition-colors'
                  }
                >
                  <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {course.courseCode}
                  </td>
                  <td
                    className={`p-3 font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {course.courseName}
                  </td>
                  <td className="p-3 tabular-nums font-semibold">{course.creditHours}</td>
                  <td
                    className={`p-3 tabular-nums font-bold ${
                      course.attendancePercent < 75
                        ? 'text-rose-600 dark:text-rose-400'
                        : isDarkMode
                        ? 'text-slate-200'
                        : 'text-slate-800'
                    }`}
                  >
                    {course.attendancePercent}%
                  </td>
                  <td className="p-3 tabular-nums font-semibold">{course.quizMarks}</td>
                  <td className="p-3 tabular-nums font-semibold">{course.assignmentMarks}</td>
                  <td className="p-3 tabular-nums font-semibold">{course.finalExamMarks}</td>
                  <td
                    className={`p-3 font-black tabular-nums text-sm ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {course.totalMarks}
                  </td>
                  <td className="p-3 font-bold">
                    <span
                      className={
                        course.grade === 'A+'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : course.grade === 'A'
                          ? 'text-sky-600 dark:text-sky-300'
                          : course.grade === 'B'
                          ? 'text-amber-600 dark:text-amber-300'
                          : 'text-rose-600 dark:text-rose-400'
                      }
                    >
                      {course.grade}
                    </span>
                  </td>
                  <td className="p-3 tabular-nums font-semibold">{course.gradePoint.toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <StatusBadge status={course.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Trend */}
        <div className={`p-5 rounded-2xl border space-y-3 ${cardStyle}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              SGPA / CGPA Progression Trend
            </h3>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <span className="w-2.5 h-1 rounded-full bg-sky-500" />
                <span>SGPA</span>
              </span>
              <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                <span className="w-2.5 h-1 rounded-full bg-teal-500" />
                <span>CGPA</span>
              </span>
            </div>
          </div>
          <div className="h-56 w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 170">
              <defs>
                <linearGradient id="sgpaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={isDarkMode ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line
                x1="35"
                y1="20"
                x2="480"
                y2="20"
                stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                strokeDasharray="3 3"
              />
              <line
                x1="35"
                y1="60"
                x2="480"
                y2="60"
                stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                strokeDasharray="3 3"
              />
              <line
                x1="35"
                y1="100"
                x2="480"
                y2="100"
                stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                strokeDasharray="3 3"
              />
              <line
                x1="35"
                y1="140"
                x2="480"
                y2="140"
                stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                strokeDasharray="3 3"
              />
              <text x="25" y="24" fill={isDarkMode ? '#64748b' : '#475569'} fontSize="10" fontWeight="bold">
                4.0
              </text>
              <text x="25" y="64" fill={isDarkMode ? '#64748b' : '#475569'} fontSize="10" fontWeight="bold">
                3.5
              </text>
              <text x="25" y="104" fill={isDarkMode ? '#64748b' : '#475569'} fontSize="10" fontWeight="bold">
                3.0
              </text>
              <text x="25" y="144" fill={isDarkMode ? '#64748b' : '#475569'} fontSize="10" fontWeight="bold">
                2.5
              </text>
              <path
                d="M 50 100 C 110 80, 160 50, 220 85 C 280 105, 340 45, 410 80 L 460 75 L 460 150 L 50 150 Z"
                fill="url(#sgpaGrad)"
              />
              <path
                d="M 50 100 C 110 80, 160 50, 220 85 C 280 105, 340 45, 410 80 L 460 75"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 50 100 C 110 90, 170 82, 230 84 C 290 85, 350 72, 410 68 L 460 62"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="100" r="3.5" fill="#0284c7" />
              <circle cx="130" cy="80" r="3.5" fill="#0284c7" />
              <circle cx="210" cy="60" r="3.5" fill="#0284c7" />
              <circle cx="290" cy="85" r="3.5" fill="#0284c7" />
              <circle cx="370" cy="55" r="3.5" fill="#0284c7" />
              <circle cx="450" cy="75" r="3.5" fill="#0284c7" />
              {GPA_TREND_DATA.map((d, i) => (
                <text
                  key={i}
                  x={50 + i * 80}
                  y="164"
                  fill={isDarkMode ? '#94a3b8' : '#334155'}
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {d.semester}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Weekly Attendance Telemetry */}
        <div className={`p-5 rounded-2xl border space-y-3 ${cardStyle}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Weekly Attendance Telemetry (%)
            </h3>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              Current Average: {student.overallAttendance}%
            </span>
          </div>
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {ATTENDANCE_TREND_DATA.map((item, idx) => {
              const isShort = item.attendance < 75;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <span
                    className={`text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity tabular-nums ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {item.attendance}%
                  </span>
                  <div
                    className={`w-full rounded-t-lg h-36 flex items-end p-0.5 transition-colors ${
                      isDarkMode ? 'bg-[#162035]' : 'bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isShort
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-sm shadow-amber-500/20'
                          : 'bg-gradient-to-t from-sky-600 to-sky-400 shadow-sm shadow-sky-500/20'
                      }`}
                      style={{ height: `${item.attendance}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {item.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action & Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Action Desk */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${cardStyle}`}>
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400">
              <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Attendance Action Desk
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Scan live lecture room QR codes generated by faculty to instantly log classroom attendance.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('qr-scanner')}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">photo_camera</span>
            <span>Scan Attendance QR Now</span>
          </button>
        </div>

        {/* Recent Activity Audit */}
        <div className={`p-5 rounded-2xl border space-y-3 ${cardStyle}`}>
          <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Recent Activity Audit
          </h3>
          <div className="space-y-2">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                  isDarkMode ? 'bg-[#0c1221] border border-[#1b2538]' : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div>
                  <div className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    {act.title}
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-extrabold">{act.course}</div>
                </div>
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Daily Routine & Room Tracker Widget */}
        <div className="space-y-2">
          <ClassRoutineTracker compactMode={true} onNavigate={onNavigate} isDarkMode={isDarkMode} />
          <button
            onClick={() => setShowFullRoutineModal(true)}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              isDarkMode
                ? 'bg-[#141d30] hover:bg-[#1a2640] border-[#233150] text-cyan-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-cyan-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>View Full Weekly Routine & Room Directory</span>
          </button>
        </div>
      </div>

      {/* Full Weekly Class Routine Modal */}
      {showFullRoutineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`border rounded-3xl max-w-5xl w-full p-6 shadow-2xl space-y-4 my-auto animate-fadeIn max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-[#0b101d] border-[#202e4c] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDarkMode ? 'border-[#1c2942]' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isDarkMode
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-base font-bold flex items-center gap-2 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <span>Weekly Class Schedule & Live Room Directory</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDarkMode
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      }`}
                    >
                      {currentUser?.batch || '58th Batch'} &bull; {currentUser?.section || 'Section A'}
                    </span>
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Department of Computer Science & Engineering &bull; Metropolitan University
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFullRoutineModal(false)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-[#162035] text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ClassRoutineTracker onNavigate={onNavigate} isDarkMode={isDarkMode} />
          </div>
        </div>
      )}
    </div>
  );
};
