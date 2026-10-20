import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Clock,
  Download,
  Eye,
  Upload,
  CheckCircle2,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AssignmentCardData {
  id: string;
  courseCode: string;
  title: string;
  deadline: string;
  totalMarks: number;
  status: 'PENDING' | 'GRADED' | 'SUBMITTED';
  submissionFile?: string;
  score?: string;
  description?: string;
}

export const StudentAssignments: React.FC = () => {
  const { setPdfModalDoc } = useApp();

  const [assignmentsList, setAssignmentsList] = useState<AssignmentCardData[]>([
    {
      id: 'asg-303',
      courseCode: 'CSE 303',
      title: 'Assignment 3: LL(1) Parser Implementation in Python/C++',
      deadline: '2026-10-06 23:59',
      totalMarks: 20,
      status: 'PENDING',
      description: 'Implement a top-down predictive LL(1) parser table and parse string tokens with syntactic error handlers.'
    },
    {
      id: 'asg-301',
      courseCode: 'CSE 301',
      title: 'Assignment 2: Schema Normalization (BCNF & 3NF) & Triggers',
      deadline: '2026-10-08 18:00',
      totalMarks: 20,
      status: 'PENDING',
      description: 'Design a normalized 3NF database schema, construct BCNF functional dependencies, and write PostgreSQL event audit triggers.'
    },
    {
      id: 'asg-305',
      courseCode: 'CSE 305',
      title: 'Assignment 3: Architectural Design & Microservices Sequence Diagram',
      deadline: '2026-09-30 23:59',
      totalMarks: 20,
      status: 'GRADED',
      submissionFile: 'Fathin_241115211_CSE305_ArchDesign.pdf',
      score: '18/20',
      description: 'Model UML sequence diagrams for high-throughput distributed microservices with Redis event caching.'
    }
  ]);

  const [activeUploadModal, setActiveUploadModal] = useState<AssignmentCardData | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleDownloadPdf = (asg: AssignmentCardData) => {
    const textContent =
      `METROPOLITAN UNIVERSITY — DEPARTMENT OF CSE\n` +
      `Official Course Assignment Specification & Rubric\n` +
      `Course: ${asg.courseCode}\n` +
      `Assignment: ${asg.title}\n` +
      `Submission Deadline: ${asg.deadline}\n` +
      `Total Marks: ${asg.totalMarks} Marks\n` +
      `Status: ${asg.status}\n\n` +
      `Problem Statement:\n${asg.description || 'Complete the implementation according to the departmental syllabus and submit before the deadline.'}\n\n` +
      `Grading Rubric:\n` +
      `- Code Correctness & Test Suite: 10 Marks\n` +
      `- Design Quality & Documentation: 5 Marks\n` +
      `- Viva & Edge Case Handling: 5 Marks\n\n` +
      `Controller of Continuous Assessments\n` +
      `Metropolitan University, Sylhet.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asg.courseCode.replace(/\s+/g, '_')}_Assignment_Spec.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreviewPdf = (asg: AssignmentCardData) => {
    setPdfModalDoc({
      title: asg.title,
      category: asg.courseCode,
      content:
        `METROPOLITAN UNIVERSITY CSE SPECIFICATION\n` +
        `Title: ${asg.title}\n` +
        `Course: ${asg.courseCode}\n` +
        `Deadline: ${asg.deadline}\n` +
        `Total Marks: ${asg.totalMarks} Marks\n\n` +
        `Description:\n${asg.description || 'Submission instructions verified.'}\n\n` +
        `UGC Continuous Assessment Rule:\nLate submissions incur a 10% penalty per calendar day.`
    });
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadModal) return;
    const finalName = uploadedFileName || `Fathin_241115211_${activeUploadModal.courseCode.replace(/\s+/g, '')}_Deliverable.pdf`;

    setAssignmentsList(prev =>
      prev.map(a =>
        a.id === activeUploadModal.id
          ? {
              ...a,
              status: 'SUBMITTED',
              submissionFile: finalName
            }
          : a
      )
    );

    setActiveUploadModal(null);
    setSuccessToast(`Successfully uploaded ${finalName}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header matching screenshot */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Assignment Submission Hub
          </h2>
        </div>
        <p className="text-xs text-slate-400 pl-8.5">
          Download official question papers and rubrics in PDF format, and upload assignment deliverables.
        </p>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* 3 Assignment Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {assignmentsList.map(asg => (
          <div
            key={asg.id}
            className="rounded-2xl border border-slate-800/90 bg-[#0d1525] p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-all"
          >
            {/* Top Row: Course Pill & Status Badge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 font-mono text-xs font-bold">
                  {asg.courseCode}
                </span>

                {asg.status === 'PENDING' && (
                  <span className="px-2.5 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
                    PENDING
                  </span>
                )}
                {asg.status === 'GRADED' && (
                  <span className="px-2.5 py-0.5 rounded-md border border-slate-700 bg-slate-800/80 text-slate-300 text-[10px] font-extrabold uppercase tracking-wider">
                    GRADED
                  </span>
                )}
                {asg.status === 'SUBMITTED' && (
                  <span className="px-2.5 py-0.5 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
                    SUBMITTED
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug min-h-[44px]">
                {asg.title}
              </h3>

              {/* Deadline with Red Clock Icon */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-medium">Deadline: {asg.deadline}</span>
              </div>

              {/* Total Marks Row */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/70">
                <span>Total Marks:</span>
                <span className="font-bold text-white">{asg.totalMarks} Marks</span>
              </div>

              {/* Graded evaluation slip box if graded */}
              {asg.status === 'GRADED' && (
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-400 space-y-0.5">
                  <p className="truncate font-mono">
                    Submitted: {asg.submissionFile}
                  </p>
                  <p className="font-bold">
                    Score: {asg.score}
                  </p>
                </div>
              )}

              {/* Submitted status box if submitted */}
              {asg.status === 'SUBMITTED' && (
                <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300 space-y-0.5">
                  <p className="truncate font-mono">
                    Submitted: {asg.submissionFile}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Awaiting faculty review & marks
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadPdf(asg)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#090f1d] hover:bg-[#121c33] text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => handlePreviewPdf(asg)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#090f1d] hover:bg-[#121c33] text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview & Print</span>
                </button>
              </div>

              {asg.status === 'GRADED' ? (
                <button
                  onClick={() => {
                    setActiveUploadModal(asg);
                    setUploadedFileName(`Fathin_241115211_${asg.courseCode.replace(/\s+/g, '')}_Revision.pdf`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Re-upload Solution</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveUploadModal(asg);
                    setUploadedFileName(`Fathin_241115211_${asg.courseCode.replace(/\s+/g, '')}_Deliverable.pdf`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit Deliverable</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Deliverable Modal */}
      {activeUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#0d1525] border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Upload Assignment Solution
              </h3>
              <button
                onClick={() => setActiveUploadModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Uploading deliverable for <strong className="text-cyan-400">{activeUploadModal.title}</strong> ({activeUploadModal.courseCode}).
            </p>

            <form onSubmit={handleSubmitUpload} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Deliverable File Name:
                </label>
                <input
                  type="text"
                  value={uploadedFileName}
                  onChange={e => setUploadedFileName(e.target.value)}
                  required
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center text-slate-400 space-y-2 bg-[#090e1b]">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs font-semibold text-white">Choose PDF, ZIP, or Code Bundle</p>
                <p className="text-[10px] text-slate-500">Max file size: 25 MB • Verified against Plagiarism Checker</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveUploadModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/25"
                >
                  Confirm & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
