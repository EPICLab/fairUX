// AppRouter.tsx
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Import screens
import HomeScreen from './views/screens/HomeScreen';
import UploadScreen from './views/screens/UploadScreen';
import PreviewScreen from './views/screens/PreviewScreen';
import SelectPersonaScreen from './views/screens/SelectPersonaScreen';
import PersonaDetailsScreen from './views/screens/PersonaDetailsScreen';
import ReviewScreen from './views/screens/ReviewScreen';  // New import
import ResultsScreen from './views/screens/ResultsScreen';

// Import controllers
import navigationController from './controllers/navigationController';
import PersonaInfoScreen from './views/screens/PersonaInfoScreen';

const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  
  // Set up navigation controller
  useEffect(() => {
    navigationController.setNavigate(navigate);
  }, [navigate]);
  
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/persona-info" element={<PersonaInfoScreen />} />
      <Route path="/upload" element={<UploadScreen />} />
      <Route path="/preview" element={<PreviewScreen />} />
      <Route path="/select-persona" element={<SelectPersonaScreen />} />
      <Route path="/persona-details" element={<PersonaDetailsScreen />} />
      <Route path="/review" element={<ReviewScreen />} />  {/* New route */}
      <Route path="/results" element={<ResultsScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;