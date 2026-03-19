import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [error, setError] = useState(null);

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedType(searchParams.get('type') || 'all');
    setSelectedLocation(searchParams.get('location') || 'all');
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/jobs/getjob');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedJobs = data.map(job => ({
        id: job._id,
        title: job.job,
        company: job.company,
        location: job.location,
        type: job.jobType,
        category: job.category || 'General',
        salary: job.salary || 'Not specified',
        posted: new Date(job.createdAt).toLocaleDateString(),
        description: job.jobDescription,
        skills: job.skills || ['React', 'JavaScript', 'Node.js'],
        experience: job.experience || 'Not specified',
        education: job.education || 'Not specified',
        deadline: job.deadline || 'Open until filled',
        remote: job.remote || false,
        benefits: job.benefits || ['Health Insurance', '401k', 'Paid Time Off']
      }));
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Engineering', 'Product', 'Design', 'Data Science', 'Marketing'];
  const jobTypes = ['all', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const locations = ['all', 'San Francisco, CA', 'New York, NY', 'Remote', 'Boston, MA', 'Los Angeles, CA', 'Seattle, WA'];

  // Update URL when filters change
  const updateURL = (search, category, type, location) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    if (type && type !== 'all') params.set('type', type);
    if (location && location !== 'all') params.set('location', location);
    const newURL = params.toString() ? `?${params.toString()}` : '';
    window.history.pushState(null, '', newURL);
  };

  // Handle filter changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    updateURL(value, selectedCategory, selectedType, selectedLocation);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updateURL(searchTerm, value, selectedType, selectedLocation);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    updateURL(searchTerm, selectedCategory, value, selectedLocation);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    updateURL(searchTerm, selectedCategory, selectedType, value);
  };

  // Save job functionality
  const handleSaveJob = (job) => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isJobSaved = savedJobs.some(savedJob => savedJob.id === job.id);

    if (!isJobSaved) {
      const updatedSavedJobs = [...savedJobs, job];
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      alert('Job saved successfully!');
    } else {
      alert('Job is already saved!');
    }
  };

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filter by job type
    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory, selectedType, selectedLocation, jobs]);

  return (
    <div className="w-full p-8 bg-gray-50 min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse Jobs</h1>
        <p className="text-lg text-gray-600">Find your dream job from {filteredJobs.length} available positions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
          <p>{error}</p>
          <button onClick={fetchJobs} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-[300px_1fr] gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-8">
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Search</h3>
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Category</h3>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Job Type</h3>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Location</h3>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-4 items-stretch">
          {loading ? (
            <div className="w-full text-center py-12">
              <h3 className="text-xl text-gray-600">Loading jobs...</h3>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="w-full text-center py-12 bg-gray-100 rounded-xl">
              <h3 className="text-xl text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-between gap-8 flex-1 min-w-[350px] max-w-[500px] border border-gray-100">
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 tracking-tight">{job.title}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-0">🏢 {job.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="font-semibold text-green-600 text-sm bg-green-50 px-3 py-1 rounded-md border border-green-200">💰 {job.salary}</span>
                    <span className="text-gray-600 text-sm font-medium">📍 {job.location}</span>
                    <span className="text-gray-600 text-sm font-medium">💼 {job.type}</span>
                    {job.remote && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md border border-green-200">🏠 Remote</span>}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200">📁 {job.category}</span>
                    {job.experience !== 'Not specified' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md border border-yellow-200">⭐ {job.experience}</span>}
                    <span className="text-gray-400 text-xs font-normal">📅 {job.posted}</span>
                  </div>

                  <div className="flex gap-2 m-0 p-0 border-none">
                    <Link to={`/apply/${job.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md text-decoration-none font-semibold text-sm text-center transition-all duration-200 border border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:transform hover:-translate-y-0.5 whitespace-nowrap">Apply Now</Link>
                    <button onClick={() => handleSaveJob(job)} className="bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-md cursor-pointer font-medium text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 whitespace-nowrap">
                      {JSON.parse(localStorage.getItem('savedJobs') || '[]').some(savedJob => savedJob.id === job.id) ? '💾 Saved' : '💾 Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
