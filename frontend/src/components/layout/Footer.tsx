import React from 'react';
import { Zap, BookOpen, Building, MapPin, Mail, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { currentUser, setActiveTab } = useApp();

  return (
    <footer className="w-full bg-[#050914] border-t border-slate-800/90 py-10 px-4 sm:px-8 text-xs text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Brand & Philosophy */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">
                EduPulse Platform
              </span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-cyan-400">
            Academic Governance & Monitoring Architecture
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Centralized academic telemetry, dynamic QR attendance tracking, UGC-compliant continuous evaluation, and rule-based early failure mitigation.
          </p>
        </div>

        {/* Column 2: Campus Portals */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>CAMPUS PORTALS</span>
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => setActiveTab('teacher-dashboard')}
                className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors text-slate-300"
              >
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Active Console ({currentUser.role})</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('teacher-routine')}
                className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors text-slate-300"
              >
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Class Routine & Room Directory</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('teacher-manual-attendance')}
                className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors text-slate-300"
              >
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Attendance Telemetry & Roll Call</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Departments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-purple-400" />
            <span>DEPARTMENTS</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="hover:text-white transition-colors">Computer Science & Eng.</li>
            <li className="hover:text-white transition-colors">Electrical & Electronic Eng.</li>
            <li className="hover:text-white transition-colors">Business Administration</li>
          </ul>
        </div>

        {/* Column 4: Campus Contact & Support */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>CAMPUS CONTACT & SUPPORT</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="shrink-0 text-slate-400">🏢</span>
              <span>Metropolitan University, Bateshwar, Akhaliya, Sylhet-3103, Bangladesh.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="shrink-0 text-slate-400">✉️</span>
              <a href="mailto:support@metrouni.edu.bd" className="text-cyan-400 hover:underline">
                support@metrouni.edu.bd
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
