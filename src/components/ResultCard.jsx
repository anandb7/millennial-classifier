import React, { useState, useEffect } from 'react';

const ResultCard = ({ result }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carousel, setCarousel] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);

  const isMillennial = result?.label === 'Millennial';

  // Load images from public folders
  useEffect(() => {
    const folderPath = isMillennial ? '/millennial' : '/non-millennial';
    const potentialImages = [];
    
    // Check for numbered images 1-20 with both extensions
    for (let i = 1; i <= 20; i++) {
      potentialImages.push(`${folderPath}/${i}.png`);
      potentialImages.push(`${folderPath}/${i}.jpg`);
    }
    
    setCarousel(potentialImages);
    setLoadedImages([]);
  }, [isMillennial]);

  // Track which images successfully load
  const handleImageLoad = (imagePath) => {
    setLoadedImages(prev => {
      if (!prev.includes(imagePath)) {
        return [...prev, imagePath];
      }
      return prev;
    });
  };

  const caption = isMillennial 
    ? 'Millennial detected: Young professional, startup culture, remote work enthusiast'
    : 'Not-Millennial detected: Traditional values, established career, or Gen-Z digital native';

  // Auto-advance carousel infinitely - only through loaded images
  useEffect(() => {
    if (loadedImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % loadedImages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [loadedImages.length]);

  const nextImage = () => {
    if (loadedImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % loadedImages.length);
  };

  const prevImage = () => {
    if (loadedImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + loadedImages.length) % loadedImages.length);
  };

  if (!result) return null;

  return (
    <div className={`animate-fade-in max-w-sm mx-auto`}>
      <div className="fb-card p-4 text-center" style={{backgroundColor: isMillennial ? '#e7f3ff' : '#fff3e0'}}>
        
        {/* Image Carousel */}
        <div className="relative mb-3">
          {/* Hidden images to preload and detect which ones exist */}
          <div style={{ display: 'none' }}>
            {carousel.map((imgPath, idx) => (
              <img 
                key={idx}
                src={imgPath}
                onLoad={() => handleImageLoad(imgPath)}
                onError={() => {}}
                alt=""
              />
            ))}
          </div>
          
          {/* Display current image */}
          {loadedImages.length > 0 && (
            <>
              <img 
                src={loadedImages[currentImageIndex]} 
                alt={`${result.label} ${currentImageIndex + 1}`}
                className="w-full h-40 object-cover rounded-lg transition-opacity duration-500"
              />
              
              {/* Carousel Controls - only show if more than 1 image */}
              {loadedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-10"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-10"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Carousel Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {loadedImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          {result.label}
        </h3>
        
        <p className="text-gray-700 mb-3 text-sm">
          {caption}
        </p>
        
        {result.confidence && (
          <div className="text-xs text-gray-600 font-semibold">
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
