import React from 'react';
import {
  Zap,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Calendar,
  QrCode,
  FileText,
  BookOpen,
  BellRing,
  ExternalLink,
  Heart,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  onNavigate?: (tabId: string) => void;
  onOpenMilestoneModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenMilestoneModal }) => {
  const { isDarkMode, themeColor, customHex } = useApp();

  const handleNav = (tabId: string) => {
    if (onNavigate) {
      onNavigate(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className={`mt-16 border-t transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#0a0f1d] border-[#1d273a] text-slate-300'
          : 'bg-white border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      {/* Top Banner / Accreditation Ribbon */}
      <div
        className={`py-3 px-4 md:px-8 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
          isDarkMode ? 'bg-[#080c18] border-[#162035]' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-500 font-bold">EduPulse Portal v1.4</span>
          <span className="opacity-40">&bull;</span>
          <span>Metropolitan University &bull; School of Science & Technology</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] opacity-80 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>UGC Bangladesh Approved</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>IEB Accredited Department</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Weeks 1–4 Complete</span>
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: University Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 ring-1 ring-white/20">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight text-white dark:text-white">
                  EduPulse
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  Academic Performance & Early Warning
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed opacity-80">
              Department of Computer Science & Engineering (CSE) academic monitoring platform, delivering real-time SGPA telemetry, dynamic QR attendance tracking, and early warning risk alerts.
            </p>

            <div className="space-y-1.5 text-xs opacity-90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Bateshwar, Sylhet-3103, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>PABX: +880 1782-555222</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>cse@metrouni.edu.bd</span>
              </div>
            </div>
          </div>

          {/* Col 2: Student Academic Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Student Modules (W1–W4)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('dashboard')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <span>Academic Dashboard & SGPA</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('qr-scanner')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>QR Attendance Scanner</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('class-routine')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Class Routine & Room Tracker</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('assignments')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Assignment Submission Hub</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('study-materials')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lecture Slides & Materials</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('notices')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <BellRing className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Official Notice Board</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Standards & Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
              Academic Standards
            </h4>
            <div className="space-y-2.5 text-xs">
              <div
                className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                  isDarkMode ? 'bg-[#121c32] border-[#1d2a45]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>Attendance Standard</span>
                  <span>&ge; 75.0%</span>
                </div>
                <p className="opacity-75">
                  Minimum attendance percentage required to sit for final semester examinations.
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                  isDarkMode ? 'bg-[#121c32] border-[#1d2a45]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>CGPA Good Standing</span>
                  <span>&ge; 2.50</span>
                </div>
                <p className="opacity-75">
                  CGPA below 2.50 or attendance &lt; 75% automatically triggers early warning alerts.
                </p>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] opacity-75">Office Hours: Sun–Thu 9:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Project Team & Milestone Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              Project Development Team
            </h4>
            <div
              className={`p-3 rounded-2xl border space-y-2 text-xs ${
                isDarkMode ? 'bg-[#11192e] border-[#1e2a44]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-bold text-white flex items-center justify-between">
                <span>Team Delta (CSE 58th)</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  W1–W4 Complete
                </span>
              </div>
              <ul className="space-y-1 text-[11px] opacity-80 font-mono">
                <li>&bull; Raiyan Chowdhury (241-115-210)</li>
                <li>&bull; Fathin Sadman (241-115-211)</li>
                <li>&bull; Md Al Mekdad Ajmol (241-115-223)</li>
              </ul>
              {onOpenMilestoneModal && (
                <button
                  type="button"
                  onClick={onOpenMilestoneModal}
                  className="w-full mt-2 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View 12-Week Syllabus Roadmap</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-75">
          <div>
            &copy; {new Date().getFullYear()} Metropolitan University. Department of Computer Science & Engineering. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Pure React Client-Side SPA</span>
            <span>&bull;</span>
            <span>No Backend Required</span>
            <span>&bull;</span>
            <span>Academic Project Defense</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
