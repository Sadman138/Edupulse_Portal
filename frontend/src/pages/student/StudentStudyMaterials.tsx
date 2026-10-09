import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Download,
  FileCode,
  FileText,
  Search,
  Filter,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const StudentStudyMaterials: React.FC = () => {
  const { studyMaterials, studentCourses, setPdfModalDoc } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filtered = studyMaterials.filter(sm => {
    if (selectedCourse !== 'ALL' && sm.courseCode !== selectedCourse) return false;
    if (searchQuery && !sm.topic.toLowerCase().includes(searchQuery.toLowerCase()) && !sm.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDownload = (sm: typeof studyMaterials[0]) => {
    setDownloadSuccess(sm.id);
    setTimeout(() => setDownloadSuccess(null), 3000);

    const element = document.createElement('a');
    const file = new Blob([
      `METROPOLITAN UNIVERSITY CSE STUDY MATERIAL\n` +
      `Course: ${sm.courseCode} - ${sm.courseTitle}\n` +
      `Topic: ${sm.topic} (${sm.unit})\n` +
      `Uploaded By: ${sm.uploadedBy} on ${sm.uploadDate}\n\n` +
      `Description & Notes:\n${sm.description}\n\n` +
      `-- End of lecture package preview --`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${sm.courseCode.replace(/\s+/g, '_')}_${sm.topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Study Materials & Lecture Slides
          </h2>
          <p className="text-xs text-slate-400">
            Official handouts, lab manuals, slides, and reference materials from faculty
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search slides, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Course Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedCourse('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCourse === 'ALL'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Courses
        </button>
        {studentCourses.map(c => (
          <button
            key={c.courseId}
            onClick={() => setSelectedCourse(c.courseCode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCourse === c.courseCode
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.courseCode}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(material => (
          <div
            key={material.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {material.courseCode}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {material.fileType} • {material.fileSize}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-indigo-400">{material.unit}</p>
                <h3 className="font-bold text-white text-base mt-0.5 line-clamp-2">
                  {material.topic}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {material.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="space-y-0.5">
                <p className="text-[11px] text-slate-400">By {material.uploadedBy}</p>
                <p className="text-[10px] text-slate-500">{material.downloadCount} downloads</p>
              </div>

              <button
                onClick={() => handleDownload(material)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
              >
                {downloadSuccess === material.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
