import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  FileSpreadsheet,
  Download,
  Plus
} from 'lucide-react';
import { useAttendance } from '../../hooks/useAttendance';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const { 
    students, 
    teachers, 
    sessions, 
    courses, 
    statistics, 
    exportAllToExcel 
  } = useAttendance();

  const recentSessions = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
            Class Attendance Management System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Attendance &amp; Live Sheet Portal
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Record date-wise attendance, assign faculty to batches and courses, manage student records, and sync continuously to Excel and Google Sheets.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('attendance')}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/25"
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Mark Today's Attendance
            </button>
            <button
              onClick={() => setActiveTab('sheetview')}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/10 transition"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" />
              Open Live Sheet Matrix
            </button>
            <button
              onClick={exportAllToExcel}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-sm border border-slate-700 transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export .xlsx
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <FileSpreadsheet className="w-80 h-80" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Enrolled</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{students.length}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Students registered</span>
              <button 
                onClick={() => setActiveTab('students')}
                className="text-blue-600 hover:underline font-semibold"
              >
                View
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{statistics.averageRate}%</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center">
              <span>Overall attendance ratio</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recorded Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{sessions.length}</div>
            <div className="text-xs text-slate-500 mt-1">
              <span>Across all courses &amp; dates</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Faculty &amp; Courses</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{teachers.length}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{courses.length} active courses</span>
              <button 
                onClick={() => setActiveTab('teachers')}
                className="text-amber-600 hover:underline font-semibold"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Attendance Sessions & Low Attendance Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Sessions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Attendance Sessions</h2>
              <p className="text-xs text-slate-500">Latest class attendance recorded in database</p>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              New Entry <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No attendance sessions recorded yet</p>
              <button
                onClick={() => setActiveTab('attendance')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Mark First Attendance
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentSessions.map(session => {
                const presentCount = session.records.filter(r => r.status === 'present' || r.status === 'excused').length;
                const totalCount = session.records.length;
                const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

                return (
                  <div key={session.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-800">
                          {session.course}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-600">
                          {session.batch} • Sec {session.section}
                        </span>
                        <span className="text-xs text-slate-400">
                          {session.date}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Instructor: <span className="font-medium text-slate-700">{session.teacherName || 'Assigned Faculty'}</span>
                        {session.courseName && ` • ${session.courseName}`}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {presentCount} / {totalCount}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600">
                          {pct}% Present
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Synced to Database & Sheet"></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Attendance Alerts & Quick Actions */}
        <div className="space-y-5">
          {/* Low Attendance Warning (<75%) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Attendance Watchlist</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                &lt; 75% Threshold
              </span>
            </div>
            
            {statistics.atRiskStudents.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-xl">
                All students currently maintain regular attendance above 75%.
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                {statistics.atRiskStudents.slice(0, 4).map(item => (
                  <div key={item.student.id} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{item.student.name}</div>
                      <div className="text-[10px] text-slate-500">{item.student.roll} • {item.student.section}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-rose-600">{item.percentage}%</div>
                      <div className="text-[10px] text-slate-400">{item.attended}/{item.totalEnrolledSessions} classes</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('students')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition flex flex-col justify-between"
              >
                <Plus className="w-4 h-4 text-emerald-600 mb-2" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Add / Import</div>
                  <div className="text-[10px] text-slate-500">Student Excel</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('teachers')}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition flex flex-col justify-between"
              >
                <BookOpen className="w-4 h-4 text-blue-600 mb-2" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Assign Course</div>
                  <div className="text-[10px] text-slate-500">Teacher Batch</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
