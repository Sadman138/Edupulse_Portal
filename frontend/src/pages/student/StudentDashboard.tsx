import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  GraduationCap,
  Award,
  CalendarCheck,
  BookOpen,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  PhoneCall,
  UserCheck,
  QrCode
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, studentCourses, setActiveTab, setPdfModalDoc } = useApp();

  const totalCredits = studentCourses.reduce((sum, c) => sum + c.credits, 0);
  const criticalCourses = studentCourses.filter(c => c.riskLevel === 'CRITICAL');
  const warningCourses = studentCourses.filter(c => c.riskLevel === 'WARNING');

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Metropolitan University • Department of CSE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}! 🎓
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Student ID: <strong className="text-indigo-300">{currentUser.studentId}</strong> • Batch: <strong className="text-indigo-300">{currentUser.batch}</strong> • Current Session: <strong className="text-indigo-300">{currentUser.currentSemester}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('qr-scanner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('academic-performance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week 3 Core Syllabus: DYNAMIC RED ALERT BANNER */}
      {criticalCourses.length > 0 && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 backdrop-blur-md animate-pulse">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-rose-300 text-sm tracking-wide uppercase">
                    Early Warning Red Alert Triggered!
                  </h3>
                  <span className="text-[10px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full">
                    {criticalCourses.length} COURSE AT CRITICAL RISK
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  Your attendance or continuous assessment in{' '}
                  <strong className="underline text-white font-bold">
                    {criticalCourses.map(c => `${c.courseCode} (${c.attendancePercentage}%)`).join(', ')}
                  </strong>{' '}
                  has fallen below the mandatory 75% university eligibility requirement.
                </p>
                <p className="text-[11px] text-rose-300 font-medium">
                  Recommendation: Schedule an immediate counseling meeting with your Course Teacher or Departmental Advisor to arrange recovery quizzes/makeup classes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  setPdfModalDoc({
                    title: 'Academic Debarment Warning Notice - CSE 313',
                    category: 'OFFICIAL WARNING',
                    content: `STUDENT WARNING & COUNSELING SLIP\n\nStudent: ${currentUser.name} (ID: ${currentUser.studentId})\nCourse: CSE 313 Compiler Design\nInstructor: Asst. Prof. Mahfuzur Rahman\nCurrent Attendance: 68.0% (Threshold: 75.0%)\nStatus: Debarment Risk\n\nYou are instructed to meet with your course teacher during office hours within 3 working days.`
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors whitespace-nowrap"
              >
                View Notice Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Current SGPA"
          value="3.56"
          subtitle="Spring 2026 Estimate"
          icon={TrendingUp}
          trend="+0.14"
          trendPositive={true}
          colorScheme="purple"
        />
        <StatCard
          title="Cumulative CGPA"
          value={currentUser.cgpa || 3.42}
          subtitle="Out of 4.00 Scale"
          icon={Award}
          trend="Upper 2nd Class"
          trendPositive={true}
          colorScheme="indigo"
        />
        <StatCard
          title="Overall Attendance"
          value={`${currentUser.overallAttendance || 84.5}%`}
          subtitle="Threshold: 75.0%"
          icon={CalendarCheck}
          trend={currentUser.overallAttendance && currentUser.overallAttendance >= 75 ? 'ELIGIBLE' : 'AT RISK'}
          trendPositive={(currentUser.overallAttendance || 0) >= 75}
          colorScheme={(currentUser.overallAttendance || 0) >= 75 ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Enrolled Credits"
          value={`${totalCredits} Cr`}
          subtitle="5 Enrolled Courses"
          icon={BookOpen}
          colorScheme="cyan"
        />
        <StatCard
          title="Risk Category"
          value={criticalCourses.length > 0 ? 'CRITICAL' : warningCourses.length > 0 ? 'WARNING' : 'SAFE'}
          subtitle={`${criticalCourses.length} Critical • ${warningCourses.length} Warning`}
          icon={AlertOctagon}
          colorScheme={criticalCourses.length > 0 ? 'rose' : warningCourses.length > 0 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Course-Wise Academic Performance Table with Risk Badges */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141d30]">
          <div>
            <h3 className="font-bold text-white text-base">Enrolled Courses & Academic Health</h3>
            <p className="text-xs text-slate-400">Spring 2026 Semester • Department of CSE</p>
          </div>
          <button
            onClick={() => setActiveTab('academic-performance')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Detailed Marks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Course Code & Title</th>
                <th className="px-4 py-3.5">Instructor</th>
                <th className="px-4 py-3.5">Credits</th>
                <th className="px-4 py-3.5">Attendance</th>
                <th className="px-4 py-3.5">Score / Grade</th>
                <th className="px-4 py-3.5">Risk Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {studentCourses.map(course => (
                <tr
                  key={course.courseId}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    course.riskLevel === 'CRITICAL' ? 'bg-rose-500/5' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{course.courseCode}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{course.courseTitle}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-[11px] text-slate-500">{course.section}</p>
                  </td>
                  <td className="px-4 py-4 font-mono font-semibold text-indigo-300">
                    {course.credits.toFixed(1)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            course.attendancePercentage >= 75
                              ? 'bg-emerald-500'
                              : course.attendancePercentage >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${course.attendancePercentage}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          course.attendancePercentage >= 75
                            ? 'text-emerald-400'
                            : course.attendancePercentage >= 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {course.attendancePercentage}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {course.attendedClasses} of {course.totalClasses} classes
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{course.currentGrade}</span>
                      <span className="text-slate-400 font-mono text-xs">({course.totalMarksObtained}/100)</span>
                    </div>
                    <p className="text-[10px] text-slate-500">GPA: {course.currentGPA.toFixed(2)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={course.riskLevel} />
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] line-clamp-1" title={course.riskFactorNotes}>
                      {course.riskFactorNotes}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveTab('academic-performance')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs transition-colors"
                    >
                      Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('qr-scanner')}
          className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-600/10 hover:bg-indigo-600/20 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm group-hover:text-indigo-300">QR Attendance Scanner</h4>
            <p className="text-xs text-slate-400">Scan class session QR code for instant check-in</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-600/30 text-indigo-300">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('assignments')}
          className="p-5 rounded-2xl border border-purple-500/20 bg-purple-600/10 hover:bg-purple-600/20 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm group-hover:text-purple-300">Assignment Desk</h4>
            <p className="text-xs text-slate-400">View deadlines & upload project submissions</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-600/30 text-purple-300">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('previous-results')}
          className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-600/10 hover:bg-emerald-600/20 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-300">Previous Results</h4>
            <p className="text-xs text-slate-400">Submit retake, backlog, or grade improvements</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-600/30 text-emerald-300">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
