import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadNoticePDF, generateNoticeHTML } from '../../utils/pdfGenerator';
import { PDFDocumentModal } from '../../components/common/PDFDocumentModal';
import { Download, Eye } from 'lucide-react';

interface StudentNoticesProps {
  isDarkMode?: boolean;
}

export const StudentNotices: React.FC<StudentNoticesProps> = ({ isDarkMode = true }) => {
  const { notices } = useApp();
  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl'
    : 'bg-white border-slate-200 shadow-sm text-slate-800';

  const [filterType, setFilterType] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    documentType: 'NOTICE',
    htmlContent: '',
    filename: ''
  });

  const filteredNotices = notices.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  const handleDownloadNotice = (n: (typeof notices)[0]) => {
    downloadNoticePDF({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetCourseCode: n.targetCourseCode,
      createdByName: n.createdByName,
      createdByRole: n.createdByRole,
      createdAt: n.createdAt
    });
  };

  const handlePreviewNotice = (n: (typeof notices)[0]) => {
    const html = generateNoticeHTML({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetCourseCode: n.targetCourseCode,
      createdByName: n.createdByName,
      createdByRole: n.createdByRole,
      createdAt: n.createdAt
    });

    setPreviewPdfModal({
      isOpen: true,
      title: n.title,
      documentRef: `MU/CSE/NOT/${n.id.toUpperCase()}`,
      documentType: 'NOTICE',
      htmlContent: html,
      filename: `Notice_${n.id}_${n.title.slice(0, 15).replace(/\s+/g, '_')}.pdf`
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">campaign</span>
            <span>Departmental & Institutional Notice Board</span>
          </h2>
          <p className="text-xs opacity-70">
            Official circulars, examination schedules, and university recess notifications. Click to download official PDF notices.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'GENERAL', 'UNIVERSITY_HOLIDAY', 'COURSE_SPECIFIC'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#101726] text-slate-400 hover:text-slate-200 border border-[#1d273a]'
              }`}
            >
              {type === 'ALL'
                ? 'All Notices'
                : type === 'UNIVERSITY_HOLIDAY'
                ? 'Holidays'
                : type === 'COURSE_SPECIFIC'
                ? 'Course Specific'
                : 'General'}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-3">
        {filteredNotices.map((n) => {
          const isHoliday = n.type === 'UNIVERSITY_HOLIDAY';
          const isCourse = n.type === 'COURSE_SPECIFIC';
          const isExpanded = expandedId === n.id;

          return (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all ${cardStyle} ${
                isHoliday ? 'border-amber-500/30' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono ${
                        isHoliday
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : isCourse
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {n.type.replace('_', ' ')}
                    </span>
                    {n.targetCourseCode && (
                      <span className="text-xs font-mono font-bold text-cyan-400">{n.targetCourseCode}</span>
                    )}
                    <span className="text-xs text-slate-400">&bull; {n.createdAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{n.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleDownloadNotice(n)}
                    className="px-3 py-1.5 rounded-xl bg-[#141d30] hover:bg-[#1a2640] text-sky-300 border border-sky-500/25 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Download Official Notice PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreviewNotice(n)}
                    className="px-3 py-1.5 rounded-xl bg-[#151e33] hover:bg-[#1c2948] text-slate-300 border border-slate-700/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Preview and Print Official University Notice"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preview & Print</span>
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : n.id)}
                    className="text-xs text-cyan-400 font-bold hover:underline cursor-pointer px-2 py-1"
                  >
                    {isExpanded ? 'Collapse' : 'Read Notice &rarr;'}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div
                className={`mt-3 pt-3 border-t border-[#1a2336] text-xs text-slate-300 leading-relaxed ${
                  isExpanded ? 'block' : 'line-clamp-2'
                }`}
              >
                {n.content}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Published by: {n.createdByName} ({n.createdByRole})</span>
                <span className="text-slate-400">Metropolitan University</span>
              </div>
            </div>
          );
        })}
      </div>
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

