import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  Download,
  Printer,
  ChevronRight,
  AlertCircle,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassRoutineItem } from '../../types';
import { printFormattedDocument } from '../../utils/pdfGenerator';

interface ClassRoutineTrackerProps {
  onNavigate?: (path: string) => void;
  compactMode?: boolean;
  isDarkMode?: boolean;
}

export const ClassRoutineTracker: React.FC<ClassRoutineTrackerProps> = ({
  onNavigate,
  compactMode = false,
  isDarkMode = true
}) => {
  const { classRoutine, currentUser, activeQRSession } = useApp();

  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedBatch, setSelectedBatch] = useState<string>(currentUser?.batch || '58th Batch');
  const [selectedSection, setSelectedSection] = useState<string>(currentUser?.section || 'Section A');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered routine items
  const filteredRoutine = classRoutine.filter((item) => {
    const matchBatch = selectedBatch === 'ALL' || item.batch === selectedBatch;
    const matchSection = selectedSection === 'ALL' || item.section === selectedSection;
    const matchDay = selectedDay === 'ALL' || item.dayOfWeek === selectedDay;
    return matchBatch && matchSection && matchDay;
  });

  // Calculate Next Class for Live Tracker
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const todayName = daysOfWeek[new Date().getDay()] || 'Sunday';

  const todayClasses = classRoutine.filter(
    (item) => item.dayOfWeek === todayName && item.section === (currentUser?.section || 'Section A')
  );

  const nextClass = todayClasses.length > 0 ? todayClasses[0] : classRoutine[0];

  // Print official routine PDF
  const handlePrintRoutine = () => {
    const html = `
      <table class="header-table">
        <tr>
          <td>
            <h1 class="univ-title">Metropolitan University</h1>
            <p class="dept-title">Department of Computer Science & Engineering</p>
            <span class="doc-type">OFFICIAL WEEKLY CLASS SCHEDULE & ROOM ALLOCATION</span>
          </td>
          <td style="text-align: right; vertical-align: top;">
            <div style="font-size: 12px; font-weight: bold; color: #0f172a;">Batch: ${selectedBatch} &bull; ${selectedSection}</div>
            <div style="font-size: 11px; color: #64748b;">Semester: Spring 2026</div>
            <div style="font-size: 11px; color: #64748b;">Generated: ${new Date().toLocaleDateString()}</div>
          </td>
        </tr>
      </table>

      <div style="margin: 16px 0 10px 0; font-size: 11px; color: #475569; background: #f8fafc; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
        <strong>Campus Advisory:</strong> Students must report to assigned theory halls and laboratories at least 5 minutes prior to class commencement. Dynamic QR attendance closes strictly within the initial lecture window.
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Time Slot</th>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Type</th>
            <th>Room / Lab</th>
            <th>Faculty Instructor</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRoutine
            .map(
              (r) => `
            <tr>
              <td style="font-weight: bold; color: #0284c7;">${r.dayOfWeek}</td>
              <td style="font-family: monospace;">${r.startTime} - ${r.endTime}</td>
              <td style="font-family: monospace; font-weight: bold;">${r.courseCode}</td>
              <td>${r.courseName}</td>
              <td><span style="font-size: 10px; font-weight: bold; padding: 2px 6px; background: ${r.type === 'LAB' ? '#e0f2fe; color: #0284c7' : '#f1f5f9; color: #475569'}; border-radius: 4px;">${r.type}</span></td>
              <td style="font-weight: bold; color: #0f172a;">${r.room} <br/><span style="font-size: 9px; font-weight: normal; color: #64748b;">${r.building || ''}</span></td>
              <td>${r.teacherName}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer-box">
        <span>Metropolitan University Academic Scheduling System</span>
        <span>Central Dean Office &bull; School of Science & Technology</span>
      </div>
    `;

    printFormattedDocument(html, `Routine_${selectedBatch}_${selectedSection}.pdf`);
  };

  if (compactMode) {
    // Compact View for Dashboard Widget
    return (
      <div
        className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-colors ${
          isDarkMode
            ? 'bg-[#101726] border-[#1e283d] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <Clock className="w-4 h-4 animate-spin-slow shrink-0" />
            <h3
              className={`text-sm font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Today's Class Schedule & Room Finder
            </h3>
          </div>
          <span
            className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
              isDarkMode
                ? 'text-slate-400 bg-[#151c2e] border-[#202b42]'
                : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}
          >
            {currentTimeStr || 'Live'}
          </span>
        </div>

        {/* Live Next Class Spotlight */}
        {nextClass && (
          <div
            className={`p-4 rounded-2xl border space-y-2.5 shadow-lg relative overflow-hidden transition-colors ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#121c33] to-[#182645] border-cyan-500/30'
                : 'bg-gradient-to-br from-cyan-50/80 to-blue-50/60 border-cyan-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isDarkMode
                    ? 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30'
                    : 'text-cyan-800 bg-cyan-100 border-cyan-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>NEXT CLASS SPOTLIGHT</span>
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  isDarkMode
                    ? 'text-white bg-[#0f1728]'
                    : 'text-slate-900 bg-white shadow-xs border border-slate-200'
                }`}
              >
                {nextClass.startTime} - {nextClass.endTime}
              </span>
            </div>

            <div>
              <h4
                className={`text-base font-extrabold flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>
                  {nextClass.courseCode}: {nextClass.courseName}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    nextClass.type === 'LAB'
                      ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {nextClass.type}
                </span>
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{nextClass.room}</span>
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{nextClass.teacherName}</span>
                </span>
              </div>
              <p
                className={`text-[11px] mt-1 font-mono ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {nextClass.building}
              </p>
            </div>

            <div
              className={`pt-2 border-t flex items-center justify-between ${
                isDarkMode ? 'border-[#203152]' : 'border-cyan-200'
              }`}
            >
              <span
                className={`text-[11px] ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'
                }`}
              >
                Scheduled for {todayName} &bull; {nextClass.section}
              </span>
              {activeQRSession && activeQRSession.courseCode === nextClass.courseCode ? (
                <button
                  onClick={() => onNavigate && onNavigate('qr-scanner')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan Lecture QR</span>
                </button>
              ) : (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Room Ready</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Today's Remaining List */}
        <div className="space-y-2">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {todayName}'s Scheduled Lectures:
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {todayClasses.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  isDarkMode
                    ? 'bg-[#141b2c] hover:bg-[#1a2338] border-[#222c42]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div>
                  <div
                    className={`font-bold flex items-center gap-1.5 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono">
                      {item.courseCode}
                    </span>
                    <span>&bull;</span>
                    <span className="truncate max-w-[150px]">{item.courseName}</span>
                  </div>
                  <div
                    className={`text-[10px] flex items-center gap-2 mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <span>{item.teacherName}</span>
                    <span>&bull;</span>
                    <span className="text-amber-600 dark:text-amber-300 font-bold">
                      {item.room}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono font-bold block ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-800'
                    }`}
                  >
                    {item.startTime}
                  </span>
                  <span
                    className={`text-[9px] font-medium ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-500'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full Expanded View for Page
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Class Schedule & Live Room Finder</span>
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Weekly section & batch routine, live room tracking, and countdown to your next classroom lecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintRoutine}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Routine PDF</span>
          </button>
        </div>
      </div>

      {/* Next Class Spotlight Card */}
      {nextClass && (
        <div
          className={`p-6 rounded-3xl border shadow-2xl relative overflow-hidden transition-colors ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#11192e] via-[#152342] to-[#121c35] border-cyan-500/40 text-white'
              : 'bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border-cyan-200 text-slate-900 shadow-md'
          }`}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    isDarkMode
                      ? 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                      : 'text-cyan-800 bg-cyan-100 border-cyan-200'
                  }`}
                >
                  NEXT UPCOMING CLASSROOM SESSION
                </span>
                <span
                  className={`text-xs font-mono font-semibold ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {todayName} &bull; Live Time: {currentTimeStr}
                </span>
              </div>

              <div>
                <h3
                  className={`text-2xl font-black tracking-tight flex items-center gap-3 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <span>
                    {nextClass.courseCode}: {nextClass.courseName}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold ${
                      nextClass.type === 'LAB'
                        ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-400/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {nextClass.type} SESSION
                  </span>
                </h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm">
                  <div
                    className={`flex items-center gap-1.5 font-extrabold px-3 py-1 rounded-xl border ${
                      isDarkMode
                        ? 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                        : 'text-amber-800 bg-amber-100 border-amber-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>Allocated Room: {nextClass.room}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-sky-500" />
                    <span>
                      Instructor: <strong>{nextClass.teacherName}</strong>
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700 font-semibold'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span>
                      {nextClass.startTime} - {nextClass.endTime}
                    </span>
                  </div>
                </div>
                <p
                  className={`text-xs mt-2 font-mono flex items-center gap-1.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Campus Location: {nextClass.building}</span>
                </p>
              </div>
            </div>

            {/* Action buttons on spotlight */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              {activeQRSession && activeQRSession.courseCode === nextClass.courseCode ? (
                <button
                  onClick={() => onNavigate && onNavigate('qr-scanner')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Lecture Attendance Now</span>
                </button>
              ) : (
                <div
                  className={`p-3 rounded-2xl border text-center space-y-1 ${
                    isDarkMode
                      ? 'bg-[#0e1628] border-[#202d4a]'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    SESSION PREPARATION
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Room & Lab Verified</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Routine Filters & Controls */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
          isDarkMode
            ? 'bg-[#101726] border-[#1e273a]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {/* Day selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDay === d
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white bg-[#141d30]'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {d === 'ALL' ? 'Full Week' : d}
            </button>
          ))}
        </div>

        {/* Batch and Section Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}
            >
              Batch:
            </span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className={`border rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono font-bold ${
                isDarkMode
                  ? 'bg-[#141d30] border-[#23314f] text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="58th Batch">58th Batch</option>
              <option value="59th Batch">59th Batch</option>
              <option value="60th Batch">60th Batch</option>
              <option value="ALL">All Batches</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}
            >
              Section:
            </span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className={`border rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono font-bold ${
                isDarkMode
                  ? 'bg-[#141d30] border-[#23314f] text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="ALL">All Sections</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routine Grid Table */}
      <div
        className={`border rounded-2xl overflow-hidden shadow-xl transition-colors ${
          isDarkMode
            ? 'bg-[#101726] border-[#1e273a]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b uppercase text-[10px] font-bold tracking-wider ${
                  isDarkMode
                    ? 'border-[#1e273a] bg-[#0c1220] text-slate-400'
                    : 'border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                <th className="py-3.5 px-4">DAY</th>
                <th className="py-3.5 px-4">TIME WINDOW</th>
                <th className="py-3.5 px-4">COURSE CODE</th>
                <th className="py-3.5 px-5">COURSE TITLE</th>
                <th className="py-3.5 px-3">TYPE</th>
                <th className="py-3.5 px-5">ROOM & LAB LOCATION</th>
                <th className="py-3.5 px-4">FACULTY INSTRUCTOR</th>
                <th className="py-3.5 px-3">BATCH & SEC</th>
              </tr>
            </thead>
            <tbody
              className={
                isDarkMode
                  ? 'divide-y divide-[#182236] text-slate-200'
                  : 'divide-y divide-slate-200 text-slate-800'
              }
            >
              {filteredRoutine.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No scheduled classes matching current filters.
                  </td>
                </tr>
              ) : (
                filteredRoutine.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isDarkMode ? 'hover:bg-[#141d30]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-cyan-600 dark:text-cyan-400">
                      {item.dayOfWeek}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold whitespace-nowrap">
                      {item.startTime} - {item.endTime}
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-white">
                      {item.courseCode}
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-900 dark:text-slate-100">
                      {item.courseName}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          item.type === 'LAB'
                            ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-400/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-bold text-amber-600 dark:text-amber-300">
                      <div>
                        <span>{item.room}</span>
                        {item.building && (
                          <span
                            className={`text-[10px] font-normal block font-mono ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {item.building}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.teacherName}
                    </td>
                    <td
                      className={`py-3 px-3 font-mono text-[11px] font-medium ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {item.batch} ({item.section})
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
