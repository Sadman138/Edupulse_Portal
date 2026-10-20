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
  FileText
} from 'lucide-react';
import { AssessmentRecord } from '../../types';
import { CsvImportExportModal } from '../../components/common/CsvImportExportModal';

export const TeacherAssessmentEntry: React.FC = () => {
  const { assessmentRecords, updateAssessmentRecord, bulkImportAssessments } = useApp();
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Download sample template
  const handleDownloadSampleCsv = () => {
    const sample = "studentId,studentName,rollNumber,quiz1,quiz2,midterm,assignment,finalExam\n" +
      "241-115-211,Fathin Sadman,211,18,19,26,9,35\n" +
      "241-115-212,Tahsin Ahmed,212,20,18,28,10,36\n" +
      "241-115-213,Nusrat Jahan,213,12,14,18,7,24\n" +
      "241-115-214,Shahriar Kabir,214,8,9,11,4,15";
    const uri = encodeURI("data:text/csv;charset=utf-8," + sample);
    const a = document.createElement("a");
    a.href = uri;
    a.download = "Assessment_Marks_Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Export current table to CSV
  const handleExportCsv = () => {
    const header = "Student ID,Name,Roll,Quiz 1 (20),Quiz 2 (20),Midterm (30),Assignment (10),Final Exam (40),Total (100),Grade,GPA\n";
    const rows = assessmentRecords.map(r =>
      `"${r.studentId}","${r.studentName}","${r.rollNumber}",${r.quiz1},${r.quiz2},${r.midterm},${r.assignment},${r.finalExam},${r.total},"${r.letterGrade}",${r.gpa}`
    ).join("\n");
    const uri = encodeURI("data:text/csv;charset=utf-8," + header + rows);
    const a = document.createElement("a");
    a.href = uri;
    a.download = "CSE311_Continuous_Assessment_Marks.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Continuous Assessment Entry & Bulk CSV Desk
          </h2>
          <p className="text-xs text-slate-400">
            CSE 311: Database Management Systems • Interactive marks spreadsheet with live GPA recalculation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Instructions Pill */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Edit marks directly inside any table input cell. The system instantly recalculates <strong>Total Score</strong>, <strong>Letter Grade (A+, A, B, etc.)</strong>, and <strong>Grade Point (GPA)</strong>.
          </span>
        </div>
        <span className="font-mono text-emerald-400 font-bold hidden sm:inline">Auto-Save Enabled</span>
      </div>

      {/* Spreadsheet Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Student ID & Name</th>
                <th className="px-3 py-3.5 text-center">Quiz 1 (20)</th>
                <th className="px-3 py-3.5 text-center">Quiz 2 (20)</th>
                <th className="px-3 py-3.5 text-center">Midterm (30)</th>
                <th className="px-3 py-3.5 text-center">Assignment (10)</th>
                <th className="px-3 py-3.5 text-center">Final (40)</th>
                <th className="px-3 py-3.5 text-center font-bold text-white">Total (100)</th>
                <th className="px-3 py-3.5 text-center font-bold text-indigo-300">Grade</th>
                <th className="px-3 py-3.5 text-center font-bold text-emerald-400">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {assessmentRecords.map(rec => (
                <tr key={rec.studentId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white">{rec.studentName}</p>
                    <p className="font-mono text-slate-400 text-[11px]">{rec.studentId}</p>
                  </td>

                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={rec.quiz1}
                      onChange={e => updateAssessmentRecord(rec.studentId, 'quiz1', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={rec.quiz2}
                      onChange={e => updateAssessmentRecord(rec.studentId, 'quiz2', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={rec.midterm}
                      onChange={e => updateAssessmentRecord(rec.studentId, 'midterm', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={rec.assignment}
                      onChange={e => updateAssessmentRecord(rec.studentId, 'assignment', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={rec.finalExam}
                      onChange={e => updateAssessmentRecord(rec.studentId, 'finalExam', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-3 text-center font-mono font-black text-white text-sm">
                    {rec.total}
                  </td>

                  <td className="px-3 py-3 text-center">
                    <span className={`font-black text-xs px-2 py-0.5 rounded ${
                      rec.letterGrade === 'A+' ? 'bg-emerald-500/20 text-emerald-400' :
                      rec.letterGrade === 'F' ? 'bg-rose-500/20 text-rose-400 font-extrabold' :
                      'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {rec.letterGrade}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-center font-mono font-extrabold text-emerald-400">
                    {rec.gpa.toFixed(2)}
                  </td>
                </tr>
              ))}
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
