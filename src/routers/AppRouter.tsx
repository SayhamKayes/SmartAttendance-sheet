import React from 'react';
import { DashboardPage } from '../pages/DashboardPage';
import { AttendancePage } from '../pages/AttendancePage';
import { SheetViewPage } from '../pages/SheetViewPage';
import { StudentsPage } from '../pages/StudentsPage';
import { TeachersPage } from '../pages/TeachersPage';
import { BackendPage } from '../pages/BackendPage';
import { SettingsPage } from '../pages/SettingsPage';

interface AppRouterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({ activeTab, setActiveTab }) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage setActiveTab={setActiveTab} />;
    case 'attendance':
      return <AttendancePage />;
    case 'sheetview':
      return <SheetViewPage />;
    case 'students':
      return <StudentsPage />;
    case 'teachers':
      return <TeachersPage />;
    // case 'backend':
    //   return <BackendPage />;
    // case 'settings':
    //   return <SettingsPage />;
    default:
      return <DashboardPage setActiveTab={setActiveTab} />;
  }
};
