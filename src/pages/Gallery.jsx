import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}gallery/getAll`);
        setImages(res.data?.images || []);
      } catch (err) {
        setError('Failed to load images. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const openImage = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'Escape') closeImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Reload Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 py-24 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 mt-10">Our Visual Collection</h1>
        <p className="text-blue-100 text-lg sm:text-xl max-w-xl mx-auto">
          Explore stunning moments captured in our gallery. Each image tells a unique story.
        </p>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-12">
        {images.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No images available.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={`${import.meta.env.VITE_SERVER_URL.replace('api/', '')}uploads/${img.image}`}
                  alt={`Gallery ${index + 1}`}
                  onClick={() => openImage(index)}
                  className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <span className="text-white font-medium text-sm">Image {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isOpen && selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeImage}
        >
          <button
            onClick={closeImage}
            className="absolute top-6 right-6 text-white hover:text-gray-400 z-50"
          >
            <FiX size={30} />
          </button>

          <div className="relative max-w-6xl w-full flex justify-center items-center">
            {/* Prev */}
            <button
              onClick={prevImage}
              className="absolute left-4 sm:left-6 text-white z-40 hover:text-blue-400"
            >
              <FiChevronLeft size={40} />
            </button>

            {/* Image */}
            <img
              src={`${import.meta.env.VITE_SERVER_URL.replace('api/', '')}uploads/${images[selectedIndex]?.image}`}
              alt="Lightbox"
              className="max-h-[80vh] max-w-full rounded-lg object-contain z-30"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-6 text-white z-40 hover:text-blue-400"
            >
              <FiChevronRight size={40} />
            </button>
          </div>

          {/* Mobile counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-1 rounded-full text-sm z-50">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
