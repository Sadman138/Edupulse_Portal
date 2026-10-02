import React, { useState } from 'react';
import { CO_CURRICULAR_DATA } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface StudentCoCurricularProps {
  isDarkMode?: boolean;
}

export const StudentCoCurricular: React.FC<StudentCoCurricularProps> = ({
  isDarkMode: propIsDarkMode
}) => {
  const { isDarkMode: contextIsDarkMode } = useApp();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;

  const [skills, setSkills] = useState([
    {
      id: 1,
      title: 'IUPC Regional Programming Contest',
      category: 'Competitive Programming',
      role: 'Team Lead',
      points: '+150 Points',
      status: 'VERIFIED'
    },
    {
      id: 2,
      title: 'IoT & Embedded Edge AI Workshop',
      category: 'Technical Workshop',
      role: 'Participant',
      points: '+50 Points',
      status: 'VERIFIED'
    },
    {
      id: 3,
      title: 'Metro CSE Software Fest 2026',
      category: 'Hackathon',
      role: 'Project Presenter',
      points: '+100 Points',
      status: 'PENDING'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Skill / Certification');
  const [newRole, setNewRole] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRole) return;
    const newItem = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      role: newRole,
      points: '+50 Points',
      status: 'VERIFIED'
    };
    setSkills([newItem, ...skills]);
    setNewTitle('');
    setNewRole('');
    setIsModalOpen(false);
  };

  const cardStyle = isDarkMode
    ? 'bg-[#101726] border-[#1d273a] shadow-lg backdrop-blur-xl text-slate-100'
    : 'bg-white border-slate-200/90 shadow-xs text-slate-900';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-black tracking-tight flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-cyan-500 font-bold text-2xl">sports_score</span>
            <span>Co-Curricular & Technical Skills Portal</span>
          </h2>
          <p className={`text-xs mt-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            Track extra-curricular credits, verified tech skills, and institutional club achievements.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-md self-start md:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add New Skill / Achievement</span>
        </button>
      </div>

      {/* Verified Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((act) => (
          <div key={act.id} className={`p-5 rounded-2xl border space-y-3.5 transition-all ${cardStyle}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-wider">
                {act.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono border ${
                  act.status === 'VERIFIED'
                    ? isDarkMode
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : isDarkMode
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {act.status}
              </span>
            </div>
            <h3
              className={`text-sm font-black tracking-tight leading-snug ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {act.title}
            </h3>
            <div
              className={`flex items-center justify-between text-xs font-bold pt-2.5 border-t ${
                isDarkMode ? 'border-[#1a2336] text-slate-300' : 'border-slate-200 text-slate-700'
              }`}
            >
              <span>
                Role:{' '}
                <strong className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700 font-extrabold'}>
                  {act.role}
                </strong>
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                {act.points}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Clubs & Technical Stack Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Technical Stack */}
        <div className={`p-5 rounded-2xl border space-y-3.5 ${cardStyle}`}>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">
            <span className="material-symbols-outlined text-lg">code</span>
            <span>Verified Technical Stack</span>
          </div>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            Endorsed technical competencies across academic coursework and lab project evaluations.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {CO_CURRICULAR_DATA.skills.map((s, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all ${
                  isDarkMode
                    ? 'bg-[#141b2c] border-[#222d44] text-slate-200'
                    : 'bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Club Affiliations */}
        <div className={`p-5 rounded-2xl border space-y-3.5 ${cardStyle}`}>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-sm">
            <span className="material-symbols-outlined text-lg">groups</span>
            <span>Institutional Club Affiliations</span>
          </div>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            Registered student leadership and activities in Metropolitan University Student Affairs.
          </p>
          <div className="space-y-2 pt-1">
            {CO_CURRICULAR_DATA.clubs.map((c, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-extrabold transition-all ${
                  isDarkMode
                    ? 'bg-[#141b2c] border-[#222d44] text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900 shadow-2xs'
                }`}
              >
                <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{c}</span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded font-mono border ${
                    isDarkMode
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  }`}
                >
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl ${
              isDarkMode
                ? 'bg-[#101726] border-[#232f48] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Add Skill / Achievement
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-lg cursor-pointer ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-3.5">
              <div>
                <label className={`text-xs block mb-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Hackathon 2026 Runner-up"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cyan-500 ${
                    isDarkMode
                      ? 'bg-[#151c2e] border-[#232f48] text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs block mb-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cyan-500 ${
                    isDarkMode
                      ? 'bg-[#151c2e] border-[#232f48] text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Competitive Programming">Competitive Programming</option>
                  <option value="Technical Workshop">Technical Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Research & Publications">Research & Publications</option>
                  <option value="Skill / Certification">Skill / Certification</option>
                </select>
              </div>

              <div>
                <label className={`text-xs block mb-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Role / Contribution
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Lead / Project Presenter / Author"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cyan-500 ${
                    isDarkMode
                      ? 'bg-[#151c2e] border-[#232f48] text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
