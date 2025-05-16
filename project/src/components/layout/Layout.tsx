import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import QuickActionBar from './QuickActionBar';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const { theme } = useTheme();
  
  // Close sidebar on smaller screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard shortcut for quick action bar (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuickActionOpen(prev => !prev);
      }
      
      // Close quick action bar with Escape
      if (e.key === 'Escape' && quickActionOpen) {
        setQuickActionOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickActionOpen]);

  return (
    <div className={`h-screen flex overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(prev => !prev)}
          openQuickAction={() => setQuickActionOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-200 ease-in-out">
          <div className={`container mx-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-8'}`}>
            {children}
          </div>
        </main>
      </div>
      
      {quickActionOpen && (
        <QuickActionBar onClose={() => setQuickActionOpen(false)} />
      )}
    </div>
  );
};

export default Layout;