import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Honors = () => {
  const [honors, setHonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tournamentName: '',
    winCount: 0,
    lastWinDate: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all honors
  const fetchHonors = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}honors/getAll`);
      setHonors(data.data);
    } catch (error) {
      toast.error('Failed to fetch honors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHonors();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'winCount' ? parseInt(value) || 0 : value
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_SERVER_URL}honors/update/${editingId}`, formData);
        toast.success('Honor updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}honors/post`, formData);
        toast.success('Honor created successfully');
      }
      setFormData({ tournamentName: '', winCount: 0, lastWinDate: '' });
      setEditingId(null);
      fetchHonors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving honor');
    }
  };



  const handleEdit = (honor) => {
    setFormData({
      tournamentName: honor.tournamentName,
      winCount: honor.winCount,
      lastWinDate: honor.lastWinDate.split('T')[0]
    });
    setEditingId(honor._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete honor
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this honor?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}honors/delete/${id}`);
        toast.success('Honor deleted successfully');
        fetchHonors();
      } catch (error) {
        toast.error('Failed to delete honor');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Honors</h1>
      
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Honor' : 'Add New Honor'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Name
              </label>
              <input
                type="text"
                name="tournamentName"
                value={formData.tournamentName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Win Count
              </label>
              <input
                type="number"
                min="0"
                name="winCount"
                value={formData.winCount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Win Date
              </label>
              <input
                type="date"
                name="lastWinDate"
                value={formData.lastWinDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Update Honor' : 'Save Honor'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ tournamentName: '', winCount: 0, lastWinDate: '' });
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Honors List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Honors List</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : honors?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No honors found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {honors.map((honor) => (
              <div key={honor._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-800">{honor.tournamentName}</h3>
                    <p className="text-sm text-gray-500">
                      Wins: {honor.winCount} | Last Win: {new Date(honor.lastWinDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRecordWin(honor._id)}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md hover:bg-green-200 transition-colors"
                    >
                      + Record Win
                    </button>
                    
                    <button
                      onClick={() => handleEdit(honor)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(honor._id)}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-md hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Honors;