import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  Plus,
  BookOpen,
  FileCode,
  Download,
  CheckCircle2,
  Trash2,
  Layers
} from 'lucide-react';

export const TeacherStudyMaterialUpload: React.FC = () => {
  const { studyMaterials, uploadStudyMaterial, currentUser, theme } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [courseCode, setCourseCode] = useState('CSE 311');
  const [courseTitle, setCourseTitle] = useState('Database Management Systems');
  const [topic, setTopic] = useState('');
  const [unit, setUnit] = useState('Unit 4: Transaction Processing & ACID');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'SLIDES' | 'ZIP' | 'DOC' | 'CODE'>('PDF');
  const [fileSize, setFileSize] = useState('3.5 MB');
  const [success, setSuccess] = useState(false);

  const isLight = theme?.mode === 'light';

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !description) return;
    uploadStudyMaterial({
      courseCode,
      courseTitle,
      topic,
      unit,
      description,
      fileType,
      fileSize,
      uploadedBy: currentUser.name
    });
    setShowModal(false);
    setTopic('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
            className="text-xl sm:text-2xl font-black tracking-tight"
          >
            Study Material Repository & Upload Desk
          </h2>
          <p
            style={{ color: isLight ? '#334155' : 'var(--ep-text-secondary, #94a3b8)' }}
            className="text-xs font-semibold"
          >
            Publish lecture slides, reference code, lab manuals, and syllabus guidelines
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Resource</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Resource Added to Student Study Portal!</span>
            <p className="text-[11px] text-emerald-200">Enrolled students can immediately download this file from their student portal.</p>
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyMaterials.map(sm => (
          <div
            key={sm.id}
            style={{
              backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #111827)',
              borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="rounded-2xl border p-5 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-md hover:shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded ${
                  isLight ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {sm.courseCode}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${
                  isLight
                    ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-2xs'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {sm.fileType} • {sm.fileSize}
                </span>
              </div>

              <div>
                <p className={`text-[11px] font-black ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>{sm.unit}</p>
                <h3
                  className="font-black text-base mt-0.5 line-clamp-2"
                  style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                >
                  {sm.topic}
                </h3>
              </div>

              <p
                className="text-xs leading-relaxed line-clamp-3 font-semibold"
                style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}
              >
                {sm.description}
              </p>
            </div>

            <div
              className="pt-3 border-t flex items-center justify-between text-xs font-semibold"
              style={{
                borderColor: isLight ? '#e2e8f0' : '#1e293b',
                color: isLight ? '#334155' : '#94a3b8'
              }}
            >
              <span className="font-bold">{sm.downloadCount} student downloads</span>
              <span className="text-[11px] font-mono font-bold">{sm.uploadDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#111827',
              borderColor: isLight ? '#cbd5e1' : '#334155'
            }}
            className="border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3
              className="font-black text-base"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              Upload Study Resource
            </h3>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Target Course</label>
                <select
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    if (e.target.value === 'CSE 311') setCourseTitle('Database Management Systems');
                    if (e.target.value === 'CSE 312') setCourseTitle('Database Systems Lab');
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                >
                  <option value="CSE 311">CSE 311: Database Management Systems</option>
                  <option value="CSE 312">CSE 312: Database Systems Lab</option>
                  <option value="CSE 419">CSE 419: Distributed Systems</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Lecture Topic / Chapter Title</label>
                <input
                  type="text"
                  placeholder="e.g. Concurrency Control & Two-Phase Locking"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>File Format</label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  >
                    <option value="PDF">PDF Handout</option>
                    <option value="SLIDES">PowerPoint Slides</option>
                    <option value="CODE">Source Code / SQL</option>
                    <option value="ZIP">ZIP Bundle</option>
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={e => setFileSize(e.target.value)}
                    required
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Syllabus Unit / Module</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Short Description / Reading Guide</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Upload & Make Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
