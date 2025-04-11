import React, { useState, useEffect } from "react";
import axios from "axios";

function Members() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}members/get`);
        setMembers(response.data.members || []);
      } catch (err) {
        setError("Failed to load members. Please try again later.");
        console.error("Error fetching members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-red-600 text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-1 px-4 sm:px-6 lg:px-8 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Philosophy */}
        <div className="relative bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Our Dedicated Members
            </h1>
            </div>
          
          
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 mb-6">
              "We unite diverse talents to create extraordinary results."
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Collaboration', 'Innovation', 'Excellence', 'Integrity', 'Creativity', 'Teamwork'].map((value) => (
                <span key={value} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Members Grid */}
        {members.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <p className="text-gray-500 text-xl">We're currently building our dream team. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <div 
                key={member._id}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Member Card */}
                <div className="relative z-10 p-6 flex flex-col items-center h-full">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    {member.memberImage ? (
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL.replace("api/", "")}uploads/${member.memberImage}`}
                        alt={member.memberName}
                        className="h-36 w-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-blue-100 transition-all duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="h-36 w-36 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
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

                  {/* Member Info */}
                  <div className="text-center flex-grow">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-500">
                        {member.memberName}
                      </h3>
                      <span className="bg-blue-500 text-white p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    
                   
                  </div>

                 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Members;