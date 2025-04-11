import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditNextMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    league: '',
    homeTeam: '',
    awayTeam: '',
    matchDate: '',
    matchTime: '',
    status: 'upcoming'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}nextmatch/get/${id}`);
        const match = res.data.match;
        setFormData({
          league: match.league,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          matchDate: new Date(match.matchDate).toISOString().split('T')[0],
          matchTime: match.matchTime,
          status: match.status
        });
      } catch (err) {
        setError('Failed to load match data');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}nextmatch/update/${id}`, {
        ...formData,
        matchDate: new Date(formData.matchDate)
      });
      navigate('/dashboard/homepage/next-match');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update match');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/dashboard/homepage/next-match')}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Match</h1>
            <p className="text-gray-600">Update the match details</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* League Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                League/Tournament
              </label>
              <input
                type="text"
                name="league"
                value={formData.league}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
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
              <label className="block text-sm font-medium text-gray-700">
                Home Team
              </label>
              <input
                type="text"
                name="homeTeam"
                value={formData.homeTeam}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Away Team Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Away Team
              </label>
              <input
                type="text"
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Match Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Match Date
              </label>
              <input
                type="date"
                name="matchDate"
                value={formData.matchDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Match Time Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Match Time
              </label>
              <input
                type="time"
                name="matchTime"
                value={formData.matchTime}
                onChange={handleChange}
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
                  Updating Match...
                </span>
              ) : 'Update Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNextMatch;