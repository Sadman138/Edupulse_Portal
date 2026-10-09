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
  CheckCircle2
} from 'lucide-react';

export const StudentAcademicPerformance: React.FC = () => {
  const { studentCourses } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(studentCourses[0].courseId);

  const selectedCourse = studentCourses.find(c => c.courseId === selectedCourseId) || studentCourses[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Academic Performance & Marks Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Continuous Assessment breakdown, SGPA estimation, and early risk diagnostics
          </p>
        </div>

        <button
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," +
              "Course Code,Course Title,Credits,Quiz (20),Midterm (30),Assignment (10),Final (40),Total (100),Grade,GPA,Risk\n" +
              studentCourses.map(c => `"${c.courseCode}","${c.courseTitle}",${c.credits},${c.quizScore},${c.midtermScore},${c.assignmentScore},${c.finalExamScore},${c.totalMarksObtained},"${c.currentGrade}",${c.currentGPA},"${c.riskLevel}"`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "Academic_Marks_Ledger_Spring2026.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors w-fit"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {studentCourses.map(c => (
          <button
            key={c.courseId}
            onClick={() => setSelectedCourseId(c.courseId)}
            className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all ${
              selectedCourseId === c.courseId
                ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{c.courseCode}</span>
              <StatusBadge status={c.riskLevel} size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate max-w-[140px]">{c.courseTitle}</p>
          </button>
        ))}
      </div>

      {/* Selected Course Deep Dive Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                {selectedCourse.courseCode}
              </span>
              <span className="text-xs text-slate-400 font-medium">({selectedCourse.credits} Credit Hours)</span>
              <StatusBadge status={selectedCourse.riskLevel} size="md" />
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">{selectedCourse.courseTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Course Instructor: <strong className="text-slate-200">{selectedCourse.instructor}</strong> • Section: <strong className="text-slate-200">{selectedCourse.section}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-center px-3 border-r border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Marks</p>
              <p className="text-2xl font-black text-white">{selectedCourse.totalMarksObtained} <span className="text-xs font-normal text-slate-400">/ 100</span></p>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Current Grade</p>
              <p className="text-2xl font-black text-indigo-400">{selectedCourse.currentGrade}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] uppercase font-bold text-slate-400">Point GPA</p>
              <p className="text-2xl font-black text-emerald-400">{selectedCourse.currentGPA.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Assessment Breakdown Bars */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Assessment Components Breakdown
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quiz */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Quizzes / Class Tests</span>
                <span className="font-bold text-white">{selectedCourse.quizScore} / 20</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(selectedCourse.quizScore / 20) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">Weight: 20% of continuous marks</p>
            </div>

            {/* Midterm */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Mid-Term Examination</span>
                <span className="font-bold text-white">{selectedCourse.midtermScore} / 30</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedCourse.midtermScore >= 20 ? 'bg-emerald-500' : selectedCourse.midtermScore >= 15 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${(selectedCourse.midtermScore / 30) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">Weight: 30% of total grade</p>
            </div>

            {/* Assignment & Lab */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Assignments & Projects</span>
                <span className="font-bold text-white">{selectedCourse.assignmentScore} / 10</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${(selectedCourse.assignmentScore / 10) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">Weight: 10% submission grade</p>
            </div>

            {/* Final Exam Estimate */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Semester Final (Projected)</span>
                <span className="font-bold text-white">{selectedCourse.finalExamScore} / 40</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${(selectedCourse.finalExamScore / 40) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">Weight: 40% terminal exam</p>
            </div>
          </div>
        </div>

        {/* Risk Factor Analysis Box */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            selectedCourse.riskLevel === 'CRITICAL'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : selectedCourse.riskLevel === 'WARNING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h5 className="font-bold uppercase tracking-wider">
              Early Warning Status: {selectedCourse.riskLevel}
            </h5>
            <p className="leading-relaxed">{selectedCourse.riskFactorNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
