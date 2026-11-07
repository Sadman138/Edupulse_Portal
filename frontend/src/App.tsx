import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { AuthScreen } from './components/auth/AuthScreen';
import { ThemeCustomizerModal } from './components/common/ThemeCustomizerModal';
import { SwitchAccountModal } from './components/auth/SwitchAccountModal';
import { PDFDocumentModal } from './components/common/PDFDocumentModal';

// Student Pages (Weeks 3-4)
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAcademicPerformance } from './pages/student/StudentAcademicPerformance';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentQrScanner } from './pages/student/StudentQrScanner';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentNotices } from './pages/student/StudentNotices';
import { StudentStudyMaterials } from './pages/student/StudentStudyMaterials';
import { StudentPreviousResults } from './pages/student/StudentPreviousResults';
import { StudentCoCurricular } from './pages/student/StudentCoCurricular';
import { WeeklySyllabusTracker } from './pages/student/WeeklySyllabusTracker';
import { ClassRoutineRoomFinder } from './pages/student/ClassRoutineRoomFinder';

// Teacher Pages (Week 5)
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherCourseDirectory } from './pages/teacher/TeacherCourseDirectory';
import { TeacherDynamicQrAttendance } from './pages/teacher/TeacherDynamicQrAttendance';
import { TeacherAssessmentEntry } from './pages/teacher/TeacherAssessmentEntry';
import { TeacherAssignmentDesk } from './pages/teacher/TeacherAssignmentDesk';
import { TeacherNoticePublishing } from './pages/teacher/TeacherNoticePublishing';
import { TeacherStudyMaterialUpload } from './pages/teacher/TeacherStudyMaterialUpload';
import { TeacherVerificationDesk } from './pages/teacher/TeacherVerificationDesk';
import { TeacherHighRiskAlertDesk } from './pages/teacher/TeacherHighRiskAlertDesk';

// Admin Pages (Week 5)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDepartmentsCrud } from './pages/admin/AdminDepartmentsCrud';
import { AdminSemestersCrud } from './pages/admin/AdminSemestersCrud';
import { AdminCoursesCrud } from './pages/admin/AdminCoursesCrud';
import { AdminInstructorsCrud } from './pages/admin/AdminInstructorsCrud';
import { AdminStudentsCrud } from './pages/admin/AdminStudentsCrud';
import { AdminCourseAllocation } from './pages/admin/AdminCourseAllocation';
import { AdminAccountApprovals } from './pages/admin/AdminAccountApprovals';
import { UnauthorizedAccessScreen } from './components/common/UnauthorizedAccessScreen';
import { PendingApprovalScreen } from './components/auth/PendingApprovalScreen';

export const App: React.FC = () => {
  const { isAuthenticated, authStatus, pendingApprovalUser, activeTab, currentUser, isTabAllowedForRole, theme } = useApp();

  if (authStatus === 'INITIALIZING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-white p-6">
        <div className="max-w-md w-full bg-[#0d1527]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 backdrop-blur-xl">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 animate-ping opacity-40"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-8 h-8 text-slate-950 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-white">EduPulse Academic Cloud</h2>
            <p className="text-xs text-cyan-400 font-medium">Department of Computer Science & Engineering</p>
            <p className="text-[11px] text-slate-400">Metropolitan University, Sylhet</p>
          </div>
          <div className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Restoring Authenticated Session...</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Validating JWT credentials and RBAC access policies...
          </p>
        </div>
      </div>
    );
  }

  if (pendingApprovalUser) {
    return <PendingApprovalScreen />;
  }

  if (!isAuthenticated || authStatus === 'UNAUTHENTICATED') {
    return <AuthScreen />;
  }

  const isAllowed = isTabAllowedForRole(activeTab, currentUser.role);

  const renderActiveView = () => {
    switch (activeTab) {
      // Student
      case 'dashboard':
        return <StudentDashboard />;
      case 'academic-performance':
        return <StudentAcademicPerformance />;
      case 'attendance':
        return <StudentAttendance />;
      case 'qr-scanner':
        return <StudentQrScanner />;
      case 'assignments':
        return <StudentAssignments />;
      case 'notices':
        return <StudentNotices />;
      case 'study-materials':
        return <StudentStudyMaterials />;
      case 'previous-results':
        return <StudentPreviousResults />;
      case 'co-curricular':
        return <StudentCoCurricular />;
      case 'class-routine':
        return <ClassRoutineRoomFinder />;
      case 'syllabus-tracker':
        return <WeeklySyllabusTracker />;

      // Teacher
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'teacher-routine':
        return <ClassRoutineRoomFinder />;
      case 'teacher-courses':
      case 'teacher-roster':
        return <TeacherCourseDirectory />;
      case 'teacher-manual-attendance':
      case 'teacher-qr':
        return <TeacherDynamicQrAttendance />;
      case 'teacher-assessments':
        return <TeacherAssessmentEntry />;
      case 'teacher-assignments':
        return <TeacherAssignmentDesk />;
      case 'teacher-notices':
        return <TeacherNoticePublishing />;
      case 'teacher-materials':
        return <TeacherStudyMaterialUpload />;
      case 'teacher-verifications':
        return <TeacherVerificationDesk />;
      case 'teacher-risk-desk':
        return <TeacherHighRiskAlertDesk />;

      // Admin
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-approvals':
        return <AdminAccountApprovals />;
      case 'admin-departments':
        return <AdminDepartmentsCrud />;
      case 'admin-semesters':
        return <AdminSemestersCrud />;
      case 'admin-courses':
        return <AdminCoursesCrud />;
      case 'admin-instructors':
        return <AdminInstructorsCrud />;
      case 'admin-students':
        return <AdminStudentsCrud />;
      case 'admin-allocations':
        return <AdminCourseAllocation />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: 'var(--ep-bg-body, #0b0f19)',
        color: 'var(--ep-text-primary, #f1f5f9)'
      }}
    >
      <Header />
      {theme.sidebarPosition === 'top' ? (
        <div className="flex-1 flex flex-col w-full min-w-0">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1720px] mx-auto w-full overflow-x-hidden">
            {isAllowed ? renderActiveView() : <UnauthorizedAccessScreen attemptedTab={activeTab} />}
          </main>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row w-full min-w-0">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1720px] mx-auto w-full overflow-x-hidden">
            {isAllowed ? renderActiveView() : <UnauthorizedAccessScreen attemptedTab={activeTab} />}
          </main>
        </div>
      )}
      <Footer />

      {/* Global Modals */}
      <ThemeCustomizerModal />
      <SwitchAccountModal />
      <PDFDocumentModal />
    </div>
  );
};

export default App;
