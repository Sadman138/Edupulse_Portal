import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface StudentPreviousResultsProps {
  isDarkMode?: boolean;
}

export const StudentPreviousResults: React.FC<StudentPreviousResultsProps> = ({
  isDarkMode = true
}) => {
  const { student, previousResults, submitPreviousResult } = useApp();

  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl'
    : 'bg-white border-slate-200 shadow-sm text-slate-800';

  const [modalOpen, setModalOpen] = useState(false);
  const [semesterName, setSemesterName] = useState('6th Semester (Spring 2026)');
  const [inputSgpa, setInputSgpa] = useState('3.50');
  const [inputCredits, setInputCredits] = useState('18');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const studentResults = previousResults.filter((r) => r.studentId === student.id);

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    submitPreviousResult(semesterName, parseFloat(inputSgpa), parseInt(inputCredits));
    setToastMessage('Submitted for faculty transcript verification! Status: PENDING');
    setTimeout(() => {
      setToastMessage(null);
      setModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Previous Semester Transcripts</h2>
          <p className="text-xs opacity-70">
            Historical GPA progression, course-wise transcripts, and official verification audit pipeline.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">upload_file</span>
          <span>Submit Past Semester Result</span>
        </button>
      </div>

      {/* Official CGPA Consistency Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardStyle}`}>
        <div>
          <span className="text-xs uppercase font-bold text-slate-400">
            Official Cumulative CGPA
          </span>
          <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
            {student.cgpa.toFixed(2)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Audited from {studentResults.filter((r) => r.status === 'VERIFIED').length} verified semester terms ({student.totalCredits} Credits)
          </span>
        </div>
        <div className="bg-[#141b2c] border border-[#1e283d] p-3.5 rounded-xl max-w-md text-xs text-slate-300">
          <p className="font-semibold text-cyan-400 mb-1">Audit Policy (Section 4.3):</p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            CGPA includes strictly official and verified historical semesters. Unverified records remain in PENDING status until faculty advisor verification.
          </p>
        </div>
      </div>

      {/* Semesters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentResults.map((s) => (
          <div key={s.id} className={`p-5 rounded-2xl border space-y-3.5 ${cardStyle}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">{s.semesterName}</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                  s.status === 'VERIFIED'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : s.status === 'PENDING'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {s.status}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-extrabold text-white tabular-nums">
                {s.sgpa.toFixed(2)}{' '}
                <span className="text-xs font-normal opacity-60">SGPA</span>
              </span>
              <span className="text-xs opacity-70 font-semibold">{s.creditsCompleted} Credits</span>
            </div>
            {s.verifiedBy && (
              <div className="pt-2 border-t border-[#1a2336] text-[11px] text-slate-400">
                Verified by {s.verifiedBy} ({s.verifiedAt})
              </div>
            )}
            {s.rejectionReason && (
              <div className="pt-2 border-t border-[#1a2336] text-[11px] text-rose-400">
                {s.rejectionReason}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal to Submit Past Semester Result */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#101726] border border-[#232f48] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Submit Past Semester Transcript</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Submit your published SGPA and credit total for faculty advisor verification.
            </p>
            <form onSubmit={handleAddSubmission} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  SEMESTER NAME
                </label>
                <input
                  type="text"
                  required
                  value={semesterName}
                  onChange={(e) => setSemesterName(e.target.value)}
                  className="w-full bg-[#141b2c] border border-[#222d44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    OBTAINED SGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    required
                    value={inputSgpa}
                    onChange={(e) => setInputSgpa(e.target.value)}
                    className="w-full bg-[#141b2c] border border-[#222d44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    TOTAL CREDITS
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={inputCredits}
                    onChange={(e) => setInputCredits(e.target.value)}
                    className="w-full bg-[#141b2c] border border-[#222d44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  TRANSCRIPT DOCUMENT (PDF)
                </label>
                <div className="border-2 border-dashed border-[#232f48] rounded-xl p-4 text-center text-xs text-slate-400">
                  <span className="material-symbols-outlined text-3xl text-slate-500 block mb-1">
                    description
                  </span>
                  <span>Transcript_Scan_Copy.pdf attached</span>
                </div>
              </div>
              {toastMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 rounded-xl text-xs font-semibold">
                  {toastMessage}
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
