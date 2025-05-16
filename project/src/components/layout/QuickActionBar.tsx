import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard, Users, ShoppingBag, ShoppingCart, CreditCard, Settings,
  Search, X, ArrowRight, Plus, FileText
} from 'lucide-react';

interface QuickActionBarProps {
  onClose: () => void;
}

// Action item definition
interface ActionItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  category: 'navigation' | 'action' | 'recent';
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    // Focus the search input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Add click outside listener to close the modal
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === 'quickActionBackdrop') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Navigation actions
  const actions: ActionItem[] = [
    // Navigation
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Go to the main dashboard',
      icon: <LayoutDashboard size={18} />,
      path: '/',
      category: 'navigation'
    },
    {
      id: 'users',
      name: 'Users',
      description: 'Manage users and permissions',
      icon: <Users size={18} />,
      path: '/users',
      category: 'navigation'
    },
    {
      id: 'products',
      name: 'Products',
      description: 'Manage your product catalog',
      icon: <ShoppingBag size={18} />,
      path: '/products',
      category: 'navigation'
    },
    {
      id: 'orders',
      name: 'Orders',
      description: 'View and manage customer orders',
      icon: <ShoppingCart size={18} />,
      path: '/orders',
      category: 'navigation'
    },
    {
      id: 'payments',
      name: 'Payments',
      description: 'Track payments and transactions',
      icon: <CreditCard size={18} />,
      path: '/payments',
      category: 'navigation'
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Configure system settings',
      icon: <Settings size={18} />,
      path: '/settings',
      category: 'navigation'
    },
    
    // Actions
    {
      id: 'create-product',
      name: 'Create Product',
      description: 'Add a new product to your catalog',
      icon: <Plus size={18} />,
      path: '/products/new',
      category: 'action'
    },
    {
      id: 'create-coupon',
      name: 'Create Coupon',
      description: 'Add a new promotional coupon',
      icon: <Plus size={18} />,
      path: '/coupons/new',
      category: 'action'
    },
    
    // Recent
    {
      id: 'recent-order',
      name: 'Order #12345',
      description: 'Viewed 2 minutes ago',
      icon: <FileText size={18} />,
      path: '/orders/12345',
      category: 'recent'
    },
    {
      id: 'recent-product',
      name: 'Wireless Headphones',
      description: 'Edited 30 minutes ago',
      icon: <ShoppingBag size={18} />,
      path: '/products/123',
      category: 'recent'
    },
  ];
  
  // Filter actions based on search query
  const filteredActions = searchQuery
    ? actions.filter(action => 
        action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : actions;
  
  // Group actions by category
  const navigationActions = filteredActions.filter(a => a.category === 'navigation');
  const quickActions = filteredActions.filter(a => a.category === 'action');
  const recentItems = filteredActions.filter(a => a.category === 'recent');
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? filteredActions.length - 1 : prev - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredActions[selectedIndex];
        if (selected) {
          if (selected.path) {
            navigate(selected.path);
            onClose();
          } else if (selected.action) {
            selected.action();
            onClose();
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredActions, selectedIndex, navigate, onClose]);
  
  // Handle selection of an action
  const handleSelectAction = (action: ActionItem) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action) {
      action.action();
    }
    onClose();
  };
  
  // Render action group
  const ActionGroup: React.FC<{ title: string, items: ActionItem[] }> = ({ title, items }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className={`text-xs uppercase font-semibold mb-2 px-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((action, index) => {
            // Find the overall index in the filteredActions array
            const overallIndex = filteredActions.findIndex(a => a.id === action.id);
            
            return (
              <div
                key={action.id}
                className={`
                  flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors
                  ${selectedIndex === overallIndex 
                    ? theme === 'dark' 
                      ? 'bg-gray-700/70 text-white' 
                      : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => handleSelectAction(action)}
                onMouseEnter={() => setSelectedIndex(overallIndex)}
              >
                <div className={`
                  p-2 rounded-lg mr-3
                  ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                `}>
                  {action.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <ArrowRight 
                  size={16} 
                  className={`ml-auto ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      id="quickActionBackdrop"
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[15vh] backdrop-blur-sm transition-opacity"
    >
      <div className={`
        w-full max-w-xl rounded-xl shadow-2xl overflow-hidden
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
        transition-all duration-200 animate-in fade-in zoom-in-95
      `}>
        {/* Search header */}
        <div className={`
          px-4 py-3 border-b
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <div className="flex items-center gap-3">
            <Search size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for commands or navigation..."
              className={`
                w-full bg-transparent border-0 outline-none
                ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
              `}
            />
            <div className="flex items-center">
              <div className={`
                flex items-center px-1.5 py-1 rounded text-xs
                ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}
              `}>
                Esc
              </div>
              <button 
                className={`ml-2 p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className={`py-3 max-h-[50vh] overflow-y-auto ${filteredActions.length === 0 ? 'px-4' : ''}`}>
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No results found for "{searchQuery}"
              </p>
            </div>
          ) : (
            <>
              <ActionGroup title="Navigation" items={navigationActions} />
              <ActionGroup title="Quick Actions" items={quickActions} />
              <ActionGroup title="Recent Items" items={recentItems} />
            </>
          )}
        </div>
        
        {/* Footer with keyboard shortcuts */}
        <div className={`
          px-4 py-3 border-t flex justify-between items-center text-xs
          ${theme === 'dark' ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}
        `}>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className={`
                px-1.5 py-1 rounded
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>↑</div>
              <div className={`
                px-1.5 py-1 rounded
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>↓</div>
              <span className="ml-1">to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`
                px-1.5 py-1 rounded
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>Enter</div>
              <span className="ml-1">to select</span>
            </div>
          </div>
          <div>Press Esc to close</div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionBar;