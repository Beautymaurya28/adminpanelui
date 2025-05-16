import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { 
  Search, Filter, Star, Eye, Trash2, Check, X,
  MessageSquare, AlertTriangle, SmilePlus, Meh,
  Frown, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { toast } from 'sonner';

// Mock review data
const mockReviews = [
  {
    id: 'REV001',
    product: {
      id: 'P001',
      name: 'Wireless Headphones',
      image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    user: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    rating: 5,
    review: 'Amazing sound quality and battery life! These headphones are exactly what I was looking for. The noise cancellation is top-notch and they\'re very comfortable to wear for long periods.',
    date: '2025-05-15T10:30:00',
    status: 'Visible',
    helpful: 12,
    notHelpful: 2,
    flagged: false
  },
  {
    id: 'REV002',
    product: {
      id: 'P002',
      name: 'Smart Watch',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    rating: 2,
    review: 'Battery life is terrible and the touch screen is not responsive. Would not recommend.',
    date: '2025-05-14T15:45:00',
    status: 'Hidden',
    helpful: 5,
    notHelpful: 8,
    flagged: true
  },
  {
    id: 'REV003',
    product: {
      id: 'P003',
      name: 'Bluetooth Speaker',
      image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    user: {
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    rating: 4,
    review: 'Great sound for the size. Perfect for outdoor use. Only giving 4 stars because the app could be better.',
    date: '2025-05-14T09:20:00',
    status: 'Visible',
    helpful: 8,
    notHelpful: 1,
    flagged: false
  },
  {
    id: 'REV004',
    product: {
      id: 'P004',
      name: 'Laptop Backpack',
      image: 'https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    user: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    rating: 5,
    review: 'This backpack is amazing! Lots of compartments and very comfortable to carry. The laptop sleeve is well padded.',
    date: '2025-05-13T16:30:00',
    status: 'Pending',
    helpful: 3,
    notHelpful: 0,
    flagged: false
  },
  {
    id: 'REV005',
    product: {
      id: 'P005',
      name: 'Coffee Maker',
      image: 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    user: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    rating: 1,
    review: 'Absolute garbage! Broke after 2 weeks and customer service is terrible. Save your money!',
    date: '2025-05-13T11:15:00',
    status: 'Hidden',
    helpful: 15,
    notHelpful: 3,
    flagged: true
  }
];

// Types
type ReviewStatus = 'Visible' | 'Hidden' | 'Pending';

interface Review {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  rating: number;
  review: string;
  date: string;
  status: ReviewStatus;
  helpful: number;
  notHelpful: number;
  flagged: boolean;
}

const ReviewManagement: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  // Filter reviews
  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = 
      searchTerm === '' || 
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = selectedRating === null || review.rating === selectedRating;
    
    const matchesStatus = selectedStatus === null || review.status === selectedStatus;
    
    return matchesSearch && matchesRating && matchesStatus;
  });
  
  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        break;
      case 'rating':
        comparison = b.rating - a.rating;
        break;
      case 'helpful':
        comparison = b.helpful - a.helpful;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? -comparison : comparison;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Get status badge style
  const getStatusBadgeStyles = (status: ReviewStatus) => {
    const baseStyles = 'px-2.5 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Visible':
        return `${baseStyles} ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'Hidden':
        return `${baseStyles} ${theme === 'dark' ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      case 'Pending':
        return `${baseStyles} ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      default:
        return baseStyles;
    }
  };
  
  // Get sentiment icon
  const getSentimentIcon = (rating: number) => {
    if (rating >= 4) {
      return <SmilePlus className="text-emerald-500" />;
    } else if (rating >= 2) {
      return <Meh className="text-amber-500" />;
    } else {
      return <Frown className="text-rose-500" />;
    }
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-amber-400 fill-amber-400' : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };
  
  // Handle review actions
  const handleApproveReview = (review: Review) => {
    toast.success('Review approved successfully!');
  };
  
  const handleHideReview = (review: Review) => {
    toast.success('Review hidden successfully!');
  };
  
  const handleDeleteReview = (review: Review) => {
    toast.success('Review deleted successfully!');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Customer Reviews
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Monitor feedback and manage user-generated reviews
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`
              px-3 py-2 text-sm rounded-lg appearance-none
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
            <option value="helpful">Sort by Helpful</option>
          </select>
          
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className={`
              px-3 py-2 text-sm rounded-lg
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            {sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
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
            placeholder="Search reviews..."
            className={`
              w-full bg-transparent border-0 outline-none text-sm
              ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}
            `}
          />
        </div>
        
        {/* Rating filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedRating || ''}
            onChange={(e) => setSelectedRating(Number(e.target.value) || null)}
            className={`
              w-full px-3 py-2 rounded-lg appearance-none text-sm
              ${theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-white text-gray-700 border border-gray-200'}
            `}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
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
            <option value="Visible">Visible</option>
            <option value="Hidden">Hidden</option>
            <option value="Pending">Pending</option>
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
      
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className={`
              rounded-xl overflow-hidden shadow-sm border transition-all
              ${theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                : 'bg-white border-gray-200 hover:bg-gray-50'}
              ${review.status === 'Hidden' ? 'opacity-60' : ''}
            `}
          >
            {/* Review Header */}
            <div className="p-4 flex items-start gap-4">
              {/* Product Image */}
              <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={review.product.image}
                  alt={review.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product & User Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {review.product.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {review.user.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  {renderStarRating(review.rating)}
                  <span className={getStatusBadgeStyles(review.status as ReviewStatus)}>
                    {review.status}
                  </span>
                  {review.flagged && (
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-medium
                      ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}
                    `}>
                      Flagged
                    </span>
                  )}
                </div>
              </div>
              
              {/* Sentiment Icon */}
              <div className={`
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                {getSentimentIcon(review.rating)}
              </div>
            </div>
            
            {/* Review Content */}
            <div className={`
              px-4 py-3 border-t
              ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <p className={`
                text-sm line-clamp-3
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}>
                {review.review}
              </p>
            </div>
            
            {/* Review Footer */}
            <div className={`
              px-4 py-3 border-t flex items-center justify-between
              ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-4">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(review.date)}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {review.helpful}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {review.notHelpful}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsDetailsModalOpen(true);
                  }}
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <Eye size={18} />
                </button>
                
                {review.status === 'Pending' && (
                  <button
                    onClick={() => handleApproveReview(review)}
                    className={`
                      p-1.5 rounded-lg transition-colors
                      ${theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <Check size={18} />
                  </button>
                )}
                
                <button
                  onClick={() => handleHideReview(review)}
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  {review.status === 'Hidden' ? <Eye size={18} /> : <X size={18} />}
                </button>
                
                <button
                  onClick={() => handleDeleteReview(review)}
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
        
        {sortedReviews.length === 0 && (
          <div className={`
            col-span-full rounded-xl p-8 text-center
            ${theme === 'dark' ? 'bg-gray-800/50 text-gray-400' : 'bg-white text-gray-500'}
          `}>
            No reviews found matching your search criteria.
          </div>
        )}
      </div>
      
      {/* Review Details Modal */}
      {isDetailsModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className={`
            relative w-full max-w-2xl rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Review Details
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedReview.id}
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
              
              <div className="space-y-6">
                {/* Product Info */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={selectedReview.product.image}
                      alt={selectedReview.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedReview.product.name}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Product ID: {selectedReview.product.id}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {renderStarRating(selectedReview.rating)}
                      <span className={getStatusBadgeStyles(selectedReview.status as ReviewStatus)}>
                        {selectedReview.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* User Info */}
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={selectedReview.user.avatar}
                      alt={selectedReview.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedReview.user.name}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedReview.user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`
                    p-3 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                  `}>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Review
                      </span>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedReview.review}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Posted on {formatDate(selectedReview.date)}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedReview.helpful}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedReview.notHelpful}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Moderation Info */}
                {selectedReview.flagged && (
                  <div className={`
                    p-4 rounded-lg border
                    ${theme === 'dark' 
                      ? 'bg-amber-900/10 border-amber-900/20' 
                      : 'bg-amber-50 border-amber-100'}
                  `}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        Flagged for Review
                      </span>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                      This review has been flagged for potential violation of community guidelines.
                      Please review the content and take appropriate action.
                    </p>
                  </div>
                )}
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
                
                {selectedReview.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleApproveReview(selectedReview);
                      setIsDetailsModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Approve Review
                  </button>
                )}
                
                <button
                  onClick={() => {
                    handleHideReview(selectedReview);
                    setIsDetailsModalOpen(false);
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm
                    ${selectedReview.status === 'Hidden'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700'}
                  `}
                >
                  {selectedReview.status === 'Hidden' ? 'Show Review' : 'Hide Review'}
                </button>
                
                <button
                  onClick={() => {
                    handleDeleteReview(selectedReview);
                    setIsDetailsModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;