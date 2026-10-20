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
  CheckCircle2
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
    registeredUsers
  } = useApp();

  const activeSemester = semesters.find(s => s.isActive) || semesters[0];
  const totalStudents = departments.reduce((sum, d) => sum + d.studentCount, 0);
  const pendingApprovals = registeredUsers?.filter(u => u.status === 'PENDING') || [];

  return (
    <div className="space-y-6">
      {/* Admin Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Office of the Academic Registrar • System Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Admin Console 🛡️
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Logged in as: <strong className="text-purple-300">{currentUser.name}</strong> • Current Active Academic Session: <strong className="text-purple-300">{activeSemester.name}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('admin-approvals')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Account Approvals {pendingApprovals.length > 0 && `(${pendingApprovals.length})`}</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-allocations')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>Course Allocations</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-students')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students Registry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Account Approvals Notice Banner if any */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>{pendingApprovals.length} New Registration Request(s) Awaiting Approval</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase">
                  Action Required
                </span>
              </p>
              <p className="text-xs text-amber-200/80 mt-0.5">
                New user access requests have been submitted via Google OAuth and Institutional Registration. Administrator approval is required before portal access is activated.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('admin-approvals')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
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
          subtitle="Across 6 Academic Faculties"
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
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          University Configuration Desks (CRUD)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab('admin-approvals')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 group shadow-md ${
              pendingApprovals.length > 0
                ? 'border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60'
                : 'border-slate-800 bg-[#111827] hover:border-purple-500/40 hover:bg-purple-950/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-xl ${
                pendingApprovals.length > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                <UserCheck className="w-5 h-5" />
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                pendingApprovals.length > 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {pendingApprovals.length > 0 ? `${pendingApprovals.length} PENDING APPROVAL` : 'ALL CLEAR'}
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-amber-300">
              Account Approval Desk
            </h4>
            <p className="text-xs text-slate-400">
              Review and approve Google and institutional user sign-ups before allowing student, teacher, or admin portal entry.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('admin-departments')}
            className="p-5 rounded-2xl border border-slate-800 bg-[#111827] hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Building className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {departments.length} DEPARTMENTS
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-300">Departments Management</h4>
            <p className="text-xs text-slate-400">Manage academic departments, faculty chairs, student distribution, and contact emails.</p>
          </div>

          <div
            onClick={() => setActiveTab('admin-semesters')}
            className="p-5 rounded-2xl border border-slate-800 bg-[#111827] hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <CalendarDays className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {semesters.length} SESSIONS
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-indigo-300">Semesters & Sessions</h4>
            <p className="text-xs text-slate-400">Configure academic semesters, toggle active session, enrollment windows, and credit limits.</p>
          </div>

          <div
            onClick={() => setActiveTab('admin-courses')}
            className="p-5 rounded-2xl border border-slate-800 bg-[#111827] hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <BookMarked className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                COURSE CATALOG
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-cyan-300">Courses Catalog</h4>
            <p className="text-xs text-slate-400">Define course codes, titles, credit hours, theory vs laboratory classifications, and departments.</p>
          </div>

          <div
            onClick={() => setActiveTab('admin-instructors')}
            className="p-5 rounded-2xl border border-slate-800 bg-[#111827] hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {instructors.length} FACULTY
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-300">Instructors & Faculty Directory</h4>
            <p className="text-xs text-slate-400">Register university faculty, employee IDs, academic designations, and workload quotas.</p>
          </div>

          <div
            onClick={() => setActiveTab('admin-students')}
            className="p-5 rounded-2xl border border-slate-800 bg-[#111827] hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                STUDENTS
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-300">Students Registry</h4>
            <p className="text-xs text-slate-400">Manage student admissions, batch enrollments, CGPA records, and academic standing status.</p>
          </div>

          <div
            onClick={() => setActiveTab('admin-allocations')}
            className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 cursor-pointer transition-all space-y-2 group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <GitBranch className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                {courseAllocations.length} ALLOCATIONS
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-300">Course Allocation Desk</h4>
            <p className="text-xs text-slate-400">Assign course sections, instructors, lecture halls, and detect timetable conflicts.</p>
          </div>
        </div>
      </div>

      {/* Department Performance Overview Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl p-5 space-y-4">
        <h3 className="font-bold text-white text-base">Academic Department Performance Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {dept.code}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">{dept.name}</h4>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">{dept.studentCount} Students</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <p>Chair: <strong className="text-slate-200">{dept.chairPerson}</strong></p>
                <p>Faculty Members: <strong className="text-slate-200">{dept.facultyCount} Teachers</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
