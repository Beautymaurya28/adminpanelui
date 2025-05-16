import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Search, Filter, Plus, Edit, Trash2, Eye,
  Download, Upload, ChevronRight, ChevronDown,
  X, Image as ImageIcon, Package, ArrowUpRight,
  FolderTree, Tag, Archive
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Mock categories data
const mockCategories = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'All electronic devices and accessories',
    image: 'https://images.pexels.com/photos/343457/pexels-photo-343457.jpeg?auto=compress&cs=tinysrgb&w=300',
    productCount: 156,
    status: 'Active',
    parent: null,
    order: 1
  },
  {
    id: 'cat-2',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest smartphones and accessories',
    image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=300',
    productCount: 48,
    status: 'Active',
    parent: 'cat-1',
    order: 2
  },
  {
    id: 'cat-3',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Laptops and notebooks',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300',
    productCount: 35,
    status: 'Active',
    parent: 'cat-1',
    order: 3
  },
  {
    id: 'cat-4',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and accessories',
    image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=300',
    productCount: 245,
    status: 'Active',
    parent: null,
    order: 4
  },
  {
    id: 'cat-5',
    name: "Men's Wear",
    slug: 'mens-wear',
    description: "Men's clothing and accessories",
    image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=300',
    productCount: 89,
    status: 'Active',
    parent: 'cat-4',
    order: 5
  },
  {
    id: 'cat-6',
    name: "Women's Wear",
    slug: 'womens-wear',
    description: "Women's clothing and accessories",
    image: 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=300',
    productCount: 156,
    status: 'Active',
    parent: 'cat-4',
    order: 6
  },
  {
    id: 'cat-7',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Home decor and furniture',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
    productCount: 178,
    status: 'Hidden',
    parent: null,
    order: 7
  }
];

// Category type
type CategoryStatus = 'Active' | 'Hidden';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  status: CategoryStatus;
  parent: string | null;
  order: number;
}

// Sortable category item component
const SortableCategory: React.FC<{
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
}> = ({ category, onEdit, onDelete, onView }) => {
  const { theme } = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        rounded-xl overflow-hidden shadow-sm border transition-all
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
          : 'bg-white border-gray-200 hover:bg-gray-50'}
        ${isDragging ? 'shadow-lg scale-105' : ''}
      `}
    >
      <div className="flex items-start p-4 gap-4">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className={`
            mt-2 p-1 rounded cursor-move
            ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
          `}
        >
          <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M12 4v16m-4-4l4 4 4-4M12 4L8 8l4-4 4 4"
            />
          </svg>
        </div>
        
        {/* Category image */}
        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Category info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {category.name}
            </h3>
            <span className={`
              px-2.5 py-1 rounded-full text-xs font-medium
              ${category.status === 'Active'
                ? theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                : theme === 'dark' ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-600'
              }
            `}>
              {category.status}
            </span>
          </div>
          
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {category.description}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Slug: <span className="font-mono">{category.slug}</span>
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Products: {category.productCount}
            </div>
            {category.parent && (
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Parent: {mockCategories.find(c => c.id === category.parent)?.name}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(category)}
            className={`
              p-1.5 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
            `}
          >
            <Eye size={18} />
          </button>
          
          <button
            onClick={() => onEdit(category)}
            className={`
              p-1.5 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
            `}
          >
            <Edit size={18} />
          </button>
          
          <button
            onClick={() => onDelete(category)}
            className={`
              p-1.5 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
            `}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryManagement: React.FC = () => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryImage, setNewCategoryImage] = useState<string>('');
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Calculate stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'Active').length;
  const hiddenCategories = categories.filter(c => c.status === 'Hidden').length;
  const topCategory = [...categories].sort((a, b) => b.productCount - a.productCount)[0];
  
  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      searchTerm === '' || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesParent = 
      selectedParent === null || 
      category.parent === selectedParent;
    
    const matchesStatus = 
      selectedStatus === null || 
      category.status === selectedStatus;
    
    return matchesSearch && matchesParent && matchesStatus;
  });
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index + 1
        }));
      });
    }
  };
  
  // Handle category actions
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };
  
  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  const handleViewCategory = (category: Category) => {
    // In a real app, this would navigate to the category detail page
    console.log('View category:', category);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Product Categories
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Organize, reorder and manage your product categories easily
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
          
          <button className={`
            px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
            ${theme === 'dark' 
              ? 'text-gray-300 hover:bg-gray-800' 
              : 'text-gray-700 hover:bg-gray-100'}
          `}>
            <Upload size={16} />
            <span>Import</span>
          </button>
          
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setIsAddModalOpen(true);
            }}
            className={`
              px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
              bg-indigo-600 hover:bg-indigo-700 text-white
            `}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Categories */}
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
              <FolderTree size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Categories
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalCategories}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Active Categories */}
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
              <Tag size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Active Categories
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {activeCategories}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Hidden Categories */}
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
              <Archive size={20} />
            </div>
            
            <div className="mt-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Hidden Categories
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {hiddenCategories}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Top Category */}
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
                Top Category
              </p>
              <h3 className={`text-lg font-bold mt-1 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {topCategory.name}
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {topCategory.productCount} products
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg md:col-span-6
          ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
        `}>
          <Search size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Parent Category filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedParent || ''}
            onChange={(e) => setSelectedParent(e.target.value || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Categories</option>
            {categories
              .filter(c => !c.parent)
              .map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))
            }
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
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
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
      
      {/* Categories List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <SortableContext
            items={filteredCategories.map(cat => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredCategories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onView={handleViewCategory}
              />
            ))}
          </SortableContext>
          
          {filteredCategories.length === 0 && (
            <div className={`
              rounded-xl p-8 text-center
              ${theme === 'dark' ? 'bg-gray-800/50 text-gray-400' : 'bg-white text-gray-500'}
            `}>
              No categories found matching your search criteria.
            </div>
          )}
        </div>
      </DndContext>
      
      {/* Add/Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-2xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
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
                {/* Category Image */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category Image
                  </label>
                  <div className={`
                    relative rounded-lg overflow-hidden
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                    ${newCategoryImage ? 'h-48' : 'h-32'}
                  `}>
                    {newCategoryImage ? (
                      <img
                        src={newCategoryImage}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <ImageIcon size={32} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Click to upload or drag and drop
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          SVG, PNG, JPG (max. 800x400px)
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewCategoryImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Category Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedCategory?.name}
                    placeholder="e.g., Electronics"
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Slug
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedCategory?.slug}
                    placeholder="e.g., electronics"
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm font-mono
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    defaultValue={selectedCategory?.description}
                    placeholder="Enter category description..."
                    rows={3}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  />
                </div>
                
                {/* Parent Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Parent Category
                  </label>
                  <select
                    defaultValue={selectedCategory?.parent || ''}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  >
                    <option value="">None (Top Level Category)</option>
                    {categories
                      .filter(c => !c.parent && (!selectedCategory || c.id !== selectedCategory.id))
                      .map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))
                    }
                  </select>
                </div>
                
                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    defaultValue={selectedCategory?.status || 'Active'}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  >
                    <option value="Active">Active</option>
                    <option value="Hidden">Hidden</option>
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {selectedCategory ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
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
                Delete Category
              </h3>
              
              <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete <span className="font-medium">{selectedCategory.name}</span>? This will also delete all subcategories and cannot be undone.
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

export default CategoryManagement;