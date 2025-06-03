// views/screens/PreviewScreen.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Button from '../components/Button';
import UploadArea from '../components/UploadArea';
import navigationController from '../../controllers/navigationController';
import imageController from '../../controllers/imageController';
import { Image } from '../../models/types';

const PreviewScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savingProgress, setSavingProgress] = useState<number>(0);
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);
  
  useEffect(() => {
    const currentImages = imageController.getImages();
    setImages(currentImages);
    
    // Redirect to upload if no images
    if (currentImages.length === 0) {
      navigationController.goToUpload();
    }
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const handleNext = async () => {
    if (images.length === 0) return;
    
    try {
      setSaving(true);
      setError(null);
      setSavingProgress(0);
      
      // Save all images to the specified path
      for (let i = 0; i < images.length; i++) {
        // console.log(`Saving image ${i + 1}/${images.length}:`, images[i]);
        await imageController.saveImageToPath(images[i].id);
        setSavingProgress(Math.round(((i + 1) / images.length) * 100));
      }
      
      // Navigate to the next screen
      navigationController.goToSelectPersona();
    } catch (err) {
      console.error("Full error object:", err);
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigationController.goToUpload();
  };

  const handleUploadMore = () => {
    setShowUploadPopup(true);
  };

  const handleCloseUploadPopup = () => {
    setShowUploadPopup(false);
  };

  const handleUploadComplete = (allImages: Image[]) => {
    // Update the images state with all images (existing + new)
    setImages(allImages);
    
    // Adjust current index if we were at the last image and new images were added
    if (currentImageIndex >= allImages.length) {
      setCurrentImageIndex(allImages.length - 1);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    imageController.removeImage(imageId);
    const updatedImages = imageController.getImages();
    setImages(updatedImages);
    
    // Adjust current index if necessary
    if (currentImageIndex >= updatedImages.length && updatedImages.length > 0) {
      setCurrentImageIndex(updatedImages.length - 1);
    } else if (updatedImages.length === 0) {
      navigationController.goToUpload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload More Images Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Upload More Images</h2>
              <button
                onClick={handleCloseUploadPopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Use add-more mode to prevent loading existing images */}
              <UploadArea 
                onUploadComplete={handleUploadComplete}
                mode="add-more"
              />
            </div>
            
            <div className="flex justify-end p-6 border-t">
              <Button
                onClick={handleCloseUploadPopup}
                variant="outline"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-5xl font-bold text-center flex-1">
          Image Preview
        </h1>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {images.length > 0 && (
          <>
            <div className="aspect-w-16 aspect-h-9 relative">
              <img 
                src={images[currentImageIndex].url} 
                alt={images[currentImageIndex].name} 
                className="object-contain w-full h-full"
              />
              
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button 
                    onClick={handlePrevImage} 
                    disabled={currentImageIndex === 0}
                    className={`p-2 bg-white rounded-full shadow pointer-events-auto ${
                      currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button 
                    onClick={handleNextImage} 
                    disabled={currentImageIndex === images.length - 1}
                    className={`p-2 bg-white rounded-full shadow pointer-events-auto ${
                      currentImageIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-700 rotate-180" />
                  </button>
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Image {currentImageIndex + 1} of {images.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className={`relative w-16 h-16 border rounded cursor-pointer overflow-hidden group ${
                        index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image.url} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image.id);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-2 text-sm text-gray-600">
              {images[currentImageIndex].name}
            </div>
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error saving images: {error}
        </div>
      )}
      
      {saving && (
        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${savingProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{savingProgress}%</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Saving images to specified path...
          </p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button 
          onClick={handleUploadMore}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload More Images
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={saving || images.length === 0}
        >
          {saving ? 'Saving...' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default PreviewScreen;