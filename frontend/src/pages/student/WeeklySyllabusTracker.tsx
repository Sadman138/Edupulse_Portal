import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export const WeeklySyllabusTracker: React.FC = () => {
  const { routine } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const milestones = [
    { week: 'Week 1', title: 'Requirement Analysis & Project Planning', status: 'COMPLETED', date: 'Oct 02, 2026' },
    { week: 'Week 2', title: 'UI/UX Design System & React Architecture', status: 'COMPLETED', date: 'Oct 04, 2026' },
    { week: 'Week 3', title: 'Student Dashboard, Early Warning & Red Alert Banner', status: 'COMPLETED', date: 'Oct 06, 2026' },
    { week: 'Week 4', title: 'Student Portals: QR Scanner, Results & Notices Hub', status: 'COMPLETED', date: 'Oct 08, 2026' },
    { week: 'Week 5', title: 'Teacher & Admin Dashboards & Institutional Features', status: 'COMPLETED', date: 'Oct 09, 2026' }
  ];

  const currentDayClasses = routine.filter(r => r.day.toLowerCase() === selectedDay.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Academic Routine & Syllabus Progression
        </h2>
        <p className="text-xs text-slate-400">
          Weekly milestone execution, class schedule timetable, and room allocations
        </p>
      </div>

      {/* Routine Schedule Timetable */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Class Schedule Routine</h3>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === d
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {currentDayClasses.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center italic">No scheduled classes for {selectedDay}.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentDayClasses.map(cls => (
              <div
                key={cls.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {cls.courseCode}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                      {cls.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{cls.courseTitle}</h4>
                  <p className="text-xs text-slate-400">Instructor: {cls.instructor}</p>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <p className="font-mono text-xs font-bold text-emerald-400">{cls.timeSlot}</p>
                  <p className="text-[11px] font-semibold text-slate-300">{cls.room}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Syllabus Milestones */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Project Syllabus Deliverables</h3>
        </div>

        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={m.week}
              className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{m.week}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
                      DELIVERED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{m.title}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400 shrink-0 hidden sm:inline">
                {m.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
