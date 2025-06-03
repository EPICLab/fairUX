// views/components/PersonaCard.tsx
import React from 'react';
import { Persona } from '../../models/types';

interface PersonaCardProps {
  persona: Persona;
  onClick: (id: string) => void;
  isSelected?: boolean;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ 
  persona, 
  onClick, 
  isSelected = false 
}) => {
  return (
    <div 
      className={`bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? 'ring-4 ring-blue-500 border-blue-500 shadow-xl transform scale-105' 
          : 'border-gray-200 hover:shadow-xl hover:border-gray-300 hover:transform hover:scale-102'
      }`}
      onClick={() => onClick(persona.id)}
    >
      <div className="flex flex-col items-center text-center">
        {/* Large avatar */}
        <div className="relative mb-6">
          <img
            src={persona.avatar}
            alt={`${persona.name} avatar`}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-lg"
          />
          {isSelected && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-3xl font-bold text-gray-800 mb-3">{persona.name}</h3>
        
        {/* Disability indicator */}
        {persona.hasDisability && (
          <div className="flex items-center text-blue-600 mb-4">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-lg font-medium">Accessibility Focus</span>
          </div>
        )}
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="mt-4 w-full">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl text-center text-lg font-semibold shadow-md">
              ✓ Selected
            </div>
          </div>
        )}

        {/* Hover instruction */}
        {!isSelected && (
          <div className="mt-4 w-full">
            <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl text-center text-lg font-medium transition-colors">
              Click to Select
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaCard;