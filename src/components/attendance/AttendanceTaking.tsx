import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Save, 
  Check, 
  X, 
  Clock, 
  ShieldAlert, 
  Users, 
  FileSpreadsheet, 
  Download, 
  Sparkles,
  Search,
  CheckCheck
} from 'lucide-react';
import { useAttendanceContext } from '../../Context/AttendanceContext';
import { AttendanceStatus, AttendanceRecord } from '../../types/attendance';
import { excelSyncService } from '../../services/excelSyncService';

export const AttendanceTaking: React.FC = () => {
  const { 
    students, 
    teachers, 
    departments, 
    courses, 
    sessions, 
    saveAttendanceSession 
  } = useAttendanceContext();

  const todayStr = new Date().toISOString().split('T')[0];

  // Selection states
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedDept, setSelectedDept] = useState<string>(departments[0] || 'Computer Science & Engineering');
  const [selectedBatch, setSelectedBatch] = useState<string>('52nd Batch');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedCourse, setSelectedCourse] = useState<string>('CSE-305');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Auto-detect course name
  const currentCourseObj = courses.find(c => c.code === selectedCourse);

  // Auto-detect assigned teacher for this Department, Course, Batch, Section
  const assignedTeacher = useMemo(() => {
    return teachers.find(t =>
      t.assignedCourses.some(
        a => (a.courseCode === selectedCourse || a.courseName === selectedCourse) &&
             (a.section === selectedSection || !a.section)
      )
    );
  }, [teachers, selectedCourse, selectedSection]);

  // Filter students based on selection (Dept, Section, Batch, Course)
  const classStudents = useMemo(() => {
    return students.filter(student => {
      const matchDept = !selectedDept || student.department === selectedDept;
      const matchSec = !selectedSection || student.section === selectedSection;
      const matchBatch = !selectedBatch || student.batch === selectedBatch;
      return matchDept && matchSec && matchBatch;
    });
  }, [students, selectedDept, selectedSection, selectedBatch]);

  // Attendance records map for this form: studentId -> { status, remarks }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  // Check if an existing session already exists for this exact combination
  useEffect(() => {
    const existingSession = sessions.find(
      s => s.date === selectedDate &&
           s.course === selectedCourse &&
           s.section === selectedSection &&
           s.batch === selectedBatch
    );

    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    classStudents.forEach(st => {
      if (existingSession) {
        const found = existingSession.records.find(r => r.studentId === st.id || r.studentRoll === st.roll);
        if (found) {
          initialMap[st.id] = { status: found.status, remarks: found.remarks || '' };
          return;
        }
      }
      // Default to 'present' for convenient fast taking
      initialMap[st.id] = { status: 'present', remarks: '' };
    });

    setAttendanceMap(initialMap);
  }, [selectedDate, selectedCourse, selectedSection, selectedBatch, classStudents, sessions]);

  // Update single student status
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        status
      }
    }));
  };

  // Update remarks
  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'present' }),
        remarks
      }
    }));
  };

  // Quick Action: Mark All Present
  const markAllPresent = () => {
    setAttendanceMap(prev => {
      const updated = { ...prev };
      classStudents.forEach(st => {
        updated[st.id] = { ...(updated[st.id] || { remarks: '' }), status: 'present' };
      });
      return updated;
    });
  };

  // Quick Action: Mark All Absent
  const markAllAbsent = () => {
    setAttendanceMap(prev => {
      const updated = { ...prev };
      classStudents.forEach(st => {
        updated[st.id] = { ...(updated[st.id] || { remarks: '' }), status: 'absent' };
      });
      return updated;
    });
  };

  // Calculate live statistics for this session
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    classStudents.forEach(st => {
      const item = attendanceMap[st.id];
      if (!item) return;
      if (item.status === 'present') present++;
      else if (item.status === 'absent') absent++;
      else if (item.status === 'late') late++;
      else if (item.status === 'excused') excused++;
    });

    const total = classStudents.length;
    const rate = total > 0 ? Math.round(((present + excused + late * 0.5) / total) * 100) : 0;

    return { total, present, absent, late, excused, rate };
  }, [classStudents, attendanceMap]);

  // Submit & Save to Local DB + Auto Sync to Google Sheet / Excel
  const handleSaveAttendance = async () => {
    if (classStudents.length === 0) {
      alert('No students found in this selected department/section.');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg(null);

    const records: AttendanceRecord[] = classStudents.map(st => ({
      studentId: st.id,
      studentRoll: st.roll,
      studentName: st.name,
      status: attendanceMap[st.id]?.status || 'present',
      remarks: attendanceMap[st.id]?.remarks || ''
    }));

    try {
      const res = await saveAttendanceSession({
        date: selectedDate,
        department: selectedDept,
        course: selectedCourse,
        courseName: currentCourseObj?.name || selectedCourse,
        batch: selectedBatch,
        section: selectedSection,
        teacherId: assignedTeacher?.id,
        teacherName: assignedTeacher?.name || 'Assigned Instructor',
        records
      });

      setSaveSuccessMsg(res.message);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Export current session immediately to Excel
  const handleExportThisSession = () => {
    const records: AttendanceRecord[] = classStudents.map(st => ({
      studentId: st.id,
      studentRoll: st.roll,
      studentName: st.name,
      status: attendanceMap[st.id]?.status || 'present',
      remarks: attendanceMap[st.id]?.remarks || ''
    }));

    excelSyncService.exportSingleSession({
      id: `temp-${Date.now()}`,
      date: selectedDate,
      department: selectedDept,
      course: selectedCourse,
      courseName: currentCourseObj?.name,
      batch: selectedBatch,
      section: selectedSection,
      teacherName: assignedTeacher?.name,
      timestamp: new Date().toISOString(),
      records
    });
  };

  // Filter students by search term
  const displayedStudents = classStudents.filter(
    st => st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          st.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Date-wise Attendance Marking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record class attendance with automated Excel &amp; Google Sheet synchronization.
          </p>
        </div>

        {/* Assigned Teacher Badge */}
        {assignedTeacher ? (
          <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
            <div>
              <span className="font-bold">{assignedTeacher.name}</span>
              <span className="text-teal-600 ml-1">({assignedTeacher.designation})</span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
            <span>Faculty: General Department Faculty</span>
          </div>
        )}
      </div>

      {/* Class Selection Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attendance Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course / Subject
            </label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            >
              {courses.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Batch
            </label>
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            >
              <option value="52nd Batch">52nd Batch</option>
              <option value="53rd Batch">53rd Batch</option>
              <option value="54th Batch">54th Batch</option>
              <option value="48th Batch">48th Batch</option>
              <option value="50th Batch">50th Batch</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Counter & Bulk Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Attendance Counters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
            <Users className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Total: {stats.total}
          </div>
          <div className="flex items-center px-3 py-1.5 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-700 border border-emerald-200">
            <Check className="w-3.5 h-3.5 mr-1" />
            Present: {stats.present}
          </div>
          <div className="flex items-center px-3 py-1.5 bg-rose-50 rounded-xl text-xs font-bold text-rose-700 border border-rose-200">
            <X className="w-3.5 h-3.5 mr-1" />
            Absent: {stats.absent}
          </div>
          <div className="flex items-center px-3 py-1.5 bg-amber-50 rounded-xl text-xs font-bold text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Late: {stats.late}
          </div>
          <div className="flex items-center px-3 py-1.5 bg-blue-50 rounded-xl text-xs font-bold text-blue-700 border border-blue-200">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Excused: {stats.excused}
          </div>
          <div className="text-xs font-extrabold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Turnout: <span className="text-emerald-600">{stats.rate}%</span>
          </div>
        </div>

        {/* Quick Batch Actions & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search roll/name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-36 sm:w-44 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={markAllPresent}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition flex items-center"
            title="Mark all listed students as present"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" />
            All Present
          </button>
          <button
            onClick={markAllAbsent}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition flex items-center"
            title="Mark all listed students as absent"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            All Absent
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-semibold">{saveSuccessMsg}</div>
          <button
            onClick={() => setSaveSuccessMsg(null)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Student Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {displayedStudents.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Students Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No students match the criteria for {selectedDept}, {selectedBatch}, Section {selectedSection}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-36">Student Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 w-72 text-center">Attendance Status</th>
                  <th className="py-3 px-4">Remarks / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStudents.map((student, idx) => {
                  const currentStatus = attendanceMap[student.id]?.status || 'present';
                  const currentRemarks = attendanceMap[student.id]?.remarks || '';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        currentStatus === 'absent' ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3 px-4 text-center text-xs text-slate-400 font-mono">
                        {idx + 1}
                      </td>

                      {/* Roll */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80">
                          {student.roll}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        {student.email && (
                          <div className="text-[11px] text-slate-400">{student.email}</div>
                        )}
                      </td>

                      {/* Status Toggle Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            P
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                            }`}
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            A
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            L
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'excused')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
                              currentStatus === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-800'
                            }`}
                          >
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                            E
                          </button>
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Optional remarks (e.g. sick, sports)..."
                          value={currentRemarks}
                          onChange={e => handleRemarksChange(student.id, e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Auto-syncs immediately into the Live Excel Sheet Matrix upon saving.
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleExportThisSession}
              disabled={classStudents.length === 0}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Session (.xlsx)
            </button>

            <button
              onClick={handleSaveAttendance}
              disabled={isSaving || classStudents.length === 0}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving &amp; Syncing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save &amp; Sync Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
