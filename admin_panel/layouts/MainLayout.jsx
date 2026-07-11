import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import TopNavbar from '../common/TopNavbar/TopNavbar';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AdminUsers from '../components/accounts/users/AdminUsers';
import AdminPayments from '../components/payments/AdminPayments';
import AdminInterviews from '../components/interviews/AdminInterviews';
import AdminQuestions from '../components/questions/AdminQuestions';
import AdminReports from '../reports/AdminReports';
import AdminNotifications from '../components/notifications/AdminNotifications';
import AdminLogs from '../components/logs/AdminLogs';
import AdminSupport from '../components/support/AdminSupport';
import AdminSettings from '../components/settings/AdminSettings';
import AdminDatabase from '../components/database/AdminDatabase';
import AdminSystem from '../components/system/AdminSystem';
import Profile from '../components/accounts/profile/Profile';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <TopNavbar />
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/interviews" element={<AdminInterviews />} />
            <Route path="/questions" element={<AdminQuestions />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/notifications" element={<AdminNotifications />} />
            <Route path="/logs" element={<AdminLogs />} />
            <Route path="/support" element={<AdminSupport />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/database" element={<AdminDatabase />} />
            <Route path="/system" element={<AdminSystem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
