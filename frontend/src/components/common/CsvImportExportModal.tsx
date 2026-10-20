import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Trash2,
  Table
} from 'lucide-react';

interface ColumnGuide {
  key: string;
  description: string;
  required?: boolean;
  example?: string;
}

interface CsvImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sampleFilename: string;
  sampleCsvContent: string;
  expectedHeaders: string[];
  columnGuide?: ColumnGuide[];
  onImport: (parsedRows: Record<string, string>[]) => { success: boolean; count: number; error?: string };
  exportData?: Record<string, any>[];
  exportFilename?: string;
}

export const CsvImportExportModal: React.FC<CsvImportExportModalProps> = ({
  isOpen,
  onClose,
  title,
  sampleFilename,
  sampleCsvContent,
  expectedHeaders,
  columnGuide,
  onImport,
  exportData,
  exportFilename = 'Export_Data.csv'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'guide'>('upload');
  const [csvText, setCsvText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Robust CSV parser handling quotes and commas
  const parseCsv = (text: string) => {
    setParseError(null);
    setImportSuccessMsg(null);
    const cleanText = text.trim();
    if (!cleanText) {
      setParsedRows([]);
      return;
    }

    const lines = cleanText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setParseError('CSV must include a header line and at least one data row.');
      setParsedRows([]);
      return;
    }

    // Split line respecting double quotes
    const splitLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let insideQuote = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headerParts = splitLine(lines[0]).map(h => h.trim().toLowerCase());
    
    // Check if at least some expected headers match
    const lowerExpected = expectedHeaders.map(h => h.toLowerCase());
    const matchedCount = lowerExpected.filter(exp => headerParts.includes(exp)).length;
    if (matchedCount === 0 && headerParts.length > 0) {
      setParseError(
        `Headers don't seem to match! Expected columns like: ${expectedHeaders.slice(0, 4).join(', ')}...`
      );
    }

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = splitLine(lines[i]);
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;
      const rowObj: Record<string, string> = {};
      headerParts.forEach((header, idx) => {
        rowObj[header] = values[idx] !== undefined ? values[idx] : '';
      });
      rows.push(rowObj);
    }

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setCsvText(content);
      parseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const uri = encodeURI('data:text/csv;charset=utf-8,' + sampleCsvContent);
    const a = document.createElement('a');
    a.href = uri;
    a.download = sampleFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportExistingData = () => {
    if (!exportData || exportData.length === 0) return;
    const headers = Object.keys(exportData[0]);
    const headerRow = headers.map(h => `"${h}"`).join(',');
    const dataRows = exportData.map(item =>
      headers
        .map(h => {
          const val = item[h] !== undefined && item[h] !== null ? String(item[h]) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const fullCsv = [headerRow, ...dataRows].join('\n');
    const uri = encodeURI('data:text/csv;charset=utf-8,' + fullCsv);
    const a = document.createElement('a');
    a.href = uri;
    a.download = exportFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) {
      setParseError('No records found to import. Please upload a valid CSV file.');
      return;
    }
    const result = onImport(parsedRows);
    if (result.success) {
      setImportSuccessMsg(`Successfully imported ${result.count} records!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setParseError(result.error || 'Failed to import records.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0d1525] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#090e1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{title}</h2>
              <p className="text-xs text-slate-400">
                Bulk batch import using comma-separated values (CSV)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSample}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition-colors"
              title="Download sample CSV template"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-800/80 bg-[#0b1120]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>File Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'paste'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Text</span>
            </button>
            {columnGuide && columnGuide.length > 0 && (
              <button
                onClick={() => setActiveTab('guide')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'guide'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Column Schema Guide</span>
              </button>
            )}
          </div>

          {exportData && exportData.length > 0 && (
            <button
              onClick={handleExportExistingData}
              className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 pb-2"
              title="Export current data rows to CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Current ({exportData.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-slate-950/60 hover:bg-slate-900/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  Click to select or drag & drop a .CSV file
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Standard UTF-8 encoded comma separated spreadsheet file (.csv)
                </p>
                {uploadedFileName && (
                  <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Loaded: {uploadedFileName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Paste raw CSV text (including header line):
              </label>
              <textarea
                value={csvText}
                onChange={e => {
                  setCsvText(e.target.value);
                  parseCsv(e.target.value);
                }}
                rows={8}
                placeholder={sampleCsvContent}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}

          {activeTab === 'guide' && columnGuide && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Your CSV header row must match the expected columns below. Column names are case-insensitive.
              </p>
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Column Key</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description & Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {columnGuide.map(col => (
                      <tr key={col.key} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-cyan-400">{col.key}</td>
                        <td className="p-3">
                          {col.required ? (
                            <span className="text-[11px] font-bold text-rose-400">Required</span>
                          ) : (
                            <span className="text-[11px] text-slate-500">Optional</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div>{col.description}</div>
                          {col.example && (
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              e.g. {col.example}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feedback & Errors */}
          {parseError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{parseError}</span>
            </div>
          )}

          {importSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{importSuccessMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-cyan-400" />
                  <span>Preview Data ({parsedRows.length} valid rows found):</span>
                </span>
                <span className="text-slate-400">Showing first {Math.min(5, parsedRows.length)} rows</span>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-x-auto bg-slate-950">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">#</th>
                      {Object.keys(parsedRows[0]).slice(0, 6).map(header => (
                        <th key={header} className="p-2.5 font-mono capitalize">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-2.5 text-slate-500">{idx + 1}</td>
                        {Object.values(row).slice(0, 6).map((val, cIdx) => (
                          <td key={cIdx} className="p-2.5 truncate max-w-[160px]">
                            {val || <span className="text-slate-600 italic">empty</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
            >
              📥 Download Sample CSV ({sampleFilename})
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={handleExecuteImport}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {parsedRows.length > 0 ? `${parsedRows.length} Rows` : 'CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
