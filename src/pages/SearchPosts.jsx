import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import { 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar, 
  Star,
  Heart,
  Eye,
  Wifi,
  Car,
  Coffee,
  Tv,
  Snowflake,
  Shirt,
  CheckCircle,
  Home,
  Search
} from 'lucide-react';


// Mock data storage for postsService fallback (copied from firebase.js)
let mockPostsStorage = [
  {
    id: 'mock1',
    title: 'Tìm bạn nữ ghép trọ quận 1',
    description: 'Phòng trọ đẹp, đầy đủ tiện nghi, gần trường ĐH Khoa học Tự nhiên.',
    price: 3500000,
    budget: 3500000,
    location: 'Quận 1, Hồ Chí Minh',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    roomType: 'double',
    gender: 'female',
    genderPreference: 'female',
    type: 'roommate-search',
    status: 'active',
    authorId: 'demo-user-123', // Demo user's posts
    authorName: 'Demo User',
    authorPhone: '0901234567',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    images: ['/api/placeholder/400/300']
  },
  {
    id: 'mock2',
    title: 'Nam tìm bạn cùng phòng gần ĐH Bách Khoa',
    description: 'Căn hộ mini 2 phòng ngủ, đầy đủ nội thất, gần trường học.',
    price: 2800000,
    budget: 2800000,
    location: 'Quận 3, Hồ Chí Minh',
    district: 'Quận 3',
    city: 'Hồ Chí Minh',
    roomType: 'apartment',
    gender: 'male',
    genderPreference: 'male',
    type: 'roommate-search',
    status: 'active',
    authorId: 'other-user-456', // Other user's posts
    authorName: 'Việt Nam',
    authorPhone: '0902345678',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    images: ['/api/placeholder/400/300']
  },
  {
    id: 'mock3',
    title: 'Demo Post - Tìm bạn ghép trọ quận Bình Thạnh',
    description: 'Phòng trọ yên tĩnh, an ninh tốt, phù hợp sinh viên nghiêm túc.',
    price: 3200000,
    budget: 3200000,
    location: 'Quận Bình Thạnh, Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    city: 'Hồ Chí Minh',
    roomType: 'single',
    gender: 'female',
    genderPreference: 'female',
    type: 'roommate-search',
    status: 'active',
    authorId: 'demo-user-123', // Demo user's posts
    authorName: 'Demo User',
    authorPhone: '0903456789',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
    images: ['/api/placeholder/400/300']
  }
];

const getMockPosts = (options = {}) => {
  return {
    posts: mockPostsStorage,
    totalPages: 1,
    total: mockPostsStorage.length,
    currentPage: options.page || 1,
    hasMore: false
  };
};

function SearchPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, filters, sortBy, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      // Prepare search filters for Firebase
      const searchFilters = {
        search: searchTerm,
        ...filters,
        sortBy: sortBy,
        page: currentPage,
        limit: postsPerPage
      };

      console.log('Searching posts with filters:', searchFilters);

      // Use mock data directly
      const result = getMockPosts(searchFilters);
      
      setPosts(result.posts || []);
      setTotalPosts(result.total || result.posts?.length || 0);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (postId) => {
    setFavorites(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(1) + ' triệu';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGenderLabel = (gender) => {
    const genders = {
      'male': 'Nam',
      'female': 'Nữ'
    };
    return genders[gender] || 'Không quan trọng';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Bộ lọc</h2>
            </div>

            <div className="space-y-6">
              {/* SearchFilter Component */}
              <SearchFilter 
                onSearch={handleSearch} 
                onFilter={handleFilterChange} 
                initialFilters={filters} 
              />

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price">Giá tăng dần</option>
                  <option value="priceDesc">Giá giảm dần</option>
                  <option value="hasVideo">Có video</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Kết quả tìm kiếm
                </h1>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {totalPosts} tin đăng
                </p>
              </div>
              
              {searchTerm && (
                <div className="mt-4 sm:mt-0">
                  <span className="text-sm text-gray-500">
                    Từ khóa: <span className="font-medium text-blue-600">"{searchTerm}"</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Post Image */}
                    <div className="relative">
                      <img
                        src={post.images?.[0] || '/placeholder-image.jpg'}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => toggleFavorite(post.id)}
                          className={`p-2 rounded-full ${
                            favorites.includes(post.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-600 hover:text-red-500'
                          } transition-colors`}
                        >
                          <Heart size={16} />
                        </button>
                        <div className="p-2 bg-white rounded-full text-gray-600">
                          <Eye size={16} />
                        </div>
                      </div>
                      {post.hasVideo && (
                        <div className="absolute top-3 left-3">
                          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            Có video
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          <Link to={`/post/${post.id}`} className="hover:text-blue-600">
                            {post.title}
                          </Link>
                        </h3>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star size={16} fill="currentColor" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          <span className="text-sm">{post.location || post.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={16} className="mr-2" />
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(post.price || post.budget)}/tháng
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users size={16} className="mr-2" />
                          <span className="text-sm">{getGenderLabel(post.genderPreference)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          <span className="text-sm">{formatDate(post.createdAt)}</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      {post.amenities && post.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.amenities.slice(0, 4).map((amenity, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {amenity}
                            </span>
                          ))}
                          {post.amenities.length > 4 && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{post.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/post/${post.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {posts.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalPosts / postsPerPage)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPosts; <environment_details>
# VSCode Visible Files
src/pages/SearchPosts.jsx

# VSCode Open Tabs
src/utils/constants.js
src/pages/CreatePost.jsx
src/pages/EditPost.jsx
src/pages/Home.jsx
src/pages/PostDetail.jsx
src/pages/MyPosts.jsx
src/pages/SearchPosts.jsx
src/components/SearchFilter.jsx
src/utils/firebase.js
src/components/NotificationDropdown.jsx
src/pages/Connections.jsx
src/pages/MyConnections.jsx
src/components/ConnectionModal.jsx
src/App.jsx

# Current Time
7/15/2025, 12:47:33 AM (Asia/Bangkok, UTC+7:00)

# Context Window Usage
676,374 / 1,048.576K tokens used (65%)

# Current Mode
ACT MODE
</environment_details>
