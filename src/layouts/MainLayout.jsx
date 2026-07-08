import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';

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
      <footer className={`border-t py-12 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-dark-card border-dark-border text-gray-400' : 'bg-light-card border-light-border text-gray-500'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight text-white">
              <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-1.5 rounded-lg text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500`}>
                PrepAI
              </span>
            </Link>
            <p className="text-sm">
              Empowering engineers and professionals with AI-driven resume analysis and lifelike simulated interviews to land their dream job.
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resume-upload" className="hover:text-indigo-500">ATS Resume Scanner</Link></li>
              <li><Link to="/interview/setup" className="hover:text-indigo-500">Mock Interview Arena</Link></li>
              <li><Link to="/analytics" className="hover:text-indigo-500">Analytics Tracking</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-500">Pricing Models</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-indigo-500">Contact Support</Link></li>
              <li><a href="#" className="hover:text-indigo-500">Tech Stack Syllabi</a></li>
              <li><a href="#" className="hover:text-indigo-500">API Docs</a></li>
              <li><a href="#" className="hover:text-indigo-500">Community Forums</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-indigo-500">About Us</Link></li>
              <li><a href="#" className="hover:text-indigo-500">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-500">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className={`pt-8 border-t max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs ${
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        }`}>
          <p>© {new Date().getFullYear()} PrepAI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-500">Twitter</a>
            <a href="#" className="hover:text-indigo-500">GitHub</a>
            <a href="#" className="hover:text-indigo-500">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
