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
  AlertCircle,
  Award,
  Calendar,
  Lock,
  History,
  FileUp,
  Sparkles
} from 'lucide-react';
import { AssignmentItem } from '../../types';

export const StudentAssignments: React.FC = () => {
  const { assignments, submitAssignment, setPdfModalDoc, theme } = useApp();
  const isLight = theme.mode === 'light';

  const [activeUploadModal, setActiveUploadModal] = useState<AssignmentItem | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // View Teacher's Question / Specification PDF
  const handleViewTeacherPdf = (asg: AssignmentItem) => {
    const fileName = asg.attachmentPdfName || asg.attachments?.[0] || `${asg.courseCode.replace(/\s+/g, '')}_Assignment_Spec.pdf`;
    setPdfModalDoc({
      title: asg.title,
      category: `${asg.courseCode} QUESTION SPEC`,
      fileName,
      content: asg.attachmentPdfData || 
        `METROPOLITAN UNIVERSITY — DEPARTMENT OF CSE\n` +
        `Official Course Assignment Specification & Rubric\n` +
        `Course: ${asg.courseCode} (${asg.courseTitle})\n` +
        `Assignment Title: ${asg.title}\n` +
        `Submission Deadline: ${asg.dueDate}\n` +
        `Total Marks: ${asg.totalPoints} Marks\n\n` +
        `PROBLEM DESCRIPTION & OBJECTIVES:\n` +
        `${asg.description || 'Complete the assignment solution and upload your PDF answer file.'}\n\n` +
        `SUBMISSION REQUIREMENTS:\n` +
        `- Answer file must be in PDF format.\n` +
        `- Strict deadline: submissions close automatically once time expires.\n` +
        `- Late submissions are blocked by the institutional policy.\n\n` +
        `Controller of Continuous Assessment\nMetropolitan University, Sylhet.`,
      pdfUrl: asg.attachmentPdfData?.startsWith('data:application/pdf') ? asg.attachmentPdfData : undefined
    });
  };

  // View Student's Submitted Answer PDF
  const handleViewSubmittedAnswerPdf = (asg: AssignmentItem) => {
    setPdfModalDoc({
      title: `My Answer Deliverable: ${asg.title}`,
      category: `${asg.courseCode} ANSWER PDF`,
      fileName: asg.submittedFileName || 'Student_Answer_Deliverable.pdf',
      content: asg.submittedPdfData ||
        `METROPOLITAN UNIVERSITY — STUDENT SUBMITTED DELIVERABLE\n` +
        `Student Name: ${asg.submittedStudentName || 'Fathin Anzum Sadman'}\n` +
        `Student ID: ${asg.submittedStudentId || '241-115-211'}\n` +
        `Batch: 60th Batch | Section: Section E\n` +
        `Course: ${asg.courseCode} (${asg.courseTitle})\n` +
        `Assignment: ${asg.title}\n` +
        `Submitted File: ${asg.submittedFileName}\n` +
        `Submission Timestamp: ${asg.submissionDate || new Date().toISOString().split('T')[0]}\n\n` +
        `DELIVERABLE VERIFICATION:\n` +
        `This file was cryptographically timestamped and submitted prior to the course deadline.\n` +
        `All requirements, proofs, and source codes are included in this document submission.`,
      pdfUrl: asg.submittedPdfData?.startsWith('data:application/pdf') ? asg.submittedPdfData : undefined
    });
  };

  const handleDownloadTeacherPdf = (asg: AssignmentItem) => {
    if (asg.attachmentPdfData?.startsWith('data:application/pdf')) {
      const a = document.createElement('a');
      a.href = asg.attachmentPdfData;
      a.download = asg.attachmentPdfName || `${asg.courseCode.replace(/\s+/g, '_')}_Assignment_Spec.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const textContent =
      `METROPOLITAN UNIVERSITY — DEPARTMENT OF CSE\n` +
      `Official Course Assignment Specification & Rubric\n` +
      `Course: ${asg.courseCode}\n` +
      `Assignment: ${asg.title}\n` +
      `Submission Deadline: ${asg.dueDate}\n` +
      `Total Marks: ${asg.totalPoints} Marks\n\n` +
      `Problem Statement:\n${asg.description}\n\n` +
      `Controller of Continuous Assessments\nMetropolitan University, Sylhet.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = asg.attachmentPdfName || `${asg.courseCode.replace(/\s+/g, '_')}_Assignment_Spec.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF document (.pdf).');
      return;
    }
    setSelectedPdfFile(file);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPdfBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadModal) return;

    // Strict client-side deadline check
    const dueTime = new Date(`${activeUploadModal.dueDate}T23:59:59`).getTime();
    if (Date.now() > dueTime) {
      alert('Submission Closed. You cannot submit after the configured deadline.');
      setActiveUploadModal(null);
      return;
    }

    const finalName =
      uploadedFileName ||
      selectedPdfFile?.name ||
      `Fathin_Sadman_241115211_${activeUploadModal.courseCode.replace(/\s+/g, '')}_Answer.pdf`;

    submitAssignment(activeUploadModal.id, finalName, pdfBase64 || undefined);
    setActiveUploadModal(null);
    setSelectedPdfFile(null);
    setPdfBase64(null);
    setUploadedFileName('');
    setStudentNotes('');
    setSuccessToast(`Successfully submitted answer PDF: ${finalName}!`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

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
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h2
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-xl sm:text-2xl font-black tracking-tight"
            >
              Assignment Submission Hub
            </h2>
          </div>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
            View instructor question PDF specifications and upload your completed answer PDF before deadline
          </p>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map(asg => {
          const dueTime = new Date(`${asg.dueDate}T23:59:59`).getTime();
          const isClosed = Date.now() > dueTime;
          const isGraded = asg.status === 'GRADED';
          const isSubmitted = asg.status === 'SUBMITTED';

          // Countdown calculation
          const diffMs = dueTime - Date.now();
          const daysLeft = Math.ceil(diffMs / (1000 * 3600 * 24));
          const hoursLeft = Math.ceil(diffMs / (1000 * 3600));

          let countdownLabel = '';
          if (isClosed) {
            countdownLabel = 'Submission Closed';
          } else if (daysLeft > 1) {
            countdownLabel = `${daysLeft} days remaining`;
          } else if (hoursLeft > 0) {
            countdownLabel = `${hoursLeft} hours remaining (Approaching)`;
          } else {
            countdownLabel = 'Deadline Approaching';
          }

          const teacherPdf = asg.attachmentPdfName || asg.attachments?.[0] || `${asg.courseCode}_Question_Specification.pdf`;

          return (
            <div
              key={asg.id}
              style={{
                backgroundColor: 'var(--ep-bg-card, #0d1627)',
                borderColor: isClosed ? 'rgba(239, 68, 68, 0.4)' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
              }}
              className="rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-500 transition-all"
            >
              <div className="space-y-3.5">
                {/* Course Code & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
                    className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg border border-cyan-500/30"
                  >
                    {asg.courseCode}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      isGraded
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : isSubmitted
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : isClosed
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : hoursLeft <= 48
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse'
                        : 'bg-slate-700/40 text-slate-700 dark:text-slate-300 border-slate-600/50'
                    }`}
                  >
                    {isGraded
                      ? 'Evaluated'
                      : isSubmitted
                      ? 'Submitted'
                      : isClosed
                      ? 'Submission Closed'
                      : hoursLeft <= 48
                      ? 'Deadline Approaching'
                      : 'Pending'}
                  </span>
                </div>

                {/* Assignment Title & Description */}
                <div>
                  <h3
                    style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                    className="font-black text-base sm:text-lg leading-snug"
                  >
                    {asg.title}
                  </h3>
                  <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold mt-1 leading-relaxed">
                    {asg.description}
                  </p>
                </div>

                {/* Teacher's Uploaded PDF Section */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  isLight ? 'bg-cyan-50/80 border-cyan-200 text-cyan-950' : 'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                        Teacher's Assignment PDF Spec:
                      </p>
                      <p className="font-mono font-bold text-xs truncate">
                        {teacherPdf}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleViewTeacherPdf(asg)}
                      className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Open and view the teacher's assignment PDF"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                    <button
                      onClick={() => handleDownloadTeacherPdf(asg)}
                      className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                        isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                      title="Download teacher's PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deadline and Countdown */}
                <div className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
                  isLight ? 'bg-slate-100/90 border-slate-200 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Deadline:</span>
                    </span>
                    <span className="font-mono font-bold text-rose-500 dark:text-rose-400">{asg.dueDate} 23:59</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Countdown:</span>
                    <span
                      className={`font-mono font-black ${
                        isClosed ? 'text-rose-500 dark:text-rose-400' : hoursLeft <= 48 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {countdownLabel}
                    </span>
                  </div>

                  {asg.isExtended && (
                    <div className={`pt-1 border-t flex items-center gap-1 text-[11px] font-semibold text-amber-500 dark:text-amber-400 ${
                      isLight ? 'border-slate-200' : 'border-slate-800'
                    }`}>
                      <History className="w-3 h-3 shrink-0" />
                      <span>Extended by Instructor: {asg.extensionReason || 'Reopened'}</span>
                    </div>
                  )}
                </div>

                {/* Grade & Faculty Feedback (if evaluated) */}
                {isGraded && (
                  <div className={`p-3.5 rounded-2xl border space-y-1 text-xs ${
                    isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold flex items-center gap-1 ${
                        isLight ? 'text-emerald-800' : 'text-emerald-400'
                      }`}>
                        <Award className="w-3.5 h-3.5" />
                        <span>Score Awarded:</span>
                      </span>
                      <span className={`font-mono font-black text-sm ${
                        isLight ? 'text-emerald-800' : 'text-emerald-400'
                      }`}>
                        {asg.obtainedScore} / {asg.totalPoints} Marks
                      </span>
                    </div>
                    {asg.facultyFeedback && (
                      <p className={`text-[11px] mt-1 ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Feedback: "{asg.facultyFeedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Student's Uploaded Answer Deliverable */}
                {asg.submittedFileName && (
                  <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/25 border-emerald-800/50 text-emerald-200'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          My Answer PDF Deliverable:
                        </p>
                        <p className="font-mono font-bold text-xs truncate">
                          {asg.submittedFileName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewSubmittedAnswerPdf(asg)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Answer</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Submit / Re-upload Answer PDF */}
              <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <span className="font-mono text-xs font-bold" style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
                  Total: {asg.totalPoints} Marks
                </span>

                {isClosed ? (
                  <button
                    disabled
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 font-bold text-xs cursor-not-allowed opacity-80"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Submission Closed</span>
                  </button>
                ) : isSubmitted ? (
                  <button
                    onClick={() => {
                      setActiveUploadModal(asg);
                      setSelectedPdfFile(null);
                      setUploadedFileName('');
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer border transition-colors ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                    }`}
                  >
                    <FileUp className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Re-upload Answer PDF</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveUploadModal(asg);
                      setSelectedPdfFile(null);
                      setUploadedFileName('');
                    }}
                    style={{ backgroundColor: theme.accentColor }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl !text-white font-black text-xs shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-white" />
                    <span>Upload Answer PDF</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Answer PDF Upload Modal */}
      {activeUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="w-full max-w-lg rounded-3xl border p-6 sm:p-7 shadow-2xl space-y-4"
          >
            {/* Modal Header */}
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
                    className="text-base font-black"
                  >
                    Upload Assignment Answer PDF
                  </h3>
                  <p className="text-xs text-slate-500">Student Deliverable Submission Desk</p>
                </div>
              </div>
              <button
                onClick={() => setActiveUploadModal(null)}
                className={`cursor-pointer p-1 rounded-lg ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4">
              {/* Course & Assignment Summary */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  Target Coursework:
                </p>
                <p className="text-sm font-black" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                  {activeUploadModal.courseCode} — {activeUploadModal.title}
                </p>
                <div className="flex items-center justify-between text-xs pt-1 font-mono">
                  <span className="text-slate-500">Total Marks: {activeUploadModal.totalPoints}</span>
                  <span className="text-rose-500 font-bold">Strict Due: {activeUploadModal.dueDate} 23:59</span>
                </div>
              </div>

              {/* Student Identity Confirmation */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <span>Student Submitter:</span>
                <span className="font-bold font-mono">Fathin Anzum Sadman (241-115-211)</span>
              </div>

              {/* Drag & Drop PDF File Picker */}
              <div>
                <label className={`text-xs font-bold block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Select Answer PDF Document (.pdf) <span className="text-rose-500">*</span>
                </label>

                <div className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  selectedPdfFile
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isLight
                    ? 'border-slate-300 hover:border-cyan-500 bg-slate-50'
                    : 'border-slate-700 hover:border-cyan-500 bg-slate-900/60'
                }`}>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    id="answer-pdf-file-input"
                    className="hidden"
                  />
                  <label htmlFor="answer-pdf-file-input" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6" />
                    </div>
                    {selectedPdfFile ? (
                      <div>
                        <p className="font-black text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                          {selectedPdfFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Size: {(selectedPdfFile.size / 1024).toFixed(1)} KB • Ready for submission
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-xs" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                          Click here to select your Answer PDF file
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Standard PDF format (.pdf) • Maximum 25 MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Optional Custom File Name / Deliverable Description */}
              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Custom Submission File Title (Optional)
                </label>
                <input
                  type="text"
                  value={uploadedFileName}
                  onChange={e => setUploadedFileName(e.target.value)}
                  placeholder={`Fathin_241115211_${activeUploadModal.courseCode.replace(/\s+/g, '')}_Answer.pdf`}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveUploadModal(null)}
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
                  <span>Submit Answer PDF</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
