import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { downloadAssignmentPDF, generateAssignmentHTML } from '../../utils/pdfGenerator';
import { PDFDocumentModal } from '../../components/common/PDFDocumentModal';
import { Download, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface StudentAssignmentsProps {
  isDarkMode?: boolean;
  themeColor?: string;
}

export const StudentAssignments: React.FC<StudentAssignmentsProps> = ({
  isDarkMode = true,
  themeColor = 'cyan'
}) => {
  const { assignments, submissions, submitAssignment, student } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsgId, setSelectedAsgId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // PDF Preview Modal state
  const [previewPdfModal, setPreviewPdfModal] = useState<{
    isOpen: boolean;
    title: string;
    documentRef: string;
    documentType: 'ASSIGNMENT' | 'NOTICE';
    htmlContent: string;
    filename: string;
  }>({
    isOpen: false,
    title: '',
    documentRef: '',
    documentType: 'ASSIGNMENT',
    htmlContent: '',
    filename: ''
  });

  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);

  const handleOpenModal = (asgId: string, courseCode: string) => {
    setSelectedAsgId(asgId);
    setUploadedFileName(`Fathin_241115211_${courseCode}_Deliverable.pdf`);
    setModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (selectedAsgId) {
      submitAssignment(selectedAsgId, uploadedFileName, '2.4 MB');
    }
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
    }, 1200);
  };

  const handleDownloadPDF = (asg: (typeof assignments)[0]) => {
    setDownloadToast(`Downloading ${asg.attachmentName || asg.title}...`);
    setTimeout(() => setDownloadToast(null), 2500);
    downloadAssignmentPDF({
      id: asg.id,
      courseCode: asg.courseCode,
      courseName: asg.courseName,
      title: asg.title,
      description: asg.description,
      teacherName: asg.teacherName,
      dueDate: asg.dueDate,
      totalMarks: asg.totalMarks,
      attachmentName: asg.attachmentName
    });
  };

  const handlePreviewPDF = (asg: (typeof assignments)[0]) => {
    const html = generateAssignmentHTML({
      id: asg.id,
      courseCode: asg.courseCode,
      courseName: asg.courseName,
      title: asg.title,
      description: asg.description,
      teacherName: asg.teacherName,
      dueDate: asg.dueDate,
      totalMarks: asg.totalMarks,
      attachmentName: asg.attachmentName
    });

    setPreviewPdfModal({
      isOpen: true,
      title: `${asg.courseCode}: ${asg.title}`,
      documentRef: `MU/CSE/ASG/${asg.courseCode.replace(/\s+/g, '')}`,
      documentType: 'ASSIGNMENT',
      htmlContent: html,
      filename: `Assignment_${asg.courseCode.replace(/\s+/g, '_')}_${asg.id}.pdf`
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">task</span>
            <span>Assignment Submission Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Download official question papers and rubrics in PDF format, and upload assignment deliverables.
          </p>
        </div>
        {downloadToast && (
          <div className="p-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold animate-pulse">
            {downloadToast}
          </div>
        )}
      </div>

      {/* Grid of Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((item) => {
          const submission = studentSubmissions.find((s) => s.assignmentId === item.id);
          const isSubmitted = !!submission;
          const status = submission?.status || 'PENDING';

          return (
            <div
              key={item.id}
              className="bg-[#101726] p-5 rounded-2xl border border-[#1d273a] shadow-md space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{item.courseCode}</span>
                  <StatusBadge status={status} />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-rose-400">schedule</span>
                  <span>Deadline: {item.dueDate}</span>
                </p>
                <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#1a2336] text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>Total Marks:</span>
                    <strong className="text-white">{item.totalMarks} Marks</strong>
                  </div>
                  {submission && (
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      Submitted: {submission.fileName}
                      {submission.marksObtained !== undefined && (
                        <span className="text-white ml-1 font-bold">
                          &bull; Score: {submission.marksObtained}/{item.totalMarks}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons: Download Assignment PDF + Preview PDF + Submit */}
              <div className="space-y-2 pt-2 border-t border-[#1a2336]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(item)}
                    className="py-2 px-2.5 rounded-xl bg-[#141d30] hover:bg-[#1a2640] text-sky-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-sky-500/25 transition-all cursor-pointer shadow-sm"
                    title="Directly save/download assignment specification PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreviewPDF(item)}
                    className="py-2 px-2.5 rounded-xl bg-[#151d32] hover:bg-[#1c2948] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/50 transition-all cursor-pointer"
                    title="Preview official assignment brief & print"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preview & Print</span>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenModal(item.id, item.courseCode)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-600/20"
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>{isSubmitted ? 'Re-upload Solution' : 'Submit Deliverable'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Simulation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#101726] p-6 rounded-2xl border border-[#232f48] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Upload Assignment Deliverable
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="border-2 border-dashed border-[#232f48] p-6 rounded-xl text-center space-y-2 bg-[#090f1d]">
              <span className="material-symbols-outlined text-3xl text-cyan-400">cloud_upload</span>
              <p className="text-xs text-slate-300">File Selected: {uploadedFileName}</p>
              <span className="text-[10px] text-slate-500 block font-mono">
                PDF, DOCX, ZIP up to 10MB
              </span>
            </div>
            {submittedSuccess ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs font-bold rounded-xl text-center">
                Deliverable submitted successfully!
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Submit File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* PDF Document Preview & Print Modal */}
      <PDFDocumentModal
        isOpen={previewPdfModal.isOpen}
        onClose={() => setPreviewPdfModal((prev) => ({ ...prev, isOpen: false }))}
        title={previewPdfModal.title}
        documentRef={previewPdfModal.documentRef}
        documentType={previewPdfModal.documentType}
        htmlContent={previewPdfModal.htmlContent}
        filename={previewPdfModal.filename}
      />
    </div>
  );
};
