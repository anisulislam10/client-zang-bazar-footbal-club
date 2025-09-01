import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

function Footer() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}contact/getAll`);
        if (response.data.data && response.data.data.length > 0) {
          setContactData(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setError('Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="bg-gray-800 text-white py-12 text-center">Loading footer...</div>;
  if (error) return <div className="bg-gray-800 text-white py-12 text-center">{error}</div>;

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* About Club Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-500 pb-2 inline-block">About Club</h3>
            <p className="text-gray-300 mb-4">
              Founded in 1878, we are one of the most successful football clubs in history with a rich tradition and passionate fan base.
            </p>
            <div className="flex space-x-4">
              <img 
                src={`${import.meta.env.VITE_SERVER_URL.replace("api/", "")}uploads/${contactData?.image.replace(/\\/g, '/')}`} 
                alt="Club Badge" 
                className="h-12 w-12 object-contain"
                loading="lazy"
              />

            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-500 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-blue-400 transition">Home</a></li>
              <li><a href="/players" className="text-gray-300 hover:text-blue-400 transition">Players</a></li>
              <li><a href="/members" className="text-gray-300 hover:text-blue-400 transition">Members</a></li>
              <li><a href="/news" className="text-gray-300 hover:text-blue-400 transition">News</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-blue-400 transition">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-blue-400 transition">Contact</a></li>
              <li><a href="/gallery" className="text-gray-300 hover:text-blue-400 transition">Gallery</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-500 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-400" />
                <span>{contactData?.location || "Old Trafford, Sir Matt Busby Way, Stretford, Manchester M16 0RA"}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-blue-400" />
                <span>{contactData?.phoneOne || "+44 161 868 8000"}</span>
              </li>


              <li className="flex items-center">
                <FaPhone className="mr-3 text-blue-400" />
                <span>{contactData?.phoneTwo || "+44 161 868 8000"}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-400" />
                <span>{contactData?.email || "enquiries@club.com"}</span>
              </li>
              
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-500 pb-2 inline-block">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="#" 
                aria-label="Facebook" 
                className="bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a 
                href="#" 
                aria-label="Twitter" 
                className="bg-blue-400 hover:bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram" 
                className="bg-pink-600 hover:bg-pink-700 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="#" 
                aria-label="YouTube" 
                className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaYoutube className="text-xl" />
              </a>
            </div>
            
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Zang Bazar Football Club. All Rights Reserved. | Developed by <span className='text-gray text-md font-semibold'>  <a  href="https://github.com/anisulislam10/"  >  Anisul </a></span> </p>
          
      </div>
    </footer>
  );
}

export default Footer;