import React from 'react';
import { 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Download,
  RotateCcw
} from 'lucide-react';
import { useAttendanceContext } from '../Context/AttendanceContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const { sheetsConfig, exportAllToExcel, resetData, lastSyncStatus, dismissSyncNotification } = useAttendanceContext();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SmartAttendance</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                  Excel Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Digital Attendance &amp; Multi-Sheet Automated Records
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Today's Date */}
            <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>{today}</span>
            </div>

            {/* Google Sheet Sync Indicator */}
            <button
              onClick={() => setActiveTab('sheetview')}
              title={sheetsConfig.webhookUrl ? "Connected to Google Sheet Webhook" : "Syncing to Local Excel Database"}
              className="flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              <span className="hidden sm:inline">Sheet Status:</span>
              <span className="ml-1 font-semibold">{sheetsConfig.webhookUrl ? 'Live Webhook' : 'Live Sheet Matrix'}</span>
            </button>

            {/* Quick Export to Excel */}
            <button
              onClick={exportAllToExcel}
              className="flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
              title="Download entire attendance records as Excel file"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Export</span> Excel
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={() => {
                if (window.confirm('Reset database to clean initial sample records?')) {
                  resetData();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time notification banner if active */}
      {lastSyncStatus && (
        <div className={`px-4 py-1.5 text-xs text-center border-t flex items-center justify-center space-x-2 transition-all ${
          lastSyncStatus.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : lastSyncStatus.type === 'info'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lastSyncStatus.message}</span>
          <span className="text-slate-400 text-[10px]">({lastSyncStatus.time})</span>
          <button 
            onClick={dismissSyncNotification}
            className="ml-2 font-bold hover:underline text-slate-500"
          >
            ×
          </button>
        </div>
      )}
    </header>
  );
};
