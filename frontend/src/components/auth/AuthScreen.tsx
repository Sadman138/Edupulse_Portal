import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { GraduationCap, School, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('student@metrouni.edu.bd');
  const [password, setPassword] = useState('••••••••');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'STUDENT') setEmail('student@metrouni.edu.bd');
    if (role === 'TEACHER') setEmail('tariqul.cse@metrouni.edu.bd');
    if (role === 'ADMIN') setEmail('admin.registrar@metrouni.edu.bd');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid university institutional email.');
      return;
    }
    setErrorMessage('');
    login(email, selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#111827]/90 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-xl p-8 relative z-10">
        {/* University Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2 shadow-lg shadow-indigo-600/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">EduPulse</h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Metropolitan University, Sylhet</p>
          <p className="text-xs text-slate-400">Academic Monitoring & Early Warning Platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('STUDENT')}
            className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'STUDENT'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('TEACHER')}
            className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'TEACHER'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('ADMIN')}
            className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Sign In to {selectedRole} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Info */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-2 font-medium">⚡ 1-Click Demo Evaluation Credentials:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => { setSelectedRole('STUDENT'); setEmail('student@metrouni.edu.bd'); login('student@metrouni.edu.bd', 'STUDENT'); }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              Student (Fathin)
            </button>
            <button
              onClick={() => { setSelectedRole('TEACHER'); setEmail('tariqul.cse@metrouni.edu.bd'); login('tariqul.cse@metrouni.edu.bd', 'TEACHER'); }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              Teacher (Dr. Tariqul)
            </button>
            <button
              onClick={() => { setSelectedRole('ADMIN'); setEmail('admin.registrar@metrouni.edu.bd'); login('admin.registrar@metrouni.edu.bd', 'ADMIN'); }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-purple-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              Admin (Registrar)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
