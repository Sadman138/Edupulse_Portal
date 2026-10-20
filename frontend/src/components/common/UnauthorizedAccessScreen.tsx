import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, LogOut, Lock, ShieldCheck } from 'lucide-react';

interface UnauthorizedAccessScreenProps {
  attemptedTab?: string;
}

export const UnauthorizedAccessScreen: React.FC<UnauthorizedAccessScreenProps> = ({ attemptedTab }) => {
  const { currentUser, setActiveTab, logout } = useApp();

  const getRoleDefaultTab = () => {
    if (currentUser.role === 'STUDENT') return 'dashboard';
    if (currentUser.role === 'TEACHER') return 'teacher-dashboard';
    return 'admin-dashboard';
  };

  const getRoleDisplayName = () => {
    if (currentUser.role === 'STUDENT') return 'Student Portal';
    if (currentUser.role === 'TEACHER') return 'Faculty / Teacher Console';
    return 'Administrator Console';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0d1527] border border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-5 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold mb-4">
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>HTTP 403 • ROLE_ISOLATION_RESTRICTION</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
          Access Denied: Portal Restricted
        </h2>

        <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-lg mx-auto">
          You are currently logged in with a{' '}
          <span className="font-bold text-cyan-400 uppercase">{currentUser.role}</span> account ({currentUser.name}).
          You do not have administrative permission to view the requested resource
          {attemptedTab ? <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-900 text-rose-300 font-mono text-xs">[{attemptedTab}]</code> : ''}.
        </p>

        {/* Security Rule Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-[#090f1d] border border-slate-800 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>University Security Policy (Strict Role Isolation):</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 pl-5 list-disc">
            <li><strong className="text-slate-200">Student:</strong> Access limited to the Student Portal only (no access to Teacher or Admin consoles).</li>
            <li><strong className="text-slate-200">Teacher:</strong> Access limited to the Faculty Console only (no access to Student or Admin consoles).</li>
            <li><strong className="text-slate-200">Admin:</strong> Access limited to the Administrator Panel only (no access to Student or Teacher operational desks).</li>
          </ul>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab(getRoleDefaultTab())}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {getRoleDisplayName()}</span>
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-300 hover:text-rose-200 font-bold text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out & Switch User</span>
          </button>
        </div>
      </div>
    </div>
  );
};
