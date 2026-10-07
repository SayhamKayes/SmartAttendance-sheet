export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  name: string;
  roll: string;
  department: string;
  section: string;
  batch: string;
  course?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone?: string;
  assignedCourses: TeacherAssignment[];
}

export interface TeacherAssignment {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  batch: string;
  section: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentRoll: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  department: string;
  course: string;
  courseName?: string;
  batch: string;
  section: string;
  teacherId?: string;
  teacherName?: string;
  records: AttendanceRecord[];
  timestamp: string;
  syncedToGoogleSheet?: boolean;
  syncedAt?: string;
}

export interface GoogleSheetsConfig {
  webhookUrl: string; // Google Apps Script Webhook URL or Make/Zapier/custom proxy
  sheetId?: string;
  sheetName: string;
  autoSync: boolean;
  lastSyncTime?: string;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}
