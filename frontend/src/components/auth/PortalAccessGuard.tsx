import React from 'react';
import { ShieldAlert, LogIn, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface PortalAccessGuardProps {
  requiredRole: UserRole;
  attemptedViewName?: string;
  onOpenSwitchAccount: () => void;
}

export const PortalAccessGuard: React.FC<PortalAccessGuardProps> = ({
  requiredRole,
  attemptedViewName,
  onOpenSwitchAccount
}) => {
  const { currentUser, currentRole, setActiveNav } = useApp();

  const roleNameMap: Record<UserRole, string> = {
    STUDENT: 'Student Portal',
    TEACHER: 'Faculty / Teacher Portal',
    ADMIN: 'University Admin Console'
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-[#101726] border border-[#222d44] shadow-2xl text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
          Strict Portal Isolation Enforced
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Access Restricted: {roleNameMap[requiredRole]}
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          {attemptedViewName
            ? `You attempted to access "${attemptedViewName}". `
            : 'You attempted to access a protected portal. '}
          By university academic policy, <strong>students can only access the Student Portal</strong>, faculty members can only access the Teacher Portal, and administrators can only access the Admin Portal.
        </p>
      </div>

      {/* User Context Card */}
      <div className="bg-[#151c2e] p-4 rounded-2xl border border-[#1e273a] text-left flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
            {currentUser?.avatarInitials || 'MU'}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentUser?.name || 'Authenticated User'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-slate-800 text-slate-300">
                {currentRole}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              ID: {currentUser?.idNumber || 'N/A'} &bull; {currentUser?.departmentName || 'Computer Science & Engineering'}
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Role Mismatch</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setActiveNav('dashboard')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1d273c] hover:bg-[#25324d] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Return to My {roleNameMap[currentRole]}</span>
        </button>

        <button
          onClick={onOpenSwitchAccount}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors shadow-lg shadow-cyan-600/20 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Switch to Authorized Account</span>
        </button>
      </div>

      <div className="pt-4 border-t border-[#1d273a] text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Metropolitan University Central Role-Based Access Gate (RBAC v3.4)</span>
      </div>
    </div>
  );
};
