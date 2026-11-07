import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  GraduationCap,
  Award,
  CalendarCheck,
  BookOpen,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Clock,
  Radio,
  MapPin,
  User,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileText,
  Hourglass,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    studentCourses,
    routine,
    assignments,
    upcomingExams,
    syllabusChapters,
    setActiveTab,
    setPdfModalDoc,
    theme
  } = useApp();

  const isLight = theme.mode === 'light';

  // Live real-time tick for Bangladesh Time (updates every 10 seconds)
  const [bdTime, setBdTime] = useState<{
    weekday: string;
    timeString: string;
    totalMinutes: number;
    nowMs: number;
  }>({
    weekday: 'Sunday',
    timeString: '10:00 AM',
    totalMinutes: 600,
    nowMs: Date.now()
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).formatToParts(now);

      const hour24Parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).formatToParts(now);

      const weekday = parts.find(p => p.type === 'weekday')?.value || 'Sunday';
      const hour12 = parts.find(p => p.type === 'hour')?.value || '10';
      const minStr = parts.find(p => p.type === 'minute')?.value || '00';
      const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value || 'AM';

      const h24 = parseInt(hour24Parts.find(p => p.type === 'hour')?.value || '10', 10);
      const m24 = parseInt(hour24Parts.find(p => p.type === 'minute')?.value || '0', 10);

      setBdTime({
        weekday,
        timeString: `${hour12}:${minStr} ${dayPeriod}`,
        totalMinutes: h24 * 60 + m24,
        nowMs: now.getTime()
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Time slot parser: "09:00 AM - 10:30 AM" -> startMin, endMin
  const parseTimeSlot = (slotStr: string) => {
    try {
      const [startPart, endPart] = slotStr.split('-').map(s => s.trim());
      const toMin = (p: string) => {
        const m = p.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!m) return 0;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ampm = m[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + min;
      };
      return {
        startMin: toMin(startPart),
        endMin: toMin(endPart),
        startTime: startPart,
        endTime: endPart
      };
    } catch {
      return { startMin: 0, endMin: 0, startTime: '', endTime: '' };
    }
  };

  // Section 3: Currently Running Classes (LIVE NOW)
  // Compare Bangladesh current time with class routine
  const todayClasses = routine.filter(
    r => r.day.toLowerCase() === bdTime.weekday.toLowerCase()
  );

  const runningClasses = todayClasses.filter(cls => {
    const { startMin, endMin } = parseTimeSlot(cls.timeSlot);
    return bdTime.totalMinutes >= startMin && bdTime.totalMinutes <= endMin;
  });

  // Section 4: Next Upcoming Class Today with countdown
  const upcomingToday = todayClasses
    .map(cls => {
      const { startMin, startTime, endTime } = parseTimeSlot(cls.timeSlot);
      return {
        ...cls,
        startMin,
        startTime,
        endTime,
        diffMinutes: startMin - bdTime.totalMinutes
      };
    })
    .filter(cls => cls.diffMinutes > 0)
    .sort((a, b) => a.diffMinutes - b.diffMinutes);

  const nextUpcomingClass = upcomingToday[0] || null;

  // Academic Overview Calculations
  const totalCredits = studentCourses.reduce((sum, c) => sum + c.credits, 0);
  const criticalCourses = studentCourses.filter(c => c.riskLevel === 'CRITICAL');
  const warningCourses = studentCourses.filter(c => c.riskLevel === 'WARNING');

  // Sorted upcoming exams (nearest date first)
  const sortedExams = [...upcomingExams].sort((a, b) => {
    return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
  });

  // Sorted assignments (nearest deadline first)
  const sortedAssignments = [...assignments].sort((a, b) => {
    return new Date(`${a.dueDate}T23:59:59`).getTime() - new Date(`${b.dueDate}T23:59:59`).getTime();
  });

  const getAssignmentBadge = (asg: typeof assignments[0]) => {
    if (asg.status === 'GRADED') {
      return { label: 'Evaluated', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    }
    if (asg.status === 'SUBMITTED') {
      return { label: 'Submitted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    }
    const dueMs = new Date(`${asg.dueDate}T23:59:59`).getTime();
    if (Date.now() > dueMs) {
      return { label: 'Submission Closed', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    }
    const hoursLeft = (dueMs - Date.now()) / (1000 * 3600);
    if (hoursLeft <= 48) {
      return { label: 'Deadline Approaching', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse' };
    }
    return { label: 'Pending', color: 'bg-slate-700/40 text-slate-300 border-slate-600/50' };
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* ================= SECTION 1: WELCOME MESSAGE & STUDENT INFO ================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          background: isLight
            ? `linear-gradient(135deg, #ffffff 0%, ${theme.primary || '#10B981'}15 50%, ${theme.secondary || '#06B6D4'}15 100%)`
            : `linear-gradient(135deg, var(--color-background, #080D19) 0%, var(--color-sidebar, #0B1220) 50%, ${theme.primary || '#10B981'}25 100%)`,
          borderColor: isLight ? `${theme.primary || '#10B981'}55` : 'var(--color-border, rgba(148, 163, 184, 0.22))'
        }}
        className="dashboard-section section-hover-emerald-cyan relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-9 backdrop-blur-2xl shadow-xl transition-all"
      >
        <div className="section-hover-overlay" />

        {/* Soft Ambient Lighting Orbs - isolated in absolute background layer so they never affect layout flow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20" style={{ backgroundColor: theme.primary }} />
          <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15" style={{ backgroundColor: theme.secondary }} />
        </div>

        {/* Content Row: Vertically Centered, Natural Content-Driven Height */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            {/* University & Department Badge */}
            <div
              style={{
                backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)',
                borderColor: isLight ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.3)'
              }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold backdrop-blur-md"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span
                style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                className="font-black tracking-wide"
              >
                Metropolitan University • Department of CSE
              </span>
              <span className="text-emerald-500 dark:text-emerald-400 text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                Verified Portal
              </span>
            </div>

            {/* Welcome Heading */}
            <h1
              style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight leading-tight"
            >
              Welcome back, {currentUser.name}! 🎓
            </h1>

            {/* Student Metadata Chips */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Student ID:</span>
              <span className="font-mono font-black text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/25">
                {currentUser.studentId || '241-115-211'}
              </span>
              <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-slate-400">Batch:</span>
              <span style={{ color: isLight ? '#0f172a' : '#f8fafc' }} className="font-bold">
                {currentUser.batch || '60th Batch'}
              </span>
              <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-slate-400">Section:</span>
              <span style={{ color: isLight ? '#0f172a' : '#f8fafc' }} className="font-bold">
                {currentUser.section || 'Section E'}
              </span>
              <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-slate-400">Session:</span>
              <span style={{ color: isLight ? '#0f172a' : '#f8fafc' }} className="font-bold">
                {currentUser.currentSemester || 'Spring 2026'}
              </span>
            </div>

            {/* Bangladesh Standard Time */}
            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Bangladesh Standard Time</span>
              </span>
              <span style={{ color: isLight ? '#0f172a' : '#f8fafc' }} className="font-mono text-sm font-black">
                {bdTime.weekday}, {bdTime.timeString} (Asia/Dhaka)
              </span>
            </div>
          </div>

          {/* Action Buttons: Aligned on Right for Desktop, Wrapped/Stacked Responsively */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col xl:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            <button
              onClick={() => setActiveTab('qr-scanner')}
              style={{
                background: `linear-gradient(135deg, ${theme.primary || '#10B981'}, ${theme.secondary || '#06B6D4'})`,
                boxShadow: `0 10px 25px -5px ${theme.glow || 'rgba(16, 185, 129, 0.4)'}`
              }}
              className="group relative flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm text-white shadow-xl hover:brightness-110 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <QrCode className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Scan QR Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus-tracker')}
              className={`flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl font-black text-sm border transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-[#172235] hover:bg-[#1D2B40] text-slate-200 border-[rgba(148,163,184,0.2)]'
              }`}
            >
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Syllabus Tracker</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================= SECTION 2: ACADEMIC OVERVIEW (HOVER-INTERACTIVE CARDS) ================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6"
      >
        <StatCard
          title="Current SGPA"
          value="3.56"
          subtitle="Spring 2026 Estimate"
          icon={TrendingUp}
          trend="+0.14"
          trendPositive={true}
          gradientType="purple"
        />
        <StatCard
          title="Cumulative CGPA"
          value={currentUser.cgpa || 3.42}
          subtitle="Out of 4.00 Scale"
          icon={Award}
          trend="Upper 2nd Class"
          trendPositive={true}
          gradientType="indigo"
        />
        <StatCard
          title="Overall Attendance"
          value={`${currentUser.overallAttendance || 84.5}%`}
          subtitle="Threshold: 75.0%"
          icon={CalendarCheck}
          trend={(currentUser.overallAttendance || 0) >= 75 ? 'ELIGIBLE' : 'AT RISK'}
          trendPositive={(currentUser.overallAttendance || 0) >= 75}
          gradientType="emerald"
        />
        <StatCard
          title="Enrolled Credits"
          value={`${totalCredits} Cr`}
          subtitle={`${studentCourses.length} Registered Courses`}
          icon={BookOpen}
          gradientType="cyan"
        />
        <StatCard
          title="Academic Risk Status"
          value={criticalCourses.length > 0 ? 'CRITICAL' : warningCourses.length > 0 ? 'WARNING' : 'SAFE'}
          subtitle={`${criticalCourses.length} Critical • ${warningCourses.length} Warning`}
          icon={AlertOctagon}
          gradientType="rose"
        />
      </motion.div>

      {/* ================= SECTION 3: CURRENTLY RUNNING CLASSES (LIVE NOW) ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: runningClasses.length > 0 ? theme.accentColor : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="dashboard-section section-hover-emerald-cyan rounded-3xl border-2 p-6 sm:p-7 lg:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="section-hover-overlay" />
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-500 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3
                  style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                  className="font-black text-lg sm:text-xl lg:text-2xl"
                >
                  Live Running Class Monitor
                </h3>
                {runningClasses.length > 0 && (
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500 text-white animate-pulse shadow-md">
                    LIVE NOW ({runningClasses.length})
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
                Real-time Bangladesh time comparison against active university timetable
              </p>
            </div>
          </div>

          <span
            style={{ color: theme.accentColor }}
            className="text-xs sm:text-sm font-mono font-black shrink-0 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-700/50"
          >
            {bdTime.timeString} (Dhaka Time)
          </span>
        </div>

        <div className="pt-6">
          {runningClasses.length === 0 ? (
            <div className="py-8 text-center space-y-2.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                isLight ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-slate-500'
              }`}>
                <Clock className="w-6 h-6" />
              </div>
              <h4
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="font-black text-base sm:text-lg"
              >
                No classes are running right now.
              </h4>
              <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold max-w-md mx-auto">
                Check your upcoming routine below or relax before your next scheduled laboratory or theory session.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {runningClasses.map(cls => (
                <div
                  key={cls.id}
                  style={{
                    backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                    borderColor: `${theme.accentColor}60`
                  }}
                  className="inner-card-interactive p-6 rounded-2xl border-2 flex flex-col justify-between gap-5 shadow-lg cursor-default"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
                        className="font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-xl border border-cyan-500/30"
                      >
                        {cls.courseCode}
                      </span>
                      <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-rose-600 text-white animate-pulse flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        <span>LIVE NOW</span>
                      </span>
                    </div>

                    <h4
                      style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                      className="font-black text-lg sm:text-xl leading-snug"
                    >
                      {cls.courseTitle}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm pt-1">
                      <div className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <User className="w-4 h-4 text-cyan-500 shrink-0" />
                        <span className="truncate font-medium">{cls.instructor}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-extrabold">{cls.room}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`pt-4 border-t flex items-center justify-between ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div>
                      <p className={`text-xs uppercase font-extrabold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Time Slot</p>
                      <p className="font-mono text-sm sm:text-base font-black text-emerald-500">{cls.timeSlot}</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('qr-scanner')}
                      style={{ backgroundColor: theme.accentColor }}
                      className="px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 hover:brightness-110 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Check In</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ================= SECTION 4: NEXT UPCOMING CLASS (WITH COUNTDOWN) ================= */}
      {nextUpcomingClass && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            backgroundColor: 'var(--ep-bg-card, #0d1627)',
            borderColor: `${theme.accentColor}50`
          }}
          className="dashboard-section section-hover-emerald-teal rounded-3xl border-2 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl relative overflow-hidden"
        >
          <div className="section-hover-overlay" />
          <div className="flex items-center gap-4">
            <div
              style={{ backgroundColor: `${theme.accentColor}20`, borderColor: `${theme.accentColor}40` }}
              className="w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner"
            >
              <CalendarCheck className="w-7 h-7" style={{ color: theme.accentColor }} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  NEXT CLASS TODAY
                </span>
                <span
                  style={{ color: theme.accentColor }}
                  className="text-sm font-mono font-black"
                >
                  Starts in: {nextUpcomingClass.diffMinutes} minutes
                </span>
              </div>

              <h4
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="font-black text-lg sm:text-xl mt-1"
              >
                {nextUpcomingClass.courseCode}: {nextUpcomingClass.courseTitle}
              </h4>
              <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
                Room: <strong style={{ color: theme.accentColor }} className="font-extrabold">{nextUpcomingClass.room}</strong> • Instructor: <strong className="font-bold">{nextUpcomingClass.instructor}</strong> • Slot: <strong className="font-mono">{nextUpcomingClass.timeSlot}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('class-routine')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm border transition-colors cursor-pointer shrink-0 shadow-sm ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
            }`}
          >
            <span>View Full Timetable</span>
            <ArrowRight className="w-4 h-4" style={{ color: theme.accentColor }} />
          </button>
        </motion.div>
      )}

      {/* ================= SECTION 5: TODAY'S CLASS ROUTINE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="dashboard-section section-hover-blue-cyan rounded-3xl border-2 p-6 sm:p-7 lg:p-8 shadow-xl space-y-5 relative overflow-hidden"
      >
        <div className="section-hover-overlay" />
        <div
          style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-lg sm:text-xl lg:text-2xl"
            >
              Today's Class Schedule ({bdTime.weekday})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('class-routine')}
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Weekly Routine & Rooms</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {todayClasses.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center font-medium italic">
            No scheduled classes for today ({bdTime.weekday}). Enjoy your self-study day!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {todayClasses.map(cls => {
              const { startMin, endMin } = parseTimeSlot(cls.timeSlot);
              const isRunning = bdTime.totalMinutes >= startMin && bdTime.totalMinutes <= endMin;
              const isCompleted = bdTime.totalMinutes > endMin;

              return (
                <div
                  key={cls.id}
                  style={{
                    backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                    borderColor: isRunning ? theme.accentColor : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                  }}
                  className="inner-card-interactive p-5 sm:p-6 rounded-2xl border-2 flex flex-col justify-between gap-4 shadow-md cursor-default"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs sm:text-sm font-black text-cyan-400">
                        {cls.courseCode}
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isRunning
                            ? 'bg-rose-500 text-white animate-pulse shadow-md'
                            : isCompleted
                            ? 'bg-slate-700/60 text-slate-300'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isRunning ? 'Running' : isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>

                    <h4
                      style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                      className="font-black text-base sm:text-lg leading-snug"
                    >
                      {cls.courseTitle}
                    </h4>

                    <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-medium">
                      {cls.instructor}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-mono font-bold text-slate-300">{cls.timeSlot}</span>
                    <span className="font-black" style={{ color: theme.accentColor }}>{cls.room}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ================= SECTION 6: UPCOMING EXAMINATIONS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="dashboard-section section-hover-amber-orange rounded-3xl border-2 p-6 sm:p-7 lg:p-8 shadow-xl space-y-5 relative overflow-hidden"
      >
        <div className="section-hover-overlay" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Hourglass className="w-6 h-6" />
            </div>
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-lg sm:text-xl lg:text-2xl"
            >
              Upcoming Examinations & Quizzes
            </h3>
          </div>
          <span className="text-xs sm:text-sm text-slate-400 font-semibold">
            Midterm, Final, Class Tests & Lab Evaluations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedExams.slice(0, 3).map(exam => {
            const examTime = new Date(`${exam.date}T${exam.startTime}`).getTime();
            const daysLeft = Math.ceil((examTime - Date.now()) / (1000 * 3600 * 24));

            return (
              <div
                key={exam.id}
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="inner-card-interactive p-5 sm:p-6 rounded-2xl border-2 flex flex-col justify-between gap-4 shadow-md cursor-default"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-black text-cyan-400">
                      {exam.courseCode}
                    </span>
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xs">
                      {daysLeft > 0 ? `In ${daysLeft} Days` : 'Today'}
                    </span>
                  </div>

                  <h4
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black text-base sm:text-lg leading-snug"
                  >
                    {exam.title}
                  </h4>

                  <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm line-clamp-1">
                    {exam.instructions || exam.courseTitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs sm:text-sm space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Date & Time:</span>
                    <span className="font-mono font-bold text-emerald-400">{exam.date} ({exam.startTime})</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Duration & Room:</span>
                    <span className="font-extrabold">{exam.durationMinutes} mins • {exam.room}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ================= SECTION 7: UPCOMING ASSIGNMENTS AND DEADLINES ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="dashboard-section section-hover-purple-pink rounded-3xl border-2 p-6 sm:p-7 lg:p-8 shadow-xl space-y-5 relative overflow-hidden"
      >
        <div className="section-hover-overlay" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-lg sm:text-xl lg:text-2xl"
            >
              Assignments & Strict Deadlines
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('assignments')}
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>View All Assignments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sortedAssignments.slice(0, 3).map(asg => {
            const badge = getAssignmentBadge(asg);
            const isClosed = badge.label === 'Submission Closed';

            return (
              <div
                key={asg.id}
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="inner-card-interactive p-5 sm:p-6 rounded-2xl border-2 flex flex-col justify-between gap-4 shadow-md cursor-default"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-black text-cyan-400">
                      {asg.courseCode}
                    </span>
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border shadow-xs ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h4
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black text-base sm:text-lg leading-snug"
                  >
                    {asg.title}
                  </h4>

                  <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  {asg.isExtended && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 block">
                      Deadline extended by teacher: {asg.dueDate}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-extrabold text-slate-400">Deadline</p>
                    <p className="font-mono text-xs sm:text-sm font-black text-rose-400">{asg.dueDate}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('assignments')}
                    disabled={isClosed}
                    style={{ backgroundColor: isClosed ? undefined : theme.accentColor }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isClosed
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'text-white shadow-md hover:brightness-110 cursor-pointer active:scale-95'
                    }`}
                  >
                    {isClosed ? 'Closed' : asg.status === 'SUBMITTED' ? 'View' : 'Submit'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ================= SECTION 8: COURSE-WISE SYLLABUS PROGRESS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="dashboard-section section-hover-cyan-blue rounded-3xl border-2 p-6 sm:p-7 lg:p-8 shadow-xl space-y-5 relative overflow-hidden"
      >
        <div className="section-hover-overlay" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Layers className="w-6 h-6" style={{ color: theme.accentColor }} />
            </div>
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-lg sm:text-xl lg:text-2xl"
            >
              Course-Wise Syllabus Progress
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('syllabus-tracker')}
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Open Syllabus Tracker</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['CSE 311', 'CSE 313', 'CSE 315'].map(code => {
            const courseChaps = syllabusChapters.filter(ch => ch.courseCode === code);
            const allT = courseChaps.flatMap(ch => ch.topics);
            const comp = allT.filter(t => t.status === 'COMPLETED').length;
            const pct = allT.length > 0 ? Math.round((comp / allT.length) * 100) : 65;

            return (
              <div
                key={code}
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="inner-card-interactive p-5 sm:p-6 rounded-2xl border-2 space-y-4 shadow-md cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs sm:text-sm font-black text-cyan-400">{code}</span>
                  <span className="text-xs sm:text-sm font-mono font-black" style={{ color: theme.accentColor }}>
                    {pct}% Completed
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3 sm:h-3.5 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: theme.accentColor }}
                  />
                </div>

                <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold">
                  {comp} of {allT.length || 8} topics covered • ({pct}%)
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

          {/* ================= SECTION 9: ACADEMIC PERFORMANCE TABLE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="dashboard-section section-hover-violet-indigo rounded-3xl border-2 overflow-hidden shadow-xl relative"
      >
        <div className="section-hover-overlay" />
        <div
          style={{
            backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 sm:px-8 py-5 border-b"
        >
          <div>
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-lg sm:text-xl lg:text-2xl"
            >
              Enrolled Courses & Academic Health
            </h3>
            <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-medium mt-0.5">
              Spring 2026 Semester • Department of Computer Science & Engineering
            </p>
          </div>
          <button
            onClick={() => setActiveTab('academic-performance')}
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <span>Detailed Marks Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead
              className="uppercase tracking-wider font-black border-b"
              style={{
                backgroundColor: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
                color: isLight ? '#1e293b' : '#94a3b8',
                borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
            >
              <tr>
                <th className="px-6 py-4">Course Code & Title</th>
                <th className="px-5 py-4">Instructor</th>
                <th className="px-5 py-4">Credits</th>
                <th className="px-5 py-4">Attendance</th>
                <th className="px-5 py-4">Score / Grade</th>
                <th className="px-5 py-4">Risk Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody
              style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
              className="divide-y"
            >
              {studentCourses.map(course => (
                <tr
                  key={course.courseId}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-800/40'
                  } ${
                    course.riskLevel === 'CRITICAL' ? 'bg-rose-500/5' : ''
                  }`}
                >
                  <td className="px-6 py-5">
                    <p
                      style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                      className="font-black text-base sm:text-lg"
                    >
                      {course.courseCode}
                    </p>
                    <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm mt-0.5 font-medium">
                      {course.courseTitle}
                    </p>
                  </td>
                  <td className={`px-5 py-5 ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}`}>
                    <p className="font-bold text-sm sm:text-base">{course.instructor}</p>
                    <p className="text-xs text-slate-400 font-medium">{course.section}</p>
                  </td>
                  <td className="px-5 py-5 font-mono font-black text-cyan-500 text-sm sm:text-base">
                    {course.credits.toFixed(1)}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-24 sm:w-28 ${isLight ? 'bg-slate-200' : 'bg-slate-800'} h-2.5 rounded-full overflow-hidden shadow-inner`}>
                        <div
                          className={`h-full rounded-full ${
                            course.attendancePercentage >= 75
                              ? 'bg-emerald-500'
                              : course.attendancePercentage >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${course.attendancePercentage}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono font-black text-xs sm:text-sm ${
                          course.attendancePercentage >= 75
                            ? 'text-emerald-400'
                            : course.attendancePercentage >= 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {course.attendancePercentage}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">
                      {course.attendedClasses} of {course.totalClasses} classes
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                        className="font-black text-base sm:text-lg"
                      >
                        {course.currentGrade}
                      </span>
                      <span className="text-slate-400 font-mono text-xs sm:text-sm font-bold">({course.totalMarksObtained}/100)</span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">GPA: {course.currentGPA.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5">
                    <StatusBadge status={course.riskLevel} />
                    <p className="text-xs text-slate-400 mt-1 max-w-[220px] line-clamp-1 font-medium" title={course.riskFactorNotes}>
                      {course.riskFactorNotes}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => setActiveTab('academic-performance')}
                      className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 hover:text-indigo-200 font-black text-xs sm:text-sm transition-colors cursor-pointer border border-indigo-500/30"
                    >
                      Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ================= SECTION 10: EARLY WARNING STATUS ================= */}
      {criticalCourses.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            backgroundColor: isLight ? '#fef2f2' : '#340b15',
            borderColor: isLight ? '#ef4444' : 'rgba(244, 63, 94, 0.65)'
          }}
          className="dashboard-section section-hover-rose-red rounded-3xl border-2 p-6 sm:p-7 lg:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="section-hover-overlay" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white shadow-lg flex items-center justify-center shrink-0">
                <AlertOctagon className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3
                    style={{ color: isLight ? '#991b1b' : '#ffffff' }}
                    className="font-black text-base sm:text-lg lg:text-xl tracking-wide uppercase"
                  >
                    Early Warning Red Alert Triggered!
                  </h3>
                  <span className="text-xs bg-rose-600 text-white font-black px-3 py-1 rounded-full shadow-md">
                    {criticalCourses.length} COURSE AT CRITICAL RISK
                  </span>
                </div>
                <p
                  style={{ color: isLight ? '#7f1d1d' : '#ffe4e6' }}
                  className="text-xs sm:text-sm leading-relaxed font-bold"
                >
                  Your attendance or continuous assessment in{' '}
                  <strong style={{ color: isLight ? '#450a0a' : '#ffffff' }} className="underline font-black">
                    {criticalCourses.map(c => `${c.courseCode} (${c.attendancePercentage}%)`).join(', ')}
                  </strong>{' '}
                  has fallen below the mandatory 75% university eligibility requirement.
                </p>
                <p
                  style={{ color: isLight ? '#991b1b' : '#fecdd3' }}
                  className="text-xs sm:text-sm font-extrabold"
                >
                  Recommendation: Schedule an immediate counseling meeting with your Course Teacher or Departmental Advisor to arrange recovery quizzes/makeup classes.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setPdfModalDoc({
                  title: 'Academic Debarment Warning Notice - CSE 313',
                  category: 'OFFICIAL WARNING',
                  content: `STUDENT WARNING & COUNSELING SLIP\n\nStudent: ${currentUser.name} (ID: ${currentUser.studentId})\nCourse: CSE 313 Compiler Design\nInstructor: Asst. Prof. Mahfuzur Rahman\nCurrent Attendance: 68.0% (Threshold: 75.0%)\nStatus: Debarment Risk\n\nYou are instructed to meet with your course teacher during office hours within 3 working days.`
                })
              }
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-600/40 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0"
            >
              View Warning Slip
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.08)',
            borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.3)'
          }}
          className="dashboard-section section-hover-emerald-teal rounded-3xl border-2 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg relative overflow-hidden"
        >
          <div className="section-hover-overlay" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 style={{ color: isLight ? '#166534' : '#ffffff' }} className="font-black text-base sm:text-lg">
                Good Academic Standing Confirmed
              </h4>
              <p style={{ color: isLight ? '#15803d' : '#94a3b8' }} className="text-xs sm:text-sm font-semibold">
                All registered courses maintain attendance above 75% threshold. Zero debarment risk flagged.
              </p>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-black text-emerald-500 uppercase px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            Safe
          </span>
        </motion.div>
      )}
    </div>
  );
};
