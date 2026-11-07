import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  FileText,
  BellRing,
  Printer,
  Sparkles
} from 'lucide-react';
import { AssessmentRecord } from '../../types';
import { CsvImportExportModal } from '../../components/common/CsvImportExportModal';

export const TeacherAssessmentEntry: React.FC = () => {
  const {
    assessmentRecords,
    updateAssessmentRecord,
    bulkImportAssessments,
    sendAdvisorWarningNotification,
    setPdfModalDoc,
    theme
  } = useApp();
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [advisorNotifiedToast, setAdvisorNotifiedToast] = useState<string | null>(null);

  const isLight = theme?.mode === 'light';

  // Download sample template
  const handleDownloadSampleCsv = () => {
    const sample = "studentId,studentName,rollNumber,quiz1,quiz2,quiz3,midterm,assignment,finalExam\n" +
      "241-115-211,Fathin Sadman,211,18,19,20,26,9,35\n" +
      "241-115-212,Tahsin Ahmed,212,20,18,19,28,10,36\n" +
      "241-115-213,Nusrat Jahan,213,12,14,10,18,7,24\n" +
      "241-115-214,Shahriar Kabir,214,8,9,6,11,4,15";
    const uri = encodeURI("data:text/csv;charset=utf-8," + sample);
    const a = document.createElement("a");
    a.href = uri;
    a.download = "Assessment_Marks_Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // SRS FR-TEA-16: Export current table to Excel (.xls HTML table format compatible with MS Excel)
  const handleExportExcel = () => {
    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="utf-8"/></head>
      <body>
        <h2>Metropolitan University — Department of CSE</h2>
        <h3>Course: CSE 311 Database Management Systems — Official Grade Sheet</h3>
        <table border="1">
          <thead>
            <tr style="background-color: #0c1a40; color: white;">
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Roll</th>
              <th>CT 1 (20)</th>
              <th>CT 2 (20)</th>
              <th>CT 3 (20)</th>
              <th>Best 2 CTs (20)</th>
              <th>Midterm (30)</th>
              <th>Assignment (10)</th>
              <th>Final Exam (40)</th>
              <th>Total Marks (100)</th>
              <th>Letter Grade</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            ${assessmentRecords.map(r => `
              <tr>
                <td>${r.studentId}</td>
                <td>${r.studentName}</td>
                <td>${r.rollNumber}</td>
                <td>${r.quiz1}</td>
                <td>${r.quiz2}</td>
                <td>${r.quiz3 !== undefined ? r.quiz3 : r.quiz2}</td>
                <td><strong>${r.bestTwoCtAverage !== undefined ? r.bestTwoCtAverage : Math.round(((r.quiz1 + r.quiz2) / 2) * 10) / 10}</strong></td>
                <td>${r.midterm}</td>
                <td>${r.assignment}</td>
                <td>${r.finalExam}</td>
                <td><strong>${r.total}</strong></td>
                <td>${r.letterGrade}</td>
                <td>${r.gpa.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'CSE311_Continuous_Assessment_Marks_Official.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // SRS FR-TEA-16: Generate Official University PDF Grade Sheet
  const handleOpenPdfGradeSheet = () => {
    const content = `OFFICIAL COURSE ASSESSMENT & GRADE LEDGER\n\n` +
      `Course: CSE 311 — Database Management Systems (Credits: 3.0)\n` +
      `Instructor: Dr. Tariqul Islam • Department of CSE • Metropolitan University\n` +
      `Semester: 5th Semester (Spring 2026) • Total Students Enrolled: ${assessmentRecords.length}\n` +
      `--------------------------------------------------------------------------------\n\n` +
      `STUDENT PERFORMANCE BREAKDOWN (BEST 2 OF 3 CTs ENFORCED):\n` +
      assessmentRecords.map(r => {
        const ctBest = r.bestTwoCtAverage !== undefined ? r.bestTwoCtAverage : Math.round(((r.quiz1 + r.quiz2) / 2) * 10) / 10;
        return `[${r.studentId}] ${r.studentName.padEnd(22)} | CT Best: ${ctBest}/20 | Mid: ${r.midterm}/30 | Asg: ${r.assignment}/10 | Final: ${r.finalExam}/40 | TOTAL: ${r.total}/100 | Grade: ${r.letterGrade} (${r.gpa.toFixed(2)})`;
      }).join('\n') +
      `\n\n--------------------------------------------------------------------------------\n` +
      `Statistical Summary:\n` +
      `• Total A+ Grades: ${assessmentRecords.filter(r => r.letterGrade === 'A+').length}\n` +
      `• Total At-Risk / Failing Students: ${assessmentRecords.filter(r => r.gpa < 2.5).length}\n` +
      `• Department Average GPA: ${(assessmentRecords.reduce((acc, r) => acc + r.gpa, 0) / (assessmentRecords.length || 1)).toFixed(2)}\n\n` +
      `Certified by Course Teacher & Head of Department of Computer Science & Engineering.`;

    setPdfModalDoc({
      title: 'CSE 311 — Official Continuous Assessment Grade Sheet',
      category: 'GRADE SHEET',
      content
    });
  };

  // SRS FR-TEA-17: Notify Student & Advisor
  const handleNotifyAdvisor = (studentId: string, studentName: string) => {
    sendAdvisorWarningNotification(studentId, 'CSE 311', `Debarment alert & low continuous assessment warning generated by Course Teacher.`);
    setAdvisorNotifiedToast(`Warning notification dispatched to ${studentName} and their assigned Academic Advisor!`);
    setTimeout(() => setAdvisorNotifiedToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {advisorNotifiedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{advisorNotifiedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              SRS FR-TEA-14 & FR-TEA-16
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Best 2 of 3 CT Enabled
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
            Continuous Assessment Entry & Grade Sheet Desk
          </h2>
          <p className="text-xs text-slate-400">
            CSE 311: Database Management Systems • Automated Best 2 of 3 CT calculation, Excel/PDF export & Advisor notifications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel (.xls)</span>
          </button>
          <button
            onClick={handleOpenPdfGradeSheet}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>PDF Grade Sheet</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Instructions Pill */}
      <div
        className="p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors"
        style={{
          backgroundColor: 'var(--ep-bg-card, #111827)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))',
          color: 'var(--ep-text-secondary, #94a3b8)'
        }}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Edit marks directly inside any table input cell. The system instantly recalculates <strong>Best 2 of 3 CTs</strong>, <strong>Total Score</strong>, <strong>Letter Grade</strong>, and <strong>Grade Point (GPA)</strong>.
          </span>
        </div>
        <span className="font-mono text-emerald-400 font-bold hidden sm:inline">Auto-Recalculate Active</span>
      </div>

      {/* Spreadsheet Table */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl transition-colors"
        style={{
          backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #111827)',
          borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="uppercase tracking-wider font-extrabold border-b text-[11px]"
              style={{
                backgroundColor: isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.8)',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
                color: isLight ? '#0f172a' : '#94a3b8'
              }}
            >
              <tr>
                <th className="px-4 py-3.5" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Student ID & Name</th>
                <th className="px-2.5 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>CT 1 (20)</th>
                <th className="px-2.5 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>CT 2 (20)</th>
                <th className="px-2.5 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>CT 3 (20)</th>
                <th
                  className="px-2.5 py-3.5 text-center font-black"
                  style={{
                    color: isLight ? '#0369a1' : '#22d3ee',
                    backgroundColor: isLight ? '#e0f2fe' : 'rgba(8, 51, 68, 0.3)'
                  }}
                >
                  Best 2 CTs (20)
                </th>
                <th className="px-2.5 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Midterm (30)</th>
                <th className="px-2.5 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Assignment (10)</th>
                <th className="px-2.5 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Final (40)</th>
                <th className="px-2.5 py-3.5 text-center font-black" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>Total (100)</th>
                <th className="px-2.5 py-3.5 text-center font-black" style={{ color: isLight ? '#4338ca' : '#a5b4fc' }}>Grade</th>
                <th className="px-2.5 py-3.5 text-center font-black" style={{ color: isLight ? '#047857' : '#34d399' }}>GPA</th>
                <th className="px-3 py-3.5 text-center" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Advisor Alert</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                borderColor: isLight ? '#e2e8f0' : 'rgba(30, 41, 59, 0.8)'
              }}
            >
              {assessmentRecords.map(rec => {
                const ct3Val = rec.quiz3 !== undefined ? rec.quiz3 : rec.quiz2;
                const ctBest = rec.bestTwoCtAverage !== undefined
                  ? rec.bestTwoCtAverage
                  : Math.round(((Math.max(rec.quiz1, rec.quiz2) + Math.max(Math.min(rec.quiz1, rec.quiz2), ct3Val)) / 2) * 10) / 10;
                const isAtRisk = rec.gpa < 2.5 || rec.letterGrade === 'F' || rec.letterGrade === 'D';

                const inputClass = `w-14 rounded-lg py-1 px-1.5 text-center text-xs font-mono font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-white border-2 border-slate-300 text-slate-900 shadow-2xs hover:border-slate-400 focus:border-indigo-600 focus:bg-white'
                    : 'bg-slate-900 border border-slate-700 text-white font-bold'
                }`;

                return (
                  <tr
                    key={rec.studentId}
                    className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/30'}`}
                  >
                    <td className="px-4 py-3">
                      <p
                        data-student-name="true"
                        className="student-name font-black text-sm"
                        style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                      >
                        {rec.studentName}
                      </p>
                      <p
                        data-student-id="true"
                        className="student-id font-mono text-xs font-black mt-0.5"
                        style={{ color: isLight ? '#312e81' : 'var(--ep-accent-secondary, #818cf8)' }}
                      >
                        {rec.studentId}
                      </p>
                    </td>

                    {/* CT 1 */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={rec.quiz1}
                        onChange={e => updateAssessmentRecord(rec.studentId, 'quiz1', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>

                    {/* CT 2 */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={rec.quiz2}
                        onChange={e => updateAssessmentRecord(rec.studentId, 'quiz2', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>

                    {/* CT 3 */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={ct3Val}
                        onChange={e => updateAssessmentRecord(rec.studentId, 'quiz3', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>

                    {/* Computed Best 2 CTs Average (SRS FR-TEA-14) */}
                    <td
                      className="px-2 py-3 text-center font-mono font-black text-sm"
                      style={{
                        color: isLight ? '#0369a1' : '#67e8f9',
                        backgroundColor: isLight ? '#e0f2fe' : 'rgba(8, 51, 68, 0.3)'
                      }}
                    >
                      {ctBest}
                    </td>

                    {/* Midterm */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={rec.midterm}
                        onChange={e => updateAssessmentRecord(rec.studentId, 'midterm', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>

                    {/* Assignment */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rec.assignment}
                        onChange={e => updateAssessmentRecord(rec.studentId, 'assignment', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>

                    {/* Final Exam */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={rec.finalExam}
                        onChange={e => updateAssessmentRecord(rec.studentId, 'finalExam', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>

                    {/* Total (100) */}
                    <td
                      className="px-2.5 py-3 text-center font-mono font-black text-sm"
                      style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                    >
                      {rec.total}
                    </td>

                    {/* Letter Grade */}
                    <td className="px-2 py-3 text-center">
                      <span
                        style={
                          isLight
                            ? rec.letterGrade === 'A+' || rec.letterGrade === 'A'
                              ? { color: '#064e3b', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }
                              : rec.letterGrade === 'F'
                              ? { color: '#881337', backgroundColor: '#fff1f2', borderColor: '#fecdd3' }
                              : { color: '#1e3a8a', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }
                            : {}
                        }
                        className={`font-black text-xs px-2.5 py-0.5 rounded-full border ${
                          rec.letterGrade === 'A+' || rec.letterGrade === 'A' ? (isLight ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30') :
                          rec.letterGrade === 'F' ? (isLight ? 'bg-rose-50 text-rose-950 border-rose-300 font-black' : 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-black') :
                          (isLight ? 'bg-indigo-50 text-indigo-950 border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30')
                        }`}
                      >
                        {rec.letterGrade}
                      </span>
                    </td>

                    {/* GPA */}
                    <td
                      className="px-2 py-3 text-center font-mono font-black text-sm"
                      style={{ color: isLight ? '#047857' : '#34d399' }}
                    >
                      {rec.gpa.toFixed(2)}
                    </td>

                    {/* SRS FR-TEA-17: Notify Advisor Button */}
                    <td className="px-3 py-3 text-center">
                      {rec.advisorNotified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Notified</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleNotifyAdvisor(rec.studentId, rec.studentName)}
                          title="Send Warning to Student & Academic Advisor"
                          className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isAtRisk
                              ? (isLight ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300 animate-pulse' : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 animate-pulse')
                              : (isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700')
                          }`}
                        >
                          <BellRing className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Bulk Import Modal */}
      <CsvImportExportModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        title="Bulk Import Student Assessment Marks (CSV)"
        sampleFilename="Assessment_Marks_Template.csv"
        sampleCsvContent={`studentId,studentName,rollNumber,quiz1,quiz2,midterm,assignment,finalExam
241-115-211,Fathin Sadman,211,18,19,26,9,35
241-115-212,Tahsin Ahmed,212,20,18,28,10,36
241-115-213,Nusrat Jahan,213,12,14,18,7,24
241-115-214,Shahriar Kabir,214,8,9,11,4,15`}
        expectedHeaders={['studentid', 'studentname', 'rollnumber', 'quiz1', 'quiz2', 'midterm', 'assignment', 'finalexam']}
        columnGuide={[
          { key: 'studentId', description: 'Student Registration ID', required: true, example: '241-115-211' },
          { key: 'studentName', description: 'Full Name of the Student', required: true, example: 'Fathin Sadman' },
          { key: 'rollNumber', description: 'Exam Roll Identifier', example: '211' },
          { key: 'quiz1', description: 'Quiz 1 Marks (Max 20)', example: '18' },
          { key: 'quiz2', description: 'Quiz 2 Marks (Max 20)', example: '19' },
          { key: 'midterm', description: 'Midterm Examination (Max 30)', example: '26' },
          { key: 'assignment', description: 'Continuous Assignment / Term Project (Max 10)', example: '9' },
          { key: 'finalExam', description: 'Semester Final Examination (Max 40)', example: '35' }
        ]}
        exportData={assessmentRecords}
        exportFilename="CSE311_Continuous_Assessment_Marks.csv"
        onImport={(parsedRows) => {
          const newRecords: AssessmentRecord[] = parsedRows.map(parts => {
            const q1 = parseFloat(parts['quiz1']) || 0;
            const q2 = parseFloat(parts['quiz2']) || 0;
            const mid = parseFloat(parts['midterm']) || 0;
            const asg = parseFloat(parts['assignment']) || 0;
            const fin = parseFloat(parts['finalexam']) || 0;
            const total = q1 + q2 + mid + asg + fin;
            let letterGrade = 'F';
            let gpa = 0.0;
            if (total >= 80) { letterGrade = 'A+'; gpa = 4.0; }
            else if (total >= 75) { letterGrade = 'A'; gpa = 3.75; }
            else if (total >= 70) { letterGrade = 'A-'; gpa = 3.50; }
            else if (total >= 65) { letterGrade = 'B+'; gpa = 3.25; }
            else if (total >= 60) { letterGrade = 'B'; gpa = 3.00; }
            else if (total >= 55) { letterGrade = 'B-'; gpa = 2.75; }
            else if (total >= 50) { letterGrade = 'C+'; gpa = 2.50; }
            else if (total >= 45) { letterGrade = 'C'; gpa = 2.25; }
            else if (total >= 40) { letterGrade = 'D'; gpa = 2.00; }

            return {
              studentId: parts['studentid'] || `241-115-${Math.floor(200 + Math.random() * 800)}`,
              studentName: parts['studentname'] || 'Student',
              rollNumber: parts['rollnumber'] || parts['studentid']?.slice(-3) || '000',
              quiz1: q1,
              quiz2: q2,
              midterm: mid,
              assignment: asg,
              finalExam: fin,
              total,
              letterGrade,
              gpa
            };
          });

          if (newRecords.length > 0) {
            bulkImportAssessments(newRecords);
            return { success: true, count: newRecords.length };
          }
          return { success: false, count: 0, error: 'No valid records found in CSV' };
        }}
      />
    </div>
  );
};
