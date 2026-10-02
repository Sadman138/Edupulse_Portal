/**
 * PDF Generation Utility for EduPulse Platform
 * Generates official Metropolitan University PDF documents (Notices, Assignments, Transcripts, Study Materials)
 */

export interface PDFNoticeOptions {
  id: string;
  title: string;
  content: string;
  type: string;
  targetCourseCode?: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
}

export interface PDFAssignmentOptions {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  teacherName: string;
  dueDate: string;
  totalMarks: number;
  attachmentName?: string;
}

export interface PDFTranscriptOptions {
  studentName: string;
  studentIdNo: string;
  departmentName: string;
  currentSemester: string;
  cgpa: number;
  currentSgpa: number;
  totalCredits: number;
  courses: {
    courseCode: string;
    courseName: string;
    creditHours: number;
    grade: string;
    gradePoint: number;
    totalMarks: number;
  }[];
}

export interface PDFMaterialOptions {
  title: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  category: string;
  weekNumber: number;
  fileName: string;
  fileSize: string;
}

/**
 * Triggers a formatted print preview which allows direct "Save as PDF"
 * with crisp fonts, Metropolitan University header, tables and official seals.
 * Uses a hidden iframe to prevent popup blockers and respect iframe constraints.
 */
export const downloadHTMLDocument = (htmlContent: string, documentTitle: string) => {
  const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>${documentTitle}</title>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4;
        margin: 15mm 15mm;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1e293b;
        background: #ffffff;
        margin: 0;
        padding: 24px;
        line-height: 1.5;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .header-table {
        width: 100%;
        border-bottom: 2px solid #0284c7;
        padding-bottom: 12px;
        margin-bottom: 20px;
      }
      .univ-title {
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .dept-title {
        font-size: 13px;
        font-weight: 600;
        color: #0284c7;
        margin: 2px 0 0 0;
      }
      .doc-type {
        font-size: 12px;
        font-weight: 700;
        background: #f1f5f9;
        color: #475569;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 6px;
        text-transform: uppercase;
      }
      .content-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
      }
      table.data-table th {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        color: #334155;
        text-transform: uppercase;
      }
      table.data-table td {
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        font-size: 12px;
        color: #1e293b;
      }
      .footer-box {
        margin-top: 40px;
        border-top: 1px dashed #cbd5e1;
        padding-top: 16px;
        font-size: 11px;
        color: #64748b;
        display: flex;
        justify-content: space-between;
      }
      .signature-line {
        margin-top: 50px;
        border-top: 1px solid #94a3b8;
        width: 180px;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #475569;
      }
      @media print {
        .no-print { display: none !important; }
      }
    </style>
  </head>
  <body>
    <div class="no-print" style="margin-bottom: 20px; background: #e0f2fe; padding: 12px 16px; border-radius: 8px; border: 1px solid #bae6fd; display: flex; align-items: center; justify-content: space-between;">
      <span style="font-size: 13px; font-weight: 600; color: #0369a1;">
        Official Metropolitan University Document &bull; Press Ctrl+P or Cmd+P to Save as PDF
      </span>
      <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer;">
        Print / Save to PDF
      </button>
    </div>
    ${htmlContent}
  </body>
</html>`;

  // Direct file download
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = documentTitle.endsWith('.html') ? documentTitle : `${documentTitle}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printFormattedDocument = (htmlContent: string, documentTitle: string) => {
  const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>${documentTitle}</title>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4;
        margin: 15mm 15mm;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1e293b;
        background: #ffffff;
        margin: 0;
        padding: 24px;
        line-height: 1.5;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .header-table {
        width: 100%;
        border-bottom: 2px solid #0284c7;
        padding-bottom: 12px;
        margin-bottom: 20px;
      }
      .univ-title {
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .dept-title {
        font-size: 13px;
        font-weight: 600;
        color: #0284c7;
        margin: 2px 0 0 0;
      }
      .doc-type {
        font-size: 12px;
        font-weight: 700;
        background: #f1f5f9;
        color: #475569;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 6px;
        text-transform: uppercase;
      }
      .content-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
      }
      table.data-table th {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        color: #334155;
        text-transform: uppercase;
      }
      table.data-table td {
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        font-size: 12px;
        color: #1e293b;
      }
      .footer-box {
        margin-top: 40px;
        border-top: 1px dashed #cbd5e1;
        padding-top: 16px;
        font-size: 11px;
        color: #64748b;
        display: flex;
        justify-content: space-between;
      }
      .signature-line {
        margin-top: 50px;
        border-top: 1px solid #94a3b8;
        width: 180px;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #475569;
      }
      @media print {
        .no-print { display: none !important; }
      }
    </style>
  </head>
  <body>
    ${htmlContent}
  </body>
</html>`;

  // Method 1: Print directly via hidden iframe
  try {
    let iframe = document.getElementById('edupulse-print-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'edupulse-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe?.contentWindow?.focus();
          iframe?.contentWindow?.print();
        } catch {
          // If printing throws error, fallback to downloading file
          downloadHTMLDocument(htmlContent, documentTitle);
        }
      }, 350);
      return;
    }
  } catch {
    // fallback
  }

  // Method 2: Direct file download
  downloadHTMLDocument(htmlContent, documentTitle);
};

/**
 * Generates formatted HTML for a Notice document
 */
export const generateNoticeHTML = (notice: PDFNoticeOptions): string => {
  return `
    <table class="header-table">
      <tr>
        <td>
          <h1 class="univ-title">Metropolitan University</h1>
          <p class="dept-title">Department of Computer Science & Engineering &bull; Academic Circular</p>
          <span class="doc-type">${notice.type.replace('_', ' ')}</span>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 11px; color: #64748b;">Ref: MU/CSE/NOT/${notice.id.toUpperCase()}</div>
          <div style="font-size: 11px; color: #64748b; font-weight: 600; margin-top: 4px;">Date: ${notice.createdAt}</div>
        </td>
      </tr>
    </table>

    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; border-left: 4px solid #0284c7; padding-left: 10px;">
        ${notice.title}
      </h2>
      ${notice.targetCourseCode ? `<div style="font-size: 12px; font-weight: 700; color: #0284c7; margin-bottom: 12px;">Applicable to Course: ${notice.targetCourseCode}</div>` : ''}
    </div>

    <div class="content-box" style="font-size: 13px; line-height: 1.7; white-space: pre-line;">
      ${notice.content}
    </div>

    <div style="margin-top: 24px; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px; color: #475569;">
      <strong>Notice Directives:</strong> All enrolled students and concerned departmental faculty members are requested to take necessary actions in compliance with the above schedule.
    </div>

    <table style="width: 100%; margin-top: 60px;">
      <tr>
        <td style="vertical-align: bottom;">
          <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">
            DIGITALLY SIGNED &bull; METROPOLITAN UNIVERSITY EDUPULSE ENGINE<br/>
            VERIFICATION HASH: #${notice.id.toUpperCase()}
          </div>
        </td>
        <td style="text-align: right; vertical-align: bottom;">
          <div class="signature-line" style="margin-left: auto;">
            ${notice.createdByName}<br/>
            <span style="font-size: 10px; color: #64748b; font-weight: normal;">${notice.createdByRole}</span>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-box">
      <span>Metropolitan University Campus &bull; Akhaliya, Sylhet, Bangladesh</span>
      <span>EduPulse Academic Management Gateway</span>
    </div>
  `;
};

/**
 * Downloads a Notice as official PDF format
 */
export const downloadNoticePDF = (notice: PDFNoticeOptions) => {
  const html = generateNoticeHTML(notice);
  downloadHTMLDocument(html, `Notice_${notice.id}_${notice.title.slice(0, 25).replace(/\s+/g, '_')}.html`);
};

/**
 * Generates formatted HTML for an Assignment document
 */
export const generateAssignmentHTML = (asg: PDFAssignmentOptions): string => {
  return `
    <table class="header-table">
      <tr>
        <td>
          <h1 class="univ-title">Metropolitan University</h1>
          <p class="dept-title">Department of Computer Science & Engineering</p>
          <span class="doc-type">Continuous Assessment Specification</span>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 11px; color: #64748b;">Course Code: <strong>${asg.courseCode}</strong></div>
          <div style="font-size: 11px; color: #64748b;">${asg.courseName}</div>
          <div style="font-size: 11px; color: #dc2626; font-weight: 700; margin-top: 4px;">Deadline: ${asg.dueDate}</div>
        </td>
      </tr>
    </table>

    <div style="margin: 16px 0 24px 0;">
      <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">
        ${asg.title}
      </h2>
      <div style="font-size: 12px; color: #475569;">
        Course Instructor: <strong>${asg.teacherName}</strong> &bull; Total Allocated Marks: <strong>${asg.totalMarks} Marks</strong>
      </div>
    </div>

    <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Problem Statement & Requirements:</div>
    <div class="content-box" style="font-size: 13px; line-height: 1.7; white-space: pre-line;">
      ${asg.description}
    </div>

    <div style="margin-top: 20px;">
      <h4 style="font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; margin: 0 0 8px 0;">Submission Rubric & Guidelines:</h4>
      <table class="data-table">
        <thead>
          <tr>
            <th>Assessment Criteria</th>
            <th>Weightage</th>
            <th>Deliverable Format</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Grammar Analysis / Schema Implementation</td>
            <td>40% (8 Marks)</td>
            <td>Source Code (.cpp / .py / .sql)</td>
          </tr>
          <tr>
            <td>Unit Test Coverage & Execution Output</td>
            <td>30% (6 Marks)</td>
            <td>Console Logs & Execution Screenshots</td>
          </tr>
          <tr>
            <td>Technical Report & Architectural Sequence Diagrams</td>
            <td>30% (6 Marks)</td>
            <td>Document Specification (.pdf)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 10px 14px; border-radius: 6px; font-size: 11px; color: #92400e; margin-top: 16px;">
      <strong>Submission Instructions:</strong> Students must submit their final deliverable through the EduPulse Student Console before the cutoff deadline. Late submissions are subject to a 10% penalty per calendar day.
    </div>

    <div class="footer-box">
      <span>Metropolitan University &bull; School of Science & Technology</span>
      <span>EduPulse Assignment Desk</span>
    </div>
  `;
};

/**
 * Downloads an Assignment as official PDF problem statement
 */
export const downloadAssignmentPDF = (asg: PDFAssignmentOptions) => {
  const html = generateAssignmentHTML(asg);
  downloadHTMLDocument(html, `Assignment_${asg.courseCode.replace(/\s+/g, '_')}_${asg.title.slice(0, 25).replace(/\s+/g, '_')}.html`);
};

/**
 * Generates formatted HTML for Student Academic Performance / Transcript
 */
export const generateAcademicTranscriptHTML = (transcript: PDFTranscriptOptions): string => {
  const rows = transcript.courses
    .map(
      (c) => `
      <tr>
        <td style="font-family: monospace; font-weight: bold; color: #0284c7;">${c.courseCode}</td>
        <td><strong>${c.courseName}</strong></td>
        <td style="text-align: center;">${c.creditHours}</td>
        <td style="text-align: center; font-weight: bold;">${c.totalMarks}</td>
        <td style="text-align: center; font-weight: bold; color: ${c.grade.startsWith('A') ? '#16a34a' : '#0284c7'};">${c.grade}</td>
        <td style="text-align: center; font-family: monospace; font-weight: bold;">${c.gradePoint.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <table class="header-table">
      <tr>
        <td>
          <h1 class="univ-title">Metropolitan University</h1>
          <p class="dept-title">Office of the Controller of Examinations</p>
          <span class="doc-type">Official Semester Grade Sheet</span>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 11px; color: #64748b;">Academic Session: <strong>Spring 2026</strong></div>
          <div style="font-size: 11px; color: #64748b;">Issue Date: <strong>${new Date().toISOString().split('T')[0]}</strong></div>
        </td>
      </tr>
    </table>

    <table style="width: 100%; margin-bottom: 20px; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
      <tr>
        <td style="padding: 4px 8px;"><strong>Student Name:</strong> ${transcript.studentName}</td>
        <td style="padding: 4px 8px;"><strong>Student ID:</strong> <span style="font-family: monospace; color: #0284c7; font-weight: bold;">${transcript.studentIdNo}</span></td>
      </tr>
      <tr>
        <td style="padding: 4px 8px;"><strong>Department:</strong> ${transcript.departmentName}</td>
        <td style="padding: 4px 8px;"><strong>Semester:</strong> ${transcript.currentSemester}</td>
      </tr>
      <tr>
        <td style="padding: 4px 8px;"><strong>Cumulative Credits:</strong> ${transcript.totalCredits} Cr</td>
        <td style="padding: 4px 8px;"><strong>Current CGPA:</strong> <span style="font-size: 14px; font-weight: 800; color: #0284c7;">${transcript.cgpa.toFixed(2)}</span></td>
      </tr>
    </table>

    <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0;">
      Continuous Course Evaluation & Semester Grades
    </h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Title</th>
          <th style="text-align: center;">Credits</th>
          <th style="text-align: center;">Total Marks (100)</th>
          <th style="text-align: center;">Letter Grade</th>
          <th style="text-align: center;">Grade Point</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-top: 16px; font-size: 13px;">
      <div><strong>Semester SGPA:</strong> <span style="font-weight: 800; color: #0284c7; font-size: 15px;">${transcript.currentSgpa.toFixed(2)}</span></div>
      <div><strong>Cumulative CGPA (Semesters 1-6):</strong> <span style="font-weight: 800; color: #16a34a; font-size: 16px;">${transcript.cgpa.toFixed(2)}</span></div>
    </div>

    <table style="width: 100%; margin-top: 70px;">
      <tr>
        <td style="vertical-align: bottom;">
          <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">
            CERTIFIED BY CONTROLLER OF EXAMINATIONS<br/>
            DIGITAL VERIFICATION: SECURE-AUDIT-VALID
          </div>
        </td>
        <td style="text-align: right; vertical-align: bottom;">
          <div class="signature-line" style="margin-left: auto;">
            Dr. Fahim Ahmed<br/>
            <span style="font-size: 10px; color: #64748b; font-weight: normal;">Course Coordinator &bull; CSE</span>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-box">
      <span>Metropolitan University &bull; Official Academic Record</span>
      <span>This document is digitally certified by the EduPulse Central Registrar</span>
    </div>
  `;
};

/**
 * Downloads Official Student Academic Performance / Transcript PDF
 */
export const downloadAcademicTranscriptPDF = (transcript: PDFTranscriptOptions) => {
  const html = generateAcademicTranscriptHTML(transcript);
  downloadHTMLDocument(html, `Transcript_${transcript.studentIdNo}_${transcript.currentSemester.replace(/\s+/g, '_')}.html`);
};

/**
 * Downloads Study Material reference sheet as PDF
 */
export const downloadMaterialPDF = (mat: PDFMaterialOptions) => {
  const html = `
    <table class="header-table">
      <tr>
        <td>
          <h1 class="univ-title">Metropolitan University</h1>
          <p class="dept-title">Department of Computer Science & Engineering</p>
          <span class="doc-type">${mat.category.replace('_', ' ')}</span>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 11px; color: #64748b;">Course: <strong>${mat.courseCode}</strong></div>
          <div style="font-size: 11px; color: #64748b;">Week ${mat.weekNumber} Lecture Module</div>
        </td>
      </tr>
    </table>

    <div style="margin: 20px 0;">
      <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">
        ${mat.title}
      </h2>
      <div style="font-size: 12px; color: #475569;">
        Course Name: <strong>${mat.courseName}</strong> &bull; Uploaded by Faculty: <strong>${mat.teacherName}</strong>
      </div>
    </div>

    <div class="content-box">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0284c7;">Module Overview & Lecture Outlines:</h4>
      <p style="font-size: 12px; line-height: 1.6; color: #334155; margin: 0;">
        This document serves as the official lecture slide deck and laboratory syllabus handout for <strong>${mat.courseCode}: ${mat.courseName}</strong> (Week ${mat.weekNumber}). Students must review the reading materials and complete all self-study exercises before the next scheduled class.
      </p>
      <div style="margin-top: 12px; font-size: 11px; font-family: monospace; color: #64748b;">
        Attached File Asset: ${mat.fileName} (${mat.fileSize})
      </div>
    </div>

    <div class="footer-box">
      <span>Metropolitan University &bull; CSE Department</span>
      <span>EduPulse Study Material Library</span>
    </div>
  `;

  downloadHTMLDocument(html, `Material_${mat.courseCode}_Week${mat.weekNumber}_${mat.fileName.replace(/\.pdf$/i, '')}.html`);
};

export interface PDFGradeSheetOptions {
  courseCode: string;
  courseName: string;
  creditHours: number;
  semesterName: string;
  teacherName: string;
  departmentName: string;
  students: {
    studentIdNo: string;
    studentName: string;
    attendancePercent: number;
    attendanceMarks: number;
    ct1: number;
    ct2: number;
    ct3: number;
    bestCtAverage: number;
    assignmentMarks: number;
    continuousTotal: number;
    finalExamMarks: number;
    totalMarks: number;
    grade: string;
    gradePoint: number;
  }[];
}

/**
 * Generates formatted HTML for Official Continuous Assessment Tabulation / Grade Sheet
 */
export const generateGradeSheetHTML = (sheet: PDFGradeSheetOptions): string => {
  return `
    <table class="header-table">
      <tr>
        <td>
          <h1 class="univ-title">Metropolitan University</h1>
          <p class="dept-title">Department of ${sheet.departmentName || 'Computer Science & Engineering'}</p>
          <span class="doc-type">OFFICIAL TABULATION SHEET & FINAL GRADE REPORT</span>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 12px; color: #0f172a; font-weight: bold;">Course: ${sheet.courseCode}</div>
          <div style="font-size: 11px; color: #64748b;">${sheet.courseName} (${sheet.creditHours} Credits)</div>
          <div style="font-size: 11px; color: #64748b;">Semester: ${sheet.semesterName || 'Spring 2026'}</div>
          <div style="font-size: 11px; color: #64748b;">Course Instructor: <strong>${sheet.teacherName}</strong></div>
        </td>
      </tr>
    </table>

    <div style="margin: 14px 0 10px 0; font-size: 11px; color: #334155; line-height: 1.5; background: #f8fafc; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
      <strong>Grading Policy Note:</strong> Continuous Assessment includes Attendance (10%), Best 2 of 3 Class Tests (20%), Assignment (10%) = 40 Marks. Semester Final Examination accounts for 60 Marks (or normalized to 100 Marks). Minimum 75% attendance is required for Collegiate exam eligibility.
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Student Name</th>
          <th>Att %</th>
          <th>Att (10)</th>
          <th>CT1</th>
          <th>CT2</th>
          <th>CT3</th>
          <th>Best 2 CT</th>
          <th>Assign</th>
          <th>Continuous</th>
          <th>Final Exam</th>
          <th>Total</th>
          <th>Grade</th>
          <th>GP</th>
        </tr>
      </thead>
      <tbody>
        ${sheet.students
          .map(
            (s) => `
          <tr>
            <td style="font-family: monospace; font-weight: bold;">${s.studentIdNo}</td>
            <td>${s.studentName}</td>
            <td style="${s.attendancePercent < 70 ? 'color: #dc2626; font-weight: bold;' : ''}">${s.attendancePercent}%</td>
            <td>${s.attendanceMarks}</td>
            <td>${s.ct1}</td>
            <td>${s.ct2}</td>
            <td>${s.ct3}</td>
            <td style="font-weight: bold; color: #0284c7;">${s.bestCtAverage}</td>
            <td>${s.assignmentMarks}</td>
            <td style="font-weight: bold;">${s.continuousTotal}</td>
            <td>${s.finalExamMarks}</td>
            <td style="font-weight: 800; font-size: 12px;">${s.totalMarks}</td>
            <td style="font-weight: 800; color: ${s.grade === 'A+' ? '#16a34a' : s.grade === 'A' ? '#0284c7' : s.grade === 'B' ? '#d97706' : '#dc2626'};">${s.grade}</td>
            <td style="font-weight: bold;">${s.gradePoint.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <table style="width: 100%; margin-top: 50px; font-size: 11px; text-align: center; color: #475569;">
      <tr>
        <td style="border-top: 1px dashed #94a3b8; padding-top: 6px; width: 30%;">
          <strong>${sheet.teacherName}</strong><br/>
          Course Instructor
        </td>
        <td style="width: 5%;"></td>
        <td style="border-top: 1px dashed #94a3b8; padding-top: 6px; width: 30%;">
          <strong>Prof. Dr. Mekdad Ajmol</strong><br/>
          Head of Department, CSE
        </td>
        <td style="width: 5%;"></td>
        <td style="border-top: 1px dashed #94a3b8; padding-top: 6px; width: 30%;">
          <strong>Controller of Examinations</strong><br/>
          Metropolitan University
        </td>
      </tr>
    </table>

    <div class="footer-box">
      <span>Metropolitan University Examination System &bull; UGC Approved Standard Grading</span>
      <span>Official Record Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    </div>
  `;
};

/**
 * Downloads Official Tabulation Sheet / Grade Report as PDF
 */
export const downloadGradeSheetPDF = (sheet: PDFGradeSheetOptions) => {
  const html = generateGradeSheetHTML(sheet);
  printFormattedDocument(html, `GradeSheet_${sheet.courseCode}_Final.pdf`);
};
