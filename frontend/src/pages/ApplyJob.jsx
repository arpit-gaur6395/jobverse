import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { API_URL } from "../config/api";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const checkApplicationStatus = async () => {
    try {
      const response = await axiosInstance.get(`/jobs/check-status/${id}`);
      setHasApplied(response.data.hasApplied);
    } catch (err) {
      console.error("Error checking application status:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'resume' || e.target.name === 'photo') {
      // Handle file inputs
      return; // Don't update state for file inputs
    }
    // Handle other inputs if needed in the future
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "seeker") {
      alert("You must be logged in as a Job Seeker to apply.");
      return;
    }

    if (hasApplied) {
      alert("You have already applied to this job.");
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Get file inputs
      const form = e.target;
      const resumeFile = form.resume?.files[0];
      const photoFile = form.photo?.files[0];

      // Append files if they exist
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await axiosInstance.post(`/jobs/apply/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("Applied successfully!");
      setHasApplied(true);
      navigate("/");
    } catch (err) {
      console.error("Failed to apply:", err);
      const errorMessage = err.response?.data?.message || "Failed to apply. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Apply for Job</h2>

      {/* User verification section */}
      <div style={{ backgroundColor: "#e8f5e8", border: "1px solid #4caf50", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h4 style={{ color: "#2e7d32", margin: "0 0 10px 0" }}>🔒 Verified Applicant Information</h4>
        <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
          This application will be submitted using your logged-in account details to prevent fraud.
        </p>
      </div>

      {hasApplied ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h3>Already Applied</h3>
          <p>You have already submitted an application for this position.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Back to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#374151" }}>Full Name</label>
            <input
              name="name"
              value={formData.name}
              readOnly
              disabled
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                cursor: "not-allowed"
              }}
            />
            <small style={{ color: "#6b7280", fontSize: "12px" }}>
              Automatically populated from your account
            </small>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#374151" }}>Email Address</label>
            <input
              name="email"
              value={formData.email}
              readOnly
              disabled
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                cursor: "not-allowed"
              }}
            />
            <small style={{ color: "#6b7280", fontSize: "12px" }}>
              Automatically populated from your account
            </small>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#374151" }}>Resume (Optional)</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#374151" }}>Photo (Optional)</label>
            <input
              type="file"
              name="photo"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: loading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </form>
      )}
      <Footer />
    </div>
  );
}

export default ApplyJob;
