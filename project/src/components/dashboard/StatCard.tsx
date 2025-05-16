import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  color
}) => {
  const { theme } = useTheme();
  
  // Color mapping based on theme and specified color
  const getColors = () => {
    const colorMap = {
      indigo: {
        light: {
          bg: 'bg-indigo-50',
          text: 'text-indigo-600',
          icon: 'text-indigo-500 bg-indigo-100'
        },
        dark: {
          bg: 'bg-indigo-900/20',
          text: 'text-indigo-400',
          icon: 'text-indigo-400 bg-indigo-900/50'
        }
      },
      cyan: {
        light: {
          bg: 'bg-cyan-50',
          text: 'text-cyan-600',
          icon: 'text-cyan-500 bg-cyan-100'
        },
        dark: {
          bg: 'bg-cyan-900/20',
          text: 'text-cyan-400',
          icon: 'text-cyan-400 bg-cyan-900/50'
        }
      },
      emerald: {
        light: {
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          icon: 'text-emerald-500 bg-emerald-100'
        },
        dark: {
          bg: 'bg-emerald-900/20',
          text: 'text-emerald-400',
          icon: 'text-emerald-400 bg-emerald-900/50'
        }
      },
      amber: {
        light: {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          icon: 'text-amber-500 bg-amber-100'
        },
        dark: {
          bg: 'bg-amber-900/20',
          text: 'text-amber-400',
          icon: 'text-amber-400 bg-amber-900/50'
        }
      },
      rose: {
        light: {
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          icon: 'text-rose-500 bg-rose-100'
        },
        dark: {
          bg: 'bg-rose-900/20',
          text: 'text-rose-400',
          icon: 'text-rose-400 bg-rose-900/50'
        }
      }
    };
    
    return colorMap[color][theme === 'dark' ? 'dark' : 'light'];
  };
  
  const colors = getColors();

  // Glassmorphism style based on theme
  const glassStyle = theme === 'dark' 
    ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
    : 'bg-white/80 border-gray-200 backdrop-blur-sm';

  return (
    <div className={`
      rounded-xl p-5 shadow-sm border overflow-hidden relative group
      ${glassStyle}
      transition-all duration-300 hover:shadow-md
    `}>
      {/* Background color accent that grows on hover */}
      <div className={`
        absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:scale-150
        transition-transform duration-500 ease-out
        ${colors.bg}
      `} />
      
      <div className="flex justify-between items-start">
        <div className="z-10">
          <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </h3>
          <div className="flex items-center">
            {trend === 'up' ? (
              <TrendingUp size={15} className="text-emerald-500 mr-1" />
            ) : (
              <TrendingDown size={15} className="text-rose-500 mr-1" />
            )}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {change}
            </span>
            <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              vs last week
            </span>
          </div>
        </div>
        
        <div className={`
          p-3 rounded-lg
          ${colors.icon}
        `}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;