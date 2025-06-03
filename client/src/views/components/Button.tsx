
// views/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button'
}) => {
  const baseClasses = "font-medium px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;