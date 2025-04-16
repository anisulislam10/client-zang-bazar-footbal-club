import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MemberDetails = () => {
  const { slug } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}members/get/${slug}`);
        setMember(response.data.data); // Changed from response.data.members to response.data.data
      } catch (err) {
        setError("Failed to load member details. Please try again later.");
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-red-600 text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <p className="text-gray-600">Member not found</p>
          <Link 
            to="/members"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <header className="relative bg-gradient-to-r from-blue-800 to-blue-700 text-white py-12 md:py-16 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik0wIDBoNTB2NTBIMHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMDUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {member.memberName || 'Member Profile'}
            </h1>
           
          </div>
        </div>
      </header>

      {/* Profile Card */}
      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Image Section */}
            <div className="lg:w-1/3 p-6 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-md group-hover:opacity-75 transition-opacity duration-300"></div>
                {member.memberImage ? (
                  <img 
                    src={`${import.meta.env.VITE_SERVER_URL.replace("api/", "")}uploads/${member.memberImage}`}
                    alt={member.memberName}
                    className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-lg z-10 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-200 border-4 border-white shadow-lg z-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Details Section */}
            <div className="lg:w-2/3 p-6 md:p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Profile Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</h3>
                    <p className="text-gray-800 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {member.email || 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</h3>
                    <p className="text-gray-800 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {member.phone || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">About</h3>
                    <p className="text-gray-800 leading-relaxed">
                      {member.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link 
            to="/members"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Members
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;