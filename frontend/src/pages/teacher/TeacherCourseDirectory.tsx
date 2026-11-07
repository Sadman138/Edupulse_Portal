import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Mail,
  Eye,
  AlertTriangle,
  Download,
  X
} from 'lucide-react';
import { StudentRosterItem } from '../../types';

export const TeacherCourseDirectory: React.FC = () => {
  const { teacherRoster, theme } = useApp();
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudentModal, setActiveStudentModal] = useState<StudentRosterItem | null>(null);

  const isLight = theme?.mode === 'light';

  const filtered = teacherRoster.filter(s => {
    if (selectedSection !== 'ALL' && s.section !== selectedSection) return false;
    if (searchQuery && !s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) && !s.studentId.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            style={{ color: 'var(--ep-text-primary, #ffffff)' }}
            className="text-xl sm:text-2xl font-black tracking-tight"
          >
            Course & Enrolled Student Directory
          </h2>
          <p style={{ color: 'var(--ep-text-secondary, #94a3b8)' }} className="text-xs font-semibold">
            CSE 311: Database Management Systems • Enrolled Roster & Risk Profiles
          </p>
        </div>

        <button
          onClick={() => {
            const csv = "data:text/csv;charset=utf-8," +
              "Student ID,Name,Section,Email,Attendance %,Marks %,Risk Level\n" +
              teacherRoster.map(s => `"${s.studentId}","${s.studentName}","${s.section}","${s.email}",${s.attendanceRate},${s.currentMarks},"${s.riskLevel}"`).join("\n");
            const uri = encodeURI(csv);
            const a = document.createElement("a");
            a.href = uri;
            a.download = "CSE311_Enrolled_Directory.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors w-fit shadow-xs ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-500" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          backgroundColor: 'var(--ep-bg-card, #111827)',
          borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border shadow-sm"
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-extrabold" style={{ color: isLight ? '#0f172a' : '#cbd5e1' }}>
            Filter Section:
          </span>
          {(['ALL', 'A', 'B'] as const).map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSection === sec
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isLight
                  ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sec === 'ALL' ? 'All Sections' : `Section ${sec}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isLight
                ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-500 shadow-2xs'
                : 'bg-slate-900 border border-slate-700 text-white'
            }`}
          />
        </div>
      </div>

      {/* Directory Table */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : 'var(--ep-bg-card, #111827)',
          borderColor: isLight ? '#cbd5e1' : 'var(--ep-border, rgba(51, 65, 85, 0.7))'
        }}
        className="rounded-2xl border overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              style={{
                backgroundColor: isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.8)',
                borderColor: isLight ? '#cbd5e1' : '#1e293b'
              }}
              className="uppercase tracking-wider font-extrabold border-b text-[11px]"
            >
              <tr>
                <th className="px-5 py-3.5" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Student ID & Name</th>
                <th className="px-4 py-3.5" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Section</th>
                <th className="px-4 py-3.5" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Attendance Rate</th>
                <th className="px-4 py-3.5" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Continuous Marks</th>
                <th className="px-4 py-3.5" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Risk Health</th>
                <th className="px-5 py-3.5 text-right" style={{ color: isLight ? '#0f172a' : '#94a3b8' }}>Details</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                borderColor: isLight ? '#e2e8f0' : 'rgba(30, 41, 59, 0.8)'
              }}
            >
              {filtered.map(student => (
                <tr
                  key={student.studentId}
                  className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}
                >
                  <td className="px-5 py-4">
                    <p
                      data-student-name="true"
                      className="student-name font-black text-sm"
                      style={{ color: isLight ? '#0f172a' : 'var(--ep-text-primary, #ffffff)' }}
                    >
                      {student.studentName || 'Student Name'}
                    </p>
                    <p
                      data-student-id="true"
                      className="student-id font-mono text-xs font-black mt-0.5"
                      style={{ color: isLight ? '#312e81' : 'var(--ep-accent-secondary, #818cf8)' }}
                    >
                      {student.studentId}
                    </p>
                  </td>
                  <td
                    className="px-4 py-4 font-black text-sm"
                    style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}
                  >
                    Section {student.section}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-20 h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                        <div
                          className={`h-full rounded-full ${
                            student.attendanceRate >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className={`font-mono font-black ${student.attendanceRate >= 75 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-4 font-mono font-extrabold text-sm"
                    style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}
                  >
                    {student.currentMarks} / 100
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={student.riskLevel} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveStudentModal(student)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                      title="Inspect Student Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {activeStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#111827',
              borderColor: isLight ? '#cbd5e1' : '#334155'
            }}
            className="border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: isLight ? '#e2e8f0' : '#1e293b' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {activeStudentModal.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="font-extrabold text-base"
                    style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                  >
                    {activeStudentModal.studentName}
                  </h3>
                  <p
                    className="text-xs font-mono font-bold"
                    style={{ color: isLight ? '#4338ca' : '#818cf8' }}
                  >
                    ID: {activeStudentModal.studentId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentModal(null)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <p className={isLight ? 'text-slate-600 font-bold' : 'text-slate-400'}>Institutional Email</p>
                <p className={`font-bold mt-0.5 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeStudentModal.email}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <p className={isLight ? 'text-slate-600 font-bold' : 'text-slate-400'}>Enrolled Section</p>
                <p className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>Section {activeStudentModal.section}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <p className={isLight ? 'text-slate-600 font-bold' : 'text-slate-400'}>Attendance Percentage</p>
                <p className={`font-black mt-0.5 ${activeStudentModal.attendanceRate >= 75 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                  {activeStudentModal.attendanceRate}% ({activeStudentModal.attendanceRate < 75 ? 'Debarment Risk' : 'Eligible'})
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <p className={isLight ? 'text-slate-600 font-bold' : 'text-slate-400'}>Continuous Assessment</p>
                <p className={`font-black mt-0.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>{activeStudentModal.currentMarks} / 100 Marks</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>Advisor Diagnostic Notes:</p>
              <p className={`leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                {activeStudentModal.riskLevel === 'CRITICAL'
                  ? 'Attendance has fallen below the 75% university eligibility line. Recommended to dispatch counseling warning or schedule guardian interview.'
                  : 'Student is in good academic standing. Regular attendance and consistent quiz performance recorded.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveStudentModal(null)}
                className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
