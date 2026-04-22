import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { AuthContext } from "../context/authContext";
import Footer from "../components/Footer";

import { ShimmerJobCard } from "../components/Shimmer";

export default function MyPostedJobs() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
            return;
        }

        if (user && user.role !== "employer") {
            navigate("/");
            return;
        }

        if (user && user.role === "employer") {
            fetchPostedJobs();
        }
    }, [user, authLoading, navigate]);

    // Show shimmer while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')"
            }}>
                <div className="w-full max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <ShimmerJobCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Don't render if user is not authenticated
    if (!user) {
        return null;
    }

    const fetchPostedJobs = async () => {
        try {
            const response = await axiosInstance.get("/jobs/my-jobs");
            setJobs(response.data);
        } catch (err) {
            console.error("Error fetching posted jobs:", err);
            setError("Failed to fetch your posted jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
            return;
        }

        try {
            await axiosInstance.delete(`/jobs/${jobId}`);
            setJobs(prev => prev.filter(job => job._id !== jobId));
        } catch (err) {
            console.error("Error deleting job:", err);
            alert("Failed to delete job. Please try again.");
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
        const postedDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getApplicationCount = (jobId) => {
        return jobs.find(job => job._id === jobId)?.applicants?.length || 0;
    };

    // Filter and sort jobs
    const filteredAndSortedJobs = jobs
        .filter(job =>
            job.job?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "createdAt":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "title":
                    return (a.job || "").localeCompare(b.job || "");
                case "company":
                    return (a.company || "").localeCompare(b.company || "");
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <ShimmerJobCard key={i} />
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
                        onClick={fetchPostedJobs}
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
                        <h1 className="text-4xl font-bold text-white mb-4">My Posted Jobs</h1>
                        <p className="text-blue-100 text-lg">
                            Manage and track your job postings
                        </p>
                    </div>

                    {/* Debug Tool */}
                    {/* <div className="mb-8">
                        <DebugStatusUpdate />
                    </div> */}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Jobs</p>
                                    <p className="text-3xl font-bold text-gray-800">{jobs.length}</p>
                                </div>
                                <div className="text-3xl">📋</div>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-700 text-sm font-medium">Total Applications</p>
                                    <p className="text-3xl font-bold text-green-800">
                                        {jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0)}
                                    </p>
                                </div>
                                <div className="text-3xl">👥</div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-700 text-sm font-medium">This Month</p>
                                    <p className="text-3xl font-bold text-blue-800">
                                        {jobs.filter(job => {
                                            const postedDate = new Date(job.createdAt);
                                            const thisMonth = new Date();
                                            return postedDate.getMonth() === thisMonth.getMonth() &&
                                                postedDate.getFullYear() === thisMonth.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <div className="text-3xl">📈</div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Sort */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by job title, company, or location..."
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
                                <option value="createdAt">Sort by Date Posted</option>
                                <option value="title">Sort by Job Title</option>
                                <option value="company">Sort by Company</option>
                            </select>
                        </div>
                    </div>

                    {/* Jobs List */}
                    {filteredAndSortedJobs.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm ?
                                    "No jobs found matching your search criteria." :
                                    "You haven't posted any jobs yet."}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                >
                                    Clear Search
                                </button>
                                <button
                                    onClick={() => navigate("/postjob")}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Post New Job
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAndSortedJobs.map((job) => (
                                <div key={job._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        {/* Job Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                                    🏢
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                        {job.job}
                                                    </h3>
                                                    <p className="text-gray-600 mb-3">{job.company}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            📍 {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            💰 {job.salary}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            📅 Posted: {formatDate(job.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            ⏰ {getDaysAgo(job.createdAt)} days ago
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            👥 {getApplicationCount(job._id)} applications
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            📊 {job.jobType || "Full-time"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col lg:items-end gap-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/edit/${job._id}`)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/applicants/${job._id}`)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                                >
                                                    👥 View Applicants
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => deleteJob(job._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                            >
                                                🗑️ Delete
                                            </button>
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
