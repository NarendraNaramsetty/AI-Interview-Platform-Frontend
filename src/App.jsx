import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layout Wrappers
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
const LandingPage = React.lazy(() => import('./pages/Public/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/Auth/RegisterPage'));
const PricingPage = React.lazy(() => import('./pages/Public/PricingPage'));
const Contact = React.lazy(() => import('./pages/Public/Contact'));
const About = React.lazy(() => import('./pages/Public/About'));
const PrivacyPolicy = React.lazy(() => import('./pages/Public/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Public/Terms'));
const FAQ = React.lazy(() => import('./pages/Public/FAQ'));
const ForgotPasswordPage = React.lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/Auth/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/Auth/VerifyEmailPage'));

// Authenticated Dashboard Pages
const DashboardPage = React.lazy(() => import('./pages/Dashboard/DashboardPage'));
const ResumeUploadPage = React.lazy(() => import('./pages/Interview/ResumeUploadPage'));
const InterviewSetupPage = React.lazy(() => import('./pages/Interview/InterviewSetupPage'));
const InterviewSessionPage = React.lazy(() => import('./pages/Interview/InterviewSessionPage'));
const ResultsPage = React.lazy(() => import('./pages/Interview/ResultsPage'));
const AnalyticsPage = React.lazy(() => import('./pages/Analytics/AnalyticsPage'));
const HistoryPage = React.lazy(() => import('./pages/Interview/HistoryPage'));
const ProfilePage = React.lazy(() => import('./pages/Dashboard/ProfilePage'));
const CodingPage = React.lazy(() => import('./pages/Coding/CodingPage'));
const RoadmapPage = React.lazy(() => import('./pages/Roadmap/RoadmapPage'));
const ChatBot = React.lazy(() => import('./pages/Chat/ChatBot'));
const SettingsPage = React.lazy(() => import('./pages/Dashboard/SettingsPage'));

// Phase 2 New Pages
const InterviewHistoryPage = React.lazy(() => import('./pages/Interview/InterviewHistoryPage'));
const PerformanceAnalyticsPage = React.lazy(() => import('./pages/Analytics/PerformanceAnalyticsPage'));
const NotificationsPage = React.lazy(() => import('./pages/Dashboard/NotificationsPage'));

// Isolated Admin Components
import AdminLoginPage from './admin_panel/components/auth/login/Login.jsx';
import AdminMainLayout from './admin_panel/layouts/MainLayout.jsx';
import { AuthProvider as AdminAuthProvider } from './admin_panel/context/AuthContext.jsx';

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

const RouteLoadingSpinner = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500"></div>
  </div>
);

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
      <React.Suspense fallback={<RouteLoadingSpinner />}>
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
      </React.Suspense>
    </Router>
  );
}


