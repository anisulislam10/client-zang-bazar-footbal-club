import { useState, useEffect } from 'react';
import axios from 'axios';

const Slider = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Fetch all slider images
  const fetchSliderImages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}slider/get`);
      setImages(response.data.images);
    } catch (err) {
      setError('Failed to fetch slider images');
    }
  };

  useEffect(() => {
    fetchSliderImages();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('imageUrl', selectedImage);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}slider/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setSuccess('Image uploaded successfully!');
      setSelectedImage(null);
      fetchSliderImages();
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setImageToDelete(id);
    setShowConfirm(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}slider/delete/${imageToDelete}`);
      setSuccess('Image deleted successfully!');
      fetchSliderImages();
    } catch (err) {
      setError('Failed to delete image');
    } finally {
      setShowConfirm(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Slider Management</h1>
      
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Image (Recommended: 1920x1080)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>
          
          {selectedImage && (
            <div className="mt-2">
              <p className="text-sm">Selected: {selectedImage.name}</p>
              <img 
                src={URL.createObjectURL(selectedImage)} 
                alt="Preview" 
                className="mt-2 max-h-40 rounded object-contain"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Display Messages */}
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p>{error}</p>
      </div>}
      
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
        <p>{success}</p>
      </div>}

      {/* Images List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Slider Images</h2>
        {images.length === 0 ? (
          <p className="text-gray-500">No slider images found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image._id} className="border rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.VITE_SERVER_URL.replace("/api/", "")}${image.imageUrl}`} 
                  alt={image.originalName} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate">{image.originalName}</span>
                  <button
                    onClick={() => handleDeleteClick(image._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this image?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;