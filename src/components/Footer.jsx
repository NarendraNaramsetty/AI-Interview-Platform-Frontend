import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <div className="bg-green-500 p-2 rounded-lg text-white">
            <Sparkles className="w-4 h-4" />
          </div>

          <span className="text-green-600">
            PrepAI
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/about" className="hover:text-green-600">
            About
          </Link>

          <Link to="/pricing" className="hover:text-green-600">
            Pricing
          </Link>

          <Link to="/faq" className="hover:text-green-600">
            FAQ
          </Link>

          <Link to="/contact" className="hover:text-green-600">
            Contact
          </Link>

          <Link to="/privacy" className="hover:text-green-600">
            Privacy
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PrepAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}