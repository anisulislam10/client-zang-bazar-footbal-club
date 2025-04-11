import React, { useEffect, useState } from "react";
import axios from "axios";
import PlayerCard from "../components/PlayerCard";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_SERVER_URL}players/get`;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        if (response.status === 200) {
          const formattedPlayers = response.data.players.map((player) => ({
            id: player._id,
            name: player.playerName,
            image: `/uploads/${player.playerImage}`,
           
          }));
          setPlayers(formattedPlayers);
        }
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Elite Squad
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Meet the talented athletes who bring passion, skill, and dedication to every match. 
            These professionals represent the heart and soul of our club's legacy.
          </p>
        </div>
      </div>

      {/* Players Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Team Roster</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600">
              Each player brings unique strengths to our collective success. 
              From seasoned veterans to rising stars, our squad combines 
              experience with youthful energy for unbeatable performance.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No player data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>

      {/* Team Philosophy Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
            Club Philosophy
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            More Than Just Players - A Family
          </h3>
          <p className="text-gray-600 mb-4">
            Our team operates as a cohesive unit where every member plays a vital role. 
            We believe in fostering talent, building character, and creating lasting 
            bonds that translate into exceptional performance on the field.
          </p>
          <p className="text-gray-600">
            Behind every jersey number is a story of perseverance, training, and 
            dedication to the beautiful game. We're proud to showcase these 
            remarkable athletes who represent our values both on and off the pitch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Players;