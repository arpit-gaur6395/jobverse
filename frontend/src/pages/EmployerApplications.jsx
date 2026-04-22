import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { API_URL, getBaseUrl } from "../config/api";
import { AuthContext } from "../context/authContext";
import Footer from "../components/Footer";

export default function EmployerApplications() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedJob, setSelectedJob] = useState("all");
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [deletingApplication, setDeletingApplication] = useState(null);
    const [expandedJobs, setExpandedJobs] = useState(new Set());

    useEffect(() => {
        if (authLoading) return; // Wait for auth to finish loading

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "employer") {
            navigate("/");
            return;
        }

        fetchEmployerData();
    }, [user, navigate, authLoading]);

    const fetchEmployerData = async () => {
        try {
            // Fetch employer's jobs
            const jobsResponse = await axiosInstance.get("/jobs/my-jobs");
            setJobs(jobsResponse.data);

            // Fetch all applications for employer's jobs
            const applicationsResponse = await axiosInstance.get("/jobs/employer-applications");
            setApplications(applicationsResponse.data);
        } catch (err) {
            console.error("Error fetching employer data:", err);
            setError("Failed to fetch your applications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        setUpdatingStatus(applicationId);
        try {
            await axiosInstance.patch(`/jobs/application/${applicationId}/status`, { status: newStatus });

            // Update local state
            setApplications(prev =>
                prev.map(app =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update application status. Please try again.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const deleteApplication = async (applicationId) => {
        if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
            return;
        }

        setDeletingApplication(applicationId);
        try {
            await axiosInstance.delete(`/jobs/application/${applicationId}`);

            // Update local state
            setApplications(prev => prev.filter(app => app._id !== applicationId));
        } catch (err) {
            console.error("Error deleting application:", err);
            alert("Failed to delete application. Please try again.");
        } finally {
            setDeletingApplication(null);
        }
    };

    const toggleJobExpansion = (jobId) => {
        const newExpanded = new Set(expandedJobs);
        if (newExpanded.has(jobId)) {
            newExpanded.delete(jobId);
        } else {
            newExpanded.add(jobId);
        }
        setExpandedJobs(newExpanded);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const getDaysAgo = (dateString) => {
        const appliedDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - appliedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "reviewed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "accepted":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getResumeUrl = (filePath) => {
        if (!filePath) return null;
        const baseUrl = getBaseUrl();
        // If path already includes /uploads/, use it directly
        if (filePath.includes('/uploads/')) {
            return `${baseUrl}${filePath}`;
        }
        // Otherwise, assume it's just the filename
        return `${baseUrl}/uploads/${filePath}`;
    };

    // Group applications by job
    const applicationsByJob = jobs.reduce((acc, job) => {
        const jobApplications = applications.filter(app => app.job?._id === job._id);
        acc[job._id] = {
            job,
            applications: jobApplications,
            pendingCount: jobApplications.filter(app => !app.status || app.status === 'pending').length,
            acceptedCount: jobApplications.filter(app => app.status === 'accepted').length,
            rejectedCount: jobApplications.filter(app => app.status === 'rejected').length,
            reviewedCount: jobApplications.filter(app => app.status === 'reviewed').length
        };
        return acc;
    }, {});

    // Filter applications
    const filteredJobs = jobs.filter(job => {
        const jobData = applicationsByJob[job._id];
        if (!jobData) return false;

        const matchesJob = selectedJob === "all" || job._id === selectedJob;
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jobData.applications.some(app =>
                app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const hasMatchingStatus = activeTab === "all" ||
            (activeTab === "pending" && jobData.pendingCount > 0) ||
            (activeTab === "reviewed" && jobData.reviewedCount > 0) ||
            (activeTab === "accepted" && jobData.acceptedCount > 0) ||
            (activeTab === "rejected" && jobData.rejectedCount > 0);

        return matchesJob && matchesSearch && hasMatchingStatus;
    });

    const getStatusCount = (status) => {
        return applications.filter(app =>
            status === "all" ? true :
                status === "pending" ? (!app.status || app.status === "pending") :
                    app.status === status
        ).length;
    };

    const getJobApplicationCount = (jobId) => {
        return applications.filter(app => app.job?._id === jobId).length;
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">{authLoading ? "Verifying authentication..." : "Loading applications..."}</p>
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
                        onClick={fetchEmployerData}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Manage Applications</h1>
                        <p className="text-blue-100 text-lg">
                            Review and update status of job applications
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Applications</p>
                                    <p className="text-3xl font-bold text-gray-800">{getStatusCount("all")}</p>
                                </div>
                                <div className="text-3xl">📋</div>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-700 text-sm font-medium">Pending Review</p>
                                    <p className="text-3xl font-bold text-yellow-800">{getStatusCount("pending")}</p>
                                </div>
                                <div className="text-3xl">⏳</div>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-700 text-sm font-medium">Accepted</p>
                                    <p className="text-3xl font-bold text-green-800">{getStatusCount("accepted")}</p>
                                </div>
                                <div className="text-3xl">✅</div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-700 text-sm font-medium">Active Jobs</p>
                                    <p className="text-3xl font-bold text-blue-800">{jobs.length}</p>
                                </div>
                                <div className="text-3xl">💼</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                        {/* Job Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Job</label>
                            <select
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Jobs ({applications.length} applications)</option>
                                {jobs.map(job => (
                                    <option key={job._id} value={job._id}>
                                        {job.title || job.job} ({getJobApplicationCount(job._id)} applications)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { id: "all", label: "All", icon: "📋" },
                                { id: "pending", label: "Pending", icon: "⏳", count: getStatusCount("pending") },
                                { id: "reviewed", label: "Reviewed", icon: "👀", count: getStatusCount("reviewed") },
                                { id: "accepted", label: "Accepted", icon: "✅", count: getStatusCount("accepted") },
                                { id: "rejected", label: "Rejected", icon: "❌", count: getStatusCount("rejected") }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                                        ? tab.id === "pending" ? "bg-yellow-500 text-white" :
                                            tab.id === "accepted" ? "bg-green-500 text-white" :
                                                tab.id === "rejected" ? "bg-red-500 text-white" :
                                                    tab.id === "reviewed" ? "bg-blue-500 text-white" :
                                                        "bg-gray-800 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div>
                            <input
                                type="text"
                                placeholder="Search by job title, applicant name, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Applications List - Grouped by Job */}
                    {filteredJobs.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {activeTab === "all" ? "No Jobs Found" : `No Jobs with ${activeTab} Applications`}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {selectedJob !== "all" ?
                                    "No jobs found matching your filters." :
                                    "No jobs found matching your search criteria."}
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedJob("all");
                                    setActiveTab("all");
                                    setSearchTerm("");
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredJobs.map((job) => {
                                const jobData = applicationsByJob[job._id];
                                const isExpanded = expandedJobs.has(job._id);

                                return (
                                    <div key={job._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                        {/* Job Header */}
                                        <div className="p-6 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                                        🏢
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">{job.title || job.job}</h3>
                                                        <p className="text-gray-600">{job.company}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">📍 {job.location}</span>
                                                            <span className="flex items-center gap-1">💰 {job.salary}</span>
                                                            <span className="flex items-center gap-1">📅 Posted: {formatDate(job.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {/* Status Counts */}
                                                    <div className="flex gap-2">
                                                        {jobData.pendingCount > 0 && (
                                                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                ⏳ {jobData.pendingCount}
                                                            </div>
                                                        )}
                                                        {jobData.reviewedCount > 0 && (
                                                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                👀 {jobData.reviewedCount}
                                                            </div>
                                                        )}
                                                        {jobData.acceptedCount > 0 && (
                                                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                ✅ {jobData.acceptedCount}
                                                            </div>
                                                        )}
                                                        {jobData.rejectedCount > 0 && (
                                                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                ❌ {jobData.rejectedCount}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Expand/Collapse Button */}
                                                    <button
                                                        onClick={() => toggleJobExpansion(job._id)}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                                    >
                                                        {isExpanded ? 'Hide Applicants' : `View Applicants (${jobData.applications.length})`}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Applications List */}
                                            {isExpanded && (
                                                <div className="p-6 bg-gray-50">
                                                    {jobData.applications.length === 0 ? (
                                                        <div className="text-center py-8 text-gray-600">
                                                            <div className="text-4xl mb-2">📭</div>
                                                            <p>No applications yet for this position.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {jobData.applications.map((application) => (
                                                                <div key={application._id} className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border-2 ${getStatusColor(application.status)}`}>
                                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                                                        {/* Applicant Info */}
                                                                        <div className="flex-1">
                                                                            <div className="flex items-start gap-4">
                                                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                                                                    👤
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <h4 className="text-lg font-bold text-gray-800 mb-1">{application.name}</h4>
                                                                                    <p className="text-gray-600 mb-3">{application.email}</p>
                                                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                                                        <span className="flex items-center gap-1">
                                                                                            📅 Applied: {formatDate(application.appliedAt)}
                                                                                        </span>
                                                                                        <span className="flex items-center gap-1">
                                                                                            ⏰ {getDaysAgo(application.appliedAt)} days ago
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Actions */}
                                                                        <div className="flex flex-col lg:items-end gap-3">
                                                                            {/* Current Status */}
                                                                            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                                                                                {application.status === 'pending' ? '⏳ Pending' :
                                                                                    application.status === 'reviewed' ? '👀 Reviewed' :
                                                                                        application.status === 'accepted' ? '✅ Accepted' :
                                                                                            application.status === 'rejected' ? '❌ Rejected' :
                                                                                                '⏳ Pending'}
                                                                            </div>

                                                                            {/* File Downloads */}
                                                                            <div className="flex gap-2">
                                                                                {application.resume && (
                                                                                    <a
                                                                                        href={getResumeUrl(application.resume)}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                                                                        download
                                                                                    >
                                                                                        📄 Resume
                                                                                    </a>
                                                                                )}
                                                                                {application.photo && (
                                                                                    <a
                                                                                        href={getResumeUrl(application.photo)}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                                                                    >
                                                                                        📷 Photo
                                                                                    </a>
                                                                                )}
                                                                            </div>

                                                                            {/* Status Update Buttons */}
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {(!application.status || application.status === 'pending') && (
                                                                                    <>
                                                                                        <button
                                                                                            onClick={() => updateApplicationStatus(application._id, 'reviewed')}
                                                                                            disabled={updatingStatus === application._id}
                                                                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
                                                                                        >
                                                                                            {updatingStatus === application._id ? '...' : '👀 Mark Reviewed'}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => updateApplicationStatus(application._id, 'accepted')}
                                                                                            disabled={updatingStatus === application._id}
                                                                                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
                                                                                        >
                                                                                            {updatingStatus === application._id ? '...' : '✅ Accept'}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => updateApplicationStatus(application._id, 'rejected')}
                                                                                            disabled={updatingStatus === application._id}
                                                                                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
                                                                                        >
                                                                                            {updatingStatus === application._id ? '...' : '❌ Reject'}
                                                                                        </button>
                                                                                    </>
                                                                                )}

                                                                                {application.status === 'reviewed' && (
                                                                                    <>
                                                                                        <button
                                                                                            onClick={() => updateApplicationStatus(application._id, 'accepted')}
                                                                                            disabled={updatingStatus === application._id}
                                                                                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
                                                                                        >
                                                                                            {updatingStatus === application._id ? '...' : '✅ Accept'}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => updateApplicationStatus(application._id, 'rejected')}
                                                                                            disabled={updatingStatus === application._id}
                                                                                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors text-sm font-medium"
                                                                                        >
                                                                                            {updatingStatus === application._id ? '...' : '❌ Reject'}
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </div>

                                                                            {/* Delete Button */}
                                                                            <button
                                                                                onClick={() => deleteApplication(application._id)}
                                                                                disabled={deletingApplication === application._id}
                                                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors text-sm font-medium"
                                                                            >
                                                                                {deletingApplication === application._id ? '...' : '🗑️ Delete'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
