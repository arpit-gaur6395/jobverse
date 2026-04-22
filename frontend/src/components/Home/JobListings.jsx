import React, { useState, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "../../config/api";

const JobListings = ({ id, filteredJobs, user, navigate, setSelectedJob, formatPostedDate, searchCompany }) => {
    const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
    const [applicationStatuses, setApplicationStatuses] = useState({});

    useEffect(() => {
        if (user?.role === "seeker") {
            checkApplicationStatuses();
        }
    }, [filteredJobs, user]);

    const checkApplicationStatuses = async () => {
        const statuses = {};
        for (const job of filteredJobs) {
            try {
                const response = await axios.get(
                    `${API_URL}/jobs/check-status/${job._id}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                statuses[job._id] = response.data.hasApplied;
            } catch (err) {
                console.error(`Error checking status for job ${job._id}:`, err);
                statuses[job._id] = false;
            }
        }
        setApplicationStatuses(statuses);
    };

    const getNoJobsMessage = () => {
        if (searchCompany && searchCompany.trim() !== '') {
            return `No job openings found for ${searchCompany}. Try searching for other companies.`;
        }
        return "No jobs found. Check back later!";
    };

    const handleViewDetails = (job) => {
        setSelectedJobForDetails(job);
    };

    const closeDetailsModal = () => {
        setSelectedJobForDetails(null);
    };

    return (
        <section id={id} className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 lg:mb-12 max-w-6xl mx-auto gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-800">Featured Opportunities</h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <button className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-full cursor-pointer transition-all duration-300 font-medium bg-gradient-to-r from-red-400 to-amber-400 text-white border-transparent text-xs sm:text-sm lg:text-base">All Jobs</button>
                </div>
            </div>

            {filteredJobs.length === 0 && <p className="text-center text-base sm:text-lg lg:text-2xl text-gray-600 py-6 sm:py-8 lg:py-10 bg-white rounded-xl mx-auto max-w-2xl px-4">{getNoJobsMessage()}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                {filteredJobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 relative overflow-visible min-h-auto">
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-12 lg:w-12 lg:h-12 bg-gradient-to-br from-red-400 to-amber-400 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-xl lg:text-2xl">
                                <span>🏢</span>
                            </div>
                            <div className="flex flex-col items-end gap-1 sm:gap-1.5">
                                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium">{job.jobType || "Full-time"}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight mb-0.5 tracking-tight truncate">{job.title || job.job}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-0 flex items-center gap-0.5 truncate">🏢 {job.company}</p>
                                <p className="text-gray-500 text-xs sm:text-sm font-normal flex items-center gap-0.5 truncate">📍 {job.location}</p>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 ml-2 sm:ml-0">
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Salary:</span>
                                    <span className="font-bold text-green-600 text-xs sm:text-sm bg-green-50 px-1 sm:px-2 py-1 rounded-md border border-green-200 truncate">{job.salary}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <button
                                className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg text-xs sm:text-sm lg:text-base flex-1 justify-center"
                                onClick={() => handleViewDetails(job)}
                            >
                                View Details
                            </button>

                            {user?.role === "seeker" && applicationStatuses[job._id] && (
                                <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-700 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1">
                                    <span>✓</span>
                                    Applied
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Details Modal */}
            {selectedJobForDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeDetailsModal}>
                    <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-400 to-amber-400 rounded-xl flex items-center justify-center text-2xl">
                                    <span>🏢</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedJobForDetails.title || selectedJobForDetails.job}</h2>
                                    <p className="text-lg text-gray-600">{selectedJobForDetails.company}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeDetailsModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">📍</span>
                                    <span className="text-gray-700">{selectedJobForDetails.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">💼</span>
                                    <span className="text-gray-700">{selectedJobForDetails.jobType || "Full-time"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">💰</span>
                                    <span className="text-green-600 font-semibold">{selectedJobForDetails.salary}</span>
                                </div>
                            </div>

                            {selectedJobForDetails.workMode && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">🏠</span>
                                    <span className="text-gray-700">{selectedJobForDetails.workMode}</span>
                                </div>
                            )}

                            {selectedJobForDetails.experienceMin !== undefined && selectedJobForDetails.experienceMax !== undefined && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">⭐</span>
                                    <span className="text-gray-700">{selectedJobForDetails.experienceMin}-{selectedJobForDetails.experienceMax} years experience</span>
                                </div>
                            )}

                            {selectedJobForDetails.openings && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">👥</span>
                                    <span className="text-gray-700">{selectedJobForDetails.openings} positions available</span>
                                </div>
                            )}

                            {selectedJobForDetails.applicationDeadline && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">📅</span>
                                    <span className="text-gray-700">Apply by: {new Date(selectedJobForDetails.applicationDeadline).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                            <div className="text-gray-700 whitespace-pre-line">
                                {selectedJobForDetails.jobDescription}
                            </div>
                        </div>

                        {selectedJobForDetails.skills && selectedJobForDetails.skills.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJobForDetails.skills.map((skill, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {user?.role === "seeker" ? (
                                applicationStatuses[selectedJobForDetails._id] ? (
                                    <div className="w-full px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center justify-center gap-2">
                                        <span className="text-xl">✓</span>
                                        <span>You have already applied to this position</span>
                                    </div>
                                ) : (
                                    <button
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex-1 justify-center"
                                        onClick={() => {
                                            setSelectedJob(selectedJobForDetails);
                                            closeDetailsModal();
                                        }}
                                    >
                                        Apply Now
                                    </button>
                                )
                            ) : user?.role === "employer" ? (
                                null
                            ) : (
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex-1 justify-center"
                                    onClick={() => navigate("/login")}
                                >
                                    Login to Apply
                                </button>
                            )}
                            <button
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                onClick={closeDetailsModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default JobListings;
