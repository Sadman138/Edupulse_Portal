import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Plus,
  Send,
  Users,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const TeacherNoticePublishing: React.FC = () => {
  const { notices, publishNotice, currentUser, setPdfModalDoc, theme } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'General' | 'Exam' | 'Academic' | 'Holiday' | 'Emergency'>('Academic');
  const [priority, setPriority] = useState<'NORMAL' | 'IMPORTANT' | 'URGENT'>('IMPORTANT');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'TEACHERS' | 'DEPARTMENT'>('STUDENTS');
  const [content, setContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('CSE311_MakeUp_Lab_Notice.pdf');
  const [successNotice, setSuccessNotice] = useState(false);

  const isLight = theme?.mode === 'light';

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    publishNotice({
      title,
      category,
      priority,
      authorName: currentUser.name,
      authorRole: currentUser.designation || 'Faculty Member',
      content,
      targetAudience,
      targetDepartment: 'CSE',
      hasAttachment: true,
      attachmentName
    });
    setShowModal(false);
    setTitle('');
    setContent('');
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Faculty Notice Publishing Desk
          </h2>
          <p className="text-xs text-slate-400">
            Broadcast class announcements, makeup schedules, exam reminders, and official notices
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Notice Successfully Broadcast!</span>
            <p className="text-[11px] text-emerald-200">The circular has been dispatched to student dashboards and the central university notice board.</p>
          </div>
        </div>
      )}

      {/* Notices Stream */}
      <div className="space-y-4">
        {notices.map(n => (
          <div
            key={n.id}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className={`p-5 rounded-2xl border space-y-3 transition-all shadow-md ${
              n.priority === 'URGENT'
                ? 'ring-2 ring-rose-500/30'
                : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-2xs'
                    : 'bg-slate-800 text-slate-300 border-slate-700 font-bold'
                }`}>
                  {n.category}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-emerald-500/20 text-emerald-300 border-transparent font-bold'
                }`}>
                  Audience: {n.targetAudience}
                </span>
                {n.priority === 'URGENT' && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    URGENT
                  </span>
                )}
              </div>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: isLight ? '#475569' : '#94a3b8' }}
              >
                Date: {n.date}
              </span>
            </div>

            <h3
              className="font-extrabold text-base"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {n.title}
            </h3>
            <p
              className="text-xs leading-relaxed font-medium"
              style={{ color: isLight ? '#334155' : '#cbd5e1' }}
            >
              {n.content}
            </p>

            <div
              className="pt-3 border-t flex items-center justify-between text-xs font-semibold"
              style={{
                borderColor: isLight ? '#e2e8f0' : '#1e293b',
                color: isLight ? '#64748b' : '#94a3b8'
              }}
            >
              <span>Author: <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{n.authorName}</strong></span>
              <button
                onClick={() =>
                  setPdfModalDoc({
                    title: n.title,
                    category: n.category,
                    content: n.content
                  })
                }
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Circular PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
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
              Publish Institutional Notice
            </h3>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Notice Heading / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule for Lab 3 Makeup Assessment"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="Exam">Examination Schedule</option>
                    <option value="General">General Announcement</option>
                    <option value="Emergency">Emergency Alert</option>
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent Red Circular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value as any)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                >
                  <option value="STUDENTS">Students of CSE 311</option>
                  <option value="DEPARTMENT">All CSE Students</option>
                  <option value="ALL">All University Students & Faculty</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Notice Body Text</label>
                <textarea
                  rows={4}
                  placeholder="Official notice statements and guidelines..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
