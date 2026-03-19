import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedCompanies = ({ jobs, onCompanyFilter }) => {
    // Process real job data to extract company information
    const getCompanyData = (jobs) => {
        const companyMap = new Map();

        // Aggregate jobs by company
        jobs.forEach(job => {
            const companyName = job.company || 'Unknown Company';
            if (!companyMap.has(companyName)) {
                companyMap.set(companyName, {
                    name: companyName,
                    jobs: [],
                    locations: new Set(),
                    types: new Set(),
                    totalApplications: 0
                });
            }
            companyMap.get(companyName).jobs.push(job);
            if (job.location) companyMap.get(companyName).locations.add(job.location);
            if (job.type) companyMap.get(companyName).types.add(job.type);
        });

        // Convert to array and calculate metrics
        const companies = Array.from(companyMap.values()).map(company => {
            const openJobs = company.jobs.length;
            const uniqueLocations = Array.from(company.locations).slice(0, 2);
            const jobTypes = Array.from(company.types).slice(0, 2);

            // Generate a rating based on job count and variety
            const rating = Math.min(4.9, Math.max(3.5, 3.5 + (openJobs * 0.1) + (company.locations.size * 0.2)));

            // Determine industry from job titles
            const industry = getIndustryFromJobs(company.jobs);

            // Get company size based on job count
            const employees = getCompanySize(openJobs);

            // Generate benefits based on job types and locations
            const benefits = generateBenefits(jobTypes, uniqueLocations);

            // Create logo from company name
            const logo = generateLogo(company.name);

            // Determine if featured (top companies by job count)
            const featured = openJobs >= 3;

            return {
                name: company.name,
                logo,
                industry,
                openJobs,
                rating: parseFloat(rating.toFixed(1)),
                employees,
                location: uniqueLocations[0] || 'Multiple Locations',
                benefits: benefits.slice(0, 3),
                featured,
                jobList: company.jobs
            };
        });

        // Sort by job count and return top 6
        return companies.sort((a, b) => b.openJobs - a.openJobs).slice(0, 6);
    };

    const getIndustryFromJobs = (jobs) => {
        const titles = jobs.map(job => job.title?.toLowerCase() || '').join(' ');

        if (titles.includes('developer') || titles.includes('software') || titles.includes('engineer')) {
            return 'Software Development';
        } else if (titles.includes('data') || titles.includes('analytics') || titles.includes('science')) {
            return 'Data Science';
        } else if (titles.includes('cloud') || titles.includes('aws') || titles.includes('azure')) {
            return 'Cloud Computing';
        } else if (titles.includes('ai') || titles.includes('machine learning') || titles.includes('ml')) {
            return 'Artificial Intelligence';
        } else if (titles.includes('security') || titles.includes('cyber') || titles.includes('information security')) {
            return 'Cybersecurity';
        } else if (titles.includes('mobile') || titles.includes('ios') || titles.includes('android')) {
            return 'Mobile Development';
        } else if (titles.includes('design') || titles.includes('ui') || titles.includes('ux')) {
            return 'Design & UX';
        } else if (titles.includes('marketing') || titles.includes('digital') || titles.includes('seo')) {
            return 'Digital Marketing';
        } else {
            return 'Technology';
        }
    };

    const getCompanySize = (jobCount) => {
        if (jobCount >= 10) return '1000-5000';
        if (jobCount >= 5) return '500-1000';
        if (jobCount >= 3) return '100-500';
        return '50-200';
    };

    const generateBenefits = (jobTypes, locations) => {
        const benefits = [];

        if (jobTypes.includes('Remote') || locations.some(loc => loc?.toLowerCase().includes('remote'))) {
            benefits.push('Remote Work');
        }

        if (jobTypes.includes('Full-time')) {
            benefits.push('Health Insurance');
        }

        if (jobTypes.includes('Contract')) {
            benefits.push('Flexible Hours');
        }

        benefits.push('Competitive Salary');

        if (jobTypes.length > 1) {
            benefits.push('Career Growth');
        }

        return benefits;
    };

    const generateLogo = (companyName) => {
        const logos = ['🚀', '📊', '☁️', '🤖', '🔒', '📱', '💼', '🎯', '⚡', '🌟'];
        let hash = 0;
        for (let i = 0; i < companyName.length; i++) {
            hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
        }
        return logos[Math.abs(hash) % logos.length];
    };

    const companies = getCompanyData(jobs || []);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                ))}
                {hasHalfStar && <span className="text-yellow-400">⭐</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={i} className="text-gray-300">⭐</span>
                ))}
                <span className="text-sm text-gray-600 ml-1">({rating})</span>
            </div>
        );
    };

    const navigate = useNavigate();

    const handleViewJobs = (company) => {
        // Filter jobs by company and update the search state
        onCompanyFilter(company.name);
        // Scroll to job listings section
        const jobListingsSection = document.getElementById('job-listings');
        if (jobListingsSection) {
            jobListingsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (companies.length === 0) {
        return (
            <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white text-center">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">Featured Companies</h2>
                    <div className="bg-gray-50 rounded-2xl p-8 sm:p-12">
                        <p className="text-lg sm:text-xl text-gray-600">No companies with active job openings found.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Featured Companies</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {companies.map((company, index) => (
                        <div key={index} className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 overflow-hidden ${company.featured ? 'ring-2 ring-amber-400' : ''}`}>
                            {company.featured && (
                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-amber-400 to-red-400 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-md">
                                    <span className="mr-1">⭐</span>
                                    Featured
                                </div>
                            )}

                            {/* Header with logo and company info */}
                            <div className="flex items-start justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-lg sm:text-2xl shadow-md">
                                        <span>{company.logo}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{company.name}</h3>
                                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md">{company.industry}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats section */}
                            <div className="bg-white/70 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="text-center flex-1">
                                        <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1">{company.openJobs}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Open Jobs</div>
                                    </div>
                                    <div className="w-px h-8 sm:h-12 bg-gray-200"></div>
                                    <div className="flex-1 text-center px-2 sm:px-4">
                                        <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-600">
                                            <span className="text-sm sm:text-lg">📍</span>
                                            <span className="text-xs sm:text-sm font-medium truncate">{company.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits section */}
                            <div className="mb-4 sm:mb-6">
                                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                    <span className="text-green-500 text-sm sm:text-lg">✨</span>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700">Top Benefits</h4>
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {company.benefits.map((benefit, idx) => (
                                        <span key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action button */}
                            <div className="relative">
                                <button
                                    onClick={() => handleViewJobs(company)}
                                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                                >
                                    <span className="flex items-center justify-center gap-1 sm:gap-2">
                                        View Positions
                                        <span className="text-sm sm:text-lg">→</span>
                                    </span>
                                </button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-100/50 to-red-100/50 rounded-full -ml-8 -mb-8"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCompanies;
