import axios from 'axios';
import { param } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [playersCount, setplayersCount] = useState()
  const [memberCount, setmemberCount] = useState()
  const [blogCount, setBlogCount] = useState()
  const [emailCount, setEmailCount] = useState()






  useEffect(() => {
    const fetchPlayerCount= async()=>{
      const response= await axios.get(`${import.meta.env.VITE_SERVER_URL}players/count`)
      setplayersCount(response.data.totalPlayers)
    }
    fetchPlayerCount()
  }, [])



  useEffect(() => {
    const fetchMembersCount= async()=>{
      const response= await axios.get(`${import.meta.env.VITE_SERVER_URL}members/count`)
      setmemberCount(response.data.totalMembers)
    }
    fetchMembersCount()
  }, [])



  useEffect(() => {
    const fetchBlogCount= async()=>{
      const response= await axios.get(`${import.meta.env.VITE_SERVER_URL}blog/count`)      
      setBlogCount(response.data.count)
    }
    fetchBlogCount()
  }, [])


 
  useEffect(() => {
    const fetchEmailCount= async()=>{
      const response= await axios.get(`${import.meta.env.VITE_SERVER_URL}send/submit-count`)
      
      setEmailCount(response.data.totalContacts)
    }
    fetchEmailCount()
  }, [])


  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-25">Dashboard</h2>
      <p className="mb-4">Welcome to the admin dashboard. <span className='bg-green-200 px-2 rounded-md py-2'> Build with Node JS 18.20.7, Express JS 5.1.0, React JS 19.0.0 </span></p>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Players Card */}
        <div className="bg-red-400 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-white">Total Players</h3>
          <p className="text-2xl font-bold text-white">{playersCount}</p>
        </div>

        {/* Total Members Card */}
        <div className="bg-green-400 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-white">Total Members</h3>
          <p className="text-2xl font-bold text-white">{memberCount}</p>
        </div>

        {/* Total Blogs Card */}
        <div className="bg-yellow-400 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-white">Total Blogs</h3>
          <p className="text-2xl font-bold text-white">{blogCount}</p>
        </div>

        {/* username */}
        <div className="bg-blue-500 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-white">username</h3>
          <p className="text-xl font-bold text-white">@admin</p>
        </div>

            {/* last login */}
            <div className="bg-orange-500 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-white"> Total Email Recieved</h3>
          <p className="text-xl font-bold text-white">{emailCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
