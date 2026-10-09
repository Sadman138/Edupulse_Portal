import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import { X, GraduationCap, School, ShieldCheck, Check } from 'lucide-react';

export const SwitchAccountModal: React.FC = () => {
  const { isSwitchAccountModalOpen, setIsSwitchAccountModalOpen, currentUser, switchRole } = useApp();

  if (!isSwitchAccountModalOpen) return null;

  const accounts = [
    {
      role: 'STUDENT' as UserRole,
      title: 'Student Portal',
      user: DEMO_USERS.student,
      icon: GraduationCap,
      badge: 'Academic Student',
      color: 'from-blue-600/30 to-indigo-600/20 border-blue-500/30 text-blue-400',
      description: 'Course registration, SGPA/CGPA, Dynamic QR scanner, attendance & assignments.'
    },
    {
      role: 'TEACHER' as UserRole,
      title: 'Faculty / Teacher Console',
      user: DEMO_USERS.teacher,
      icon: School,
      badge: 'Faculty Member',
      color: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      description: 'Dynamic QR attendance generator, manual roster, CSV grade entry, verification desk & risk alerts.'
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'University Admin Console',
      user: DEMO_USERS.admin,
      icon: ShieldCheck,
      badge: 'Academic Registrar',
      color: 'from-purple-600/30 to-pink-600/20 border-purple-500/30 text-purple-400',
      description: 'Institutional KPI metrics, CRUD for Departments, Semesters, Courses, Instructors, Students & Allocations.'
    }
  ];

  const handleSelect = (role: UserRole) => {
    switchRole(role);
    setIsSwitchAccountModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032]">
          <div>
            <h3 className="font-semibold text-white text-base">Switch Role / Demo Persona</h3>
            <p className="text-xs text-slate-400">Instantly test Student, Teacher, or Admin capabilities</p>
          </div>
          <button
            onClick={() => setIsSwitchAccountModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 space-y-3">
          {accounts.map(acc => {
            const isCurrent = currentUser.role === acc.role;
            const Icon = acc.icon;
            return (
              <div
                key={acc.role}
                onClick={() => handleSelect(acc.role)}
                className={`relative flex items-start gap-4 p-4 rounded-xl border bg-gradient-to-r cursor-pointer transition-all ${
                  acc.color
                } ${
                  isCurrent
                    ? 'ring-2 ring-indigo-500 border-indigo-400 shadow-lg'
                    : 'hover:border-slate-500 hover:scale-[1.01]'
                }`}
              >
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {acc.title}
                      {isCurrent && (
                        <span className="text-[10px] bg-indigo-500 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> ACTIVE
                        </span>
                      )}
                    </h4>
                    <span className="text-xs font-medium text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded border border-white/10">
                      {acc.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-300 mt-0.5">
                    {acc.user.name} <span className="text-slate-400 font-normal">({acc.user.email})</span>
                  </p>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{acc.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#162032] flex items-center justify-between text-xs text-slate-400">
          <span>Metropolitan University • EduPulse Auth Guard</span>
          <button
            onClick={() => setIsSwitchAccountModalOpen(false)}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
