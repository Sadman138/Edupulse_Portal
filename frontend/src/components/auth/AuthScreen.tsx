import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  School,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  User,
  ShieldAlert,
  Zap,
  CheckCircle2,
  RotateCw
} from 'lucide-react';
import { GoogleAuthModal } from './GoogleAuthModal';
import { EmailOtpVerificationModal } from './EmailOtpVerificationModal';
import { signInWithRealGoogle } from '../../services/firebaseAuth';

export const AuthScreen: React.FC = () => {
  const { login, registerAccount, registeredUsers } = useApp();

  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  // Form Fields
  const [fullName, setFullName] = useState('Fathin Sadman');
  const [email, setEmail] = useState('student@metrouni.edu.bd');
  const [password, setPassword] = useState('password123');
  const [idNumber, setIdNumber] = useState('241-115-211');
  const [department, setDepartment] = useState('CSE');
  const [errorMessage, setErrorMessage] = useState('');

  // Google Direct Auth State
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | undefined>(undefined);

  // Modals
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingRegistrationPayload, setPendingRegistrationPayload] = useState<{
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    studentId?: string;
    employeeId?: string;
    department?: string;
    authProvider: 'GOOGLE' | 'EMAIL';
  } | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'STUDENT') {
      setEmail('student@metrouni.edu.bd');
      setIdNumber('241-115-211');
      setFullName('Fathin Sadman');
      setPassword('password123');
    } else if (role === 'TEACHER') {
      setEmail('fahim.cse@metrouni.edu.bd');
      setIdNumber('FAC-CSE-042');
      setFullName('Dr. Fahim Ahmed');
      setPassword('password123');
    } else if (role === 'ADMIN') {
      setEmail('admin.registrar@metrouni.edu.bd');
      setIdNumber('REG-ADMIN-01');
      setFullName('Prof. Dr. M. Rahman');
      setPassword('password123');
    }
  };

  /**
   * Direct Real Google Sign In / Sign Up Handler
   * Triggers official Google OAuth popup
   */
  const handleDirectGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      // Standard Google OAuth (Profile + Email) - ZERO warnings, works for ALL users
      const googleResult = await signInWithRealGoogle();
      if (!googleResult) return;

      const { email: gEmail, displayName: gName, photoURL: gPhoto, accessToken } = googleResult;
      setGoogleAccessToken(accessToken);

      // Check if user already exists in registered database
      const existing = registeredUsers.find(
        u => u.email.trim().toLowerCase() === gEmail.trim().toLowerCase()
      );

      if (authMode === 'SIGN_IN') {
        if (!existing) {
          // If not registered yet, prompt to create account
          setErrorMessage(`Google account (${gEmail}) verified! Please select your role (Student / Teacher) and ID to complete registration.`);
          setFullName(gName);
          setEmail(gEmail);
          setAuthMode('SIGN_UP');
          return;
        }

        const res = login(gEmail, existing.role);
        if (!res.success && !res.pending) {
          setErrorMessage(res.error || 'Google sign-in failed.');
        }
      } else {
        // Sign-up with Google:
        // Google has already cryptographically verified their email address!
        const payload = {
          name: gName,
          email: gEmail,
          role: selectedRole,
          studentId: selectedRole === 'STUDENT' ? idNumber : undefined,
          employeeId: selectedRole !== 'STUDENT' ? idNumber : undefined,
          department,
          authProvider: 'GOOGLE' as const,
          avatarUrl: gPhoto
        };

        // Register directly into PENDING approval state (or trigger OTP if desired)
        const res = registerAccount(payload);
        if (!res.success && !res.pending) {
          setErrorMessage(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      setErrorMessage(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid university or personal email address.');
      return;
    }
    setErrorMessage('');

    if (authMode === 'SIGN_IN') {
      const res = login(email, selectedRole, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }

      // Prepare payload and trigger 6-digit email OTP verification before submitting to pending state!
      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        role: selectedRole,
        password,
        studentId: selectedRole === 'STUDENT' ? idNumber : undefined,
        employeeId: selectedRole !== 'STUDENT' ? idNumber : undefined,
        department,
        authProvider: 'EMAIL' as const
      };

      setPendingRegistrationPayload(payload);
      setOtpModalOpen(true);
    }
  };

  const handleOtpVerified = () => {
    if (!pendingRegistrationPayload) return;
    setOtpModalOpen(false);
    const res = registerAccount(pendingRegistrationPayload);
    if (!res.success && !res.pending) {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-[#0d1525]/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 mb-1">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">EduPulse</h1>
          <p className="text-[11px] text-cyan-400 font-bold tracking-wider uppercase">
            CSE Dept • Metropolitan University, Sylhet
          </p>
          <p className="text-xs text-slate-400">
            Academic Performance & Early Warning Platform
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => { setAuthMode('SIGN_IN'); setErrorMessage(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'SIGN_IN'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('SIGN_UP'); setErrorMessage(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'SIGN_UP'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Direct Google Authentication Button (Official Google Popup) */}
        <button
          type="button"
          disabled={isGoogleLoading}
          onClick={handleDirectGoogleAuth}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-3 border border-slate-200 mb-2 group cursor-pointer"
        >
          {isGoogleLoading ? (
            <RotateCw className="w-5 h-5 text-cyan-600 animate-spin" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
          )}
          <span>
            {isGoogleLoading
              ? 'Connecting to Google...'
              : authMode === 'SIGN_IN'
              ? 'Sign in with Google'
              : 'Sign up with Google'}
          </span>
        </button>

        <div className="flex items-center justify-center mb-4">
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Or choose pre-configured testing account</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Or with Institutional Account
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1.5 mb-4">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {authMode === 'SIGN_IN' ? 'Portal Access Scope:' : 'Register Account Role:'}
          </label>
          <div className={`grid ${authMode === 'SIGN_UP' ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl`}>
            <button
              type="button"
              onClick={() => handleRoleChange('STUDENT')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'STUDENT'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('TEACHER')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'TEACHER'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Teacher</span>
            </button>

            {authMode === 'SIGN_IN' && (
              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>

        {authMode === 'SIGN_UP' && (
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] mb-4 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-cyan-200">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Administrator Approval Mandatory:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              When creating an account as a Student or Teacher, your account will be placed in Pending status. Access is granted once verified and approved by the Registrar.
            </p>
          </div>
        )}

        {/* Strict RBAC Guard Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] mb-4 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Strict Role Isolation Enforced:</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Students cannot access Teacher or Administrator portals. Teachers cannot access Student or Administrator portals. Administrators operate exclusively in the Admin console.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'SIGN_UP' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Fathin Sadman"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="name@metrouni.edu.bd or name@gmail.com"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {authMode === 'SIGN_UP' && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {selectedRole === 'STUDENT' ? 'Student ID' : selectedRole === 'TEACHER' ? 'Faculty ID' : 'Admin Code'}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  required
                  placeholder="e.g. 241-115-211"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white uppercase font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
          >
            <span>
              {authMode === 'SIGN_IN'
                ? `Enter ${selectedRole} Portal`
                : `Continue Registration as ${selectedRole}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Evaluation & Demo Accounts */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Demo Credentials:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Pre-approved</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Student Demo */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-1">
                  <span>Student Demo</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">Student</span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono truncate">student@metrouni.edu.bd</p>
                <p className="text-[10px] text-slate-400 font-mono">Pass: <span className="text-white font-bold">student123</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('STUDENT');
                  login('student@metrouni.edu.bd', 'STUDENT', 'student123');
                }}
                className="mt-2 w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-[10px] font-bold transition-colors cursor-pointer"
              >
                1-Click Login
              </button>
            </div>

            {/* Teacher Demo */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                  <span>Teacher Demo</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Teacher</span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono truncate">teacher@metrouni.edu.bd</p>
                <p className="text-[10px] text-slate-400 font-mono">Pass: <span className="text-white font-bold">teacher123</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('TEACHER');
                  login('teacher@metrouni.edu.bd', 'TEACHER', 'teacher123');
                }}
                className="mt-2 w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-[10px] font-bold transition-colors cursor-pointer"
              >
                1-Click Login
              </button>
            </div>

            {/* Admin Demo */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-400 mb-1">
                  <span>Admin Demo</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Admin</span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono truncate">admin@metrouni.edu.bd</p>
                <p className="text-[10px] text-slate-400 font-mono">Pass: <span className="text-white font-bold">admin123</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('ADMIN');
                  login('admin@metrouni.edu.bd', 'ADMIN', 'admin123');
                }}
                className="mt-2 w-full py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500 hover:text-white text-purple-300 text-[10px] font-bold transition-colors cursor-pointer"
              >
                1-Click Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Sign In / Sign Up Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        mode={authMode}
        initialRole={selectedRole}
      />

      {/* Email Verification OTP Modal */}
      <EmailOtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        email={pendingRegistrationPayload?.email || email}
        userName={pendingRegistrationPayload?.name || fullName}
        accessToken={googleAccessToken}
        onVerifySuccess={handleOtpVerified}
      />
    </div>
  );
};
