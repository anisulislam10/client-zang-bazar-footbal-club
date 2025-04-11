import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaUpload } from "react-icons/fa"; 

const AddPlayer = () => {
  const [playerName, setPlayerName] = useState("");
  const [image, setImage] = useState(null);
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}players/get`);
      setPlayers(response.data.players);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("playerName", playerName);
    formData.append("playerImage", image);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}players/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.statusCode === 201) {
        toast.success("Player added successfully!");
        fetchPlayers();
      }
    } catch (error) {
      toast.error("An error occurred while adding the player.");
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append("playerName", playerName);
    formData.append("playerImage", image);

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}players/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.statusCode === 200) {
        toast.success("Player updated successfully!");
        fetchPlayers();
        setEditingPlayer(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while updating the player.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}players/delete/${playerToDelete}`);
      if (response.data.statusCode === 200) {
        toast.success("Player deleted successfully!");
        fetchPlayers();
        setIsDeleteConfirmationOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the player.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Add Player</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="playerName" className="block text-lg font-medium">Player Name</label>
          <input
            id="playerName"
            type="text"
            placeholder="Enter Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="playerImage" className="block text-lg font-medium">Upload Image</label>
          <div className="flex items-center space-x-2">
            <input
              id="playerImage"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <FaUpload className="text-blue-500 text-2xl" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Player
        </button>
      </form>

      {/* Display added player details */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Players</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player._id} className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src={`${import.meta.env.VITE_SERVER_URL.replace("api/", "")}uploads/${player.playerImage}`}
                alt={player.playerName}
                className="w-24 h-24 object-cover rounded-full mx-auto"
              />
              <h4 className="text-lg font-semibold mt-4">{player.playerName}</h4>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
                  onClick={() => {
                    setEditingPlayer(player);
                    setPlayerName(player.playerName);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit className="inline-block mr-2" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                  onClick={() => {
                    setPlayerToDelete(player._id);
                    setIsDeleteConfirmationOpen(true);
                  }}
                >
                  <FaTrashAlt className="inline-block mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Player Modal */}
      {isModalOpen && editingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Update Player</h3>
            <form onSubmit={() => handleUpdate(editingPlayer._id)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="playerName" className="block text-lg font-medium">Player Name</label>
                <input
                  id="playerName"
                  type="text"
                  placeholder="Enter Player Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="playerImage" className="block text-lg font-medium">Upload Image</label>
                <input
                  id="playerImage"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Update Player
              </button>
              <button
                type="button"
                className="w-full py-3 mt-4 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Are you sure you want to delete this player?</h3>
            <div className="flex justify-between">
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                onClick={() => setIsDeleteConfirmationOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddPlayer;
