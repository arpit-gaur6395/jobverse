import { useState } from 'react';
import { API_URL } from '../config/api';
import { ShimmerButton } from '../components/Shimmer';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
                  <div className="space-y-2 mt-2">
                    {analysis.recommendedJobs.slice(0, 5).map((job, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{job.job || job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-sm text-green-600">Match: {job.matchScore}%</p>
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
    </div>
  );
};

export default ResumeAnalysis;
