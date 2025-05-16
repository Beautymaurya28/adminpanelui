import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, Download, Calendar, Eye, 
  CreditCard, Wallet, RefreshCcw, Ban,
  ArrowUpRight, ArrowDownRight, DollarSign, 
  CheckCircle, XCircle, Clock, RotateCcw
} from 'lucide-react';

// Mock transaction data
const mockTransactions = [
  {
    id: 'TXN-12345',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    paymentMethod: 'FreeCash',
    date: '2025-05-15T10:30:00',
    amount: 289.99,
    status: 'Success',
    orderId: 'ORD-12345',
    notes: ''
  },
  {
    id: 'TXN-12344',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    paymentMethod: 'Razorpay',
    date: '2025-05-15T09:45:00',
    amount: 549.50,
    status: 'Pending',
    orderId: 'ORD-12344',
    notes: 'Payment verification in progress'
  },
  {
    id: 'TXN-12343',
    customer: {
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    paymentMethod: 'FreeCash',
    date: '2025-05-15T08:20:00',
    amount: 129.99,
    status: 'Failed',
    orderId: 'ORD-12343',
    notes: 'Insufficient funds'
  },
  {
    id: 'TXN-12342',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    paymentMethod: 'Razorpay',
    date: '2025-05-14T16:30:00',
    amount: 79.99,
    status: 'Refunded',
    orderId: 'ORD-12342',
    notes: 'Customer requested refund'
  },
  {
    id: 'TXN-12341',
    customer: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    paymentMethod: 'FreeCash',
    date: '2025-05-14T14:15:00',
    amount: 349.75,
    status: 'Success',
    orderId: 'ORD-12341',
    notes: ''
  }
];

// Mock refund requests
const mockRefundRequests = [
  {
    id: 'REF-12345',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    orderId: 'ORD-12342',
    amount: 79.99,
    reason: 'Product not as described',
    status: 'Pending',
    date: '2025-05-14T17:30:00'
  },
  {
    id: 'REF-12344',
    customer: {
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    orderId: 'ORD-12340',
    amount: 149.99,
    reason: 'Wrong size delivered',
    status: 'Approved',
    date: '2025-05-14T15:45:00'
  },
  {
    id: 'REF-12343',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    orderId: 'ORD-12339',
    amount: 99.99,
    reason: 'Changed mind',
    status: 'Rejected',
    date: '2025-05-14T14:20:00'
  }
];

// Transaction status type
type TransactionStatus = 'Success' | 'Failed' | 'Pending' | 'Refunded';
type RefundStatus = 'Pending' | 'Approved' | 'Rejected';

interface Transaction {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  paymentMethod: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  orderId: string;
  notes: string;
}

interface RefundRequest {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  orderId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  date: string;
}

const PaymentManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isRefundDrawerOpen, setIsRefundDrawerOpen] = useState(false);
  const [refundNote, setRefundNote] = useState('');
  const [selectedRefundStatus, setSelectedRefundStatus] = useState<string | null>(null);
  
  // Calculate quick stats
  const totalRevenue = mockTransactions
    .filter(t => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pendingAmount = mockTransactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const refundedAmount = mockTransactions
    .filter(t => t.status === 'Refunded')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Get payment method distribution
  const paymentMethodStats = mockTransactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedPaymentMethod = Object.entries(paymentMethodStats)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      searchTerm === '' || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = 
      selectedPaymentMethod === null || 
      transaction.paymentMethod === selectedPaymentMethod;
    
    const matchesStatus = 
      selectedStatus === null || 
      transaction.status === selectedStatus;
    
    const transactionDate = new Date(transaction.date);
    const matchesStartDate = startDate === '' || new Date(startDate) <= transactionDate;
    const matchesEndDate = endDate === '' || new Date(endDate) >= transactionDate;
    
    return matchesSearch && matchesPaymentMethod && matchesStatus && matchesStartDate && matchesEndDate;
  });
  
  // Filter refund requests
  const filteredRefundRequests = mockRefundRequests.filter(request => {
    return selectedRefundStatus === null || request.status === selectedRefundStatus;
  });
  
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
  
  // Get status badge style
  const getStatusBadgeStyles = (status: TransactionStatus | RefundStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Success':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Failed':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      case 'Pending':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      case 'Refunded':
        return `${baseStyles} ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`;
      case 'Approved':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Rejected':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      default:
        return baseStyles;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Payment Transactions
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
          
          <button 
            onClick={() => setIsRefundDrawerOpen(true)}
            className={`
              px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
              bg-indigo-600 hover:bg-indigo-700 text-white
            `}
          >
            <RefreshCcw size={16} />
            <span>Refund Requests</span>
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
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
              <ArrowUpRight size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Revenue
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${totalRevenue.toFixed(2)}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Last 30 days
              </p>
            </div>
          </div>
        </div>
        
        {/* Pending Amount */}
        <div className={`
          rounded-xl p-5 shadow-sm border overflow-hidden relative group
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}
          backdrop-blur-sm transition-all duration-300 hover:shadow-md
        `}>
          <div className={`
            absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 group-hover:scale-150
            transition-transform duration-500 ease-out bg-amber-500/30
          `} />
          
          <div className="relative z-10">
            <div className={`
              p-3 rounded-lg inline-block
              ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}
            `}>
              <Clock size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Pending Amount
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${pendingAmount.toFixed(2)}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Awaiting confirmation
              </p>
            </div>
          </div>
        </div>
        
        {/* Most Used Payment */}
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
              <Wallet size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Popular Payment
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mostUsedPaymentMethod}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Most used method
              </p>
            </div>
          </div>
        </div>
        
        {/* Refunded Amount */}
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
              <RotateCcw size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Refunded
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${refundedAmount.toFixed(2)}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Total refunds
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
            placeholder="Search transactions..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Payment Method filter */}
        <div className="relative md:col-span-2">
          <select
            value={selectedPaymentMethod || ''}
            onChange={(e) => setSelectedPaymentMethod(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Methods</option>
            <option value="FreeCash">FreeCash</option>
            <option value="Razorpay">Razorpay</option>
          </select>
          <Filter 
            size={16} 
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
              ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
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
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
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
        <div className="flex items-center gap-2 md:col-span-3">
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
      
      {/* Transactions Table */}
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
                  Transaction ID
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
                  Payment Method
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Date
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Amount
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
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Transaction ID */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                  `}>
                    {transaction.id}
                  </td>
                  
                  {/* Customer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          src={transaction.customer.avatar} 
                          alt={transaction.customer.name} 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {transaction.customer.name}
                        </div>
                        <div className={`
                          text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {transaction.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Payment Method */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <CreditCard size={16} className="mr-2" />
                      {transaction.paymentMethod}
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {formatDate(transaction.date)}
                  </td>
                  
                  {/* Amount */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(transaction.status as TransactionStatus)}>
                      {transaction.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setIsTransactionModalOpen(true);
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
                  </td>
                </tr>
              ))}
              
              {filteredTransactions.length === 0 && (
                
                <tr>
                  <td 
                    colSpan={7} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No transactions found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Transaction Details Modal */}
      {isTransactionModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-2xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Transaction Details
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedTransaction.id}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsTransactionModalOpen(false)}
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
              
              <div className="grid grid-cols-2 gap-6">
                {/* Transaction Info */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Transaction Information
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Status</span>
                        <span className={getStatusBadgeStyles(selectedTransaction.status as TransactionStatus)}>
                          {selectedTransaction.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Amount</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          ${selectedTransaction.amount.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Payment Method</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedTransaction.paymentMethod}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Date</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(selectedTransaction.date)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Order ID</span>
                        <span className={`
                          ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                        `}>
                          {selectedTransaction.orderId}
                        </span>
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
                    <div className="flex items-center mb-4">
                      <img 
                        src={selectedTransaction.customer.avatar} 
                        alt={selectedTransaction.customer.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.customer.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedTransaction.customer.email}
                        </p>
                      </div>
                    </div>
                    
                    {selectedTransaction.status !== 'Refunded' && (
                      <div className={`pt-4 mt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Refund Notes
                        </label>
                        <textarea
                          value={refundNote}
                          onChange={(e) => setRefundNote(e.target.value)}
                          placeholder="Enter reason for refund..."
                          className={`
                            w-full px-3 py-2 rounded-lg text-sm
                            ${theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                            border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          `}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsTransactionModalOpen(false)}
                  className={`
                    px-4 py-2 rounded-lg text-sm
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  Close
                </button>
                
                {selectedTransaction.status !== 'Refunded' && (
                  <button
                    className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Mark as Refunded
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Refund Requests Drawer */}
      {isRefundDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsRefundDrawerOpen(false)} />
          
          <div className={`
            absolute inset-y-0 right-0 w-full max-w-2xl overflow-y-auto
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            transform transition-transform duration-300 ease-in-out
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Refund Requests
                </h3>
                
                <button
                  onClick={() => setIsRefundDrawerOpen(false)}
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
              
              {/* Status filter */}
              <div className="mb-6">
                <select
                  value={selectedRefundStatus || ''}
                  onChange={(e) => setSelectedRefundStatus(e.target.value || null)}
                  className={`
                    w-full px-3 py-2 rounded-lg appearance-none text-sm
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                      : 'bg-white text-gray-700 border border-gray-200'}
                  `}
                >
                  <option value="">All Requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              {/* Refund requests list */}
              <div className="space-y-4">
                {filteredRefundRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`
                      p-4 rounded-lg border
                      ${theme === 'dark' 
                        ? 'bg-gray-700/50 border-gray-700' 
                        : 'bg-white border-gray-200'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img 
                          src={request.customer.avatar} 
                          alt={request.customer.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {request.customer.name}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {request.orderId}
                          </p>
                        </div>
                      </div>
                      
                      <span className={getStatusBadgeStyles(request.status)}>
                        {request.status}
                      </span>
                    </div>
                    
                    <div className={`
                      p-3 rounded-lg mb-3
                      ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}
                    `}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {request.reason}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Amount:
                        </span>
                        <span className={`
                          ml-2 font-medium
                          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                        `}>
                          ${request.amount.toFixed(2)}
                        </span>
                      </div>
                      
                      {request.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button className={`
                            px-3 py-1 rounded text-sm
                            ${theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}>
                            Reject
                          </button>
                          <button className="px-3 py-1 rounded text-sm bg-indigo-600 text-white hover:bg-indigo-700">
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredRefundRequests.length === 0 && (
                  <div className={`
                    p-8 text-center rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      No refund requests found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;