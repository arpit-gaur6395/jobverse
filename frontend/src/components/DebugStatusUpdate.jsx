import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function DebugStatusUpdate() {
    const { user } = useContext(AuthContext);
    const [debugInfo, setDebugInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDebugInfo = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/jobs/debug/my-info");
            setDebugInfo(response.data);
        } catch (error) {
            console.error("Debug info error:", error);
            alert("Failed to fetch debug info: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== "employer") {
        return (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-800">This debug tool is only available for employers.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">🔍 Status Update Debug Tool</h2>
            
            <button
                onClick={fetchDebugInfo}
                disabled={loading}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Loading..." : "Fetch Debug Info"}
            </button>

            {debugInfo && (
                <div className="space-y-4">
                    {/* Current User Info */}
                    <div className="bg-white p-4 rounded border">
                        <h3 className="font-bold text-lg mb-2">Current User</h3>
                        <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(debugInfo.currentUser, null, 2)}
                        </pre>
                    </div>

                    {/* User's Jobs */}
                    <div className="bg-white p-4 rounded border">
                        <h3 className="font-bold text-lg mb-2">Your Jobs ({debugInfo.jobs.length})</h3>
                        {debugInfo.jobs.length === 0 ? (
                            <p className="text-gray-500">No jobs found. You need to post jobs first.</p>
                        ) : (
                            <div className="space-y-2">
                                {debugInfo.jobs.map((job, index) => (
                                    <div key={job._id} className="text-sm bg-gray-50 p-2 rounded">
                                        <strong>Job {index + 1}:</strong> {job.job} at {job.company}
                                        <br />
                                        <span className="text-xs text-gray-600">ID: {job._id}</span>
                                        <br />
                                        <span className="text-xs text-gray-600">Owner: {job.userId}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Applications for User's Jobs */}
                    <div className="bg-white p-4 rounded border">
                        <h3 className="font-bold text-lg mb-2">Applications for Your Jobs ({debugInfo.applications.length})</h3>
                        {debugInfo.applications.length === 0 ? (
                            <p className="text-gray-500">No applications found for your jobs.</p>
                        ) : (
                            <div className="space-y-2">
                                {debugInfo.applications.map((app, index) => (
                                    <div key={app._id} className="text-sm bg-gray-50 p-2 rounded">
                                        <strong>Application {index + 1}:</strong> {app.name} ({app.email})
                                        <br />
                                        <span className="text-xs">Status: <span className={`px-2 py-1 rounded text-xs ${
                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>{app.status || 'pending'}</span></span>
                                        <br />
                                        <span className="text-xs text-gray-600">Application ID: {app._id}</span>
                                        <br />
                                        <span className="text-xs text-gray-600">Job: {app.job?.job} at {app.job?.company}</span>
                                        <br />
                                        <span className="text-xs text-gray-600">Job Owner: {app.job?.userId}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-2">Debug Tips:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Check if the Job Owner matches your Current User ID</li>
                            <li>• If you have 0 jobs, post a job first</li>
                            <li>• If you have 0 applications, have someone apply to your jobs</li>
                            <li>• Check the browser console for detailed error messages</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
