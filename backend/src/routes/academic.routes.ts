/**
 * EduPulse Academic System API Routes (MongoDB + Mongoose)
 * Department of Computer Science & Engineering, Metropolitan University
 * Covers all 17 Relational Academic Modules + Early Warning Engine Integration
 */

import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticateToken, authorizeRoles } from '../middleware/rbac.middleware';
import {
  Department,
  Semester,
  Course,
  Student,
  Teacher,
  CourseAllocation,
  CourseEnrollment,
  QRAttendanceSession,
  AttendanceLog,
  CourseEvaluation,
  PreviousResult,
  Notice,
  Assignment,
  AssignmentSubmission,
  StudyMaterial
} from '../models';
import { computeCombinedRisk } from '../services/earlyWarning.service';
import { isDbConnected } from '../config/db';

const router = Router();

// Apply Authentication token verification to all Academic routes
router.use(authenticateToken);

// ---------------------------------------------------------------------
// 1. Departments API
// ---------------------------------------------------------------------
router.get('/departments', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 3,
        data: [
          { deptId: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering', chairPerson: 'Prof. Dr. Tariqul Islam', establishedYear: 2003, email: 'cse@metrouni.edu.bd', facultyCount: 28, studentCount: 620 },
          { deptId: 'dept-2', code: 'EEE', name: 'Electrical & Electronic Engineering', chairPerson: 'Dr. Mahbubur Rahman', establishedYear: 2005, email: 'eee@metrouni.edu.bd', facultyCount: 18, studentCount: 340 },
          { deptId: 'dept-3', code: 'BBA', name: 'Business Administration', chairPerson: 'Prof. Dr. Nazmul Huda', establishedYear: 2003, email: 'bba@metrouni.edu.bd', facultyCount: 22, studentCount: 510 }
        ]
      });
      return;
    }
    const departments = await Department.find().sort({ code: 1 });
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/departments', authorizeRoles('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dept = await Department.create({
      deptId: `dept_${Date.now()}`,
      ...req.body
    });
    res.status(201).json({ success: true, data: dept });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 2. Semesters API
// ---------------------------------------------------------------------
router.get('/semesters', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 3,
        data: [
          { semesterId: 'sem-1', name: 'Spring 2026', sessionCode: 'SP-2026', startDate: '2026-01-10', endDate: '2026-05-30', isActive: true, maxCredits: 15.0 },
          { semesterId: 'sem-2', name: 'Summer 2026', sessionCode: 'SU-2026', startDate: '2026-06-15', endDate: '2026-10-15', isActive: false, maxCredits: 12.0 },
          { semesterId: 'sem-3', name: 'Autumn 2025', sessionCode: 'AU-2025', startDate: '2025-08-10', endDate: '2025-12-20', isActive: false, maxCredits: 15.0 }
        ]
      });
      return;
    }
    const semesters = await Semester.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, count: semesters.length, data: semesters });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 3. Courses API (Catalog)
// ---------------------------------------------------------------------
router.get('/courses', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 3,
        data: [
          { courseId: 'crs-1', code: 'CSE311', title: 'Database Management Systems', credits: 3.0, departmentId: 'dept-1', type: 'Theory', description: 'Relational database architecture, SQL, 3NF normalization.' },
          { courseId: 'crs-2', code: 'CSE312', title: 'Database Systems Lab', credits: 1.5, departmentId: 'dept-1', type: 'Lab', description: 'Database schema scripting, queries and procedures.' },
          { courseId: 'crs-3', code: 'CSE321', title: 'Software Engineering & Design', credits: 3.0, departmentId: 'dept-1', type: 'Theory', description: 'Software lifecycle models and testing.' }
        ]
      });
      return;
    }
    const { departmentId, type } = req.query;
    const filter: any = {};
    if (departmentId) filter.departmentId = departmentId;
    if (type) filter.type = type;

    const courses = await Course.find(filter).sort({ code: 1 });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/courses', authorizeRoles('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const course = await Course.create({
      courseId: `crs_${Date.now()}`,
      ...req.body
    });
    res.status(201).json({ success: true, data: course });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 4. Students & Academic Registry
