import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCode,
  Layers,
  ArrowRight,
  GraduationCap,
  QrCode,
  FileText,
  Award,
  BellRing,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WEEKLY_MILESTONES } from '../../components/common/WeeklyMilestoneModal';

interface WeeklySyllabusTrackerProps {
  onNavigate?: (tabId: string) => void;
}

export const WeeklySyllabusTracker: React.FC<WeeklySyllabusTrackerProps> = ({ onNavigate }) => {
  const { isDarkMode } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMPLETED' | 'UPCOMING'>('ALL');

  const filtered = WEEKLY_MILESTONES.filter((m) => {
    if (activeFilter === 'COMPLETED') return m.status === 'COMPLETED' || m.status === 'CURRENT_MILESTONE';
    if (activeFilter === 'UPCOMING') return m.status === 'NEXT_SPRINT' || m.status === 'FUTURE_PHASE';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div
        className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0a1122] border-[#22314d]'
            : 'bg-gradient-to-r from-cyan-50 via-indigo-50 to-white border-slate-200'
        }`}
      >
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Syllabus Milestone Progress</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Week 1 to Week 4 Deliverables (Complete)
          </h1>
          <p className="text-xs md:text-sm opacity-80 leading-relaxed">
            Metropolitan University &bull; Department of Computer Science & Engineering.
            Strict adherence to the weekly project syllabus up to <strong>Week 4 (Frontend &bull; Student Features)</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <div
            className={`p-4 rounded-2xl border text-center min-w-[130px] ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
            }`}
          >
            <div className="text-3xl font-black text-emerald-400">100%</div>
            <div className="text-[11px] font-bold opacity-75 mt-0.5">W1 - W4 Status</div>
          </div>
          <div
            className={`p-4 rounded-2xl border text-center min-w-[130px] ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
            }`}
          >
            <div className="text-3xl font-black text-cyan-400">4 / 4</div>
            <div className="text-[11px] font-bold opacity-75 mt-0.5">Weeks Ready</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards to W3 & W4 Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'dashboard', label: 'Dashboard (W3)', icon: Layers, desc: 'SGPA & Red Alert' },
          { id: 'qr-scanner', label: 'QR Scanner (W4)', icon: QrCode, desc: 'Live Attendance' },
          { id: 'previous-results', label: 'Past Results (W4)', icon: GraduationCap, desc: 'Submission Form' },
          { id: 'notices', label: 'Notices (W4)', icon: BellRing, desc: 'Official Board' },
          { id: 'assignments', label: 'Assignments (W4)', icon: FileText, desc: 'Upload Hub' },
          { id: 'study-materials', label: 'Study Materials (W4)', icon: BookOpen, desc: 'Lecture Slides' },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => onNavigate && onNavigate(mod.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80'
                : 'bg-white border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/40 shadow-xs'
            }`}
          >
            <mod.icon className="w-5 h-5 text-cyan-400 mb-2" />
            <div className="font-bold text-xs truncate">{mod.label}</div>
            <div className="text-[10px] opacity-70 truncate">{mod.desc}</div>
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-cyan-600 text-white shadow-sm'
              : isDarkMode
              ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              : 'bg-slate-200/80 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Syllabus Weeks
        </button>
        <button
          onClick={() => setActiveFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : isDarkMode
              ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              : 'bg-slate-200/80 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Completed (W1 - W4)
        </button>
        <button
          onClick={() => setActiveFilter('UPCOMING')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'UPCOMING'
              ? 'bg-indigo-600 text-white shadow-sm'
              : isDarkMode
              ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              : 'bg-slate-200/80 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Upcoming (W5 - W12)
        </button>
      </div>

      {/* Week Cards Accordion */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isCurrent = item.status === 'CURRENT_MILESTONE';
          const isDone = item.status === 'COMPLETED';
          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all ${
                isCurrent
                  ? isDarkMode
                    ? 'bg-[#10192e] border-cyan-500/50 ring-2 ring-cyan-500/20 shadow-xl'
                    : 'bg-cyan-50/60 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
                  : isDone
                  ? isDarkMode
                    ? 'bg-[#0f172a] border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                  : isDarkMode
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl text-sm font-black bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm">
                    {item.week}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">{item.activity}</h2>
                    <p className="text-xs opacity-75">{item.tasks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isCurrent
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {isDone || isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {isCurrent ? 'Current Milestone (Week 4)' : isDone ? 'Verified Completed' : item.status === 'NEXT_SPRINT' ? 'Next Sprint (Week 5)' : 'Phase 2 (W6-W12)'}
                  </span>
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                  Verified Deliverables & Features:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.deliverables.map((deliv, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-2.5 rounded-xl flex items-center gap-2.5 ${
                        isDarkMode
                          ? 'bg-slate-900/60 border border-slate-800/80 text-slate-200'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Files */}
              <div className="mt-4 pt-3 border-t border-slate-700/40 flex flex-wrap items-center gap-2 text-xs">
                <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold text-xs opacity-75">Mapped Implementation Files:</span>
                {item.files.map((file, idx) => (
                  <code
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      isDarkMode ? 'bg-slate-800/80 text-cyan-300' : 'bg-slate-100 text-cyan-700 border border-slate-200'
                    }`}
                  >
                    {file}
                  </code>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
