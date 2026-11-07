import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Award,
  Plus,
  Trophy,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const StudentCoCurricular: React.FC = () => {
  const { coCurricular, addCoCurricular, theme } = useApp();
  const isLight = theme.mode === 'light';
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Club' | 'Competition' | 'Sports' | 'Volunteering' | 'Research' | 'Leadership'>('Club');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization) return;
    addCoCurricular({
      title,
      category,
      organization,
      role,
      startDate: startDate || '2026',
      description,
      certificateProvided: true
    });
    setShowModal(false);
    setTitle('');
    setOrganization('');
    setRole('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
            Co-Curricular & Leadership Profile
          </h2>
          <p className="text-xs" style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
            Clubs, hackathons, sports championships, research and university leadership credentials
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: theme.accentColor }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all w-fit cursor-pointer hover:brightness-110 active:scale-95"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Activity / Award</span>
        </button>
      </div>

      {/* Grid of activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coCurricular.map(act => (
          <div
            key={act.id}
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isLight ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {act.category}
                </span>
                <StatusBadge status={act.status} size="sm" />
              </div>

              <div>
                <h3 className="font-extrabold text-base leading-snug" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
                  {act.title}
                </h3>
                <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {act.role} • <span className="text-indigo-500 font-bold">{act.organization}</span>
                </p>
              </div>

              <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--ep-text-secondary, #94a3b8)' }}>
                {act.description}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{act.startDate} {act.endDate ? `– ${act.endDate}` : ''}</span>
              </span>

              {act.certificateProvided && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Certificate Endorsed</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div
            style={{
              backgroundColor: 'var(--ep-bg-card, #111827)',
              borderColor: 'var(--ep-border, rgba(51, 65, 85, 0.7))'
            }}
            className="border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-extrabold text-base" style={{ color: 'var(--ep-text-primary, #ffffff)' }}>
              Add Co-Curricular Achievement
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Title / Achievement Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Organizer - Tech Carnival"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Club">Club Activity</option>
                    <option value="Competition">Competition / Hackathon</option>
                    <option value="Sports">Sports</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Research">Research & Papers</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Team Lead"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    required
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Organization / Event</label>
                <input
                  type="text"
                  placeholder="e.g. MU Computer Club (MUCC)"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of responsibilities and achievements..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: theme.accentColor }}
                  className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer hover:brightness-110 active:scale-95"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
