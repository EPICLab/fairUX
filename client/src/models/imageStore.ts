// models/imageStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Image } from './types';

interface ImageState {
  images: Image[];
  currentImage: Image | null;
  addImage: (file: File) => Promise<Image>;
  removeImage: (id: string) => void;
  setCurrentImage: (image: Image | null) => void;
  updateImagePath: (id: string, path: string) => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  currentImage: null,
  
  addImage: async (file: File) => {
    return new Promise((resolve, reject) => {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('File type not supported. Please upload SVG, PNG, JPG or GIF.'));
        return;
      }
      
      // Create URL for preview
      const url = URL.createObjectURL(file);
      
      let fileName = file.name;
      const currentImages = get().images;
      
      // Check for duplicate names
      if (currentImages.some(img => img.name === fileName)) {
        const nameParts = fileName.split('.');
        const extension = nameParts.pop() || '';
        const baseName = nameParts.join('.');
        const timestamp = new Date().getTime();
        fileName = `${baseName}_${timestamp}.${extension}`;
      }
      
      const newImage: Image = {
        id: uuidv4(),
        name: fileName,
        url,
        file,
        path: null // Will be updated after saving
      };
      
      set(state => ({
        images: [...state.images, newImage]
      }));
      
      resolve(newImage);
    });
  },
  
  updateImagePath: (id: string, path: string) => {
    set(state => ({
      images: state.images.map(image => 
        image.id === id ? { ...image, path } : image
      )
    }));
  },
  
  removeImage: (id: string) => {
    set(state => {
      const imageToRemove = state.images.find(img => img.id === id);
      if (imageToRemove?.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return {
        images: state.images.filter(image => image.id !== id),
        currentImage: state.currentImage?.id === id ? null : state.currentImage
      };
    });
  },
  
  setCurrentImage: (image) => set({ currentImage: image }),
  
  clearImages: () => {
    set(state => {
      // Revoke all object URLs to prevent memory leaks
      state.images.forEach(img => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
      
      return { images: [], currentImage: null };
    });
  }
}));