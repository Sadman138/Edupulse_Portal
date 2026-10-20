import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  CheckCircle2,
  Lock,
  GraduationCap,
  School,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Mail,
  User,
  Sparkles,
  RotateCw
} from 'lucide-react';
import { EmailOtpVerificationModal } from './EmailOtpVerificationModal';
import { signInWithRealGoogle } from '../../services/firebaseAuth';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'SIGN_IN' | 'SIGN_UP';
  initialRole?: UserRole;
  preloadedGoogleUser?: {
    name: string;
    email: string;
    photoURL?: string;
    accessToken?: string;
  } | null;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialRole = 'STUDENT',
  preloadedGoogleUser = null
}) => {
  const { loginWithGoogle, registeredUsers } = useApp();

  // Mode & Loading States
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Authenticated Real Google Profile (if newly picked from Google popup or preloaded)
  const [realGoogleUser, setRealGoogleUser] = useState<{
    name: string;
    email: string;
    photoURL?: string;
    accessToken?: string;
  } | null>(preloadedGoogleUser || null);

  // Sync when preloadedGoogleUser changes
  React.useEffect(() => {
    if (preloadedGoogleUser) {
      setRealGoogleUser(preloadedGoogleUser);
    }
  }, [preloadedGoogleUser]);

  // Registration Fields
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [studentId, setStudentId] = useState('241-115-211');
  const [employeeId, setEmployeeId] = useState('FAC-CSE-042');
  const [department, setDepartment] = useState('CSE');

  // Email OTP verification state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingGooglePayload, setPendingGooglePayload] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
    role: UserRole;
    studentId?: string;
    employeeId?: string;
    department?: string;
    accessToken?: string;
  } | null>(null);

  if (!isOpen) return null;

  // Preset demo accounts for quick testing
  const demoAccounts = [
    {
      name: 'Fathin Sadman',
      email: 'fathinanzumsadman@gmail.com',
      designatedRole: 'STUDENT' as UserRole,
      idTag: 'ID: 241-115-211',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      badge: 'Student Account (Student Portal)',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      name: 'Dr. Fahim Ahmed',
      email: 'fahim.cse@metrouni.edu.bd',
      designatedRole: 'TEACHER' as UserRole,
      idTag: 'EMP: FAC-CSE-042',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      badge: 'Faculty Member (Teacher Console)',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      name: 'Prof. Dr. M. Rahman',
      email: 'admin.registrar@metrouni.edu.bd',
      designatedRole: 'ADMIN' as UserRole,
      idTag: 'ROLE: REGISTRAR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      badge: 'Registrar (Admin Console)',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }
  ];

  /**
   * Real Google Sign-In / Account Picker Popup
   * Uses standard Google Auth (false = zero warnings, no sensitive scope)
   */
  const handleLaunchGooglePopup = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithRealGoogle();
      if (!result) return;

      const { email: gEmail, displayName: gName, photoURL: gPhoto, accessToken } = result;

      // Check if this Google email is already registered in the system
      const existing = registeredUsers.find(
        u => u.email.trim().toLowerCase() === gEmail.trim().toLowerCase()
      );

      if (existing) {
        // User already has an account
        const res = loginWithGoogle(
          {
            name: existing.name || gName,
            email: gEmail,
            role: existing.role,
            avatarUrl: gPhoto
          },
          false
        );

        if (!res.success && !res.pending) {
          setErrorMsg(res.error || 'Login failed.');
          return;
        }
        onClose();
      } else {
        // New Google user: prompt for role & ID confirmation
        setRealGoogleUser({
          name: gName || 'Google User',
          email: gEmail,
          photoURL: gPhoto,
          accessToken
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      setErrorMsg(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /**
   * Register directly using Google Verified Identity (instant, zero warnings)
   */
  const handleDirectRegisterGoogle = () => {
    if (!realGoogleUser) return;
    setErrorMsg(null);

    const payload = {
      name: realGoogleUser.name,
      email: realGoogleUser.email,
      avatarUrl: realGoogleUser.photoURL,
      role: selectedRole,
      studentId: selectedRole === 'STUDENT' ? studentId : undefined,
      employeeId: selectedRole !== 'STUDENT' ? employeeId : undefined,
      department: department || 'CSE'
    };

    const res = loginWithGoogle(payload, true);
    if (!res.success && !res.pending) {
      setErrorMsg(res.error || 'Google registration failed.');
      return;
    }
    onClose();
  };

  /**
   * Submit registration for newly authenticated Google account
   */
  const handleSendVerificationCode = () => {
    if (!realGoogleUser) return;
    setErrorMsg(null);

    const payload = {
      name: realGoogleUser.name,
      email: realGoogleUser.email,
      avatarUrl: realGoogleUser.photoURL,
      role: selectedRole,
      studentId: selectedRole === 'STUDENT' ? studentId : undefined,
      employeeId: selectedRole !== 'STUDENT' ? employeeId : undefined,
      department: department || 'CSE',
      accessToken: realGoogleUser.accessToken
    };

    setPendingGooglePayload(payload);
    setOtpModalOpen(true);
  };

  /**
   * When OTP verified, register account into PENDING approval state
   */
  const handleOtpVerified = () => {
    if (!pendingGooglePayload) return;
    setOtpModalOpen(false);
    const res = loginWithGoogle(pendingGooglePayload, true);
    if (!res.success && !res.pending) {
      setErrorMsg(res.error || 'Google registration failed.');
      return;
    }
    onClose();
  };

  /**
   * Instant login with Demo account (offline/testing)
   */
  const handleSelectDemoAccount = (acc: typeof demoAccounts[0]) => {
    const payload = {
      name: acc.name,
      email: acc.email,
      avatarUrl: acc.avatar,
      role: acc.designatedRole,
      studentId: acc.designatedRole === 'STUDENT' ? '241-115-211' : undefined,
      employeeId: acc.designatedRole === 'TEACHER' ? 'FAC-CSE-042' : 'REG-ADMIN-01',
      department: 'CSE'
    };
    loginWithGoogle(payload, false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-800 text-center relative bg-[#090e1a]">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Brand SVG */}
            <div className="flex justify-center mb-2.5">
              <svg className="w-9 h-9" viewBox="0 0 24 24">
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
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              {realGoogleUser ? 'Complete University Registration' : 'Google Authentication'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {realGoogleUser
                ? 'Specify your role and institutional ID to finish setting up your account'
                : 'Select your Google account to log in or register with verified Gmail delivery'}
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            {/* Case 1: Google account newly connected via popup -> Show Role & Institutional ID configuration */}
            {realGoogleUser ? (
              <div className="space-y-4">
                {/* Connected Account Card */}
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3">
                  {realGoogleUser.photoURL ? (
                    <img
                      src={realGoogleUser.photoURL}
                      alt={realGoogleUser.name}
                      className="w-12 h-12 rounded-full border border-cyan-400 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-base">
                      {realGoogleUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm truncate">
                        {realGoogleUser.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Verified Google
                      </span>
                    </div>
                    <p className="text-xs text-cyan-300 font-mono truncate">
                      {realGoogleUser.email}
                    </p>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Select University Role:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('STUDENT')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        selectedRole === 'STUDENT'
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${selectedRole === 'STUDENT' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Student</div>
                        <div className="text-[10px] text-slate-400">Courses, Grades & Advice</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('TEACHER')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        selectedRole === 'TEACHER'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${selectedRole === 'TEACHER' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Faculty / Teacher</div>
                        <div className="text-[10px] text-slate-400">Assessment & Advising</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Institutional Identification */}
                {selectedRole === 'STUDENT' ? (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Student ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 241-115-211"
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Faculty / Employee ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FAC-CSE-042"
                      value={employeeId}
                      onChange={e => setEmployeeId(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Academic Department
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="CSE">Computer Science & Engineering (CSE)</option>
                    <option value="EEE">Electrical & Electronic Engineering (EEE)</option>
                    <option value="BBA">Business Administration</option>
                    <option value="ENG">Department of English</option>
                  </select>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDirectRegisterGoogle}
                    className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Registration as {selectedRole}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Or Verify with 6-Digit Code</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Case 2: Standard Google Login Screen */
              <div className="space-y-4">
                {/* Primary Real Google Sign-in button */}
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleLaunchGooglePopup}
                  className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-3 border border-slate-200 cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <RotateCw className="w-5 h-5 text-cyan-600 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                    </svg>
                  )}
                  <span>
                    {isGoogleLoading
                      ? 'Opening Google Account Chooser...'
                      : 'Choose Your Google Account (Google Popup)'}
                  </span>
                </button>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Works with ANY personal or university Gmail account:</span>
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Click the button above to open Google's secure account chooser. You can select your logged-in Google account, or click the account dropdown / <strong>"Use another account"</strong> to sign up with any other Gmail address.
                  </p>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span className="bg-[#0f172a] px-3">Or quick testing demo accounts</span>
                  </div>
                </div>

                {/* Preset Demo Accounts */}
                <div className="space-y-2">
                  {demoAccounts.map(acc => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectDemoAccount(acc)}
                      className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${acc.badgeColor}`}>
                        {acc.designatedRole}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message display */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {realGoogleUser && (
              <button
                onClick={() => setRealGoogleUser(null)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Choose different Google account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email OTP Verification Modal */}
      <EmailOtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        email={pendingGooglePayload?.email || realGoogleUser?.email || ''}
        userName={pendingGooglePayload?.name || realGoogleUser?.name}
        accessToken={pendingGooglePayload?.accessToken || realGoogleUser?.accessToken}
        onVerifySuccess={handleOtpVerified}
      />
    </>
  );
};

export default GoogleAuthModal;
