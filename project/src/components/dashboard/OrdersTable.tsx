import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, ArrowUp, ArrowDown } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  {
    id: '#ORD-12345',
    customer: 'John Smith',
    date: '2025-05-15T10:30:00',
    status: 'Completed',
    total: 289.99,
    payment: 'Credit Card'
  },
  {
    id: '#ORD-12344',
    customer: 'Sarah Johnson',
    date: '2025-05-15T09:45:00',
    status: 'Processing',
    total: 549.50,
    payment: 'PayPal'
  },
  {
    id: '#ORD-12343',
    customer: 'Michael Davis',
    date: '2025-05-15T08:20:00',
    status: 'Pending',
    total: 129.99,
    payment: 'Credit Card'
  },
  {
    id: '#ORD-12342',
    customer: 'Emily Brown',
    date: '2025-05-14T16:30:00',
    status: 'Completed',
    total: 79.99,
    payment: 'Apple Pay'
  },
  {
    id: '#ORD-12341',
    customer: 'Robert Wilson',
    date: '2025-05-14T14:15:00',
    status: 'Cancelled',
    total: 349.75,
    payment: 'Bank Transfer'
  }
];

// Type for sort direction
type SortDirection = 'asc' | 'desc' | null;

// Type for order status
type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Cancelled';

const OrdersTable: React.FC = () => {
  const { theme } = useTheme();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Function to handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Function to get sorted data
  const getSortedData = () => {
    if (!sortField || !sortDirection) {
      return mockOrders;
    }
    
    return [...mockOrders].sort((a, b) => {
      // Get values to compare based on field
      const valueA = a[sortField as keyof typeof a];
      const valueB = b[sortField as keyof typeof b];
      
      // Compare based on direction
      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };
  
  // Get status styling based on order status
  const getStatusStyles = (status: OrderStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Completed':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Processing':
        return `${baseStyles} ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`;
      case 'Pending':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
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
  
  // Table header component
  const TableHeader: React.FC<{ field: string, label: string }> = ({ field, label }) => {
    const isSorted = sortField === field;
    
    return (
      <th className={`
        px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer
        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
      `}
      onClick={() => handleSort(field)}
      >
        <div className="flex items-center">
          <span>{label}</span>
          <span className="ml-1">
            {isSorted ? (
              sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
            ) : (
              <div className="w-3.5"></div> // Empty space to maintain alignment
            )}
          </span>
        </div>
      </th>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className={`
          ${theme === 'dark' ? 'bg-gray-700/20' : 'bg-gray-50'}
        `}>
          <tr>
            <TableHeader field="id" label="Order ID" />
            <TableHeader field="customer" label="Customer" />
            <TableHeader field="date" label="Date" />
            <TableHeader field="status" label="Status" />
            <TableHeader field="total" label="Total" />
            <TableHeader field="payment" label="Payment" />
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
          {getSortedData().map((order) => (
            <tr 
              key={order.id}
              className={`
                transition-colors hover:bg-opacity-50
                ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
              `}
            >
              <td className={`
                px-6 py-4 whitespace-nowrap text-sm font-medium
                ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
              `}>
                {order.id}
              </td>
              <td className={`
                px-6 py-4 whitespace-nowrap text-sm
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
              `}>
                {order.customer}
              </td>
              <td className={`
                px-6 py-4 whitespace-nowrap text-sm
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {formatDate(order.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusStyles(order.status as OrderStatus)}>
                  {order.status}
                </span>
              </td>
              <td className={`
                px-6 py-4 whitespace-nowrap text-sm font-medium
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
              `}>
                ${order.total.toFixed(2)}
              </td>
              <td className={`
                px-6 py-4 whitespace-nowrap text-sm
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {order.payment}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button className={`
                  p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                  ${theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                `}>
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;