import axios from 'axios';
import { API_URL } from '../../config/api';

export const useHomeHandlers = (jobs, setJobs, filteredJobs, setFilteredJobs, activeTab, setActiveTab) => {

    const handleSearch = (searchTitle, searchCompany, searchLocation) => {
        const filtered = jobs.filter((job) => {
            const matchTitle = job.job.toLowerCase().includes(searchTitle.toLowerCase());
            const matchCompany = job.company.toLowerCase().includes(searchCompany.toLowerCase());
            const matchLocation = job.location.toLowerCase().includes(searchLocation.toLowerCase());
            return matchTitle && matchCompany && matchLocation;
        });
        setFilteredJobs(filtered);
    };

    const handleCategoryFilter = (category) => {
        if (category === "all") {
            setFilteredJobs(jobs);
            setActiveTab("all");
        } else {
            const filtered = jobs.filter((job) => {
                const jobTitle = job.job.toLowerCase();
                const jobDescription = (job.jobDescription || "").toLowerCase();
                const categoryLower = category.toLowerCase();

                if (jobTitle.includes(categoryLower) || jobDescription.includes(categoryLower)) {
                    return true;
                }

                const categoryKeywords = {
                    "technology": ["software", "developer", "engineer", "programming", "tech", "it", "web", "app"],
                    "healthcare": ["medical", "health", "nurse", "doctor", "hospital"],
                    "finance": ["finance", "accounting", "bank", "investment", "financial"],
                    "education": ["teacher", "education", "training", "academic", "school"],
                    "marketing": ["marketing", "sales", "advertising", "promotion", "brand"],
                    "design": ["design", "designer", "ui", "ux", "graphic", "creative"],
                    "sales": ["sales", "sell", "revenue", "business development"],
                    "customer service": ["customer service", "support", "help desk", "call center"],
                    "engineering": ["engineer", "mechanical", "electrical", "civil", "chemical"],
                    "human resources": ["hr", "human resources", "recruiting", "recruitment"],
                    "legal": ["lawyer", "attorney", "legal", "paralegal", "counsel"],
                    "real estate": ["real estate", "property", "realtor", "broker"],
                    "transportation": ["transportation", "logistics", "supply chain", "delivery"],
                    "hospitality": ["hospitality", "hotel", "restaurant", "food service"],
                    "retail": ["retail", "store", "shop", "cashier", "merchandising"],
                    "manufacturing": ["manufacturing", "production", "factory", "assembly"],
                    "construction": ["construction", "building", "contractor", "carpenter"],
                    "agriculture": ["agriculture", "farming", "agricultural", "crop"],
                    "media": ["media", "journalism", "news", "reporter", "editor"],
                    "consulting": ["consulting", "consultant", "advisory", "strategy"],
                    "non-profit": ["non-profit", "charity", "foundation", "ngo"],
                    "government": ["government", "federal", "state", "municipal"],
                    "sports": ["sports", "athletics", "coach", "fitness", "trainer"],
                    "entertainment": ["entertainment", "music", "film", "movie", "theater"]
                };

                const keywords = categoryKeywords[categoryLower] || [];
                return keywords.some(keyword => jobTitle.includes(keyword) || jobDescription.includes(keyword));
            });

            setFilteredJobs(filtered);
            setActiveTab(category);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/jobs/${id}`);
            const updatedJobs = jobs.filter((job) => job._id !== id);
            setJobs(updatedJobs);
            setFilteredJobs(updatedJobs);
        } catch (err) {
            console.error(err);
            alert("Failed to delete job");
        }
    };

    return {
        handleSearch,
        handleCategoryFilter,
        handleDelete
    };
};
