import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from 'react-redux';
import { AuthProvider } from "./context/authContext";
import store from './store/store';

// ========================================
// 📱 PAGE IMPORTS
// ========================================

// Authentication pages
import Login from './pages/Login';
import Register from './pages/Register';

// Job management pages
import Jobs from './pages/Jobs';
import Postjob from './pages/Postjob';
import EditJob from './pages/EditJob';
import ApplyJob from './pages/ApplyJob';

// Application pages
import AppliedJobs from './pages/AppliedJobs';
import MyApplications from './pages/MyApplications';
import MyPostedJobs from './pages/MyPostedJobs';
import ViewApplicants from './pages/ViewApplicants';
import ResumeAnalysis from './pages/ResumeAnalysis';

// Information pages
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

// Components
import Navbar from "./components/Navbar";
import NotificationSystem from "./components/NotificationSystem";

// ========================================
// 📱 UTILITY COMPONENTS
// ========================================

/**
 * Scroll to top component - resets scroll position on route change
 * @returns {null}
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * Main App component - Handles routing and global providers
 * @returns {JSX.Element}
 */
function App() {
  // Note: count state is not used, consider removing if not needed
  const [count, setCount] = useState(0);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <NotificationSystem />

          <main className="min-h-screen">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Job Management Routes */}
              <Route path="/postjob" element={<Postjob />} />
              <Route path="/edit/:id" element={<EditJob />} />
              <Route path="/apply/:id" element={<ApplyJob />} />
              <Route path="/jobs" element={<Jobs />} />

              {/* Application Management Routes */}
              <Route path="/applied-jobs" element={<AppliedJobs />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/my-posted-jobs" element={<MyPostedJobs />} />
              <Route path="/applicants/:jobId" element={<ViewApplicants />} />
              <Route path="/resume-analysis" element={<ResumeAnalysis />} />

              {/* Information Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />

              {/* Home Route - Default */}
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App
