import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layout Wrappers
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/Public/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import PricingPage from './pages/Public/PricingPage';
import Contact from './pages/Public/Contact';
import About from './pages/Public/About';
import PrivacyPolicy from './pages/Public/PrivacyPolicy';
import Terms from './pages/Public/Terms';
import FAQ from './pages/Public/FAQ';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';

// Authenticated Dashboard Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import ResumeUploadPage from './pages/Interview/ResumeUploadPage';
import InterviewSetupPage from './pages/Interview/InterviewSetupPage';
import InterviewSessionPage from './pages/Interview/InterviewSessionPage';
import ResultsPage from './pages/Interview/ResultsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import HistoryPage from './pages/Interview/HistoryPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import CodingPage from './pages/Coding/CodingPage';
import RoadmapPage from './pages/Roadmap/RoadmapPage';
import ChatBot from './pages/Chat/ChatBot';
import SettingsPage from './pages/Dashboard/SettingsPage';

// Phase 2 New Pages
import InterviewHistoryPage from './pages/Interview/InterviewHistoryPage';
import PerformanceAnalyticsPage from './pages/Analytics/PerformanceAnalyticsPage';
import NotificationsPage from './pages/Dashboard/NotificationsPage';

// Isolated Admin Components
import AdminLoginPage from '../admin_panel/components/auth/login/Login.jsx';
import AdminMainLayout from '../admin_panel/layouts/MainLayout.jsx';
import { AuthProvider as AdminAuthProvider } from '../admin_panel/context/AuthContext.jsx';

// Simple Route Protection wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

// Public Page layout wrapper
function PublicRoute({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

// Admin Route Protection wrapper
function AdminProtectedRoute({ children }) {
  const adminAccessToken = localStorage.getItem('admin_access_token');
  const adminUser = localStorage.getItem('admin_user');
  
  if (!adminAccessToken || !adminUser) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
}

export default function App() {
  const { initTheme } = useAuthStore();

  // Initialize theme classes and handle session expirations
  useEffect(() => {
    initTheme();

    const handleAuthExpired = () => {
      // Clear local storage and reset auth state to trigger redirect to /login
      localStorage.removeItem('auth_user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      useAuthStore.getState().setUser(null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [initTheme]);

  return (
    <Router>
      <Routes>
        
        {/* Public Landing & Authentication */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/pricing" element={<PublicRoute><PricingPage /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
        <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
        <Route path="/privacy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/terms" element={<PublicRoute><Terms /></PublicRoute>} />
        <Route path="/faq" element={<PublicRoute><FAQ /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
        
        {/* Protected Dashboard Channels */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/resume-upload" element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />
        <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetupPage /></ProtectedRoute>} />
        <Route path="/interview/session" element={<ProtectedRoute><InterviewSessionPage /></ProtectedRoute>} />
        <Route path="/interview/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/coding" element={<ProtectedRoute><CodingPage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Phase 2 Protected Pages */}
        <Route path="/interview-history" element={<ProtectedRoute><InterviewHistoryPage /></ProtectedRoute>} />
        <Route path="/performance-analytics" element={<ProtectedRoute><PerformanceAnalyticsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        {/* Isolated Admin Portal */}
        <Route path="/adminlogin" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <AdminAuthProvider>
              <AdminMainLayout />
            </AdminAuthProvider>
          </AdminProtectedRoute>
        } />

        {/* Fallback Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}


