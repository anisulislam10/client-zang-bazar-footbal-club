import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';

const Trophies = () => {
  const [trophyData, setTrophyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controls = useAnimation();

  // Fetch data from API
  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}honors/getAll`);
        if (response.data.status === 'success') {
          setTrophyData(response.data.data);
        }
      } catch (err) {
        setError('Failed to load trophies');
        console.error('Error fetching trophies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrophies();
  }, []);

  // Animation setup
  useEffect(() => {
    if (trophyData.length > 0) {
      const containerWidth = trophyData.length * 220;
      const sequence = async () => {
        // Faster animation with 8 second duration
        await controls.start({
          x: [-containerWidth / 3, 0], // Start further left for better flow
          transition: { 
            duration: 8, 
            ease: "linear", 
            repeat: Infinity,
            repeatType: "loop"
          }
        });
      };
      sequence();
    }
  }, [trophyData, controls]);

  // Animation variants with smoother transitions
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formatYear = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-center max-w-md mx-auto">
        <div className="flex items-center justify-center">
          <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (trophyData.length === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-center max-w-md mx-auto">
        <div className="flex items-center justify-center">
          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-700 font-medium">No trophies found</span>
        </div>
      </div>
    );
  }

  const containerWidth = trophyData.length * 220;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Club Honors
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Celebrating our historic achievements
        </p>
      </div>

      <div className="relative overflow-hidden py-8">
        {/* Gradient fade effects */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <motion.div 
          className="flex space-x-8"
          animate={controls}
          style={{ width: `${containerWidth}px` }}
        >
          {trophyData.map((trophy) => (
            <motion.div 
              key={trophy._id}
              variants={item}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 w-[240px] border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{trophy.tournamentName}</h3>
                <div className="flex justify-center items-baseline my-3">
                  <span className="text-4xl font-extrabold text-blue-600 mr-2">{trophy.winCount}</span>
                  <span className="text-sm font-medium text-gray-500">Titles</span>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Last won: <span className="text-gray-900">{formatYear(trophy.lastWinDate)}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Trophies;