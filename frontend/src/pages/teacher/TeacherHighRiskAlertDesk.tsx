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
  const { highRiskAlerts, updateHighRiskStatus, setPdfModalDoc, theme } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<HighRiskAlert | null>(null);
  const [actionModalType, setActionModalType] = useState<'INTERVENTION_SENT' | 'MEETING_SCHEDULED' | 'RESOLVED' | null>(null);
  const [actionNote, setActionNote] = useState('');

  const isLight = theme?.mode === 'light';

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
          <h2
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-xl sm:text-2xl font-black tracking-tight"
          >
            High-Risk Student Alert & Early Warning Desk
          </h2>
        </div>
        <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold mt-1">
          Automated academic intervention pipeline for students with Attendance &lt; 75% or Assessment &lt; 40%
        </p>
      </div>

      {/* Rules Criteria Alert Banner */}
      <div
        style={{
          backgroundColor: isLight ? '#fef2f2' : 'rgba(15, 23, 42, 0.8)',
          borderColor: isLight ? '#fecaca' : '#1e293b'
        }}
        className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span
              className="font-black uppercase tracking-wider"
              style={{ color: isLight ? '#991b1b' : '#ffffff' }}
            >
              Early Warning Rules Engine:
            </span>
            <p
              className="text-[11px] font-semibold mt-0.5"
              style={{ color: isLight ? '#7f1d1d' : '#94a3b8' }}
            >
              1. Debarment Flag: Attendance &lt; 75% • 2. Critical Academic Flag: Continuous Marks &lt; 40% (Fail projection) • 3. Automatic Red Alert issued to student dashboard.
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-mono font-black px-3.5 py-1.5 rounded-full border shrink-0 ${
            isLight
              ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-xs'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
          }`}
        >
          {highRiskAlerts.length} Flagged Candidates
        </span>
      </div>

      {/* Alerts Cards Grid */}
      <div className="space-y-4">
        {highRiskAlerts.map(alert => (
          <div
            key={alert.id}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#111827',
              borderColor: alert.status === 'ACTIVE_ALERT'
                ? (isLight ? '#f87171' : 'rgba(244, 63, 94, 0.4)')
                : (isLight ? '#e2e8f0' : '#1e293b')
            }}
            className="p-5 rounded-2xl border space-y-4 shadow-xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center font-black">
                  {alert.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="font-black text-base"
                    style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                  >
                    {alert.studentName}
                  </h3>
                  <p
                    className="text-xs font-mono font-bold mt-0.5"
                    style={{ color: isLight ? '#4338ca' : '#818cf8' }}
                  >
                    ID: {alert.studentId} • Course: {alert.courseCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={alert.status.replace(/_/g, ' ')} size="md" />
              </div>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div
                style={{
                  backgroundColor: isLight ? '#f8fafc' : '#0b1120',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b'
                }}
                className="p-3 rounded-xl border shadow-xs"
              >
                <p className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>Class Attendance Rate</p>
                <p className={`font-mono text-lg font-black mt-0.5 ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                  {alert.attendanceRate}%{' '}
                  <span className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>(&lt; 75% Threshold)</span>
                </p>
              </div>

              <div
                style={{
                  backgroundColor: isLight ? '#f8fafc' : '#0b1120',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b'
                }}
                className="p-3 rounded-xl border shadow-xs"
              >
                <p className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>Current Continuous Marks</p>
                <p className={`font-mono text-lg font-black mt-0.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                  {alert.marksScore} / 100{' '}
                  <span className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>({alert.marksScore < 40 ? 'Failing' : 'Low'})</span>
                </p>
              </div>

              <div
                style={{
                  backgroundColor: isLight ? '#f8fafc' : '#0b1120',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b'
                }}
                className="p-3 rounded-xl border shadow-xs"
              >
                <p className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>Primary Risk Factor</p>
                <p
                  className="font-bold mt-0.5 line-clamp-2"
                  style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}
                >
                  {alert.riskFactor}
                </p>
              </div>
            </div>

            {/* Intervention History */}
            {alert.interventionHistory.length > 0 && (
              <div
                style={{
                  backgroundColor: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b'
                }}
                className="p-3.5 rounded-xl border text-xs space-y-1.5 shadow-2xs"
              >
                <p className={`font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Audit & Intervention Log:
                </p>
                {alert.interventionHistory.map((h, i) => (
                  <p
                    key={i}
                    className="text-[11px] flex items-center gap-2 font-medium"
                    style={{ color: isLight ? '#334155' : '#cbd5e1' }}
                  >
                    <span className={`font-mono font-bold ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>[{h.date}]</span>
                    <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{h.action}:</strong> {h.note} (by {h.by})
                  </p>
                ))}
              </div>
            )}

            {/* Teacher Actions */}
            <div
              className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
              style={{ borderColor: isLight ? '#e2e8f0' : '#1e293b' }}
            >
              <button
                onClick={() =>
                  setPdfModalDoc({
                    title: `Official Intervention Warning Slip: ${alert.studentName}`,
                    category: 'ACADEMIC DEBARMENT RISK',
                    content: `METROPOLITAN UNIVERSITY EARLY WARNING INTERVENTION\n\nStudent: ${alert.studentName} (ID: ${alert.studentId})\nCourse: ${alert.courseCode}\nCurrent Attendance: ${alert.attendanceRate}%\nCurrent Marks: ${alert.marksScore}%\nRisk Reason: ${alert.riskFactor}\n\nNotice: Student is officially cautioned regarding semester final examination debarment pursuant to Metropolitan University Academic Statutes.`
                  })
                }
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-2xs'
                      : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300'
                  }`}
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 shadow-2xs'
                      : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300'
                  }`}
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 shadow-2xs'
                      : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300'
                  }`}
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
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#111827',
              borderColor: isLight ? '#cbd5e1' : '#334155'
            }}
            className="border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3
              className="font-black text-base"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {actionModalType === 'INTERVENTION_SENT' && 'Dispatch Formal Academic Warning'}
              {actionModalType === 'MEETING_SCHEDULED' && 'Schedule Academic Counseling Session'}
              {actionModalType === 'RESOLVED' && 'Resolve High-Risk Alert'}
            </h3>
            <p
              className="text-xs font-semibold"
              style={{ color: isLight ? '#334155' : '#cbd5e1' }}
            >
              Candidate: <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{selectedAlert.studentName}</strong> (ID: {selectedAlert.studentId})
            </p>

            <form onSubmit={handleActionConfirm} className="space-y-4">
              <div>
                <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Intervention Log Note & Remarks
                </label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  required
                  placeholder="Record counseling instructions or meeting schedule..."
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-2xs' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setSelectedAlert(null); setActionModalType(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
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
