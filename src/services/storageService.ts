import { Student, Teacher, AttendanceSession, GoogleSheetsConfig } from '../types/attendance';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_SHEETS_CONFIG,
  INITIAL_DEPARTMENTS,
  INITIAL_COURSES
} from './mockInitialData';

const KEYS = {
  STUDENTS: 'smart_attendance_students_v1',
  TEACHERS: 'smart_attendance_teachers_v1',
  SESSIONS: 'smart_attendance_sessions_v1',
  SHEETS_CONFIG: 'smart_attendance_sheets_config_v1',
  DEPARTMENTS: 'smart_attendance_departments_v1',
  COURSES: 'smart_attendance_courses_v1'
};

export const storageService = {
  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch (e) {
      console.error('Failed to get students from localStorage', e);
      return INITIAL_STUDENTS;
    }
  },

  saveStudents: (students: Student[]): void => {
    try {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  },

  getTeachers: (): Teacher[] => {
    try {
      const data = localStorage.getItem(KEYS.TEACHERS);
      return data ? JSON.parse(data) : INITIAL_TEACHERS;
    } catch (e) {
      console.error('Failed to get teachers from localStorage', e);
      return INITIAL_TEACHERS;
    }
  },

  saveTeachers: (teachers: Teacher[]): void => {
    try {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
    } catch (e) {
      console.error('Failed to save teachers to localStorage', e);
    }
  },

  getSessions: (): AttendanceSession[] => {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE_SESSIONS;
    } catch (e) {
      console.error('Failed to get sessions from localStorage', e);
      return INITIAL_ATTENDANCE_SESSIONS;
    }
  },

  saveSessions: (sessions: AttendanceSession[]): void => {
    try {
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }
  },

  getSheetsConfig: (): GoogleSheetsConfig => {
    try {
      const data = localStorage.getItem(KEYS.SHEETS_CONFIG);
      return data ? JSON.parse(data) : INITIAL_SHEETS_CONFIG;
    } catch (e) {
      return INITIAL_SHEETS_CONFIG;
    }
  },

  saveSheetsConfig: (config: GoogleSheetsConfig): void => {
    try {
      localStorage.setItem(KEYS.SHEETS_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save sheets config', e);
    }
  },

  getDepartments: (): string[] => {
    try {
      const data = localStorage.getItem(KEYS.DEPARTMENTS);
      return data ? JSON.parse(data) : INITIAL_DEPARTMENTS;
    } catch (e) {
      return INITIAL_DEPARTMENTS;
    }
  },

  saveDepartments: (deps: string[]): void => {
    try {
      localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(deps));
    } catch (e) {
      console.error('Failed to save departments', e);
    }
  },

  getCourses: (): { code: string; name: string; department: string }[] => {
    try {
      const data = localStorage.getItem(KEYS.COURSES);
      return data ? JSON.parse(data) : INITIAL_COURSES;
    } catch (e) {
      return INITIAL_COURSES;
    }
  },

  saveCourses: (courses: { code: string; name: string; department: string }[]): void => {
    try {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  },

  resetToDefault: (): void => {
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.TEACHERS);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.SHEETS_CONFIG);
    localStorage.removeItem(KEYS.DEPARTMENTS);
    localStorage.removeItem(KEYS.COURSES);
  }
};
