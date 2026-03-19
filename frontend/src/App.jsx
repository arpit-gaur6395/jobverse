import { useState, useEffect } from 'react'
import Home from "./pages/Home"
import Login from './pages/Login'
import EditJob from "./pages/EditJob"
import ApplyJob from './pages/ApplyJob'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import AppliedJobs from './pages/AppliedJobs'
import MyApplications from './pages/MyApplications'
import MyPostedJobs from './pages/MyPostedJobs'
import ViewApplicants from './pages/ViewApplicants'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotificationSystem from "./components/NotificationSystem";
import { AuthProvider } from "./context/AuthContext";
import Postjob from './pages/Postjob';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <NotificationSystem />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/postjob" element={<Postjob />} />
            <Route path="/edit/:id" element={<EditJob />} />
            <Route path="/apply/:id" element={<ApplyJob />} />
            <Route path="/applied-jobs" element={<AppliedJobs />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/my-posted-jobs" element={<MyPostedJobs />} />
            <Route path="/applicants/:jobId" element={<ViewApplicants />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>

    </>
  )
}

export default App
