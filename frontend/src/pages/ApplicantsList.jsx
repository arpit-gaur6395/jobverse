import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import Footer from "../components/Footer";

export default function ApplicantsList({ jobId }) {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${API_URL}/jobs/applicants/${jobId}`);
                setApplicants(res.data);
            } catch (err) {
                console.error("Error fetching applicants:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this applicant?")) return;

        try {
            await axios.delete(`${API_URL}/jobs/applicant/${id}`);
            setApplicants(applicants.filter((app) => app._id !== id));
        } catch (err) {
            console.error("Failed to delete applicant:", err);
            alert("Failed to delete applicant");
        }
    };

    return (
        <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Candidates Overview</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Total Applicants:</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {loading ? "..." : applicants.length}
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-600">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    Loading applicants...
                </div>
            ) : applicants.length === 0 ? (
                <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No applicants yet for this position.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-800">Active Candidates</p>
                                <p className="text-2xl font-bold text-blue-900">{applicants.length}</p>
                            </div>
                            <div className="text-3xl">👥</div>
                        </div>
                    </div>

                    <details className="border border-gray-200 rounded-lg">
                        <summary className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors font-medium text-gray-700">
                            View All Applicants ({applicants.length})
                        </summary>
                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            {applicants.map((app) => (
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" key={app._id || app.id}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-semibold text-gray-800">{app.name}</p>
                                            <p className="text-sm text-gray-600">{app.email}</p>
                                        </div>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                                            onClick={() => handleDelete(app._id || app.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="flex gap-3">
                                        {app.photo && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">Photo:</p>
                                                <img
                                                    src={`http://localhost:5000${app.photo}`}
                                                    alt="Applicant Photo"
                                                    className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                                                />
                                            </div>
                                        )}

                                        {app.resume && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">Resume:</p>
                                                <a
                                                    href={`http://localhost:5000${app.resume}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                                                >
                                                    📄 View
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
}
