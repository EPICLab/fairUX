// views/components/PersonaDescription.tsx
import React from 'react';
import { Persona } from '../../models/types';

interface PersonaDescriptionProps {
  persona: Persona;
}

const PersonaDescription: React.FC<PersonaDescriptionProps> = ({ persona }) => {
  
  // Function to highlight specific text in red
  const renderHighlightedText = (text: string, highlights: string[] = []) => {
    if (!highlights || highlights.length === 0) {
      return text;
    }
    
    let result = text;
    
    // Sort highlights by length (longest first) to avoid partial replacements
    const sortedHighlights = [...highlights].sort((a, b) => b.length - a.length);
    
    sortedHighlights.forEach(highlightText => {
      // Escape special regex characters
      const escapedText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedText})`, 'gi');
      
      result = result.replace(regex, '<span style="color: red; font-weight: bold;">$1</span>');
    });
    
    return result;
  };
  
  // Calculate optimal layout based on number of items
  const getGridLayout = (items: any[]) => {
    const count = items.length;
    
    if (count <= 3) return 'grid-cols-1 md:grid-cols-' + count;
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-3'; // Default for 5+ items
  };
  
  // Group description items into rows for optimal display
  const groupItemsIntoRows = (items: any[]) => {
    const result = [];
    
    // First row: up to 3 items
    result.push(items.slice(0, Math.min(3, items.length)));
    
    // Second row: remaining items
    if (items.length > 3) {
      result.push(items.slice(3));
    }
    
    return result;
  };
  const rows = groupItemsIntoRows(persona.descriptionItems);
  
  return (
    <div className="rounded-lg border border-red-200 p-4 bg-white">
      <h3 className="text-xl font-bold mb-4">Description</h3>
      
      <div className="space-y-6">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`grid ${getGridLayout(row)} gap-4`}>
            {row.map((item, index) => {
              return (
                <div key={index} className="space-y-1">
                  <h4 className="font-bold">{item.title}:</h4>
                  
                  <p 
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: renderHighlightedText(
                        item.details,
                        item.highlight
                      )
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaDescription;