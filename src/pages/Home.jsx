import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, AlertCircle, TrendingUp, Users, Home as HomeIcon, MapPin } from 'lucide-react';
import { postsService, statsService, LOCATIONS, CATEGORIES } from '../utils/firebase';
import { seedPosts } from '../utils/seedData';
import SearchFilter from '../components/SearchFilter';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';

function Home() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  
  const pageSize = 6;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load posts when filters change
  useEffect(() => {
    if (searchTerm || Object.keys(filters).length > 0) {
      handleSearch();
    } else {
      loadPosts(1);
    }
  }, [filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load posts and featured posts in parallel
      const [postsResult, featuredResult, statsResult] = await Promise.all([
        postsService.getPosts(pageSize),
        postsService.getFeaturedPosts(3),
        statsService.getStats().catch(() => ({ totalPosts: 0, totalUsers: 0 }))
      ]);

      setPosts(postsResult.posts);
      setLastDoc(postsResult.lastDoc);
      setHasNextPage(postsResult.hasMore);
      setTotalPages(Math.ceil(postsResult.posts.length / pageSize));
      
      setFeaturedPosts(featuredResult);
      setStats(statsResult);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      
      // If no data found, offer to seed
      if (error.message?.includes('No posts found') || posts.length === 0) {
        setError('no-data');
      } else {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (page = 1, resetData = true) => {
    try {
      setSearchLoading(true);
      
      const result = await postsService.getPosts(
        pageSize,
        page === 1 ? null : lastDoc,
        filters
      );

      if (resetData) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      
      setLastDoc(result.lastDoc);
      setHasNextPage(result.hasMore);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Không thể tải tin đăng. Vui lòng thử lại sau.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async (term = searchTerm) => {
    try {
      setSearchLoading(true);
      setSearchTerm(term);
      
      let result;
      if (term) {
        result = await postsService.searchPosts(term, filters);
        setPosts(result);
        setHasNextPage(false);
        setCurrentPage(1);
      } else {
        result = await postsService.getPosts(pageSize, null, filters);
        setPosts(result.posts);
        setLastDoc(result.lastDoc);
        setHasNextPage(result.hasMore);
        setCurrentPage(1);
      }
      
    } catch (error) {
      console.error('Error searching posts:', error);
      setError('Không thể tìm kiếm. Vui lòng thử lại sau.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setLastDoc(null);
  };

  const handlePageChange = (page) => {
    loadPosts(page, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostLike = async (postId) => {
    // Implement like functionality
    console.log('Liked post:', postId);
  };

  const handlePostView = async (postId) => {
    // Implement view tracking
    console.log('Viewed post:', postId);
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      const success = await seedPosts();
      if (success) {
        await loadInitialData();
        setError(null);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      setError('Không thể tạo dữ liệu mẫu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Error state
  if (error === 'no-data') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chưa có dữ liệu
          </h2>
          <p className="text-gray-600 mb-6">
            Hệ thống chưa có tin đăng nào. Bạn có muốn tạo dữ liệu mẫu không?
          </p>
          <button
            onClick={handleSeedData}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Tạo dữ liệu mẫu
          </button>
        </div>
      </div>
    );
  }

  if (error && error !== 'no-data') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadInitialData}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kênh thông tin Phòng Trọ số 1 Việt Nam
        </h1>
        <p className="text-gray-600">
          Có {stats.totalPosts || '73,876'} tin đăng cho thuê
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HomeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tin đăng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts || '200K+'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || '130K+'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tin mới/ngày</p>
              <p className="text-2xl font-bold text-gray-900">1K+</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Khu vực</p>
              <p className="text-2xl font-bold text-gray-900">{LOCATIONS.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Location Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tìm theo khu vực</h3>
        <div className="flex overflow-x-auto pb-2 space-x-3">
          {LOCATIONS.slice(0, 6).map((location) => (
            <button
              key={location}
              onClick={() => handleFilter({ location })}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-colors ${
                filters.location === location
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialFilters={filters}
      />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tin nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onView={handlePostView}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tất cả tin đăng
          </button>
          <button
            onClick={() => setActiveTab('newest')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'newest'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mới nhất
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'featured'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nổi bật
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && (
        <>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-in fade-in duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard
                      post={post}
                      onLike={handlePostLike}
                      onView={handlePostView}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNextPage={hasNextPage}
                hasPreviousPage={currentPage > 1}
                isLoading={searchLoading}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <HomeIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy tin đăng
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                  loadInitialData();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Xem tất cả tin đăng
              </button>
            </div>
          )}
        </>
      )}

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tại sao lại chọn FPTro?
        </h2>
        <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
          Chúng tôi biết bạn có rất nhiều lựa chọn, nhưng FPTro tự hào là trang web đứng top về các từ khóa: 
          cho thuê phòng trọ, nhà trọ, thuê nhà nguyên căn, cho thuê căn hộ, tìm người ở ghép, cho thuê mặt bằng...
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">130.000+</div>
            <div className="text-sm text-gray-600">Chủ nhà & Môi giới</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">200.000+</div>
            <div className="text-sm text-gray-600">Tin đăng</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">1.000+</div>
            <div className="text-sm text-gray-600">Tin đăng/ngày</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">3.000.000+</div>
            <div className="text-sm text-gray-600">Lượt xem/tháng</div>
          </div>
        </div>

        <Link 
          to="/create-post"
          className="inline-flex items-center px-8 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-semibold text-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Đăng tin ngay
        </Link>
      </div>
    </div>
  );
}

export default Home; 