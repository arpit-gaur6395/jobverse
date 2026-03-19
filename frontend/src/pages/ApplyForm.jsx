import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../config/axios";
import { API_URL } from "../config/api";

export default function ApplyForm({ job, onClose }) {
    const { user } = useContext(AuthContext);
    const [applicationData, setApplicationData] = useState({
        name: "",
        email: "",
        resume: null,
        photo: null,
    });
    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(false);

    // Auto-fill user data when component loads
    useEffect(() => {
        console.log("=== ApplyForm Auto-fill ===");
        console.log("Full user object:", JSON.stringify(user, null, 2));

        if (user) {
            console.log("User object keys:", Object.keys(user));
            console.log("User name:", user.name);
            console.log("User email:", user.email);
            console.log("User.email type:", typeof user.email);

            // Try multiple possible email fields
            const userEmail = user.email || user.userEmail || user.emailAddress || "";
            console.log("Final email to use:", userEmail);

            const userData = {
                name: user.name || "",
                email: userEmail,
                resume: null,
                photo: null,
            };
            console.log("Setting applicationData to:", userData);
            setApplicationData(userData);

            // Multiple force updates
            setApplicationData(userData);
            setTimeout(() => setApplicationData(userData), 50);
            setTimeout(() => setApplicationData(userData), 100);
            setTimeout(() => setApplicationData(userData), 200);
        } else {
            console.log("No user data available");
        }
    }, [user]);

    // Additional effect to continuously update
    useEffect(() => {
        if (user) {
            console.log("Continuous update - User email:", user.email);
            setApplicationData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user && job?._id) {
            checkApplicationStatus();
        }
    }, [user, job]);

    const checkApplicationStatus = async () => {
        try {
            const response = await axiosInstance.get(`/jobs/check-status/${job._id}`);
            setHasApplied(response.data.hasApplied);
        } catch (err) {
            console.error("Error checking application status:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setApplicationData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setApplicationData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
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
            const formData = new FormData();
            formData.append("name", applicationData.name);
            formData.append("email", applicationData.email);
            formData.append("resume", applicationData.resume);
            formData.append("photo", applicationData.photo);

            await axiosInstance.post(`/jobs/apply/${job._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Application submitted successfully!");
            setHasApplied(true);
            onClose();
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to submit application.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for: {job.job}</h2>

                {hasApplied ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Already Applied</h3>
                        <p className="text-gray-600 mb-6">You have already submitted an application for this position.</p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={applicationData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={applicationData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF, DOC, DOCX):</label>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (PNG, JPG, JPEG):</label>
                        <input
                            type="file"
                            name="photo"
                            accept=".png,.jpg,.jpeg"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">Submit</button>
                            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200">Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
