import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function News() {
  const [data, setdata] = useState()

  useEffect(() => {
   const fetchData= async()=>{
    const response= await axios.get(`${import.meta.env.VITE_SERVER_URL}blog/get/all`)
    setdata(response.data)
   }
   fetchData();
  }, [])
  
  const news = [
    { 
      id: 1, 
      title: "The Future of Web Development", 
      description: "Exploring the latest trends in modern web development frameworks and tools that are shaping 2023.", 
      date: "May 15, 2023"
    },
    { 
      id: 2, 
      title: "Sustainable Design Practices", 
      description: "How eco-friendly design principles are transforming the tech industry and reducing carbon footprints.", 
      date: "June 2, 2023"
    },
    { 
      id: 3, 
      title: "AI Revolution in Business", 
      description: "Examining how artificial intelligence is automating processes and creating new opportunities.", 
      date: "June 10, 2023"
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-800 text-white py-16 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto text-center mt-15">
          <h1 className="text-4xl font-bold mb-4">Read Our Blogs</h1>
          <p className="text-xl opacity-90">
            Discover insightful articles on Football
          </p>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
              <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
              <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <Link 
                  to={`/news/${item.slug}`} 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}

export default News;