import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function SearchPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    district: '',
    gender: '',
    roomType: '',
    amenities: []
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const postsPerPage = 9;

  // Mock data for demonstration
  const mockPosts = [
    {
      id: 1,
      title: "Tìm bạn nữ ghép trọ quận 1",
      description: "Phòng trọ đẹp, đầy đủ tiện nghi, gần trường ĐH Khoa học Tự nhiên. Tìm bạn nữ sạch sẽ, thân thiện.",
      price: 3500000,
      location: "123 Nguyễn Huệ",
      district: "Quận 1",
      city: "Hồ Chí Minh",
      roomType: "double",
      gender: "female",
      maxPeople: 2,
      availableFrom: "2024-02-01",
      amenities: ["wifi", "ac", "washing", "security"],
      rules: ["Không hút thuốc", "Giữ yên tĩnh sau 22h", "Dọn dẹp chung"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Minh Anh",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      createdAt: "2024-01-15T10:30:00Z",
      views: 145,
      likes: 12
    },
    {
      id: 2,
      title: "Nam tìm bạn cùng phòng gần ĐH Bách Khoa",
      description: "Căn hộ mini 2 phòng ngủ, đầy đủ nội thất, gần trường học và các tiện ích.",
      price: 2800000,
      location: "456 Võ Văn Ngân",
      district: "Quận 3",
      city: "Hồ Chí Minh",
      roomType: "apartment",
      gender: "male",
      maxPeople: 2,
      availableFrom: "2024-02-15",
      amenities: ["wifi", "kitchen", "parking", "elevator"],
      rules: ["Không tiệc tùng", "Chia sẻ chi phí sinh hoạt"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Việt Nam",
        avatar: "/api/placeholder/40/40",
        verified: false
      },
      createdAt: "2024-01-14T15:45:00Z",
      views: 203,
      likes: 8
    },
    {
      id: 3,
      title: "Nữ tìm bạn ghép trọ quận Bình Thạnh",
      description: "Phòng trọ yên tĩnh, an ninh tốt, gần chợ và trường học. Phù hợp cho sinh viên nghiêm túc.",
      price: 3200000,
      location: "789 Xô Viết Nghệ Tĩnh",
      district: "Quận Bình Thạnh",
      city: "Hồ Chí Minh",
      roomType: "single",
      gender: "female",
      maxPeople: 2,
      availableFrom: "2024-01-25",
      amenities: ["wifi", "ac", "washing"],
      rules: ["Không hút thuốc", "Không uống rượu", "Học tập nhiều"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Thu Hà",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      createdAt: "2024-01-13T09:20:00Z",
      views: 98,
      likes: 15
    },
    {
      id: 4,
      title: "Tìm bạn ở ghép studio quận 7",
      description: "Studio mới xây, view đẹp, đầy đủ tiện nghi hiện đại. Phù hợp cho 2 người bạn thân.",
      price: 4500000,
      location: "321 Nguyễn Thị Thập",
      district: "Quận 7",
      city: "Hồ Chí Minh",
      roomType: "studio",
      gender: "",
      maxPeople: 2,
      availableFrom: "2024-02-10",
      amenities: ["wifi", "ac", "washing", "kitchen", "elevator", "security"],
      rules: ["Sạch sẽ", "Thân thiện", "Không tiệc tùng"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Quang Minh",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      createdAt: "2024-01-12T14:15:00Z",
      views: 267,
      likes: 23
    },
    {
      id: 5,
      title: "Phòng trọ sinh viên quận 10",
      description: "Phòng trọ giá rẻ, phù hợp sinh viên, gần trường ĐH Công nghiệp. Môi trường học tập tốt.",
      price: 2200000,
      location: "654 Sư Vạn Hạnh",
      district: "Quận 10",
      city: "Hồ Chí Minh",
      roomType: "dorm",
      gender: "",
      maxPeople: 4,
      availableFrom: "2024-01-30",
      amenities: ["wifi", "washing"],
      rules: ["Học tập nhiều", "Giữ yên tĩnh", "Dọn dẹp chung"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Hoàng Long",
        avatar: "/api/placeholder/40/40",
        verified: false
      },
      createdAt: "2024-01-11T11:30:00Z",
      views: 156,
      likes: 9
    },
    {
      id: 6,
      title: "Căn hộ 2 phòng ngủ quận 2",
      description: "Căn hộ mới, đầy đủ nội thất, view sông, gần khu Thủ Thiêm. Tìm 1 bạn chia sẻ.",
      price: 5000000,
      location: "888 Đỗ Xuân Hợp",
      district: "Quận 2",
      city: "Hồ Chí Minh",
      roomType: "apartment",
      gender: "",
      maxPeople: 2,
      availableFrom: "2024-02-05",
      amenities: ["wifi", "ac", "washing", "kitchen", "elevator", "security", "parking"],
      rules: ["Sạch sẽ", "Thân thiện", "Chia sẻ chi phí"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Phương Linh",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      createdAt: "2024-01-10T16:45:00Z",
      views: 189,
      likes: 18
    }
  ];

  const amenitiesOptions = [
    { id: 'wifi', label: 'WiFi', icon: <Wifi size={16} /> },
    { id: 'parking', label: 'Chỗ đậu xe', icon: <Car size={16} /> },
    { id: 'kitchen', label: 'Nhà bếp', icon: <Coffee size={16} /> },
    { id: 'tv', label: 'TV', icon: <Tv size={16} /> },
    { id: 'ac', label: 'Điều hòa', icon: <Snowflake size={16} /> },
    { id: 'washing', label: 'Máy giặt', icon: <Shirt size={16} /> },
    { id: 'security', label: 'Bảo vệ 24/7', icon: <CheckCircle size={16} /> },
    { id: 'elevator', label: 'Thang máy', icon: <Home size={16} /> }
  ];

  const districts = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6',
    'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12',
    'Quận Bình Thạnh', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú',
    'Quận Gò Vấp'
  ];

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, filters, sortBy]);

  const fetchPosts = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredPosts = mockPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             post.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrice = (!filters.priceMin || post.price >= parseInt(filters.priceMin)) &&
                             (!filters.priceMax || post.price <= parseInt(filters.priceMax));
        
        const matchesDistrict = !filters.district || post.district === filters.district;
        const matchesGender = !filters.gender || post.gender === filters.gender || !post.gender;
        const matchesRoomType = !filters.roomType || post.roomType === filters.roomType;
        
        const matchesAmenities = filters.amenities.length === 0 || 
                                filters.amenities.every(amenity => post.amenities.includes(amenity));

        return matchesSearch && matchesPrice && matchesDistrict && matchesGender && matchesRoomType && matchesAmenities;
      });

      // Sort posts
      filteredPosts.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'popular':
            return b.views - a.views;
          default:
            return 0;
        }
      });

      setPosts(filteredPosts);
      setLoading(false);
    }, 500);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
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

  const getRoomTypeLabel = (roomType) => {
    const types = {
      'single': 'Phòng đơn',
      'double': 'Phòng đôi',
      'dorm': 'Phòng tập thể',
      'studio': 'Studio',
      'apartment': 'Căn hộ'
    };
    return types[roomType] || roomType;
  };

  const getGenderLabel = (gender) => {
    const genders = {
      'male': 'Nam',
      'female': 'Nữ'
    };
    return genders[gender] || 'Không quan trọng';
  };

  // Pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Bộ lọc</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter size={20} />
              </button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập từ khóa..."
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá (triệu VNĐ)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quận/Huyện
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả quận</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại phòng
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả loại</option>
                  <option value="single">Phòng đơn</option>
                  <option value="double">Phòng đôi</option>
                  <option value="dorm">Phòng tập thể</option>
                  <option value="studio">Studio</option>
                  <option value="apartment">Căn hộ</option>
                </select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện ích
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesOptions.map(amenity => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-2 text-xs rounded-md border flex items-center space-x-1 ${
                        filters.amenities.includes(amenity.id)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {amenity.icon}
                      <span>{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({
                    priceMin: '',
                    priceMax: '',
                    district: '',
                    gender: '',
                    roomType: '',
                    amenities: []
                  });
                  setSearchTerm('');
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Tìm bạn ghép trọ
                </h1>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {posts.length} bài đăng phù hợp
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Sắp xếp theo:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price-low">Giá thấp → cao</option>
                  <option value="price-high">Giá cao → thấp</option>
                  <option value="popular">Phổ biến</option>
                </select>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy bài đăng nào
              </h3>
              <p className="text-gray-600">
                Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(post.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        favorites.includes(post.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={16} fill={favorites.includes(post.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(post.price)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Eye size={12} className="mr-1" />
                        {post.views}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        <span>{post.district}</span>
                      </div>
                      <div className="flex items-center">
                        <Home size={14} className="mr-1" />
                        <span>{getRoomTypeLabel(post.roomType)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{getGenderLabel(post.gender)} - {post.maxPeople} người</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>Từ {formatDate(post.availableFrom)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-3 pt-3 border-t">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <CheckCircle size={14} className="ml-1 text-green-500" />
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Link
                        to={`/post/${post.id}`}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors block text-center"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => goToPage(index + 1)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPosts; 