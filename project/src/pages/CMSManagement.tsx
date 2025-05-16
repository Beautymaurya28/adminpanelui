import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye,
  FileText, Link as LinkIcon, Image as ImageIcon,
  ExternalLink, X, Save, Globe, Tag
} from 'lucide-react';
import { toast } from 'sonner';

// Mock CMS data
const mockPages = [
  {
    id: 'PAGE001',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About Our Company</h1><p>We are a leading e-commerce platform...</p>',
    metaTitle: 'About Us | Your E-commerce Store',
    metaDescription: 'Learn about our company, mission, and values.',
    tags: ['company', 'about', 'mission'],
    status: 'Published',
    lastUpdated: '2025-05-15T10:30:00',
    author: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: 'PAGE002',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h1>Privacy Policy</h1><p>This privacy policy outlines how we collect and use your data...</p>',
    metaTitle: 'Privacy Policy | Your E-commerce Store',
    metaDescription: 'Our privacy policy and data protection practices.',
    tags: ['legal', 'privacy', 'policy'],
    status: 'Published',
    lastUpdated: '2025-05-14T15:45:00',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  },
  {
    id: 'PAGE003',
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    content: '<h1>Terms & Conditions</h1><p>By using our service, you agree to the following terms...</p>',
    metaTitle: 'Terms & Conditions | Your E-commerce Store',
    metaDescription: 'Terms of service and user agreement.',
    tags: ['legal', 'terms', 'conditions'],
    status: 'Published',
    lastUpdated: '2025-05-14T09:20:00',
    author: {
      name: 'Michael Davis',
      avatar: 'https://i.pravatar.cc/150?img=8'
    }
  },
  {
    id: 'PAGE004',
    title: 'Summer Sale Landing Page',
    slug: 'summer-sale-2025',
    content: '<h1>Summer Sale 2025</h1><p>Get up to 50% off on all summer essentials...</p>',
    metaTitle: 'Summer Sale 2025 | Your E-commerce Store',
    metaDescription: 'Exclusive summer deals and discounts.',
    tags: ['sale', 'summer', 'promotion'],
    status: 'Draft',
    lastUpdated: '2025-05-13T16:30:00',
    author: {
      name: 'Emily Brown',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  }
];

// Mock banners data
const mockBanners = [
  {
    id: 'BNR001',
    title: 'Summer Sale Banner',
    image: 'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=300',
    link: '/summer-sale',
    startDate: '2025-05-01T00:00:00',
    endDate: '2025-05-31T23:59:59',
    status: 'Active'
  },
  {
    id: 'BNR002',
    title: 'New Collection',
    image: 'https://images.pexels.com/photos/5709008/pexels-photo-5709008.jpeg?auto=compress&cs=tinysrgb&w=300',
    link: '/new-arrivals',
    startDate: '2025-05-15T00:00:00',
    endDate: '2025-06-15T23:59:59',
    status: 'Scheduled'
  }
];

// Types
type PageStatus = 'Published' | 'Draft';
type BannerStatus = 'Active' | 'Inactive' | 'Scheduled';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  status: PageStatus;
  lastUpdated: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  startDate: string;
  endDate: string;
  status: BannerStatus;
}

const CMSManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string | null>(null);
  
  // Filter pages
  const filteredPages = mockPages.filter(page => {
    const matchesSearch = 
      searchTerm === '' || 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || page.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: PageStatus | BannerStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Published':
      case 'Active':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Draft':
      case 'Inactive':
        return `${baseStyles} ${theme === 'dark' ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-600'}`;
      case 'Scheduled':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Handle auto-save
  const handleContentChange = (content: string) => {
    setEditorContent(content);
    setAutoSaveStatus('Saving...');
    
    // Simulate auto-save
    setTimeout(() => {
      setAutoSaveStatus('All changes saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    }, 1000);
  };
  
  // Editor modules configuration
  const editorModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            CMS Content Management
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage all static pages, banners, and content blocks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setSelectedPage(null);
              setIsPageModalOpen(true);
            }}
            className={`
              px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
              bg-indigo-600 hover:bg-indigo-700 text-white
            `}
          >
            <Plus size={16} />
            <span>Add Page</span>
          </button>
          
          <button 
            onClick={() => {
              setSelectedBanner(null);
              setIsBannerModalOpen(true);
            }}
            className={`
              px-3 py-2 text-sm inline-flex items-center gap-1.5 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <ImageIcon size={16} />
            <span>Add Banner</span>
          </button>
        </div>
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
            placeholder="Search pages..."
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
            <option value="Published">Published</option>
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
      </div>
      
      {/* Pages List */}
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
                  Page
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Slug
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Author
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Last Updated
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
              {filteredPages.map((page) => (
                <tr 
                  key={page.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Page Title */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`
                        p-2 rounded-lg mr-3
                        ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                      `}>
                        <FileText size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                      <div>
                        <div className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {page.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {page.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`
                                px-2 py-0.5 rounded-full text-xs
                                ${theme === 'dark' 
                                  ? 'bg-gray-700 text-gray-300' 
                                  : 'bg-gray-100 text-gray-600'}
                              `}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Slug */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <div className="flex items-center">
                      <LinkIcon size={14} className="mr-1" />
                      <span className="font-mono">{page.slug}</span>
                    </div>
                  </td>
                  
                  {/* Author */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={page.author.avatar}
                        alt={page.author.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {page.author.name}
                      </span>
                    </div>
                  </td>
                  
                  {/* Last Updated */}
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {formatDate(page.lastUpdated)}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeStyles(page.status as PageStatus)}>
                      {page.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          p-1.5 rounded-lg transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <ExternalLink size={16} />
                      </a>
                      
                      <button 
                        onClick={() => {
                          setSelectedPage(page);
                          setEditorContent(page.content);
                          setIsPageModalOpen(true);
                        }}
                        className={`
                          p-1.5 rounded-lg transition-colors inline-flex items-center justify-center
                          ${theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button 
                        onClick={() => {
                          toast.success('Page deleted successfully!');
                        }}
                        className={`
                          p-1.5 rounded-lg transition-colors inline-flex items-center justify-center
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
              
              {filteredPages.length === 0 && (
                <tr>
                  <td 
                    colSpan={6} 
                    className={`
                      px-6 py-12 text-center text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    No pages found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Banners Section */}
      <div className="mt-8">
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Banners
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBanners.map((banner) => (
            <div
              key={banner.id}
              className={`
                rounded-xl overflow-hidden shadow-sm border
                ${theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white border-gray-200'}
              `}
            >
              <div className="relative h-48">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={getStatusBadgeStyles(banner.status as BannerStatus)}>
                    {banner.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {banner.title}
                </h3>
                
                <div className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center gap-1">
                    <LinkIcon size={14} />
                    <span className="font-mono">{banner.link}</span>
                  </div>
                </div>
                
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div>From: {format(new Date(banner.startDate), 'MMM d, yyyy')}</div>
                  
                  <div>To: {format(new Date(banner.endDate), 'MMM d, yyyy')}</div>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={() => {
                      setSelectedBanner(banner);
                      setIsBannerModalOpen(true);
                    }}
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
                    onClick={() => toast.success('Banner deleted successfully!')}
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
          ))}
          
          {/* Add Banner Card */}
          <button
            onClick={() => {
              setSelectedBanner(null);
              setIsBannerModalOpen(true);
            }}
            className={`
              rounded-xl border-2 border-dashed flex items-center justify-center p-8
              ${theme === 'dark'
                ? 'border-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-400'
                : 'border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-500'}
            `}
          >
            <div className="text-center">
              <Plus size={24} className="mx-auto mb-2" />
              <span>Add New Banner</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Page Editor Modal */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className={`
            h-full
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="h-full flex flex-col">
              {/* Modal Header */}
              <div className={`
                px-6 py-4 border-b flex items-center justify-between
                ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPage ? 'Edit Page' : 'Add New Page'}
                  </h3>
                  {autoSaveStatus && (
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {autoSaveStatus}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`
                      px-3 py-2 text-sm rounded-lg transition-colors
                      ${theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                  
                  <button
                    onClick={() => {
                      toast.success(selectedPage ? 'Page updated successfully!' : 'Page created successfully!');
                      setIsPageModalOpen(false);
                    }}
                    className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Save size={16} className="inline-block mr-1" />
                    {selectedPage ? 'Update' : 'Publish'}
                  </button>
                  
                  <button
                    onClick={() => setIsPageModalOpen(false)}
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
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
                  {/* Editor Section */}
                  <div className={`
                    w-full ${showPreview ? 'hidden' : 'block'}
                    overflow-y-auto
                  `}>
                    <div className="p-6 space-y-4">
                      {/* Title & Slug */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Page Title
                          </label>
                          <input
                            type="text"
                            defaultValue={selectedPage?.title}
                            placeholder="Enter page title"
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
                            Slug
                          </label>
                          <div className="flex items-center">
                            <span className={`
                              px-3 py-2 rounded-l-lg text-sm border
                              ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-500'}
                            `}>
                              /
                            </span>
                            <input
                              type="text"
                              defaultValue={selectedPage?.slug}
                              placeholder="page-slug"
                              className={`
                                flex-1 px-3 py-2 rounded-r-lg text-sm font-mono
                                ${theme === 'dark' 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                                border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                              `}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Editor */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Content
                        </label>
                        <div className={`
                          ${theme === 'dark' ? '[&_.ql-toolbar]:bg-gray-700 [&_.ql-container]:bg-gray-700' : ''}
                          [&_.ql-toolbar]:border-gray-300 [&_.ql-container]:border-gray-300
                          [&_.ql-editor]:min-h-[300px]
                        `}>
                          <ReactQuill
                            value={editorContent}
                            onChange={handleContentChange}
                            modules={editorModules}
                            theme="snow"
                          />
                        </div>
                      </div>
                      
                      {/* SEO Section */}
                      <div className={`
                        mt-6 p-4 rounded-lg border
                        ${theme === 'dark' ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}
                      `}>
                        <div className="flex items-center gap-2 mb-4">
                          <Globe size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                          <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            SEO Settings
                          </h4>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Meta Title
                            </label>
                            <input
                              type="text"
                              defaultValue={selectedPage?.metaTitle}
                              placeholder="Enter meta title"
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
                              Meta Description
                            </label>
                            <textarea
                              defaultValue={selectedPage?.metaDescription}
                              placeholder="Enter meta description"
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
                          
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Tags
                            </label>
                            <div className="flex items-center gap-2">
                              <Tag size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                              <input
                                type="text"
                                defaultValue={selectedPage?.tags.join(', ')}
                                placeholder="Enter tags, separated by commas"
                                className={`
                                  flex-1 px-3 py-2 rounded-lg text-sm
                                  ${theme === 'dark' 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                                  border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                `}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Section */}
                  {showPreview && (
                    <div className={`
                      w-full h-full overflow-y-auto p-8
                      ${theme === 'dark' ? 'bg-white' : 'bg-gray-50'}
                    `}>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: editorContent }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-2xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedBanner ? 'Edit Banner' : 'Add New Banner'}
                </h3>
                
                <button
                  onClick={() => setIsBannerModalOpen(false)}
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
                {/* Banner Image */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Banner Image
                  </label>
                  <div className={`
                    relative rounded-lg overflow-hidden
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                    ${selectedBanner?.image ? 'h-48' : 'h-32'}
                  `}>
                    {selectedBanner?.image ? (
                      <img
                        src={selectedBanner.image}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <ImageIcon size={32} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Click to upload or drag and drop
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          SVG, PNG, JPG (max. 1920x600px)
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>
                
                {/* Banner Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Banner Title
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedBanner?.title}
                    placeholder="Enter banner title"
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                      border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    `}
                  />
                </div>
                
                {/* Link */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Link URL
                  </label>
                  <div className="flex items-center">
                    <span className={`
                      px-3 py-2 rounded-l-lg text-sm border
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-500'}
                    `}>
                      /
                    </span>
                    <input
                      type="text"
                      defaultValue={selectedBanner?.link.replace('/', '')}
                      placeholder="banner-link"
                      className={`
                        flex-1 px-3 py-2 rounded-r-lg text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}
                        border focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      `}
                    />
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedBanner?.startDate.split('T')[0]}
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
                      End Date
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedBanner?.endDate.split('T')[0]}
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
                
                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    defaultValue={selectedBanner?.status || 'Active'}
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
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsBannerModalOpen(false)}
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
                    setIsBannerModalOpen(false);
                    toast.success(
                      selectedBanner 
                        ? 'Banner updated successfully!' 
                        : 'Banner created successfully!'
                    );
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {selectedBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSManagement;