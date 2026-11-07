import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileCheck2,
  Plus,
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
  Users,
  FileText,
  X,
  Calendar,
  AlertCircle,
  History,
  Download,
  Eye,
  FileUp,
  Sparkles
} from 'lucide-react';
import { AssignmentItem } from '../../types';

export const TeacherAssignmentDesk: React.FC = () => {
  const {
    assignments,
    createAssignment,
    gradeAssignment,
    extendAssignmentDeadline,
    setPdfModalDoc,
    theme
  } = useApp();

  const isLight = theme.mode === 'light';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGradingModal, setActiveGradingModal] = useState<AssignmentItem | null>(null);
  const [activeExtendModal, setActiveExtendModal] = useState<AssignmentItem | null>(null);

  // Form states for creating assignment
  const [courseCode, setCourseCode] = useState('CSE 311');
  const [courseTitle, setCourseTitle] = useState('Database Management Systems');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('20');
  const [uploadedPdfFile, setUploadedPdfFile] = useState<File | null>(null);
  const [uploadedPdfBase64, setUploadedPdfBase64] = useState<string | null>(null);
  const [uploadedPdfName, setUploadedPdfName] = useState('');

  // Grading states
  const [gradeScore, setGradeScore] = useState('18');
  const [feedback, setFeedback] = useState('Comprehensive analysis and well-structured diagrams.');

  // Extend deadline states
  const [newDeadline, setNewDeadline] = useState('');
  const [extensionReason, setExtensionReason] = useState('Extended due to university midterm revision week.');

  const handleTeacherPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file (.pdf).');
      return;
    }
    setUploadedPdfFile(file);
    setUploadedPdfName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPdfBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const pdfName =
      uploadedPdfName ||
      uploadedPdfFile?.name ||
      `${courseCode.replace(/\s+/g, '')}_Assignment_Specification.pdf`;

    createAssignment({
      courseCode,
      courseTitle,
      title,
      description,
      dueDate,
      totalPoints: parseInt(totalPoints) || 20,
      attachments: [pdfName],
      attachmentPdfName: pdfName,
      attachmentPdfData: uploadedPdfBase64 ||
        `METROPOLITAN UNIVERSITY — DEPARTMENT OF CSE\n` +
        `Official Course Assignment Specification & Rubric\n` +
        `Course: ${courseCode} (${courseTitle})\n` +
        `Assignment Title: ${title}\n` +
        `Submission Deadline: ${dueDate}\n` +
        `Total Marks: ${totalPoints} Marks\n\n` +
        `PROBLEM DESCRIPTION & REQUIREMENTS:\n` +
        `${description || 'Complete the assignment specification and submit answers before deadline.'}\n\n` +
        `GRADING CRITERIA:\n` +
        `- Technical accuracy and documentation: 60%\n` +
        `- Code / Schema execution: 40%\n\n` +
        `Controller of Examinations\nMetropolitan University, Sylhet.`
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setDueDate('');
    setUploadedPdfFile(null);
    setUploadedPdfBase64(null);
    setUploadedPdfName('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingModal) return;
    gradeAssignment(activeGradingModal.id, parseFloat(gradeScore) || 0, feedback);
    setActiveGradingModal(null);
  };

  const handleExtendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExtendModal || !newDeadline) return;
    extendAssignmentDeadline(activeExtendModal.id, newDeadline, extensionReason);
    setActiveExtendModal(null);
    setNewDeadline('');
  };

  // Preview Teacher Question PDF
  const handleViewQuestionPdf = (asg: AssignmentItem) => {
    const fileName = asg.attachmentPdfName || asg.attachments?.[0] || `${asg.courseCode}_Assignment_Spec.pdf`;
    setPdfModalDoc({
      title: asg.title,
      category: `${asg.courseCode} QUESTION SPEC`,
      fileName,
      content: asg.attachmentPdfData ||
        `METROPOLITAN UNIVERSITY — FACULTY SPECIFICATION\n` +
        `Course: ${asg.courseCode} (${asg.courseTitle})\n` +
        `Assignment: ${asg.title}\n` +
        `Deadline: ${asg.dueDate}\n` +
        `Marks: ${asg.totalPoints}\n\n` +
        `Problem Description:\n${asg.description}`,
      pdfUrl: asg.attachmentPdfData?.startsWith('data:application/pdf') ? asg.attachmentPdfData : undefined
    });
  };

  // Preview Student's Submitted Answer PDF
  const handleViewStudentAnswerPdf = (asg: AssignmentItem) => {
    setPdfModalDoc({
      title: `Student Deliverable: ${asg.title}`,
      category: `${asg.courseCode} STUDENT SUBMISSION`,
      fileName: asg.submittedFileName || 'Student_Answer_Deliverable.pdf',
      content: asg.submittedPdfData ||
        `METROPOLITAN UNIVERSITY — STUDENT SUBMITTED DELIVERABLE\n` +
        `Student Name: ${asg.submittedStudentName || 'Fathin Anzum Sadman'}\n` +
        `Student ID: ${asg.submittedStudentId || '241-115-211'}\n` +
        `Batch: 60th Batch | Section: Section E\n` +
        `Course: ${asg.courseCode} (${asg.courseTitle})\n` +
        `Assignment: ${asg.title}\n` +
        `Submission Date: ${asg.submissionDate || '2026-10-05'}\n` +
        `Deliverable File: ${asg.submittedFileName}\n\n` +
        `Status: Ready for faculty evaluation and marks entry.`,
      pdfUrl: asg.submittedPdfData?.startsWith('data:application/pdf') ? asg.submittedPdfData : undefined
    });
  };

  const pendingSubmissions = assignments.filter(a => a.status === 'PENDING').length;
  const gradedSubmissions = assignments.filter(a => a.status === 'GRADED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-xl sm:text-2xl font-black tracking-tight"
          >
            Faculty Assignment Management & Grading Desk
          </h2>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
            Attach question PDF specifications, review student submitted answer PDFs, and grade coursework
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{ backgroundColor: theme.accentColor }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all w-fit"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Faculty Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          style={{
            backgroundColor: 'var(--ep-bg-card, #0d1627)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-4 rounded-2xl border flex items-center gap-3.5 shadow-md"
        >
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Active Courseworks</p>
            <p style={{ color: 'var(--ep-text-primary, #ffffff)' }} className="text-2xl font-black mt-0.5">
              {assignments.length}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--ep-bg-card, #0d1627)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-4 rounded-2xl border flex items-center gap-3.5 shadow-md"
        >
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Pending Review</p>
            <p style={{ color: 'var(--ep-text-primary, #ffffff)' }} className="text-2xl font-black mt-0.5">
              {pendingSubmissions}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--ep-bg-card, #0d1627)',
            borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
          }}
          className="p-4 rounded-2xl border flex items-center gap-3.5 shadow-md"
        >
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Graded & Feedback</p>
            <p style={{ color: 'var(--ep-text-primary, #ffffff)' }} className="text-2xl font-black mt-0.5">
              {gradedSubmissions}
            </p>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map(asg => {
          const isPassed = new Date(asg.dueDate).getTime() < Date.now();
          const questionPdf = asg.attachmentPdfName || asg.attachments?.[0] || `${asg.courseCode}_Assignment_Spec.pdf`;

          return (
            <div
              key={asg.id}
              style={{
                backgroundColor: 'var(--ep-bg-card, #0d1627)',
                borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="rounded-3xl border p-5 sm:p-6 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
                      className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg border border-cyan-500/30"
                    >
                      {asg.courseCode}
                    </span>
                    <span style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-bold">
                      {asg.courseTitle}
                    </span>
                    {asg.isExtended && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        Extended
                      </span>
                    )}
                    <StatusBadge status={asg.status} size="sm" />
                  </div>

                  <h3
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black text-lg mt-2 leading-snug"
                  >
                    {asg.title}
                  </h3>
                  <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs mt-0.5 font-semibold">
                    Assigned: {asg.assignedDate} • Deadline:{' '}
                    <strong className="font-mono text-rose-500 font-extrabold">{asg.dueDate}</strong>
                    {isPassed && <span className="ml-1.5 text-rose-500 font-bold">(Deadline Passed)</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View Question PDF Button */}
                  <button
                    onClick={() => handleViewQuestionPdf(asg)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100' : 'bg-cyan-950/40 text-cyan-300 border-cyan-700/60 hover:bg-cyan-900/50'
                    }`}
                    title="View faculty question paper PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Question PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveExtendModal(asg);
                      setNewDeadline(asg.dueDate);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Extend Deadline</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveGradingModal(asg);
                      setGradeScore(asg.obtainedScore ? asg.obtainedScore.toString() : '18');
                      setFeedback(asg.facultyFeedback || 'Satisfactory solution.');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{asg.status === 'GRADED' ? 'Edit Marks' : 'Grade Submission'}</span>
                  </button>
                </div>
              </div>

              <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs leading-relaxed">
                {asg.description}
              </p>

              {/* Student Submission Bar */}
              {asg.submittedFileName ? (
                <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                        Student Deliverable: {asg.submittedStudentName || 'Fathin Anzum Sadman'} ({asg.submittedStudentId || '241-115-211'})
                      </p>
                      <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                        {asg.submittedFileName} • Submitted: {asg.submissionDate || '2026-10-05'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewStudentAnswerPdf(asg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                      title="Read and inspect student's answer PDF"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Student's Answer PDF</span>
                    </button>

                    {asg.obtainedScore !== undefined ? (
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                        {asg.obtainedScore} / {asg.totalPoints} pts
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-xs px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30">
                        Awaiting Marks
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}>
                  <span>Attached Specification: <strong className="font-mono">{questionPdf}</strong></span>
                  <span className="text-slate-500">No submissions uploaded yet</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="w-full max-w-lg rounded-3xl border p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="text-lg font-black"
                  >
                    Create Course Assignment
                  </h3>
                  <p className="text-xs text-slate-500">Attach question PDF & configure strict deadline</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`cursor-pointer p-1 rounded-lg ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Course</label>
                  <select
                    value={courseCode}
                    onChange={e => {
                      setCourseCode(e.target.value);
                      setCourseTitle(
                        e.target.value === 'CSE 311'
                          ? 'Database Management Systems'
                          : e.target.value === 'CSE 313'
                          ? 'Compiler Design'
                          : 'Computer Networks'
                      );
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="CSE 311">CSE 311 — DBMS</option>
                    <option value="CSE 313">CSE 313 — Compiler</option>
                    <option value="CSE 315">CSE 315 — Networks</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Total Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={totalPoints}
                    onChange={e => setTotalPoints(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Assignment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Query Optimization & Normalization Decomposition"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Submission Deadline</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              {/* Upload Question PDF Box */}
              <div>
                <label className={`text-xs font-bold block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Attach Question / Specification PDF (.pdf)
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                  uploadedPdfFile
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : isLight
                    ? 'border-slate-300 hover:border-cyan-500 bg-slate-50'
                    : 'border-slate-700 hover:border-cyan-500 bg-slate-900/60'
                }`}>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleTeacherPdfChange}
                    id="teacher-pdf-upload"
                    className="hidden"
                  />
                  <label htmlFor="teacher-pdf-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    {uploadedPdfFile ? (
                      <div>
                        <p className="font-bold text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                          {uploadedPdfFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(uploadedPdfFile.size / 1024).toFixed(1)} KB • Attached for students
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-xs" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                          Click to upload assignment question PDF
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Or leave empty to generate an institutional specification automatically
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Instructions & Rubrics</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detailed instructions, accepted file formats, and submission requirements..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: theme.accentColor }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-lg cursor-pointer hover:brightness-110 active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Deadline Modal */}
      {activeExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4"
          >
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="text-base font-black"
              >
                Extend Submission Deadline
              </h3>
              <button
                onClick={() => setActiveExtendModal(null)}
                className={`cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExtendSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Course & Assignment:</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                  {activeExtendModal.courseCode} — {activeExtendModal.title}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-1">Current Deadline: {activeExtendModal.dueDate}</p>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>New Due Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Reason for Extension</label>
                <textarea
                  value={extensionReason}
                  onChange={e => setExtensionReason(e.target.value)}
                  rows={2}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveExtendModal(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg cursor-pointer"
                >
                  Confirm Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {activeGradingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4"
          >
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3
                style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                className="text-base font-black"
              >
                Grade Student Submission
              </h3>
              <button
                onClick={() => setActiveGradingModal(null)}
                className={`cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Student & Assignment:</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                  {activeGradingModal.submittedStudentName || 'Fathin Anzum Sadman'} — {activeGradingModal.title}
                </p>
                {activeGradingModal.submittedFileName && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-mono text-cyan-400 truncate max-w-[200px]">{activeGradingModal.submittedFileName}</span>
                    <button
                      type="button"
                      onClick={() => handleViewStudentAnswerPdf(activeGradingModal)}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                    >
                      View Answer PDF
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Score (Out of {activeGradingModal.totalPoints})
                </label>
                <input
                  type="number"
                  min="0"
                  max={activeGradingModal.totalPoints}
                  value={gradeScore}
                  onChange={e => setGradeScore(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Faculty Feedback & Remarks</label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={3}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGradingModal(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer"
                >
                  Save Marks & Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
