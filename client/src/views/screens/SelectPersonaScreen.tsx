// views/screens/SelectPersonaScreen.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PersonaCard from '../components/PersonaCard';
import navigationController from '../../controllers/navigationController';
import personaController from '../../controllers/personaController';

const SelectPersonaScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPersonas = async () => {
      try {
        await personaController.initializePersonas();
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load personas');
        setIsLoading(false);
      }
    };
    loadPersonas();
  }, []);
  
  const personas = personaController.getPersonas();
  const selectedPersona = personaController.getSelectedPersona();
  
  const handlePersonaSelect = (id: string) => {
    personaController.selectPersona(id);
    navigationController.goToPersonaDetails();
  };

  const handleBack = () => {
    navigationController.goToPreview();
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-gray-600">Loading personas...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-600">Error: {error}</div>
    </div>
  );

  if (!personas.length) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-gray-600">No personas found</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-12">
        <button 
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-10 h-10" />
        </button>
        <h1 className="text-6xl font-bold text-center flex-1">
          Select a Persona
        </h1>
      </div>
      
      {/* Centered grid for better spacing with 2 personas */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
          {personas.map((persona) => (
            <PersonaCard 
              key={persona.id}
              persona={persona}
              onClick={handlePersonaSelect}
              isSelected={selectedPersona?.id === persona.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectPersonaScreen;