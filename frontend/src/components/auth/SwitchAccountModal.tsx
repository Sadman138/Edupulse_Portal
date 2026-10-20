import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  GraduationCap,
  School,
  ShieldCheck,
  Lock,
  LogOut,
  Mail,
  Building,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export const SwitchAccountModal: React.FC = () => {
  const { isSwitchAccountModalOpen, setIsSwitchAccountModalOpen, currentUser, logout } = useApp();

  if (!isSwitchAccountModalOpen) return null;

  const getRoleIcon = () => {
    if (currentUser.role === 'TEACHER') return School;
    if (currentUser.role === 'ADMIN') return ShieldCheck;
    return GraduationCap;
  };

  const RoleIcon = getRoleIcon();

  const handleLogoutAndSwitch = () => {
    setIsSwitchAccountModalOpen(false);
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d1527] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090f1d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Account Security & Role Scope</h3>
              <p className="text-[11px] text-slate-400">Metropolitan University • EduPulse Access Control</p>
            </div>
          </div>
          <button
            onClick={() => setIsSwitchAccountModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Profile */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#111c33] border border-cyan-500/30 flex items-start gap-4">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-cyan-400 shrink-0 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md shrink-0">
                <RoleIcon className="w-7 h-7" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-white text-base truncate">{currentUser.name}</h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  {currentUser.role}
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono">{currentUser.email}</span>
              </p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {currentUser.role === 'STUDENT'
                    ? `ID: ${currentUser.studentId || '241-115-211'}`
                    : currentUser.role === 'TEACHER'
                    ? `EMP: ${currentUser.employeeId || 'FAC-CSE-042'}`
                    : `ADMIN: ${currentUser.employeeId || 'REG-ADMIN-01'}`}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-500" />
                  <span>Dept: {currentUser.department || 'CSE'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Strict Role Isolation Notice */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Strict Role-Based Access Isolation:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              University security policy strictly isolates portals:
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-5">
              <li><strong>Student:</strong> Cannot access Teacher Console or Administrator Panel.</li>
              <li><strong>Teacher:</strong> Cannot access Student Portal or Administrator Panel.</li>
              <li><strong>Admin:</strong> Cannot access Student or Teacher operational desks.</li>
            </ul>
            <p className="text-[11px] text-cyan-300 font-medium pt-1">
              To enter a different role (Teacher, Admin, or Student), please log out from this account and sign in with the appropriate credentials.
            </p>
          </div>
        </div>

        {/* Footer with Logout action */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#090f1d] flex items-center justify-between">
          <button
            onClick={() => setIsSwitchAccountModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Stay Signed In
          </button>

          <button
            onClick={handleLogoutAndSwitch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out to Switch Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchAccountModal;
