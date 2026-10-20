import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { SemesterItem } from '../../types';
import { CsvImportExportModal } from '../../components/common/CsvImportExportModal';

export const AdminSemestersCrud: React.FC = () => {
  const { semesters, addSemester, bulkAddSemesters, updateSemester, deleteSemester, setActiveSemester } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingSem, setEditingSem] = useState<SemesterItem | null>(null);

  const [name, setName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxCredits, setMaxCredits] = useState('21.0');
  const [enrollmentDeadline, setEnrollmentDeadline] = useState('');

  const openAdd = () => {
    setEditingSem(null);
    setName('');
    setSessionCode('');
    setStartDate('');
    setEndDate('');
    setMaxCredits('21.0');
    setEnrollmentDeadline('');
    setModalOpen(true);
  };

  const openEdit = (sem: SemesterItem) => {
    setEditingSem(sem);
    setName(sem.name);
    setSessionCode(sem.sessionCode);
    setStartDate(sem.startDate);
    setEndDate(sem.endDate);
    setMaxCredits(sem.maxCredits.toString());
    setEnrollmentDeadline(sem.enrollmentDeadline);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sessionCode) return;
    if (editingSem) {
      updateSemester(editingSem.id, {
        name,
        sessionCode,
        startDate,
        endDate,
        maxCredits: parseFloat(maxCredits) || 21.0,
        enrollmentDeadline
      });
    } else {
      addSemester({
        name,
        sessionCode,
        startDate,
        endDate,
        isActive: false,
        maxCredits: parseFloat(maxCredits) || 21.0,
        enrollmentDeadline
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
            Academic Semesters & Sessions Management (CRUD)
          </h2>
          <p className="text-xs text-slate-400">
            Define academic terms, active session dates, and enrollment limits
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition-all w-fit cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Bulk Import / Export (CSV)</span>
          </button>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all w-fit cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Academic Session</span>
          </button>
        </div>
      </div>

      {/* Semesters Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Semester & Code</th>
                <th className="px-4 py-3.5">Term Dates</th>
                <th className="px-4 py-3.5">Max Credit Limit</th>
                <th className="px-4 py-3.5">Enrollment Deadline</th>
                <th className="px-4 py-3.5">Session Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {semesters.map(sem => (
                <tr key={sem.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{sem.name}</p>
                    <span className="font-mono text-[11px] text-purple-400">Code: {sem.sessionCode}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    <p>{sem.startDate} to {sem.endDate}</p>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-indigo-400">
                    {sem.maxCredits} Credits
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    {sem.enrollmentDeadline}
                  </td>
                  <td className="px-4 py-4">
                    {sem.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CURRENT ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveSemester(sem.id)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        Set Active
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(sem)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSemester(sem.id)}
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
              {editingSem ? 'Edit Semester' : 'Add New Academic Session'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Session Name</label>
                  <input
                    type="text"
                    placeholder="Spring 2026"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Session Code</label>
                  <input
                    type="text"
                    placeholder="261"
                    value={sessionCode}
                    onChange={e => setSessionCode(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Max Credits</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxCredits}
                    onChange={e => setMaxCredits(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Enrollment Deadline</label>
                  <input
                    type="date"
                    value={enrollmentDeadline}
                    onChange={e => setEnrollmentDeadline(e.target.value)}
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
                  {editingSem ? 'Update Semester' : 'Create Session'}
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
        title="Bulk Register Semesters & Academic Sessions via CSV"
        sampleFilename="Semesters_Sessions_Template.csv"
        sampleCsvContent={`name,sessionCode,startDate,endDate,maxCredits,enrollmentDeadline,isActive
Spring 2027,SP27,2027-01-10,2027-05-25,21.0,2027-01-20,false
Summer 2027,SU27,2027-06-01,2027-09-15,15.0,2027-06-10,false
Fall 2027,F27,2027-10-01,2028-02-15,21.0,2027-10-10,false`}
        expectedHeaders={['name', 'sessioncode', 'startdate', 'enddate', 'maxcredits', 'enrollmentdeadline', 'isactive']}
        columnGuide={[
          { key: 'name', description: 'Semester Name', required: true, example: 'Fall 2026' },
          { key: 'sessionCode', description: 'Session Code', required: true, example: 'F26' },
          { key: 'startDate', description: 'Start Date (YYYY-MM-DD)', required: true, example: '2026-07-01' },
          { key: 'endDate', description: 'End Date (YYYY-MM-DD)', required: true, example: '2026-11-30' },
          { key: 'maxCredits', description: 'Max Credits Limit', required: false, example: '21.0' },
          { key: 'enrollmentDeadline', description: 'Enrollment Deadline', required: false, example: '2026-07-15' },
          { key: 'isActive', description: 'Active Session (true/false)', required: false, example: 'false' }
        ]}
        exportData={semesters}
        exportFilename="University_Semesters_Sessions.csv"
        onImport={(importedRows) => {
          const formatted = importedRows.map(row => ({
            name: row.name || 'New Semester',
            sessionCode: row.sessionCode || 'SES',
            startDate: row.startDate || '2026-01-01',
            endDate: row.endDate || '2026-05-30',
            maxCredits: parseFloat(row.maxCredits) || 21.0,
            enrollmentDeadline: row.enrollmentDeadline || '2026-01-15',
            isActive: row.isActive === 'true'
          }));
          bulkAddSemesters(formatted);
          return { success: true, count: formatted.length };
        }}
      />
    </div>
  );
};
