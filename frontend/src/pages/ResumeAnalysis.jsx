import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { ShimmerButton } from '../components/Shimmer';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';
import ApplyForm from './ApplyForm';

const ResumeAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('provider', 'groq');

    try {
      const response = await fetch(`${API_URL}/analyze-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      console.log('Resume analysis response:', data);
      setAnalysis(data.data || data);
    } catch (err) {
      console.error('Resume analysis error:', err);
      setError(`Failed to analyze resume: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resume Analysis</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white relative overflow-hidden
              ${!file || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <div className="w-full h-full absolute inset-0">
                <ShimmerButton />
              </div>
            ) : null}
            <span className={loading ? 'opacity-0' : ''}>Analyze Resume</span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center text-white">
                Analyzing...
              </span>
            )}
          </button>
        </div>

        {analysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Skills Found</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.skills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Recommended Jobs ({analysis.recommendedJobs?.length || 0})</h3>
                {analysis.recommendedJobs && analysis.recommendedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {analysis.recommendedJobs.slice(0, 6).map((job, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800 mb-1">{job.job || job.title}</h4>
                            <p className="text-orange-500 font-medium text-sm">{job.company}</p>
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            {job.matchScore}% Match
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm space-x-3 mb-3">
                          {job.location && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                          )}
                          {job.type && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {job.type}
                            </span>
                          )}
                        </div>
                        {job.salary && job.salary !== "Not specified" && (
                          <p className="text-green-600 font-semibold text-sm mb-3">{job.salary}</p>
                        )}
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-amber-500 transition-all text-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No matching jobs found</p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Provider</h3>
                <p className="text-gray-600">{analysis.provider || 'local'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedJob && <ApplyForm job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default ResumeAnalysis;
