import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { downloadAcademicTranscriptPDF } from '../../utils/pdfGenerator';
import { Download } from 'lucide-react';

interface StudentAcademicPerformanceProps {
  isDarkMode?: boolean;
}

export const StudentAcademicPerformance: React.FC<StudentAcademicPerformanceProps> = ({
  isDarkMode = true
}) => {
  const { student, evaluations } = useApp();
  const studentEvals = evaluations.filter((e) => e.studentId === student.id);

  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl'
    : 'bg-white border-slate-200 shadow-sm text-slate-800';

  const [projectedFinals, setProjectedFinals] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    studentEvals.forEach((c) => {
      init[c.courseCode] = c.finalExamMarks;
    });
    return init;
  });

  const getSimulatedTotal = (code: string) => {
    const course = studentEvals.find((c) => c.courseCode === code);
    if (!course) return 0;
    const finalM = projectedFinals[code] ?? course.finalExamMarks;
    return Math.round(course.quizMarks + course.assignmentMarks + course.attendanceMarks + finalM);
  };

  const getSimulatedGP = (total: number) => {
    if (total >= 80) return 4.0;
    if (total >= 75) return 3.75;
    if (total >= 70) return 3.5;
    if (total >= 65) return 3.25;
    if (total >= 60) return 3.0;
    if (total >= 55) return 2.75;
    if (total >= 50) return 2.5;
    if (total >= 45) return 2.25;
    if (total >= 40) return 2.0;
    return 0.0;
  };

  const totalSimCredits = studentEvals.reduce((acc, curr) => acc + curr.creditHours, 0);
  const totalSimPoints = studentEvals.reduce((acc, curr) => {
    const total = getSimulatedTotal(curr.courseCode);
    return acc + getSimulatedGP(total) * curr.creditHours;
  }, 0);
  const simulatedSgpa = totalSimCredits > 0 ? (totalSimPoints / totalSimCredits).toFixed(2) : '0.00';

  const handleDownloadTranscript = () => {
    downloadAcademicTranscriptPDF({
      studentName: student.name,
      studentIdNo: student.studentIdNo,
      departmentName: 'Computer Science & Engineering',
      currentSemester: student.currentSemester,
      cgpa: student.cgpa,
      currentSgpa: student.currentSgpa,
      totalCredits: student.totalCredits,
      courses: studentEvals.map((e) => ({
        courseCode: e.courseCode,
        courseName: e.courseName,
        creditHours: e.creditHours,
        grade: e.grade,
        gradePoint: e.gradePoint,
        totalMarks: e.totalMarks
      }))
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Academic Performance Breakdown</h2>
          <p className="text-xs opacity-70">
            Detailed continuous course evaluation, mid-term, quiz analytics, and projected SGPA simulation.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadTranscript}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-600/25 self-start sm:self-auto transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Official Transcript (PDF)</span>
        </button>
      </div>

      {/* Formula Derivation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className={`p-4 rounded-2xl border space-y-1.5 ${cardStyle}`}>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="material-symbols-outlined text-base">functions</span>
            <span>Attendance Marks Formula</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Attendance Marks (10) = (Total Classes Present &divide; Total Classes Held) &times; 10
          </p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1.5 ${cardStyle}`}>
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <span className="material-symbols-outlined text-base">calculate</span>
            <span>Weighted Total Marks</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Total (100) = Quiz (20) + Assignment (20) + Attendance (10) + Final Exam (50)
          </p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1.5 ${cardStyle}`}>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-base">grade</span>
            <span>SGPA Derivation</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            SGPA = &Sigma;(Course Grade Point &times; Credits) &divide; &Sigma;(Total Semester Credits)
          </p>
        </div>
      </div>

      {/* Main Assessment Ledger Table */}
      <div className={`p-6 rounded-2xl border space-y-4 ${cardStyle}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Semester Assessment Ledger (Spring 2026)</h3>
          <span className="text-xs font-semibold text-cyan-400">Total Credits: {totalSimCredits}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="uppercase font-semibold text-[11px] bg-[#0a0f1d] text-slate-400">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Attendance %</th>
                <th className="p-3">Quiz (20)</th>
                <th className="p-3">Assign (20)</th>
                <th className="p-3">Final (50)</th>
                <th className="p-3">Total (100)</th>
                <th className="p-3">Grade Point</th>
                <th className="p-3 text-right">Risk Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2538] text-slate-200">
              {studentEvals.map((c) => (
                <tr key={c.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-cyan-400">{c.courseCode}</td>
                  <td className="p-3 font-medium text-white">{c.courseName}</td>
                  <td
                    className={`p-3 tabular-nums font-semibold ${
                      c.attendancePercent < 75 ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {c.attendancePercent}%
                  </td>
                  <td className="p-3 tabular-nums">{c.quizMarks}</td>
                  <td className="p-3 tabular-nums">{c.assignmentMarks}</td>
                  <td className="p-3 tabular-nums">{c.finalExamMarks}</td>
                  <td className="p-3 font-bold text-white tabular-nums text-sm">{c.totalMarks}</td>
                  <td className="p-3 font-bold text-slate-200 tabular-nums">
                    {c.grade} ({c.gradePoint.toFixed(2)})
                  </td>
                  <td className="p-3 text-right">
                    <StatusBadge status={c.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive CGPA & Grade Simulator */}
      <div className={`p-6 rounded-2xl border space-y-4 ${cardStyle}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">tune</span>
              <span>Interactive Target Grade & SGPA Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag the expected final exam score sliders to project your semester GPA target.
            </p>
          </div>
          <div className="bg-[#162035] border border-[#232f48] px-4 py-2 rounded-xl text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Projected SGPA
            </span>
            <span className="text-xl font-extrabold text-cyan-400 tabular-nums">
              {simulatedSgpa}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {studentEvals.map((course) => {
            const currentFinal = projectedFinals[course.courseCode] ?? course.finalExamMarks;
            const simTotal = getSimulatedTotal(course.courseCode);
            const simGP = getSimulatedGP(simTotal);
            return (
              <div
                key={course.id}
                className="bg-[#141b2c] border border-[#1e273a] p-4 rounded-xl space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    {course.courseCode} &bull; {course.courseName}
                  </span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    Est. Total: {simTotal} (GP: {simGP.toFixed(2)})
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Projected Final Exam Score</span>
                    <span className="font-bold text-white tabular-nums">{currentFinal} / 50</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={currentFinal}
                    onChange={(e) =>
                      setProjectedFinals({
                        ...projectedFinals,
                        [course.courseCode]: Number(e.target.value)
                      })
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
