import React, { useState } from 'react';
import { 
  Settings, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Save, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAttendanceContext } from '../../Context/AttendanceContext';
import { googleSheetsService } from '../../services/googleSheetsService';

export const SettingsView: React.FC = () => {
  const { sheetsConfig, updateSheetsConfig, syncAllToGoogleSheet, resetData } = useAttendanceContext();

  const [webhookUrl, setWebhookUrl] = useState(sheetsConfig.webhookUrl || '');
  const [sheetName, setSheetName] = useState(sheetsConfig.sheetName || 'Attendance_Records');
  const [autoSync, setAutoSync] = useState(sheetsConfig.autoSync ?? true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const appsScriptCode = googleSheetsService.getAppsScriptTemplate(sheetName);

  const handleSaveConfig = () => {
    updateSheetsConfig({
      webhookUrl: webhookUrl.trim(),
      sheetName: sheetName.trim(),
      autoSync
    });
    setTestResult('Settings saved successfully!');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await syncAllToGoogleSheet();
      setTestResult(res.message);
    } catch (e: any) {
      setTestResult(`Error: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Settings &amp; Google Sheets Live Webhook
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure live two-way synchronization with your Google Sheet or Excel Webhook.
          </p>
        </div>
      </div>

      {testResult && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{testResult}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Webhook Configuration Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Google Sheets Webhook Setup</span>
        </h2>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Apps Script Webhook URL (Web App URL)
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec (leave blank to use local auto-matrix)"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              If left empty, all attendance will still be recorded and automatically synced in the in-app Live Sheet Matrix view and available for instant Excel (.xlsx) export.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Sheet Tab Name
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={e => setSheetName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-3 text-xs font-bold text-slate-700">Auto-sync on Attendance Save</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center shadow-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Configuration
            </button>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isTesting ? 'animate-spin' : ''}`} />
              Test Sync All Records
            </button>
          </div>
        </div>
      </div>

      {/* Ready-to-use Google Apps Script Code */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900">
              Google Apps Script Code (Copy into your Google Sheet)
            </h2>
            <p className="text-xs text-slate-500">
              Open your Google Sheet &gt; Extensions &gt; Apps Script &gt; Paste this script &gt; Deploy as Web App.
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Script Code
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto max-h-72 leading-relaxed">
          {appsScriptCode}
        </pre>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Reset Local Database</h3>
          <p className="text-xs text-rose-600 mt-0.5">
            Reverts all student entries, teachers, and attendance sessions back to initial sample records.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all data to default demo state?')) {
              resetData();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};
