import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  UserCheck,
  FileSpreadsheet,
  Settings,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      bengaliLabel: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'attendance',
      label: 'Mark Attendance',
      bengaliLabel: 'অ্যাটেনডেন্স নিন',
      icon: ClipboardCheck,
      badge: 'Daily'
    },
    {
      id: 'sheetview',
      label: 'Live Excel Sheet',
      bengaliLabel: 'এক্সেল শিট ভিউ',
      icon: FileSpreadsheet,
      badge: 'Realtime'
    },
    {
      id: 'students',
      label: 'Student Registry',
      bengaliLabel: 'শিক্ষার্থী তালিকা ও ইম্পোর্ট',
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'teachers',
      label: 'Teacher Assignment',
      bengaliLabel: 'শিক্ষক ও কোর্স অ্যাসাইন',
      icon: UserCheck,
      badge: null
    },
    // {
    //   id: 'backend',
    //   label: 'Backend & Django Sync',
    //   bengaliLabel: 'ব্যাকএন্ড ও ডেটাবেজ কনফিগ',
    //   icon: Database,
    //   badge: 'Env'
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings & Webhook',
    //   bengaliLabel: 'সেটিংস ও গুগল শিট',
    //   icon: Settings,
    //   badge: null
    // }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center space-x-3 text-left">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                />
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {item.bengaliLabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Database & Sync Status Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-700">Storage Engine</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Attendance entries write instantaneously to memory &amp; Excel sheets with zero data loss.
        </p>
      </div>
    </aside>
  );
};
