import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const NextMatch = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}nextmatch/getAll`)
        // Get first two matches
        const firstTwoMatches = response.data.matches.slice(0, 2)
        setMatches(firstTwoMatches)
      } catch (err) {
        setError('Failed to load match data')
        console.error("Error fetching matches:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No upcoming matches found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4">
      {matches.map((match, index) => (
        <motion.div
          key={match._id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full"
        >
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 sm:p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold">Upcoming Match</h2>
                <span className="bg-blue-900/40 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {match.league}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-6">
              {/* Match Teams */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="text-center w-2/5">
                  <p className="text-base sm:text-lg font-bold truncate">{match.homeTeam}</p>
                  <p className="text-xs text-gray-500 mt-1">Home</p>
                </div>
                
                <div className="mx-1 sm:mx-2 text-center w-1/5">
                  <div className="bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">VS</p>
                  </div>
                </div>
                
                <div className="text-center w-2/5">
                  <p className="text-base sm:text-lg font-bold truncate">{match.awayTeam}</p>
                  <p className="text-xs text-gray-500 mt-1">Away</p>
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(match.matchDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{match.matchTime}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    match.status === 'live' ? 'bg-green-100 text-green-800' :
                    match.status === 'postponed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {match.status?.charAt(0).toUpperCase() + match.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default NextMatch