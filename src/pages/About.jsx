import axios from "axios";
import React, { useEffect, useState } from "react";

import { FaTrophy, FaUsers, FaHistory, FaQuoteLeft } from "react-icons/fa";

const About = () => {
  const [data, setData] = useState()
  
  
  useEffect(() => {
    const fetchData = async()=>{

      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}about/getAll`)
      setData(response.data.data[0])


    }
    fetchData()
  
  }, [])

  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ">
      {/* Hero Section - Color Background */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg sm:rounded-xl shadow-md sm:shadow-xl mb-8 sm:mb-16 p-6 sm:p-8 md:p-12 text-white ">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-5">{data?.aboutUsTitle}</h1>
          <div className="flex items-start">
            <FaQuoteLeft className="text-blue-300 mr-3 mt-1 flex-shrink-0 text-lg sm:text-xl" />
            <p className="text-sm sm:text-base md:text-xl italic">{data?.aboutUsSubTitle} 
             
            </p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-12 sm:mb-16">
        <div>
          <div className="flex items-center mb-4 sm:mb-6">
            <FaHistory className="text-2xl sm:text-3xl text-blue-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold">{data?.aboutUsHeader}</h2>
          </div>
          <div className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed" dangerouslySetInnerHTML={ {__html: data?.aboutUsDescription || '' }} 
            
          />
         
        </div>
        
        {/* Philosophy Section with Image */}
        <div className="relative mt-4 sm:mt-0">
        <img 
  src={`${import.meta.env.VITE_SERVER_URL.replace("/api", "") || ''}uploads/${data?.aboutUsImage?.replace(/\\/g, '/')}`}
  alt="Team with Trophy" 
  className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-t-lg sm:rounded-t-xl"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/default-team.jpg'; 
  }}
/>
          <div className="bg-gray-100 p-4 sm:p-6 md:p-8 rounded-b-lg sm:rounded-b-xl border-l-4 border-blue-600">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800">{data?.aboutUsPhilosophyTitle}</h3>
            <div className="text-gray-600 mb-2 sm:mb-4 italic text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: data?.aboutUsPhilosophyDescription || '' 
  }}
/>
           
          </div>
        </div>
      </div>

    

    
    </div>
  );
}

export default About;