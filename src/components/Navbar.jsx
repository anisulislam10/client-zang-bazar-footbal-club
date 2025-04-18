import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import axios from 'axios';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactData, setContactData] = useState(null);
    const [loading, setLoading] = useState(true);
  
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-800/70 backdrop-blur-lg' : 'bg-gray-800'} text-white p-4`}>
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo or Brand */}
        <Link to="/">
  <img 
    src={`${import.meta.env.VITE_SERVER_URL.replace("api/", "")}uploads/${contactData?.image?.replace(/\\/g, '/')}`} 
    alt="Club Badge" 
    className="h-18 w-18 object-contain"
    loading="lazy"
  />
</Link>

        {/* Hamburger Button (for small screens) */}
        <button 
          className="text-white md:hidden text-2xl z-50" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul className={`md:flex md:space-x-6 fixed md:static ${isScrolled ? 'bg-gray-800/70 backdrop-blur-sm md:bg-transparent' : 'bg-gray-800 md:bg-transparent'} w-full md:w-auto h-screen md:h-auto left-0 top-0 md:top-0 pt-20 md:pt-0 px-4 md:px-0 transition-all duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <li className="border-b md:border-none p-3 md:p-0">
            <Link to="/" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className="border-b md:border-none p-3 md:p-0">
            <Link to="/players" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>Players</Link>
          </li>
          <li className="border-b md:border-none p-3 md:p-0">
            <Link to="/members" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>Members</Link>
          </li>
          <li className="border-b md:border-none p-3 md:p-0">
            <Link to="/news" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>News</Link>
          </li>
          <li className="border-b md:border-none p-3 md:p-0">
            <Link to="/about" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>About</Link>
          </li>
          <li className="border-b md:border-none p-3 md:p-0">
            <Link to="/contact" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
          <li className="p-3 md:p-0">
            <Link to="/gallery" className="hover:text-blue-400 block" onClick={() => setIsOpen(false)}>Gallery</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;