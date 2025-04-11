import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSave, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactAdmin = () => {
  const [formData, setFormData] = useState({
    phoneOne: '',
    phoneTwo: '',
    email: '',
    location: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [existingContact, setExistingContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}contact/getAll`);
        if (response.data.data && response.data.data.length > 0) {
          const contactData = response.data.data[0]; 
          setExistingContact(contactData);
          setFormData({
            phoneOne: contactData.phoneOne || '',
            phoneTwo: contactData.phoneTwo || '',
            email: contactData.email || '',
            location: contactData.location || '',
            image: null
          });
          setPreviewImage(contactData.image ? `/uploads${contactData.image}` : '');
        }
      } catch (error) {
        toast.error('Failed to fetch contact data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('phoneOne', formData.phoneOne);
      formDataToSend.append('phoneTwo', formData.phoneTwo);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('location', formData.location);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (existingContact) {
        response = await axios.put(`${import.meta.env.VITE_SERVER_URL}contact/update/${existingContact._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Contact updated successfully');
      } else {
        response = await axios.post(`${import.meta.env.VITE_SERVER_URL}contact/post`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Contact created successfully');
      }
      {
        console.log("imagepath--",response.data.data.image ? `/uploads${response.data.data.image}` : '')
      }
      setExistingContact(response.data.data);
      setPreviewImage(response.data.data.image ? `/uploads${response.data.data.image}` : '');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingContact) return;
    
    if (window.confirm('Are you sure you want to delete this contact information?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}contact/delete${existingContact._id}`);
        toast.success('Contact deleted successfully');
        setExistingContact(null);
        setFormData({
          phoneOne: '',
          phoneTwo: '',
          email: '',
          location: '',
          image: null
        });
        setPreviewImage('');
      } catch (error) {
        toast.error('Failed to delete contact');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Contact Information</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contact Image</label>
          <div className="flex items-center space-x-4">
            {previewImage && (
              <div className="w-32 h-32 border rounded-md overflow-hidden">
                <img 
                  src={`${import.meta.env.VITE_SERVER_URL.replace( '/api/', '')}${previewImage.replace(/\\/g, '/')}`}
                  alt="Contact Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                
                />
               
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone*</label>
            <input
              type="tel"
              name="phoneOne"
              value={formData.phoneOne}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
            <input
              type="tel"
              name="phoneTwo"
              value={formData.phoneTwo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1987654321"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="contact@example.com"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="123 Main St, New York, NY"
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          {existingContact && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSave className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactAdmin;