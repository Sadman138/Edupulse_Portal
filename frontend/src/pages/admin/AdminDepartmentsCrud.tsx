import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Users,
  Calendar,
  X
} from 'lucide-react';
import { DepartmentItem } from '../../types';

export const AdminDepartmentsCrud: React.FC = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [chairPerson, setChairPerson] = useState('');
  const [facultyCount, setFacultyCount] = useState('20');
  const [studentCount, setStudentCount] = useState('450');
  const [establishedYear, setEstablishedYear] = useState('2003');
  const [email, setEmail] = useState('');

  const openAdd = () => {
    setEditingDept(null);
    setCode('');
    setName('');
    setChairPerson('');
    setFacultyCount('20');
    setStudentCount('450');
    setEstablishedYear('2003');
    setEmail('');
    setModalOpen(true);
  };

  const openEdit = (dept: DepartmentItem) => {
    setEditingDept(dept);
    setCode(dept.code);
    setName(dept.name);
    setChairPerson(dept.chairPerson);
    setFacultyCount(dept.facultyCount.toString());
    setStudentCount(dept.studentCount.toString());
    setEstablishedYear(dept.establishedYear.toString());
    setEmail(dept.email);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    if (editingDept) {
      updateDepartment(editingDept.id, {
        code,
        name,
        chairPerson,
        facultyCount: parseInt(facultyCount) || 20,
        studentCount: parseInt(studentCount) || 450,
        establishedYear: parseInt(establishedYear) || 2003,
        email
      });
    } else {
      addDepartment({
        code,
        name,
        chairPerson,
        facultyCount: parseInt(facultyCount) || 20,
        studentCount: parseInt(studentCount) || 450,
        establishedYear: parseInt(establishedYear) || 2003,
        email
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
            Academic Departments Management (CRUD)
          </h2>
          <p className="text-xs text-slate-400">
            Create, update, or remove university faculties and departmental administration
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* Departments Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Code & Name</th>
                <th className="px-4 py-3.5">Department Head / Chair</th>
                <th className="px-4 py-3.5">Faculty Count</th>
                <th className="px-4 py-3.5">Enrolled Students</th>
                <th className="px-4 py-3.5">Contact Email</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {departments.map(dept => (
                <tr key={dept.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {dept.code}
                    </span>
                    <p className="font-bold text-white text-sm mt-1">{dept.name}</p>
                    <p className="text-[10px] text-slate-500">Est. {dept.establishedYear}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-200">
                    {dept.chairPerson}
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-indigo-400">
                    {dept.facultyCount} Teachers
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-emerald-400">
                    {dept.studentCount} Students
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs">
                    {dept.email}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(dept)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Department"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDepartment(dept.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                        title="Delete Department"
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">
              {editingDept ? 'Edit Academic Department' : 'Add New Academic Department'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="CSE"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Department Name</label>
                  <input
                    type="text"
                    placeholder="Computer Science & Engineering"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Department Chair Person</label>
                <input
                  type="text"
                  placeholder="Prof. Dr. Name"
                  value={chairPerson}
                  onChange={e => setChairPerson(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Faculty Count</label>
                  <input
                    type="number"
                    value={facultyCount}
                    onChange={e => setFacultyCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Students</label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={e => setStudentCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Est. Year</label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={e => setEstablishedYear(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Institutional Email</label>
                <input
                  type="email"
                  placeholder="head.cse@metrouni.edu.bd"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  {editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
