import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); 

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token); 
        localStorage.setItem("isAuthenticated", "true"); 
  localStorage.setItem("superadmin", JSON.stringify(data.data)); // Save the admin object with _id
        navigate("/dashboard"); 
      } else {
        setMessage(data.message || "Invalid credentials!");
      }
    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong! Please try again.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/037/038/095/non_2x/a-flying-football-ball-abowe-blue-flat-wave-abstract-background-vector.jpg')",
      }}
    >
      {/* Low opacity form background */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 bg-opacity-60">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        {message && (
          <div className="text-center mb-4 text-red-600">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 w-full rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
