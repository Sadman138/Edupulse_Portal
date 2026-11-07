import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Radio,
  Search,
  Filter,
  CheckCircle2,
  Building,
  Layers,
  Download,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface CampusRoom {
  roomCode: string;
  building: string;
  floor: string;
  type: 'Lecture Hall' | 'Computer Lab' | 'Auditorium';
  capacity: number;
}

const CAMPUS_ROOMS: CampusRoom[] = [
  { roomCode: 'Room 402', building: 'Academic Block 3', floor: '4th Floor', type: 'Lecture Hall', capacity: 60 },
  { roomCode: 'Lab 301', building: 'Academic Block 3', floor: '3rd Floor', type: 'Computer Lab', capacity: 45 },
  { roomCode: 'Lab 302', building: 'Academic Block 3', floor: '3rd Floor', type: 'Computer Lab', capacity: 45 },
  { roomCode: 'Room 505', building: 'Academic Block 3', floor: '5th Floor', type: 'Lecture Hall', capacity: 70 },
  { roomCode: 'Room 401', building: 'Academic Block 2', floor: '4th Floor', type: 'Lecture Hall', capacity: 60 },
  { roomCode: 'Room 406', building: 'Academic Block 2', floor: '4th Floor', type: 'Lecture Hall', capacity: 55 },
  { roomCode: 'Auditorium 2', building: 'Main Auditorium Complex', floor: 'Ground Floor', type: 'Auditorium', capacity: 250 },
  { roomCode: 'CE Hall 101', building: 'Civil Engineering Block', floor: '1st Floor', type: 'Lecture Hall', capacity: 100 }
];

