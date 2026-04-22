import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, getBaseUrl } from '../config/api';
import axiosInstance from "../config/axios";
import { AuthContext } from "../context/authContext";
import Footer from "../components/Footer";

export default function ViewApplicants() {
    const { jobId } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Wait for auth to load before checking user
        if (!authLoading) {
            if (!user) {
                navigate("/login");
                return;
            }

            if (user.role !== "employer") {
                navigate("/");
                return;
            }

            fetchJobDetails();
            fetchApplicants();
        }
    }, [authLoading]); // Only run when auth loading changes

    const fetchJobDetails = async () => {
        try {
            const response = await axiosInstance.get(`/jobs/my-jobs`);
            const userJob = response.data.find(j => j._id === jobId);
            if (userJob) {
                setJob(userJob);
            } else {
                setError("Job not found or you don't have permission to view this job.");
            }
        } catch (err) {
            console.error("Error fetching job details:", err);
            setError("Failed to fetch job details.");
        }
    };

    const fetchApplicants = async () => {
        try {
            const response = await axiosInstance.get(`/jobs/applicants/${jobId}`);
            console.log("Fetched applicants:", response.data);
            setApplicants(response.data);
        } catch (err) {
            console.error("Error fetching applicants:", err);
            setError("Failed to fetch applicants.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicantId, newStatus) => {
        // Store original state before any operations
        const originalApplicants = [...applicants];

        try {
            console.log(`Updating status for applicant ${applicantId} to: ${newStatus}`);
            console.log('Current user from context:', user);
            console.log('Token in localStorage:', localStorage.getItem('token'));

            // Show loading state
            setApplicants(applicants.map(app =>
                app._id === applicantId ? { ...app, status: 'updating...' } : app
            ));

            // Update status on backend
            const response = await axiosInstance.patch(`/jobs/application/${applicantId}/status/verbose`, {
                status: newStatus
            });

            console.log("Status update response:", response.data);

            // Update local state with new status
            setApplicants(applicants.map(app =>
                app._id === applicantId ? { ...app, status: newStatus } : app
            ));

            // Show success message
            alert(`Application status updated to ${newStatus} successfully!`);

        } catch (err) {
            console.error("Failed to update application status:", err);

            // Restore original state on error
            setApplicants(originalApplicants);

            // Show more detailed error message
            let errorMessage = "Failed to update application status";

            if (err.response?.data) {
                const errorData = err.response.data;
                if (errorData.details) {
                    // Show detailed error from verbose endpoint
                    errorMessage = `${errorData.message}\n\nDetails:\n` +
                        `- Job Owner: ${errorData.details.jobOwnerId}\n` +
                        `- Your ID: ${errorData.details.currentEmployerId}\n` +
                        `- Job: ${errorData.details.jobTitle} at ${errorData.details.jobCompany}`;
                } else {
                    errorMessage = errorData.message || errorMessage;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(`Error: ${errorMessage}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'updating...': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getResumeUrl = (filePath) => {
        if (!filePath) return null;
        const baseUrl = getBaseUrl();
        // If path already includes /uploads/, use it directly
        if (filePath.includes('/uploads/')) {
            return `${baseUrl}${filePath}`;
        }
        // Otherwise, assume it's just a filename
        return `${baseUrl}/uploads/${filePath}`;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'reviewed': return '👀';
            case 'accepted': return '✅';
            case 'rejected': return '❌';
            case 'updating...': return '🔄';
            default: return '❓';
        }
    };

    const handleDeleteApplicant = async (applicantId) => {
        if (!window.confirm("Are you sure you want to delete this applicant?")) return;

        try {
            await axiosInstance.delete(`/jobs/applicant/${applicantId}`);
            setApplicants(applicants.filter(app => app._id !== applicantId));
        } catch (err) {
            console.error("Failed to delete applicant:", err);
            alert("Failed to delete applicant");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading applicants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl p-8 max-w-md">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-gray-800 mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/my-posted-jobs")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to My Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 min-h-screen bg-gradient-to-br from-blue-900 to-gray-700">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <button
                                onClick={() => navigate("/my-posted-jobs")}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                            >
                                ← Back to My Jobs
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">Applicants</h1>
                        </div>

                        {job && (
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                                <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2">{job.job}</h2>
                                <p className="text-blue-700 mb-2 text-sm sm:text-base">{job.company}</p>
                                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
                                    <span>📍 {job.location}</span>
                                    <span>💰 {job.salary}</span>
                                    <span>📊 {job.jobType || "Full-time"}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Applicants List */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Candidates Overview</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-medium text-gray-600">Total Applicants:</span>
                                <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">
                                    {applicants.length}
                                </span>
                            </div>
                        </div>

                        {applicants.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-600 bg-gray-50 rounded-lg">
                                <div className="text-4xl sm:text-6xl mb-4">📋</div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Applicants Yet</h3>
                                <p className="text-sm sm:text-base">No candidates have applied for this position yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                {applicants.map((applicant) => (
                                    <div key={applicant._id} className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{applicant.name}</h3>
                                                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                                                        <span className="mr-1">{getStatusIcon(applicant.status)}</span>
                                                        {applicant.status || 'pending'}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mb-2 text-sm sm:text-base">{applicant.email}</p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Applied on: {formatDate(applicant.appliedAt)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                                                <select
                                                    value={applicant.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                                                    disabled={applicant.status === 'updating...'}
                                                    className={`px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto ${applicant.status === 'updating...'
                                                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                                                        : 'border-gray-300 bg-white cursor-pointer'
                                                        }`}
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="reviewed">👀 Reviewed</option>
                                                    <option value="accepted">✅ Accept</option>
                                                    <option value="rejected">❌ Reject</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteApplicant(applicant._id)}
                                                    className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            {applicant.photo && (
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-medium text-gray-600 mb-2">Photo:</p>
                                                    <a
                                                        href={`${getBaseUrl()}/uploads/${applicant.photo}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const url = `${getBaseUrl()}/uploads/${applicant.photo}`;
                                                            console.log('Photo URL:', url);
                                                            console.log('Applicant photo field:', applicant.photo);
                                                            window.open(url, '_blank');
                                                        }}
                                                    >
                                                        <img
                                                            src={`${getBaseUrl()}/uploads/${applicant.photo}`}
                                                            alt="Applicant Photo"
                                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
                                                        />
                                                    </a>
                                                </div>
                                            )}

                                            {applicant.resume && (
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-medium text-gray-600 mb-2">Resume:</p>
                                                    <a
                                                        href={`${getBaseUrl()}/uploads/${applicant.resume}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const url = `${getBaseUrl()}/uploads/${applicant.resume}`;
                                                            console.log('Resume URL:', url);
                                                            console.log('Applicant resume field:', applicant.resume);
                                                            window.open(url, '_blank');
                                                        }}
                                                    >
                                                        📄 View Resume
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
