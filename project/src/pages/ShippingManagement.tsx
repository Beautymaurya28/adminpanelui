import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format, parseISO, isToday } from 'date-fns';
import { 
  Search, Filter, Download, Calendar, Eye, 
  Package, Truck, MapPin, CheckCircle, XCircle,
  Clock, ArrowUpRight, RefreshCw, AlertCircle,
  X, ChevronRight, ExternalLink
} from 'lucide-react';

// Mock shipping data
const mockShipments = [
  {
    id: 'SHP-12345',
    orderId: 'ORD-12345',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 234-567-8900',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    courier: {
      name: 'FedEx',
      logo: 'https://i.pravatar.cc/150?img=10',
      trackingId: 'FDX123456789'
    },
    estimatedDelivery: '2025-05-20T14:30:00',
    status: 'In Transit',
    timeline: [
      { status: 'Order Placed', date: '2025-05-15T10:30:00' },
      { status: 'Dispatched', date: '2025-05-16T09:45:00' },
      { status: 'In Transit', date: '2025-05-17T14:20:00' }
    ]
  },
  {
    id: 'SHP-12344',
    orderId: 'ORD-12344',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 234-567-8901',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    courier: {
      name: 'DHL',
      logo: 'https://i.pravatar.cc/150?img=11',
      trackingId: 'DHL987654321'
    },
    estimatedDelivery: '2025-05-19T16:00:00',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Order Placed', date: '2025-05-15T11:20:00' },
      { status: 'Dispatched', date: '2025-05-16T10:15:00' },
      { status: 'In Transit', date: '2025-05-17T08:30:00' },
      { status: 'Out for Delivery', date: '2025-05-18T09:45:00' }
    ]
  },
  {
    id: 'SHP-12343',
    orderId: 'ORD-12343',
    customer: {
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      phone: '+1 234-567-8902',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    address: {
      street: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    courier: {
      name: 'UPS',
      logo: 'https://i.pravatar.cc/150?img=12',
      trackingId: 'UPS456789123'
    },
    estimatedDelivery: '2025-05-18T12:00:00',
    status: 'Delivered',
    timeline: [
      { status: 'Order Placed', date: '2025-05-14T14:20:00' },
      { status: 'Dispatched', date: '2025-05-15T09:30:00' },
      { status: 'In Transit', date: '2025-05-16T11:45:00' },
      { status: 'Out for Delivery', date: '2025-05-17T08:15:00' },
      { status: 'Delivered', date: '2025-05-17T14:30:00' }
    ]
  },
  {
    id: 'SHP-12342',
    orderId: 'ORD-12342',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      phone: '+1 234-567-8903',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    address: {
      street: '321 Maple Lane',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      country: 'USA'
    },
    courier: {
      name: 'FedEx',
      logo: 'https://i.pravatar.cc/150?img=10',
      trackingId: 'FDX987123456'
    },
    estimatedDelivery: '2025-05-17T15:30:00',
    status: 'Failed',
    timeline: [
      { status: 'Order Placed', date: '2025-05-14T16:45:00' },
      { status: 'Dispatched', date: '2025-05-15T10:20:00' },
      { status: 'In Transit', date: '2025-05-16T13:30:00' },
      { status: 'Failed', date: '2025-05-17T09:15:00', notes: 'Address not found' }
    ]
  },
  {
    id: 'SHP-12341',
    orderId: 'ORD-12341',
    customer: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '+1 234-567-8904',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    address: {
      street: '654 Cedar Street',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA'
    },
    courier: {
      name: 'DHL',
      logo: 'https://i.pravatar.cc/150?img=11',
      trackingId: 'DHL456123789'
    },
    estimatedDelivery: '2025-05-19T11:00:00',
    status: 'Not Dispatched',
    timeline: [
      { status: 'Order Placed', date: '2025-05-15T15:30:00' }
    ]
  }
];

// Shipping status type
type ShippingStatus = 'Not Dispatched' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Failed';

interface Shipment {
  id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  courier: {
    name: string;
    logo: string;
    trackingId: string;
  };
  estimatedDelivery: string;
  status: ShippingStatus;
  timeline: Array<{
    status: string;
    date: string;
    notes?: string;
  }>;
}

const ShippingManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  
  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        // In a real app, this would fetch fresh data
        console.log('Auto-refreshing shipping data...');
      }, 60000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);
  
  // Calculate quick stats
  const totalShipments = mockShipments.length;
  const deliveredToday = mockShipments.filter(s => 
    s.status === 'Delivered' && 
    isToday(parseISO(s.timeline[s.timeline.length - 1].date))
  ).length;
  const outForDelivery = mockShipments.filter(s => s.status === 'Out for Delivery').length;
  const failedDeliveries = mockShipments.filter(s => s.status === 'Failed').length;
  
  // Get most used courier
  const courierStats = mockShipments.reduce((acc, s) => {
    acc[s.courier.name] = (acc[s.courier.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCourier = Object.entries(courierStats)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  // Filter shipments
  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = 
      searchTerm === '' || 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.courier.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourier = 
      selectedCourier === null || 
      shipment.courier.name === selectedCourier;
    
    const matchesStatus = 
      selectedStatus === null || 
      shipment.status === selectedStatus;
    
    const shipmentDate = parseISO(shipment.timeline[0].date);
    const matchesStartDate = startDate === '' || parseISO(startDate) <= shipmentDate;
    const matchesEndDate = endDate === '' || parseISO(endDate) >= shipmentDate;
    
    return matchesSearch && matchesCourier && matchesStatus && matchesStartDate && matchesEndDate;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, h:mm a');
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: ShippingStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Not Dispatched':
        return `${baseStyles} ${theme === 'dark' ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-600'}`;
      case 'Dispatched':
        return `${baseStyles} ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`;
      case 'In Transit':
        return `${baseStyles} ${theme === 'dark' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`;
      case 'Out for Delivery':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`;
      case 'Delivered':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`;
      case 'Failed':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-600'}`;
      default:
        return baseStyles;
    }
  };
  
  // Get timeline status icon
  const getTimelineStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return <Package size={16} />;
      case 'Dispatched':
        return <Truck size={16} />;
      case 'In Transit':
        return <RefreshCw size={16} />;
      case 'Out for Delivery':
        return <MapPin size={16} />;
      case 'Delivered':
        return <CheckCircle size={16} />;
      case 'Failed':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Shipping Overview
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Track and manage all shipping details
          </p>
        </div>
        
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
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`
              px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
              ${autoRefresh
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
            <span>{autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}</span>
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Shipments */}
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
                Total Shipments
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalShipments}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                All time
              </p>
            </div>
          </div>
        </div>
        
        {/* Delivered Today */}
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
              <CheckCircle size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Delivered Today
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {deliveredToday}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Last 24 hours
              </p>
            </div>
          </div>
        </div>
        
        {/* Out for Delivery */}
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
              <Truck size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Out for Delivery
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {outForDelivery}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Active deliveries
              </p>
            </div>
          </div>
        </div>
        
        {/* Failed Deliveries */}
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
              <AlertCircle size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Failed Deliveries
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {failedDeliveries}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Needs attention
              </p>
            </div>
          </div>
        </div>
        
        {/* Top Courier */}
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
              <ArrowUpRight size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Top Courier
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {topCourier}
              </h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Most shipments
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
            placeholder="Search by ID, order, or customer..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Courier filter */}
        <div className="relative md:col-span-2">
          <select
            value={selectedCourier || ''}
            onChange={(e) => setSelectedCourier(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Couriers</option>
            <option value="FedEx">FedEx</option>
            <option value="DHL">DHL</option>
            <option value="UPS">UPS</option>
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
            <option value="Not Dispatched">Not Dispatched</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
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
      
      {/* Shipments Table */}
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
                  Shipment ID
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
                  Shipping Address
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Courier
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Est. Delivery
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
              {filteredShipments.map((shipment) => (
                <tr 
                  key={shipment.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Shipment ID */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                  `}>
                    {shipment.id}
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {shipment.orderId}
                    </p>
                  </td>
                  
                  {/* Customer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          src={shipment.customer.avatar} 
                          alt={shipment.customer.name} 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {shipment.customer.name}
                        </div>
                        <div className={`
                          text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {shipment.customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Address */}
                  <td className={`
                    px-6 py-4 text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="max-w-xs truncate" title={`${shipment.address.street}, ${shipment.address.city}, ${shipment.address.state} ${shipment.address.zip}`}>
                      {shipment.address.street}, {shipment.address.city}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {shipment.address.state}, {shipment.address.zip}
                    </div>
                  </td>
                  
                  {/* Courier */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          src={shipment.courier.logo} 
                          alt={shipment.courier.name} 
                          className="h-8 w-8 rounded-lg object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-3">
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {shipment.courier.name}
                        </div>
                        <div className={`
                          text-xs
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          {shipment.courier.trackingId}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Estimated Delivery */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {formatDate(shipment.estimatedDelivery)}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(shipment.status as ShippingStatus)}>
                      {shipment.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <a 
                        href={`https://example.com/track/${shipment.courier.trackingId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <ExternalLink size={16} />
                      </a>
                      
                      <button 
                        onClick={() => {
                          setSelectedShipment(shipment);
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
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredShipments.length === 0 && (
                <tr>
                  <td 
                    colSpan={7} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No shipments found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Shipment Details Modal */}
      {isDetailsModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-4xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Shipment Details
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedShipment.id}
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
              
              <div className="grid grid-cols-2 gap-6">
                {/* Shipment Info */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Shipment Information
                  </h4>
                  
                  <div className={`
                    p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                  `}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Status</span>
                        <span className={getStatusBadgeStyles(selectedShipment.status as ShippingStatus)}>
                          {selectedShipment.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Order ID</span>
                        <span className={`
                          ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                        `}>
                          {selectedShipment.orderId}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Courier</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedShipment.courier.name}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Tracking ID</span>
                        <a
                          href={`https://example.com/track/${selectedShipment.courier.trackingId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            flex items-center
                            ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}
                          `}
                        >
                          {selectedShipment.courier.trackingId}
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Est. Delivery</span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(selectedShipment.estimatedDelivery)}
                        </span>
                      </div>
                    </div>
                    
                    {selectedShipment.status !== 'Delivered' && selectedShipment.status !== 'Failed' && (
                      <div className={`pt-4 mt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Update Status
                        </label>
                        <select
                          className={`
                            w-full px-3 py-2 rounded-lg text-sm mb-2
                            ${theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'}
                            border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          `}
                        >
                          <option value="">Select new status...</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Failed">Failed</option>
                        </select>
                        <textarea
                          value={statusUpdateNote}
                          onChange={(e) => setStatusUpdateNote(e.target.value)}
                          placeholder="Add notes about the status update..."
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
                        src={selectedShipment.customer.avatar} 
                        alt={selectedShipment.customer.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedShipment.customer.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedShipment.customer.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`pt-4 mt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Shipping Address
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedShipment.address.street}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedShipment.address.city}, {selectedShipment.address.state} {selectedShipment.address.zip}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedShipment.address.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-6">
                <h4 className={`text-sm font-semibold uppercase mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Shipping Timeline
                </h4>
                
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="space-y-4">
                    {selectedShipment.timeline.map((event, index) => (
                      <div key={index} className="flex">
                        <div className="relative flex items-center justify-center">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${index === 0 
                              ? theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600' 
                              : index === selectedShipment.timeline.length - 1 && event.status !== 'Failed'
                                ? theme === 'dark' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                                : event.status === 'Failed'
                                  ? theme === 'dark' ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'
                                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            {getTimelineStatusIcon(event.status)}
                          </div>
                          
                          {index < selectedShipment.timeline.length - 1 && (
                            <div className={`
                              absolute top-8 bottom-0 left-4 w-px h-10
                              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
                            `} />
                          )}
                        </div>
                        
                        <div className="ml-4 pb-6">
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            {event.status}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(event.date)}
                          </p>
                          {event.notes && (
                            <p className={`
                              mt-1 text-sm
                              ${theme === 'dark' 
                                ? event.status === 'Failed' ? 'text-rose-400' : 'text-gray-400'
                                : event.status === 'Failed' ? 'text-rose-600' : 'text-gray-500'}
                            `}>
                              {event.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
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
                
                {selectedShipment.status !== 'Delivered' && selectedShipment.status !== 'Failed' && (
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

export default ShippingManagement;