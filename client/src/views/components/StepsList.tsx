// views/components/StepsList.tsx
import React from 'react';

interface Step {
  number: number;
  title: string;
  color: string;
}

const StepsList: React.FC = () => {
  const steps: Step[] = [
    { number: 1, title: 'Upload your screens for evaluation', color: 'bg-blue-600' },
    { number: 2, title: 'Select a persona', color: 'bg-orange-500' },
    { number: 3, title: 'Hit "Start Analysis" to begin', color: 'bg-blue-400' },
    { number: 4, title: 'Sit back while we analyse your screens', color: 'bg-yellow-400' },
    { number: 5, title: 'View your evaluation results!', color: 'bg-blue-600' }
  ];

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Ready to Begin? Follow These Easy Steps</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div 
            key={step.number}
            className="flex items-start p-4 border border-gray-200 rounded-lg"
          >
            <div className={`${step.color} text-white font-bold w-10 h-10 flex items-center justify-center rounded-lg mr-4`}>
              {step.number}
            </div>
            <div className="flex-1">
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsList;
