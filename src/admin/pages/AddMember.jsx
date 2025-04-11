import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  
  const formRef = useRef(null);

  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}members/get`);
        setMembers(response.data.members || []);
      } catch (err) {
        setError("Failed to fetch members");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Handle image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new member
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) {
      setError("Member name is required");
      return;
    }

    const formData = new FormData();
    formData.append("memberName", memberName);
    if (image) {
      formData.append("memberImage", image);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}members/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMembers([...members, response.data.member]);
      resetForm();
    } catch (err) {
      setError("Failed to add member");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a member
  const startEditing = (member) => {
    setEditingId(member._id);
    setMemberName(member.memberName);
    setPreviewImage(member.memberImage ? 
      `${import.meta.env.VITE_SERVER_URL.replace("api/","")}uploads/${member.memberImage}` : "");
    setImage(null);
    
    // Scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
  };

  // Update member
  const updateMember = async () => {
    if (!memberName.trim()) {
      setError("Member name is required");
      return;
    }

    const formData = new FormData();
    formData.append("memberName", memberName);
    if (image) {
      formData.append("memberImage", image);
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}members/update/${editingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMembers(
        members.map((member) =>
          member._id === editingId ? response.data.member : member
        )
      );
      cancelEditing();
    } catch (err) {
      setError("Failed to update member");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (id) => {
    setMemberToDelete(id);
    setShowDeleteModal(true);
  };

  // Delete member
  const deleteMember = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}members/delete/${memberToDelete}`);
      setMembers(members.filter((member) => member._id !== memberToDelete));
    } catch (err) {
      setError("Failed to delete member");
      console.error(err);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Reset form fields
  const resetForm = () => {
    setMemberName("");
    setImage(null);
    setPreviewImage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Member Management</h1>
        
        {/* Add/Edit Member Form */}
        <div ref={formRef} className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Member" : "Add New Member"}
          </h2>
          <form onSubmit={editingId ? (e) => { e.preventDefault(); updateMember(); } : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Name
                </label>
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
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
            
            {previewImage && (
              <div className="mt-4">
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
            
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            
            <div className="mt-4 flex space-x-2">
              {editingId ? (
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
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiCheck className="mr-2" /> {isLoading ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" /> {isLoading ? "Adding..." : "Add Member"}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Members List */}
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.memberImage ? (
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
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              className="text-gray-500"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.memberName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEditing(member)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(member._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
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
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={deleteMember}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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