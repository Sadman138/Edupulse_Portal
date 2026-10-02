export const GRADE_SCALE: Record<string, number> = {
  'A+': 4.0,
  A: 3.75,
  'A-': 3.5,
  'B+': 3.25,
  B: 3.0,
  'B-': 2.75,
  'C+': 2.5,
  C: 2.25,
  D: 2.0,
  F: 0.0,
};

export interface StudentCourse {
  code: string;
  name: string;
  credit: number;
  quiz: [number, number];
  assignment: [number, number];
  held: number;
  present: number;
  final: [number, number] | null;
}

export const currentCourses: StudentCourse[] = [
  { code: 'CSE 301', name: 'Database Systems', credit: 3, quiz: [18, 20], assignment: [17, 20], held: 24, present: 21, final: [42, 50] },
  { code: 'CSE 303', name: 'Compiler Design', credit: 3, quiz: [12, 20], assignment: [14, 20], held: 25, present: 17, final: [28, 50] },
  { code: 'CSE 305', name: 'Software Engineering', credit: 3, quiz: [15, 20], assignment: [16, 20], held: 24, present: 18, final: [36, 50] },
  { code: 'CSE 307', name: 'Computer Networks', credit: 4, quiz: [19, 20], assignment: [18, 20], held: 26, present: 23, final: [44, 50] },
];

export interface AttendanceLogItem {
  date: string;
  code: string;
  status: 'present' | 'absent';
  time?: string;
  room?: string;
}

export const attendanceLog: AttendanceLogItem[] = [
  { date: '2026-10-01', code: 'CSE 303', status: 'absent', time: '10:30 AM', room: 'Room 203' },
  { date: '2026-09-30', code: 'CSE 301', status: 'present', time: '10:00 AM', room: 'Lab 302' },
  { date: '2026-09-29', code: 'CSE 307', status: 'present', time: '03:15 PM', room: 'Lab 101' },
  { date: '2026-09-29', code: 'CSE 305', status: 'present', time: '11:45 AM', room: 'Room 304' },
  { date: '2026-09-28', code: 'CSE 303', status: 'absent', time: '01:30 PM', room: 'Room 405' },
  { date: '2026-09-27', code: 'CSE 301', status: 'present', time: '10:00 AM', room: 'Lab 302' },
  { date: '2026-09-26', code: 'CSE 307', status: 'present', time: '03:15 PM', room: 'Lab 101' },
  { date: '2026-09-25', code: 'CSE 305', status: 'absent', time: '11:45 AM', room: 'Room 304' },
  { date: '2026-09-24', code: 'CSE 303', status: 'present', time: '01:30 PM', room: 'Room 405' },
  { date: '2026-09-23', code: 'CSE 301', status: 'present', time: '10:00 AM', room: 'Lab 302' },
  { date: '2026-09-22', code: 'CSE 307', status: 'present', time: '03:15 PM', room: 'Lab 101' },
  { date: '2026-09-21', code: 'CSE 303', status: 'absent', time: '01:30 PM', room: 'Room 405' },
];

export interface ResultCourse {
  code: string;
  credit: number;
  grade: string;
}

export interface PreviousSemesterResult {
  id: number;
  semester: string;
  status: 'verified' | 'pending' | 'rejected';
  sgpa?: number;
  creditsCompleted?: number;
  courses: ResultCourse[];
}

export const initialPreviousResults: PreviousSemesterResult[] = [
  {
    id: 1,
    semester: 'Semester 1 (Spring 2024)',
    status: 'verified',
    sgpa: 3.65,
    creditsCompleted: 18,
    courses: [
      { code: 'ENG 101', credit: 3, grade: 'A' },
      { code: 'MAT 101', credit: 3, grade: 'B+' },
      { code: 'CSE 111', credit: 3, grade: 'A' },
      { code: 'CSE 112', credit: 1.5, grade: 'A+' },
      { code: 'PHY 101', credit: 3, grade: 'B' }
    ]
  },
  {
    id: 2,
    semester: 'Semester 2 (Summer 2024)',
    status: 'verified',
    sgpa: 3.70,
    creditsCompleted: 19.5,
    courses: [
      { code: 'CSE 121', credit: 3, grade: 'A-' },
      { code: 'MAT 102', credit: 3, grade: 'B' },
      { code: 'CSE 122', credit: 1.5, grade: 'A' },
      { code: 'STA 101', credit: 3, grade: 'B+' }
    ]
  },
  {
    id: 3,
    semester: 'Semester 3 (Fall 2024)',
    status: 'verified',
    sgpa: 3.50,
    creditsCompleted: 18,
    courses: [
      { code: 'CSE 211', credit: 3, grade: 'A-' },
      { code: 'CSE 212', credit: 1.5, grade: 'A' },
      { code: 'MAT 201', credit: 3, grade: 'B-' }
    ]
  },
  {
    id: 4,
    semester: 'Semester 4 (Spring 2025)',
    status: 'verified',
    sgpa: 3.42,
    creditsCompleted: 20,
    courses: [
      { code: 'CSE 221', credit: 3, grade: 'B+' },
      { code: 'CSE 222', credit: 1.5, grade: 'A' },
      { code: 'CSE 223', credit: 3, grade: 'A-' }
    ]
  },
  {
    id: 5,
    semester: 'Semester 5 (Fall 2025)',
    status: 'verified',
    sgpa: 3.45,
    creditsCompleted: 18.5,
    courses: [
      { code: 'CSE 231', credit: 3, grade: 'B' },
      { code: 'CSE 232', credit: 1.5, grade: 'A+' },
      { code: 'MAT 301', credit: 3, grade: 'A-' }
    ]
  }
];

const SEVERITY = { GREEN: 0, YELLOW: 1, RED: 2 };

export const attendanceRisk = (rate: number): 'GREEN' | 'YELLOW' | 'RED' =>
  rate >= 75 ? 'GREEN' : rate >= 70 ? 'YELLOW' : 'RED';

export const marksRisk = (pct: number): 'GREEN' | 'YELLOW' | 'RED' =>
  pct >= 50 ? 'GREEN' : pct >= 40 ? 'YELLOW' : 'RED';

export const overallRisk = (rate: number, pct: number): 'GREEN' | 'YELLOW' | 'RED' => {
  const a = attendanceRisk(rate);
  const m = marksRisk(pct);
  return SEVERITY[a] >= SEVERITY[m] ? a : m;
};

export function courseStats(c: StudentCourse) {
  const rate = c.held > 0 ? (c.present / c.held) * 100 : 0;
  const attendanceMarks = (rate / 100) * 10;
  const parts = [c.quiz, c.assignment, c.final].filter(Boolean) as [number, number][];
  const got = parts.reduce((s, p) => s + p[0], 0) + attendanceMarks;
  const max = parts.reduce((s, p) => s + p[1], 0) + 10;
  const marksPct = max > 0 ? (got / max) * 100 : 0;
  return { rate, attendanceMarks, got, max, marksPct, risk: overallRisk(rate, marksPct) };
}

export const credits = (coursesList: ResultCourse[]): number =>
  coursesList.reduce((s, c) => s + Number(c.credit || 0), 0);

export function calcSgpa(coursesList: ResultCourse[]): number {
  const total = credits(coursesList);
  if (!total) return 0;
  return (
    coursesList.reduce((s, c) => s + (GRADE_SCALE[c.grade] ?? 0) * Number(c.credit || 0), 0) /
    total
  );
}

export function calcCgpa(results: PreviousSemesterResult[]): number | null {
  const verified = results.filter((r) => r.status === 'verified');
  const totalCredits = verified.reduce((s, r) => s + (r.creditsCompleted ?? credits(r.courses)), 0);
  if (!totalCredits) return null;
  return (
    verified.reduce((s, r) => s + (r.sgpa ?? calcSgpa(r.courses)) * (r.creditsCompleted ?? credits(r.courses)), 0) /
    totalCredits
  );
}

export interface StudyMaterialItem {
  id: number;
  code: string;
  title: string;
  type: string;
  teacher: string;
  date: string;
  size: string;
  url?: string;
}

export const studyMaterials: StudyMaterialItem[] = [
  {
    id: 1,
    code: 'CSE 301',
    title: 'Lecture 08: Relational Algebra & Normal Forms (1NF to BCNF)',
    type: 'PDF',
    teacher: 'Dr. Fahim Ahmed',
    date: 'Sep 28, 2026',
    size: '4.2 MB'
  },
  {
    id: 2,
    code: 'CSE 303',
    title: 'Lecture 06: LR(1) Parser Tables & Shift-Reduce Conflicts',
    type: 'PDF',
    teacher: 'Dr. Fahim Ahmed',
    date: 'Sep 27, 2026',
    size: '3.8 MB'
  },
  {
    id: 3,
    code: 'CSE 305',
    title: 'SRS Template IEEE 830 Standard & Architecture Case Studies',
    type: 'DOCX',
    teacher: 'Engr. Sarah Khan',
    date: 'Sep 24, 2026',
    size: '1.4 MB'
  },
  {
    id: 4,
    code: 'CSE 307',
    title: 'Cisco Packet Tracer Lab Guide - Multi-Switch VLANs',
    type: 'ZIP',
    teacher: 'Engr. Tanvir Ahmed',
    date: 'Sep 20, 2026',
    size: '8.6 MB'
  },
  {
    id: 5,
    code: 'MAT 301',
    title: 'Fourier Series & Numerical Transforms Exercise Set',
    type: 'PDF',
    teacher: 'Dr. Nusrat Jahan',
    date: 'Sep 18, 2026',
    size: '2.1 MB'
  }
];

export interface NoticeItem {
  id: number;
  title: string;
  type: 'GENERAL' | 'UNIVERSITY_HOLIDAY' | 'COURSE_SPECIFIC';
  course?: string;
  date: string;
  body: string;
}

export const notices: NoticeItem[] = [
  {
    id: 1,
    title: 'Mid-Term Examination Routine Published for Spring 2026',
    type: 'GENERAL',
    date: '2026-10-01',
    body: 'The Office of the Controller of Examinations has published the final mid-term examination schedule. Students are advised to verify their seating plans and resolve any advisory conflicts before October 10th.'
  },
  {
    id: 2,
    title: 'CSE 303: Compiler Design Special Makeup Lecture Announced',
    type: 'COURSE_SPECIFIC',
    course: 'CSE 303',
    date: '2026-09-30',
    body: 'A special supplementary review session for Syntax-Directed Translation and Intermediate Code Generation will be held in Room 405 on Saturday at 11:00 AM. Attendance is highly encouraged for students in warning standing.'
  },
  {
    id: 3,
    title: 'University Recess on the occasion of Autumn Festival',
    type: 'UNIVERSITY_HOLIDAY',
    date: '2026-09-25',
    body: 'Metropolitan University will remain closed from October 18th to October 21st on the occasion of the Autumn Recess. Academic and administrative classes will resume on Monday, October 22nd.'
  },
  {
    id: 4,
    title: 'CSE 301: Project Submission Deadline Extended by 48 Hours',
    type: 'COURSE_SPECIFIC',
    course: 'CSE 301',
    date: '2026-09-22',
    body: 'Following requests from student representatives, the submission portal for the Database Schema Design deliverable has been extended to Friday 11:59 PM. No further extensions will be granted.'
  }
];
