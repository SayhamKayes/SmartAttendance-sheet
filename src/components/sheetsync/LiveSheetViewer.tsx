import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  Sparkles, 
  Table, 
  ListOrdered
} from 'lucide-react';
import { useAttendanceContext } from '../../Context/AttendanceContext';
import { excelSyncService } from '../../services/excelSyncService';

export const LiveSheetViewer: React.FC = () => {
  const { 
    students, 
    sessions, 
    departments, 
    sheetsConfig, 
    syncAllToGoogleSheet, 
    exportAllToExcel 
  } = useAttendanceContext();

  const [activeTab, setActiveTab] = useState<'matrix' | 'logs'>('matrix');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Collect and sort all distinct dates from recorded sessions
  const sessionDates = useMemo(() => {
    const dates = Array.from(new Set(sessions.map(s => s.date))).sort();
    return dates;
  }, [sessions]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchDept = selectedDept === 'All' || student.department === selectedDept;
      const matchSec = selectedSection === 'All' || student.section === selectedSection;
      const matchSearch = searchTerm === '' ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchSec && matchSearch;
    });
  }, [students, selectedDept, selectedSection, searchTerm]);

  // Handle live manual sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncAllToGoogleSheet();
      setSyncFeedback(res.message);
      setTimeout(() => setSyncFeedback(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Live Attendance Spreadsheet
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Auto-Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time spreadsheet matrix reflecting all daily student attendances, totals, and percentages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Webhook Sync Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-bold transition flex items-center shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Webhook'}
          </button>

          {/* Export to Excel */}
          <button
            onClick={exportAllToExcel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download Excel (.xlsx)
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Spreadsheet Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 mr-1.5" />
            Matrix View (Date Grid)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
              activeTab === 'logs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 mr-1.5" />
            Session Logs ({sessions.length})
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search roll / student..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'matrix' ? (
        /* Excel Matrix Grid View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 bg-emerald-900 text-white text-xs font-mono flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-bold">SHEET1: ATTENDANCE_MASTER</span>
              <span className="text-emerald-300">({filteredStudents.length} Students × {sessionDates.length} Dates)</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-emerald-200">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></span> P = Present (1)</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-400 mr-1"></span> A = Absent (0)</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1"></span> L = Late (0.5)</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span> E = Excused (1)</span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider shadow-xs">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-10 text-center bg-slate-100">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28 bg-slate-100">Roll No</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-44 bg-slate-100">Student Name</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-24 bg-slate-100">Batch / Sec</th>

                  {/* Dynamic Date Headers */}
                  {sessionDates.length === 0 ? (
                    <th className="py-2.5 px-4 text-center text-slate-400">No session dates recorded yet</th>
                  ) : (
                    sessionDates.map(date => (
                      <th
                        key={date}
                        className="py-2.5 px-3 border-r border-slate-200 text-center min-w-20 font-mono bg-slate-100"
                        title={date}
                      >
                        <div className="text-[10px] text-slate-500">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-[11px] text-slate-900">{date.slice(5)}</div>
                      </th>
                    ))
                  )}

                  {/* Aggregated Totals Columns */}
                  <th className="py-2.5 px-3 border-r border-slate-200 w-20 text-center bg-emerald-50 text-emerald-900 font-extrabold">
                    Present
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-20 text-center bg-emerald-50 text-emerald-900 font-extrabold">
                    Classes
                  </th>
                  <th className="py-2.5 px-4 w-28 text-center bg-emerald-100 text-emerald-950 font-extrabold">
                    Turnout %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={sessionDates.length + 7} className="py-8 text-center text-slate-400">
                      No student records match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    let totalAttended = 0;
                    let totalClasses = 0;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Serial */}
                        <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-slate-400 bg-slate-50/50">
                          {idx + 1}
                        </td>

                        {/* Roll */}
                        <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-800">
                          {student.roll}
                        </td>

                        {/* Name */}
                        <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900 whitespace-nowrap">
                          {student.name}
                        </td>

                        {/* Batch & Sec */}
                        <td className="py-2 px-3 border-r border-slate-200 text-slate-600 whitespace-nowrap font-medium text-[11px]">
                          {student.batch.replace(' Batch', '')} • {student.section}
                        </td>

                        {/* Dates Attendance Cells */}
                        {sessionDates.map(date => {
                          const matchingSession = sessions.find(
                            s => s.date === date &&
                                 (s.department === student.department || !s.department) &&
                                 (s.section === student.section || !s.section)
                          );

                          if (!matchingSession) {
                            return (
                              <td key={date} className="py-2 px-3 border-r border-slate-200 text-center text-slate-300">
                                -
                              </td>
                            );
                          }

                          const record = matchingSession.records.find(
                            r => r.studentId === student.id || r.studentRoll === student.roll
                          );

                          if (!record) {
                            return (
                              <td key={date} className="py-2 px-3 border-r border-slate-200 text-center text-slate-300">
                                -
                              </td>
                            );
                          }

                          totalClasses++;
                          let badgeBg = 'bg-slate-100 text-slate-600';
                          let code = 'P';

                          if (record.status === 'present') {
                            totalAttended += 1;
                            code = 'P';
                            badgeBg = 'bg-emerald-100 text-emerald-800 font-bold';
                          } else if (record.status === 'absent') {
                            code = 'A';
                            badgeBg = 'bg-rose-100 text-rose-800 font-bold';
                          } else if (record.status === 'late') {
                            totalAttended += 0.5;
                            code = 'L';
                            badgeBg = 'bg-amber-100 text-amber-800 font-bold';
                          } else if (record.status === 'excused') {
                            totalAttended += 1;
                            code = 'E';
                            badgeBg = 'bg-blue-100 text-blue-800 font-bold';
                          }

                          return (
                            <td
                              key={date}
                              className="py-2 px-3 border-r border-slate-200 text-center"
                              title={`Status: ${record.status.toUpperCase()} ${record.remarks ? `(${record.remarks})` : ''}`}
                            >
                              <span className={`inline-block w-6 py-0.5 text-center rounded text-[11px] ${badgeBg}`}>
                                {code}
                              </span>
                            </td>
                          );
                        })}

                        {/* Total Present */}
                        <td className="py-2 px-3 border-r border-slate-200 text-center font-bold text-slate-800 bg-emerald-50/30">
                          {totalAttended}
                        </td>

                        {/* Total Classes */}
                        <td className="py-2 px-3 border-r border-slate-200 text-center font-bold text-slate-800 bg-emerald-50/30">
                          {totalClasses}
                        </td>

                        {/* Percentage */}
                        <td className="py-2 px-4 text-center bg-emerald-50/50">
                          {totalClasses > 0 ? (
                            <div className="flex items-center space-x-1.5 justify-center">
                              <span
                                className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                                  Math.round((totalAttended / totalClasses) * 100) >= 75
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {Math.round((totalAttended / totalClasses) * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Detailed Session Logs View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {sessions.map(session => (
              <div key={session.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{session.course}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {session.batch} • Sec {session.section}
                      </span>
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {session.date}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Teacher: <span className="font-semibold text-slate-700">{session.teacherName || 'Faculty'}</span>
                      {session.courseName && ` • ${session.courseName}`}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => excelSyncService.exportSingleSession(session)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center transition"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Session Excel
                    </button>
                  </div>
                </div>

                {/* Micro student status pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {session.records.map(rec => {
                    const isP = rec.status === 'present';
                    const isA = rec.status === 'absent';
                    const isL = rec.status === 'late';
                    return (
                      <span
                        key={rec.studentRoll}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border flex items-center space-x-1 ${
                          isP
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isA
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : isL
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                        title={`${rec.studentName} (${rec.studentRoll}): ${rec.status.toUpperCase()} ${rec.remarks ? `- ${rec.remarks}` : ''}`}
                      >
                        <span className="font-mono">{rec.studentRoll.split('-').pop()}</span>
                        <span>•</span>
                        <span>{rec.status[0].toUpperCase()}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
