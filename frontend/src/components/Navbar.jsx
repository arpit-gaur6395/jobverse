import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useAppSelector } from "../store/hooks";

// ========================================
// 🧭 NAVBAR COMPONENT
// ========================================

/**
 * Main navigation component with responsive design
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const reduxUser = useAppSelector(state => state.auth.user);

  // Test Redux - log to console
  console.log('Redux Test - Auth State:', reduxUser);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close mobile menu
  const closeMenu = () => setIsOpen(false);

  // Toggle profile dropdown
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Close profile dropdown
  const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        closeProfileDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 bg-blue-900/95 backdrop-blur-lg border-b border-amber-500/15 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-blue-900/98 shadow-lg border-amber-500/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center text-decoration-none transition-all duration-150 ease-in-out hover:scale-105 relative" onClick={closeMenu}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L2 7V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H20C20.5304 19 21.0391 18.7893 21.4142 18.4142C21.7893 18.0391 22 17.5304 22 17V7L12 2Z" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M12 22V12" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 22V16" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 22V16" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="3" fill="url(#logoGradient)" opacity="0.8" />
                  <path d="M7 8L9 10L15 4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12L14 14L18 10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-xl font-bold text-white">Job</span>
                <span className="text-lg sm:text-xl font-bold text-amber-400">Verse</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-white hover:text-amber-400 transition-colors duration-200 font-medium">
              <span>Home</span>
            </Link>

            {user?.role !== "employer" && (
              <Link to="/about" className="text-white hover:text-amber-400 transition-colors duration-200 font-medium">
                <span>About Us</span>
              </Link>
            )}

            {user?.role === "employer" && (
              <Link to="/postjob" className="text-white hover:text-amber-400 transition-colors duration-200 font-medium">
                <span>Post Job</span>
              </Link>
            )}


            {/* User Menu */}
            {!user ? (
              <div className="flex items-center gap-3 lg:gap-4">
                <Link to="/login" className="px-4 lg:px-6 py-2 bg-gradient-to-r from-amber-400 to-red-400 text-white rounded-lg hover:from-amber-500 hover:to-red-500 transition-all duration-200 font-medium shadow-lg text-sm">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="profile-dropdown-container relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 lg:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm lg:text-base">{user.name}</span>
                    <span className="text-gray-300 text-xs lg:text-sm">
                      {user.role === "seeker" ? "👤 Job Seeker" : "🏢 Employer"}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    {user.role === "employer" ? (
                      <>
                        <Link
                          to="/my-posted-jobs"
                          onClick={closeProfileDropdown}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          📊 Employer Dashboard
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={() => { logout(); closeProfileDropdown(); }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/my-applications"
                          onClick={closeProfileDropdown}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          📋 Applied Jobs
                        </Link>
                        <Link
                          to="/resume-analysis"
                          onClick={closeProfileDropdown}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          🤖 AI Resume Analysis
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={() => { logout(); closeProfileDropdown(); }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          🚪 Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden flex flex-col gap-1 p-2 relative z-50`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-blue-900/98 backdrop-blur-lg z-[60] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* User Info Section */}
          <div className="p-4 sm:p-6 border-b border-white/10">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium text-base">{user.name}</div>
                    <div className="text-gray-300 text-sm">
                      {user.role === "seeker" ? "👤 Job Seeker" : "🏢 Employer"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {user.role === "employer" ? (
                    <Link
                      to="/my-posted-jobs"
                      onClick={closeMenu}
                      className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 17V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 17V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Employer Dashboard</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/my-applications"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 11L15 11M9 15L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Applied Jobs</span>
                      </Link>
                      <Link
                        to="/resume-analysis"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>AI Resume Analysis</span>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="flex items-center gap-3 text-red-300 hover:text-red-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10 w-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-300 text-base">Guest User</div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-4 sm:p-6 space-y-2 overflow-y-auto">
            <Link
              to="/"
              className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
              onClick={closeMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.7893 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Home</span>
            </Link>

            {user?.role !== "employer" && (
              <Link
                to="/about"
                className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
                onClick={closeMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>About Us</span>
              </Link>
            )}

            {user?.role === "employer" && (
              <Link
                to="/postjob"
                className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
                onClick={closeMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V12M12 12H18M12 12L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Post Job</span>
              </Link>
            )}


            {!user && (
              <Link
                to="/login"
                className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors duration-200 p-3 rounded-lg hover:bg-white/10"
                onClick={closeMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M15 3V19M15 3L12 6M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9M9 21V3M9 21L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Get Started</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
