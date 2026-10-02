import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, RegisteredUser } from '../../types';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  X,
  UserPlus,
  LogIn,
  KeyRound,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface SwitchAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const SwitchAccountModal: React.FC<SwitchAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onOpenLogin
}) => {
  const { registeredUsers, currentUser, currentRole, login } = useApp();
  
  // State for password verification gate
  const [selectedUserForAuth, setSelectedUserForAuth] = useState<RegisteredUser | null>(null);
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInitiateSwitch = (user: RegisteredUser) => {
    if (currentUser?.id === user.id) {
      // Already active user
      onClose();
      return;
    }
    setSelectedUserForAuth(user);
    setPasswordInput('password123');
    setAuthError(null);
    setAuthSuccess(null);
  };

  const handleVerifyAndSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAuth) return;

    setAuthError(null);
    setAuthSuccess(null);

    // Call login with user's email and entered password
    const result = login(selectedUserForAuth.email, passwordInput);
    if (result.success) {
      setAuthSuccess(`Access Granted! Welcome to ${selectedUserForAuth.role} Portal, ${selectedUserForAuth.name}.`);
      setTimeout(() => {
        setSelectedUserForAuth(null);
        onClose();
      }, 700);
    } else {
      setAuthError('Access Denied: Incorrect password. You cannot enter this account without valid registered credentials.');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'TEACHER':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return <GraduationCap className="w-5 h-5 text-cyan-400" />;
      case 'TEACHER':
        return <Users className="w-5 h-5 text-sky-400" />;
      case 'ADMIN':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f1524] border border-[#232f48] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-[#1b253b] bg-[#131b2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Switch Portal & Account</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Password Protected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Registered email & password required to access another account or portal
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

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* PASSWORD VERIFICATION FORM (when a user profile is clicked) */}
          {selectedUserForAuth ? (
            <div className="bg-[#141d30] border border-[#233252] rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#1f2b45] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1b2742] border border-[#26375a] flex items-center justify-center">
                    {getRoleIcon(selectedUserForAuth.role)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{selectedUserForAuth.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${getRoleBadge(selectedUserForAuth.role)}`}>
                        {selectedUserForAuth.role}
                      </span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedUserForAuth.email} &bull; {selectedUserForAuth.idNumber}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserForAuth(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  title="Choose another account"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter Password to Unlock {selectedUserForAuth.role} Portal:</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  By university security policy, cross-account and cross-portal access is strictly locked without credentials.
                </p>
              </div>

              <form onSubmit={handleVerifyAndSwitch} className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter account password..."
                    className="w-full bg-[#0a0f1d] border border-[#25324d] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Demo Accounts Password: <strong className="text-cyan-400 font-mono">password123</strong></span>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserForAuth(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Back to List
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/25 cursor-pointer flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Verify & Unlock Portal</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ACCOUNT LIST VIEW (Profiles with locked state indicators) */
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Registered Profile to Authenticate:
                </span>
                <span className="text-[10px] text-amber-400/90 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  🔒 Password required
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {registeredUsers.filter((u) => u.role === 'STUDENT').map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  const isOtherRole = user.role !== currentRole;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleInitiateSwitch(user)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                          : 'bg-[#141d30] border-[#22304d] hover:bg-[#1a2640] hover:border-slate-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#1b2742] border border-[#26375a] flex items-center justify-center shrink-0">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">
                              {user.name}
                            </span>
                            {isCurrent ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 shrink-0">
                                ACTIVE NOW
                              </span>
                            ) : isOtherRole ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40 flex items-center gap-1 shrink-0">
                                <Lock className="w-2.5 h-2.5" />
                                <span>LOCKED</span>
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                            <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${getRoleBadge(user.role)}`}>
                              {user.role}
                            </span>
                            <span className="truncate">{user.idNumber}</span>
                            <span className="text-slate-500 hidden sm:inline">&bull; {user.departmentName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isCurrent ? (
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-cyan-300">
                            <span className="text-[11px] hidden sm:inline">Unlock</span>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row */}
          {!selectedUserForAuth && (
            <div className="pt-4 border-t border-[#1b253b] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#141d30] hover:bg-[#1a2640] border border-[#22304d] text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Enter Email & Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-purple-600/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register New Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
