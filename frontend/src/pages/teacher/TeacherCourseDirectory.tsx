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
  const { teacherRoster } = useApp();
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudentModal, setActiveStudentModal] = useState<StudentRosterItem | null>(null);

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
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Course & Enrolled Student Directory
          </h2>
          <p className="text-xs text-slate-400">
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors w-fit"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#111827] border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">Filter Section:</span>
          {(['ALL', 'A', 'B'] as const).map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSection === sec
                  ? 'bg-emerald-600 text-white shadow-md'
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
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Student ID & Name</th>
                <th className="px-4 py-3.5">Section</th>
                <th className="px-4 py-3.5">Attendance Rate</th>
                <th className="px-4 py-3.5">Continuous Marks</th>
                <th className="px-4 py-3.5">Risk Health</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map(student => (
                <tr key={student.studentId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{student.studentName}</p>
                    <p className="font-mono text-xs text-indigo-400">{student.studentId}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-200">
                    Section {student.section}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.attendanceRate >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className={`font-mono font-bold ${student.attendanceRate >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-slate-200">
                    {student.currentMarks} / 100
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={student.riskLevel} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveStudentModal(student)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {activeStudentModal.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{activeStudentModal.studentName}</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {activeStudentModal.studentId}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Institutional Email</p>
                <p className="font-semibold text-white mt-0.5 truncate">{activeStudentModal.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Enrolled Section</p>
                <p className="font-semibold text-white mt-0.5">Section {activeStudentModal.section}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Attendance Percentage</p>
                <p className={`font-bold mt-0.5 ${activeStudentModal.attendanceRate >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeStudentModal.attendanceRate}% ({activeStudentModal.attendanceRate < 75 ? 'Debarment Risk' : 'Eligible'})
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400">Continuous Assessment</p>
                <p className="font-bold text-indigo-400 mt-0.5">{activeStudentModal.currentMarks} / 100 Marks</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-300">Advisor Diagnostic Notes:</p>
              <p className="text-slate-400 leading-relaxed">
                {activeStudentModal.riskLevel === 'CRITICAL'
                  ? 'Attendance has fallen below the 75% university eligibility line. Recommended to dispatch counseling warning or schedule guardian interview.'
                  : 'Student is in good academic standing. Regular attendance and consistent quiz performance recorded.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveStudentModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
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
