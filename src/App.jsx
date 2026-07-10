import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layout Wrappers
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import PricingPage from './pages/PricingPage';
import Contact from './pages/Contact';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';

// Authenticated Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import ResultsPage from './pages/ResultsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import CodingPage from './pages/CodingPage';
import RoadmapPage from './pages/RoadmapPage';
import ChatbotPage from './pages/ChatbotPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';

// Phase 2 New Pages
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import PerformanceAnalyticsPage from './pages/PerformanceAnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminQuestionsPage from './pages/Admin/AdminQuestionsPage';
import AdminAnalyticsPage from './pages/Admin/AdminAnalyticsPage';

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

export default function App() {
  const { initTheme } = useAuthStore();

  // Initialize theme classes (dark mode by default)
  useEffect(() => {
    initTheme();
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
        <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Phase 2 Protected Pages */}
        <Route path="/interview-history" element={<ProtectedRoute><InterviewHistoryPage /></ProtectedRoute>} />
        <Route path="/performance-analytics" element={<ProtectedRoute><PerformanceAnalyticsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute><AdminQuestionsPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />

        {/* Fallback Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}


