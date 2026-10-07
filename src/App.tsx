/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AttendanceProvider } from './Context/AttendanceContext';
import { MainLayout } from './Layouts/MainLayout';
import { AppRouter } from './routers/AppRouter';

export default function App() {
  return (
    <AttendanceProvider>
      <MainLayout>
        {(activeTab, setActiveTab) => (
          <AppRouter activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </MainLayout>
    </AttendanceProvider>
  );
}
