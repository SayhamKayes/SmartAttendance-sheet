import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  AttendanceSession,
  GoogleSheetsConfig,
  TeacherAssignment
} from '../types/attendance';
import { storageService } from '../services/storageService';
import { excelSyncService } from '../services/excelSyncService';
import { googleSheetsService } from '../services/googleSheetsService';

interface SyncNotification {
  message: string;
  type: 'success' | 'info' | 'error' | 'none';
  time: string;
}

interface AttendanceContextType {
  students: Student[];
  teachers: Teacher[];
  sessions: AttendanceSession[];
  departments: string[];
  courses: { code: string; name: string; department: string }[];
  sheetsConfig: GoogleSheetsConfig;
  lastSyncStatus: SyncNotification | null;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  bulkImportStudents: (newStudents: Student[]) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  assignTeacherCourse: (teacherId: string, assignment: Omit<TeacherAssignment, 'id'>) => void;
  removeTeacherAssignment: (teacherId: string, assignmentId: string) => void;
  saveAttendanceSession: (sessionData: Omit<AttendanceSession, 'id' | 'timestamp'>) => Promise<{ success: boolean; message: string }>;
  deleteAttendanceSession: (sessionId: string) => void;
  updateSheetsConfig: (config: Partial<GoogleSheetsConfig>) => void;
  syncAllToGoogleSheet: () => Promise<{ success: boolean; message: string }>;
  exportAllToExcel: () => void;
  exportSingleSessionExcel: (sessionId: string) => void;
  downloadTemplate: () => void;
  resetData: () => void;
  dismissSyncNotification: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storageService.getTeachers());
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => storageService.getSessions());
  const [departments, setDepartments] = useState<string[]>(() => storageService.getDepartments());
  const [courses, setCourses] = useState<{ code: string; name: string; department: string }[]>(() => storageService.getCourses());
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => storageService.getSheetsConfig());
  const [lastSyncStatus, setLastSyncStatus] = useState<SyncNotification | null>(null);

  // Sync state to localStorage whenever modified
  useEffect(() => {
    storageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    storageService.saveTeachers(teachers);
  }, [teachers]);

  useEffect(() => {
    storageService.saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    storageService.saveDepartments(departments);
  }, [departments]);

  useEffect(() => {
    storageService.saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    storageService.saveSheetsConfig(sheetsConfig);
  }, [sheetsConfig]);

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newStudent,
      id: `s-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    setStudents(prev => [student, ...prev]);
    setLastSyncStatus({
      message: `Student "${student.name}" (${student.roll}) added successfully!`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    setLastSyncStatus({
      message: `Student details updated successfully.`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setLastSyncStatus({
      message: `Student removed from registry.`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
  };

  const bulkImportStudents = (newStudents: Student[]) => {
    // Avoid duplicate rolls
    setStudents(prev => {
      const existingRolls = new Set(prev.map(p => p.roll.toLowerCase().trim()));
      const filtered = newStudents.filter(ns => !existingRolls.has(ns.roll.toLowerCase().trim()));
      return [...filtered, ...prev];
    });
    setLastSyncStatus({
      message: `Successfully imported ${newStudents.length} students into database!`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };

  const addTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const teacher: Teacher = {
      ...newTeacher,
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setTeachers(prev => [teacher, ...prev]);
    setLastSyncStatus({
      message: `Teacher "${teacher.name}" registered.`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const assignTeacherCourse = (teacherId: string, assignment: Omit<TeacherAssignment, 'id'>) => {
    const newAssignment: TeacherAssignment = {
      ...assignment,
      id: `assign-${Date.now()}`
    };
    setTeachers(prev =>
      prev.map(t => {
        if (t.id === teacherId) {
          return {
            ...t,
            assignedCourses: [...t.assignedCourses, newAssignment]
          };
        }
        return t;
      })
    );
    setLastSyncStatus({
      message: `Course assignment added successfully.`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };

  const removeTeacherAssignment = (teacherId: string, assignmentId: string) => {
    setTeachers(prev =>
      prev.map(t => {
        if (t.id === teacherId) {
          return {
            ...t,
            assignedCourses: t.assignedCourses.filter(a => a.id !== assignmentId)
          };
        }
        return t;
      })
    );
  };

  const saveAttendanceSession = async (
    sessionData: Omit<AttendanceSession, 'id' | 'timestamp'>
  ): Promise<{ success: boolean; message: string }> => {
    // Check if session for this exact date, course, batch, section already exists to update it
    const existingIndex = sessions.findIndex(
      s => s.date === sessionData.date &&
           s.course === sessionData.course &&
           s.section === sessionData.section &&
           s.batch === sessionData.batch
    );

    const now = new Date();
    const newSession: AttendanceSession = {
      ...sessionData,
      id: existingIndex >= 0 ? sessions[existingIndex].id : `session-${Date.now()}`,
      timestamp: now.toISOString(),
      syncedToGoogleSheet: true,
      syncedAt: now.toLocaleTimeString()
    };

    let updatedSessions: AttendanceSession[];
    if (existingIndex >= 0) {
      updatedSessions = [...sessions];
      updatedSessions[existingIndex] = newSession;
    } else {
      updatedSessions = [newSession, ...sessions];
    }

    setSessions(updatedSessions);

    // Auto-sync with Google Sheet / Webhook if enabled
    let syncResult = { success: true, message: 'Saved to local database.' };
    if (sheetsConfig.autoSync) {
      syncResult = await googleSheetsService.syncSessionToGoogleSheet(newSession, sheetsConfig);
    }

    setLastSyncStatus({
      message: `Attendance saved & updated in Excel/Sheet view! (${newSession.records.length} students)`,
      type: 'success',
      time: now.toLocaleTimeString()
    });

    return {
      success: true,
      message: `Attendance for ${sessionData.date} recorded and synchronized!`
    };
  };

  const deleteAttendanceSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setLastSyncStatus({
      message: `Attendance session removed.`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
  };

  const updateSheetsConfig = (config: Partial<GoogleSheetsConfig>) => {
    setSheetsConfig(prev => ({ ...prev, ...config }));
    setLastSyncStatus({
      message: `Google Sheets configuration updated.`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
  };

  const syncAllToGoogleSheet = async () => {
    const result = await googleSheetsService.syncAllSessions(sessions, sheetsConfig);
    setLastSyncStatus({
      message: result.message,
      type: result.success ? 'success' : 'error',
      time: new Date().toLocaleTimeString()
    });
    return result;
  };

  const exportAllToExcel = () => {
    excelSyncService.exportAttendanceToExcel(students, sessions);
    setLastSyncStatus({
      message: `Exported comprehensive Attendance Workbook (.xlsx) to your downloads.`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };

  const exportSingleSessionExcel = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      excelSyncService.exportSingleSession(session);
    }
  };

  const downloadTemplate = () => {
    excelSyncService.downloadSampleImportTemplate();
  };

  const resetData = () => {
    storageService.resetToDefault();
    setStudents(storageService.getStudents());
    setTeachers(storageService.getTeachers());
    setSessions(storageService.getSessions());
    setDepartments(storageService.getDepartments());
    setCourses(storageService.getCourses());
    setSheetsConfig(storageService.getSheetsConfig());
    setLastSyncStatus({
      message: `Database reset to initial sample demo data.`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
  };

  const dismissSyncNotification = () => {
    setLastSyncStatus(null);
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        teachers,
        sessions,
        departments,
        courses,
        sheetsConfig,
        lastSyncStatus,
        addStudent,
        updateStudent,
        deleteStudent,
        bulkImportStudents,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        assignTeacherCourse,
        removeTeacherAssignment,
        saveAttendanceSession,
        deleteAttendanceSession,
        updateSheetsConfig,
        syncAllToGoogleSheet,
        exportAllToExcel,
        exportSingleSessionExcel,
        downloadTemplate,
        resetData,
        dismissSyncNotification
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendanceContext must be used within an AttendanceProvider');
  }
  return context;
};
