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
  const { coCurricular, addCoCurricular } = useApp();
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
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Co-Curricular & Leadership Profile
          </h2>
          <p className="text-xs text-slate-400">
            Clubs, hackathons, sports championships, research and university leadership credentials
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity / Award</span>
        </button>
      </div>

      {/* Grid of activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coCurricular.map(act => (
          <div
            key={act.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {act.category}
                </span>
                <StatusBadge status={act.status} size="sm" />
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base leading-snug">
                  {act.title}
                </h3>
                <p className="text-xs font-semibold text-slate-300 mt-1">
                  {act.role} • <span className="text-indigo-400">{act.organization}</span>
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {act.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{act.startDate} {act.endDate ? `– ${act.endDate}` : ''}</span>
              </span>

              {act.certificateProvided && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Add Co-Curricular Achievement</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Title / Achievement Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Organizer - Tech Carnival"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Team Lead"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Organization / Event</label>
                <input
                  type="text"
                  placeholder="e.g. MU Computer Club (MUCC)"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of responsibilities and achievements..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