export const ClassRoutineRoomFinder: React.FC = () => {
  const { routine, theme } = useApp();
  const isLight = theme.mode === 'light';

  // Live Bangladesh Standard Time (`Asia/Dhaka`, UTC+6)
  const [bdTime, setBdTime] = useState<{
    weekday: string;
    timeString: string;
    totalMinutes: number;
  }>({
    weekday: 'Sunday',
    timeString: '10:00 AM',
    totalMinutes: 600
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
        totalMinutes: h24 * 60 + m24
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

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'Theory' | 'Lab'>('ALL');
  const [activeViewMode, setActiveViewMode] = useState<'TIMETABLE' | 'ROOM_FINDER'>('TIMETABLE');

  // Filter routine items
  const currentDayClasses = routine.filter(r => {
    if (selectedDay !== 'ALL' && r.day.toLowerCase() !== selectedDay.toLowerCase()) return false;
    if (selectedType !== 'ALL' && r.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCourse = r.courseCode.toLowerCase().includes(q) || r.courseTitle.toLowerCase().includes(q);
      const matchInstructor = r.instructor.toLowerCase().includes(q);
      const matchRoom = r.room.toLowerCase().includes(q);
      if (!matchCourse && !matchInstructor && !matchRoom) return false;
    }
    return true;
  });

  // Real-time running classes currently in session right now across campus
  const liveRunningClasses = routine.filter(cls => {
    if (cls.day.toLowerCase() !== bdTime.weekday.toLowerCase()) return false;
    const { startMin, endMin } = parseTimeSlot(cls.timeSlot);
    return bdTime.totalMinutes >= startMin && bdTime.totalMinutes <= endMin;
  });

  // Next upcoming class today
  const todayUpcoming = routine
    .filter(cls => cls.day.toLowerCase() === bdTime.weekday.toLowerCase())
    .map(cls => {
      const { startMin } = parseTimeSlot(cls.timeSlot);
      return {
        ...cls,
        startMin,
        diffMin: startMin - bdTime.totalMinutes
      };
    })
    .filter(cls => cls.diffMin > 0)
    .sort((a, b) => a.diffMin - b.diffMin);

  const nextClassToday = todayUpcoming[0] || null;

  // Download Routine as formatted text slip
  const handleDownloadRoutine = () => {
    const textContent =
      `METROPOLITAN UNIVERSITY — DEPARTMENT OF CSE\n` +
      `Official Academic Class Schedule & Room Allocation Routine\n` +
      `Academic Session: Spring 2026\n` +
      `Generated On: ${new Date().toLocaleString()} (Asia/Dhaka)\n` +
      `--------------------------------------------------------------------------------\n\n` +
      days.map(d => {
        const dayClasses = routine.filter(r => r.day.toLowerCase() === d.toLowerCase());
        const rows = dayClasses.map(c => `  - [${c.timeSlot}] ${c.courseCode} (${c.type}): ${c.courseTitle} | Room: ${c.room} | Faculty: ${c.instructor}`).join('\n');
        return `DAY: ${d.toUpperCase()}\n${rows || '  No scheduled classes.'}\n`;
      }).join('\n') +
      `\n--------------------------------------------------------------------------------\n` +
      `Office of the Academic Registrar • Metropolitan University, Sylhet.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduPulse_Class_Routine_Rooms_Spring2026.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
              className="p-1.5 rounded-lg border border-cyan-500/30"
            >
              <Calendar className="w-5 h-5" />
            </span>
            <h2
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Class Routine & Classroom Finder
            </h2>
          </div>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
            Class timetables, lecture rooms, laboratory allocations, and live campus room occupancy
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: Timetable vs Room Finder */}
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card-sub, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="flex p-1 rounded-2xl border shadow-sm"
          >
            <button
              onClick={() => setActiveViewMode('TIMETABLE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeViewMode === 'TIMETABLE' ? '!text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              style={activeViewMode === 'TIMETABLE' ? { backgroundColor: theme.accentColor } : {}}
            >
              Class Routine
            </button>
            <button
              onClick={() => setActiveViewMode('ROOM_FINDER')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeViewMode === 'ROOM_FINDER' ? '!text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              style={activeViewMode === 'ROOM_FINDER' ? { backgroundColor: theme.accentColor } : {}}
            >
              Room Occupancy
            </button>
          </div>

          <button
            onClick={handleDownloadRoutine}
            style={{
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))',
              color: 'var(--ep-text-primary, #ffffff)'
            }}
            className="px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 cursor-pointer hover:border-cyan-400 transition-colors shadow-xs"
            title="Download full routine as text file"
          >
            <Download className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden sm:inline">Export Routine</span>
          </button>
        </div>
      </div>

      {/* Real-time Bangladesh Live Clock Banner */}
      <div
        style={{
          background: isLight
            ? `linear-gradient(135deg, #ffffff 0%, ${theme.accentColor}15 50%, #f1f5f9 100%)`
            : `linear-gradient(135deg, #090d16 0%, ${theme.accentColor}25 50%, #030712 100%)`,
          borderColor: isLight ? `${theme.accentColor}40` : `${theme.accentColor}50`
        }}
        className="rounded-3xl border p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div
            style={{ backgroundColor: `${theme.accentColor}20`, borderColor: `${theme.accentColor}40` }}
            className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0"
          >
            <Clock className="w-6 h-6" style={{ color: theme.accentColor }} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                Active Campus Timetable
              </span>
              <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-bold">
                Bangladesh Standard Time
              </span>
            </div>

            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-lg sm:text-xl font-black mt-0.5"
            >
              Current Day: {bdTime.weekday} • {bdTime.timeString}
            </h3>

            <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
              {liveRunningClasses.length > 0 ? (
                <strong className="text-emerald-500 font-bold">
                  {liveRunningClasses.length} lecture(s) currently in progress across campus rooms.
                </strong>
              ) : (
                'No classes are running right now. Next lectures are listed below.'
              )}
            </p>
          </div>
        </div>

        {nextClassToday && (
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.7)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="p-3.5 rounded-2xl border text-xs space-y-1 shadow-md shrink-0 md:max-w-xs"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Next Class in {nextClassToday.diffMin} mins</span>
            </span>
            <p
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="font-black text-xs truncate"
            >
              {nextClassToday.courseCode} — {nextClassToday.courseTitle}
            </p>
            <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-[11px] font-semibold">
              {nextClassToday.room} • {nextClassToday.timeSlot}
            </p>
          </div>
        )}
      </div>

      {/* ================= VIEW 1: TIMETABLE & ROUTINE ================= */}
      {activeViewMode === 'TIMETABLE' && (
        <div className="space-y-6">
          {/* Day Selector Tabs & Search Filter */}
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="rounded-3xl border p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Day selection pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {days.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedDay === d
                        ? '!text-white shadow-md'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    style={selectedDay === d ? { backgroundColor: theme.accentColor } : {}}
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDay('ALL')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedDay === 'ALL'
                      ? '!text-white shadow-md'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  style={selectedDay === 'ALL' ? { backgroundColor: theme.accentColor } : {}}
                >
                  All Days
                </button>
              </div>

              {/* Type filter pills */}
              <div className="flex items-center gap-1.5">
                {(['ALL', 'Theory', 'Lab'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      selectedType === t
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 border-slate-300'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search routine by Course Code (CSE 311), Title, Teacher name, or Room number..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400'
                }`}
              />
            </div>
          </div>

          {/* Routine Classes Cards Grid */}
          {currentDayClasses.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--ep-bg-card, #0d1627)',
                borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="rounded-3xl border p-12 text-center space-y-2 shadow-xl"
            >
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="font-black text-base"
              >
                No classes match the selected routine criteria.
              </h4>
              <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
                Try selecting another day or clearing search query filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDayClasses.map(cls => {
                const { startMin, endMin } = parseTimeSlot(cls.timeSlot);
                const isToday = cls.day.toLowerCase() === bdTime.weekday.toLowerCase();
                const isRunning = isToday && bdTime.totalMinutes >= startMin && bdTime.totalMinutes <= endMin;
                const isFinished = isToday && bdTime.totalMinutes > endMin;
                const isUpcomingToday = isToday && bdTime.totalMinutes < startMin;

                // Find matching campus room info
                const roomInfo = CAMPUS_ROOMS.find(r => r.roomCode.toLowerCase() === cls.room.toLowerCase());

                return (
                  <div
                    key={cls.id}
                    style={{
                      backgroundColor: 'var(--ep-bg-card, #0d1627)',
                      borderColor: isRunning ? theme.accentColor : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                    }}
                    className={`rounded-3xl border-2 p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                      isRunning ? 'ring-2 ring-cyan-500/30' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
                            className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg border border-cyan-500/30"
                          >
                            {cls.courseCode}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              cls.type === 'Lab'
                                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {cls.type}
                          </span>
                        </div>

                        {/* Live / Status Badge */}
                        {isRunning ? (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>LIVE NOW</span>
                          </span>
                        ) : isFinished ? (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-700/40 text-slate-400">
                            Completed
                          </span>
                        ) : isUpcomingToday ? (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                            Today ({startMin - bdTime.totalMinutes}m)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-700/30 text-slate-400">
                            {cls.day}
                          </span>
                        )}
                      </div>

                      {/* Course Title */}
                      <div>
                        <h4
                          style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                          className="font-black text-base leading-snug"
                        >
                          {cls.courseTitle}
                        </h4>
                        <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold flex items-center gap-1.5 mt-1">
                          <User className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{cls.instructor}</span>
                        </p>
                      </div>

                      {/* Location & Room Details ("kun jiagai class hocce") */}
                      <div
                        style={{
                          backgroundColor: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.04)',
                          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                        }}
                        className="p-3 rounded-2xl border space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-bold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Room Allocation:</span>
                          </span>
                          <span
                            style={{ color: theme.accentColor }}
                            className="font-black font-mono text-sm"
                          >
                            {cls.room}
                          </span>
                        </div>

                        {roomInfo && (
                          <div className={`flex items-center justify-between text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span>Campus Location:</span>
                            <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                              {roomInfo.building} ({roomInfo.floor})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time Slot Details ("kunsomoy class") */}
                    <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                      isLight ? 'border-slate-200' : 'border-slate-800/80'
                    }`}>
                      <div>
                        <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Class Timing</span>
                        <span className="font-mono font-black text-emerald-500 text-sm">
                          {cls.timeSlot}
                        </span>
                      </div>

                      <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        90 Mins Lecture
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: CAMPUS ROOM OCCUPANCY FINDER ================= */}
      {activeViewMode === 'ROOM_FINDER' && (
        <div className="space-y-6">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="rounded-3xl border p-6 shadow-xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              <h3
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="font-black text-lg"
              >
                Campus Room Occupancy & Free Study Spaces
              </h3>
            </div>
            <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold">
              Live classroom vacancy tracker for Metropolitan University campus. Find an unoccupied room for individual study, lab work, or group collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPUS_ROOMS.map(room => {
              // Check if any class is running in this room right now
              const activeClass = routine.find(cls => {
                if (cls.day.toLowerCase() !== bdTime.weekday.toLowerCase()) return false;
                if (cls.room.toLowerCase() !== room.roomCode.toLowerCase()) return false;
                const { startMin, endMin } = parseTimeSlot(cls.timeSlot);
                return bdTime.totalMinutes >= startMin && bdTime.totalMinutes <= endMin;
              });

              const isOccupied = !!activeClass;

              return (
                <div
                  key={room.roomCode}
                  style={{
                    backgroundColor: 'var(--ep-bg-card, #0d1627)',
                    borderColor: isOccupied ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'
                  }}
                  className="rounded-3xl border-2 p-5 flex flex-col justify-between space-y-3 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span
                        style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                        className="font-black text-base font-mono"
                      >
                        {room.roomCode}
                      </span>

                      {isOccupied ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30">
                          Occupied
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                          Free / Available
                        </span>
                      )}
                    </div>

                    <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
                      {room.building} • {room.floor}
                    </p>
                    <p className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Type: {room.type} • Capacity: {room.capacity} students
                    </p>
                  </div>

                  <div className={`pt-3 border-t text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  }`}>
                    {isOccupied && activeClass ? (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-rose-500 block">Class in Session:</span>
                        <p className="font-bold text-xs truncate" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                          {activeClass.courseCode} — {activeClass.courseTitle}
                        </p>
                        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Until {parseTimeSlot(activeClass.timeSlot).endTime}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ready for Student Use</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
