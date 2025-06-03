// views/components/UploadArea.tsx
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import imageController from '../../controllers/imageController';
import { Image } from '../../models/types';

interface UploadAreaProps {
  onUploadComplete?: (images: Image[]) => void;
  mode?: 'initial' | 'add-more'; // Add mode prop to control behavior
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUploadComplete, mode = 'initial' }) => {
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // Initialize with existing images only in 'initial' mode
  useEffect(() => {
    if (mode === 'initial') {
      const existingImages = imageController.getImages();
      setUploadedImages(existingImages);
      
      // Notify parent component about existing images
      if (onUploadComplete && existingImages.length > 0) {
        onUploadComplete(existingImages);
      }
    }
    // In 'add-more' mode, start with empty array to only show new uploads
  }, [onUploadComplete, mode]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setError(null);
    setUploading(true);
    
    try {
      const newImages: Image[] = [];
      
      for (const file of acceptedFiles) {
        const image = await imageController.uploadImage(file);
        newImages.push(image);
      }
      
      if (mode === 'add-more') {
        // In add-more mode, only show the newly uploaded images in this component
        setUploadedImages(prev => [...prev, ...newImages]);
        // But return all images (existing + new) to parent
        const allImages = imageController.getImages();
        if (onUploadComplete) {
          onUploadComplete(allImages);
        }
      } else {
        // In initial mode, get all images from controller
        const currentImages = imageController.getImages();
        setUploadedImages(currentImages);
        if (onUploadComplete) {
          onUploadComplete(currentImages);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, mode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/svg+xml': [],
      'image/gif': []
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleRemoveImage = (id: string) => {
    if (mode === 'add-more') {
      // In add-more mode, only remove from local state (newly uploaded images)
      setUploadedImages(prev => prev.filter(img => img.id !== id));
      // Also remove from controller
      imageController.removeImage(id);
      // Notify parent with updated full list
      const updatedImages = imageController.getImages();
      if (onUploadComplete) {
        onUploadComplete(updatedImages);
      }
    } else {
      // In initial mode, remove from controller and update local state
      imageController.removeImage(id);
      const updatedImages = imageController.getImages();
      setUploadedImages(updatedImages);
      if (onUploadComplete) {
        onUploadComplete(updatedImages);
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">
        {mode === 'add-more' ? 'Upload Additional Screenshots' : 'Upload Screenshots'}
      </h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
      >
        <input {...getInputProps()} multiple />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          
          <div>
            <p className="text-blue-600 font-medium">
              {mode === 'add-more' 
                ? 'Click to upload additional images or drag and drop'
                : uploadedImages.length > 0 
                  ? 'Click to upload more or drag and drop' 
                  : 'Click to upload or drag and drop'
              }
            </p>
            <p className="text-gray-500 mt-1">
              {mode === 'add-more' 
                ? 'Add more screenshots to your analysis'
                : 'Upload multiple screenshots for evaluation'
              }
            </p>
            <p className="text-gray-400 text-sm mt-1">
              SVG, PNG, JPG or GIF (max. 5MB each)
            </p>
          </div>
        </div>
      </div>
      
      {uploading && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
          Uploading images...
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            {mode === 'add-more' 
              ? `New images (${uploadedImages.length})`
              : `Uploaded images (${uploadedImages.length})`
            }
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    className="object-cover h-full w-full group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(image.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-sm truncate mt-1 text-gray-600">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;