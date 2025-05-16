import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, Calendar, Eye, Printer, 
  Download, MoreHorizontal, Check, X, TrendingUp
} from 'lucide-react';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-12345',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    date: '2025-05-15T10:30:00',
    items: 3,
    total: 289.99,
    status: 'Completed',
    payment: 'Credit Card',
    shipping: 'Express',
    timeline: [
      { status: 'Order Placed', date: '2025-05-15T10:30:00' },
      { status: 'Payment Confirmed', date: '2025-05-15T10:35:00' },
      { status: 'Processing', date: '2025-05-15T11:20:00' },
      { status: 'Shipped', date: '2025-05-15T14:45:00' },
      { status: 'Delivered', date: '2025-05-16T09:30:00' }
    ]
  },
  {
    id: 'ORD-12344',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '2025-05-15T09:45:00',
    items: 2,
    total: 549.50,
    status: 'Processing',
    payment: 'PayPal',
    shipping: 'Standard',
    timeline: [
      { status: 'Order Placed', date: '2025-05-15T09:45:00' },
      { status: 'Payment Confirmed', date: '2025-05-15T09:50:00' },
      { status: 'Processing', date: '2025-05-15T11:20:00' }
    ]
  },
  {
    id: 'ORD-12343',
    customer: {
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    date: '2025-05-15T08:20:00',
    items: 1,
    total: 129.99,
    status: 'Pending',
    payment: 'Credit Card',
    shipping: 'Standard',
    timeline: [
      { status: 'Order Placed', date: '2025-05-15T08:20:00' }
    ]
  },
  {
    id: 'ORD-12342',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    date: '2025-05-14T16:30:00',
    items: 4,
    total: 79.99,
    status: 'Shipped',
    payment: 'Apple Pay',
    shipping: 'Express',
    timeline: [
      { status: 'Order Placed', date: '2025-05-14T16:30:00' },
      { status: 'Payment Confirmed', date: '2025-05-14T16:35:00' },
      { status: 'Processing', date: '2025-05-14T17:20:00' },
      { status: 'Shipped', date: '2025-05-15T09:45:00' }
    ]
  },
  {
    id: 'ORD-12341',
    customer: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    date: '2025-05-14T14:15:00',
    items: 2,
    total: 349.75,
    status: 'Cancelled',
    payment: 'Bank Transfer',
    shipping: 'Standard',
    timeline: [
      { status: 'Order Placed', date: '2025-05-14T14:15:00' },
      { status: 'Payment Confirmed', date: '2025-05-14T14:30:00' },
      { status: 'Processing', date: '2025-05-14T15:20:00' },
      { status: 'Cancelled', date: '2025-05-14T16:45:00' }
    ]
  }
];

// Order status type
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

interface OrderData {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: string;
  shipping: string;
  timeline: Array<{
    status: string;
    date: string;
  }>;
}

