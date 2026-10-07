import React from 'react';
import { DashboardOverview } from '../components/dashboard/DashboardOverview';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  return <DashboardOverview setActiveTab={setActiveTab} />;
};
