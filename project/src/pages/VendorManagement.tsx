import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye,
  Store, Mail, Ban, Star, MessageSquare,
  ChevronRight, X, DollarSign, Package,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

// Mock vendor data
const mockVendors = [
  {
    id: 'VEN001',
    name: 'TechGear Solutions',
    logo: 'https://i.pravatar.cc/150?img=1',
    email: 'contact@techgear.com',
    phone: '+1 234-567-8900',
    products: 156,
    totalSales: 289999,
    rating: 4.5,
    status: 'Active',
    joinedDate: '2024-01-15T10:30:00',
    address: {
      street: '123 Tech Street',
      city: 'Silicon Valley',
      state: 'CA',
      zip: '94025'
    }
  },
  {
    id: 'VEN002',
    name: 'Fashion Forward',
    logo: 'https://i.pravatar.cc/150?img=2',
    email: 'sales@fashionforward.com',
    phone: '+1 234-567-8901',
    products: 342,
    totalSales: 549500,
    rating: 4.2,
    status: 'Active',
    joinedDate: '2024-02-01T09:45:00',
    address: {
      street: '456 Fashion Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    }
  },
  {
    id: 'VEN003',
    name: 'Home Essentials',
    logo: 'https://i.pravatar.cc/150?img=3',
    email: 'support@homeessentials.com',
    phone: '+1 234-567-8902',
    products: 89,
    totalSales: 129990,
    rating: 4.8,
    status: 'Active',
    joinedDate: '2024-01-20T08:20:00',
    address: {
      street: '789 Home Blvd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    }
  },
  {
    id: 'VEN004',
    name: 'Sports World',
    logo: 'https://i.pravatar.cc/150?img=4',
    email: 'info@sportsworld.com',
    phone: '+1 234-567-8903',
    products: 245,
    totalSales: 79990,
    rating: 4.0,
    status: 'Banned',
    joinedDate: '2024-01-10T16:30:00',
    address: {
      street: '321 Sports Center',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001'
    }
  },
  {
    id: 'VEN005',
    name: 'Beauty & Beyond',
    logo: 'https://i.pravatar.cc/150?img=5',
    email: 'care@beautybeyond.com',
    phone: '+1 234-567-8904',
    products: 178,
    totalSales: 349750,
    rating: 4.6,
    status: 'Active',
    joinedDate: '2024-02-05T14:15:00',
    address: {
      street: '654 Beauty Lane',
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    }
  }
];

// Types
type VendorStatus = 'Active' | 'Banned';

interface Vendor {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  products: number;
  totalSales: number;
  rating: number;
  status: VendorStatus;
  joinedDate: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

const VendorManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Filter vendors
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = 
      searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || vendor.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'products':
        comparison = a.products - b.products;
        break;
      case 'sales':
        comparison = a.totalSales - b.totalSales;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
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
  const getStatusBadgeStyles = (status: VendorStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Active':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Banned':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star size={16} className="text-amber-400 fill-amber-400" />
        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Vendors
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage seller accounts and monitor vendor activities
          </p>
        </div>
        
        <button className={`
          px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
          bg-indigo-600 hover:bg-indigo-700 text-white
        `}>
          <Plus size={16} />
          <span>Add Vendor</span>
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
            placeholder="Search vendors..."
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
            <option value="Banned">Banned</option>
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
      
      {/* Vendors Table */}
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
                    onClick={() => {
                      if (sortBy === 'name') {
                        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('name');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <span>Vendor</span>
                    {sortBy === 'name' && (
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
                    onClick={() => {
                      if (sortBy === 'products') {
                        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('products');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <span>Products</span>
                    {sortBy === 'products' && (
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
                    onClick={() => {
                      if (sortBy === 'sales') {
                        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('sales');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <span>Total Sales</span>
                    {sortBy === 'sales' && (
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
                    onClick={() => {
                      if (sortBy === 'rating') {
                        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('rating');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <span>Rating</span>
                    {sortBy === 'rating' && (
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
              {sortedVendors.map((vendor) => (
                <tr 
                  key={vendor.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Vendor Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          src={vendor.logo} 
                          alt={vendor.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {vendor.name}
                        </div>
                        <div className={`
                          text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {vendor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Products */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <Package size={16} className="mr-2" />
                      {vendor.products}
                    </div>
                  </td>
                  
                  {/* Total Sales */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      {formatCurrency(vendor.totalSales)}
                    </div>
                  </td>
                  
                  {/* Rating */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStarRating(vendor.rating)}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(vendor.status as VendorStatus)}>
                      {vendor.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedVendor(vendor);
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
                      
                      <button 
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
                          setSelectedVendor(vendor);
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
              
              {sortedVendors.length === 0 && (
                <tr>
                  <td 
                    colSpan={6} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No vendors found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Vendor Details Modal */}
      {isDetailsModalOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-4xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedVendor.logo} 
                    alt={selectedVendor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedVendor.name}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Joined {formatDate(selectedVendor.joinedDate)}
                    </p>
                  </div>
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
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Products
                    </span>
                    <Package size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <p className={`text-2xl font-semibold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedVendor.products}
                  </p>
                </div>
                
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Sales
                    </span>
                    <ShoppingCart size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <p className={`text-2xl font-semibold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(selectedVendor.totalSales)}
                  </p>
                </div>
                
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Rating
                    </span>
                    <Star size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <div className="mt-2">
                    {renderStarRating(selectedVendor.rating)}
                  </div>
                </div>
                
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Status
                    </span>
                    <Store size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <div className="mt-2">
                    <span className={getStatusBadgeStyles(selectedVendor.status as VendorStatus)}>
                      {selectedVendor.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Contact & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Contact Information
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg space-y-3
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {selectedVendor.email}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Store size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {selectedVendor.phone}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Business Address
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {selectedVendor.address.street}
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {selectedVendor.address.city}, {selectedVendor.address.state} {selectedVendor.address.zip}
                    </p>
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
                
                <button
                  className={`
                    px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  <MessageSquare size={16} />
                  <span>Message</span>
                </button>
                
                {selectedVendor.status === 'Active' ? (
                  <button
                    className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-2"
                  >
                    <Ban size={16} />
                    <span>Suspend Account</span>
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2"
                  >
                    <ChevronRight size={16} />
                    <span>Reactivate Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedVendor && (
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
                Delete Vendor
              </h3>
              
              <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete <span className="font-medium">{selectedVendor.name}</span>? This action cannot be undone.
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
                    toast.success('Vendor deleted successfully!');
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

export default VendorManagement;