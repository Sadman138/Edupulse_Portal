import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  X,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  initialRole = 'STUDENT'
}) => {
  const { login, register, switchUser } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [role, setRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    setTab(initialTab);
    setRole(initialRole);
  }, [initialTab, initialRole, isOpen]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regSemester, setRegSemester] = useState('6th Semester');
  const [regBatch, setRegBatch] = useState('58th Batch');
  const [regSection, setRegSection] = useState('Section A');
  const [regDesignation, setRegDesignation] = useState('Assistant Professor');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your University Email or Student / Faculty ID.');
      return;
    }
    const res = login(loginIdentifier, loginPassword);
    if (res.success) {
      setLoginSuccess(res.message);
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setLoginError(res.message);
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchUser(userId);
    setLoginSuccess('Logged in via Quick Demo Account!');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    if (!regName.trim() || !regEmail.trim() || !regIdNumber.trim()) {
      setRegError('Please complete all mandatory profile fields.');
      return;
    }
    if (regPassword && regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    const res = register({
      name: regName,
      email: regEmail,
      idNumber: regIdNumber,
      password: regPassword || 'password123',
      role,
      departmentId:
        regDepartment === 'Computer Science & Engineering'
          ? 'dept_cse'
          : regDepartment === 'Electrical & Electronic Engineering'
          ? 'dept_eee'
          : regDepartment === 'Business Administration'
          ? 'dept_bba'
          : 'dept_eng',
      departmentName: regDepartment,
      semester: role === 'STUDENT' ? regSemester : undefined,
      batch: role === 'STUDENT' ? regBatch : undefined,
      section: role === 'STUDENT' ? regSection : undefined,
      designation: role !== 'STUDENT' ? regDesignation : undefined
    });
    if (res.success) {
      setRegSuccess(res.message);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setRegError(res.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f1524] border border-[#232f48] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1b253b] bg-[#131b2e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {tab === 'login' ? 'Sign In to EduPulse' : 'Create New University Account'}
              </h3>
              <p className="text-xs text-slate-400">
                Metropolitan University Academic Gateway & Access Control
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a2336] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="px-6 pt-4 bg-[#0f1524] shrink-0">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#090e1a] border border-[#1b253b]">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setLoginError(null);
                setRegError(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setLoginError(null);
                setRegError(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (Create Profile)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {tab === 'login' ? (
            <div className="space-y-4">
              {/* Quick 1-Click Demo Logins - 2 Demo Student Accounts */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Official Demo Student Accounts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Student 1 */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr_stu_1')}
                    className="p-3 rounded-2xl bg-[#141d30] hover:bg-[#1a2640] border border-[#22304d] hover:border-cyan-500/50 text-left transition-all cursor-pointer group shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">Fathin Sadman</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">241-115-211</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-cyan-400 group-hover:underline shrink-0">
                      Sign In &rarr;
                    </span>
                  </button>

                  {/* Student 2 */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr_stu_2')}
                    className="p-3 rounded-2xl bg-[#141d30] hover:bg-[#1a2640] border border-[#22304d] hover:border-indigo-500/50 text-left transition-all cursor-pointer group shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">Raiyan Chowdhury</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">241-115-210</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-400 group-hover:underline shrink-0">
                      Sign In &rarr;
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600 text-xs">
                <div className="flex-1 h-px bg-[#1d273a]" />
                <span className="font-mono text-[10px] uppercase">Or Enter Credentials</span>
                <div className="flex-1 h-px bg-[#1d273a]" />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Email or Student / Faculty ID</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 241-115-211 or fathin.sadman@metrouni.edu.bd"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Password</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Demo: password123</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In to EduPulse Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Select Account Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'STUDENT'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20 font-bold'
                        : 'bg-[#141d30] border-[#22304d] text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="text-[11px] block">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('TEACHER')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'TEACHER'
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm shadow-sky-500/20 font-bold'
                        : 'bg-[#141d30] border-[#22304d] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                    <span className="text-[11px] block">Teacher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'ADMIN'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm shadow-purple-500/20 font-bold'
                        : 'bg-[#141d30] border-[#22304d] text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                    <span className="text-[11px] block">Admin</span>
                  </button>
                </div>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Raiyan Chowdhury"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {role === 'STUDENT'
                        ? 'Student ID *'
                        : role === 'TEACHER'
                        ? 'Faculty ID *'
                        : 'Admin ID *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        role === 'STUDENT'
                          ? 'e.g. 241-115-210'
                          : role === 'TEACHER'
                          ? 'e.g. FAC-CSE-099'
                          : 'e.g. ADM-SYS-002'
                      }
                      value={regIdNumber}
                      onChange={(e) => setRegIdNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">University Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@metrouni.edu.bd"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Department</label>
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Electrical & Electronic Engineering">EEE</option>
                      <option value="Business Administration">BBA</option>
                      <option value="Department of English">English</option>
                    </select>
                  </div>

                  {role === 'STUDENT' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Current Semester</label>
                      <select
                        value={regSemester}
                        onChange={(e) => setRegSemester(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        {[
                          '1st Semester',
                          '2nd Semester',
                          '3rd Semester',
                          '4th Semester',
                          '5th Semester',
                          '6th Semester',
                          '7th Semester',
                          '8th Semester'
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Associate Professor"
                        value={regDesignation}
                        onChange={(e) => setRegDesignation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>

                {role === 'STUDENT' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Batch / Intake</label>
                      <select
                        value={regBatch}
                        onChange={(e) => setRegBatch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        {['56th Batch', '57th Batch', '58th Batch', '59th Batch', '60th Batch', '61st Batch', '62nd Batch'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Academic Section</label>
                      <select
                        value={regSection}
                        onChange={(e) => setRegSection(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        {['Section A', 'Section B', 'Section C', 'Section D'].map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-[#1d273a] text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Create Account & Enter Console</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0f1d] border-t border-[#1b253b] text-center text-[11px] text-slate-500 flex items-center justify-between px-6 shrink-0">
          <span>EduPulse v2.4 &bull; Metropolitan University</span>
          <span>Role-Based Access Control (RBAC)</span>
        </div>
      </div>
    </div>
  );
};
