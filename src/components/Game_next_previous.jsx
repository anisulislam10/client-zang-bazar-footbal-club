import React from 'react'
import { motion } from 'framer-motion';

const Game_next_previous = () => {
  // Sample data
  const nextGame = {
    league: "Premier League",
    homeTeam: "Manchester United",
    awayTeam: "Chelsea",
    date: "2023-11-15",
    time: "20:00",
    tournamentLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4W3xezhKKSqGlrwkeah5wJrjnCu-pba83mQ&s"
  };

  const lastGames = [
    {
      league: "Premier League",
      homeTeam: "Manchester United",
      awayTeam: "Chelsea",
      homeScore: 1,
      awayScore: 2,
      date: "2023-11-05"
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Next Game Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden"
        >
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0">Next Match</h2>
              <div className="flex items-center bg-blue-800/30 px-2 sm:px-3 py-1 rounded-full">
                <img 
                  src={nextGame.tournamentLogo} 
                  alt={nextGame.league} 
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2"
                />
                <span className="text-xs sm:text-sm font-medium text-blue-100">{nextGame.league}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <div className="text-center mb-4 sm:mb-0 w-full sm:w-auto">
                <p className="text-lg sm:text-xl font-bold text-white">{nextGame.homeTeam}</p>
              </div>
              
              <div className="flex flex-col items-center mx-0 sm:mx-2 md:mx-4 mb-4 sm:mb-0">
                <div className="bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
                  <p className="text-white font-bold text-base sm:text-lg">VS</p>
                </div>
                <div className="mt-2 sm:mt-4 bg-white/10 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
                  <p className="text-white font-medium text-xs sm:text-sm">
                    {new Date(nextGame.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-white font-bold text-center text-sm sm:text-base">{nextGame.time}</p>
                </div>
              </div>
              
              <div className="text-center w-full sm:w-auto">
                <p className="text-lg sm:text-xl font-bold text-white">{nextGame.awayTeam}</p>
              </div>
            </div>

            <div className="w-full bg-white/10 h-1 sm:h-2 rounded-full overflow-hidden">
              <div 
                className="bg-yellow-400 h-full rounded-full animate-pulse" 
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Last Game Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden"
        >
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0">Last Result</h2>
              <div className="flex items-center bg-gray-700/50 px-2 sm:px-3 py-1 rounded-full">
                <span className="text-xs sm:text-sm font-medium text-gray-200">{lastGames[0].league}</span>
              </div>
            </div>

            {lastGames.map((game, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-center w-full sm:w-2/5 mb-3 sm:mb-0">
                    <p className="text-base sm:text-lg font-bold text-white">{game.homeTeam}</p>
                  </div>
                  
                  <div className="flex items-center justify-center w-full sm:w-1/5 mb-3 sm:mb-0">
                    <div className="bg-gray-700/50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center">
                      <span className={`text-xl sm:text-2xl font-bold ${game.homeScore > game.awayScore ? 'text-green-400' : 'text-white'}`}>
                        {game.homeScore}
                      </span>
                      <span className="mx-1 sm:mx-2 text-white">-</span>
                      <span className={`text-xl sm:text-2xl font-bold ${game.awayScore > game.homeScore ? 'text-green-400' : 'text-white'}`}>
                        {game.awayScore}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center w-full sm:w-2/5">
                    <p className="text-base sm:text-lg font-bold text-white">{game.awayTeam}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {new Date(game.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Game_next_previous;