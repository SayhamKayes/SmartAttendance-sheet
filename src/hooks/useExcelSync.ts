import { useState } from 'react';
import { useAttendanceContext } from '../Context/AttendanceContext';
import { excelSyncService } from '../services/excelSyncService';
import { Student } from '../types/attendance';

export const useExcelSync = () => {
  const { students, sessions, bulkImportStudents, exportAllToExcel, downloadTemplate } = useAttendanceContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [importPreview, setImportPreview] = useState<Student[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setImportError(null);
    try {
      const parsedStudents = await excelSyncService.parseStudentsFromFile(file);
      setImportPreview(parsedStudents);
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Error reading spreadsheet file.');
      setImportPreview(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    if (importPreview && importPreview.length > 0) {
      bulkImportStudents(importPreview);
      setImportPreview(null);
    }
  };

  const cancelImport = () => {
    setImportPreview(null);
    setImportError(null);
  };

  return {
    isProcessing,
    importPreview,
    importError,
    handleFileUpload,
    confirmImport,
    cancelImport,
    exportAllToExcel,
    downloadTemplate,
    studentCount: students.length,
    sessionCount: sessions.length
  };
};
