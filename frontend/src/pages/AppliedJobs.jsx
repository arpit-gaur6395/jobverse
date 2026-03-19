import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { API_URL } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function AppliedJobs() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("appliedAt");

    useEffect(() => {
        if (authLoading) return; // Wait for auth to finish loading

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "seeker") {
            navigate("/");
            return;
        }

        fetchAppliedJobs();
    }, [user, navigate, authLoading]);

    // Add visibility change listener to refresh when user returns to tab
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && user) {
                fetchAppliedJobs();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [user]);

    const fetchAppliedJobs = async () => {
        try {
            const response = await axiosInstance.get("/jobs/my-applications");
            setAppliedJobs(response.data);
        } catch (err) {
            console.error("Error fetching applied jobs:", err);
            setError("Failed to fetch your applied jobs. Please try again.");
        } finally {
            setLoading(false);
        }
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
        // If path already includes /uploads/, use it directly
        if (filePath.includes('/uploads/')) {
            return `http://localhost:5000${filePath}`;
        }
        // Otherwise, assume it's just the filename
        return `http://localhost:5000/uploads/${filePath}`;
    };

    // Filter and sort applications
    const filteredAndSortedJobs = appliedJobs
        .filter(job => {
            const matchesSearch = job.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.job?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTab = activeTab === "all" ||
                (activeTab === "pending" && (!job.status || job.status === "pending")) ||
                (activeTab === "reviewed" && job.status === "reviewed") ||
                (activeTab === "accepted" && job.status === "accepted") ||
                (activeTab === "rejected" && job.status === "rejected");

            return matchesSearch && matchesTab;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "appliedAt":
                    return new Date(b.appliedAt) - new Date(a.appliedAt);
                case "company":
                    return (a.job?.company || "").localeCompare(b.job?.company || "");
                case "title":
                    return (a.job?.title || "").localeCompare(b.job?.title || "");
                default:
                    return 0;
            }
        });

    const getStatusCount = (status) => {
        return appliedJobs.filter(job =>
            status === "all" ? true :
                status === "pending" ? (!job.status || job.status === "pending") :
                    job.status === status
        ).length;
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">{authLoading ? "Verifying authentication..." : "Loading your applied jobs..."}</p>
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
                        onClick={fetchAppliedJobs}
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
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-white mb-4">My Applied Jobs</h1>
                                <p className="text-blue-100 text-lg">
                                    Track the status of your job applications
                                </p>
                            </div>
                            <button
                                onClick={fetchAppliedJobs}
                                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                disabled={loading}
                            >
                                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Stats Cards */}
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
                                    <p className="text-blue-700 text-sm font-medium">This Month</p>
                                    <p className="text-3xl font-bold text-blue-800">
                                        {appliedJobs.filter(job => {
                                            const appliedDate = new Date(job.appliedAt);
                                            const thisMonth = new Date();
                                            return appliedDate.getMonth() === thisMonth.getMonth() &&
                                                appliedDate.getFullYear() === thisMonth.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <div className="text-3xl">📈</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs and Search */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                        {/* Status Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { id: "all", label: "All Jobs", icon: "📋" },
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

                        {/* Search and Sort */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by job title, company, or your name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="appliedAt">Sort by Date Applied</option>
                                <option value="company">Sort by Company</option>
                                <option value="title">Sort by Job Title</option>
                            </select>
                        </div>
                    </div>

                    {/* Pending Applications Highlight */}
                    {activeTab === "pending" && getStatusCount("pending") > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-yellow-800">Pending Applications</h3>
                                    <p className="text-yellow-600">
                                        {getStatusCount("pending")} application{getStatusCount("pending") !== 1 ? 's' : ''} waiting for review
                                    </p>
                                </div>
                                <div className="text-4xl">⏳</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredAndSortedJobs.slice(0, 4).map(application => (
                                    <div key={application._id} className="bg-white rounded-lg p-4 border border-yellow-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-800">{application.job?.title}</h4>
                                            <span className="text-xs text-gray-500">
                                                {getDaysAgo(application.appliedAt)} days ago
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{application.job?.company}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                Under Review
                                            </span>
                                            <a
                                                href={getResumeUrl(application.resume)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                View Resume
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Applications List */}
                    {filteredAndSortedJobs.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                            <div className="text-6xl mb-4">
                                {activeTab === "pending" ? "⏳" :
                                    activeTab === "accepted" ? "🎉" :
                                        activeTab === "rejected" ? "📭" : "📋"}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {activeTab === "pending" ? "No Pending Applications" :
                                    activeTab === "accepted" ? "No Accepted Applications Yet" :
                                        activeTab === "rejected" ? "No Rejected Applications" :
                                            activeTab === "reviewed" ? "No Reviewed Applications" :
                                                "No Applications Yet"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {activeTab === "all" ?
                                    "You haven't applied to any jobs yet. Start exploring opportunities!" :
                                    `You don't have any ${activeTab} applications.`}
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            >
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAndSortedJobs.map((application) => (
                                <div key={application._id} className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-2 ${getStatusColor(application.status)}`}>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                                    🏢
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                        {application.job?.title || application.job?.job}
                                                    </h3>
                                                    <p className="text-gray-600 mb-2">{application.job?.company}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            📍 {application.job?.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            💰 {application.job?.salary}
                                                        </span>
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

                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                                                {application.status === 'pending' ? '⏳ Pending' :
                                                    application.status === 'reviewed' ? '👀 Reviewed' :
                                                        application.status === 'accepted' ? '✅ Accepted' :
                                                            application.status === 'rejected' ? '❌ Rejected' :
                                                                '⏳ Pending'}
                                            </span>
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
                                                <button
                                                    onClick={() => navigate(`/applicants/${application._id}`)}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                                >
                                                    👁️ View Status
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
