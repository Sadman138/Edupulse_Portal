import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadMaterialPDF } from '../../utils/pdfGenerator';
import { Download } from 'lucide-react';

interface StudentStudyMaterialsProps {
  isDarkMode?: boolean;
}

export const StudentStudyMaterials: React.FC<StudentStudyMaterialsProps> = ({
  isDarkMode = true
}) => {
  const { studyMaterials } = useApp();
  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl'
    : 'bg-white border-slate-200 shadow-sm text-slate-800';

  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [search, setSearch] = useState('');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const filtered = studyMaterials.filter((m) => {
    const matchCourse = selectedCourse === 'ALL' || m.courseCode === selectedCourse;
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchCourse && matchSearch;
  });

  const handleDownload = (mat: (typeof studyMaterials)[0]) => {
    setDownloadToast(`Downloading ${mat.fileName}...`);
    setTimeout(() => {
      setDownloadToast(null);
      downloadMaterialPDF({
        title: mat.title,
        courseCode: mat.courseCode,
        courseName: mat.courseName,
        teacherName: mat.teacherName,
        category: mat.category,
        weekNumber: mat.weekNumber,
        fileName: mat.fileName,
        fileSize: mat.fileSize
      });
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">folder_open</span>
            <span>Course Study Materials & Resources</span>
          </h2>
          <p className="text-xs opacity-70">
            Lecture presentations, handouts, lab manuals, and faculty code repositories. Download study PDFs directly.
          </p>
        </div>
        {downloadToast && (
          <div className="p-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold animate-pulse">
            {downloadToast}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#101726] border border-[#1d273a] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search lectures, topics, manuals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141b2c] border border-[#222d44] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['ALL', 'CSE 301', 'CSE 303', 'CSE 305', 'CSE 307'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCourse(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCourse === c
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141b2c]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border space-y-3.5 flex flex-col justify-between ${cardStyle}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                  {m.courseCode}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-slate-300">
                  Week {m.weekNumber}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">{m.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Published by {m.teacherName} &bull; {m.uploadedAt}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] opacity-70 pt-2.5 border-t border-[#1a2336]">
              <span className="font-mono text-slate-400">Size: {m.fileSize}</span>
              <button
                onClick={() => handleDownload(m)}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors px-3 py-1.5 rounded-xl bg-[#141d30] border border-cyan-500/25"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

