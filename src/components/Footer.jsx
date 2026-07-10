import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-light-border dark:border-dark-border py-12 px-6 md:px-12 bg-white/70 dark:bg-dark-card/50 backdrop-blur-md text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-1.5 rounded-lg text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
              PrepAI
            </span>
          </Link>
          <p className="text-xs leading-relaxed">
            Empowering engineers and professionals with AI-driven resume analysis and lifelike simulated interviews to land their dream job.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/resume-upload" className="hover:text-indigo-500 transition-colors">ATS Resume Scanner</Link></li>
            <li><Link to="/interview/setup" className="hover:text-indigo-500 transition-colors">Mock Interview Arena</Link></li>
            <li><Link to="/analytics" className="hover:text-indigo-500 transition-colors">Analytics Tracking</Link></li>
            <li><Link to="/pricing" className="hover:text-indigo-500 transition-colors">Pricing Models</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/contact" className="hover:text-indigo-500 transition-colors">Contact Support</Link></li>
            <li><Link to="/faq" className="hover:text-indigo-500 transition-colors">Frequently Asked Questions</Link></li>
            <li><a href="#" className="hover:text-indigo-500 transition-colors">Tech Stack Syllabi</a></li>
            <li><a href="#" className="hover:text-indigo-500 transition-colors">API Docs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Legal & Company</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-indigo-500 transition-colors">About Us</Link></li>
            <li><Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms of Service</Link></li>
            <li><a href="#" className="hover:text-indigo-500 transition-colors">Careers</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-light-border dark:border-dark-border max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
        <p>AI Interview Platform © 2026. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 items-center">
          <Link to="/" className="hover:text-indigo-500 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-indigo-500 transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-indigo-500 transition-colors">Contact</Link>
          <Link to="/faq" className="hover:text-indigo-500 transition-colors">FAQ</Link>
          <div className="h-4 w-px bg-light-border dark:bg-dark-border mx-1"></div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
            <FaGithub size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
            <FaLinkedin size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
