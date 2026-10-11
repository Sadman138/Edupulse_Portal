import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CheckCircle,
  XCircle,
  FileCheck2,
  FileSpreadsheet,
  AlertTriangle,
  User,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { PreviousResultSubmission } from '../../types';

export const TeacherVerificationDesk: React.FC = () => {
  const { previousResults, verifyResultSubmission, setPdfModalDoc } = useApp();
  const [selectedSub, setSelectedSub] = useState<PreviousResultSubmission | null>(null);
  const [actionType, setActionType] = useState<'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [remarks, setRemarks] = useState('Official grade sheet cross-checked with Examination Controller roster.');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    verifyResultSubmission(selectedSub.id, actionType, remarks);
    setSelectedSub(null);
  };

  const pendingList = previousResults.filter(p => p.status === 'PENDING');
  const verifiedList = previousResults.filter(p => p.status !== 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Advisor Grade Verification & Retake Clearance Desk
        </h2>
        <p className="text-xs text-slate-400">
          Inspect student grade claims, backlog improvement submissions, and authorize CGPA updates
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <p className="text-xs font-semibold uppercase">Pending Claims</p>
          <p className="text-2xl font-black mt-1">{pendingList.length} Awaiting Verification</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <p className="text-xs font-semibold uppercase">Endorsed Claims</p>
          <p className="text-2xl font-black mt-1">
            {previousResults.filter(p => p.status === 'VERIFIED').length} Cleared
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <p className="text-xs font-semibold uppercase">Rejected Claims</p>
          <p className="text-2xl font-black mt-1">
            {previousResults.filter(p => p.status === 'REJECTED').length} Disallowed
          </p>
        </div>
      </div>

      {/* Pending Queue Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl space-y-4 p-5">
        <h3 className="font-bold text-white text-base">Pending Student Submissions Queue</h3>

        {pendingList.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No pending result submissions in queue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Student ID & Name</th>
                  <th className="px-4 py-3">Claimed Semester</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Claimed Credits & GPA</th>
                  <th className="px-4 py-3">Attached Document</th>
                  <th className="px-4 py-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {pendingList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-white">{item.studentName}</p>
                      <p className="font-mono text-indigo-400 text-[11px]">{item.studentId}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-200">
                      {item.semesterName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-emerald-400">{item.gpa.toFixed(2)} GPA</span>
                      <span className="text-slate-400 text-[11px] ml-1">({item.completedCredits} Cr)</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() =>
                          setPdfModalDoc({
                            title: `Grade Sheet Claim: ${item.semesterName}`,
                            category: item.type,
                            content: `STUDENT GRADE ENDORSEMENT CLAIM\nStudent: ${item.studentName} (ID: ${item.studentId})\nSemester: ${item.semesterName}\nClaimed SGPA: ${item.gpa.toFixed(2)}\nCompleted Credits: ${item.completedCredits}\nSubmitted File: ${item.documentName}\n\nSubmitted to Faculty Advisor for official clearance.`
                          })
                        }
                        className="text-indigo-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{item.documentName}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedSub(item);
                            setActionType('VERIFIED');
                            setRemarks('Grade verified against Examination Controller ledger.');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Verify & Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSub(item);
                            setActionType('REJECTED');
                            setRemarks('Inconsistent credits or illegible document slip.');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Historical Verification Ledger */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl p-5 space-y-3">
        <h3 className="font-bold text-white text-base">Archived Verification Decisions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Student Name & ID</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Result GPA</th>
                <th className="px-4 py-3">Verified By</th>
                <th className="px-4 py-3">Decision Remarks</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {verifiedList.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white">{item.studentName}</p>
                    <p className="font-mono text-slate-400 text-[11px]">{item.studentId}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-300">{item.semesterName}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{item.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-400">{item.verifiedBy || 'Dr. Tariqul Islam'}</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px] italic max-w-xs">{item.remarks}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">
              {actionType === 'VERIFIED' ? 'Approve Result Endorsement' : 'Reject Result Claim'}
            </h3>
            <p className="text-xs text-slate-300">
              Confirming decision for <strong className="text-white">{selectedSub.studentName}</strong> ({selectedSub.semesterName}).
            </p>

            <form onSubmit={handleAction} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Official Verification Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs ${
                    actionType === 'VERIFIED'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
