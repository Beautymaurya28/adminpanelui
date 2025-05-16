import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { 
  Search, Filter, Calendar, Eye, Check, X,
  RefreshCw, Package, DollarSign, Clock,
  ChevronRight, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

// Mock returns data
const mockReturns = [
  {
    id: 'RET001',
    orderId: 'ORD-12345',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    product: {
      name: 'Wireless Headphones',
      image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 129.99
    },
    reason: 'Product not as described',
    details: 'The noise cancellation feature is not working as advertised.',
    images: [
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    status: 'Pending',
    returnDate: '2025-05-15T10:30:00'
  },
  {
    id: 'RET002',
    orderId: 'ORD-12344',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    product: {
      name: 'Smart Watch',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 249.99
    },
    reason: 'Wrong size',
    details: 'The watch band is too small for my wrist.',
    images: [],
    status: 'Approved',
    returnDate: '2025-05-14T15:45:00'
  },
  {
    id: 'RET003',
    orderId: 'ORD-12343',
    customer: {
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    product: {
      name: 'Bluetooth Speaker',
      image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 79.99
    },
    reason: 'Defective product',
    details: 'Speaker produces distorted sound at high volumes.',
    images: [
      'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    status: 'Refunded',
    returnDate: '2025-05-14T09:20:00'
  },
  {
    id: 'RET004',
    orderId: 'ORD-12342',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    product: {
      name: 'Laptop Backpack',
      image: 'https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 59.99
    },
    reason: 'Changed mind',
    details: 'Found a different style that better suits my needs.',
    images: [],
    status: 'Rejected',
    returnDate: '2025-05-13T16:30:00'
  }
];

// Types
type ReturnStatus = 'Pending' | 'Approved' | 'Refunded' | 'Rejected';

interface Return {
  id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: {
    name: string;
    image: string;
    price: number;
  };
  reason: string;
  details: string;
  images: string[];
  status: ReturnStatus;
  returnDate: string;
}

const ReturnsManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Calculate quick stats
  const totalReturns = mockReturns.length;
  const refundsProcessed = mockReturns.filter(r => r.status === 'Refunded').length;
  const avgReturnTime = '2.5 days';
  
  // Filter returns
  const filteredReturns = mockReturns.filter(returnItem => {
    const matchesSearch = 
      searchTerm === '' || 
      returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || returnItem.status === selectedStatus;
    
    const returnDate = new Date(returnItem.returnDate);
    const matchesStartDate = startDate === '' || new Date(startDate) <= returnDate;
    const matchesEndDate = endDate === '' || new Date(endDate) >= returnDate;
    
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: ReturnStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Pending':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      case 'Approved':
        return `${baseStyles} ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`;
      case 'Refunded':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Rejected':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Handle return actions
  const handleApproveReturn = (returnItem: Return) => {
    toast.success('Return request approved successfully!');
  };
  
  const handleRejectReturn = (returnItem: Return) => {
    toast.success('Return request rejected successfully!');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Returns
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage return requests and customer refunds
          </p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Returns */}
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
              <Package size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Returns
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalReturns}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                This month
              </p>
            </div>
          </div>
        </div>
        
        {/* Refunds Processed */}
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
                Refunds Processed
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {refundsProcessed}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                This month
              </p>
            </div>
          </div>
        </div>
        
        {/* Average Return Time */}
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
              <Clock size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Avg Return Time
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {avgReturnTime}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Processing time
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg md:col-span-5
          ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
        `}>
          <Search size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID or customer..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Status filter */}
        <div className="relative md:col-span-2">
          <select
            value={selectedStatus || ''}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Refunded">Refunded</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Filter 
            size={16} 
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
              ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
            `} 
          />
        </div>
        
        {/* Date Range */}
        <div className="flex items-center gap-2 md:col-span-5">
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg flex-1
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
                w-full bg-transparent border-0 outline-none text-sm
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            />
          </div>
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>to</span>
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg flex-1
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
                w-full bg-transparent border-0 outline-none text-sm
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            />
          </div>
        </div>
      </div>
      
      {/* Returns Table */}
      <div className={`
        rounded-xl overflow-hidden shadow-sm
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border border-gray-700' 
          : 'bg-white border border-gray-200'}
      `}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={`
              ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}
            `}>
              <tr>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Return ID
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Customer
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Product
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Reason
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Status
                </th>
                <th className={`
                  px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`
              ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} divide-y
            `}>
              {filteredReturns.map((returnItem) => (
                <tr 
                  key={returnItem.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Return ID */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                  `}>
                    <div>
                      {returnItem.id}
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {returnItem.orderId}
                      </p>
                    </div>
                  </td>
                  
                  {/* Customer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          src={returnItem.customer.avatar} 
                          alt={returnItem.customer.name} 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {returnItem.customer.name}
                        </div>
                        <div className={`
                          text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {returnItem.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Product */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          src={returnItem.product.image} 
                          alt={returnItem.product.name} 
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {returnItem.product.name}
                        </div>
                        <div className={`
                          text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {formatCurrency(returnItem.product.price)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Reason */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    {returnItem.reason}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(returnItem.status as ReturnStatus)}>
                      {returnItem.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedReturn(returnItem);
                          setIsDetailsModalOpen(true);
                        }}
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <Eye size={16} />
                      </button>
                      
                      {returnItem.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveReturn(returnItem)}
                            className={`
                              p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                              ${theme === 'dark' 
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                            `}
                          >
                            <Check size={16} />
                          </button>
                          
                          <button 
                            onClick={() => handleRejectReturn(returnItem)}
                            className={`
                              p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                              ${theme === 'dark' 
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                            `}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredReturns.length === 0 && (
                <tr>
                  <td 
                    colSpan={6} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No returns found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Return Details Modal */}
      {isDetailsModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-4xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Return Request Details
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedReturn.id} • {selectedReturn.orderId}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Return Info */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Return Information
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Status</span>
                        <span className={getStatusBadgeStyles(selectedReturn.status as ReturnStatus)}>
                          {selectedReturn.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Return Date</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(selectedReturn.returnDate)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Refund Amount</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {formatCurrency(selectedReturn.product.price)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h5 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Return Reason
                      </h5>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedReturn.reason}
                      </p>
                      <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedReturn.details}
                      </p>
                    </div>
                    
                    {selectedReturn.images.length > 0 && (
                      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h5 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Attached Images
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedReturn.images.map((image, index) => (
                            <div 
                              key={index}
                              className="relative aspect-video rounded-lg overflow-hidden"
                            >
                              <img
                                src={image}
                                alt={`Return image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Product & Customer Info */}
                <div className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Product Information
                    </h4>
                    
                    <div className={`
                      p-4 rounded-lg
                      ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                    `}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img 
                            src={selectedReturn.product.image} 
                            alt={selectedReturn.product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {selectedReturn.product.name}
                          </p>
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatCurrency(selectedReturn.product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Info */}
                  <div>
                    <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Customer Information
                    </h4>
                    
                    <div className={`
                      p-4 rounded-lg
                      ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                    `}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            src={selectedReturn.customer.avatar} 
                            alt={selectedReturn.customer.name}
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {selectedReturn.customer.name}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedReturn.customer.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className={`
                    px-4 py-2 rounded-lg text-sm
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  Close
                </button>
                
                {selectedReturn.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleRejectReturn(selectedReturn);
                        setIsDetailsModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-lg text-sm bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Reject Return
                    </button>
                    
                    <button
                      onClick={() => {
                        handleApproveReturn(selectedReturn);
                        setIsDetailsModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Approve Return
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsManagement;