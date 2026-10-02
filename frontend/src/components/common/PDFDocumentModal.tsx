import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { printFormattedDocument, downloadHTMLDocument } from '../../utils/pdfGenerator';

interface PDFDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentRef?: string;
  documentType: 'ASSIGNMENT' | 'NOTICE' | 'TRANSCRIPT' | 'ATTENDANCE';
  htmlContent: string;
  filename: string;
}

export const PDFDocumentModal: React.FC<PDFDocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  documentRef = 'MU/CSE/OFFICIAL',
  documentType,
  htmlContent,
  filename
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    printFormattedDocument(htmlContent, filename);
  };

  const handleDownload = () => {
    downloadHTMLDocument(htmlContent, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-[#1e293b] bg-[#131d33] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-800 text-cyan-300 border border-cyan-500/20">
                  {documentType}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Ref: {documentRef} &bull; Metropolitan University Official PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/25 flex items-center gap-1.5 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#28354d] text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#334155]"
              title="Download standalone HTML document file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#090e1a]">
          <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-slate-300 print:border-none print:shadow-none min-h-[600px]">
            <div
              className="prose prose-slate max-w-none text-slate-900"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>

        {/* Bottom Status Info */}
        <div className="p-3 bg-[#131d33] border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Academic Document &bull; Digitally Signed</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">EduPulse Academic Gateway &bull; Akhaliya, Sylhet</span>
        </div>
      </div>
    </div>
  );
};
