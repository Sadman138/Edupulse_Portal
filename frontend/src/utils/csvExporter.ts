/**
 * CSV Helper Utilities for EduPulse Academic Administration
 */

export const exportToCSV = (filename: string, rows: (string | number)[][]) => {
  const csvContent = rows
    .map((row) =>
      row
        .map((val) => {
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadCSVTemplate = (templateType: 'STUDENT' | 'TEACHER' | 'COURSE_ALLOCATION') => {
  if (templateType === 'STUDENT') {
    const rows = [
      ['Name', 'StudentID', 'Email', 'Department', 'Batch', 'Semester', 'Section', 'Courses'],
      ['Samiul Islam', '241-115-225', 'samiul.islam@metrouni.edu.bd', 'CSE', '58th Batch', '6th Semester', 'Section A', 'CSE 301;CSE 303;CSE 305'],
      ['Tahsin Ahmed', '241-115-226', 'tahsin.ahmed@metrouni.edu.bd', 'CSE', '58th Batch', '6th Semester', 'Section B', 'CSE 301;CSE 305'],
      ['Farhana Akter', '242-115-310', 'farhana.akter@metrouni.edu.bd', 'CSE', '59th Batch', '5th Semester', 'Section A', 'CSE 301;CSE 307'],
      ['Zubaer Mahmud', '241-116-112', 'zubaer.eee@metrouni.edu.bd', 'EEE', '58th Batch', '6th Semester', 'Section A', 'EEE 211']
    ];
    exportToCSV('edupulse_students_import_template.csv', rows);
  } else if (templateType === 'TEACHER') {
    const rows = [
      ['Name', 'TeacherID', 'Email', 'Department', 'Designation', 'AssignedCourses'],
      ['Dr. Mahbubul Alam', 'FAC-CSE-077', 'mahbub.alam@metrouni.edu.bd', 'CSE', 'Assistant Professor', 'CSE 301;CSE 303'],
      ['Engr. Farzana Yasmin', 'FAC-CSE-088', 'farzana.cse@metrouni.edu.bd', 'CSE', 'Lecturer', 'CSE 305'],
      ['Dr. Shafiqul Islam', 'FAC-EEE-025', 'shafiqul.eee@metrouni.edu.bd', 'EEE', 'Associate Professor', 'EEE 211']
    ];
    exportToCSV('edupulse_faculty_import_template.csv', rows);
  } else {
    const rows = [
      ['CourseCode', 'CourseName', 'TeacherName', 'Department', 'Batch', 'Section', 'EnrolledCount', 'Room', 'ScheduleTime'],
      ['CSE 301', 'Database Systems', 'Dr. Fahim Ahmed', 'CSE', '58th Batch', 'Section A', '38', 'Lab 302', '10:00 AM - 11:30 AM'],
      ['CSE 303', 'Compiler Design', 'Dr. Fahim Ahmed', 'CSE', '58th Batch', 'Section A', '32', 'Room 405', '01:30 PM - 03:00 PM'],
      ['CSE 305', 'Software Engineering', 'Engr. Raiyan Chowdhury', 'CSE', '58th Batch', 'Section B', '40', 'Room 304', '11:45 AM - 01:15 PM']
    ];
    exportToCSV('edupulse_course_allocation_template.csv', rows);
  }
};
