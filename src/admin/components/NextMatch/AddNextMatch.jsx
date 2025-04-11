import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const AddNextMatch = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}nextmatch/post`, {
        ...formData,
        matchDate: new Date(formData.matchDate)
      });
      navigate('/dashboard/homepage/next-match');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Match</h1>
            <p className="text-gray-600">Fill in the details for the upcoming match</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/homepage/next-match')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Matches
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleSubmit(Object.fromEntries(formData));
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* League Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                League/Tournament
              </label>
              <input
                type="text"
                name="league"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Premier League"
              />
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                defaultValue="upcoming"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Home Team Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Home Team
              </label>
              <input
                type="text"
                name="homeTeam"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Home Team Name"
              />
            </div>

            {/* Away Team Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Away Team
              </label>
              <input
                type="text"
                name="awayTeam"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Away Team Name"
              />
            </div>

            {/* Match Date Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Match Date
              </label>
              <input
                type="date"
                name="matchDate"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Match Time Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Match Time
              </label>
              <input
                type="time"
                name="matchTime"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Match...
                </span>
              ) : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNextMatch;