// views/screens/ReviewScreen.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import navigationController from '../../controllers/navigationController';
import imageController from '../../controllers/imageController';
import personaController from '../../controllers/personaController';
import reportController from '../../controllers/reportController';

const ReviewScreen: React.FC = () => {
  const images = imageController.getImages();
  const selectedPersona = personaController.getSelectedPersona();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('Analyzing');

  // Check if we have necessary data
  useEffect(() => {
    if (!selectedPersona) {
      navigationController.goToSelectPersona();
      return;
    }

    if (images.length === 0) {
      navigationController.goToUpload();
      return;
    }
  }, [selectedPersona, images]);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setLoadingStage('Analyzing');
    
    try {
      // Change the loading message after a few seconds
      const messageTimer = setTimeout(() => {
        setLoadingStage('Compiling Results');
      }, 3000);
      
      // Generate report using the report controller
      const report = await reportController.generateReport();
      
      clearTimeout(messageTimer);
      
      if (report) {
        // Navigate to results screen
        navigationController.goToResults();
      } else {
        const error = reportController.getError();
        setError(error || 'Failed to generate report');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    navigationController.goToPersonaDetails();
  };

  if (!selectedPersona || images.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Full-screen loading overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full flex flex-col items-center">
            <div className="relative mb-6">
              {/* Pulsing circle animation */}
              <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30"></div>
              <div className="relative">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{loadingStage}</h3>
            <p className="text-gray-600 text-center">
              Please do not close this window or navigate away from this page.
            </p>
            
            {/* Animated progress bar */}
            <div className="w-full mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
          disabled={isAnalyzing}
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-5xl font-bold text-center flex-1">
          Review and Analyze
        </h1>
      </div>
      
      {/* Persona Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Selected Persona</h2>
        <div className="flex items-center gap-4">
          <img
            src={selectedPersona.avatar}
            alt={`${selectedPersona.name} avatar`}
            className="w-20 h-20 rounded-full bg-blue-100"
          />
          <div>
            <h3 className="text-xl font-medium">{selectedPersona.name}</h3>
            <p className="text-gray-700 mt-2 text-sm line-clamp-2">{selectedPersona.background}</p>
          </div>
        </div>
      </div>
      
      {/* Uploaded Images */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Uploaded Images ({images.length})</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={image.url} 
                  alt={image.name} 
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-2">
                <p className="text-sm text-gray-600 truncate">{image.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Processing...' : 'Start Analysis'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewScreen;