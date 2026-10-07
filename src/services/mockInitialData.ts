import { Student, Teacher, AttendanceSession, GoogleSheetsConfig } from '../types/attendance';

export const INITIAL_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical & Electronic Engineering',
  'Software Engineering',
  'Business Administration',
  'Information Technology'
];

export const INITIAL_COURSES = [
  { code: 'CSE-101', name: 'Structured Programming Language', department: 'Computer Science & Engineering' },
  { code: 'CSE-202', name: 'Data Structures and Algorithms', department: 'Computer Science & Engineering' },
  { code: 'CSE-305', name: 'Database Management Systems', department: 'Computer Science & Engineering' },
  { code: 'EEE-201', name: 'Electrical Circuits Analysis', department: 'Electrical & Electronic Engineering' },
  { code: 'SWE-401', name: 'Software Architecture & Design', department: 'Software Engineering' },
  { code: 'BBA-102', name: 'Principles of Management', department: 'Business Administration' },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Dr. Rafiqul Islam',
    employeeId: 'EMP-1001',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head',
    email: 'rafiqul.islam@univ.edu',
    phone: '+880 1712-345678',
    assignedCourses: [
      {
        id: 'assign-1',
        courseCode: 'CSE-305',
        courseName: 'Database Management Systems',
        department: 'Computer Science & Engineering',
        batch: '52nd Batch',
        section: 'A'
      },
      {
        id: 'assign-2',
        courseCode: 'CSE-101',
        courseName: 'Structured Programming Language',
        department: 'Computer Science & Engineering',
        batch: '54th Batch',
        section: 'B'
      }
    ]
  },
  {
    id: 't-2',
    name: 'Nasrin Sultana',
    employeeId: 'EMP-1002',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    email: 'nasrin.sultana@univ.edu',
    phone: '+880 1819-876543',
    assignedCourses: [
      {
        id: 'assign-3',
        courseCode: 'CSE-202',
        courseName: 'Data Structures and Algorithms',
        department: 'Computer Science & Engineering',
        batch: '53rd Batch',
        section: 'A'
      }
    ]
  },
  {
    id: 't-3',
    name: 'Engr. Tanvir Ahmed',
    employeeId: 'EMP-1003',
    department: 'Electrical & Electronic Engineering',
    designation: 'Assistant Professor',
    email: 'tanvir.ahmed@univ.edu',
    phone: '+880 1911-223344',
    assignedCourses: [
      {
        id: 'assign-4',
        courseCode: 'EEE-201',
        courseName: 'Electrical Circuits Analysis',
        department: 'Electrical & Electronic Engineering',
        batch: '48th Batch',
        section: 'A'
      }
    ]
  },
  {
    id: 't-4',
    name: 'Fariha Jahan',
    employeeId: 'EMP-1004',
    department: 'Software Engineering',
    designation: 'Lecturer',
    email: 'fariha.jahan@univ.edu',
    phone: '+880 1622-998877',
    assignedCourses: [
      {
        id: 'assign-5',
        courseCode: 'SWE-401',
        courseName: 'Software Architecture & Design',
        department: 'Software Engineering',
        batch: '50th Batch',
        section: 'A'
      }
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-101',
    name: 'Md. Al Amin',
    roll: 'CSE-52-001',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'alamin@student.univ.edu',
    phone: '+880 1711-000101'
  },
  {
    id: 's-102',
    name: 'Sadia Afroz',
    roll: 'CSE-52-002',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'sadia.afroz@student.univ.edu',
    phone: '+880 1711-000102'
  },
  {
    id: 's-103',
    name: 'Tanvir Hossain',
    roll: 'CSE-52-003',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'tanvir.h@student.univ.edu',
    phone: '+880 1711-000103'
  },
  {
    id: 's-104',
    name: 'Nusrat Jahan Mim',
    roll: 'CSE-52-004',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'mim.nusrat@student.univ.edu',
    phone: '+880 1711-000104'
  },
  {
    id: 's-105',
    name: 'Sabbir Ahmed',
    roll: 'CSE-52-005',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'sabbir.ahmed@student.univ.edu',
    phone: '+880 1711-000105'
  },
  {
    id: 's-106',
    name: 'Mehedi Hasan',
    roll: 'CSE-52-006',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'mehedi.h@student.univ.edu',
    phone: '+880 1711-000106'
  },
  {
    id: 's-107',
    name: 'Tasnim Ferdous',
    roll: 'CSE-52-007',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'tasnim.f@student.univ.edu',
    phone: '+880 1711-000107'
  },
  {
    id: 's-108',
    name: 'Rohan Karim',
    roll: 'CSE-52-008',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'rohan.karim@student.univ.edu',
    phone: '+880 1711-000108'
  },
  {
    id: 's-109',
    name: 'Anika Tabassum',
    roll: 'CSE-52-009',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'anika.t@student.univ.edu',
    phone: '+880 1711-000109'
  },
  {
    id: 's-110',
    name: 'Mahir Faisal',
    roll: 'CSE-52-010',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: 'CSE-305',
    email: 'mahir.faisal@student.univ.edu',
    phone: '+880 1711-000110'
  },
  // CSE-202 batch 53 section A
  {
    id: 's-201',
    name: 'Kamrul Hasan',
    roll: 'CSE-53-001',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '53rd Batch',
    course: 'CSE-202',
    email: 'kamrul@student.univ.edu',
    phone: '+880 1811-000201'
  },
  {
    id: 's-202',
    name: 'Farhana Haque',
    roll: 'CSE-53-002',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '53rd Batch',
    course: 'CSE-202',
    email: 'farhana.h@student.univ.edu',
    phone: '+880 1811-000202'
  },
  {
    id: 's-203',
    name: 'Zubair Bin Tariq',
    roll: 'CSE-53-003',
    department: 'Computer Science & Engineering',
    section: 'A',
    batch: '53rd Batch',
    course: 'CSE-202',
    email: 'zubair.tariq@student.univ.edu',
    phone: '+880 1811-000203'
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'session-2026-09-28-cse305',
    date: '2026-09-28',
    department: 'Computer Science & Engineering',
    course: 'CSE-305',
    courseName: 'Database Management Systems',
    batch: '52nd Batch',
    section: 'A',
    teacherId: 't-1',
    teacherName: 'Dr. Rafiqul Islam',
    syncedToGoogleSheet: true,
    syncedAt: '2026-09-28 10:15 AM',
    timestamp: '2026-09-28T10:15:00.000Z',
    records: [
      { studentId: 's-101', studentRoll: 'CSE-52-001', studentName: 'Md. Al Amin', status: 'present' },
      { studentId: 's-102', studentRoll: 'CSE-52-002', studentName: 'Sadia Afroz', status: 'present' },
      { studentId: 's-103', studentRoll: 'CSE-52-003', studentName: 'Tanvir Hossain', status: 'present' },
      { studentId: 's-104', studentRoll: 'CSE-52-004', studentName: 'Nusrat Jahan Mim', status: 'absent', remarks: 'Medical leave' },
      { studentId: 's-105', studentRoll: 'CSE-52-005', studentName: 'Sabbir Ahmed', status: 'present' },
      { studentId: 's-106', studentRoll: 'CSE-52-006', studentName: 'Mehedi Hasan', status: 'late', remarks: 'Traffic delay' },
      { studentId: 's-107', studentRoll: 'CSE-52-007', studentName: 'Tasnim Ferdous', status: 'present' },
      { studentId: 's-108', studentRoll: 'CSE-52-008', studentName: 'Rohan Karim', status: 'present' },
      { studentId: 's-109', studentRoll: 'CSE-52-009', studentName: 'Anika Tabassum', status: 'present' },
      { studentId: 's-110', studentRoll: 'CSE-52-010', studentName: 'Mahir Faisal', status: 'present' }
    ]
  },
  {
    id: 'session-2026-09-30-cse305',
    date: '2026-09-30',
    department: 'Computer Science & Engineering',
    course: 'CSE-305',
    courseName: 'Database Management Systems',
    batch: '52nd Batch',
    section: 'A',
    teacherId: 't-1',
    teacherName: 'Dr. Rafiqul Islam',
    syncedToGoogleSheet: true,
    syncedAt: '2026-09-30 11:30 AM',
    timestamp: '2026-09-30T11:30:00.000Z',
    records: [
      { studentId: 's-101', studentRoll: 'CSE-52-001', studentName: 'Md. Al Amin', status: 'present' },
      { studentId: 's-102', studentRoll: 'CSE-52-002', studentName: 'Sadia Afroz', status: 'present' },
      { studentId: 's-103', studentRoll: 'CSE-52-003', studentName: 'Tanvir Hossain', status: 'absent' },
      { studentId: 's-104', studentRoll: 'CSE-52-004', studentName: 'Nusrat Jahan Mim', status: 'present' },
      { studentId: 's-105', studentRoll: 'CSE-52-005', studentName: 'Sabbir Ahmed', status: 'present' },
      { studentId: 's-106', studentRoll: 'CSE-52-006', studentName: 'Mehedi Hasan', status: 'present' },
      { studentId: 's-107', studentRoll: 'CSE-52-007', studentName: 'Tasnim Ferdous', status: 'present' },
      { studentId: 's-108', studentRoll: 'CSE-52-008', studentName: 'Rohan Karim', status: 'excused', remarks: 'Authorized club event' },
      { studentId: 's-109', studentRoll: 'CSE-52-009', studentName: 'Anika Tabassum', status: 'present' },
      { studentId: 's-110', studentRoll: 'CSE-52-010', studentName: 'Mahir Faisal', status: 'present' }
    ]
  }
];

export const INITIAL_SHEETS_CONFIG: GoogleSheetsConfig = {
  webhookUrl: '',
  sheetName: 'Attendance_2026_Live',
  autoSync: true,
  syncStatus: 'idle'
};
