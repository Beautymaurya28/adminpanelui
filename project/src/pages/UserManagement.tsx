import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, Plus, MoreHorizontal, Edit, Trash2, 
  UserPlus, Download, Upload, Mail, LogIn
} from 'lucide-react';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2025-05-14T18:30:00',
    orders: 15
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Customer',
    status: 'Active',
    lastLogin: '2025-05-15T09:45:00',
    orders: 8
  },
  {
    id: 3,
    name: 'Michael Davis',
    email: 'michael.davis@example.com',
    role: 'Customer',
    status: 'Inactive',
    lastLogin: '2025-05-10T14:20:00',
    orders: 3
  },
  {
    id: 4,
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    role: 'Manager',
    status: 'Active', 
    lastLogin: '2025-05-15T11:30:00',
    orders: 0
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    role: 'Customer',
    status: 'Blocked',
    lastLogin: '2025-05-01T10:15:00',
    orders: 12
  },
  {
    id: 6,
    name: 'Jessica Lee',
    email: 'jessica.lee@example.com',
    role: 'Customer',
    status: 'Active',
    lastLogin: '2025-05-14T16:20:00',
    orders: 6
  },
  {
    id: 7,
    name: 'Daniel Taylor',
    email: 'daniel.taylor@example.com',
    role: 'Support',
    status: 'Active',
    lastLogin: '2025-05-15T08:45:00',
    orders: 0
  },
  {
    id: 8,
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    role: 'Customer',
    status: 'Active',
    lastLogin: '2025-05-12T13:10:00',
    orders: 4
  }
];

// User type and status interfaces
type UserRole = 'Admin' | 'Manager' | 'Customer' | 'Support';
type UserStatus = 'Active' | 'Inactive' | 'Blocked';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  orders: number;
}

const UserManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  
  const itemsPerPage = 5;
  
  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = selectedRole === null || user.role === selectedRole;
    
    // Status filter
    const matchesStatus = selectedStatus === null || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  // Handle user selection (checkbox)
  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  // Handle select all users
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };
  
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
  
  // Get role badge style
  const getRoleBadgeStyles = (role: UserRole) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (role) {
      case 'Admin':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      case 'Manager':
        return `${baseStyles} ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`;
      case 'Customer':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Support':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Get status indicator style
  const getStatusStyles = (status: UserStatus) => {
    const baseStyles = 'flex items-center gap-1.5';
    
    switch (status) {
      case 'Active':
        return { 
          container: baseStyles,
          dot: `w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'}`,
          text: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
        };
      case 'Inactive':
        return { 
          container: baseStyles,
          dot: `w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-amber-400' : 'bg-amber-500'}`,
          text: theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
        };
      case 'Blocked':
        return { 
          container: baseStyles,
          dot: `w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-rose-400' : 'bg-rose-500'}`,
          text: theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
        };
      default:
        return { 
          container: baseStyles, 
          dot: 'w-2 h-2 rounded-full bg-gray-400',
          text: 'text-gray-500'
        };
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          User Management
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
            ${theme === 'dark' 
              ? 'text-gray-300 hover:bg-gray-800' 
              : 'text-gray-700 hover:bg-gray-100'}
          `}>
            <Upload size={16} />
            <span>Import</span>
          </button>
          
          <button className={`
            px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
            bg-indigo-600 hover:bg-indigo-700 text-white
          `}>
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg col-span-2
          ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
        `}>
          <Search size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Role filter */}
        <div className="relative">
          <select
            value={selectedRole || ''}
            onChange={(e) => setSelectedRole(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Customer">Customer</option>
            <option value="Support">Support</option>
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
        <div className="relative">
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
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
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
      
      {/* Users table */}
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
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className={`
                        rounded mr-2 border-2
                        ${theme === 'dark'
                          ? 'bg-gray-800 border-gray-600 text-indigo-500'
                          : 'bg-white border-gray-300 text-indigo-600'}
                      `}
                    />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>User</span>
                  </div>
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Role
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
                  Last Login
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Orders
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
              {paginatedUsers.map((user) => (
                <tr 
                  key={user.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* User column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className={`
                          rounded mr-3 border-2
                          ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-indigo-500'
                            : 'bg-white border-gray-300 text-indigo-600'}
                        `}
                      />
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white uppercase font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className={`
                            text-sm font-medium
                            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                          `}>
                            {user.name}
                          </div>
                          <div className={`
                            text-sm
                            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                          `}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Role column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getRoleBadgeStyles(user.role as UserRole)}>
                      {user.role}
                    </span>
                  </td>
                  
                  {/* Status column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={getStatusStyles(user.status as UserStatus).container}>
                      <div className={getStatusStyles(user.status as UserStatus).dot}></div>
                      <span className={`text-sm ${getStatusStyles(user.status as UserStatus).text}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  
                  {/* Last Login column */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {formatDate(user.lastLogin)}
                  </td>
                  
                  {/* Orders column */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    {user.orders}
                  </td>
                  
                  {/* Actions column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Email button */}
                      <button 
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>
                      
                      {/* Login as button */}
                      <button 
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                        title="Login as User"
                      >
                        <LogIn size={16} />
                      </button>
                      
                      {/* Edit button */}
                      <button 
                        className={`
                          p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                        title="Edit User"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      
                      {/* More button and dropdown */}
                      <div className="relative">
                        <button 
                          className={`
                            p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                            ${theme === 'dark' 
                              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                          `}
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        
                        {menuOpen === user.id && (
                          <div className={`
                            absolute right-0 mt-1 w-48 rounded-md shadow-lg overflow-hidden z-10
                            ${theme === 'dark' 
                              ? 'bg-gray-800 border border-gray-700' 
                              : 'bg-white border border-gray-200'}
                          `}>
                            <div className="py-1">
                              <button 
                                className={`
                                  w-full text-left px-4 py-2 text-sm transition-colors
                                  ${theme === 'dark' 
                                    ? 'text-gray-300 hover:bg-gray-700' 
                                    : 'text-gray-700 hover:bg-gray-100'}
                                `}
                              >
                                View Details
                              </button>
                              <button 
                                className={`
                                  w-full text-left px-4 py-2 text-sm transition-colors
                                  ${theme === 'dark' 
                                    ? 'text-gray-300 hover:bg-gray-700' 
                                    : 'text-gray-700 hover:bg-gray-100'}
                                `}
                              >
                                Change Password
                              </button>
                              <button 
                                className={`
                                  w-full text-left px-4 py-2 text-sm transition-colors
                                  ${theme === 'dark' 
                                    ? 'text-red-400 hover:bg-gray-700' 
                                    : 'text-red-600 hover:bg-gray-100'}
                                `}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteModalOpen(true);
                                  setMenuOpen(null);
                                }}
                              >
                                Delete User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedUsers.length === 0 && (
                <tr>
                  <td 
                    colSpan={6} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`
            px-6 py-3 flex items-center justify-between border-t
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className={`
              text-sm
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            `}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`
                  px-3 py-1 rounded text-sm 
                  ${currentPage === 1
                    ? theme === 'dark' 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    w-8 h-8 rounded-full text-sm
                    ${currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`
                  px-3 py-1 rounded text-sm
                  ${currentPage === totalPages
                    ? theme === 'dark' 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Edit user modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-md rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Edit User
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name}
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
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
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
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Role
                  </label>
                  <select
                    defaultValue={selectedUser.role}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Customer">Customer</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    defaultValue={selectedUser.status}
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
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
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
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {isDeleteModalOpen && selectedUser && (
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
                Delete User
              </h3>
              
              <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete <span className="font-medium">{selectedUser.name}</span>? This action cannot be undone.
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
                  onClick={() => setIsDeleteModalOpen(false)}
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

export default UserManagement;