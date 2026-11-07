/**
 * EduPulse MongoDB Seed Data Script
 * Migrates and seeds the 17 Week 6 Normalized Relational Schemas into MongoDB Atlas
 * Uses genuine bcrypt password hashing for all demo accounts
 * Department of Computer Science & Engineering, Metropolitan University
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

import bcrypt from 'bcryptjs';
import connectDB, { disconnectDB, isDbConnected } from '../config/db';
import {
  Department,
  Semester,
  User,
  Student,
  Teacher,
  Course,
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

export async function seedDatabase(): Promise<boolean> {
  console.log('[EduPulse Seed] Initializing MongoDB migration and seed data...');

  // 1. Ensure database is connected (reuses shared connection)
  if (!isDbConnected()) {
    const connected = await connectDB();
    if (!connected) {
      console.warn('[EduPulse Seed Warning] Skipping database seed: MongoDB is not connected.');
      return false;
    }
  }

  try {
    // 2. Check if database is already populated to preserve existing accounts & records
    const existingUsers = await User.countDocuments();
    if (existingUsers >= 3) {
      console.log(`[EduPulse Seed] Database already initialized with ${existingUsers} users. Preserving existing accounts, passwords and collections.`);
      return true;
    }

    // 1. Departments Seed
    const departments = [
      {
        deptId: 'dept-1',
        code: 'CSE',
        name: 'Computer Science & Engineering',
        chairPerson: 'Prof. Dr. Tariqul Islam',
        establishedYear: 2003,
        email: 'cse@metrouni.edu.bd',
        facultyCount: 28,
        studentCount: 620
      },
      {
        deptId: 'dept-2',
        code: 'EEE',
        name: 'Electrical & Electronic Engineering',
        chairPerson: 'Dr. Mahbubur Rahman',
        establishedYear: 2005,
        email: 'eee@metrouni.edu.bd',
        facultyCount: 18,
        studentCount: 340
      },
      {
        deptId: 'dept-3',
        code: 'BBA',
        name: 'Business Administration',
        chairPerson: 'Prof. Dr. Nazmul Huda',
        establishedYear: 2003,
        email: 'bba@metrouni.edu.bd',
        facultyCount: 22,
        studentCount: 510
      }
    ];

    for (const d of departments) {
      await Department.findOneAndUpdate({ deptId: d.deptId }, d, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Departments seeded (3)');

    // 2. Semesters Seed
    const semesters = [
      {
        semesterId: 'sem-1',
        name: 'Spring 2026',
        sessionCode: 'SP-2026',
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-05-30'),
        isActive: true,
        maxCredits: 15.0,
        enrollmentDeadline: new Date('2026-01-25')
      },
      {
        semesterId: 'sem-2',
        name: 'Summer 2026',
        sessionCode: 'SU-2026',
        startDate: new Date('2026-06-15'),
        endDate: new Date('2026-10-15'),
        isActive: false,
        maxCredits: 12.0,
        enrollmentDeadline: new Date('2026-06-25')
      },
      {
        semesterId: 'sem-3',
        name: 'Autumn 2025',
        sessionCode: 'AU-2025',
        startDate: new Date('2025-08-10'),
        endDate: new Date('2025-12-20'),
        isActive: false,
        maxCredits: 15.0,
        enrollmentDeadline: new Date('2025-08-20')
      }
    ];

    for (const s of semesters) {
      await Semester.findOneAndUpdate({ semesterId: s.semesterId }, s, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Semesters seeded (3)');

    // 3. Users Seed (Bcrypt hashed passwords)
    const saltRounds = 10;
    const studentPassHash = await bcrypt.hash('student123', saltRounds);
    const teacherPassHash = await bcrypt.hash('teacher123', saltRounds);
    const adminPassHash = await bcrypt.hash('admin123', saltRounds);

    const users = [
      {
        userId: 'usr-student-1',
        email: 'student@metrouni.edu.bd',
        passwordHash: studentPassHash,
        role: 'STUDENT' as const,
        status: 'APPROVED' as const,
        authProvider: 'EMAIL' as const,
        isEmailVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
      },
      {
        userId: 'usr-teacher-1',
        email: 'teacher@metrouni.edu.bd',
        passwordHash: teacherPassHash,
        role: 'TEACHER' as const,
        status: 'APPROVED' as const,
        authProvider: 'EMAIL' as const,
        isEmailVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
      },
      {
        userId: 'usr-admin-1',
        email: 'admin@metrouni.edu.bd',
        passwordHash: adminPassHash,
        role: 'ADMIN' as const,
        status: 'APPROVED' as const,
        authProvider: 'EMAIL' as const,
        isEmailVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'
      },
      {
        userId: 'usr-pending-1',
        email: 'tanvir.cse@gmail.com',
        passwordHash: studentPassHash,
        role: 'STUDENT' as const,
        status: 'PENDING' as const,
        authProvider: 'GOOGLE' as const,
        isEmailVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120'
      }
    ];

    for (const u of users) {
      await User.findOneAndUpdate({ userId: u.userId }, u, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Users seeded (4 with bcrypt hashes)');

    // 4. Students Seed
    const students = [
      {
        studentId: 'stu-1',
        userId: 'usr-student-1',
        rollNumber: '241-115-211',
        fullName: 'Fathin Sadman',
        departmentId: 'dept-1',
        batch: '60th Batch',
        currentSemesterId: 'sem-1',
        cgpa: 3.78,
        overallAttendance: 86.5,
        riskLevel: 'SAFE' as const,
        phone: '+880 1711-000211',
        advisorName: 'Dr. Fahim Ahmed',
        status: 'Active' as const,
        admissionDate: new Date('2024-01-15')
      }
    ];

    for (const st of students) {
      await Student.findOneAndUpdate({ studentId: st.studentId }, st, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Students seeded (1)');

    // 5. Teachers Seed
    const teachers = [
      {
        teacherId: 'tea-1',
        userId: 'usr-teacher-1',
        employeeId: 'FAC-CSE-042',
        fullName: 'Dr. Fahim Ahmed',
        designation: 'Assistant Professor' as const,
        departmentId: 'dept-1',
        roomNumber: 'Lab 402',
        phone: '+880 1712-000042',
        status: 'Active' as const,
        joinedDate: new Date('2019-08-01')
      }
    ];

    for (const t of teachers) {
      await Teacher.findOneAndUpdate({ teacherId: t.teacherId }, t, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Teachers seeded (1)');

    // 6. Courses Seed
    const courses = [
      {
        courseId: 'crs-1',
        code: 'CSE311',
        title: 'Database Management Systems',
        credits: 3.0,
        departmentId: 'dept-1',
        type: 'Theory' as const,
        description: 'Relational database architecture, SQL, 3NF normalization, and transaction control.'
      },
      {
        courseId: 'crs-2',
        code: 'CSE312',
        title: 'Database Management Systems Lab',
        credits: 1.5,
        departmentId: 'dept-1',
        type: 'Lab' as const,
        description: 'MySQL workbench, schema scripting, stored procedures, and triggers.'
      },
      {
        courseId: 'crs-3',
        code: 'CSE321',
        title: 'Software Engineering & Design',
        credits: 3.0,
        departmentId: 'dept-1',
        type: 'Theory' as const,
        description: 'Software lifecycle models, agile sprints, UML architecture, and testing.'
      }
    ];

    for (const c of courses) {
      await Course.findOneAndUpdate({ courseId: c.courseId }, c, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Courses seeded (3)');

    // 7. Course Allocations Seed
    const allocations = [
      {
        allocationId: 'alc-1',
        courseId: 'crs-1',
        teacherId: 'tea-1',
        semesterId: 'sem-1',
        section: 'A',
        dayOfWeek: 'Sunday' as const,
        timeSlot: '09:00 AM - 10:30 AM',
        roomNumber: 'Room 304 (Academic Bldg 1)',
        maxCapacity: 50
      },
      {
        allocationId: 'alc-2',
        courseId: 'crs-2',
        teacherId: 'tea-1',
        semesterId: 'sem-1',
        section: 'A',
        dayOfWeek: 'Tuesday' as const,
        timeSlot: '11:00 AM - 01:00 PM',
        roomNumber: 'Computer Software Lab 3',
        maxCapacity: 40
      }
    ];

    for (const a of allocations) {
      await CourseAllocation.findOneAndUpdate({ allocationId: a.allocationId }, a, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Course Allocations seeded (2)');

    // 8. Course Enrollments Seed
    const enrollments = [
      {
        enrollmentId: 'enr-1',
        studentId: 'stu-1',
        allocationId: 'alc-1',
        semesterId: 'sem-1',
        enrollmentStatus: 'ENROLLED' as const,
        enrolledAt: new Date('2026-01-15')
      },
      {
        enrollmentId: 'enr-2',
        studentId: 'stu-1',
        allocationId: 'alc-2',
        semesterId: 'sem-1',
        enrollmentStatus: 'ENROLLED' as const,
        enrolledAt: new Date('2026-01-15')
      }
    ];

    for (const e of enrollments) {
      await CourseEnrollment.findOneAndUpdate({ enrollmentId: e.enrollmentId }, e, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Course Enrollments seeded (2)');

    // 9. QR Attendance Sessions Seed
    const qrSessions = [
      {
        sessionId: 'qrs-1',
        allocationId: 'alc-1',
        sessionDate: new Date('2026-10-18'),
        startTime: '09:05:00',
        durationSeconds: 60,
        sessionPin: '849201',
        qrTokenHash: 'token_hash_a849201f92e',
        isActive: true
      }
    ];

    for (const q of qrSessions) {
      await QRAttendanceSession.findOneAndUpdate({ sessionId: q.sessionId }, q, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] QR Attendance Sessions seeded (1)');

    // 10. Attendance Logs Seed
    const attendanceLogs = [
      {
        logId: 'att-1',
        enrollmentId: 'enr-1',
        sessionId: 'qrs-1',
        date: new Date('2026-10-18'),
        timeSlot: '09:00 AM - 10:30 AM',
        status: 'PRESENT' as const,
        verifiedVia: 'DYNAMIC_QR' as const,
        tokenUsed: '849201'
      }
    ];

    for (const al of attendanceLogs) {
      await AttendanceLog.findOneAndUpdate({ logId: al.logId }, al, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Attendance Logs seeded (1)');

    // 11. Course Evaluations Seed
    const evaluations = [
      {
        evalId: 'eval-1',
        enrollmentId: 'enr-1',
        quiz1: 18.0,
        quiz2: 19.0,
        midterm: 26.5,
        assignment: 9.5,
        finalExam: 35.0,
        totalMarks: 98.0,
        letterGrade: 'A+',
        gpa: 4.0,
        evaluatedBy: 'tea-1'
      }
    ];

    for (const ev of evaluations) {
      await CourseEvaluation.findOneAndUpdate({ evalId: ev.evalId }, ev, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Course Evaluations seeded (1)');

    // 12 & 13. Previous Results (with embedded Courses breakdown)
    const previousResults = [
      {
        submissionId: 'prev-1',
        studentId: 'stu-1',
        semesterName: 'Autumn 2025',
        completedCredits: 15.0,
        sgpa: 3.82,
        resultType: 'Regular' as const,
        documentName: 'Autumn_2025_GradeSheet_211.pdf',
        documentUrl: 'https://metrouni.edu.bd/academic/gradesheets/autumn2025_211.pdf',
        status: 'VERIFIED' as const,
        verifiedBy: 'tea-1',
        verificationDate: new Date('2026-01-20'),
        remarks: 'Official transcripts verified against MU Registrar archives.',
        courses: [
          {
            courseCode: 'CSE221',
            courseTitle: 'Data Structures & Algorithms',
            credits: 3.0,
            obtainedGrade: 'A+',
            obtainedGpa: 4.0
          },
          {
            courseCode: 'CSE222',
            courseTitle: 'Data Structures Lab',
            credits: 1.5,
            obtainedGrade: 'A',
            obtainedGpa: 3.75
          },
          {
            courseCode: 'MAT211',
            courseTitle: 'Linear Algebra & Numerical Analysis',
            credits: 3.0,
            obtainedGrade: 'A',
            obtainedGpa: 3.75
          }
        ]
      }
    ];

    for (const pr of previousResults) {
      await PreviousResult.findOneAndUpdate({ submissionId: pr.submissionId }, pr, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Previous Results seeded with embedded courses (1)');

    // 14. Notices Seed
    const notices = [
      {
        noticeId: 'not-1',
        title: 'Midterm Examination Schedule Announcement',
        category: 'Exam' as const,
        priority: 'URGENT' as const,
        content: 'The Spring 2026 Midterm Examinations commence on Nov 15. All students must bring valid digital ID and adhere to exam hall rules.',
        targetAudience: 'ALL' as const,
        departmentId: 'dept-1',
        authorId: 'usr-admin-1',
        attachmentName: 'Midterm_Routine_Spring2026.pdf',
        publishedAt: new Date()
      }
    ];

    for (const n of notices) {
      await Notice.findOneAndUpdate({ noticeId: n.noticeId }, n, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Notices seeded (1)');

    // 15. Assignments Seed
    const assignments = [
      {
        assignmentId: 'asg-1',
        allocationId: 'alc-1',
        title: 'ERD Normalization & SQL DDL Design',
        description: 'Model university schema in 3NF and provide executable SQL creation script with constraints.',
        assignedDate: new Date('2026-10-10'),
        dueDate: new Date('2026-10-25'),
        totalPoints: 10
      }
    ];

    for (const asg of assignments) {
      await Assignment.findOneAndUpdate({ assignmentId: asg.assignmentId }, asg, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Assignments seeded (1)');

    // 16. Assignment Submissions Seed
    const submissions = [
      {
        submissionId: 'sub-1',
        assignmentId: 'asg-1',
        studentId: 'stu-1',
        submittedFileName: 'CSE311_ERD_Fathin_211.pdf',
        fileUrl: 'https://metrouni.edu.bd/assignments/CSE311_ERD_Fathin_211.pdf',
        status: 'GRADED' as const,
        obtainedScore: 9.5,
        facultyFeedback: 'Excellent 3NF normalization breakdown and composite keys.',
        gradedBy: 'tea-1',
        submittedAt: new Date('2026-10-20'),
        gradedAt: new Date('2026-10-22')
      }
    ];

    for (const sub of submissions) {
      await AssignmentSubmission.findOneAndUpdate({ submissionId: sub.submissionId }, sub, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Assignment Submissions seeded (1)');

    // 17. Study Materials Seed
    const materials = [
      {
        materialId: 'mat-1',
        allocationId: 'alc-1',
        topic: 'Relational Algebra & Normalization 3NF',
        unitModule: 'Module 04',
        description: 'Comprehensive lecture deck detailing functional dependencies and BCNF.',
        fileType: 'PDF' as const,
        fileSizeKb: 4120,
        downloadUrl: 'https://metrouni.edu.bd/materials/CSE311_Mod04_Relational_Algebra.pdf',
        downloadCount: 142,
        uploadedBy: 'tea-1',
        uploadedAt: new Date()
      }
    ];

    for (const m of materials) {
      await StudyMaterial.findOneAndUpdate({ materialId: m.materialId }, m, { upsert: true, returnDocument: 'after' });
    }
    console.log('[EduPulse Seed] Study Materials seeded (1)');

    console.log('✅ [EduPulse Seed] All 17 collections successfully verified and synchronized with MongoDB Atlas!');
    return true;
  } catch (error: any) {
    console.error('[EduPulse Seed Error] Failed to complete database seeding:', error);
    return false;
  }
}

// Standalone CLI Execution Entry Point (e.g. npm run seed)
async function runSeedCli() {
  console.log('[EduPulse Seed CLI] Starting manual database initialization...');
  let exitCode = 0;
  try {
    const connected = await connectDB();
    if (!connected) {
      console.error('[EduPulse Seed CLI Error] Unable to connect to MongoDB Atlas. Please check MONGODB_URI and IP access list.');
      process.exit(1);
    }
    const success = await seedDatabase();
    if (success) {
      console.log('✅ [EduPulse Seed CLI] Database seeding completed successfully.');
    } else {
      console.warn('⚠️ [EduPulse Seed CLI] Database seeding finished with warnings.');
      exitCode = 1;
    }
  } catch (err: any) {
    console.error('[EduPulse Seed CLI Error] Unhandled seed exception:', err.message);
    exitCode = 1;
  } finally {
    await disconnectDB();
    process.exit(exitCode);
  }
}

if (process.argv[1] && process.argv[1].includes('seed')) {
  runSeedCli();
}