// ---------------------------------------------------------------------
router.get('/students', authorizeRoles('TEACHER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 5,
        data: [
          { studentId: '241-115-211', fullName: 'Fathin Sadman', rollNumber: '211', departmentId: 'CSE', batch: '60th Batch', currentSemester: '5th Semester', cgpa: 3.78, overallAttendance: 88.0, riskLevel: 'SAFE', email: 'student@metrouni.edu.bd', phone: '+880 1799-112233' },
          { studentId: '241-115-212', fullName: 'Tahsin Ahmed', rollNumber: '212', departmentId: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.91, overallAttendance: 92.0, riskLevel: 'SAFE', email: 'tahsin.ahmed@metrouni.edu.bd', phone: '+880 1788-223344' },
          { studentId: '241-115-213', fullName: 'Nusrat Jahan', rollNumber: '213', departmentId: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.85, overallAttendance: 72.0, riskLevel: 'WARNING', email: 'nusrat.jahan@metrouni.edu.bd', phone: '+880 1777-334455' },
          { studentId: '241-115-214', fullName: 'Shahriar Kabir', rollNumber: '214', departmentId: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 2.12, overallAttendance: 54.0, riskLevel: 'CRITICAL', email: 'shahriar.kabir@metrouni.edu.bd', phone: '+880 1766-445566' },
          { studentId: '241-115-215', fullName: 'Ayesha Siddiqua', rollNumber: '215', departmentId: 'CSE', batch: '59th Batch', currentSemester: '5th Semester', cgpa: 3.65, overallAttendance: 85.0, riskLevel: 'SAFE', email: 'ayesha.s@metrouni.edu.bd', phone: '+880 1755-556677' }
        ]
      });
      return;
    }
    const { departmentId, riskLevel, batch } = req.query;
    const filter: any = {};
    if (departmentId) filter.departmentId = departmentId;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (batch) filter.batch = batch;

    const students = await Student.find(filter).sort({ rollNumber: 1 });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 5. Teachers & Faculty Registry
