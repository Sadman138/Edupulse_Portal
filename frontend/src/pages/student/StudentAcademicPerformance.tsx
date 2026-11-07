import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  GraduationCap,
  TrendingUp,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';

export const StudentAcademicPerformance: React.FC = () => {
  const { studentCourses, theme } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(studentCourses[0]?.courseId || '');

  const isLight = theme.mode === 'light';
  const selectedCourse = studentCourses.find(c => c.courseId === selectedCourseId) || studentCourses[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
              className="p-1.5 rounded-lg border border-cyan-500/30"
            >
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Academic Performance & Marks Ledger
            </h2>
          </div>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
            Continuous Assessment breakdown, SGPA estimation, and early risk diagnostics
          </p>
        </div>

        <button
          onClick={() => {
            const csvContent =
              'data:text/csv;charset=utf-8,' +
              'Course Code,Course Title,Credits,Quiz (20),Midterm (30),Assignment (10),Final (40),Total (100),Grade,GPA,Risk\n' +
              studentCourses
                .map(
                  c =>
                    `"${c.courseCode}","${c.courseTitle}",${c.credits},${c.quizScore},${c.midtermScore},${c.assignmentScore},${c.finalExamScore},${c.totalMarksObtained},"${c.currentGrade}",${c.currentGPA},"${c.riskLevel}"`
                )
                .join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'Academic_Marks_Ledger_Spring2026.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          style={{
            backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))',
            color: 'var(--ep-text-primary, #ffffff)'
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer hover:border-cyan-400 transition-colors w-fit shadow-xs"
        >
          <Download className="w-4 h-4 text-cyan-500" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {studentCourses.map(c => {
          const isSelected = selectedCourse?.courseId === c.courseId;
          return (
            <button
              key={c.courseId}
              onClick={() => setSelectedCourseId(c.courseId)}
              style={{
                backgroundColor: isSelected
                  ? isLight
                    ? '#e0f2fe'
                    : 'rgba(6, 182, 212, 0.18)'
                  : isLight
                  ? '#ffffff'
                  : 'var(--ep-bg-card, #0d1627)',
                borderColor: isSelected
                  ? isLight ? '#0284c7' : theme.accentColor
                  : isLight
                  ? '#cbd5e1'
                  : 'var(--ep-border, rgba(51, 65, 85, 0.7))',
                color: isSelected
                  ? isLight ? '#0369a1' : '#38bdf8'
                  : isLight ? '#0f172a' : '#f8fafc'
              }}
              className="px-4 py-3 rounded-2xl border text-left shrink-0 transition-all shadow-sm cursor-pointer hover:border-cyan-400 group"
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: isSelected
                      ? isLight
                        ? '#0369a1'
                        : theme.accentColor
                      : isLight
                      ? '#0f172a'
                      : '#f8fafc'
                  }}
                  className="font-black text-xs tracking-tight"
                >
                  {c.courseCode}
                </span>
                <StatusBadge status={c.riskLevel} size="sm" />
              </div>
              <p
                style={{
                  color: isSelected
                    ? isLight
                      ? '#075985'
                      : '#e0f2fe'
                    : isLight
                    ? '#334155'
                    : '#94a3b8'
                }}
                className="text-[11px] font-bold mt-1 truncate max-w-[140px]"
              >
                {c.courseTitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Course Deep Dive Card */}
      {selectedCourse && (
        <div
          style={{
            backgroundColor: 'var(--ep-bg-card, #0d1627)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="rounded-3xl border p-6 space-y-6 shadow-xl"
        >
          <div
            style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    backgroundColor: isLight ? '#e0f2fe' : `${theme.accentColor}25`,
                    color: isLight ? '#0369a1' : theme.accentColor,
                    borderColor: isLight ? '#bae6fd' : 'rgba(6, 182, 212, 0.3)'
                  }}
                  className="text-xs font-black px-2.5 py-0.5 rounded-md font-mono border"
                >
                  {selectedCourse.courseCode}
                </span>
                <span style={{ color: isLight ? '#334155' : 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-extrabold">
                  ({selectedCourse.credits} Credit Hours)
                </span>
                <StatusBadge status={selectedCourse.riskLevel} size="md" />
              </div>

              <h3
                style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                className="text-xl sm:text-2xl font-black mt-1"
              >
                {selectedCourse.courseTitle}
              </h3>

              <p style={{ color: isLight ? '#475569' : 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold mt-0.5">
                Instructor:{' '}
                <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }} className="font-bold">
                  {selectedCourse.instructor}
                </strong>{' '}
                • Section:{' '}
                <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }} className="font-bold">
                  {selectedCourse.section}
                </strong>
              </p>
            </div>

            <div
              style={{
                backgroundColor: isLight ? '#f8fafc' : 'var(--ep-bg-card-sub, #111a2f)',
                borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="flex items-center gap-4 p-3.5 rounded-2xl border shadow-sm"
            >
              <div
                style={{ borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
                className="text-center px-3 border-r"
              >
                <p className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Marks</p>
                <p
                  style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                  className="text-2xl font-black"
                >
                  {selectedCourse.totalMarksObtained}{' '}
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>/ 100</span>
                </p>
              </div>

              <div
                style={{ borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
                className="text-center px-3 border-r"
              >
                <p className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Grade</p>
                <p className={`text-2xl font-black ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>{selectedCourse.currentGrade}</p>
              </div>

              <div className="text-center px-3">
                <p className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Point GPA</p>
                <p className={`text-2xl font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {selectedCourse.currentGPA.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Breakdown Bars */}
          <div className="space-y-4">
            <h4
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs font-black uppercase tracking-wider"
            >
              Continuous Assessment Components Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quiz */}
              <div
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="p-4 rounded-2xl border space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
                    Quizzes / Class Tests
                  </span>
                  <span
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black font-mono"
                  >
                    {selectedCourse.quizScore} / 20
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${(selectedCourse.quizScore / 20) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Weight: 20% of continuous marks</p>
              </div>

              {/* Midterm */}
              <div
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="p-4 rounded-2xl border space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
                    Mid-Term Examination
                  </span>
                  <span
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black font-mono"
                  >
                    {selectedCourse.midtermScore} / 30
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedCourse.midtermScore >= 20
                        ? 'bg-emerald-500'
                        : selectedCourse.midtermScore >= 15
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${(selectedCourse.midtermScore / 30) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Weight: 30% of total grade</p>
              </div>

              {/* Assignment & Lab */}
              <div
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="p-4 rounded-2xl border space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
                    Assignments & Projects
                  </span>
                  <span
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black font-mono"
                  >
                    {selectedCourse.assignmentScore} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${(selectedCourse.assignmentScore / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Weight: 10% submission grade</p>
              </div>

              {/* Final Exam Estimate */}
              <div
                style={{
                  backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="p-4 rounded-2xl border space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
                    Semester Final (Projected)
                  </span>
                  <span
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black font-mono"
                  >
                    {selectedCourse.finalExamScore} / 40
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${(selectedCourse.finalExamScore / 40) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Weight: 40% terminal exam</p>
              </div>
            </div>
          </div>

          {/* Risk Factor Analysis Box */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm ${
              selectedCourse.riskLevel === 'CRITICAL'
                ? isLight
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : selectedCourse.riskLevel === 'WARNING'
                ? isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <div className="space-y-1 text-xs">
              <h5 className="font-black uppercase tracking-wider">
                Early Warning Status: {selectedCourse.riskLevel}
              </h5>
              <p className="leading-relaxed font-semibold">{selectedCourse.riskFactorNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive CGPA & Target Grade Simulator */}
      <CgpaSimulatorSection courses={studentCourses} isLight={isLight} theme={theme} />
    </div>
  );
};

interface SimulatorCourseState {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  expectedFinal: number;
  quizScore: number;
  midtermScore: number;
  assignmentScore: number;
}

const CgpaSimulatorSection: React.FC<{ courses: any[]; isLight: boolean; theme: any }> = ({
  courses,
  isLight,
  theme
}) => {
  const [simCourses, setSimCourses] = useState<SimulatorCourseState[]>(() =>
    courses.map(c => ({
      courseId: c.courseId,
      courseCode: c.courseCode,
      courseTitle: c.courseTitle,
      credits: c.credits,
      expectedFinal: c.finalExamScore || 32,
      quizScore: c.quizScore || 16,
      midtermScore: c.midtermScore || 24,
      assignmentScore: c.assignmentScore || 8
    }))
  );

  const calculateCourseGrade = (total: number) => {
    if (total >= 80) return { grade: 'A+', gp: 4.0 };
    if (total >= 75) return { grade: 'A', gp: 3.75 };
    if (total >= 70) return { grade: 'A-', gp: 3.5 };
    if (total >= 65) return { grade: 'B+', gp: 3.25 };
    if (total >= 60) return { grade: 'B', gp: 3.0 };
    if (total >= 55) return { grade: 'B-', gp: 2.75 };
    if (total >= 50) return { grade: 'C+', gp: 2.5 };
    if (total >= 45) return { grade: 'C', gp: 2.25 };
    if (total >= 40) return { grade: 'D', gp: 2.0 };
    return { grade: 'F', gp: 0.0 };
  };

  const handleFinalChange = (courseId: string, val: number) => {
    const clamped = Math.max(0, Math.min(40, val));
    setSimCourses(prev =>
      prev.map(c => (c.courseId === courseId ? { ...c, expectedFinal: clamped } : c))
    );
  };

  // Compute Simulated SGPA
  const totalCredits = simCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalWeightedGP = simCourses.reduce((sum, c) => {
    const total = c.quizScore + c.midtermScore + c.assignmentScore + c.expectedFinal;
    const { gp } = calculateCourseGrade(total);
    return sum + gp * c.credits;
  }, 0);
  const projectedSgpa = totalCredits > 0 ? totalWeightedGP / totalCredits : 0;

  const previousCredits = 60;
  const previousCgpa = 3.42;
  const projectedCumulativeCgpa =
    (previousCredits * previousCgpa + totalCredits * projectedSgpa) / (previousCredits + totalCredits);

  return (
    <div
      style={{
        backgroundColor: 'var(--ep-bg-card, #0d1627)',
        borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
      }}
      className="rounded-3xl border p-6 space-y-6 shadow-2xl"
    >
      <div
        style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold mb-1 border border-cyan-500/30">
            <span>Continuous Assessment Predictor</span>
          </div>
          <h3
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-xl font-black tracking-tight"
          >
            Interactive CGPA & Target Grade Simulator
          </h3>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
            Adjust expected final examination scores to simulate your semester SGPA and target CGPA
          </p>
        </div>

        {/* Projected Metric Badges */}
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.15)',
              borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.4)'
            }}
            className="p-3.5 rounded-2xl border text-center min-w-[110px] shadow-sm"
          >
            <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Projected SGPA</p>
            <p
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-2xl font-black mt-0.5"
            >
              {projectedSgpa.toFixed(2)}
            </p>
            <p className="text-[10px] text-emerald-500 font-bold">Scale: 4.00</p>
          </div>

          <div
            style={{
              backgroundColor: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.15)',
              borderColor: isLight ? '#bfdbfe' : 'rgba(59, 130, 246, 0.4)'
            }}
            className="p-3.5 rounded-2xl border text-center min-w-[110px] shadow-sm"
          >
            <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Target CGPA</p>
            <p
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-2xl font-black mt-0.5"
            >
              {projectedCumulativeCgpa.toFixed(2)}
            </p>
            <p className="text-[10px] text-cyan-500 font-bold">Cumulative</p>
          </div>
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {simCourses.map(sc => {
          const totalMarks = sc.quizScore + sc.midtermScore + sc.assignmentScore + sc.expectedFinal;
          const { grade, gp } = calculateCourseGrade(totalMarks);

          return (
            <div
              key={sc.courseId}
              style={{
                backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="p-4 rounded-2xl border space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
                    className="font-mono text-xs font-black px-2 py-0.5 rounded border border-cyan-500/30"
                  >
                    {sc.courseCode}
                  </span>
                  <h4
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black text-sm mt-1"
                  >
                    {sc.courseTitle}
                  </h4>
                  <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-[11px] font-semibold">
                    Credits: {sc.credits}.0 • Continuous: {sc.quizScore + sc.midtermScore + sc.assignmentScore}/60
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block font-black text-sm px-2.5 py-1 rounded-xl border ${
                      gp >= 3.5
                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                        : gp >= 2.5
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-500 border-rose-500/30'
                    }`}
                  >
                    {grade} ({gp.toFixed(2)})
                  </span>
                  <p
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="text-xs font-bold mt-1"
                  >
                    {totalMarks} / 100
                  </p>
                </div>
              </div>

              {/* Slider for Expected Final Exam (0 - 40) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="font-semibold">
                    Expected Final Exam Score:
                  </span>
                  <span className="font-mono font-black text-cyan-500">{sc.expectedFinal} / 40</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={sc.expectedFinal}
                  onChange={e => handleFinalChange(sc.courseId, parseInt(e.target.value, 10) || 0)}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
