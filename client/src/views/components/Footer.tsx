// views/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-2 px-8 mt-auto border-t border-gray-100">
      <div className="flex items-center justify-center space-x-2">
        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">M</div>
        <span className="font-medium">MOSIP</span>
        <span className="text-gray-500">In collaboration with</span>
        <div className="h-8 bg-gray-200 rounded px-2 flex items-center">
          <span className="text-xs font-bold">Oregon State University</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;