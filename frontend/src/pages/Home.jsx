import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ApplyForm from "../pages/ApplyForm";
import Footer from "../components/Footer";

// Import all Home components and utilities
import HeroSection from "../components/Home/HeroSection";
import SearchBar from "../components/Home/SearchBar";
import CategoriesSection from "../components/Home/CategoriesSection";
import JobListings from "../components/Home/JobListings";
import FeaturedCompanies from "../components/Home/FeaturedCompanies";
import CTASection from "../components/Home/CTASection";

import { useHomeData } from "../components/Home/useHomeData";
import { useHomeHandlers } from "../components/Home/useHomeHandlers";
import { formatPostedDate } from "../components/Home/useJobUtils";

function Home() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Get all state and handlers from custom hooks
    const {
        jobs,
        filteredJobs,
        searchTitle,
        searchCompany,
        searchLocation,
        setSearchTitle,
        setSearchCompany,
        setSearchLocation,
        selectedJob,
        setSelectedJob,
        activeTab,
        setActiveTab,
        categories,
        realStats,
        setJobs,
        setFilteredJobs
    } = useHomeData();

    const { handleSearch, handleCategoryFilter } = useHomeHandlers(
        jobs,
        setJobs,
        filteredJobs,
        setFilteredJobs,
        activeTab,
        setActiveTab
    );

    // Handle company filter from FeaturedCompanies
    const handleCompanyFilter = (companyName) => {
        if (companyName) {
            // Filter jobs by specific company
            const companyJobs = jobs.filter(job => job.company === companyName);
            setFilteredJobs(companyJobs);
            setSearchCompany(companyName); // Update search input to show selected company
        } else {
            // Clear company filter
            setFilteredJobs(jobs);
            setSearchCompany('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 relative">
            <HeroSection realStats={realStats} />
            <SearchBar
                onSearch={() => handleSearch(searchTitle, searchCompany, searchLocation)}
                searchTitle={searchTitle}
                searchCompany={searchCompany}
                searchLocation={searchLocation}
                setSearchTitle={setSearchTitle}
                setSearchCompany={setSearchCompany}
                setSearchLocation={setSearchLocation}
            />
            <CategoriesSection
                categories={categories}
                activeTab={activeTab}
                handleCategoryFilter={handleCategoryFilter}
            />
            <JobListings
                id="job-listings"
                filteredJobs={filteredJobs}
                user={user}
                navigate={navigate}
                setSelectedJob={setSelectedJob}
                formatPostedDate={formatPostedDate}
                searchCompany={searchCompany}
            />
            <FeaturedCompanies
                jobs={jobs}
                onCompanyFilter={handleCompanyFilter}
            />
            <CTASection
                realStats={realStats}
                user={user}
                navigate={navigate}
            />
            {selectedJob && <ApplyForm job={selectedJob} onClose={() => setSelectedJob(null)} />}
            <Footer />
        </div>
    );
}

export default Home;
