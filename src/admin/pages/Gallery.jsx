import React, { useState, useEffect } from 'react';
import { FiUpload, FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch all gallery images
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}gallery/getAll`);
      setImages(response.data.images);
    } catch (error) {
      toast.error('Failed to fetch images');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Upload new image
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('Please select an image first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}gallery/post`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Image uploaded successfully');
      setSelectedFile(null);
      setPreviewImage(null);
      fetchImages();
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Update existing image
  const handleUpdate = async (id) => {
    if (!selectedFile) {
      toast.warning('Please select a new image first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}gallery/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Image updated successfully');
      setEditingId(null);
      setSelectedFile(null);
      setPreviewImage(null);
      fetchImages();
    } catch (error) {
      toast.error('Failed to update image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}gallery/delete/${id}`);
        toast.success('Image deleted successfully');
        fetchImages();
      } catch (error) {
        toast.error('Failed to delete image');
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Gallery Management</h1>
      
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? 'Update Image' : 'Upload New Image'}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Image Preview */}
          <div className="w-full md:w-1/3">
            {previewImage ? (
              <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                    if (editingId) setEditingId(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <FiX className="text-red-500" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          
          {/* Upload/Update Controls */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="text-sm text-gray-500">
              {selectedFile && (
                <p>Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
              )}
            </div>
            
            <div className="flex gap-3">
              {editingId ? (
                <>
                  <button
                    onClick={() => handleUpdate(editingId)}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isUploading ? 'Updating...' : (
                      <>
                        <FiCheck /> Confirm Update
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setSelectedFile(null);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                >
                  {isUploading ? 'Uploading...' : (
                    <>
                      <FiUpload /> Upload Image
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Gallery Images</h2>
        
        {images?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No images in gallery yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.map((image) => (
              <div key={image._id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={`${import.meta.env.VITE_SERVER_URL.replace("/api","")}uploads/${image.image}`}
                  alt="Gallery"
                  className="w-full h-48 object-cover"
                />
                
                {/* Image Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditingId(image._id);
                      setPreviewImage(`${import.meta.env.VITE_SERVER_URL.replace("/api","")}uploads/${image.image}`);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Delete"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
                
                {/* Image Info */}
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-500 truncate">
                    {image.image}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;