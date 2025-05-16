import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Globe, Bell, Lock, Clock, DollarSign, Languages,
  Shield, Key, LogIn, Save, ChevronRight, X
} from 'lucide-react';
import { toast } from 'sonner';

// Mock login activity data
const mockLoginActivity = [
  {
    id: 1,
    date: '2025-05-15T10:30:00',
    device: 'Chrome on Windows',
    location: 'New York, USA',
    ip: '192.168.1.1',
    status: 'success'
  },
  {
    id: 2,
    date: '2025-05-14T15:45:00',
    device: 'Safari on iPhone',
    location: 'Los Angeles, USA',
    ip: '192.168.1.2',
    status: 'success'
  },
  {
    id: 3,
    date: '2025-05-14T08:20:00',
    device: 'Firefox on MacOS',
    location: 'London, UK',
    ip: '192.168.1.3',
    status: 'failed'
  },
  {
    id: 4,
    date: '2025-05-13T19:15:00',
    device: 'Chrome on Android',
    location: 'Toronto, Canada',
    ip: '192.168.1.4',
    status: 'success'
  },
  {
    id: 5,
    date: '2025-05-13T12:30:00',
    device: 'Edge on Windows',
    location: 'Sydney, Australia',
    ip: '192.168.1.5',
    status: 'success'
  }
];

const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'AdminHub',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    dailyDigest: false,
    twoFactorAuth: true
  });
  
  // Handle settings change
  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Toggle switch component
  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </p>
        {description && (
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${enabled 
            ? 'bg-indigo-600' 
            : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
  
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Settings
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage account preferences, notifications & system settings
        </p>
      </div>
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className={`
          lg:col-span-2 rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <div className="flex items-center gap-2 mb-6">
            <Globe size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              General Settings
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Site Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                  border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                `}
              />
            </div>
            
            {/* Currency */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Default Currency
              </label>
              <div className="relative">
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm appearance-none
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  `}
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                </select>
                <DollarSign 
                  size={16} 
                  className={`
                    absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}
                />
              </div>
            </div>
            
            {/* Timezone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Timezone
              </label>
              <div className="relative">
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm appearance-none
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  `}
                >
                  <option value="America/New_York">New York (GMT-4)</option>
                  <option value="America/Los_Angeles">Los Angeles (GMT-7)</option>
                  <option value="Europe/London">London (GMT+1)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  <option value="Australia/Sydney">Sydney (GMT+10)</option>
                </select>
                <Clock 
                  size={16} 
                  className={`
                    absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}
                />
              </div>
            </div>
            
            {/* Language */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Language
              </label>
              <div className="relative">
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm appearance-none
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  `}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
                <Languages 
                  size={16} 
                  className={`
                    absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications Settings */}
        <div className={`
          rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <div className="flex items-center gap-2 mb-6">
            <Bell size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h2>
          </div>
          
          <div className="space-y-6">
            <ToggleSwitch
              enabled={settings.emailNotifications}
              onChange={(value) => handleSettingChange('emailNotifications', value)}
              label="Email Notifications"
              description="Receive order updates and alerts via email"
            />
            
            <ToggleSwitch
              enabled={settings.pushNotifications}
              onChange={(value) => handleSettingChange('pushNotifications', value)}
              label="Push Notifications"
              description="Get real-time updates in your browser"
            />
            
            <ToggleSwitch
              enabled={settings.dailyDigest}
              onChange={(value) => handleSettingChange('dailyDigest', value)}
              label="Daily Digest Emails"
              description="Receive a summary of activities every day"
            />
          </div>
        </div>
        
        {/* Security Settings */}
        <div className={`
          lg:col-span-2 rounded-xl p-6 shadow-sm border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Security
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <ToggleSwitch
                  enabled={settings.twoFactorAuth}
                  onChange={(value) => handleSettingChange('twoFactorAuth', value)}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
              </div>
              
              {settings.twoFactorAuth && (
                <button className={`
                  px-3 py-1 text-sm rounded-lg transition-colors
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}>
                  Configure
                </button>
              )}
            </div>
            
            <div>
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className={`
                  w-full px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  <span>Change Password</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div>
              <h3 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Recent Login Activity
              </h3>
              <div className="space-y-3">
                {mockLoginActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`
                      p-3 rounded-lg
                      ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LogIn 
                          size={16} 
                          className={
                            activity.status === 'success'
                              ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                              : theme === 'dark' ? 'text-rose-400' : 'text-rose-500'
                          } 
                        />
                        <div>
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            {activity.device}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activity.location} • {activity.ip}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Settings Button */}
      <div className={`
        fixed bottom-0 left-0 right-0 p-4 border-t z-10
        ${theme === 'dark' 
          ? 'bg-gray-900/80 border-gray-800 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200 backdrop-blur-sm'}
      `}>
        <div className="container mx-auto flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
      
      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-md rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Change Password
                </h3>
                <button
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current Password
                  </label>
                  <input
                    type="password"
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
                    New Password
                  </label>
                  <input
                    type="password"
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
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className={`
                    px-4 py-2 rounded-lg text-sm
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    toast.success('Password changed successfully!');
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;