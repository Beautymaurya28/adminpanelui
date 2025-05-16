import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Bell, Search, Sun, Moon, Command, Menu
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openQuickAction: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar, openQuickAction }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={`
      z-20 h-16 px-4 lg:px-6 flex items-center justify-between
      ${theme === 'dark' ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'}
      transition-colors duration-200
    `}>
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className={`
            p-1.5 rounded-lg transition-colors lg:hidden
            ${theme === 'dark' 
              ? 'text-gray-400 hover:bg-gray-800' 
              : 'text-gray-500 hover:bg-gray-100'}
          `}
        >
          <Menu size={24} />
        </button>

        {/* Search bar */}
        <div className={`
          hidden md:flex items-center gap-2 px-3 py-2 rounded-lg w-64
          ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
        `}>
          <Search size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            placeholder="Search..."
            className={`
              bg-transparent border-0 outline-none w-full text-sm 
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-700/50 text-xs text-gray-400">
            <Command size={12} />
            <span>K</span>
          </div>
        </div>
      </div>
      
      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition-colors
            ${theme === 'dark' 
              ? 'text-gray-400 hover:bg-gray-800' 
              : 'text-gray-500 hover:bg-gray-100'}
          `}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Notifications */}
        <button className={`
          p-2 rounded-lg transition-colors
          ${theme === 'dark' 
            ? 'text-gray-400 hover:bg-gray-800' 
            : 'text-gray-500 hover:bg-gray-100'}
        `}>
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;