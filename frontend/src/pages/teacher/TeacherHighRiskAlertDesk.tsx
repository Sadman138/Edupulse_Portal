import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  AlertTriangle,
  Send,
  Calendar,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  MessageSquare,
  Clock,
  X
} from 'lucide-react';
import { HighRiskAlert } from '../../types';

export const TeacherHighRiskAlertDesk: React.FC = () => {
  const { highRiskAlerts, updateHighRiskStatus, setPdfModalDoc } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<HighRiskAlert | null>(null);
  const [actionModalType, setActionModalType] = useState<'INTERVENTION_SENT' | 'MEETING_SCHEDULED' | 'RESOLVED' | null>(null);
  const [actionNote, setActionNote] = useState('');

  const handleActionConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert || !actionModalType) return;
    updateHighRiskStatus(selectedAlert.id, actionModalType, actionNote || 'Intervention logged by course advisor.');
    setSelectedAlert(null);
    setActionModalType(null);
    setActionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            High-Risk Student Alert & Early Warning Desk
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Automated academic intervention pipeline for students with Attendance &lt; 75% or Assessment &lt; 40%
        </p>
      </div>

      {/* Rules Criteria Alert Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white uppercase tracking-wider">Early Warning Rules Engine:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              1. Debarment Flag: Attendance &lt; 75% • 2. Critical Academic Flag: Continuous Marks &lt; 40% (Fail projection) • 3. Automatic Red Alert issued to student dashboard.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 shrink-0">
          {highRiskAlerts.length} Flagged Candidates
        </span>
      </div>

      {/* Alerts Cards Grid */}
      <div className="space-y-4">
        {highRiskAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border bg-[#111827] space-y-4 shadow-xl transition-all ${
              alert.status === 'ACTIVE_ALERT'
                ? 'border-rose-500/40 ring-1 ring-rose-500/20 bg-rose-950/10'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  {alert.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{alert.studentName}</h3>
                  <p className="text-xs font-mono text-indigo-400">ID: {alert.studentId} • Course: {alert.courseCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={alert.status.replace(/_/g, ' ')} size="md" />
              </div>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Class Attendance Rate</p>
                <p className="font-mono text-lg font-black text-rose-400 mt-0.5">
                  {alert.attendanceRate}% <span className="text-[11px] text-slate-500 font-normal">(&lt; 75% Threshold)</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Current Continuous Marks</p>
                <p className="font-mono text-lg font-black text-amber-400 mt-0.5">
                  {alert.marksScore} / 100 <span className="text-[11px] text-slate-500 font-normal">({alert.marksScore < 40 ? 'Failing' : 'Low'})</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Primary Risk Factor</p>
                <p className="font-semibold text-slate-200 mt-0.5 line-clamp-2">
                  {alert.riskFactor}
                </p>
              </div>
            </div>

            {/* Intervention History */}
            {alert.interventionHistory.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <p className="font-semibold text-slate-400">Audit & Intervention Log:</p>
                {alert.interventionHistory.map((h, i) => (
                  <p key={i} className="text-slate-300 text-[11px] flex items-center gap-2">
                    <span className="text-indigo-400 font-mono">[{h.date}]</span>
                    <strong className="text-white">{h.action}:</strong> {h.note} (by {h.by})
                  </p>
                ))}
              </div>
            )}

            {/* Teacher Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() =>
                  setPdfModalDoc({
                    title: `Official Intervention Warning Slip: ${alert.studentName}`,
                    category: 'ACADEMIC DEBARMENT RISK',
                    content: `METROPOLITAN UNIVERSITY EARLY WARNING INTERVENTION\n\nStudent: ${alert.studentName} (ID: ${alert.studentId})\nCourse: ${alert.courseCode}\nCurrent Attendance: ${alert.attendanceRate}%\nCurrent Marks: ${alert.marksScore}%\nRisk Reason: ${alert.riskFactor}\n\nNotice: Student is officially cautioned regarding semester final examination debarment pursuant to Metropolitan University Academic Statutes.`
                  })
                }
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <span>View Intervention Slip PDF</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setActionModalType('INTERVENTION_SENT');
                    setActionNote('Dispatched official warning letter to student portal.');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Warning</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setActionModalType('MEETING_SCHEDULED');
                    setActionNote('Counseling meeting scheduled with advisor & student.');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Counseling</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setActionModalType('RESOLVED');
                    setActionNote('Student attended makeup classes and cleared attendance threshold.');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Modal */}
      {selectedAlert && actionModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">
              {actionModalType === 'INTERVENTION_SENT' && 'Dispatch Formal Academic Warning'}
              {actionModalType === 'MEETING_SCHEDULED' && 'Schedule Academic Counseling Session'}
              {actionModalType === 'RESOLVED' && 'Resolve High-Risk Alert'}
            </h3>
            <p className="text-xs text-slate-300">
              Candidate: <strong className="text-white">{selectedAlert.studentName}</strong> (ID: {selectedAlert.studentId})
            </p>

            <form onSubmit={handleActionConfirm} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Intervention Log Note & Remarks
                </label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  required
                  placeholder="Record counseling instructions or meeting schedule..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setSelectedAlert(null); setActionModalType(null); }}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Confirm & Log Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
