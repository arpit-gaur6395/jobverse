import { useState, useEffect } from 'react';
import axiosInstance from '../../config/axios';
import { API_URL } from '../../config/api';

export const useHomeData = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCompany, setSearchCompany] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicants, setShowApplicants] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [categories, setCategories] = useState([]);

    const [realStats, setRealStats] = useState({
        totalJobs: 0,
        companies: 0,
        candidates: 0,
        successRate: 0
    });

    const calculateRealStats = (jobsData) => {
        if (!jobsData || jobsData.length === 0) {
            return {
                totalJobs: 0,
                companies: 0,
                candidates: 0,
                successRate: 0
            };
        }

        const uniqueCompanies = new Set(jobsData.map(job => job.company)).size;
        const totalApplicants = jobsData.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);

        return {
            totalJobs: jobsData.length,
            companies: uniqueCompanies,
            candidates: totalApplicants,
            successRate: jobsData.length > 0 ? Math.min(Math.round((totalApplicants / jobsData.length) * 10), 100) : 0
        };
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get('/jobs/getjob');
                const jobsData = Array.isArray(res.data.jobs) ? res.data.jobs : [];
                const reversed = jobsData.reverse();
                // Filter to only include jobs that have a company (posted by companies)
                const companyJobs = reversed.filter(job => job.company && job.company.trim() !== '');
                setJobs(companyJobs);
                setFilteredJobs(companyJobs);

                const stats = calculateRealStats(companyJobs);
                setRealStats(stats);

                const updatedCategories = [
                    { name: "Technology", icon: "💻", count: 0 },
                    { name: "Healthcare", icon: "🏥", count: 0 },
                    { name: "Finance", icon: "💰", count: 0 },
                    { name: "Education", icon: "📚", count: 0 },
                    { name: "Marketing", icon: "📈", count: 0 },
                    { name: "Design", icon: "🎨", count: 0 },
                    { name: "Sales", icon: "💼", count: 0 },
                    { name: "Customer Service", icon: "🎧", count: 0 },
                    { name: "Engineering", icon: "⚙️", count: 0 },
                    { name: "Human Resources", icon: "👥", count: 0 },
                    { name: "Legal", icon: "⚖️", count: 0 },
                    { name: "Real Estate", icon: "🏠", count: 0 },
                    { name: "Transportation", icon: "🚚", count: 0 },
                    { name: "Hospitality", icon: "🍽️", count: 0 },
                    { name: "Retail", icon: "🛍️", count: 0 },
                    { name: "Manufacturing", icon: "🏭", count: 0 },
                    { name: "Construction", icon: "🔨", count: 0 },
                    { name: "Agriculture", icon: "🌾", count: 0 },
                    { name: "Media", icon: "📺", count: 0 },
                    { name: "Consulting", icon: "📊", count: 0 },
                    { name: "Non-Profit", icon: "❤️", count: 0 },
                    { name: "Government", icon: "🏛️", count: 0 },
                    { name: "Sports", icon: "⚽", count: 0 },
                    { name: "Entertainment", icon: "🎭", count: 0 }
                ];

                setCategories(updatedCategories);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, []);

    return {
        // State
        jobs,
        setJobs,
        filteredJobs,
        setFilteredJobs,
        searchTitle,
        searchCompany,
        searchLocation,
        setSearchTitle,
        setSearchCompany,
        setSearchLocation,
        selectedJob,
        setSelectedJob,
        showApplicants,
        setShowApplicants,
        activeTab,
        setActiveTab,
        categories,
        setCategories,
        realStats,
        setRealStats,

        // Utility functions
        calculateRealStats
    };
};
