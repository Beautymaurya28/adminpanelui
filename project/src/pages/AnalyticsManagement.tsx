import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format, subDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar, ArrowUpRight, ArrowDownRight, Users,
  ShoppingCart, DollarSign, RefreshCw, Filter,
  TrendingUp, Package, UserPlus, ChevronRight
} from 'lucide-react';

// Mock data for charts and stats
const salesData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM dd'),
  revenue: Math.floor(Math.random() * 50000) + 10000,
  orders: Math.floor(Math.random() * 100) + 20
}));

const topProducts = [
  { name: 'Wireless Headphones', revenue: 45000, units: 150 },
  { name: 'Smart Watch', revenue: 38000, units: 95 },
  { name: 'Laptop Backpack', revenue: 25000, units: 200 },
  { name: 'Bluetooth Speaker', revenue: 22000, units: 110 },
  { name: 'Phone Case', revenue: 18000, units: 300 }
].sort((a, b) => b.revenue - a.revenue);

const userGrowthData = [
  { name: 'New Users', value: 65 },
  { name: 'Returning', value: 35 }
];

const orderBreakdownData = [
  { name: 'Delivered', value: 68, color: '#10B981' },
  { name: 'Pending', value: 17, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' },
  { name: 'Returned', value: 5, color: '#6366F1' }
];

const AnalyticsManagement: React.FC = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Calculate KPI stats
  const totalSales = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalSales / totalOrders;
  const refundRate = 2.4; // Mock refund rate
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          p-3 rounded-lg shadow-lg
          ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
        `}>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index}
              className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Analytics & Reports
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Track your sales, users, and overall performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}>
              <Calendar size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`
                  bg-transparent border-0 outline-none text-sm w-32
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              />
            </div>
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>to</span>
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}>
              <Calendar size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`
                  bg-transparent border-0 outline-none text-sm w-32
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className={`
                px-3 py-2 rounded-lg appearance-none text-sm
                ${theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200'}
              `}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Living</option>
            </select>
            <Filter 
              size={16} 
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
                ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
              `} 
            />
          </div>
        </div>
      </div>
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className={`
          rounded-xl p-5 shadow-sm border overflow-hidden relative group
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}
          backdrop-blur-sm transition-all duration-300 hover:shadow-md
        `}>
          <div className={`
            absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:scale-150
            transition-transform duration-500 ease-out bg-emerald-500/30
          `} />
          
          <div className="relative z-10">
            <div className={`
              p-3 rounded-lg inline-block
              ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}
            `}>
              <DollarSign size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Sales
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(totalSales)}
              </h3>
              <div className={`
                flex items-center gap-1 mt-1 text-xs
                text-emerald-500
              `}>
                <ArrowUpRight size={14} />
                <span>12.5% vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Total Orders */}
        <div className={`
          rounded-xl p-5 shadow-sm border overflow-hidden relative group
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}
          backdrop-blur-sm transition-all duration-300 hover:shadow-md
        `}>
          <div className={`
            absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:scale-150
            transition-transform duration-500 ease-out bg-indigo-500/30
          `} />
          
          <div className="relative z-10">
            <div className={`
              p-3 rounded-lg inline-block
              ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}
            `}>
              <ShoppingCart size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Orders
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalOrders}
              </h3>
              <div className={`
                flex items-center gap-1 mt-1 text-xs
                text-indigo-500
              `}>
                <ArrowUpRight size={14} />
                <span>8.2% vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Average Order Value */}
        <div className={`
          rounded-xl p-5 shadow-sm border overflow-hidden relative group
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}
          backdrop-blur-sm transition-all duration-300 hover:shadow-md
        `}>
          <div className={`
            absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:scale-150
            transition-transform duration-500 ease-out bg-cyan-500/30
          `} />
          
          <div className="relative z-10">
            <div className={`
              p-3 rounded-lg inline-block
              ${theme === 'dark' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}
            `}>
              <TrendingUp size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Average Order
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(avgOrderValue)}
              </h3>
              <div className={`
                flex items-center gap-1 mt-1 text-xs
                text-cyan-500
              `}>
                <ArrowUpRight size={14} />
                <span>5.3% vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Refund Rate */}
        <div className={`
          rounded-xl p-5 shadow-sm border overflow-hidden relative group
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}
          backdrop-blur-sm transition-all duration-300 hover:shadow-md
        `}>
          <div className={`
            absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:scale-150
            transition-transform duration-500 ease-out bg-rose-500/30
          `} />
          
          <div className="relative z-10">
            <div className={`
              p-3 rounded-lg inline-block
              ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-600'}
            `}>
              <RefreshCw size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Refund Rate
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {refundRate}%
              </h3>
              <div className={`
                flex items-center gap-1 mt-1 text-xs
                text-rose-500
              `}>
                <ArrowDownRight size={14} />
                <span>0.8% vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className={`
          rounded-xl overflow-hidden shadow-sm border p-5
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'}
        `}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Revenue Trend
            </h2>
            
            <div className={`
              flex p-1 rounded-lg text-sm
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
            `}>
              {['7d', '30d'].map((range) => (
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
                  onClick={() => setTimeRange(range as '7d' | '30d')}
                >
                  {range === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData.slice(timeRange === '7d' ? -7 : -30)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
                />
                <XAxis 
                  dataKey="date" 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Products Chart */}
        <div className={`
          rounded-xl overflow-hidden shadow-sm border p-5
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'}
        `}>
          <h2 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Top Products
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
                />
                <XAxis 
                  type="number"
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                  width={150}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="#6366F1"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* User Growth Chart */}
        <div className={`
          rounded-xl overflow-hidden shadow-sm border p-5
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'}
        `}>
          <h2 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            User Growth
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userGrowthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#6366F1" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Order Breakdown Chart */}
        <div className={`
          rounded-xl overflow-hidden shadow-sm border p-5
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'}
        `}>
          <h2 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Order Breakdown
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;