// controllers/imageController.ts
import { useImageStore } from '../models/imageStore';
import { Image } from '../models/types';

class ImageController {
  async uploadImage(file: File): Promise<Image> {
    try {
      return await useImageStore.getState().addImage(file);
    } catch (error) {
      throw error;
    }
  }

  async saveImageToPath(imageId: string): Promise<boolean> {
    try {
      const images = useImageStore.getState().images;
      const imageToSave = images.find(img => img.id === imageId);
      
      if (!imageToSave || !imageToSave.file) {
        throw new Error(`Image not found or invalid for ID: ${imageId}`);
      }
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', imageToSave.file);
      formData.append('fileName', imageToSave.name);
      
      // Send the file to the backend API
      const response = await fetch('http://localhost:5000/api/save-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save image: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Update the image path in the store if needed
      if (result.success && result.filePath) {
        useImageStore.getState().updateImagePath(imageId, result.filePath);
      }
      
      return result.success;
    } catch (error) {
      console.error(`Error saving image ${imageId}:`, error);
      throw error;
    }
  }

  async saveAllImages(): Promise<boolean[]> {
    try {
      const images = useImageStore.getState().images;
      const results = [];
      
      for (const image of images) {
        if (image.id) {
          const result = await this.saveImageToPath(image.id);
          results.push(result);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error saving all images:', error);
      throw error;
    }
  }

  removeImage(id: string): void {
    useImageStore.getState().removeImage(id);
  }

  clearImages(): void {
    useImageStore.getState().clearImages();
  }

  getImages(): Image[] {
    return useImageStore.getState().images;
  }

  getCurrentImage(): Image | null {
    return useImageStore.getState().currentImage;
  }

  setCurrentImage(image: Image | null): void {
    useImageStore.getState().setCurrentImage(image);
  }
}

export default new ImageController();