import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  GraduationCap,
  X
} from 'lucide-react';
import { StudentRegistryItem } from '../../types';

export const AdminStudentsCrud: React.FC = () => {
  const { studentsRegistry, addStudentToRegistry, updateStudentInRegistry, deleteStudentFromRegistry, departments } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRegistryItem | null>(null);
  const [search, setSearch] = useState('');

  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [batch, setBatch] = useState('59th Batch');
  const [currentSemester, setCurrentSemester] = useState('5th Semester');
  const [cgpa, setCgpa] = useState('3.40');
  const [attendance, setAttendance] = useState('85.0');
  const [riskLevel, setRiskLevel] = useState<'SAFE' | 'WARNING' | 'CRITICAL'>('SAFE');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+880 1700-000000');
  const [status, setStatus] = useState<'Active' | 'Probation' | 'Inactive' | 'Graduated'>('Active');

  const openAdd = () => {
    setEditingStudent(null);
    setStudentId(`241-115-${Math.floor(200 + Math.random() * 800)}`);
    setName('');
    setDepartment('CSE');
    setBatch('59th Batch');
    setCurrentSemester('5th Semester');
    setCgpa('3.40');
    setAttendance('85.0');
    setRiskLevel('SAFE');
    setEmail('');
    setPhone('+880 1700-000000');
    setStatus('Active');
    setModalOpen(true);
  };

  const openEdit = (s: StudentRegistryItem) => {
    setEditingStudent(s);
    setStudentId(s.studentId);
    setName(s.name);
    setDepartment(s.department);
    setBatch(s.batch);
    setCurrentSemester(s.currentSemester);
    setCgpa(s.cgpa.toString());
    setAttendance(s.attendance.toString());
    setRiskLevel(s.riskLevel);
    setEmail(s.email);
    setPhone(s.phone);
    setStatus(s.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !name) return;
    if (editingStudent) {
      updateStudentInRegistry(editingStudent.id, {
        studentId,
        name,
        department,
        batch,
        currentSemester,
        cgpa: parseFloat(cgpa) || 3.0,
        attendance: parseFloat(attendance) || 80.0,
        riskLevel,
        email: email || `${studentId.replace(/-/g, '')}@metrouni.edu.bd`,
        phone,
        status
      });
    } else {
      addStudentToRegistry({
        studentId,
        name,
        department,
        batch,
        currentSemester,
        cgpa: parseFloat(cgpa) || 3.0,
        attendance: parseFloat(attendance) || 80.0,
        riskLevel,
        email: email || `${studentId.replace(/-/g, '')}@metrouni.edu.bd`,
        phone,
        status
      });
    }
    setModalOpen(false);
  };

  const filtered = studentsRegistry.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            University Students Registry (CRUD)
          </h2>
          <p className="text-xs text-slate-400">
            Admit students, update CGPA records, monitor probation and risk standing
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Showing {filtered.length} of {studentsRegistry.length} Students
        </span>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Student ID & Name</th>
                <th className="px-4 py-3.5">Dept & Batch</th>
                <th className="px-4 py-3.5">Current CGPA</th>
                <th className="px-4 py-3.5">Attendance</th>
                <th className="px-4 py-3.5">Risk Status</th>
                <th className="px-4 py-3.5">Standing</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{s.name}</p>
                    <span className="font-mono text-[11px] text-purple-400">{s.studentId}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-200">{s.department}</p>
                    <p className="text-[11px] text-slate-500">{s.batch} • {s.currentSemester}</p>
                  </td>
                  <td className="px-4 py-4 font-mono font-black text-sm text-emerald-400">
                    {s.cgpa.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-mono font-bold ${s.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={s.riskLevel} />
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteStudentFromRegistry(s.id)}
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
              {editingStudent ? 'Edit Student Record' : 'Admit / Register New Student'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Student ID / Roll</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
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
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fathin Sadman"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Batch</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Semester</label>
                  <input
                    type="text"
                    value={currentSemester}
                    onChange={e => setCurrentSemester(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={cgpa}
                    onChange={e => setCgpa(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={attendance}
                    onChange={e => setAttendance(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Risk Standing</label>
                  <select
                    value={riskLevel}
                    onChange={e => setRiskLevel(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="SAFE">SAFE</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
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
                  {editingStudent ? 'Save Record' : 'Admit Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
