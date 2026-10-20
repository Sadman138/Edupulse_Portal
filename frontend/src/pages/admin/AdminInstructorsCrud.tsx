import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  School,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { InstructorItem } from '../../types';
import { CsvImportExportModal } from '../../components/common/CsvImportExportModal';

export const AdminInstructorsCrud: React.FC = () => {
  const { instructors, addInstructor, bulkAddInstructors, updateInstructor, deleteInstructor, departments } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<InstructorItem | null>(null);

  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState<InstructorItem['designation']>('Assistant Professor');
  const [department, setDepartment] = useState('CSE');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Sabbatical'>('Active');

  const openAdd = () => {
    setEditingInst(null);
    setEmployeeId(`EMP-CSE-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setDesignation('Assistant Professor');
    setDepartment('CSE');
    setEmail('');
    setPhone('+880 1700-000000');
    setStatus('Active');
    setModalOpen(true);
  };

  const openEdit = (inst: InstructorItem) => {
    setEditingInst(inst);
    setEmployeeId(inst.employeeId);
    setName(inst.name);
    setDesignation(inst.designation);
    setDepartment(inst.department);
    setEmail(inst.email);
    setPhone(inst.phone);
    setStatus(inst.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (editingInst) {
      updateInstructor(editingInst.id, {
        employeeId,
        name,
        designation,
        department,
        email,
        phone,
        status
      });
    } else {
      addInstructor({
        employeeId,
        name,
        designation,
        department,
        email,
        phone,
        status,
        coursesAllocatedCount: 2
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
            Faculty Directory & Instructors Management (CRUD)
          </h2>
          <p className="text-xs text-slate-400">
            Register academic teachers, designations, institutional credentials, and departments
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
            <span>Add Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Employee ID & Faculty Name</th>
                <th className="px-4 py-3.5">Designation</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {instructors.map(inst => (
                <tr key={inst.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{inst.name}</p>
                    <span className="font-mono text-[11px] text-purple-400">{inst.employeeId}</span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-200">
                    {inst.designation}
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-indigo-400">
                    {inst.department}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p className="text-slate-300">{inst.email}</p>
                    <p className="text-[10px] text-slate-500">{inst.phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      inst.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(inst)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteInstructor(inst.id)}
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
              {editingInst ? 'Edit Faculty Record' : 'Register New Faculty Member'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name with Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Tariqul Islam"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Designation</label>
                  <select
                    value={designation}
                    onChange={e => setDesignation(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Adjunct Faculty">Adjunct Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Sabbatical">Sabbatical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
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
                  {editingInst ? 'Save Updates' : 'Add Instructor'}
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
        title="Bulk Register Faculty Members via CSV"
        sampleFilename="Instructors_Directory_Template.csv"
        sampleCsvContent={`employeeId,name,designation,department,email,phone,status
FAC-CSE-051,Dr. Anisur Rahman,Professor,CSE,anisur.cse@metrouni.edu.bd,+880 1712-345678,Active
FAC-CSE-052,Ms. Nusrat Jahan,Assistant Professor,CSE,nusrat.cse@metrouni.edu.bd,+880 1813-456789,Active
FAC-EEE-031,Engr. Kamrul Hasan,Lecturer,EEE,kamrul.eee@metrouni.edu.bd,+880 1914-567890,Active
FAC-BBA-021,Dr. Samira Khan,Associate Professor,BBA,samira.bba@metrouni.edu.bd,+880 1615-678901,Active`}
        expectedHeaders={['employeeid', 'name', 'designation', 'department', 'email', 'phone', 'status']}
        columnGuide={[
          { key: 'employeeId', description: 'Faculty Institutional Code (e.g. FAC-CSE-051)', required: true, example: 'FAC-CSE-051' },
          { key: 'name', description: 'Full Official Faculty Name', required: true, example: 'Dr. Anisur Rahman' },
          { key: 'designation', description: 'Academic Rank: Professor, Associate Professor, Assistant Professor, Lecturer', required: true, example: 'Professor' },
          { key: 'department', description: 'Academic Department Code', required: true, example: 'CSE' },
          { key: 'email', description: 'Official Institutional Email', example: 'anisur.cse@metrouni.edu.bd' },
          { key: 'phone', description: 'Faculty Phone Number', example: '+880 1712-345678' },
          { key: 'status', description: 'Faculty Status: Active, On Leave, Sabbatical', example: 'Active' }
        ]}
        exportData={instructors}
        exportFilename="University_Faculty_Directory.csv"
        onImport={(parsedRows) => {
          const newInsts = parsedRows.map(row => {
            const rawDesig = row['designation'] || 'Assistant Professor';
            const validDesig: InstructorItem['designation'] =
              rawDesig.toLowerCase().includes('assoc')
                ? 'Associate Professor'
                : rawDesig.toLowerCase().includes('prof')
                ? 'Professor'
                : rawDesig.toLowerCase().includes('lect')
                ? 'Lecturer'
                : 'Assistant Professor';

            return {
              employeeId: row['employeeid'] || `FAC-${(row['department'] || 'CSE').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
              name: row['name'] || 'Faculty Member',
              designation: validDesig,
              department: (row['department'] || 'CSE').toUpperCase(),
              email: row['email'] || `${(row['name'] || 'fac').toLowerCase().replace(/\s+/g, '.')}@metrouni.edu.bd`,
              phone: row['phone'] || '+880 1700-000000',
              status: (row['status'] as any) || 'Active',
              coursesAllocatedCount: 0
            };
          });

          bulkAddInstructors(newInsts);
          return { success: true, count: newInsts.length };
        }}
      />
    </div>
  );
};
