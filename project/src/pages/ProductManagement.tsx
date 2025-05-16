import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, Grid, List, Plus, 
  MoreHorizontal, Edit, Trash2, Upload, Download, 
  Copy, ExternalLink, Star, ShoppingCart, Package
} from 'lucide-react';

// Mock product data
const mockProducts = [
  {
    id: 'P001',
    name: 'Wireless Headphones',
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 129.99,
    stock: 34,
    category: 'Electronics',
    status: 'Active',
    rating: 4.5,
    sales: 342
  },
  {
    id: 'P002',
    name: 'Smart Watch',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 249.99,
    stock: 12,
    category: 'Electronics',
    status: 'Active',
    rating: 4.2,
    sales: 178
  },
  {
    id: 'P003',
    name: 'Bluetooth Speaker',
    image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 79.99,
    stock: 45,
    category: 'Electronics',
    status: 'Active',
    rating: 4.0,
    sales: 265
  },
  {
    id: 'P004',
    name: 'Laptop Backpack',
    image: 'https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 59.99,
    stock: 78,
    category: 'Accessories',
    status: 'Active',
    rating: 4.8,
    sales: 421
  },
  {
    id: 'P005',
    name: 'Coffee Maker',
    image: 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 89.99,
    stock: 0,
    category: 'Home & Kitchen',
    status: 'Out of Stock',
    rating: 4.3,
    sales: 189
  },
  {
    id: 'P006',
    name: 'Smartphone Case',
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 19.99,
    stock: 124,
    category: 'Accessories',
    status: 'Active',
    rating: 3.9,
    sales: 567
  },
  {
    id: 'P007',
    name: 'Fitness Tracker',
    image: 'https://images.pexels.com/photos/110471/pexels-photo-110471.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 49.99,
    stock: 28,
    category: 'Electronics',
    status: 'Active',
    rating: 4.1,
    sales: 312
  },
  {
    id: 'P008',
    name: 'Portable Charger',
    image: 'https://images.pexels.com/photos/5709008/pexels-photo-5709008.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 29.99,
    stock: 3,
    category: 'Electronics',
    status: 'Low Stock',
    rating: 4.7,
    sales: 435
  }
];

// Product status type
type ProductStatus = 'Active' | 'Out of Stock' | 'Low Stock' | 'Draft';

interface ProductData {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
  rating: number;
  sales: number;
}

// View options
type ViewMode = 'grid' | 'list';

