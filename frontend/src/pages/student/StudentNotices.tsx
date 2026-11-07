import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
  Search,
  Download,
  Filter
} from 'lucide-react';

export const StudentNotices: React.FC = () => {
  const { notices, setPdfModalDoc, theme } = useApp();
  const isLight = theme.mode === 'light';
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = notices.filter(n => {
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
            Institutional Notice Board
          </h2>
          <p className="text-xs" style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
            University circulars, examination schedules, and department bulletins
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {['ALL', 'Exam', 'Academic', 'General'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'text-white shadow-md font-bold'
                : isLight
                ? 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
            style={selectedCategory === cat ? { backgroundColor: theme.accentColor } : {}}
          >
            {cat === 'ALL' ? 'All Notices' : `${cat} Notices`}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filtered.map(notice => (
          <div
            key={notice.id}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className={`rounded-2xl border p-5 transition-all space-y-3 shadow-md ${
              notice.priority === 'URGENT'
                ? 'ring-2 ring-rose-500/30'
                : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {notice.category}
                </span>
                {notice.priority === 'URGENT' && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    URGENT CIRCULAR
                  </span>
                )}
                {notice.priority === 'IMPORTANT' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    IMPORTANT
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Published: {notice.date}</span>
              </div>
            </div>

            <h3 className="font-extrabold text-base" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
              {notice.title}
            </h3>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
              {notice.content}
            </p>

            <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <span>
                Issued by: <strong style={{ color: 'var(--ep-text-primary, #ffffff)' }}>{notice.authorName}</strong> ({notice.authorRole})
              </span>

              <button
                onClick={() =>
                  setPdfModalDoc({
                    title: notice.title,
                    category: notice.category,
                    content: `OFFICIAL UNIVERSITY NOTICE\nPublished Date: ${notice.date}\nCategory: ${notice.category}\nIssued By: ${notice.authorName} (${notice.authorRole})\nAudience: ${notice.targetAudience}\n\nNotice Statement:\n${notice.content}\n\nAll concerned students and faculty members are requested to take necessary compliance measures.`
                  })
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>View Full PDF Circular</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
