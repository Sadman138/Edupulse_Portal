/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ThemeColor, themeVars } from './theme/epTheme';
import { AuthScreen } from './components/auth/AuthScreen';
import { AuthModal } from './components/auth/AuthModal';
import { SwitchAccountModal } from './components/auth/SwitchAccountModal';

// Student Views (Weeks 1 to 4 Complete)
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAcademicPerformance } from './pages/student/StudentAcademicPerformance';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentQrScanner } from './pages/student/StudentQrScanner';
import { StudentPreviousResults } from './pages/student/StudentPreviousResults';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentStudyMaterials } from './pages/student/StudentStudyMaterials';
import { StudentNotices } from './pages/student/StudentNotices';
import { StudentCoCurricular } from './pages/student/StudentCoCurricular';
import { WeeklySyllabusTracker } from './pages/student/WeeklySyllabusTracker';
import { WeeklyMilestoneModal } from './components/common/WeeklyMilestoneModal';

import { PortalAccessGuard } from './components/auth/PortalAccessGuard';
import { ClassRoutineTracker } from './components/common/ClassRoutineTracker';
import { ThemeCustomizerModal } from './components/common/ThemeCustomizerModal';

const DOCK_KEY = 'edupulse-nav-dock';
const loadSavedDock = (): 'left' | 'top' | 'right' => {
  try {
    const saved = localStorage.getItem(DOCK_KEY);
    return saved === 'left' || saved === 'top' || saved === 'right' ? saved : 'left';
  } catch {
    return 'left';
  }
};

