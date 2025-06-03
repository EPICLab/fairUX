// views/screens/PersonaDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import PersonaDescription from '../components/PersonaDescription';
import navigationController from '../../controllers/navigationController';
import personaController from '../../controllers/personaController';
import imageController from '../../controllers/imageController';
import reportController from '../../controllers/reportController';

const PersonaDetailsScreen: React.FC = () => {
  const [backgroundText, setBackgroundText] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('Analyzing');
  
  const selectedPersona = personaController.getSelectedPersona();
  const images = imageController.getImages();

  useEffect(() => {
    if (!selectedPersona) {
      navigationController.goToSelectPersona();
      return;
    }

    // Check if we have images
    if (images.length === 0) {
      navigationController.goToUpload();
      return;
    }

    setBackgroundText(selectedPersona.background);
  }, [selectedPersona, images]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBackgroundText(e.target.value);
  };

  const handleStartAnalysis = async () => {
    setIsSaving(true);
    setIsAnalyzing(true);
    setError(null);
    setLoadingStage('Analyzing');
    
    try {
      if (selectedPersona) {
        // First save the updated background
        personaController.updatePersonaBackground(selectedPersona.id, backgroundText);
        
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
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    navigationController.goToSelectPersona();
  };

  if (!selectedPersona) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 relative">
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
        <h1 className="text-4xl font-bold text-center flex-1">
          Selected Persona Preview
        </h1>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-8">
        {/* Changed from md:grid-cols-5 to md:grid-cols-6 for better proportions */}
        <div className="grid md:grid-cols-6 gap-8">
          {/* Persona image section - smaller column span */}
          <div className="flex flex-col items-center md:col-span-1">
            <img
              src={selectedPersona.avatar}
              alt={`${selectedPersona.name} avatar`}
              className="w-40 h-40 rounded-full mb-4 object-cover border-4 border-white shadow-lg"
            />
            <h3 className="text-xl font-medium text-center">{selectedPersona.name}</h3>
          </div>
          
          {/* Description section - larger column span */}
          <div className="md:col-span-5 space-y-6">
            <PersonaDescription persona={selectedPersona} />

            <div>
              <h4 className="font-medium mb-2 text-lg">Background</h4>
              <textarea
                value={backgroundText}
                onChange={handleBackgroundChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm leading-relaxed"
                rows={6}
                disabled={isAnalyzing}
                placeholder="Add or modify the persona's background information..."
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleStartAnalysis}
            disabled={isSaving || isAnalyzing}
            className="px-8 py-3"
          >
            {isAnalyzing ? 'Processing...' : 'Start Analysis'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetailsScreen;