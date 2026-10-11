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
  const { notices, publishNotice, currentUser, setPdfModalDoc } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'General' | 'Exam' | 'Academic' | 'Holiday' | 'Emergency'>('Academic');
  const [priority, setPriority] = useState<'NORMAL' | 'IMPORTANT' | 'URGENT'>('IMPORTANT');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'TEACHERS' | 'DEPARTMENT'>('STUDENTS');
  const [content, setContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('CSE311_MakeUp_Lab_Notice.pdf');
  const [successNotice, setSuccessNotice] = useState(false);

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
            className={`p-5 rounded-2xl border bg-[#111827] space-y-3 transition-all ${
              n.priority === 'URGENT' ? 'border-rose-500/30 ring-1 ring-rose-500/20' : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {n.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Audience: {n.targetAudience}
                </span>
                {n.priority === 'URGENT' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                    URGENT
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">Date: {n.date}</span>
            </div>

            <h3 className="font-bold text-white text-base">{n.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Author: <strong className="text-slate-200">{n.authorName}</strong></span>
              <button
                onClick={() =>
                  setPdfModalDoc({
                    title: n.title,
                    category: n.category,
                    content: n.content
                  })
                }
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
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
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Publish Institutional Notice</h3>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Heading / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule for Lab 3 Makeup Assessment"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="Exam">Examination Schedule</option>
                    <option value="General">General Announcement</option>
                    <option value="Emergency">Emergency Alert</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent Red Circular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="STUDENTS">Students of CSE 311</option>
                  <option value="DEPARTMENT">All CSE Students</option>
                  <option value="ALL">All University Students & Faculty</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Body Text</label>
                <textarea
                  rows={4}
                  placeholder="Official notice statements and guidelines..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
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
