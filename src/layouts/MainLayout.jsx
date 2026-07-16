import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Sun, Moon, ArrowRight, Menu, X, Info, DollarSign, HelpCircle, Phone, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  const { user, logout, theme, toggleTheme } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const publicNavLinks = [
    { name: 'About', path: '/about', icon: Info },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <div className={`min-h-screen font-sans flex flex-col ${theme === 'dark' ? 'bg-dark-bg text-gray-200' : 'bg-light-bg text-gray-800'}`}>
      
      {/* Header */}
      <header className={`h-16 px-6 md:px-12 flex items-center justify-between border-b sticky top-0 z-50 backdrop-blur-md bg-opacity-70 ${
        theme === 'dark' ? 'bg-dark-bg/85 border-dark-border' : 'bg-white/85 border-light-border'
      }`}>
        {/* Left Side: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-1.5 rounded-lg text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
            PrepAI
          </span>
        </Link>

        {/* Center Navigation Links (Desktop only) */}
        <nav className="hidden lg:flex items-center gap-6">
          {publicNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-all duration-200 hover:text-indigo-500 ${
                  isActive 
                    ? 'text-indigo-500 border-b-2 border-indigo-500 py-1' 
                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Theme & User actions */}
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

          {/* Desktop User actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-dark-hover' : 'text-gray-600 hover:text-gray-900 hover:bg-light-hover'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger toggle button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Toggle navigation menu"
            className={`lg:hidden p-2 rounded-xl border transition-all ${
              theme === 'dark' ? 'border-dark-border text-gray-300 hover:bg-dark-hover' : 'border-light-border text-gray-600 hover:bg-light-hover'
            }`}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile navigation side drawer */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-xs border-l shadow-2xl transition-transform duration-300 transform lg:hidden flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } ${theme === 'dark' ? 'bg-dark-card border-dark-border text-gray-200' : 'bg-white border-light-border text-gray-800'}`}
        ref={drawerRef}
      >
        {/* Drawer Header */}
        <div className={`h-16 px-6 flex items-center justify-between border-b ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg tracking-tight" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-1 rounded-lg text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span>PrepAI</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
            className={`p-1.5 rounded-lg border transition-all ${
              theme === 'dark' ? 'border-dark-border text-gray-300 hover:bg-dark-hover' : 'border-light-border text-gray-600 hover:bg-light-hover'
            }`}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Drawer Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {publicNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? theme === 'dark' ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'bg-indigo-50 text-indigo-600 font-medium'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-dark-hover hover:text-gray-100' : 'text-gray-600 hover:bg-light-hover hover:text-gray-900'
                }`}
              >
                <LinkIcon className="h-4.5 w-4.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer / User section */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
          {user ? (
            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  theme === 'dark' 
                    ? 'border-dark-border text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' 
                    : 'border-light-border text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  theme === 'dark' ? 'bg-dark-hover hover:bg-dark-border text-gray-200' : 'bg-light-hover hover:bg-light-border text-gray-800'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white transition-all shadow-md shadow-indigo-500/10"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-45 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main body */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
