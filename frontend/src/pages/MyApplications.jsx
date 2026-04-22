import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { API_URL, getBaseUrl } from "../config/api";
import { AuthContext } from "../context/authContext";
import Footer from "../components/Footer";

import { ShimmerCard } from "../components/Shimmer";

export default function MyApplications() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

        fetchApplications();
    }, [user, navigate, authLoading]);

    const fetchApplications = async () => {
        try {
            const response = await axiosInstance.get("/jobs/my-applications");
            setApplications(response.data);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError("Failed to fetch your applications. Please try again.");
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return "⏳";
            case "reviewed":
                return "👀";
            case "accepted":
                return "✅";
            case "rejected":
                return "❌";
            default:
                return "⏳";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Pending Review";
            case "reviewed":
                return "Under Review";
            case "accepted":
                return "Accepted";
            case "rejected":
                return "Rejected";
            default:
                return "Pending Review";
        }
    };

    // Filter applications
    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.job?.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusCount = (status) => {
        return applications.filter(app => app.status === status).length;
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

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 p-4 flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    <div className="space-y-4 py-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <ShimmerCard key={i} />
                        ))}
                    </div>
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
                        onClick={fetchApplications}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 mt-[100px]">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">My Applications</h1>
                        <p className="text-blue-100 text-lg">
                            Track the status of your job applications
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Applications</p>
                                    <p className="text-3xl font-bold text-gray-800">{applications.length}</p>
                                </div>
                                <div className="text-3xl">📋</div>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-700 text-sm font-medium">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-800">{getStatusCount("pending")}</p>
                                </div>
                                <div className="text-3xl">⏳</div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-700 text-sm font-medium">Under Review</p>
                                    <p className="text-3xl font-bold text-blue-800">{getStatusCount("reviewed")}</p>
                                </div>
                                <div className="text-3xl">👀</div>
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
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                        {/* Status Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: "all", label: "All", count: applications.length },
                                    { id: "pending", label: "Pending", count: getStatusCount("pending") },
                                    { id: "reviewed", label: "Under Review", count: getStatusCount("reviewed") },
                                    { id: "accepted", label: "Accepted", count: getStatusCount("accepted") },
                                    { id: "rejected", label: "Rejected", count: getStatusCount("rejected") }
                                ].map(status => (
                                    <button
                                        key={status.id}
                                        onClick={() => setStatusFilter(status.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${statusFilter === status.id
                                            ? status.id === "pending" ? "bg-yellow-500 text-white" :
                                                status.id === "accepted" ? "bg-green-500 text-white" :
                                                    status.id === "rejected" ? "bg-red-500 text-white" :
                                                        status.id === "reviewed" ? "bg-blue-500 text-white" :
                                                            "bg-gray-800 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <span>{status.label}</span>
                                        {status.count > 0 && (
                                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                                {status.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Applications</label>
                            <input
                                type="text"
                                placeholder="Search by job title, company, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Applications List */}
                    {filteredApplications.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {applications.length === 0 ? "No Applications Yet" : "No Applications Found"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {applications.length === 0
                                    ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                                    : "No applications found matching your search criteria."}
                            </p>
                            {applications.length === 0 && (
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Explore Jobs
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredApplications.map((application) => (
                                <div key={application._id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 ${getStatusColor(application.status)}`}>
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                            {/* Job Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                                        🏢
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{application.job?.title}</h3>
                                                        <p className="text-gray-600 mb-3">{application.job?.company}</p>
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">📍 {application.job?.location}</span>
                                                            <span className="flex items-center gap-1">💰 {application.job?.salary}</span>
                                                            <span className="flex items-center gap-1">📅 Applied: {formatDate(application.appliedAt)}</span>
                                                            <span className="flex items-center gap-1">⏰ {getDaysAgo(application.appliedAt)} days ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex flex-col lg:items-end gap-3">
                                                {/* Status Badge */}
                                                <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                                                    <span className="mr-1">{getStatusIcon(application.status)}</span>
                                                    {getStatusText(application.status)}
                                                </div>

                                                {/* View Files */}
                                                <div className="flex gap-2">
                                                    {application.resume && (
                                                        <a
                                                            href={getResumeUrl(application.resume)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
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

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate("/")}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                                    >
                                                        Apply to More Jobs
                                                    </button>
                                                </div>
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
        </div >
    );
}
