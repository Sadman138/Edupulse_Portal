import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, ExternalLink } from 'lucide-react';

export const PDFDocumentModal: React.FC = () => {
  const { pdfModalDoc, setPdfModalDoc, currentUser, theme } = useApp();
  const isLight = theme?.mode === 'light';

  if (!pdfModalDoc) return null;

  const handleDownload = () => {
    if (pdfModalDoc.pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfModalDoc.pdfUrl;
      a.download = pdfModalDoc.fileName || `${pdfModalDoc.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

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
    element.download = pdfModalDoc.fileName || `${pdfModalDoc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border ${
        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0f172a] border-slate-700 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#162032] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base line-clamp-1">{pdfModalDoc.title}</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                  {pdfModalDoc.category || 'PDF SPECIFICATION'}
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                {pdfModalDoc.fileName ? `File: ${pdfModalDoc.fileName}` : 'Metropolitan University Institutional Document Engine'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPdfModalDoc(null)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body simulating PDF sheet */}
        <div className={`p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 ${
          isLight ? 'bg-slate-50' : 'bg-slate-950/60'
        }`}>
          {pdfModalDoc.pdfUrl ? (
            <div className="w-full space-y-3">
              <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-inner bg-slate-900">
                <iframe
                  src={pdfModalDoc.pdfUrl}
                  title={pdfModalDoc.title}
                  className="w-full h-[500px] border-none"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-md font-sans border border-slate-200 space-y-5">
              {/* University Letterhead Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h2 className="text-lg font-black tracking-tight text-indigo-950 uppercase">
                      Metropolitan University
                    </h2>
                  </div>
                  <p className="text-xs text-slate-700 font-bold mt-0.5">Department of Computer Science & Engineering</p>
                  <p className="text-[11px] text-slate-500">Bateshwar Permanent Campus / Al-Hamra Tower, Sylhet, Bangladesh</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 inline-block">
                    {pdfModalDoc.category || 'COURSEWORK SPECIFICATION'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">Doc Ref: MU/CSE/{new Date().getFullYear()}/SPEC-04</p>
                </div>
              </div>

              {/* Document Title & Content */}
              <div className="space-y-3 py-1">
                <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wide">
                  Official Assignment Specification
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
                  {pdfModalDoc.title}
                </h4>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/80 p-4 rounded-xl border border-slate-200 font-mono">
                  {pdfModalDoc.content || 'This assignment has been archived into the central EduPulse Academic Information System. All students must submit their deliverables prior to the designated deadline.'}
                </div>
              </div>

              {/* Institutional Sign-off */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between text-xs text-slate-600 gap-3">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Digitally Endorsed • Academic Council Regulation 2026</span>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-slate-800">Controller of Examinations & Faculty Chair</p>
                  <p className="text-[10px] text-slate-500">Metropolitan University, Sylhet</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`px-5 sm:px-6 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#162032] border-slate-800'
        }`}>
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
              isLight ? 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Printer className="w-4 h-4 text-cyan-500" />
            <span>Print PDF</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPdfModalDoc(null)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 transition-all cursor-pointer hover:brightness-110 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
