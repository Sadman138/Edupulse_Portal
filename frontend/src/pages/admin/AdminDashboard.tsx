import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  TrendingUp,
  Building,
  CalendarDays,
  BookMarked,
  UserCheck,
  GitBranch,
  ArrowRight,
  School,
  CheckCircle2,
  Database,
  Server
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    departments,
    semesters,
    instructors,
    studentsRegistry,
    courseAllocations,
    registeredUsers,
    theme
  } = useApp();

  const activeSemester = semesters.find(s => s.isActive) || semesters[0];
  const totalStudents = departments.reduce((sum, d) => sum + d.studentCount, 0);
  const pendingApprovals = registeredUsers?.filter(u => u.status === 'PENDING') || [];
  const isLight = theme.mode === 'light';

  return (
    <div className="space-y-6">
      {/* Admin Welcome Banner with Dynamic Theme Accent */}
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
                Office of the Academic Registrar • System Administrator
              </span>
            </div>
            <h1
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Institutional Admin Console 🛡️
            </h1>
            <p
              style={{ color: isLight ? '#334155' : '#cbd5e1' }}
              className="text-sm max-w-2xl leading-relaxed font-bold"
            >
              Logged in as: <strong style={{ color: theme.accentColor }} className="font-extrabold">{currentUser.name}</strong> • Current Active Academic Session: <strong style={{ color: theme.accentColor }} className="font-extrabold">{activeSemester.name}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('admin-approvals')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Account Approvals {pendingApprovals.length > 0 && `(${pendingApprovals.length})`}</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-allocations')}
              style={{ backgroundColor: theme.accentColor }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <GitBranch className="w-4 h-4 text-white" />
              <span className="text-white">Course Allocations</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-students')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students Registry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Account Approvals Notice Banner if any */}
      {pendingApprovals.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--ep-bg-card-sub, #1a2333)',
            borderColor: 'rgba(245, 158, 11, 0.6)'
          }}
          className="p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg transition-colors"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
              <UserCheck className="w-5 h-5 animate-pulse text-amber-500" />
            </div>
            <div>
              <p
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="text-sm font-black flex items-center gap-2"
              >
                <span>{pendingApprovals.length} New Registration Request(s) Awaiting Approval</span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase shadow-sm">
                  Action Required
                </span>
              </p>
              <p
                style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
                className="text-xs font-semibold mt-0.5"
              >
                New user access requests have been submitted via Google OAuth and Institutional Registration. Administrator approval is required before portal access is activated.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('admin-approvals')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shrink-0 active:scale-95"
          >
            <span>Review & Approve ({pendingApprovals.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Week 5 Admin Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across 9 Academic Faculties"
          icon={GraduationCap}
          trend="+8.2% Year-on-Year"
          trendPositive={true}
          colorScheme="purple"
          onClick={() => setActiveTab('admin-students')}
        />
        <StatCard
          title="Average Attendance"
          value="83.4%"
          subtitle="University-Wide Median"
          icon={TrendingUp}
          trend="Eligible (>= 75%)"
          trendPositive={true}
          colorScheme="emerald"
        />
        <StatCard
          title="Overall Pass Rate"
          value="95.2%"
          subtitle="Spring 2026 Examination Projection"
          icon={ShieldCheck}
          trend="Standard Grade A- Avg"
          trendPositive={true}
          colorScheme="cyan"
        />
        <StatCard
          title="Active Faculty"
          value={`${instructors.length} Instructors`}
          subtitle={`${departments.length} Departments`}
          icon={School}
          colorScheme="indigo"
          onClick={() => setActiveTab('admin-instructors')}
        />
      </div>

      {/* Management Operations Hub */}
      <div>
        <h3
          style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
          className="text-sm font-black uppercase tracking-wider mb-3"
        >
          University Configuration Desks (CRUD)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab('admin-approvals')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: pendingApprovals.length > 0 ? 'rgba(245, 158, 11, 0.5)' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-xl ${
                pendingApprovals.length > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-500/20 text-purple-400'
              }`}>
                <UserCheck className="w-5 h-5" />
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                pendingApprovals.length > 0 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}>
                {pendingApprovals.length > 0 ? `${pendingApprovals.length} PENDING APPROVAL` : 'ALL CLEAR'}
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-amber-400 transition-colors"
            >
              Account Approval Desk
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Review and approve Google and institutional user sign-ups before allowing student, teacher, or admin portal entry.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-departments')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border hover:border-purple-500/50 cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Building className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {departments.length} DEPARTMENTS
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-purple-400 transition-colors"
            >
              Departments Management
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Manage academic departments, faculty chairs, student distribution, and contact emails.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-semesters')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border hover:border-indigo-500/50 cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <CalendarDays className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {semesters.length} SESSIONS
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-indigo-400 transition-colors"
            >
              Semesters & Sessions
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Configure academic semesters, toggle active session, enrollment windows, and credit limits.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-courses')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <BookMarked className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                COURSE CATALOG
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-cyan-400 transition-colors"
            >
              Courses Catalog
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Define course codes, titles, credit hours, theory vs laboratory classifications, and departments.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-instructors')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {instructors.length} FACULTY
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-emerald-400 transition-colors"
            >
              Instructors & Faculty Directory
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Register university faculty, employee IDs, academic designations, and workload quotas.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-students')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border hover:border-blue-500/50 cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                STUDENTS
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-blue-400 transition-colors"
            >
              Students Registry
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Manage student admissions, batch enrollments, CGPA records, and academic standing status.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-allocations')}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-5 rounded-2xl border hover:border-purple-500/50 cursor-pointer transition-all space-y-2 group shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <GitBranch className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                {courseAllocations.length} ALLOCATIONS
              </span>
            </div>
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-bold text-sm group-hover:text-purple-400 transition-colors"
            >
              Course Allocation & Room Desk
            </h4>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs"
            >
              Assign course sections, instructors, lecture halls, and detect timetable conflicts.
            </p>
          </div>
        </div>
      </div>

      {/* Department Performance Overview Grid */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #111827)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="rounded-2xl border overflow-hidden shadow-xl p-5 space-y-4 transition-colors"
      >
        <h3
          style={{ color: 'var(--ep-text-primary, #ffffff)' }}
          className="font-black text-base"
        >
          Academic Department Performance Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map(dept => (
            <div
              key={dept.id}
              style={{
                backgroundColor: 'var(--ep-bg-card-sub, #1a2333)',
                borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="p-4 rounded-xl border space-y-2 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                    {dept.code}
                  </span>
                  <h4
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-bold text-sm mt-1"
                  >
                    {dept.name}
                  </h4>
                </div>
                <span
                  style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
                  className="text-xs font-mono font-bold"
                >
                  {dept.studentCount} Students
                </span>
              </div>

              <div
                style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
                className="pt-2 border-t text-[11px] space-y-1 font-medium"
              >
                <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
                  Chair: <strong style={{ color: 'var(--ep-text-primary, #f1f5f9)' }} className="font-bold">{dept.chairPerson}</strong>
                </p>
                <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
                  Faculty Members: <strong style={{ color: 'var(--ep-text-primary, #f1f5f9)' }} className="font-bold">{dept.facultyCount} Teachers</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
