import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

interface UserProfileCardProps {
  variant: 'sidebar' | 'dropdown';
  onClose?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ variant, onClose }) => {
  const { theme } = useTheme();
  
  // This can be replaced with actual user data from context/props
  const user = {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'A'
  };

  if (variant === 'sidebar') {
    return (
      <Link
        to="/profile"
        className={`
          relative group w-full flex items-center rounded-lg px-4 py-3 cursor-pointer transition-colors
          ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
        `}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {user.avatar}
        </div>
        
        <div className="ml-3">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {user.name}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        
        <Link
          to="/settings"
          className={`
            ml-auto p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-200 text-gray-500'}
          `}
          title="Settings"
        >
          <Settings size={16} />
        </Link>
      </Link>
    );
  }

  return (
    <div className={`
      w-64 p-3 rounded-lg shadow-lg
      ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
    `}>
      <div className="flex items-center gap-3 p-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
          {user.avatar}
        </div>
        <div>
          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {user.name}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {user.email}
          </p>
        </div>
      </div>

      <div className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <Link
          to="/profile"
          onClick={onClose}
          className={`
            w-full px-2 py-1.5 rounded-md text-sm transition-colors flex items-center
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          View Profile
        </Link>
        
        <Link
          to="/settings"
          onClick={onClose}
          className={`
            w-full px-2 py-1.5 rounded-md text-sm transition-colors flex items-center
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          Settings
        </Link>
        
        <button
          onClick={() => {
            // Handle logout logic here
            if (onClose) onClose();
          }}
          className={`
            w-full px-2 py-1.5 rounded-md text-sm transition-colors flex items-center
            ${theme === 'dark' 
              ? 'text-red-400 hover:bg-gray-700' 
              : 'text-red-600 hover:bg-gray-100'}
          `}
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;