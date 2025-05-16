import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format, addDays, isAfter, isBefore, differenceInDays } from 'date-fns';
import { 
  Search, Filter, Plus, Edit, Trash2, Copy,
  Calendar, Percent, DollarSign, Tag, X,
  ShoppingBag, RefreshCw, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock coupon data
const mockCoupons = [
  {
    id: 'COUP001',
    code: 'SUMMER2025',
    type: 'percentage',
    value: 20,
    validFrom: '2025-05-01T00:00:00',
    validTill: '2025-05-31T23:59:59',
    minPurchase: 1000,
    maxDiscount: 500,
    usageLimit: 100,
    usageCount: 45,
    status: 'Active',
    applicableProducts: ['all'],
    applicableCategories: ['all']
  },
  {
    id: 'COUP002',
    code: 'NEWUSER50',
    type: 'fixed',
    value: 500,
    validFrom: '2025-05-15T00:00:00',
    validTill: '2025-06-15T23:59:59',
    minPurchase: 2000,
    maxDiscount: 500,
    usageLimit: 50,
    usageCount: 12,
    status: 'Active',
    applicableProducts: ['electronics', 'fashion'],
    applicableCategories: ['electronics', 'fashion']
  },
  {
    id: 'COUP003',
    code: 'FLASH25',
    type: 'percentage',
    value: 25,
    validFrom: '2025-05-10T00:00:00',
    validTill: '2025-05-12T23:59:59',
    minPurchase: 500,
    maxDiscount: 200,
    usageLimit: 200,
    usageCount: 198,
    status: 'Expired',
    applicableProducts: ['all'],
    applicableCategories: ['all']
  },
  {
    id: 'COUP004',
    code: 'WELCOME100',
    type: 'fixed',
    value: 100,
    validFrom: '2025-06-01T00:00:00',
    validTill: '2025-06-30T23:59:59',
    minPurchase: 500,
    maxDiscount: 100,
    usageLimit: 1000,
    usageCount: 0,
    status: 'Upcoming',
    applicableProducts: ['all'],
    applicableCategories: ['all']
  }
];

// Types
type DiscountType = 'percentage' | 'fixed';
type CouponStatus = 'Active' | 'Expired' | 'Upcoming';

interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  validFrom: string;
  validTill: string;
  minPurchase: number;
  maxDiscount: number;
  usageLimit: number;
  usageCount: number;
  status: CouponStatus;
  applicableProducts: string[];
  applicableCategories: string[];
}

const CouponManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [newCouponCode, setNewCouponCode] = useState('');
  
  // Filter coupons
  const filteredCoupons = mockCoupons.filter(coupon => {
    const matchesSearch = 
      searchTerm === '' || 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || coupon.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Generate random coupon code
  const generateCouponCode = () => {
    const prefix = 'PROMO';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp.slice(-3)}${random}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: CouponStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Active':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Expired':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      case 'Upcoming':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Get countdown badge
  const getCountdownBadge = (validTill: string) => {
    const today = new Date();
    const endDate = new Date(validTill);
    const daysLeft = differenceInDays(endDate, today);
    
    if (daysLeft <= 0) return null;
    if (daysLeft <= 3) {
      return (
        <span className={`
          ml-2 px-2 py-0.5 rounded text-xs font-medium
          ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}
        `}>
          {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left
        </span>
      );
    }
    return null;
  };
  
  // Handle copy to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard!');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Coupons & Discounts
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Create, manage and track promotional offers
          </p>
        </div>
        
        <button 
          onClick={() => {
            setSelectedCoupon(null);
            setIsAddModalOpen(true);
          }}
          className={`
            px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
            bg-indigo-600 hover:bg-indigo-700 text-white
          `}
        >
          <Plus size={16} />
          <span>Add Coupon</span>
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg md:col-span-8
          ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
        `}>
          <Search size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coupons..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Status filter */}
        <div className="relative md:col-span-4">
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
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Upcoming">Upcoming</option>
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
      
      {/* Coupons Table */}
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
                  Coupon Code
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Discount
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Valid Period
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Min. Purchase
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Usage
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
              {filteredCoupons.map((coupon) => (
                <tr 
                  key={coupon.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                    ${coupon.status === 'Expired' ? 'opacity-60' : ''}
                  `}
                >
                  {/* Coupon Code */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`
                        p-1.5 rounded-lg mr-3
                        ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                      `}>
                        <Tag size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                      <div>
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {coupon.code}
                        </div>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className={`
                            text-xs flex items-center gap-1
                            ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}
                          `}
                        >
                          <Copy size={12} />
                          <span>Copy code</span>
                        </button>
                      </div>
                    </div>
                  </td>
                  
                  {/* Discount */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      {coupon.type === 'percentage' ? (
                        <Percent size={16} className="mr-1" />
                      ) : (
                        <DollarSign size={16} className="mr-1" />
                      )}
                      <span>{coupon.value}</span>
                      <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {coupon.type === 'percentage' ? '%' : 'off'}
                      </span>
                    </div>
                    {coupon.maxDiscount > 0 && (
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Max: ₹{coupon.maxDiscount}
                      </div>
                    )}
                  </td>
                  
                  {/* Valid Period */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <div>
                        <div>{formatDate(coupon.validFrom)}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          to {formatDate(coupon.validTill)}
                        </div>
                      </div>
                    </div>
                    {coupon.status === 'Active' && getCountdownBadge(coupon.validTill)}
                  </td>
                  
                  {/* Min Purchase */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <ShoppingBag size={16} className="mr-2" />
                      ₹{coupon.minPurchase}
                    </div>
                  </td>
                  
                  {/* Usage */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <RefreshCw size={16} className="mr-2" />
                      {coupon.usageCount} / {coupon.usageLimit}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {((coupon.usageCount / coupon.usageLimit) * 100).toFixed(0)}% used
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(coupon.status as CouponStatus)}>
                      {coupon.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setIsAddModalOpen(true);
                        }}
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setIsDeleteModalOpen(true);
                        }}
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCoupons.length === 0 && (
                <tr>
                  <td 
                    colSpan={7} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No coupons found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add/Edit Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-2xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                </h3>
                
                <button
                  onClick={() => setIsAddModalOpen(false)}
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
                {/* Coupon Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedCoupon?.code || newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g., SUMMER2025"
                      className={`
                        flex-1 px-3 py-2 rounded-lg text-sm font-mono
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                        border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      `}
                    />
                    <button
                      onClick={() => setNewCouponCode(generateCouponCode())}
                      className={`
                        px-3 py-2 rounded-lg text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      Generate
                    </button>
                  </div>
                </div>
                
                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Discount Type
                    </label>
                    <select
                      defaultValue={selectedCoupon?.type || 'percentage'}
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'}
                        border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      `}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Discount Value
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCoupon?.value}
                      placeholder="e.g., 20"
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                        border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      `}
                    />
                  </div>
                </div>
                
                {/* Valid Period */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Valid From
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedCoupon?.validFrom.split('T')[0]}
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
                      Valid Till
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedCoupon?.validTill.split('T')[0]}
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
                
                {/* Purchase Limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Minimum Purchase (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCoupon?.minPurchase}
                      placeholder="e.g., 1000"
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                        border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      `}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCoupon?.maxDiscount}
                      placeholder="e.g., 500"
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-700  border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                        border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      `}
                    />
                  </div>
                </div>
                
                {/* Usage Limit */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedCoupon?.usageLimit}
                    placeholder="e.g., 100"
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  />
                </div>
                
                {/* Applicable Products/Categories */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Applicable Categories
                  </label>
                  <select
                    multiple
                    defaultValue={selectedCoupon?.applicableCategories || ['all']}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Living</option>
                  </select>
                  <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Hold Ctrl/Cmd to select multiple categories
                  </p>
                </div>
                
                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    defaultValue={selectedCoupon?.status || 'Active'}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
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
                    setIsAddModalOpen(false);
                    toast.success(
                      selectedCoupon 
                        ? 'Coupon updated successfully!' 
                        : 'New coupon created successfully!'
                    );
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {selectedCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCoupon && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-md rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className={`text-lg font-semibold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Delete Coupon
              </h3>
              
              <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete the coupon <span className="font-medium">{selectedCoupon.code}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
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
                    setIsDeleteModalOpen(false);
                    toast.success('Coupon deleted successfully!');
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;