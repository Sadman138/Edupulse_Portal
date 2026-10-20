import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookMarked,
  Plus,
  Pencil,
  Trash2,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { Course } from '../../types';
import { CsvImportExportModal } from '../../components/common/CsvImportExportModal';

export const AdminCoursesCrud: React.FC = () => {
  const { adminCourses, addCourse, bulkAddCourses, updateCourse, deleteCourse, departments } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('3.0');
  const [department, setDepartment] = useState('CSE');
  const [type, setType] = useState<'Theory' | 'Lab'>('Theory');
  const [semester, setSemester] = useState('Spring 2026');

  const openAdd = () => {
    setEditingCourse(null);
    setCode('');
    setTitle('');
    setCredits('3.0');
    setDepartment('CSE');
    setType('Theory');
    setSemester('Spring 2026');
    setModalOpen(true);
  };

  const openEdit = (crs: Course) => {
    setEditingCourse(crs);
    setCode(crs.code);
    setTitle(crs.title);
    setCredits(crs.credits.toString());
    setDepartment(crs.department);
    setType(crs.type as any);
    setSemester(crs.semester);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;
    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code,
        title,
        credits: parseFloat(credits) || 3.0,
        department,
        type,
        semester
      });
    } else {
      addCourse({
        code,
        title,
        credits: parseFloat(credits) || 3.0,
        department,
        type,
        semester,
        section: 'A'
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Academic Courses Catalog (CRUD)
          </h2>
          <p className="text-xs text-slate-400">
            Define course syllabus units, credit weightage, and faculty departments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Bulk Import (CSV)</span>
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Course Code & Title</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Credits</th>
                <th className="px-4 py-3.5">Course Type</th>
                <th className="px-4 py-3.5">Academic Session</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {adminCourses.map(crs => (
                <tr key={crs.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{crs.code}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{crs.title}</p>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-indigo-400">
                    {crs.department}
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-slate-200">
                    {crs.credits} Cr
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {crs.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {crs.semester}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(crs)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCourse(crs.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">
              {editingCourse ? 'Edit Academic Course' : 'Create New Course'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="CSE 311"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Course Title</label>
                  <input
                    type="text"
                    placeholder="Database Management Systems"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Credits</label>
                  <input
                    type="number"
                    step="0.5"
                    value={credits}
                    onChange={e => setCredits(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Dept</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Academic Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
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
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CSV Bulk Import Modal */}
      <CsvImportExportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="Bulk Register Courses via CSV"
        sampleFilename="Courses_Catalog_Template.csv"
        sampleCsvContent={`code,title,credits,department,type,semester
CSE311,Database Management Systems,3.0,CSE,Theory,Spring 2026
CSE312,Database Management Systems Lab,1.5,CSE,Lab,Spring 2026
CSE321,Software Engineering & Design,3.0,CSE,Theory,Spring 2026
CSE401,Artificial Intelligence & Expert Systems,3.0,CSE,Theory,Spring 2026
EEE201,Electrical Circuits & Machines,3.0,EEE,Theory,Spring 2026`}
        expectedHeaders={['code', 'title', 'credits', 'department', 'type', 'semester']}
        columnGuide={[
          { key: 'code', description: 'Course Code (e.g. CSE311)', required: true, example: 'CSE311' },
          { key: 'title', description: 'Official Course Title', required: true, example: 'Database Management Systems' },
          { key: 'credits', description: 'Credit Hours (1.0 - 4.0)', required: true, example: '3.0' },
          { key: 'department', description: 'Offering Academic Department', required: true, example: 'CSE' },
          { key: 'type', description: 'Course Format: Theory or Lab', example: 'Theory' },
          { key: 'semester', description: 'Target Academic Semester', example: 'Spring 2026' }
        ]}
        exportData={adminCourses}
        exportFilename="University_Courses_Catalog.csv"
        onImport={(parsedRows) => {
          const newCourses = parsedRows.map(row => ({
            code: (row['code'] || 'CSE000').toUpperCase(),
            title: row['title'] || 'New Academic Course',
            credits: parseFloat(row['credits']) || 3.0,
            department: (row['department'] || 'CSE').toUpperCase(),
            type: (row['type']?.toLowerCase() === 'lab' ? 'Lab' : 'Theory') as 'Theory' | 'Lab',
            semester: row['semester'] || 'Spring 2026',
            section: 'A'
          }));

          bulkAddCourses(newCourses);
          return { success: true, count: newCourses.length };
        }}
      />
    </div>
  );
};
