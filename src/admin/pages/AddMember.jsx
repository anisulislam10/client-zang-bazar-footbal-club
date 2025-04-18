import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck, FiMail, FiPhone, FiFileText } from "react-icons/fi";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    memberName: "",
    email: "",
    phone: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editingSlug, setEditingSlug] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [expandedMember, setExpandedMember] = useState(null);
  
  const formRef = useRef(null);

  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}members/get`);
        setMembers(response.data.members || []);
      } catch (err) {
        setError("Failed to fetch members. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // Handle image upload with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit form (add or update) - FIXED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.memberName.trim() || !formData.email.trim()) {
      setError("Member name and email are required");
      return;
    }

    // Prepare FormData
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    if (image) {
      data.append("memberImage", image);
    }

    try {
      setIsLoading(true);
      let response;
      
      if (editingSlug) {
        // Update existing member
        response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}members/update/${editingSlug}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        // Validate response before updating state
        if (!response.data?.data) {
          console.log("Response---",response.data?.data)
          throw new Error("Server returned invalid member data");
        }
        
        setMembers(prevMembers => 
          prevMembers.map(m => m.slug === editingSlug ? response.data.member : m)
        );
      } else {
        // Add new member
        response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}members/post`, 
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        // Validate response before updating state
        if (!response.data?.member) {
          throw new Error("Server returned invalid member data");
        }
        
        setMembers(prevMembers => [response.data.member, ...prevMembers]);
      }
      
      // Reset form after successful submission
      resetForm();
      setEditingSlug(null);
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        (editingSlug ? "Failed to update member" : "Failed to add member")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a member
  const startEditing = (member) => {
    setEditingSlug(member.slug);
    setFormData({
      memberName: member.memberName,
      email: member.email || "",
      phone: member.phone || "",
      description: member.description || ""
    });
    setPreviewImage(member.memberImage ? 
      `${import.meta.env.VITE_SERVER_URL.replace("api/","")}uploads/${member.memberImage}` : "");
    setImage(null);
    
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSlug(null);
    resetForm();
  };

  // Confirm delete action
  const confirmDelete = (slug) => {
    setMemberToDelete(slug);
    setShowDeleteModal(true);
  };

  // Delete member
  const deleteMember = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}members/delete/${memberToDelete}`
      );
      setMembers(prevMembers => 
        prevMembers.filter(member => member.slug !== memberToDelete)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to delete member. Please try again."
      );
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      memberName: "",
      email: "",
      phone: "",
      description: ""
    });
    setImage(null);
    setPreviewImage("");
    setError("");
  };

  // Toggle member details expansion
  const toggleExpandMember = (slug) => {
    setExpandedMember(expandedMember === slug ? null : slug);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Member Management</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <div ref={formRef} className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingSlug ? "Edit Member" : "Add New Member"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Name *
                </label>
                <input
                  type="text"
                  name="memberName"
                  placeholder="Enter member name"
                  value={formData.memberName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter member description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {previewImage && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Preview
                </label>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              {editingSlug ? (
                <>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <FiCheck className="mr-2" /> {isLoading ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiPlus className="mr-2" /> {isLoading ? "Adding..." : "Add Member"}
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Members List</h2>
          {isLoading && !members.length ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : members.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No members found. Add one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <React.Fragment key={member?.slug}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => toggleExpandMember(member.slug)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member?.memberImage ? (
                            <img
                              src={`${import.meta.env.VITE_SERVER_URL.replace("api/","")}uploads/${member.memberImage}`}
                              alt={member.memberName}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='12' fill='%236b7280' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{member?.memberName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{member?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => { e.stopPropagation(); startEditing(member); }}
                            className="text-blue-600 hover:text-blue-900 mr-4 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); confirmDelete(member?.slug); }}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                      {expandedMember === member?.slug && (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-start">
                                <FiMail className="mt-1 mr-2 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Email</p>
                                  <p className="text-sm">{member?.email || "Not provided"}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <FiPhone className="mt-1 mr-2 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Phone</p>
                                  <p className="text-sm">{member?.phone || "Not provided"}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <FiFileText className="mt-1 mr-2 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Description</p>
                                  <p className="text-sm">{member?.description || "Not provided"}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this member? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={deleteMember}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;