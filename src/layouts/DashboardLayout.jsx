import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import NotificationPopup from '../components/NotificationPopup';
import { 
  LayoutDashboard, 
  UploadCloud, 
  PlayCircle, 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Sparkles,
  Compass,
  Code,
  MessageSquare,
  ShieldAlert,
  User,
  Bell
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout, theme, toggleTheme } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  // Close sidebar on mobile routes change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // run once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar drawer automatically on navigation on mobile screens
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Sync', path: '/resume-upload', icon: UploadCloud },
    { name: 'Interview Lab', path: '/interview/setup', icon: PlayCircle },
    { name: 'Coding Sandbox', path: '/coding', icon: Code },
    { name: 'Roadmap Track', path: '/roadmap', icon: Compass },
    { name: 'AI Coach Chat', path: '/chatbot', icon: MessageSquare },
    { name: 'Performance Analytics', path: '/performance-analytics', icon: BarChart3 },
    { name: 'Interview History', path: '/interview-history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`h-screen overflow-hidden font-sans flex ${theme === 'dark' ? 'bg-dark-bg text-gray-200' : 'bg-light-bg text-gray-800'}`}>
      
      {/* Sidebar for desktop, overlay drawer for mobile */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'} 
        lg:translate-x-0 lg:static lg:h-full lg:flex lg:flex-col`}
      >
        {/* Brand Header */}
        <div className={`h-16 px-6 flex items-center justify-between border-b ${theme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
          <Link to="/dashboard" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-1.5 rounded-lg text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
              PrepAI
            </span>
          </Link>
          <button className="lg:hidden p-1 text-gray-400 hover:text-gray-200" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? (theme === 'dark' ? 'bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 font-medium border border-indigo-100')
                    : (theme === 'dark' ? 'text-gray-400 hover:bg-dark-hover hover:text-gray-100' : 'text-gray-600 hover:bg-light-hover hover:text-gray-900')
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-200'
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
          <Link to="/profile" className="flex items-center gap-3 mb-4 px-2 hover:bg-light-hover dark:hover:bg-dark-hover py-1.5 rounded-xl transition-all cursor-pointer shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold font-display shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate">{user?.name || 'Guest User'}</h4>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.tier || 'Free Tier'}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 
              ${theme === 'dark' 
                ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20' 
                : 'text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100'
              }`}
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Navbar */}
        <header className={`h-16 px-6 flex items-center justify-between border-b ${
          theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
        }`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg border ${
                theme === 'dark' ? 'border-dark-border text-gray-300 hover:bg-dark-hover' : 'border-light-border text-gray-600 hover:bg-light-hover'
              } lg:hidden`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display font-bold text-lg hidden sm:block">
              {location.pathname === '/dashboard' && 'Welcome back! Practice makes perfect.'}
              {location.pathname === '/resume-upload' && 'Resume ATS Analysis'}
              {location.pathname.startsWith('/interview') && 'AI Simulated Interview'}
              {location.pathname === '/analytics' && 'Growth Insights'}
              {location.pathname === '/history' && 'Practice Records'}
              {location.pathname === '/profile' && 'Professional Profile Settings'}
              {location.pathname === '/coding' && 'Interactive Coding Sandbox'}
              {location.pathname === '/roadmap' && 'Learning Path Milestones'}
              {location.pathname === '/chatbot' && 'AI Career Advisor Chat'}
              {location.pathname === '/admin' && 'Admin Cockpit Panel'}
              {location.pathname === '/settings' && 'System Preferences'}
              {location.pathname === '/interview-history' && 'Mock Interview History Ledger'}
              {location.pathname === '/performance-analytics' && 'Technical Performance Dashboard'}
              {location.pathname === '/notifications' && 'Notifications Hub'}
              {location.pathname === '/admin/users' && 'Admin Accounts Directory'}
              {location.pathname === '/admin/questions' && 'Admin Question Catalog'}
              {location.pathname === '/admin/analytics' && 'Admin System Analytics'}
            </h1>
          </div>

          <div className="flex items-center gap-4">

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme mode"
              className={`p-2 rounded-xl border transition-all ${
                theme === 'dark' ? 'border-dark-border text-gray-300 hover:bg-dark-hover' : 'border-light-border text-gray-600 hover:bg-light-hover'
              }`}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notifications Popup */}
            <button
              onClick={() => setIsNotificationPopupOpen(!isNotificationPopupOpen)}
              className={`p-2 rounded-xl border relative transition-all ${
                theme === 'dark' ? 'border-dark-border text-gray-300 hover:bg-dark-hover' : 'border-light-border text-gray-600 hover:bg-light-hover'
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-dark-card animate-pulse" />
            </button>

            {/* Quick action button */}
            <Link 
              to="/interview/setup"
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <PlayCircle className="h-4.5 w-4.5" />
              <span>Start Session</span>
            </Link>
          </div>
        </header>

        {/* Notification Popup */}
        <NotificationPopup 
          isOpen={isNotificationPopupOpen} 
          onClose={() => setIsNotificationPopupOpen(false)}
        />

        {/* Dynamic page content container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile Sidebar overlay backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
