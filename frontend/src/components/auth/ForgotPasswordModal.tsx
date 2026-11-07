import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { authApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onPasswordResetSuccess: (email: string, newPassword: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onPasswordResetSuccess
}) => {
  const { resetUserPassword } = useApp();

  const [step, setStep] = useState<'REQUEST_OTP' | 'VERIFY_AND_RESET' | 'SUCCESS'>('REQUEST_OTP');
  const [email, setEmail] = useState(initialEmail);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setStep('REQUEST_OTP');
      setCountdown(0);
    }
  }, [isOpen, initialEmail]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(cleanEmail);
      if (res.success) {
        setSuccessMessage(res.message || `A 6-digit reset code has been sent to ${cleanEmail}.`);
        setStep('VERIFY_AND_RESET');
        setCountdown(60);
      } else {
        setErrorMessage(res.error || 'Failed to dispatch reset code. Please check your email.');
        if (res.cooldownSeconds) {
          setCountdown(res.cooldownSeconds);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while sending the reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword(email.trim().toLowerCase());
      if (res.success) {
        setSuccessMessage(`New code sent to ${email}. Check your inbox.`);
        setCountdown(60);
      } else {
        setErrorMessage(res.error || 'Failed to resend code.');
        if (res.cooldownSeconds) {
          setCountdown(res.cooldownSeconds);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = otpCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await authApi.resetPassword({
        email: cleanEmail,
        code: cleanCode,
        newPassword
      });

      if (res.success) {
        // Sync local context state
        resetUserPassword(cleanEmail, newPassword);
        setStep('SUCCESS');
      } else {
        setErrorMessage(res.error || 'Password reset failed. Please check the code.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onPasswordResetSuccess(email.trim().toLowerCase(), newPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0d1525] border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-7 relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {step === 'SUCCESS' ? 'Password Reset Complete' : 'Forgot Password?'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Department of CSE • Metropolitan University
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Info Banner */}
        {successMessage && step !== 'SUCCESS' && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: Request OTP */}
        {step === 'REQUEST_OTP' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              Enter your registered Gmail or university email address. We will send a secure 6-digit confirmation code to verify your identity.
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="e.g. name@metrouni.edu.bd or name@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code (OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP and Set New Password */}
        {step === 'VERIFY_AND_RESET' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-sky-950/40 p-3 rounded-xl border border-sky-800 text-xs text-sky-200">
              A 6-digit code was sent to <strong className="text-white">{email}</strong>. Please check your inbox or spam folder.
            </div>

            {/* 6-Digit Code */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                6-Digit Security Code (OTP)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="123456"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-center text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-slate-400">Valid for 5 minutes</span>
                <button
                  type="button"
                  disabled={countdown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 font-semibold cursor-pointer"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                New Password <span className="text-slate-400 font-normal">(Min 6 characters)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Create your new password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-type new password"
                  className={`w-full bg-slate-950 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:ring-2 ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-rose-500 focus:ring-rose-500'
                      : confirmPassword && newPassword === confirmPassword
                      ? 'border-emerald-500 focus:ring-emerald-500'
                      : 'border-slate-700 focus:ring-cyan-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 p-0.5 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                  {newPassword === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passwords match
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Saving New Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update & Save Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 'SUCCESS' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white">Password Updated!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your EduPulse account password has been successfully reset. A confirmation notification has been sent to <strong className="text-cyan-400">{email}</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
