import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './views/components/Header';
import Footer from './views/components/Footer';
import AppRouter from './AppRouter';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;