const MainLayout: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    activeNav,
    setActiveNav,
    isAuthenticated,
    isDarkMode,
    setIsDarkMode,
    themeColor,
    setThemeColor,
    customHex,
    setCustomHex
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDualView, setIsDualView] = useState(false);
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  const [dock, setDock] = useState<'left' | 'top' | 'right'>(loadSavedDock);

  // Global modals (rendered at root level to prevent CSS stacking bugs with header)
  const [switchAccountModalOpen, setSwitchAccountModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [weeklyMilestoneModalOpen, setWeeklyMilestoneModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DOCK_KEY, dock);
    } catch {
      /* storage handling */
    }
  }, [dock]);

  const handleNavigate = (path: string) => {
    setActiveNav(path);
  };

  const handleOpenAuthModal = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const renderActiveView = () => {
    // 1. Strict Role-Based Portal Verification Guard
    if (currentUser && currentUser.role !== currentRole) {
      return (
        <PortalAccessGuard
          requiredRole={currentUser.role}
          attemptedViewName={activeNav}
          onOpenSwitchAccount={() => setSwitchAccountModalOpen(true)}
        />
      );
    }

    if (currentRole === 'STUDENT') {
      switch (activeNav) {
        case 'dashboard':
          return (
            <StudentDashboard
              onNavigate={handleNavigate}
              isDarkMode={isDarkMode}
              themeColor={themeColor}
            />
          );
        case 'class-routine':
        case 'routine':
          return <ClassRoutineTracker onNavigate={handleNavigate} />;
        case 'performance':
        case 'student-academic-performance':
          return <StudentAcademicPerformance isDarkMode={isDarkMode} />;
        case 'attendance':
        case 'student-attendance':
          return <StudentAttendance isDarkMode={isDarkMode} />;
        case 'qr-scanner':
        case 'student-qr-scanner':
          return <StudentQrScanner isDarkMode={isDarkMode} themeColor={themeColor} />;
        case 'previous-results':
        case 'student-previous-results':
          return <StudentPreviousResults isDarkMode={isDarkMode} />;
        case 'assignments':
        case 'student-assignments':
          return <StudentAssignments isDarkMode={isDarkMode} themeColor={themeColor} />;
        case 'study-materials':
        case 'student-study-materials':
          return <StudentStudyMaterials isDarkMode={isDarkMode} />;
        case 'notices':
        case 'student-notices':
          return <StudentNotices isDarkMode={isDarkMode} />;
        case 'co-curricular':
        case 'student-co-curricular':
          return <StudentCoCurricular isDarkMode={isDarkMode} />;
        case 'weekly-progress':
        case 'syllabus':
        case 'milestones':
          return <WeeklySyllabusTracker onNavigate={handleNavigate} />;
        default:
          // If student tried to access teacher or admin route
          const teacherAdminRoutes = [
            'assessments',
            'qr-generator',
            'high-risk',
            'departments',
            'course-allocation',
            'system-settings',
            'academic-analytics',
            'teachers',
            'courses',
            'semesters',
            'students',
            'my-courses'
          ];
          if (teacherAdminRoutes.includes(activeNav)) {
            return (
              <PortalAccessGuard
                requiredRole="STUDENT"
                attemptedViewName={activeNav}
                onOpenSwitchAccount={() => setSwitchAccountModalOpen(true)}
              />
            );
          }
          return (
            <StudentDashboard
              onNavigate={handleNavigate}
              isDarkMode={isDarkMode}
              themeColor={themeColor}
            />
          );
      }
    }

    if (currentRole === 'TEACHER' || currentRole === 'ADMIN') {
      return (
        <div
          className={`max-w-xl mx-auto my-12 p-8 rounded-3xl border text-center space-y-4 shadow-xl ${
            isDarkMode
              ? 'bg-[#101726] border-[#1d273a] text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              WEEK 5 MILESTONE &bull; UPCOMING
            </span>
            <h2 className="text-xl font-bold mt-2">
              {currentRole === 'TEACHER' ? 'Faculty & Teacher Portal' : 'Dean & Admin Console'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              As per the 12-week course syllabus, Teacher and Admin consoles are scheduled for <strong>Week 5</strong> development. Weeks 1 to 4 deliver the complete <strong>Student Portal</strong>.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentRole('STUDENT')}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Return to Student Portal (Weeks 1-4 Complete)</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <StudentDashboard
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        themeColor={themeColor}
      />
    );
  };

  const customStyles = themeVars(isDarkMode, themeColor, customHex);

  return (
    <div
      style={customStyles}
      className={`min-h-screen ${
        isDarkMode ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      } flex flex-col font-sans transition-colors duration-200 relative`}
    >
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isDualView={isDualView}
        onToggleDualView={() => setIsDualView(!isDualView)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        themeColor={themeColor}
        onSelectColor={setThemeColor}
        customHex={customHex}
        onSelectCustomHex={setCustomHex}
        dock={dock}
        onDockChange={setDock}
        onOpenSwitchAccount={() => setSwitchAccountModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenThemeCustomizer={() => setThemeCustomizerOpen(true)}
        onOpenMilestoneModal={() => setWeeklyMilestoneModalOpen(true)}
      />

      {!isAuthenticated ? (
        <main className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#090d16]' : 'bg-[#f8fafc]'}`}>
          <AuthScreen />
        </main>
      ) : (
        /* Single Panel View */
        <div
          className={`flex-1 flex overflow-hidden ${
            dock === 'right' ? 'flex-row-reverse' : dock === 'top' ? 'flex-col' : 'flex-row'
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            dock={dock}
            themeColor={themeColor}
            isDarkMode={isDarkMode}
            customHex={customHex}
          />
          <main
            className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 transition-colors ${
              isDarkMode ? 'bg-[#090d16]' : 'bg-[#f8fafc]'
            }`}
          >
            <div className="max-w-7xl mx-auto space-y-6">
              {renderActiveView()}

              {/* University Portal Footer */}
              <Footer
                onNavigate={handleNavigate}
                onOpenMilestoneModal={() => setWeeklyMilestoneModalOpen(true)}
              />
            </div>
          </main>
        </div>
      )}

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={themeCustomizerOpen}
        onClose={() => setThemeCustomizerOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        themeColor={themeColor}
        onSelectColor={setThemeColor}
        customHex={customHex}
        onSelectCustomHex={setCustomHex}
      />

      {/* Root-Level Modals */}
      <SwitchAccountModal
        isOpen={switchAccountModalOpen}
        onClose={() => setSwitchAccountModalOpen(false)}
        onOpenLogin={() => handleOpenAuthModal('login')}
        onOpenRegister={() => handleOpenAuthModal('register')}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        initialRole={currentRole}
      />

      {/* Week 1 to Week 4 Syllabus Milestone Modal */}
      <WeeklyMilestoneModal
        isOpen={weeklyMilestoneModalOpen}
        onClose={() => setWeeklyMilestoneModalOpen(false)}
        onNavigateToTab={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
