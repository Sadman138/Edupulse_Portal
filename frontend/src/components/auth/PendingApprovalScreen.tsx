import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  LogOut,
  ShieldCheck,
  Mail,
  GraduationCap,
  School
} from 'lucide-react';

export const PendingApprovalScreen: React.FC = () => {
  const { pendingApprovalUser, registeredUsers, login, clearPendingApproval } = useApp();
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!pendingApprovalUser) {
    return null;
  }

  // Check the latest state of this user in registeredUsers
  const latestRecord = registeredUsers.find(
    u => u.email.toLowerCase() === pendingApprovalUser.email.toLowerCase()
  ) || pendingApprovalUser;

  const handleCheckStatus = () => {
    setChecking(true);
    setStatusMessage(null);
    setTimeout(() => {
      setChecking(false);
      if (latestRecord.status === 'APPROVED') {
        setStatusMessage('Your account has been APPROVED by the administrator! Redirecting to your portal...');
        setTimeout(() => {
          login(latestRecord.email, latestRecord.role);
        }, 1200);
      } else if (latestRecord.status === 'REJECTED') {
        setStatusMessage('Account request has been rejected by the university administrator.');
      } else {
        setStatusMessage('Status: Awaiting administrator verification. Please check back shortly.');
      }
    }, 600);
  };

  const handleLoginAsAdmin = () => {
    // Log in as administrator so reviewer can access the Central Account Approvals desk
    login('admin@metrouni.edu.bd', 'ADMIN', 'admin123');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg bg-[#0d1525]/95 border border-amber-500/30 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10 mb-2 relative">
            <Clock className="w-7 h-7 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-[#0d1525] flex items-center justify-center text-[9px] font-black text-black">
              !
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Account Pending Approval
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your registration request has been submitted. According to university security policy, an Administrator must verify and approve your account before portal access is granted.
          </p>
        </div>

        {/* User Account Details Card */}
        <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              {latestRecord.avatarUrl ? (
                <img
                  src={latestRecord.avatarUrl}
                  alt={latestRecord.name}
                  className="w-11 h-11 rounded-full object-cover border border-amber-500/40"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                  {latestRecord.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{latestRecord.name}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {latestRecord.email}
                </p>
              </div>
            </div>

            {/* Provider Tag */}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              latestRecord.authProvider === 'GOOGLE'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
            }`}>
              {latestRecord.authProvider === 'GOOGLE' ? 'Google Auth' : 'Email Account'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Requested Role
              </span>
              <span className="font-bold text-amber-300 flex items-center gap-1">
                {latestRecord.role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5" />}
                {latestRecord.role === 'TEACHER' && <School className="w-3.5 h-3.5" />}
                {latestRecord.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                {latestRecord.role}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Identification
              </span>
              <span className="font-mono font-bold text-slate-200">
                {latestRecord.studentId || latestRecord.employeeId || 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Department
              </span>
              <span className="font-bold text-slate-200">
                {latestRecord.department || 'CSE'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Status
              </span>
              <span className={`font-bold flex items-center gap-1 ${
                latestRecord.status === 'APPROVED'
                  ? 'text-emerald-400'
                  : latestRecord.status === 'REJECTED'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}>
                {latestRecord.status === 'APPROVED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    APPROVED
                  </>
                ) : latestRecord.status === 'REJECTED' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    REJECTED
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    PENDING APPROVAL
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Security Policy Info Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
            <p className="font-bold text-amber-300">
              Access Governance Notice:
            </p>
            <p>
              To maintain academic data integrity and prevent unauthorized access, all new accounts remain pending until reviewed by the Registrar or System Administrator.
            </p>
          </div>
        </div>

        {/* Status Message feedback if any */}
        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs font-semibold mb-4 text-center border ${
            statusMessage.includes('APPROVED')
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : statusMessage.includes('REJECTED')
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
          }`}>
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Refresh / Check Status */}
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking Status...' : 'Check Approval Status'}</span>
          </button>

          {/* Login as Admin to review */}
          <button
            type="button"
            onClick={handleLoginAsAdmin}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In as Administrator to Review</span>
          </button>

          {/* Back to sign in */}
          <button
            type="button"
            onClick={clearPendingApproval}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Sign In</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-center text-slate-500 mt-4">
          Office of Registrar • Metropolitan University Sylhet • Support: registrar@metrouni.edu.bd
        </p>
      </div>
    </div>
  );
};
