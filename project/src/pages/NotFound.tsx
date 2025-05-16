import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className={`text-9xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-200'}`}>
        404
      </h1>
      
      <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Page Not Found
      </h2>
      
      <p className={`max-w-md mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link
        to="/"
        className={`
          inline-flex items-center px-4 py-2 rounded-lg transition-colors
          ${theme === 'dark' 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}
        `}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;