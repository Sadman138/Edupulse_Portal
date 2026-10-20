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
import { AdminWeek6DatabaseStudio } from './pages/admin/AdminWeek6DatabaseStudio';
import { UnauthorizedAccessScreen } from './components/common/UnauthorizedAccessScreen';
import { PendingApprovalScreen } from './components/auth/PendingApprovalScreen';

export const App: React.FC = () => {
  const { isAuthenticated, pendingApprovalUser, activeTab, currentUser, isTabAllowedForRole } = useApp();

  if (pendingApprovalUser) {
    return <PendingApprovalScreen />;
  }

  if (!isAuthenticated) {
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
      case 'syllabus-tracker':
        return <WeeklySyllabusTracker />;

      // Teacher
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'teacher-routine':
        return <WeeklySyllabusTracker />;
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
      case 'admin-database':
      case 'admin-week6-db':
        return <AdminWeek6DatabaseStudio />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {isAllowed ? renderActiveView() : <UnauthorizedAccessScreen attemptedTab={activeTab} />}
        </main>
      </div>
      <Footer />

      {/* Global Modals */}
      <ThemeCustomizerModal />
      <SwitchAccountModal />
      <PDFDocumentModal />
    </div>
  );
};

export default App;
