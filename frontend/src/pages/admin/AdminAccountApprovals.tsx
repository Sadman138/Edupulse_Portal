import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegisteredUser, UserRole, AccountStatus } from '../../types';
import {
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  GraduationCap,
  School,
  Mail,
  Building,
  AlertTriangle,
  RotateCcw,
  CheckCheck
} from 'lucide-react';

export const AdminAccountApprovals: React.FC = () => {
  const { registeredUsers, approveUser, rejectUser, deleteUser, setRegisteredUsers } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountStatus>('PENDING');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Invalid or unverified institutional credentials.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const pendingCount = registeredUsers.filter(u => u.status === 'PENDING').length;
  const approvedCount = registeredUsers.filter(u => u.status === 'APPROVED').length;
  const rejectedCount = registeredUsers.filter(u => u.status === 'REJECTED').length;

  const filteredUsers = registeredUsers.filter(user => {
    // Status filter
    if (statusFilter !== 'ALL' && user.status !== statusFilter) return false;
    // Role filter
    if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchEmail = user.email.toLowerCase().includes(q);
      const matchId = (user.studentId || user.employeeId || '').toLowerCase().includes(q);
      const matchDept = (user.department || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchDept) return false;
    }
    return true;
  });

  const handleApprove = (userId: string, name: string) => {
    approveUser(userId);
    setActionSuccessMsg(`Account for "${name}" approved successfully! They can now log in.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleConfirmReject = (userId: string, name: string) => {
    rejectUser(userId, rejectionReason);
    setRejectingUserId(null);
    setActionSuccessMsg(`Account for "${name}" has been rejected.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleRevoke = (userId: string, name: string) => {
    // Put back into pending review
    const updated = registeredUsers.map(u => (u.id === userId ? { ...u, status: 'PENDING' as AccountStatus } : u));
    setRegisteredUsers(updated);
    setActionSuccessMsg(`Approval for "${name}" revoked and set to PENDING review.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleApproveAllPending = () => {
    const updated = registeredUsers.map(u => (u.status === 'PENDING' ? { ...u, status: 'APPROVED' as AccountStatus } : u));
    setRegisteredUsers(updated);
    setActionSuccessMsg(`All ${pendingCount} pending accounts approved!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1627] border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Central Security & Identity Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Account Approval Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, verify, and approve new user registrations from Google OAuth and institutional sign-ups before allowing portal access.
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={handleApproveAllPending}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve All ({pendingCount})</span>
          </button>
        )}
      </div>

      {/* Action Success Alert */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{pendingCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting Admin Action</p>
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
              : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Approved Accounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{approvedCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Active & Authorized</p>
        </button>

        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              Rejected Requests
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{rejectedCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Access Denied</p>
        </button>

        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
              : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Total Registered
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{registeredUsers.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">All Registry Records</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0d1627] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, student ID, employee ID..."
            className="w-full bg-[#070c18] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status Tabs */}
          <div className="flex bg-[#070c18] border border-slate-800 p-1 rounded-xl text-xs shrink-0">
            {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'PENDING' ? `Pending (${pendingCount})` : tab}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer shrink-0"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Faculty Teachers</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center bg-[#0d1627] border border-slate-800 rounded-2xl">
            <UserCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">No accounts found</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no accounts matching the selected status ({statusFilter}) and role filters.
            </p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const isRejecting = rejectingUserId === user.id;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  user.status === 'PENDING'
                    ? 'bg-[#0f1b30] border-amber-500/30 hover:border-amber-500/50 shadow-md shadow-amber-500/5'
                    : user.status === 'REJECTED'
                    ? 'bg-[#150f16] border-rose-500/20 hover:border-rose-500/40'
                    : 'bg-[#0d1627] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: User identity & Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 shrink-0">
                        {user.name.charAt(0)}
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{user.name}</span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            user.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : user.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {user.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                          {user.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                          {user.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {user.status === 'PENDING' ? 'PENDING APPROVAL' : user.status}
                        </span>

                        {/* Provider */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          {user.authProvider === 'GOOGLE' ? (
                            <>
                              <span className="text-blue-400 font-bold">G</span>
                              <span>Google Auth</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3 text-purple-400" />
                              <span>Institutional Email</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-300">{user.email}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          {user.role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />}
                          {user.role === 'TEACHER' && <School className="w-3.5 h-3.5 text-emerald-400" />}
                          {user.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
                          <span className="font-semibold text-slate-200">
                            {user.role}: {user.studentId || user.employeeId || 'No ID specified'}
                          </span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>Dept: {user.department || 'CSE'}</span>
                        </span>

                        {user.createdAt && (
                          <span className="text-[10px] text-slate-500">
                            Registered: {user.createdAt}
                          </span>
                        )}
                      </div>

                      {user.status === 'REJECTED' && user.rejectionReason && (
                        <p className="text-xs text-rose-400/90 font-medium pt-1">
                          Reason: {user.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                    {user.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(user.id, user.name)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectingUserId(isRejecting ? null : user.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {user.status === 'APPROVED' && (
                      <button
                        onClick={() => handleRevoke(user.id, user.name)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revoke to Pending</span>
                      </button>
                    )}

                    {user.status === 'REJECTED' && (
                      <button
                        onClick={() => handleApprove(user.id, user.name)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Re-Approve</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete User Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reject Reason Input Drawer */}
                {isRejecting && (
                  <div className="mt-4 pt-3 border-t border-rose-500/20 space-y-2 animate-in fade-in duration-150">
                    <p className="text-xs font-bold text-rose-300">
                      Specify reason for rejecting this registration request:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="e.g., Unverified Student ID or incorrect department affiliation"
                        className="flex-1 bg-[#090d18] border border-rose-500/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleConfirmReject(user.id, user.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 cursor-pointer"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setRejectingUserId(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
