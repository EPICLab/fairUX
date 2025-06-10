// views/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-4 px-8 border-b border-gray-100">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center" onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}>
          <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="ml-2 text-xl font-bold">MOSIP</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}>Home</Link>
          <div className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
            <Link to="/persona-info" className="text-gray-700 hover:text-blue-600">Personas</Link>
          </div>
        </nav>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
          <Globe className="mr-1 h-5 w-5" />
          <span>English</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;