import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const PDFDocumentModal: React.FC = () => {
  const { pdfModalDoc, setPdfModalDoc, currentUser } = useApp();

  if (!pdfModalDoc) return null;

  const handleDownload = () => {
    // Generate a printable/downloadable text slip
    const element = document.createElement('a');
    const file = new Blob([
      `METROPOLITAN UNIVERSITY — OFFICIAL ACADEMIC DOCUMENT\n` +
      `Title: ${pdfModalDoc.title}\n` +
      `Category: ${pdfModalDoc.category || 'Academic Document'}\n` +
      `Date Generated: ${new Date().toLocaleDateString()}\n` +
      `User: ${currentUser.name} (${currentUser.role})\n` +
      `-----------------------------------------\n\n` +
      `${pdfModalDoc.content || 'Document content verified by Metropolitan University Academic Controller.'}\n\n` +
      `Signed electronically by: Metropolitan University Controller of Examinations.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${pdfModalDoc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base line-clamp-1">{pdfModalDoc.title}</h3>
              <p className="text-xs text-slate-400">Official Institutional Document Viewer</p>
            </div>
          </div>
          <button
            onClick={() => setPdfModalDoc(null)}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body simulating PDF sheet */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-inner font-sans border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-indigo-950 uppercase">
                  Metropolitan University
                </h2>
                <p className="text-xs text-slate-600 font-medium">Department of Computer Science & Engineering</p>
                <p className="text-[11px] text-slate-500">Al-Hamra Campus / Bateshwar Permanent Campus, Sylhet, Bangladesh</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {pdfModalDoc.category || 'OFFICIAL'}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Ref: MU/CSE/{new Date().getFullYear()}/DOC-821</p>
              </div>
            </div>

            <div className="space-y-3 py-2">
              <h4 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                {pdfModalDoc.title}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {pdfModalDoc.content || 'This document has been archived into the central EduPulse Academic Information System. All course specifications, grading rubrics, exam eligibility thresholds (75% minimum attendance), and university statutes are endorsed by the Academic Council.'}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Verified Document ID: #MU-EP-2026-X99</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">Controller of Examinations</p>
                <p className="text-[10px]">Metropolitan University, Sylhet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#162032] flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPdfModalDoc(null)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