// ---------------------------------------------------------------------
router.get('/teachers', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 4,
        data: [
          { teacherId: 'tch-1', employeeId: 'EMP-CSE-042', fullName: 'Dr. Tariqul Islam', designation: 'Associate Professor', departmentId: 'CSE', email: 'tariqul.cse@metrouni.edu.bd', phone: '+880 1712-345678' },
          { teacherId: 'tch-2', employeeId: 'EMP-CSE-055', fullName: 'Asst. Prof. Mahfuzur Rahman', designation: 'Assistant Professor', departmentId: 'CSE', email: 'mahfuz.cse@metrouni.edu.bd', phone: '+880 1711-223344' },
          { teacherId: 'tch-3', employeeId: 'EMP-CSE-061', fullName: 'Dr. Nazmul Huda', designation: 'Professor', departmentId: 'CSE', email: 'nazmul.cse@metrouni.edu.bd', phone: '+880 1718-998877' },
          { teacherId: 'tch-4', employeeId: 'EMP-CSE-078', fullName: 'Lecturer Sharmin Akter', designation: 'Lecturer', departmentId: 'CSE', email: 'sharmin.cse@metrouni.edu.bd', phone: '+880 1819-445566' }
        ]
      });
      return;
    }
    const teachers = await Teacher.find().sort({ fullName: 1 });
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 6. Course Allocations (Timetable & Teacher assignment)
// ---------------------------------------------------------------------
router.get('/allocations', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 3,
        data: [
          { allocationId: 'alc-1', courseId: 'crs-1', courseCode: 'CSE 311', courseTitle: 'Database Management Systems', teacherId: 'tch-1', instructorName: 'Dr. Tariqul Islam', semesterId: 'sem-1', section: 'A', dayOfWeek: 'Sunday/Wednesday', timeSlot: '09:00 AM - 10:30 AM', roomNumber: 'Room 402' },
          { allocationId: 'alc-2', courseId: 'crs-2', courseCode: 'CSE 312', courseTitle: 'Database Systems Lab', teacherId: 'tch-1', instructorName: 'Dr. Tariqul Islam', semesterId: 'sem-1', section: 'A1', dayOfWeek: 'Tuesday', timeSlot: '09:00 AM - 11:30 AM', roomNumber: 'Lab 302' },
          { allocationId: 'alc-3', courseId: 'crs-3', courseCode: 'CSE 313', courseTitle: 'Compiler Design', teacherId: 'tch-2', instructorName: 'Asst. Prof. Mahfuzur Rahman', semesterId: 'sem-1', section: 'A', dayOfWeek: 'Sunday/Tuesday', timeSlot: '11:00 AM - 12:30 PM', roomNumber: 'Lab 301' }
        ]
      });
      return;
    }
    const { teacherId, semesterId } = req.query;
    const filter: any = {};
    if (teacherId) filter.teacherId = teacherId;
    if (semesterId) filter.semesterId = semesterId;

    const allocations = await CourseAllocation.find(filter);
    res.status(200).json({ success: true, count: allocations.length, data: allocations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 7. Course Enrollments (Student course registration)
// ---------------------------------------------------------------------
router.get('/enrollments', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isDbConnected()) {
      res.status(200).json({
        success: true,
        count: 2,
        data: [
          { enrollmentId: 'enr-1', studentId: '241-115-211', allocationId: 'alc-1', semesterId: 'sem-1', attendancePercentage: 88.0, riskStatus: 'SAFE' },
          { enrollmentId: 'enr-2', studentId: '241-115-211', allocationId: 'alc-2', semesterId: 'sem-1', attendancePercentage: 92.0, riskStatus: 'SAFE' }
        ]
      });
      return;
    }
    const { studentId, allocationId, semesterId } = req.query;
    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (allocationId) filter.allocationId = allocationId;
    if (semesterId) filter.semesterId = semesterId;

    const enrollments = await CourseEnrollment.find(filter);
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 8. Dynamic QR Attendance Sessions
// ---------------------------------------------------------------------
router.post('/attendance/session/start', authorizeRoles('TEACHER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { allocationId, durationSeconds = 60 } = req.body;
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = `qr_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Deactivate previous active sessions for this allocation
    await QRAttendanceSession.updateMany({ allocationId, isActive: true }, { isActive: false });

    const session = await QRAttendanceSession.create({
      sessionId: `qrs_${Date.now()}`,
      allocationId,
      sessionDate: new Date(),
      startTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      durationSeconds,
      sessionPin: pin,
      qrTokenHash: tokenHash,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Dynamic QR attendance session started.',
      session
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/attendance/verify-qr', authorizeRoles('STUDENT', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enrollmentId, sessionId, tokenUsed } = req.body;

    const session = await QRAttendanceSession.findOne({ sessionId, isActive: true });
    if (!session) {
      res.status(400).json({ success: false, error: 'QR Session has expired or is invalid.' });
      return;
    }

    if (session.sessionPin !== tokenUsed && session.qrTokenHash !== tokenUsed) {
      res.status(400).json({ success: false, error: 'Invalid QR Attendance security token.' });
      return;
    }

    const log = await AttendanceLog.create({
      logId: `att_${Date.now()}`,
      enrollmentId,
      sessionId,
      date: new Date(),
      timeSlot: 'Regular Class',
      status: 'PRESENT',
      verifiedVia: 'DYNAMIC_QR',
      tokenUsed
    });

    res.status(201).json({
      success: true,
      message: 'Attendance successfully verified via Dynamic QR token.',
      data: log
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/attendance/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enrollmentId } = req.query;
    const filter: any = {};
    if (enrollmentId) filter.enrollmentId = enrollmentId;

    const logs = await AttendanceLog.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 9. Course Evaluation, Marks & Grading (Continuous Assessment)
// ---------------------------------------------------------------------
router.get('/evaluations', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enrollmentId } = req.query;
    const filter: any = {};
    if (enrollmentId) filter.enrollmentId = enrollmentId;

    const evals = await CourseEvaluation.find(filter);
    res.status(200).json({ success: true, count: evals.length, data: evals });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/evaluations/grade', authorizeRoles('TEACHER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enrollmentId, quiz1, quiz2, midterm, assignment, finalExam } = req.body;

    let evaluation = await CourseEvaluation.findOne({ enrollmentId });
    if (!evaluation) {
      evaluation = new CourseEvaluation({
        evalId: `eval_${Date.now()}`,
        enrollmentId
      });
    }

    if (quiz1 !== undefined) evaluation.quiz1 = quiz1;
    if (quiz2 !== undefined) evaluation.quiz2 = quiz2;
    if (midterm !== undefined) evaluation.midterm = midterm;
    if (assignment !== undefined) evaluation.assignment = assignment;
    if (finalExam !== undefined) evaluation.finalExam = finalExam;
    evaluation.evaluatedBy = req.user?.userId;

    await evaluation.save(); // triggers pre-save hook for auto totalMarks, letterGrade, and GPA

    res.status(200).json({
      success: true,
      message: 'Student marks and letter grade updated successfully.',
      data: evaluation
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 10. Previous Semester Results & Retakes
// ---------------------------------------------------------------------
router.get('/previous-results', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId, status } = req.query;
    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;

    const results = await PreviousResult.find(filter).sort({ submittedAt: -1 });
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/previous-results/:id/verify', authorizeRoles('TEACHER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status = 'VERIFIED', remarks } = req.body;

    const record = await PreviousResult.findOneAndUpdate(
      { submissionId: id },
      {
        status,
        remarks,
        verifiedBy: req.user?.userId,
        verificationDate: new Date()
      },
      { returnDocument: 'after' }
    );

    if (!record) {
      res.status(404).json({ success: false, error: 'Previous result submission not found.' });
      return;
    }

    res.status(200).json({ success: true, data: record });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 11. Notices & Announcements
// ---------------------------------------------------------------------
router.get('/notices', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notices = await Notice.find().sort({ publishedAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/notices', authorizeRoles('TEACHER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notice = await Notice.create({
      noticeId: `not_${Date.now()}`,
      authorId: req.user?.userId,
      ...req.body
    });
    res.status(201).json({ success: true, data: notice });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 12. Assignments & Submissions
// ---------------------------------------------------------------------
router.get('/assignments', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { allocationId } = req.query;
    const filter: any = {};
    if (allocationId) filter.allocationId = allocationId;

    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/assignments/submit', authorizeRoles('STUDENT', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { assignmentId, studentId, submittedFileName, fileUrl } = req.body;

    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignmentId, studentId },
      {
        submissionId: `sub_${Date.now()}`,
        assignmentId,
        studentId,
        submittedFileName,
        fileUrl,
        status: 'SUBMITTED',
        submittedAt: new Date()
      },
      { upsert: true, returnDocument: 'after' }
    );

    res.status(201).json({ success: true, data: submission });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 13. Study Materials
// ---------------------------------------------------------------------
router.get('/materials', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { allocationId } = req.query;
    const filter: any = {};
    if (allocationId) filter.allocationId = allocationId;

    const materials = await StudyMaterial.find(filter).sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 14. Early Warning Risk Assessment & Dashboard Summary
// ---------------------------------------------------------------------
router.get('/student/dashboard', authorizeRoles('STUDENT', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    let student = null;
    if (isDbConnected()) {
      student = await Student.findOne({
        $or: [{ userId: req.user?.userId }, { rollNumber: req.user?.studentId || '241-115-211' }]
      });
    }

    const attendance = student?.overallAttendance || 86.5;
    const cgpa = student?.cgpa || 3.78;
    const riskAssessment = computeCombinedRisk(attendance, cgpa);

    res.status(200).json({
      success: true,
      student: student || {
        fullName: req.user?.name || 'Fathin Sadman',
        rollNumber: req.user?.studentId || '241-115-211',
        departmentId: 'CSE',
        cgpa,
        overallAttendance: attendance
      },
      riskAssessment
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
