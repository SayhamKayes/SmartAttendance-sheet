import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Server, 
  Copy, 
  Check, 
  FileCode, 
  ExternalLink,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const BackendConfigView: React.FC = () => {
  const [selectedDb, setSelectedDb] = useState<'neon' | 'supabase' | 'postgres' | 'sqlite'>('neon');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const envContent = `# ClassAttendance_env Environment Configuration
# Virtual Environment: ClassAttendance_env
DJANGO_SECRET_KEY=django-insecure-smart-attendance-key-2026-xyz
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.run.app,.vercel.app

# Database Selection (Current: ${selectedDb.toUpperCase()})
${
  selectedDb === 'neon'
    ? `# Neon Tech PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_secret123@ep-cool-resonance-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
    : selectedDb === 'supabase'
    ? `# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:your_supabase_password@db.xxxxxx.supabase.co:5432/postgres`
    : selectedDb === 'postgres'
    ? `# Standard PostgreSQL
DATABASE_URL=postgres://attendance_user:password123@localhost:5432/class_attendance_db`
    : `# SQLite Demo
DATABASE_URL=sqlite:///db.sqlite3`
}

# Google Sheets Sync Webhook (Optional)
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Django &amp; PostgreSQL Backend Architecture
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Virtual Environment: <code className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">ClassAttendance_env</code> • PostgreSQL / Neon / Supabase REST API
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Production Ready Structure
          </span>
        </div>
      </div>

      {/* Database Switcher Options */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">1. Select Target Relational Database</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'neon', name: 'Neon Tech', desc: 'Serverless PostgreSQL', color: 'emerald' },
            { id: 'supabase', name: 'Supabase', desc: 'Cloud PostgreSQL + Auth', color: 'emerald' },
            { id: 'postgres', name: 'Local PostgreSQL', desc: 'Standard pgAdmin / RDS', color: 'blue' },
            { id: 'sqlite', name: 'SQLite3', desc: 'Zero-config Demo DB', color: 'slate' }
          ].map(db => (
            <button
              key={db.id}
              onClick={() => setSelectedDb(db.id as any)}
              className={`p-3.5 rounded-xl border text-left transition ${
                selectedDb === db.id
                  ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-xs text-slate-900">{db.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{db.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Environment & File Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              2. Backend .env File (<span className="text-purple-600 font-mono">ClassAttendance_env</span>)
            </h3>
          </div>

          <button
            onClick={() => copyToClipboard(envContent, 'env')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center transition"
          >
            {copiedFile === 'env' ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Copied .env!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy .env
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto leading-relaxed">
          {envContent}
        </pre>
      </div>

      {/* Execution Commands for Django */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">
            3. Setup &amp; Activation Commands
          </h3>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2">
            <div className="text-slate-400"># 1. Create and Activate Virtual Environment with your requested name:</div>
            <div className="text-emerald-400">python3 -m venv ClassAttendance_env</div>
            <div className="text-emerald-400">source ClassAttendance_env/bin/activate  # On Windows: ClassAttendance_env\Scripts\activate</div>
            
            <div className="text-slate-400 pt-2"># 2. Install dependencies:</div>
            <div className="text-emerald-400">pip install -r Backend/requirements.txt</div>

            <div className="text-slate-400 pt-2"># 3. Run database migrations:</div>
            <div className="text-emerald-400">python manage.py makemigrations</div>
            <div className="text-emerald-400">python manage.py migrate</div>

            <div className="text-slate-400 pt-2"># 4. Start the Django API server:</div>
            <div className="text-emerald-400">python manage.py runserver 8000</div>
          </div>
        </div>
      </div>
    </div>
  );
};
