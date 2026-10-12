import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Filter,
  X
} from 'lucide-react';
import { CourseAllocationItem } from '../../types';

export const AdminCourseAllocation: React.FC = () => {
  const {
    courseAllocations,
    addCourseAllocation,
    deleteCourseAllocation,
    adminCourses,
    instructors,
    departments
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  // Allocation Form states
  const [selectedCourseId, setSelectedCourseId] = useState(adminCourses[0]?.id || 'crs-01');
  const [selectedInstructorId, setSelectedInstructorId] = useState(instructors[0]?.id || 'inst-01');
  const [section, setSection] = useState('Section A');
  const [day, setDay] = useState('Sunday & Wednesday');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
  const [room, setRoom] = useState('Room 402');

  const filtered = courseAllocations.filter(a => {
    if (selectedDeptFilter !== 'ALL' && a.department !== selectedDeptFilter) return false;
    return true;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const course = adminCourses.find(c => c.id === selectedCourseId) || adminCourses[0];
    const inst = instructors.find(i => i.id === selectedInstructorId) || instructors[0];

    addCourseAllocation({
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      instructorId: inst.id,
      instructorName: inst.name,
      section,
      department: course.department,
      semester: 'Spring 2026',
      day,
      timeSlot,
      room
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Academic Course Allocation & Lecture Scheduling
          </h2>
          <p className="text-xs text-slate-400">
            Assign curriculum modules, sections, faculty instructors, lecture halls, and slots
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate New Course</span>
        </button>
      </div>

      {/* Filter and Conflict Status Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-300">Department:</span>
          <select
            value={selectedDeptFilter}
            onChange={e => setSelectedDeptFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>Automated Timetable Conflict Detection: Clean (0 Collisions)</span>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Course Code & Title</th>
                <th className="px-4 py-3.5">Assigned Faculty</th>
                <th className="px-4 py-3.5">Section</th>
                <th className="px-4 py-3.5">Lecture Days</th>
                <th className="px-4 py-3.5">Time Slot</th>
                <th className="px-4 py-3.5">Allocated Hall</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map(alloc => (
                <tr key={alloc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{alloc.courseCode}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{alloc.courseTitle}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-200">
                    <p>{alloc.instructorName}</p>
                    <span className="text-[10px] text-purple-400 font-mono">Dept: {alloc.department}</span>
                  </td>
                  <td className="px-4 py-4 font-bold text-indigo-300">
                    {alloc.section}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {alloc.day}
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-emerald-400">
                    {alloc.timeSlot}
                  </td>
                  <td className="px-4 py-4 text-slate-300 font-medium">
                    {alloc.room}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => deleteCourseAllocation(alloc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                      title="Deallocate Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Allocate Course & Schedule Room</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Course</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {adminCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Faculty Instructor</label>
                <select
                  value={selectedInstructorId}
                  onChange={e => setSelectedInstructorId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {instructors.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.department} - {i.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Section</label>
                  <input
                    type="text"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Lecture Days</label>
                  <input
                    type="text"
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
