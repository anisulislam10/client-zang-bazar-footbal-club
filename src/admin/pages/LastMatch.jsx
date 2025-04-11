import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LastMatch = () => {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    league: '',
    homeTeam: '',
    awayTeam: '',
    homeScore: '',
    awayScore: '',
    matchDate: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all matches on component mount
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}lastmatch/get`);
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing match
        await axios.put(`${import.meta.env.VITE_SERVER_URL}lastmatch/update/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Create new match
        await axios.post(`${import.meta.env.VITE_SERVER_URL}lastmatch/post`, formData);
      }
      setFormData({
        league: '',
        homeTeam: '',
        awayTeam: '',
        homeScore: '',
        awayScore: '',
        matchDate: ''
      });
      fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleEdit = (match) => {
    setFormData({
      league: match.league,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      matchDate: match.matchDate.split('T')[0] // Format date if needed
    });
    setEditingId(match._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}lastmatch/delete/${id}`);
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Last Match Results</h1>
      
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Match' : 'Add New Match'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">League</label>
              <input
                type="text"
                name="league"
                value={formData.league}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Match Date</label>
              <input
                type="date"
                name="matchDate"
                value={formData.matchDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Home Team</label>
              <input
                type="text"
                name="homeTeam"
                value={formData.homeTeam}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Home Score</label>
              <input
                type="number"
                name="homeScore"
                value={formData.homeScore}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Away Team</label>
              <input
                type="text"
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Away Score</label>
              <input
                type="number"
                name="awayScore"
                value={formData.awayScore}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {editingId ? 'Update Match' : 'Add Match'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  league: '',
                  homeTeam: '',
                  awayTeam: '',
                  homeScore: '',
                  awayScore: '',
                  matchDate: ''
                });
              }}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map(match => (
          <div key={match._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{match.league}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(match.matchDate).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="font-medium">{match.homeTeam}</p>
                    <p className="text-2xl font-bold">{match.homeScore}</p>
                  </div>
                  <span className="text-xl">vs</span>
                  <div className="text-center">
                    <p className="font-medium">{match.awayTeam}</p>
                    <p className="text-2xl font-bold">{match.awayScore}</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(match)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(match._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastMatch;