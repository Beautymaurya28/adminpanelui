import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import OrdersTable from './OrdersTable';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, 
  DollarSign, CreditCard, Calendar, ArrowRight 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  // Stats data
  const stats = [
    {
      title: 'Total Sales',
      value: '$24,567',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign size={20} />,
      color: 'indigo'
    },
    {
      title: 'New Orders',
      value: '1,758',
      change: '+8.2%',
      trend: 'up',
      icon: <ShoppingCart size={20} />,
      color: 'cyan'
    },
    {
      title: 'Active Users',
      value: '35.4K',
      change: '+22.5%',
      trend: 'up',
      icon: <Users size={20} />,
      color: 'emerald'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-1.8%',
      trend: 'down',
      icon: <CreditCard size={20} />,
      color: 'amber'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Dashboard
        </h1>
        
        <div className="flex items-center gap-2">
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            <Calendar size={18} />
          </span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Last updated: May 15, 2025
          </span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend as 'up' | 'down'}
            icon={stat.icon}
            color={stat.color as 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose'}
          />
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Card */}
        <div className={`
          lg:col-span-2 rounded-xl overflow-hidden shadow-sm
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200'}
        `}>
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Revenue Overview
              </h2>
              
              <div className={`
                flex items-center p-1 rounded-lg text-sm
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                {['daily', 'weekly', 'monthly'].map((range) => (
                  <button
                    key={range}
                    className={`
                      px-3 py-1 rounded-md transition-colors
                      ${timeRange === range 
                        ? theme === 'dark'
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800 shadow-sm' 
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-300' 
                          : 'text-gray-600 hover:text-gray-800'
                      }
                    `}
                    onClick={() => setTimeRange(range as 'daily' | 'weekly' | 'monthly')}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-80">
              <RevenueChart timeRange={timeRange} />
            </div>
          </div>
        </div>
        
        {/* Activity Card */}
        <div className={`
          rounded-xl overflow-hidden shadow-sm
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200'}
        `}>
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Recent Activity
              </h2>
              
              <button className={`
                text-sm flex items-center transition-colors
                ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}
              `}>
                View all
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  title: 'New order received', 
                  description: 'Order #12345 - $430.00',
                  time: '2 minutes ago',
                  icon: <ShoppingCart size={16} />,
                  iconColor: 'text-cyan-500 bg-cyan-500/10'
                },
                { 
                  title: 'Payment confirmed', 
                  description: 'Order #12342 - $230.00',
                  time: '1 hour ago',
                  icon: <DollarSign size={16} />,
                  iconColor: 'text-emerald-500 bg-emerald-500/10'
                },
                { 
                  title: 'New user registered', 
                  description: 'User ID: #U-123456',
                  time: '3 hours ago',
                  icon: <Users size={16} />,
                  iconColor: 'text-indigo-500 bg-indigo-500/10'
                },
                { 
                  title: 'Product out of stock', 
                  description: 'SKU: WH-123456',
                  time: '5 hours ago',
                  icon: <TrendingDown size={16} />,
                  iconColor: 'text-amber-500 bg-amber-500/10'
                },
                { 
                  title: 'Sales goal reached', 
                  description: 'Monthly target achieved',
                  time: '1 day ago',
                  icon: <TrendingUp size={16} />,
                  iconColor: 'text-emerald-500 bg-emerald-500/10'
                },
              ].map((activity, index) => (
                <div key={index} className="flex">
                  <div className="relative flex items-start">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full mt-1 ${activity.iconColor}
                    `}>
                      {activity.icon}
                    </div>
                    {index < 4 && (
                      <div className={`absolute top-10 bottom-0 left-4 w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  
                  <div className="ml-4 pb-6">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {activity.title}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders Table */}
      <div className={`
        rounded-xl overflow-hidden shadow-sm
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border border-gray-700' 
          : 'bg-white border border-gray-200'}
      `}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Recent Orders
            </h2>
            
            <button className={`
              text-sm flex items-center transition-colors
              ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}
            `}>
              View all orders
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
          
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;