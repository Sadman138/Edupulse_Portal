import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Zap,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  KeyRound,
  Building2,
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { SwitchAccountModal } from './SwitchAccountModal';

export const AuthScreen: React.FC = () => {
  const { switchUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');
  const [modalRole, setModalRole] = useState<UserRole>('STUDENT');
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center animate-fadeIn">
        {/* Brand Hero */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 ring-2 ring-white/10">
            <Zap className="w-9 h-9 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              EduPulse Platform
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Integrated Academic Performance, Dynamic QR Attendance & Rule-Based Early Warning System
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#121c32] border border-cyan-500/30 text-cyan-300 text-[11px] font-medium">
              <Building2 className="w-3.5 h-3.5" />
              <span>Metropolitan University &bull; CSE Department</span>
            </div>
          </div>
        </div>

        {/* 3 Strict Role-Isolated Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Student Card */}
          <div className="p-6 rounded-3xl bg-[#101726] border border-[#1d273a] hover:border-cyan-500/50 shadow-xl flex flex-col justify-between transition-all group hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  STUDENT ONLY
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  PORTAL 01
                </span>
                <h3 className="text-base font-bold text-white">Student Portal</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access personal academic performance, attendance telemetry, assignments & notices PDF downloads.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-[#192336] space-y-2 relative z-10">
              <button
                type="button"
                onClick={() => switchUser('usr_stu_1')}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-between px-3.5 transition-all shadow-md shadow-cyan-600/25 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span className="truncate">Fathin Sadman (241-115-211)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => switchUser('usr_stu_2')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-between px-3.5 transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span className="truncate">Raiyan Chowdhury (241-115-210)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalRole('STUDENT');
                  setModalTab('login');
                  setModalOpen(true);
                }}
                className="w-full py-2 rounded-xl bg-[#141d30] hover:bg-[#1a2640] border border-[#233150] text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Student Login with Email/Pass</span>
              </button>
            </div>
          </div>

          {/* Teacher Card - Reserved for Week 5 */}
          <div className="p-6 rounded-3xl bg-[#101726] border border-[#1d273a] opacity-75 shadow-xl flex flex-col justify-between transition-all relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  WEEK 5 &bull; UPCOMING
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  PORTAL 02
                </span>
                <h3 className="text-base font-bold text-slate-300">Faculty & Teacher Portal</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dynamic 120s QR generator, manual attendance console, and continuous assessment grading desk (scheduled for Week 5).
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-[#192336] space-y-2 relative z-10">
              <div className="w-full py-2.5 rounded-xl bg-[#141d30] border border-[#233150] text-slate-400 text-xs font-semibold text-center">
                <span>Reserved for Week 5 Sprint</span>
              </div>
            </div>
          </div>

          {/* Admin Card - Reserved for Week 5 */}
          <div className="p-6 rounded-3xl bg-[#101726] border border-[#1d273a] opacity-75 shadow-xl flex flex-col justify-between transition-all relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  WEEK 5 &bull; UPCOMING
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  PORTAL 03
                </span>
                <h3 className="text-base font-bold text-slate-300">Dean & Admin Console</h3>
                <p className="text-xs text-slate-400 mt-1">
                  CSV student roster import, course allocations, departmental CRUD, and early warning config (scheduled for Week 5).
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-[#192336] space-y-2 relative z-10">
              <div className="w-full py-2.5 rounded-xl bg-[#141d30] border border-[#233150] text-slate-400 text-xs font-semibold text-center">
                <span>Reserved for Week 5 Sprint</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSwitchModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#162035] hover:bg-[#1f2d4a] text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Switch Account Profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModalTab('login');
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#162035] hover:bg-[#1f2d4a] text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Sign In with ID / Password</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModalTab('register');
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-600/25"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Account</span>
          </button>
        </div>

        <AuthModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialTab={modalTab}
          initialRole={modalRole}
        />

        <SwitchAccountModal
          isOpen={switchModalOpen}
          onClose={() => setSwitchModalOpen(false)}
          onOpenLogin={() => {
            setModalTab('login');
            setModalOpen(true);
          }}
          onOpenRegister={() => {
            setModalTab('register');
            setModalOpen(true);
          }}
        />
      </div>
    </div>
  );
};
