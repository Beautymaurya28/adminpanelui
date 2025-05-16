import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface RevenueChartProps {
  timeRange: 'daily' | 'weekly' | 'monthly';
}

// Mock data for chart
const mockData = {
  daily: Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    revenue: Math.floor(Math.random() * 5000) + 1000,
    orders: Math.floor(Math.random() * 50) + 10,
  })),
  weekly: Array.from({ length: 7 }, (_, i) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      label: days[i],
      revenue: Math.floor(Math.random() * 20000) + 5000,
      orders: Math.floor(Math.random() * 200) + 50,
    };
  }),
  monthly: Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 500) + 100,
  })),
};

const RevenueChart: React.FC<RevenueChartProps> = ({ timeRange }) => {
  const { theme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState(mockData[timeRange]);
  
  // Update chart data when timeRange changes
  useEffect(() => {
    setChartData(mockData[timeRange]);
  }, [timeRange]);
  
  // Find the maximum revenue to normalize bars
  const maxRevenue = Math.max(...chartData.map(item => item.revenue));
  
  return (
    <div className="h-full flex flex-col">
      {/* Chart legend */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <div className="flex items-center">
          <span className={`
            inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2
          `}></span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span>
        </div>
        <div className="flex items-center">
          <span className={`
            inline-block w-3 h-3 rounded-full bg-cyan-500 mr-2
          `}></span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Orders</span>
        </div>
      </div>
      
      {/* Main chart area */}
      <div className="flex-1 flex items-end">
        {chartData.map((item, index) => {
          // Calculate height percentage based on max value
          const heightPercentage = (item.revenue / maxRevenue) * 100;
          const orderHeightPercentage = (item.orders / Math.max(...chartData.map(d => d.orders))) * 80;
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className={`
                  absolute -mt-20 px-3 py-2 rounded-md text-xs shadow-lg z-10
                  ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-200'}
                `}>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-indigo-500">Revenue: ${item.revenue.toLocaleString()}</p>
                  <p className="text-cyan-500">Orders: {item.orders}</p>
                </div>
              )}
              
              <div className="relative h-full w-full flex justify-center items-end gap-1">
                {/* Revenue bar */}
                <div 
                  className={`
                    w-3/5 rounded-t-md transition-all duration-300 ease-out
                    ${hoveredIndex === index ? 'bg-indigo-400' : 'bg-indigo-500'}
                  `} 
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                
                {/* Orders bar */}
                <div 
                  className={`
                    w-1/4 rounded-t-md transition-all duration-300 ease-out
                    ${hoveredIndex === index ? 'bg-cyan-400' : 'bg-cyan-500'}
                  `} 
                  style={{ height: `${orderHeightPercentage}%` }}
                ></div>
              </div>
              
              {/* X-axis label */}
              <div className={`
                mt-2 text-xs font-medium
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;