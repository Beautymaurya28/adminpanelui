import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard, Users, ShoppingBag, ShoppingCart, CreditCard, 
  Truck, TagsIcon, Ticket, Star, FileText, Settings, BarChart2, 
  Store, RefreshCw, ChevronLeft, ChevronRight, User, LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Interface for our nav items
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  // Navigation items for the sidebar
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} />, badge: 3 },
    { name: 'Products', path: '/products', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} />, badge: 12 },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Shipping', path: '/shipping', icon: <Truck size={20} /> },
    { name: 'Categories', path: '/categories', icon: <TagsIcon size={20} /> },
    { name: 'Coupons', path: '/coupons', icon: <Ticket size={20} /> },
    { name: 'Reviews', path: '/reviews', icon: <Star size={20} />, badge: 5 },
    { name: 'CMS', path: '/cms', icon: <FileText size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Vendors', path: '/vendors', icon: <Store size={20} /> },
    { name: 'Returns', path: '/returns', icon: <RefreshCw size={20} />, badge: 2 },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  // Group the nav items into sections
  const mainNavItems = navItems.slice(0, 5);
  const managementNavItems = navItems.slice(5, 10);
  const analyticsNavItems = navItems.slice(10, 13);
  const configNavItems = navItems.slice(13);

  const NavSection: React.FC<{ title: string, items: NavItem[] }> = ({ title, items }) => (
    <div className="mb-6">
      {isOpen && (
        <h3 className={`px-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
          {title}
        </h3>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.path} className="mb-1">
            <Link
              to={item.path}
              className={`
                flex items-center px-4 py-2.5 rounded-lg transition-all duration-200
                ${location.pathname === item.path 
                  ? `${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`
                  : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800/60' : 'text-gray-700 hover:bg-gray-100/60'}`
                }
                ${hovered === item.path && !isOpen ? 'shadow-lg scale-105' : ''}
                ${!isOpen ? 'justify-center' : ''}
              `}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className={`${isOpen ? 'mr-3' : ''} transition-all duration-200`}>
                {item.icon}
              </span>
              
              {isOpen && (
                <span className="flex-1 whitespace-nowrap font-medium">{item.name}</span>
              )}
              
              {isOpen && item.badge && (
                <span className={`
                  ml-auto px-2 py-0.5 text-xs rounded-full 
                  ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}
                `}>
                  {item.badge}
                </span>
              )}
              
              {/* Show badge as dot when sidebar is collapsed */}
              {!isOpen && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
              )}
            </Link>
            
            {/* Show tooltip when hovering over collapsed icon */}
            {!isOpen && hovered === item.path && (
              <div className={`
                absolute left-16 z-50 px-3 py-2 rounded-md whitespace-nowrap
                transform-gpu transition-all duration-150 ease-in-out scale-100 origin-left
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-lg'}
              `}>
                {item.name}
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out
        ${theme === 'dark' ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}
        ${isOpen ? 'w-64' : 'w-20'}
        ${isOpen ? 'lg:translate-x-0' : 'lg:translate-x-0'}
        ${isOpen ? '-translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b shrink-0 border-opacity-50">
        <div className="flex items-center">
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-lg
            ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}
          `}>
            <ShoppingBag size={20} />
          </div>
          
          {isOpen && (
            <div className="ml-3">
              <h1 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AdminHub
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>E-Commerce</p>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleSidebar}
          className={`
            p-1.5 rounded-lg transition-colors duration-200
            ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}
            lg:block hidden
          `}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Management" items={managementNavItems} />
        <NavSection title="Analytics" items={analyticsNavItems} />
        <NavSection title="Configuration" items={configNavItems} />
      </div>

      {/* User Profile Section */}
      <div className={`
        p-4 mt-auto border-t
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
      `}>
        {isOpen ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                A
              </div>
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Admin User
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  admin@example.com
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 pt-2">
              <Link
                to="/profile"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
                `}
              >
                <User size={16} />
                <span>View Profile</span>
              </Link>
              <button
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${theme === 'dark' ? 'text-rose-400 hover:bg-gray-800' : 'text-rose-600 hover:bg-gray-100'}
                `}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;