import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}contact/getAll`);
        if (response.data.data && response.data.data.length > 0) {
          setContactData(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}send/submit-form`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSubmitStatus({
        success: true,
        message: 'Message sent successfully!'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error sending message';
      
      setSubmitStatus({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone",
      details: contactData?.phoneOne ? [contactData.phoneOne, contactData.phoneTwo].filter(Boolean) : ['+1 (555) 123-4567'],
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
      details: contactData?.email ? [contactData.email] : ['info@example.com'],
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Location",
      details: contactData?.location ? [contactData.location] : ['123 Business Ave, New York, NY'],
      color: "bg-green-100 text-green-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Image Tag */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {contactData?.image ? (
          <img
            src={`${import.meta.env.VITE_SERVER_URL.replace("/api/", "")}${contactData.image.startsWith('/uploads') ? '' : '/uploads'}${contactData.image.replace(/\\/g, '/')}`}
            alt="Contact Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=900&h=500&s=1';
            }}
          />
        ) : (
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=900&h=500&s=1"
            alt="Default Background"
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white text-center px-4"
          >
            Let's Get In Touch
          </motion.h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20 z-10 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Side - Contact Form */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Send Us a Message
            </h2>
            
            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.success 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Right Side - Contact Information */}
          <div className="space-y-8">
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-start border border-gray-100`}
              >
                <div className={`p-3 rounded-full ${item.color} mr-4`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 mb-1 last:mb-0">
                      {detail}
                    </p>
                  ))}
                  {index === 2 && (
                    <div className="mt-4 h-48 rounded-xl overflow-hidden border border-gray-200">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3296.284831472789!2d71.7747223152226!3d35.85165808016728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDUxJzA2LjAiTiA3McKwNDYnMzMuMCJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                        title="Chitral Polo Ground Location"
                      ></iframe>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Contact Button (Mobile) */}
      {contactData?.phoneOne && (
        <div className="fixed bottom-6 right-6 lg:hidden">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={`tel:${contactData.phoneOne.replace(/\D/g, '')}`}
            className="bg-blue-600 text-white p-4 rounded-full shadow-xl"
          >
            <FaPhone className="text-xl" />
          </motion.a>
        </div>
      )}
    </div>
  );
};

export default Contact;