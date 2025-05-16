import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, Mail, Shield, Clock, Package, Star,
  LogOut, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const AdminProfile: React.FC = () => {
  const { theme } = useTheme();
  
  const handleLogout = () => {
    toast.success('Logged out successfully');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Admin Profile
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          View your profile information and activity
        </p>
      </div>
      
      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className={`
          col-span-1 rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-medium">
              A
            </div>
            
            <h2 className={`mt-4 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Admin User
            </h2>
            
            <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              admin@example.com
            </div>
            
            <div className={`
              mt-3 px-3 py-1 rounded-full text-xs font-medium
              ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}
            `}>
              Administrator
            </div>
            
            <button
              onClick={handleLogout}
              className={`
                mt-6 w-full px-4 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2
                ${theme === 'dark' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className={`
          lg:col-span-2 rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Activity Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`
              p-4 rounded-lg
              ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Orders Managed
                </span>
                <Package size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <p className={`text-2xl font-semibold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                1,234
              </p>
            </div>
            
            <div className={`
              p-4 rounded-lg
              ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Reviews Approved
                </span>
                <Star size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <p className={`text-2xl font-semibold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                567
              </p>
            </div>
          </div>
          
          {/* Last Login Info */}
          <div className={`
            mt-6 p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
          `}>
            <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Recent Activity
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Login
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Today at 10:30 AM
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Account Created
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    January 15, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account Details */}
      <div className={`
        rounded-xl p-6 shadow-sm border
        ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Account Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Admin User
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              admin@example.com
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;