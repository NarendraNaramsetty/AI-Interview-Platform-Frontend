import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  const { user, theme, toggleTheme } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen font-sans flex flex-col ${theme === 'dark' ? 'bg-dark-bg text-gray-200' : 'bg-light-bg text-gray-800'}`}>
      {/* Header */}
      <header className={`h-16 px-6 md:px-12 flex items-center justify-between border-b sticky top-0 z-50 backdrop-blur-md bg-opacity-70 ${
        theme === 'dark' ? 'bg-dark-bg/85 border-dark-border' : 'bg-white/85 border-light-border'
      }`}>
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-1.5 rounded-lg text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
            PrepAI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 flex items-center gap-1"
            >
              <span>Go to Dashboard</span>
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
      </header>

      {/* Main body */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
