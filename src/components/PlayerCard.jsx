import React from "react";

function PlayerCard({ player }) {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out hover:shadow-2xl ml-10 mt-10 mb-10">
      {/* Player Image */}
     
      <div className="relative h-72 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_SERVER_URL.replace('/api/', '')}${player.image}`}
          alt={player.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Player Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{player.name}</h3>
            <p className="text-blue-600 font-medium">{player.position}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            #{player.jerseyNumber}
          </span>
        </div>

        {/* Meet Our Player Section
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Meet Our Player</h4>
          <p className="text-gray-600">
            {player.bio || `${player.name} is a key player of our team, known for ${player.specialty || 'their exceptional skills and dedication'}.`}
          </p>
        </div> */}

        {/* Stats/Details
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-sm text-gray-500">Matches</p>
            <p className="font-bold text-gray-900">{player.matches || '--'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Goals</p>
            <p className="font-bold text-gray-900">{player.goals || '--'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nationality</p>
            <p className="font-bold text-gray-900">{player.nationality || '--'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-bold text-gray-900">
              {player.age ? `${player.age} yrs` : '--'}
            </p>
          </div>
        </div> */}

        {/* Social Links (optional) */}
        {player.socialLinks && (
          <div className="flex space-x-3 mt-6">
            {player.socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <span className="sr-only">{link.platform}</span>
                {/* Replace with actual icons */}
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  {/* Social media icon paths */}
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;