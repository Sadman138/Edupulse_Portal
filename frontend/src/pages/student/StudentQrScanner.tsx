import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  ShieldAlert,
  ArrowRight,
  SwitchCamera,
  UploadCloud,
  Play,
  Square,
  Sparkles
} from 'lucide-react';

export const StudentQrScanner: React.FC = () => {
  const { studentCourses, recordQrAttendance, qrSession, setActiveTab, theme } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(studentCourses[0]?.courseCode || 'CSE 311');
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Camera stream and scanning state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scannedCodeData, setScannedCodeData] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Remaining seconds calculation against teacher's qrSession
  const [remainingSessionSeconds, setRemainingSessionSeconds] = useState<number>(0);

  const isLight = theme.mode === 'light';

  useEffect(() => {
    if (!qrSession || !qrSession.isActive) {
      setRemainingSessionSeconds(0);
      return;
    }

    const calc = () => {
      const elapsed = Math.floor((Date.now() - (qrSession.createdTimestamp || Date.now())) / 1000);
      const rem = Math.max(0, (qrSession.expiresInSeconds || 300) - elapsed);
      setRemainingSessionSeconds(rem);
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [qrSession]);

  // Start Real Device Camera
  const startCamera = async () => {
    setCameraError(null);
    setFeedback(null);
    setScannedCodeData(null);

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser or device.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      startScanningLoop();
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera permissions in your browser to scan the attendance QR.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device. You can also upload a photo of the QR code below.'
          : `Unable to access camera: ${err.message || 'Check camera permissions'}.`
      );
      setIsCameraActive(false);
    }
  };

  // Stop Device Camera
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Continuous frame scanning loop with jsQR
  const startScanningLoop = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        const decodedPayload = code.data.trim();
        setScannedCodeData(decodedPayload);

        // Process Attendance with scanned payload
        stopCamera();
        processScannedPayload(decodedPayload);
      }
    }, 150);
  };

  // Fallback: Scan QR from an uploaded photo or snapshot
  const handleImageUploadScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          processScannedPayload(code.data.trim());
        } else {
          setFeedback({
            success: false,
            message: 'No valid QR code detected in this image. Please capture the QR clearly.'
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processScannedPayload = (payload: string) => {
    // 1. If teacher session has expired or is inactive
    if (!qrSession || !qrSession.isActive || remainingSessionSeconds <= 0) {
      setFeedback({ success: false, message: 'QR Code Expired.' });
      return;
    }

    // 2. Pass payload to backend/context verification
    const result = recordQrAttendance(selectedCourse, payload);
    const msg = result.message.endsWith('.') ? result.message : `${result.message}.`;
    setFeedback({
      success: result.success,
      message: msg
    });
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
    if (isCameraActive) {
      setTimeout(() => startCamera(), 100);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Real Camera QR Attendance Gateway</span>
        </div>
        <h2
          style={{ color: 'var(--ep-text-primary, #ffffff)' }}
          className="text-2xl sm:text-3xl font-black tracking-tight"
        >
          Live Camera QR Attendance Scanner
        </h2>
        <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold">
          Camera stream decodes dynamic QR codes in real-time. Manual check-ins without camera scan are disabled.
        </p>
      </div>

      {/* Select Course Target */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
      >
        <div>
          <label
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-xs font-bold block"
          >
            Select Enrolled Subject:
          </label>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-[11px] font-medium">
            Attendance will be recorded for this course session
          </p>
        </div>

        <select
          value={selectedCourse}
          onChange={e => {
            setSelectedCourse(e.target.value);
            setFeedback(null);
          }}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold border transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
          }`}
        >
          {studentCourses.map(c => (
            <option key={c.courseId} value={c.courseCode}>
              {c.courseCode} — {c.courseTitle}
            </option>
          ))}
          <option value="PHY 101">PHY 101: Engineering Physics (Un-enrolled Test)</option>
        </select>
      </div>

      {/* Camera Viewfinder with Real Video Stream */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: isCameraActive ? theme.accentColor : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="relative overflow-hidden rounded-3xl border-2 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-2xl transition-all"
      >
        {/* Hidden off-screen canvas for frame extraction */}
        <canvas ref={canvasRef} className="hidden" />

        {isCameraActive ? (
          <div className="relative w-full max-w-md aspect-video sm:aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">
            {/* Real device video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-cyan-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-5 h-5 border-t-4 border-l-4 border-cyan-400 rounded-tl" />
                <div className="w-5 h-5 border-t-4 border-r-4 border-cyan-400 rounded-tr" />
              </div>

              {/* Animated laser scan line */}
              <div
                style={{ background: `linear-gradient(to right, transparent, ${theme.accentColor}, transparent)` }}
                className="w-full h-1 animate-pulse blur-xs shadow-lg"
              />

              <div className="flex justify-between">
                <div className="w-5 h-5 border-b-4 border-l-4 border-cyan-400 rounded-bl" />
                <div className="w-5 h-5 border-b-4 border-r-4 border-cyan-400 rounded-br" />
              </div>
            </div>

            <div className="absolute bottom-3 inset-x-4 bg-slate-950/80 text-white text-[11px] font-mono py-1 rounded-full text-center backdrop-blur-sm border border-slate-700/60 font-bold">
              Scanning video stream... Hold steady at teacher's QR
            </div>
          </div>
        ) : (
          /* Camera Off Placeholder */
          <div className={`relative w-full max-w-md aspect-video sm:aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center ${
            isLight
              ? 'border-slate-300 bg-slate-100/70'
              : 'border-slate-700/80 bg-slate-900/30'
          }`}>
            <Camera className="w-14 h-14 text-cyan-500 mb-3 animate-pulse" />
            <h4
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-base"
            >
              Device Camera is Inactive
            </h4>
            <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs max-w-xs mt-1 font-semibold">
              Click "Open Camera Scanner" to start your device webcam / phone camera and scan the dynamic classroom QR
            </p>

            <button
              onClick={startCamera}
              style={{ backgroundColor: theme.accentColor }}
              className="mt-5 px-5 py-2.5 rounded-xl !text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:brightness-110 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Open Camera Scanner</span>
            </button>
          </div>
        )}

        {/* Camera Control Actions */}
        {isCameraActive && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={toggleFacingMode}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <SwitchCamera className="w-4 h-4 text-cyan-500" />
              <span>Flip Camera ({facingMode === 'environment' ? 'Back' : 'Front'})</span>
            </button>

            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Camera</span>
            </button>
          </div>
        )}

        {/* Camera Error Message */}
        {cameraError && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 max-w-md text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Alternative Photo Upload if user has no webcam */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 w-full max-w-md flex items-center justify-between gap-3 text-xs">
          <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
            Or upload photo of teacher's QR:
          </span>
          <label
            style={{
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))',
              color: 'var(--ep-text-primary, #ffffff)'
            }}
            className="px-3 py-1.5 rounded-xl border font-bold text-xs cursor-pointer hover:border-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select QR Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUploadScan}
              className="hidden"
            />
          </label>
        </div>

        {/* Dynamic 5-minute countdown indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Active Teacher Session:</span>
          {qrSession?.isActive && remainingSessionSeconds > 0 ? (
            <span className="font-mono font-black text-emerald-400 text-sm">
              {Math.floor(remainingSessionSeconds / 60)}:{(remainingSessionSeconds % 60).toString().padStart(2, '0')} min remaining
            </span>
          ) : (
            <span className="font-mono font-bold text-rose-400">
              No Active 5-min Session
            </span>
          )}
        </div>
      </div>

      {/* Result Feedback Banner */}
      {feedback && (
        <div
          className={`p-5 rounded-2xl border flex items-center gap-4 transition-all shadow-xl ${
            feedback.success
              ? isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : isLight
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          )}
          <div className="text-xs">
            <h4 className="font-black text-sm">
              {feedback.success ? 'Attendance Status' : 'Verification Rejection'}
            </h4>
            <p className="mt-1 font-extrabold text-sm tracking-wide">
              {feedback.message}
            </p>
          </div>
        </div>
      )}

      {/* Strict Policy Card */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs shadow-md"
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
            Strict attendance security: Valid camera optical decode required. Token tampering or expired session bypass is strictly rejected.
          </span>
        </div>

        <button
          onClick={() => setActiveTab('attendance')}
          className="text-cyan-500 hover:text-cyan-400 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Attendance Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
