import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../config/axios';
import Footer from '../components/Footer';

import { ShimmerCard } from "../components/Shimmer";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [savedCompanies, setSavedCompanies] = useState([]);
  const { companyName } = useParams();

  useEffect(() => {
    fetchCompanies();
    loadSavedCompanies();
    if (companyName) {
      const company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
      if (company) {
        setSelectedCompany(company);
        setShowCompanyDetails(true);
      }
    }
  }, [companyName]);

  const loadSavedCompanies = () => {
    const saved = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
    setSavedCompanies(saved);
  };

  const toggleSaveCompany = (company) => {
    const isSaved = savedCompanies.some(c => c.id === company.id);
    let updated;
    if (isSaved) {
      updated = savedCompanies.filter(c => c.id !== company.id);
    } else {
      updated = [...savedCompanies, company];
    }
    setSavedCompanies(updated);
    localStorage.setItem('savedCompanies', JSON.stringify(updated));
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Fetch jobs to extract actual companies
      const response = await axiosInstance.get('/jobs/getjob');
      const jobs = response.data;

      // Extract unique companies from jobs
      const companyMap = new Map();
      jobs.forEach(job => {
        if (job.company && job.company.trim() !== '') {
          if (!companyMap.has(job.company)) {
            companyMap.set(job.company, {
              id: job.company.replace(/\s+/g, '_').toLowerCase(), // Create ID from company name
              name: job.company,
              industry: getIndustryFromJob(job),
              size: getCompanySizeFromJobs(jobs, job.company),
              location: job.location || 'Multiple Locations',
              description: `${job.company} is hiring talented professionals for various positions. Join our team and grow your career with us.`,
              openPositions: 0,
              rating: Math.min(4.9, Math.max(3.5, 3.5 + Math.random() * 1.4)),
              benefits: getBenefitsFromJob(job),
              featured: false,
              website: '#',
              founded: 2020 + Math.floor(Math.random() * 10),
              reviews: [],
              culture: 'Innovative and collaborative environment',
              techStack: getTechStackFromJobs(jobs, job.company),
              interviewProcess: 'Technical interview + HR round',
              salaryRange: job.salary || 'Competitive',
              workLifeBalance: (4.0 + Math.random()).toFixed(1),
              growthOpportunities: (4.0 + Math.random()).toFixed(1)
            });
          }
          // Count open positions for this company
          companyMap.get(job.company).openPositions++;
        }
      });

      let companiesArray = Array.from(companyMap.values());

      // If no companies found from jobs, add some demo companies
      if (companiesArray.length === 0) {
        companiesArray = [
          {
            id: 'techcorp_solutions',
            name: 'TechCorp Solutions',
            industry: 'Technology',
            size: '500-1000',
            location: 'Bangalore, India',
            description: 'Leading software development company specializing in cutting-edge solutions for enterprise clients worldwide.',
            openPositions: 25,
            rating: 4.5,
            benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Gym Access'],
            featured: true,
            website: 'https://techcorp.com',
            founded: '2015',
            reviews: [],
            culture: 'Innovative and collaborative environment with focus on continuous learning',
            techStack: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
            interviewProcess: 'Technical round + System design + HR interview',
            salaryRange: '₹15-30 LPA',
            workLifeBalance: '4.2',
            growthOpportunities: '4.5'
          },
          {
            id: 'datamind_analytics',
            name: 'DataMind Analytics',
            industry: 'Data Analytics',
            size: '100-200',
            location: 'Pune, India',
            description: 'Data-driven solutions for modern businesses, helping companies make informed decisions through advanced analytics.',
            openPositions: 12,
            rating: 4.3,
            benefits: ['Flexible Hours', 'Learning Budget', 'Gym Access', 'Free Meals'],
            featured: true,
            website: 'https://datamind.com',
            founded: '2018',
            reviews: [],
            culture: 'Data-focused and analytical mindset with emphasis on innovation',
            techStack: ['Python', 'R', 'TensorFlow', 'Tableau', 'Power BI', 'SQL'],
            interviewProcess: 'Data analysis test + Technical interview + Culture fit',
            salaryRange: '₹12-25 LPA',
            workLifeBalance: '4.5',
            growthOpportunities: '4.3'
          },
          {
            id: 'cloudtech_systems',
            name: 'CloudTech Systems',
            industry: 'Cloud Computing',
            size: '200-500',
            location: 'Hyderabad, India',
            description: 'Specialized cloud solutions provider helping businesses migrate and optimize their cloud infrastructure.',
            openPositions: 18,
            rating: 4.4,
            benefits: ['Remote Work', 'Health Insurance', 'Training Programs', 'Performance Bonus'],
            featured: false,
            website: 'https://cloudtech.com',
            founded: '2017',
            reviews: [],
            culture: 'Innovation-driven with focus on cloud-native solutions',
            techStack: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Kubernetes'],
            interviewProcess: 'Cloud knowledge test + System design + Technical interview',
            salaryRange: '₹10-22 LPA',
            workLifeBalance: '4.3',
            growthOpportunities: '4.6'
          },
          {
            id: 'fintech_innovations',
            name: 'FinTech Innovations',
            industry: 'Financial Technology',
            size: '50-100',
            location: 'Mumbai, India',
            description: 'Revolutionary fintech solutions for digital banking, payments, and financial services.',
            openPositions: 8,
            rating: 4.2,
            benefits: ['Stock Options', 'Flexible Work', 'Health Coverage', 'Transport Allowance'],
            featured: false,
            website: 'https://fintechinnovations.com',
            founded: '2019',
            reviews: [],
            culture: 'Fast-paced and innovative fintech environment',
            techStack: ['Java', 'Spring Boot', 'React', 'Blockchain', 'Microservices'],
            interviewProcess: 'Coding challenge + System design + Multiple technical rounds',
            salaryRange: '₹8-20 LPA',
            workLifeBalance: '3.8',
            growthOpportunities: '4.7'
          }
        ];
      }

      setCompanies(companiesArray);
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Add demo companies on error as fallback
      const demoCompanies = [
        {
          id: 'techcorp_solutions',
          name: 'TechCorp Solutions',
          industry: 'Technology',
          size: '500-1000',
          location: 'Bangalore, India',
          description: 'Leading software development company specializing in cutting-edge solutions for enterprise clients worldwide.',
          openPositions: 25,
          rating: 4.5,
          benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Gym Access'],
          featured: true,
          website: 'https://techcorp.com',
          founded: '2015',
          reviews: [],
          culture: 'Innovative and collaborative environment with focus on continuous learning',
          techStack: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
          interviewProcess: 'Technical round + System design + HR interview',
          salaryRange: '₹15-30 LPA',
          workLifeBalance: '4.2',
          growthOpportunities: '4.5'
        }
      ];
      setCompanies(demoCompanies);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract company data from jobs
  const getIndustryFromJob = (job) => {
    const title = (job.job || '').toLowerCase();
    if (title.includes('software') || title.includes('developer') || title.includes('engineer')) {
      return 'Technology';
    } else if (title.includes('data') || title.includes('analytics')) {
      return 'Data Analytics';
    } else if (title.includes('design') || title.includes('ui')) {
      return 'Design & Media';
    } else if (title.includes('marketing') || title.includes('sales')) {
      return 'Marketing';
    } else if (title.includes('cloud') || title.includes('aws')) {
      return 'Cloud Computing';
    } else if (title.includes('finance') || title.includes('accounting')) {
      return 'Financial Technology';
    } else {
      return 'Technology';
    }
  };

  const getCompanySizeFromJobs = (jobs, companyName) => {
    const companyJobs = jobs.filter(job => job.company === companyName);
    const jobCount = companyJobs.length;
    if (jobCount >= 10) return '1000-5000';
    if (jobCount >= 5) return '500-1000';
    if (jobCount >= 3) return '100-500';
    return '50-100';
  };

  const getBenefitsFromJob = (job) => {
    const benefits = [];
    if (job.jobType === 'Remote') benefits.push('Remote Work');
    if (job.jobType === 'Full-time') benefits.push('Health Insurance');
    benefits.push('Competitive Salary');
    if (Math.random() > 0.5) benefits.push('Career Growth');
    return benefits.slice(0, 4);
  };

  const getTechStackFromJobs = (jobs, companyName) => {
    const companyJobs = jobs.filter(job => job.company === companyName);
    const allTech = new Set();
    companyJobs.forEach(job => {
      const title = (job.job || '').toLowerCase();
      if (title.includes('react')) allTech.add('React');
      if (title.includes('node')) allTech.add('Node.js');
      if (title.includes('python')) allTech.add('Python');
      if (title.includes('aws')) allTech.add('AWS');
      if (title.includes('docker')) allTech.add('Docker');
    });
    return Array.from(allTech).slice(0, 5);
  };

  const industries = ['all', 'Technology', 'Research & Development', 'Design & Media', 'Data Analytics', 'Marketing', 'Cloud Computing', 'Financial Technology', 'Healthcare Technology'];
  const sizes = ['all', '1-50', '50-100', '100-200', '200-500', '500-1000', '1000-5000', '5000+'];
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'openPositions', label: 'Open Positions (High to Low)' },
    { value: 'size', label: 'Company Size (Small to Large)' }
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'all' || company.size === selectedSize;

    return matchesSearch && matchesIndustry && matchesSize;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'openPositions':
        return b.openPositions - a.openPositions;
      case 'size':
        return parseInt(a.size.split('-')[0]) - parseInt(b.size.split('-')[0]);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const featuredCompanies = companies.filter(company => company.featured);
  const regularCompanies = filteredCompanies.filter(company => !company.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">⭐</span>);
    }
    return stars;
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const closeModal = () => {
    setShowCompanyDetails(false);
    setSelectedCompany(null);
  };

  const isCompanySaved = (companyId) => {
    return savedCompanies.some(c => c.id === companyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Top Companies</h1>
          <p className="text-xl opacity-90">Discover amazing companies hiring talented professionals</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {sizes.map(size => (
                <option key={size} value={size}>
                  {size === 'all' ? 'All Sizes' : size + ' employees'}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h3 className="text-xl text-gray-600 mb-2">No companies found</h3>
            <p className="text-gray-500">There are no companies with job postings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <div key={company.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {company.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      {renderStars(company.rating)}
                      <span className="ml-1 text-sm text-gray-600">({company.rating})</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🏭</span>
                    <span>{company.industry}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👥</span>
                    <span>{company.size} employees</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">💼</span>
                    <span>{company.openPositions} open positions</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCompanyClick(company)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  <Link
                    to={`/jobs?company=${encodeURIComponent(company.name)}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
                  >
                    View Jobs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCompanies.length === 0 && companies.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h3 className="text-xl text-gray-600 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Companies;