const OrderManagement: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter orders based on search, tab, dates, and payment method
  const filteredOrders = mockOrders.filter(order => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filter
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'pending' && order.status === 'Pending') ||
      (activeTab === 'processing' && order.status === 'Processing') ||
      (activeTab === 'shipped' && order.status === 'Shipped') ||
      (activeTab === 'completed' && order.status === 'Completed') ||
      (activeTab === 'cancelled' && order.status === 'Cancelled');
    
    // Date filter
    const orderDate = new Date(order.date);
    const matchesStartDate = startDate === '' || new Date(startDate) <= orderDate;
    const matchesEndDate = endDate === '' || new Date(endDate) >= orderDate;
    
    // Payment filter
    const matchesPayment = paymentFilter === null || order.payment === paymentFilter;
    
    return matchesSearch && matchesTab && matchesStartDate && matchesEndDate && matchesPayment;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'customer':
        aValue = a.customer.name;
        bValue = b.customer.name;
        break;
      case 'total':
        aValue = a.total;
        bValue = b.total;
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
    }
    
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return multiplier * aValue.localeCompare(bValue);
    }
    
    return multiplier * (aValue - bValue);
  });
  
  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: OrderStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Completed':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Processing':
        return `${baseStyles} ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`;
      case 'Pending':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      case 'Shipped':
        return `${baseStyles} ${theme === 'dark' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`;
      case 'Cancelled':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Format date to readable string
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
  
  // View order details
  const viewOrderDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Order Management
        </h1>
        
        <div className="flex items-center gap-2">
          <button className={`
            px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
            ${theme === 'dark' 
              ? 'text-gray-300 hover:bg-gray-800' 
              : 'text-gray-700 hover:bg-gray-100'}
          `}>
            <Download size={16} />
            <span>Export</span>
          </button>
          
          <button className={`
            px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
            bg-indigo-600 hover:bg-indigo-700 text-white
          `}>
            <TrendingUp size={16} />
            <span>Reports</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className={`
        border-b
        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <div className="flex space-x-8">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`
                pb-4 border-b-2 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? theme === 'dark'
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-indigo-600 text-indigo-600'
                  : theme === 'dark'
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
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
            placeholder="Search orders by ID or customer..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Date range */}
        <div className="flex items-center gap-2 md:col-span-4">
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
        
        {/* Payment filter */}
        <div className="relative md:col-span-3">
          <select
            value={paymentFilter || ''}
            onChange={(e) => setPaymentFilter(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Payment Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Apple Pay">Apple Pay</option>
            <option value="Bank Transfer">Bank Transfer</option>
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
      
      {/* Orders table */}
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
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('id')}
                  >
                    <span>Order ID</span>
                    {sortBy === 'id' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('customer')}
                  >
                    <span>Customer</span>
                    {sortBy === 'customer' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('date')}
                  >
                    <span>Date</span>
                    {sortBy === 'date' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Status
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('total')}
                  >
                    <span>Total</span>
                    {sortBy === 'total' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
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
              {sortedOrders.map((order) => (
                <tr 
                  key={order.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Order ID column */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                  `}>
                    {order.id}
                  </td>
                  
                  {/* Customer column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          src={order.customer.avatar} 
                          alt={order.customer.name} 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {order.customer.name}
                        </div>
                        <div className={`
                          text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {order.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Date column */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {formatDate(order.date)}
                  </td>
                  
                  {/* Status column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(order.status as OrderStatus)}>
                      {order.status}
                    </span>
                  </td>
                  
                  {/* Total column */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    ${order.total.toFixed(2)}
                  </td>
                  
                  {/* Actions column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <Printer size={16} />
                      </button>
                      
                      <div className="relative">
                        <button 
                          className={`
                            p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                            ${theme === 'dark' 
                              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                          `}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              
              {sortedOrders.length === 0 && (
                <tr>
                  <td 
                    colSpan={6} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No orders found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order details modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-4xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            max-h-[90vh] overflow-y-auto
          `}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Order {selectedOrder.id}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Placed on {formatDate(selectedOrder.date)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className={`
                    p-1.5 rounded-lg transition-colors inline-flex items-center justify-center
                    ${theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                  `}>
                    <Printer size={18} />
                  </button>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className={`
                      p-1.5 rounded-lg transition-colors inline-flex items-center justify-center
                      ${theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {/* Status badges */}
              <div className="flex gap-3 mt-4">
                <div className={`
                  flex flex-col items-center justify-center p-4 rounded-lg w-full
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <span className={`text-xs uppercase font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status
                  </span>
                  <span className={getStatusBadgeStyles(selectedOrder.status as OrderStatus)}>
                    {selectedOrder.status}
                  </span>
                </div>
                
                <div className={`
                  flex flex-col items-center justify-center p-4 rounded-lg w-full
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <span className={`text-xs uppercase font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Payment
                  </span>
                  <span className={`
                    text-sm font-medium
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                  `}>
                    {selectedOrder.payment}
                  </span>
                </div>
                
                <div className={`
                  flex flex-col items-center justify-center p-4 rounded-lg w-full
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <span className={`text-xs uppercase font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Shipping
                  </span>
                  <span className={`
                    text-sm font-medium
                    ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}
                  `}>
                    {selectedOrder.shipping}
                  </span>
                </div>
                
                <div className={`
                  flex flex-col items-center justify-center p-4 rounded-lg w-full
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <span className={`text-xs uppercase font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total
                  </span>
                  <span className={`
                    text-sm font-bold
                    ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Order timeline */}
              <div className="mt-8">
                <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Order Timeline
                </h4>
                
                <div className="space-y-4">
                  {selectedOrder.timeline.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className="relative flex items-center justify-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${index === 0 
                            ? theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600' 
                            : index === selectedOrder.timeline.length - 1 && event.status !== 'Cancelled'
                              ? theme === 'dark' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              : event.status === 'Cancelled'
                                ? theme === 'dark' ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'
                                : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {event.status === 'Order Placed' ? (
                            <Calendar size={16} />
                          ) : event.status === 'Payment Confirmed' ? (
                            <Check size={16} />
                          ) : event.status === 'Cancelled' ? (
                            <X size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </div>
                        
                        {index < selectedOrder.timeline.length - 1 && (
                          <div className={`
                            absolute top-8 bottom-0 left-4 w-0.5 h-10
                            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
                          `} />
                        )}
                      </div>
                      
                      <div className="ml-4 pb-2">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                          {event.status}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Customer info */}
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Customer Information
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <div className="flex items-center">
                      <img 
                        src={selectedOrder.customer.avatar} 
                        alt={selectedOrder.customer.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedOrder.customer.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedOrder.customer.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Shipping Address
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        123 Main Street
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Apt 4B
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Order Summary
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          ${(selectedOrder.total * 0.9).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Shipping</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          ${(selectedOrder.total * 0.05).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Tax</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          ${(selectedOrder.total * 0.05).toFixed(2)}
                        </span>
                      </div>
                      <div className={`pt-3 mt-3 border-t flex justify-between font-medium ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Total</span>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          ${selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Payment Information
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Method</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedOrder.payment}
                        </span>
                      </div>
                      {selectedOrder.payment === 'Credit Card' && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Card</span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            •••• •••• •••• 4242
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-8 flex justify-end gap-3">
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
                
                {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                  <button
                    className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;