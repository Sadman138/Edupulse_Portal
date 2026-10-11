import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileCheck2,
  Plus,
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
  Users,
  FileText,
  X
} from 'lucide-react';
import { AssignmentItem } from '../../types';

export const TeacherAssignmentDesk: React.FC = () => {
  const { assignments, createAssignment, gradeAssignment } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGradingModal, setActiveGradingModal] = useState<AssignmentItem | null>(null);

  // Form states
  const [courseCode, setCourseCode] = useState('CSE 311');
  const [courseTitle, setCourseTitle] = useState('Database Management Systems');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('20');

  // Grading states
  const [gradeScore, setGradeScore] = useState('18');
  const [feedback, setFeedback] = useState('Comprehensive analysis and well-structured diagrams.');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    createAssignment({
      courseCode,
      courseTitle,
      title,
      description,
      dueDate,
      totalPoints: parseInt(totalPoints) || 20
    });
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingModal) return;
    gradeAssignment(activeGradingModal.id, parseFloat(gradeScore) || 0, feedback);
    setActiveGradingModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Faculty Assignment Management & Grading Desk
          </h2>
          <p className="text-xs text-slate-400">
            Publish coursework requirements, review student submissions, and issue marks & remarks
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map(asg => (
          <div
            key={asg.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {asg.courseCode}
                </span>
                <StatusBadge status={asg.status} size="sm" />
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base leading-snug">
                  {asg.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigned Date: {asg.assignedDate} • Due: <strong className="text-amber-400">{asg.dueDate}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {asg.description}
              </p>
            </div>

            {/* Submission preview bar */}
            {asg.submittedFileName && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Student Submission File:</p>
                  <p className="text-[11px] font-mono text-indigo-400">{asg.submittedFileName}</p>
                </div>
                {asg.obtainedScore !== undefined ? (
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    {asg.obtainedScore} / {asg.totalPoints} pts
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold text-[11px]">Unreviewed</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-bold text-slate-300">Max Points: {asg.totalPoints}</span>

              <button
                onClick={() => {
                  setActiveGradingModal(asg);
                  setGradeScore(asg.obtainedScore ? asg.obtainedScore.toString() : '18');
                  setFeedback(asg.facultyFeedback || 'Satisfactory solution.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{asg.status === 'GRADED' ? 'Edit Marks & Feedback' : 'Grade Submission'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Create New Course Assignment</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Course</label>
                <select
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    if (e.target.value === 'CSE 311') setCourseTitle('Database Management Systems');
                    if (e.target.value === 'CSE 312') setCourseTitle('Database Systems Lab');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="CSE 311">CSE 311 - Database Management Systems</option>
                  <option value="CSE 312">CSE 312 - Database Systems Lab</option>
                  <option value="CSE 419">CSE 419 - Distributed Systems</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. B+ Tree Indexing Simulation"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Total Marks / Points</label>
                  <input
                    type="number"
                    value={totalPoints}
                    onChange={e => setTotalPoints(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description & Rubric</label>
                <textarea
                  rows={3}
                  placeholder="Detailed instructions for student report..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {activeGradingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Grade Student Deliverable</h3>
            <p className="text-xs text-slate-400">
              {activeGradingModal.title} ({activeGradingModal.courseCode})
            </p>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Marks Awarded (out of {activeGradingModal.totalPoints})
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={activeGradingModal.totalPoints}
                  value={gradeScore}
                  onChange={e => setGradeScore(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Faculty Constructive Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGradingModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Save & Publish Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
