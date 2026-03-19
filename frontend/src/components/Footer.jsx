import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-3 sm:mb-4">JobVerse</h2>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              Your gateway to career opportunities
            </p>

            <p className="text-gray-400 mb-4 text-xs sm:text-sm">
              Connecting talented professionals with their dream jobs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>

            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/login" className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base">Get Started</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base">About Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center">
              {new Date().getFullYear()} JobVerse. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
              <Link to="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors text-xs sm:text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-amber-400 transition-colors text-xs sm:text-sm">Terms</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-amber-400 transition-colors text-xs sm:text-sm">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 hover:transform hover:-translate-y-1 flex items-center justify-center text-sm sm:text-lg sm:text-xl font-bold" onClick={scrollToTop}>
          ↑
        </button>

      </div>
    </footer>
  );
}