const ProductManagement: React.FC = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const itemsPerPage = viewMode === 'grid' ? 8 : 5;
  
  // Filter products based on search, category, and status
  const filteredProducts = mockProducts.filter(product => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === null || product.category === selectedCategory;
    
    // Status filter
    const matchesStatus = selectedStatus === null || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortBy as keyof ProductData];
    const bValue = b[sortBy as keyof ProductData];
    
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return multiplier * aValue.localeCompare(bValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return multiplier * (aValue - bValue);
    }
    
    return 0;
  });
  
  // Paginate products
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  
  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Handle product selection
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  // Handle select all products
  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(product => product.id));
    }
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: ProductStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Active':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Out of Stock':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      case 'Low Stock':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      case 'Draft':
        return `${baseStyles} ${theme === 'dark' ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={14} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <Star key="half" size={14} className="text-amber-400" /> // Half star would need custom SVG for accurate display
        )}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} size={14} className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'} />
        ))}
        <span className={`ml-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          ({rating})
        </span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Product Management
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
            <Plus size={16} />
            <span>Add Product</span>
          </button>
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
            placeholder="Search products..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Category filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
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
        <div className="relative md:col-span-3">
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
            <option value="Out of Stock">Out of Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Draft">Draft</option>
          </select>
          <Filter 
            size={16} 
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
              ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
            `} 
          />
        </div>
        
        {/* View toggle */}
        <div className={`
          flex items-center md:col-span-1 rounded-lg overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'}
        `}>
          <button
            onClick={() => setViewMode('grid')}
            className={`
              flex-1 h-full flex items-center justify-center p-2
              ${viewMode === 'grid'
                ? theme === 'dark'
                  ? 'bg-gray-700 text-indigo-400'
                  : 'bg-indigo-50 text-indigo-600'
                : theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-700/50'
                  : 'text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              flex-1 h-full flex items-center justify-center p-2
              ${viewMode === 'list'
                ? theme === 'dark'
                  ? 'bg-gray-700 text-indigo-400'
                  : 'bg-indigo-50 text-indigo-600'
                : theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-700/50'
                  : 'text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {/* Products Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div 
              key={product.id}
              className={`
                rounded-xl overflow-hidden shadow-sm border transition-all hover:shadow-md
                ${theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white border-gray-200'}
              `}
            >
              <div className="relative">
                {/* Product image */}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className={getStatusBadgeStyles(product.status as ProductStatus)}>
                    {product.status}
                  </span>
                </div>
                
                {/* Actions overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100
                  flex items-end justify-between p-3 transition-opacity duration-300
                `}>
                  <div className="flex space-x-1">
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100">
                      <Copy size={16} />
                    </button>
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                  <button className="p-1.5 bg-rose-500 rounded-full text-white hover:bg-rose-600">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Checkbox for selection */}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className={`
                      rounded border-2
                      ${theme === 'dark'
                        ? 'bg-gray-700/60 border-gray-600 text-indigo-500'
                        : 'bg-white/60 border-gray-300 text-indigo-600'}
                    `}
                  />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`
                    text-sm font-semibold truncate w-52
                    ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
                  `}>
                    {product.name}
                  </h3>
                </div>
                
                <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {product.id}
                </p>
                
                {renderStarRating(product.rating)}
                
                <div className="flex justify-between items-center mt-3">
                  <span className={`
                    text-lg font-bold
                    ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${product.price.toFixed(2)}
                  </span>
                  
                  <div className="flex items-center">
                    <div className={`
                      flex items-center mr-2 text-xs
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                      <Package size={14} className="mr-1" />
                      <span>{product.stock}</span>
                    </div>
                    
                    <div className={`
                      flex items-center text-xs
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                      <ShoppingCart size={14} className="mr-1" />
                      <span>{product.sales}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {paginatedProducts.length === 0 && (
            <div className={`
              col-span-full rounded-xl p-10 text-center
              ${theme === 'dark' ? 'bg-gray-800/50 text-gray-400' : 'bg-white text-gray-500 border border-gray-200'}
            `}>
              No products found matching your search criteria.
            </div>
          )}
        </div>
      ) : (
        // List View
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
                        checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={handleSelectAll}
                        className={`
                          rounded mr-2 border-2
                          ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-indigo-500'
                            : 'bg-white border-gray-300 text-indigo-600'}
                        `}
                      />
                      <button 
                        className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                        onClick={() => handleSort('name')}
                      >
                        <span>Product</span>
                        {sortBy === 'name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    </div>
                  </th>
                  <th className={`
                    px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('category')}
                    >
                      <span>Category</span>
                      {sortBy === 'category' && (
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
                      onClick={() => handleSort('price')}
                    >
                      <span>Price</span>
                      {sortBy === 'price' && (
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
                      onClick={() => handleSort('stock')}
                    >
                      <span>Stock</span>
                      {sortBy === 'stock' && (
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
                      onClick={() => handleSort('rating')}
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
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('sales')}
                    >
                      <span>Sales</span>
                      {sortBy === 'sales' && (
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
                {paginatedProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className={`
                      transition-colors
                      ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                    `}
                  >
                    {/* Product column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className={`
                            rounded mr-3 border-2
                            ${theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-indigo-500'
                              : 'bg-white border-gray-300 text-indigo-600'}
                          `}
                        />
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className={`
                              text-sm font-medium
                              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                            `}>
                              {product.name}
                            </div>
                            <div className={`
                              text-sm
                              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                              {product.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category column */}
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      {product.category}
                    </td>
                    
                    {/* Status column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeStyles(product.status as ProductStatus)}>
                        {product.status}
                      </span>
                    </td>
                    
                    {/* Price column */}
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm font-medium
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      ${product.price.toFixed(2)}
                    </td>
                    
                    {/* Stock column */}
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      {product.stock}
                    </td>
                    
                    {/* Rating column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStarRating(product.rating)}
                    </td>
                    
                    {/* Sales column */}
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      {product.sales}
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
                        >
                          <ExternalLink size={16} />
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
                        
                        <div className="relative">
                          <button 
                            className={`
                              p-1.5 rounded-full transition-colors inline-flex items-center justify-center
                              ${theme === 'dark' 
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                            `}
                            onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id)}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          
                          {menuOpen === product.id && (
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
                                  Duplicate
                                </button>
                                <button 
                                  className={`
                                    w-full text-left px-4 py-2 text-sm transition-colors
                                    ${theme === 'dark' 
                                      ? 'text-red-400 hover:bg-gray-700' 
                                      : 'text-red-600 hover:bg-gray-100'}
                                  `}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td 
                      colSpan={8} 
                      className={`
                        px-6 py-12 text-center text-sm
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                      `}
                    >
                      No products found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`
          flex items-center justify-between
          ${viewMode === 'list' ? 'mt-4' : ''}
        `}>
          <div className={`
            text-sm
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
          `}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
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
  );
};

export default ProductManagement;