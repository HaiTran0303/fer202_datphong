import React, { useState, useEffect } from 'react';
import { postsService } from '../utils/firebase';
import PostCard from '../components/PostCard';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [totalPosts, setTotalPosts] = useState(0);

  const provinces = [
    'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 
    'Khánh Hòa', 'Hải Phòng', 'Long An', 'Quảng Nam', 'Bà Rịa - Vũng Tàu', 
    'Đắk Lắk', 'Cà Mau', 'Thừa Thiên Huế', 'Kiên Giang', 'Lâm Đồng'
  ];

  useEffect(() => {
    loadPosts();
  }, [filters, currentPage, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await postsService.getPosts({
        ...filters,
        page: currentPage,
        limit: 20,
        sortBy
      });
      
      setPosts(result.posts);
      setTotalPages(result.totalPages);
      setTotalPosts(result.total);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Có lỗi xảy ra</div>
          <button 
            onClick={loadPosts}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Cho thuê phòng trọ, nhà nguyên căn, căn hộ
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Hiện có <span className="font-semibold text-orange-500">{totalPosts.toLocaleString()}</span> tin đăng
          </p>

          {/* Province Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Tỉnh thành
            </h3>
            <div className="flex overflow-x-auto gap-2 pb-2">
              {provinces.map((province) => (
                <button
                  key={province}
                  onClick={() => handleFilterChange({ ...filters, location: province })}
                  className="flex-shrink-0 bg-white border border-gray-200 rounded px-4 py-3 text-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs text-gray-500">Phòng trọ</div>
                  <div className="font-medium text-gray-800">{province}</div>
                </button>
              ))}
              <button className="flex-shrink-0 bg-white border border-gray-200 rounded px-4 py-3 text-sm text-blue-600 hover:shadow-md transition-shadow">
                Tất cả
                <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sort Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => handleSortChange('createdAt')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  sortBy === 'createdAt'
                    ? 'text-gray-800 border-gray-800'
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                Đề xuất
              </button>
              <button
                onClick={() => handleSortChange('newest')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  sortBy === 'newest'
                    ? 'text-gray-800 border-gray-800'
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                Mới đăng
              </button>
              <button
                onClick={() => handleSortChange('hasVideo')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  sortBy === 'hasVideo'
                    ? 'text-gray-800 border-gray-800'
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                Có video
              </button>
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded p-4 shadow-sm animate-pulse">
                  <div className="flex space-x-4">
                    <div className="bg-gray-200 rounded w-48 h-36"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded p-12 text-center shadow-sm">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy bài đăng nào</h3>
              <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button
                onClick={() => {
                  setFilters({});
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && posts.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Search Filter */}
          <SearchFilter onFilterChange={handleFilterChange} />

          {/* Price Filter */}
          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="font-medium text-gray-800 mb-3">Xem theo khoảng giá</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Dưới 1 triệu', max: 1000000 },
                { label: 'Từ 1 - 2 triệu', min: 1000000, max: 2000000 },
                { label: 'Từ 2 - 3 triệu', min: 2000000, max: 3000000 },
                { label: 'Từ 3 - 5 triệu', min: 3000000, max: 5000000 },
                { label: 'Từ 5 - 7 triệu', min: 5000000, max: 7000000 },
                { label: 'Trên 7 triệu', min: 7000000 }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange({ 
                    ...filters, 
                    priceMin: range.min, 
                    priceMax: range.max 
                  })}
                  className="text-left text-sm text-gray-600 hover:text-gray-800 py-1 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>

            <h3 className="font-medium text-gray-800 mb-3 mt-6">Xem theo diện tích</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Dưới 20 m²', max: 20 },
                { label: 'Từ 20 - 30m²', min: 20, max: 30 },
                { label: 'Từ 30 - 50m²', min: 30, max: 50 },
                { label: 'Trên 50m²', min: 50 }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange({ 
                    ...filters, 
                    areaMin: range.min, 
                    areaMax: range.max 
                  })}
                  className="text-left text-sm text-gray-600 hover:text-gray-800 py-1 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="font-medium text-gray-800 mb-4">Tin mới đăng</h3>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex space-x-3">
                  <img
                    src={post.images?.[0] || '/placeholder-image.jpg'}
                    alt={post.title}
                    className="w-20 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-2 cursor-pointer">
                      {post.title}
                    </h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-semibold text-green-600">
                        {post.price?.toLocaleString()} đ/tháng
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="font-medium text-gray-800 mb-4">Bài viết mới</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors block py-1">
                  5 điều cần lưu ý khi thuê phòng trọ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors block py-1">
                  Hướng dẫn tính tiền điện nước phòng trọ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors block py-1">
                  Kinh nghiệm thuê phòng trọ cho sinh viên
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors block py-1">
                  Những khu vực cho thuê phòng trọ giá rẻ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 