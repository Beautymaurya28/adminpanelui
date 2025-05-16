import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, Mail, Shield, Clock, Package, Star,
  Save, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com'
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Profile
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage your personal information and preferences
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
              {formData.name}
            </h2>
            
            <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {formData.email}
            </div>
            
            <div className={`
              mt-3 px-3 py-1 rounded-full text-xs font-medium
              ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}
            `}>
              Administrator
            </div>
          </div>
        </div>
        
        {/* Edit Profile Form */}
        <div className={`
          lg:col-span-2 rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'}
                  border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                `}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'}
                  border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                `}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save size={16} />
                <span>Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`
          rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </h3>
          
          <div className="space-y-4">
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
        
        {/* Stats */}
        <div className={`
          rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Overview
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;