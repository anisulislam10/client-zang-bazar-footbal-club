import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch slider images from API
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}slider/get`);
        setImages(response.data.images || []);
      } catch (err) {
        setError('Failed to load slider images');
        console.error('Error fetching slider images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  // Auto slide every 3 seconds when images are loaded
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-64 sm:h-96 md:h-[30rem] lg:h-[40rem] flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading slider...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 sm:h-96 md:h-[30rem] lg:h-[40rem] flex items-center justify-center bg-gray-100">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 md:h-[30rem] lg:h-[40rem] flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">No slider images available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider container - full width */}
      <div className="relative w-full h-64 sm:h-96 md:h-[30rem] lg:h-[40rem]">
        {images.map((image, index) => (
          <div
            key={image._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={`${import.meta.env.VITE_SERVER_URL.replace("/api/", "")}${image.imageUrl}`}
              
              alt={image.originalName || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          
          </div>
        ))}
      </div>

      {/* Navigation arrows (only show if more than one image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition z-10"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition z-10"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators (only show if more than one image) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;