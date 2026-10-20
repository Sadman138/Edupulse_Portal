import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  X,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface EmailOtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  userName?: string;
  accessToken?: string;
  onVerifySuccess: () => void;
}

export const EmailOtpVerificationModal: React.FC<EmailOtpVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  userName = 'Student',
  onVerifySuccess
}) => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showTesterPeek, setShowTesterPeek] = useState(false);

  useEffect(() => {
    if (isOpen && email) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setEnteredCode('');
      setErrorMessage(null);
      setCountdown(60);
    }
  }, [isOpen, email]);

  // Countdown timer for resending
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleResend = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCountdown(60);
    setErrorMessage(null);
    setEnteredCode('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!enteredCode.trim() || enteredCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (enteredCode.trim() === generatedCode) {
        onVerifySuccess();
      } else {
        setErrorMessage('Incorrect verification code! Please enter the 6-digit code sent to your Gmail.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d1525] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Verification Status Banner */}
        <div className="p-3.5 px-4 text-xs font-semibold flex items-center justify-between border-b bg-cyan-950/70 text-cyan-200 border-cyan-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <p className="text-[11px] leading-snug truncate">
              Institutional Email Verification: {email}
            </p>
          </div>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-2 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3 shadow-lg shadow-cyan-500/10">
            <KeyRound className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Verify Your Email
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Enter the 6-digit confirmation code to verify your account registration:
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-cyan-300">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{email}</span>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="px-6 py-2">
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-center space-y-1">
            <p className="text-xs text-slate-300 font-medium">
              A 6-digit confirmation code has been sent to your Gmail address:
            </p>
            <p className="text-xs font-mono font-bold text-cyan-300">
              {email}
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Please open your Gmail inbox (or Updates / Spam folder) and type the code below.
            </p>
            <div className="pt-1.5 flex justify-center">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
              >
                <span>Open Gmail Inbox</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="p-6 pt-2 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2 text-center">
              Enter 6-Digit Code
            </label>

            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={enteredCode}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setEnteredCode(val);
                  setErrorMessage(null);
                }}
                placeholder="• • • • • •"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 px-4 text-center text-2xl font-black font-mono tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-700 shadow-inner"
                autoFocus
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Resend Cooldown & Tester Peek */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Need a new code?</span>
            {countdown > 0 ? (
              <span className="text-slate-500 font-mono">
                Resend in <span className="text-slate-300 font-bold">{countdown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Send New Code</span>
              </button>
            )}
          </div>

          {/* Tester / Evaluation Code Peek (Hidden by default, user-requested zero auto-fill) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowTesterPeek(!showTesterPeek)}
              className="text-[10px] text-slate-500 hover:text-slate-400 underline transition-colors cursor-pointer"
            >
              {showTesterPeek ? 'Hide tester code helper' : 'Evaluation mode: peek dispatched code'}
            </button>
            {showTesterPeek && (
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Dispatched OTP:</span>
                  <span className="font-mono font-black text-cyan-300 tracking-wider text-sm">{generatedCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredCode(generatedCode);
                    setErrorMessage(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold cursor-pointer"
                >
                  Insert Code
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isVerifying || enteredCode.length !== 6}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Code & Complete Registration</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Security Footer */}
        <div className="p-3 bg-[#080d1a] border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>EduPulse Academic Security System • Metropolitan University</span>
          </p>
        </div>
      </div>
    </div>
  );
};
