// views/screens/UploadScreen.tsx
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import UploadArea from '../components/UploadArea';
import navigationController from '../../controllers/navigationController';
import imageController from '../../controllers/imageController';
import { Image } from '../../models/types';

const UploadScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    // Initialize with any existing images from the controller
    const existingImages = imageController.getImages();
    setImages(existingImages);
  }, []);

  const handleUploadComplete = (uploadedImages: Image[]) => {
    setImages(uploadedImages);
  };

  const handleNext = () => {
    navigationController.goToPreview();
  };

  const handleClearAll = () => {
    // Clear all images
    imageController.clearImages();
    setImages([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-center mb-12">
        Welcome to Inclusive Design AI Tool
      </h1>
      
      <UploadArea onUploadComplete={handleUploadComplete} />
      
      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {images.length > 0 ? (
              <p className="font-medium text-green-600">
                ✓ {images.length} image{images.length > 1 ? 's' : ''} uploaded
              </p>
            ) : (
              <p>No images uploaded yet</p>
            )}
          </div>
          
          {images.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={images.length === 0}
          className={images.length > 0 ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {images.length > 0 ? `Continue with ${images.length} image${images.length > 1 ? 's' : ''}` : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default UploadScreen;