// views/screens/HomeScreen.tsx
import React from 'react';
import Button from '../components/Button';
import StepsList from '../components/StepsList';
import navigationController from '../../controllers/navigationController';

const HomeScreen: React.FC = () => {
  return (
  
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-5xl font-bold mb-6">Inclusive Design AI Tool</h1>
        <h2 className="text-3xl text-gray-600 mb-8">
          Enhancing UI/UX for Accessibility and User Diversity
        </h2>
        
        <div className="mb-8">
          <img 
            src="/assets/home_page.png" 
            alt="Diverse group of users" 
            className="w-full"
          />
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            <span className="font-medium">An AI-powered tool</span> that evaluates UI/UX from the end-user's 
            perspective, ensuring an inclusive digital experience. Using the 
            GenderMag Method, identify gender-inclusivity issues for a more 
            accessible and user-friendly design for diverse users.
          </p>
        </div>
        
        <Button onClick={() => navigationController.goToUpload()}>
          Get started
        </Button>
      </div>
      
      <div className="flex items-start justify-center">
        <StepsList />
      </div>
    </div>
  );
};

export default HomeScreen;