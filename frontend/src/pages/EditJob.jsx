import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import Footer from "../components/Footer";
import { ShimmerCard } from "../components/Shimmer";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    job: "",
    company: "",
    jobType: "",
    salary: "",
    location: "",
    jobDescription: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get("/jobs/getjob");
        const jobsData = Array.isArray(res.data.jobs) ? res.data.jobs : [];
        const job = jobsData.find(j => j._id === id);
        if (job) {
          setFormData({
            job: job.job || job.title,
            company: job.company,
            jobType: job.jobType || job.type,
            salary: job.salary,
            location: job.location,
            jobDescription: job.jobDescription
          });
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/jobs/${id}`, formData);
      alert("Job updated successfully!");
      navigate("/my-posted-jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="space-y-4 py-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{
      backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920')"
    }}>
      <div className="w-full max-w-4xl">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-white border-opacity-30">
          <div className="text-center p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-2xl">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Edit Job</h2>
            <p className="text-base sm:text-lg opacity-90">Update your job posting details</p>
          </div>

          <form onSubmit={handleUpdate} className="p-6 sm:p-8 lg:p-10">
            {/* First Row - Job Title and Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">💼</span>
                  Job Title
                </label>
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Enter job title"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">🏢</span>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>

            {/* Second Row - Job Type and Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">📋</span>
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 focus:bg-white text-sm sm:text-base"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">💰</span>
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Enter salary (e.g., $50,000 - $80,000)"
                  required
                />
              </div>
            </div>

            {/* Third Row - Location and Job Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">📍</span>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Enter job location"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">📝</span>
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-500 resize-y min-h-[100px] font-inherit text-sm sm:text-base"
                  placeholder="Enter detailed job description"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 text-white border-none rounded-xl sm:rounded-2xl p-4 sm:p-5 text-base sm:text-lg font-bold cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <span>Update Job</span>
              </button>
              <button
                type="button"
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 text-white border-none rounded-xl sm:rounded-2xl p-4 sm:p-5 text-base sm:text-lg font-bold cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl hover:from-slate-600 hover:to-slate-700"
                onClick={() => navigate("/my-posted-jobs")}
              >
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
