import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileCheck2,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  FileText
} from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const { assignments, submitAssignment, setPdfModalDoc } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  const [selectedAsgId, setSelectedAsgId] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');

  const filtered = assignments.filter(a => {
    if (activeFilter === 'ALL') return true;
    return a.status === activeFilter;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgId || !uploadFileName.trim()) return;
    submitAssignment(selectedAsgId, uploadFileName);
    setSelectedAsgId(null);
    setUploadFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Assignment Hub & Submissions
          </h2>
          <p className="text-xs text-slate-400">
            Coursework deliverables, grading rubrics, and faculty evaluations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(asg => (
          <div
            key={asg.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {asg.courseCode}
                </span>
                <StatusBadge status={asg.status} size="sm" />
              </div>

              <h3 className="font-extrabold text-white text-base leading-snug">
                {asg.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {asg.description}
              </p>
            </div>

            {/* Evaluation and Feedback Section */}
            {asg.status === 'GRADED' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span>Score Awarded:</span>
                  <span className="font-mono text-sm">{asg.obtainedScore} / {asg.totalPoints} pts</span>
                </div>
                {asg.facultyFeedback && (
                  <p className="text-[11px] text-emerald-200/90 italic flex items-center gap-1.5 mt-1">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>"{asg.facultyFeedback}"</span>
                  </p>
                )}
              </div>
            )}

            {/* Submission metadata */}
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Due: {asg.dueDate}</span>
              </div>

              <div className="flex items-center gap-2">
                {asg.status === 'PENDING' ? (
                  <button
                    onClick={() => {
                      setSelectedAsgId(asg.id);
                      setUploadFileName(`Submission_${asg.courseCode.replace(/\s+/g, '')}_241115211.pdf`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Deliverable</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setPdfModalDoc({
                        title: asg.title,
                        category: asg.courseCode,
                        content: `ASSIGNMENT SPECIFICATION & RECEIPT\nCourse: ${asg.courseCode} - ${asg.courseTitle}\nAssignment: ${asg.title}\nDue Date: ${asg.dueDate}\nStatus: ${asg.status}\nSubmitted File: ${asg.submittedFileName || 'N/A'}\nAwarded Score: ${asg.obtainedScore || 'Pending Grading'}/${asg.totalPoints}\n\nTeacher Feedback:\n${asg.facultyFeedback || 'Evaluation under faculty review.'}`
                      })
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Submission Modal */}
      {selectedAsgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Upload Assignment Document</h3>
            <p className="text-xs text-slate-400">
              Submit your lab report, project zip, or written assignment PDF.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Document / Archive File Name:
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-400 space-y-2">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">Drag & drop submission file here</p>
                <p className="text-[10px] text-slate-500">Supports PDF, ZIP, DOCX up to 25 MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsgId(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
