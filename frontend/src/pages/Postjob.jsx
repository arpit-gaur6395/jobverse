import { useState, useContext, useEffect } from "react";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

function Postjob() {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    const [form, setForm] = useState({
        job: "",
        company: "",
        jobType: "",
        salary: "",
        location: "",
        jobDescription: ""
    });
    const [submitting, setSubmitting] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
            }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if user is not authenticated
    if (!user) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosInstance.post('/jobs/postjob', form);
            alert("Job posted successfully");
            navigate("/my-posted-jobs");
        } catch (err) {
            console.error("Job posting error:", err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                "Failed to post job. Please try again.";
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat relative"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 z-10"></div>
            <div className="mt-16 relative z-20 flex justify-center items-start min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20 overflow-hidden max-w-4xl w-full">
                    <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-red-400/90 to-amber-400/90 text-white relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-white/20 transform scale-150 animate-pulse"></div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 text-shadow relative z-10">Post a Job</h2>
                        <p className="text-sm sm:text-base lg:text-lg opacity-90 relative z-10">Find's perfect candidate for your position</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
                        {/* First Row - Job Title and Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
                            <div className="relative">
                                <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
                                    <span className="mr-1 sm:mr-2">💼</span>
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    name="job"
                                    value={form.job}
                                    onChange={handleChange}
                                    className="w-full p-2.5 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    placeholder="Enter job title"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
                                    <span className="mr-1 sm:mr-2">🏢</span>
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="w-full p-2.5 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Second Row - Job Type and Salary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
                            <div className="relative">
                                <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
                                    <span className="mr-1 sm:mr-2">📋</span>
                                    Job Type
                                </label>
                                <select
                                    name="jobType"
                                    value={form.jobType}
                                    onChange={handleChange}
                                    className="w-full p-2.5 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 text-sm sm:text-base"
                                    required
                                >
                                    <option value="">Select Job Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
                                    <span className="mr-1 sm:mr-2">💰</span>
                                    Salary
                                </label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    className="w-full p-2.5 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    placeholder="Enter salary (e.g., $50,000 - $80,000)"
                                    required
                                />
                            </div>
                        </div>

                        {/* Third Row - Location and Job Description */}
                        <div className="grid grid-cols-1 gap-3 sm:gap-6 mb-4 sm:mb-6">
                            <div className="relative">
                                <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
                                    <span className="mr-1 sm:mr-2">📍</span>
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full p-2.5 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                                    placeholder="Enter job location"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
                                    <span className="mr-1 sm:mr-2">📝</span>
                                    Job Description
                                </label>
                                <textarea
                                    name="jobDescription"
                                    value={form.jobDescription}
                                    onChange={handleChange}
                                    className="w-full p-2.5 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 resize-y min-h-[100px] sm:min-h-[120px] font-inherit text-sm sm:text-base"
                                    placeholder="Enter detailed job description"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 text-white border-none rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-sm sm:text-base lg:text-lg font-bold cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={submitting}
                            >
                                <span className="relative z-10">{submitting ? "Posting..." : "Post Job"}</span>
                            </button>
                            <button
                                type="button"
                                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 text-white border-none rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-sm sm:text-base lg:text-lg font-bold cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl hover:from-slate-600 hover:to-slate-700"
                                onClick={() => navigate("/")}
                            >
                                <span className="relative z-10">Cancel</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Postjob;
