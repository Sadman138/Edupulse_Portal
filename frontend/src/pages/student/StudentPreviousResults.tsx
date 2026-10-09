import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  Award
} from 'lucide-react';

export const StudentPreviousResults: React.FC = () => {
  const { previousResults, submitPreviousResult, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [semesterName, setSemesterName] = useState('4th Semester (Fall 2025)');
  const [completedCredits, setCompletedCredits] = useState('18.0');
  const [gpa, setGpa] = useState('3.50');
  const [type, setType] = useState<'Regular' | 'Retake' | 'Improvement' | 'Backlog'>('Regular');
  const [documentName, setDocumentName] = useState('Fall2025_GradeSheet_Signed.pdf');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPreviousResult({
      studentId: currentUser.studentId || '241-115-211',
      studentName: currentUser.name,
      semesterName,
      completedCredits: parseFloat(completedCredits) || 18.0,
      gpa: parseFloat(gpa) || 3.50,
      type,
      documentName,
      remarks: 'Self-submitted grade certificate awaiting advisor verification.'
    });
    setShowModal(false);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Previous Semester Results & Retake Submissions
          </h2>
          <p className="text-xs text-slate-400">
            Submit backlog/retake GPA certificates for faculty verification and institutional CGPA updates
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Result Claim</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Submission Dispatched to Faculty Verification Desk!</span>
            <p className="text-[11px] text-emerald-200">Your course advisor (Dr. Tariqul Islam) will inspect the grade slip in their verification queue.</p>
          </div>
        </div>
      )}

      {/* Historical GPA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Cumulative CGPA</p>
          <p className="text-2xl font-black text-white">{currentUser.cgpa || 3.42} <span className="text-xs font-normal text-slate-400">/ 4.00</span></p>
          <p className="text-[10px] text-indigo-400">Verified by Academic Registrar</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Credits Earned</p>
          <p className="text-2xl font-black text-emerald-400">62.5 Cr</p>
          <p className="text-[10px] text-slate-500">Degree Requirement: 148.0 Cr</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Pending Claims</p>
          <p className="text-2xl font-black text-amber-400">
            {previousResults.filter(p => p.status === 'PENDING').length}
          </p>
          <p className="text-[10px] text-slate-500">Awaiting faculty signature</p>
        </div>
      </div>

      {/* Result Submissions Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Semester & Category</th>
                <th className="px-5 py-3.5">Credits</th>
                <th className="px-5 py-3.5">GPA Achieved</th>
                <th className="px-5 py-3.5">Submitted Document</th>
                <th className="px-5 py-3.5">Advisor Verification</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {previousResults.map(res => (
                <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{res.semesterName}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 mt-1 inline-block">
                      {res.type} Submission
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-200">
                    {res.completedCredits} Cr
                  </td>
                  <td className="px-5 py-4 font-mono font-extrabold text-sm text-emerald-400">
                    {res.gpa.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                    {res.documentName}
                  </td>
                  <td className="px-5 py-4">
                    {res.verifiedBy ? (
                      <div>
                        <p className="font-semibold text-slate-200 text-xs">{res.verifiedBy}</p>
                        <p className="text-[10px] text-slate-500">{res.verificationDate}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-400 italic">Pending Advisor Approval</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <StatusBadge status={res.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Submit Previous Semester Result</h3>
            <p className="text-xs text-slate-400">
              Upload retake or backlog grade sheet for verification by Academic Coordinator Dr. Tariqul Islam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Semester Name & Session</label>
                <input
                  type="text"
                  value={semesterName}
                  onChange={e => setSemesterName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Earned Credits</label>
                  <input
                    type="number"
                    step="0.5"
                    value={completedCredits}
                    onChange={e => setCompletedCredits(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Semester SGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={gpa}
                    onChange={e => setGpa(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Submission Category</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Regular">Regular Semester</option>
                  <option value="Retake">Retake Course</option>
                  <option value="Improvement">Grade Improvement</option>
                  <option value="Backlog">Backlog Examination</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Attached Grade Sheet PDF Name</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={e => setDocumentName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
