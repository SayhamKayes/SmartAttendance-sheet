import * as XLSX from 'xlsx';
import { Student, AttendanceSession } from '../types/attendance';

export const excelSyncService = {
  /**
   * Export comprehensive Attendance Data to Excel (.xlsx) file
   */
  exportAttendanceToExcel: (
    students: Student[],
    sessions: AttendanceSession[],
    fileNamePrefix: string = 'Class_Attendance_Report'
  ) => {
    const workbook = XLSX.utils.book_new();

    // 1. Sheet 1: Master Attendance Matrix (Rows = Students, Columns = Dates)
    // Collect all distinct dates sorted
    const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    const dates = sortedSessions.map(s => s.date);
    const uniqueDates = Array.from(new Set(dates));

    const matrixRows = students.map(student => {
      const row: Record<string, string | number> = {
        'Roll': student.roll,
        'Name': student.name,
        'Department': student.department,
        'Batch': student.batch,
        'Section': student.section,
        'Course': student.course || 'All'
      };

      let presentCount = 0;
      let totalEnrolledDays = 0;

      uniqueDates.forEach(date => {
        // Find if there was a session on this date for this student
        const daySession = sortedSessions.find(
          s => s.date === date && 
          (s.department === student.department || !s.department) &&
          (s.section === student.section || !s.section)
        );

        if (daySession) {
          const rec = daySession.records.find(r => r.studentId === student.id || r.studentRoll === student.roll);
          if (rec) {
            totalEnrolledDays++;
            let code = '-';
            if (rec.status === 'present') {
              code = 'P';
              presentCount++;
            } else if (rec.status === 'absent') {
              code = 'A';
            } else if (rec.status === 'late') {
              code = 'L';
              presentCount += 0.5; // partial credit
            } else if (rec.status === 'excused') {
              code = 'E';
              presentCount++;
            }
            row[date] = code;
          } else {
            row[date] = '-';
          }
        } else {
          row[date] = 'N/A';
        }
      });

      const percentage = totalEnrolledDays > 0 ? Math.round((presentCount / totalEnrolledDays) * 100) : 0;
      row['Total Present'] = presentCount;
      row['Total Classes'] = totalEnrolledDays;
      row['Attendance %'] = `${percentage}%`;

      return row;
    });

    const matrixSheet = XLSX.utils.json_to_sheet(matrixRows);
    XLSX.utils.book_append_sheet(workbook, matrixSheet, 'Attendance Matrix');

    // 2. Sheet 2: Detailed Session Logs
    const detailedLogs: Record<string, string | number>[] = [];
    sortedSessions.forEach(session => {
      session.records.forEach(record => {
        detailedLogs.push({
          'Date': session.date,
          'Department': session.department,
          'Course Code': session.course,
          'Course Name': session.courseName || '',
          'Batch': session.batch,
          'Section': session.section,
          'Teacher': session.teacherName || 'Assigned Faculty',
          'Student Roll': record.studentRoll,
          'Student Name': record.studentName,
          'Status': record.status.toUpperCase(),
          'Remarks': record.remarks || '',
          'Recorded Timestamp': session.timestamp
        });
      });
    });

    const detailedSheet = XLSX.utils.json_to_sheet(detailedLogs);
    XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Session Logs');

    // 3. Sheet 3: Student Master Database
    const studentList = students.map(s => ({
      'Roll': s.roll,
      'Name': s.name,
      'Department': s.department,
      'Batch': s.batch,
      'Section': s.section,
      'Course': s.course || '',
      'Email': s.email || '',
      'Phone': s.phone || ''
    }));
    const studentSheet = XLSX.utils.json_to_sheet(studentList);
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students');

    // Export file
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${fileNamePrefix}_${dateStr}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },

  /**
   * Export single session to Excel or CSV
   */
  exportSingleSession: (session: AttendanceSession) => {
    const workbook = XLSX.utils.book_new();
    const rows = session.records.map((r, index) => ({
      'SL': index + 1,
      'Roll': r.studentRoll,
      'Name': r.studentName,
      'Status': r.status.toUpperCase(),
      'Remarks': r.remarks || '',
      'Date': session.date,
      'Course': session.course,
      'Batch': session.batch,
      'Section': session.section,
      'Teacher': session.teacherName || 'Faculty'
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Session Attendance');
    const filename = `Attendance_${session.course}_${session.section}_${session.date}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },

  /**
   * Generate downloadable sample template for bulk student import
   */
  downloadSampleImportTemplate: () => {
    const workbook = XLSX.utils.book_new();
    const sampleData = [
      {
        'Roll': 'CSE-52-101',
        'Name': 'Rakibul Hasan',
        'Department': 'Computer Science & Engineering',
        'Section': 'A',
        'Batch': '52nd Batch',
        'Course': 'CSE-305',
        'Email': 'rakibul@student.univ.edu',
        'Phone': '+880 1711-123456'
      },
      {
        'Roll': 'CSE-52-102',
        'Name': 'Nabila Tabassum',
        'Department': 'Computer Science & Engineering',
        'Section': 'A',
        'Batch': '52nd Batch',
        'Course': 'CSE-305',
        'Email': 'nabila@student.univ.edu',
        'Phone': '+880 1711-234567'
      },
      {
        'Roll': 'CSE-52-103',
        'Name': 'Shakil Mahmud',
        'Department': 'Computer Science & Engineering',
        'Section': 'A',
        'Batch': '52nd Batch',
        'Course': 'CSE-305',
        'Email': 'shakil@student.univ.edu',
        'Phone': '+880 1711-345678'
      }
    ];

    const sheet = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Student_Import_Template');
    XLSX.writeFile(workbook, 'Student_Import_Template.xlsx');
  },

  /**
   * Parse uploaded Excel or CSV file into Student objects
   */
  parseStudentsFromFile: async (file: File): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!rawRows || rawRows.length === 0) {
            throw new Error('The uploaded sheet is empty.');
          }

          const parsedStudents: Student[] = [];

          rawRows.forEach((row, idx) => {
            // Find appropriate fields by case-insensitive checks
            const findVal = (keys: string[]) => {
              for (const k of Object.keys(row)) {
                const lower = k.toLowerCase().trim();
                if (keys.some(target => lower === target || lower.includes(target))) {
                  return String(row[k] ?? '').trim();
                }
              }
              return '';
            };

            const name = findVal(['name', 'student name', 'full name']);
            const roll = findVal(['roll', 'student roll', 'id', 'student id']);
            const department = findVal(['department', 'dept', 'dept.']) || 'Computer Science & Engineering';
            const section = findVal(['section', 'sec', 'sec.']) || 'A';
            const batch = findVal(['batch', 'year']) || 'Current Batch';
            const course = findVal(['course', 'course code', 'subject']) || '';
            const email = findVal(['email', 'mail', 'e-mail']) || '';
            const phone = findVal(['phone', 'mobile', 'contact']) || '';

            if (name || roll) {
              parsedStudents.push({
                id: `s-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
                name: name || `Student ${idx + 1}`,
                roll: roll || `ROLL-${1000 + idx}`,
                department,
                section,
                batch,
                course,
                email,
                phone
              });
            }
          });

          if (parsedStudents.length === 0) {
            throw new Error('No valid student rows found. Please check columns: Name, Roll, Department, Section.');
          }

          resolve(parsedStudents);
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : 'Error reading spreadsheet file';
          reject(new Error(errorMsg));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsArrayBuffer(file);
    });
  }
};
