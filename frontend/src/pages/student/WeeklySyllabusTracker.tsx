import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SyllabusTopicStatus } from '../../types';
import {
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit3,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Building,
  Sparkles,
  BarChart3,
  CalendarCheck
} from 'lucide-react';

export const WeeklySyllabusTracker: React.FC = () => {
  const {
    currentUser,
    syllabusChapters,
    updateTopicStatus,
    addSyllabusChapter,
    addSyllabusTopic,
    studentCourses,
    theme
  } = useApp();

  const isLight = theme.mode === 'light';
  const isTeacher = currentUser.role === 'TEACHER';
  const isAdmin = currentUser.role === 'ADMIN';

  // Enrolled courses for students, or all available for teacher/admin
  const availableCourses = isAdmin
    ? ['CSE 311', 'CSE 313', 'CSE 315']
    : isTeacher
    ? ['CSE 311', 'CSE 313']
    : studentCourses.map(c => c.courseCode);

  const [selectedCourse, setSelectedCourse] = useState<string>(availableCourses[0] || 'CSE 311');

  // Modal / Add Chapter / Topic State
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDescription, setNewChapterDescription] = useState('');
  const [newChapterNumber, setNewChapterNumber] = useState(1);

  const [activeChapterForTopic, setActiveChapterForTopic] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicHours, setNewTopicHours] = useState(2);

  // Teaching note editing state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Filter chapters for current course
  const courseChapters = syllabusChapters.filter(ch => ch.courseCode === selectedCourse);

  // Calculate Progress: (Completed Topics / Total Topics) * 100
  const allTopicsInCourse = courseChapters.flatMap(ch => ch.topics);
  const totalTopics = allTopicsInCourse.length;
  const completedTopics = allTopicsInCourse.filter(t => t.status === 'COMPLETED').length;
  const inProgressTopics = allTopicsInCourse.filter(t => t.status === 'IN_PROGRESS').length;
  const notStartedTopics = allTopicsInCourse.filter(t => t.status === 'NOT_STARTED').length;

  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    addSyllabusChapter({
      courseCode: selectedCourse,
      chapterNumber: newChapterNumber,
      chapterTitle: newChapterTitle.trim(),
      title: newChapterTitle.trim(),
      description: newChapterDescription.trim(),
      topics: []
    });
    setNewChapterTitle('');
    setNewChapterDescription('');
    setIsAddChapterModalOpen(false);
  };

  const handleAddTopicSubmit = (chapterId: string) => {
    if (!newTopicTitle.trim()) return;
    addSyllabusTopic(chapterId, {
      title: newTopicTitle.trim(),
      status: 'NOT_STARTED',
      estimatedHours: newTopicHours
    });
    setNewTopicTitle('');
    setActiveChapterForTopic(null);
  };

  const handleSaveNote = (chapterId: string, topicId: string) => {
    updateTopicStatus(chapterId, topicId, 'IN_PROGRESS', noteInput);
    setEditingTopicId(null);
    setNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
              className="p-1.5 rounded-lg border border-cyan-500/30"
            >
              <Layers className="w-5 h-5" />
            </span>
            <h2
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Course Syllabus Tracker & Progression
            </h2>
          </div>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs sm:text-sm font-semibold mt-0.5">
            Chapter & topic roadmap, completion percentage formula, and faculty teaching notes
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => {
              setNewChapterNumber(courseChapters.length + 1);
              setIsAddChapterModalOpen(true);
            }}
            style={{ backgroundColor: theme.accentColor }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl !text-white font-black text-xs shadow-lg transition-all cursor-pointer hover:brightness-110 active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Syllabus Chapter</span>
          </button>
        )}
      </div>

      {/* Course Selector Tabs */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="rounded-3xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
            className="text-xs font-bold mr-2 uppercase tracking-wider"
          >
            Select Course:
          </span>
          {availableCourses.map(code => (
            <button
              key={code}
              onClick={() => setSelectedCourse(code)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                selectedCourse === code
                  ? '!text-white border-transparent shadow-md'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              style={selectedCourse === code ? { backgroundColor: theme.accentColor } : {}}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Spring 2026 Curriculum Syllabus</span>
        </div>
      </div>

      {/* Admin Cross-Course Overview Banner */}
      {isAdmin && (
        <div
          style={{
            backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)',
            borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.3)'
          }}
          className="rounded-3xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 style={{ color: isLight ? '#166534' : '#ffffff' }} className="font-extrabold text-sm">
                Departmental Syllabus Progress Audit (Admin)
              </h4>
              <p style={{ color: isLight ? '#15803d' : '#cbd5e1' }} className="text-xs font-semibold">
                CSE 311: 75% Completed • CSE 313: 50% Completed • CSE 315: 40% Completed (Lagging behind target by 10%)
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider self-start sm:self-auto shadow-sm">
            Audited Spring 2026
          </span>
        </div>
      )}

      {/* Course Syllabus Progress Summary Card */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #0d1627)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="rounded-3xl border p-6 shadow-xl space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span
              style={{ color: theme.accentColor }}
              className="text-xs font-black uppercase tracking-widest"
            >
              {selectedCourse} SYLLABUS COMPLETION STATUS
            </span>
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-xl sm:text-2xl font-black mt-1"
            >
              Overall Progress: {progressPercentage}%
            </h3>
            <p
              style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
              className="text-xs font-bold mt-0.5"
            >
              Formula: (Completed Topics / Total Topics) × 100 = ({completedTopics} / {totalTopics}) × 100
            </p>
          </div>

          {/* Topics Stats Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              style={{
                backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.1)',
                borderColor: isLight ? '#a7f3d0' : 'rgba(16, 185, 129, 0.3)'
              }}
              className="px-3.5 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span style={{ color: isLight ? '#065f46' : '#34d399' }}>
                {completedTopics} Completed
              </span>
            </div>
            <div
              style={{
                backgroundColor: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.1)',
                borderColor: isLight ? '#bfdbfe' : 'rgba(59, 130, 246, 0.3)'
              }}
              className="px-3.5 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span style={{ color: isLight ? '#1e40af' : '#60a5fa' }}>
                {inProgressTopics} In Progress
              </span>
            </div>
            <div
              style={{
                backgroundColor: isLight ? '#f8fafc' : 'rgba(148, 163, 184, 0.1)',
                borderColor: isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.3)'
              }}
              className="px-3.5 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                {notStartedTopics} Remaining
              </span>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-700 shadow-lg"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: theme.accentColor
            }}
          />
        </div>
      </div>

      {/* Chapters and Topics Accordion List */}
      <div className="space-y-4">
        {courseChapters.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="rounded-3xl border p-10 text-center"
          >
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-sm font-bold">
              No syllabus chapters entered for {selectedCourse} yet.
            </p>
          </div>
        ) : (
          courseChapters.map(chap => {
            const chapTopics = chap.topics || [];
            const chapCompleted = chapTopics.filter(t => t.status === 'COMPLETED').length;
            const chapPct = chapTopics.length > 0 ? Math.round((chapCompleted / chapTopics.length) * 100) : 0;

            return (
              <div
                key={chap.id}
                style={{
                  backgroundColor: 'var(--ep-bg-card, #0d1627)',
                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                }}
                className="rounded-3xl border overflow-hidden shadow-xl"
              >
                {/* Chapter Header */}
                <div
                  style={{
                    backgroundColor: 'var(--ep-bg-card-sub, #111a2f)',
                    borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                  }}
                  className="p-5 sm:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
                        className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg border border-cyan-500/30"
                      >
                        Chapter {chap.chapterNumber}
                      </span>
                      <span
                        style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}
                        className="text-xs font-bold"
                      >
                        {chapCompleted} of {chapTopics.length} topics finished
                      </span>
                    </div>
                    <h4
                      style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                      className="font-black text-base sm:text-lg"
                    >
                      {chap.title || chap.chapterTitle}
                    </h4>
                    {chap.description && (
                      <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
                        {chap.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Chapter mini progress */}
                    <div className="text-right space-y-1">
                      <span
                        style={{ color: theme.accentColor }}
                        className="text-xs font-black font-mono"
                      >
                        {chapPct}%
                      </span>
                      <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${chapPct}%`, backgroundColor: theme.accentColor }}
                        />
                      </div>
                    </div>

                    {isTeacher && (
                      <button
                        onClick={() => setActiveChapterForTopic(chap.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Topic</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Add Topic In-place Form */}
                {isTeacher && activeChapterForTopic === chap.id && (
                  <div
                    style={{
                      backgroundColor: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.9)',
                      borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
                    }}
                    className="p-4 border-b flex flex-wrap items-center gap-3"
                  >
                    <input
                      type="text"
                      value={newTopicTitle}
                      onChange={e => setNewTopicTitle(e.target.value)}
                      placeholder="Topic title (e.g., B+ Tree Indexing & Range Queries)"
                      className={`flex-1 min-w-[240px] px-3.5 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                          : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-400">Hours:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newTopicHours}
                        onChange={e => setNewTopicHours(parseInt(e.target.value, 10) || 2)}
                        className={`w-16 px-2.5 py-2 rounded-xl text-xs font-mono text-center border focus:outline-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => handleAddTopicSubmit(chap.id)}
                      style={{ backgroundColor: theme.accentColor }}
                      className="px-4 py-2 rounded-xl text-xs font-bold !text-white shadow-md cursor-pointer"
                    >
                      Save Topic
                    </button>
                    <button
                      onClick={() => setActiveChapterForTopic(null)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Topic Items Table / List */}
                <div
                  style={{ borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))' }}
                  className="divide-y"
                >
                  {chapTopics.map((topic, tIdx) => {
                    const isCompleted = topic.status === 'COMPLETED';
                    const isInProgress = topic.status === 'IN_PROGRESS';

                    return (
                      <div
                        key={topic.id}
                        className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                          isCompleted
                            ? isLight
                              ? 'bg-emerald-50/50'
                              : 'bg-emerald-950/10'
                            : ''
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              {chap.chapterNumber}.{tIdx + 1}
                            </span>
                            <h5
                              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
                              className={`text-sm font-extrabold ${isCompleted ? 'line-through opacity-85' : ''}`}
                            >
                              {topic.title}
                            </h5>

                            {/* Status Badge */}
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : isInProgress
                                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}
                            >
                              {topic.status.replace(/_/g, ' ')}
                            </span>

                            {topic.estimatedHours && (
                              <span className="text-[11px] font-mono text-slate-400 font-bold">
                                • {topic.estimatedHours} hrs
                              </span>
                            )}
                          </div>

                          {/* Teaching Notes & Completed Date */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            {(topic.completedDate || topic.completionDate) && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Finished: {topic.completedDate || topic.completionDate}</span>
                              </span>
                            )}

                            {topic.teachingNotes && (
                              <div
                                style={{
                                  backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.04)',
                                  borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))',
                                  color: isLight ? '#334155' : '#cbd5e1'
                                }}
                                className="px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5"
                              >
                                <FileText className="w-3 h-3 text-cyan-500" />
                                <span>Notes: {topic.teachingNotes}</span>
                              </div>
                            )}
                          </div>

                          {/* Inline Note Editor for Teacher */}
                          {isTeacher && editingTopicId === topic.id && (
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="text"
                                value={noteInput}
                                onChange={e => setNoteInput(e.target.value)}
                                placeholder="Add teaching notes or milestone remarks..."
                                className={`flex-1 px-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                                }`}
                              />
                              <button
                                onClick={() => handleSaveNote(chap.id, topic.id)}
                                style={{ backgroundColor: theme.accentColor }}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold !text-white cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingTopicId(null)}
                                className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Teacher Action Controls */}
                        {isTeacher && (
                          <div className="flex items-center gap-2 shrink-0">
                            <select
                              value={topic.status}
                              onChange={e =>
                                updateTopicStatus(
                                  chap.id,
                                  topic.id,
                                  e.target.value as SyllabusTopicStatus
                                )
                              }
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                              }`}
                            >
                              <option value="NOT_STARTED">Not Started</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                            </select>

                            <button
                              onClick={() => {
                                setEditingTopicId(topic.id);
                                setNoteInput(topic.teachingNotes || '');
                              }}
                              title="Add/Edit Teaching Notes"
                              className={`p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer transition-colors border ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5 text-cyan-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Chapter Modal for Teachers */}
      {isAddChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #0d1627)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4"
          >
            <h3
              style={{ color: 'var(--ep-text-primary, #ffffff)' }}
              className="text-lg font-black"
            >
              Add New Syllabus Chapter ({selectedCourse})
            </h3>
            <form onSubmit={handleAddChapterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Chapter Number</label>
                <input
                  type="number"
                  min="1"
                  value={newChapterNumber}
                  onChange={e => setNewChapterNumber(parseInt(e.target.value, 10) || 1)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Chapter Title</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={e => setNewChapterTitle(e.target.value)}
                  placeholder="e.g., Relational Algebra & Query Optimization"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Description / Objectives</label>
                <textarea
                  value={newChapterDescription}
                  onChange={e => setNewChapterDescription(e.target.value)}
                  placeholder="Core concepts, syllabus scope, textbook references..."
                  rows={3}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: theme.accentColor }}
                  className="px-5 py-2 rounded-xl text-xs font-black !text-white shadow-lg cursor-pointer hover:brightness-110 active:scale-95"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
