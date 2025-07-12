import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Star, 
  Heart, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  Eye,
  CheckCircle,
  Home,
  Sparkles,
  RefreshCw,
  Filter,
  TrendingUp
} from 'lucide-react';

function Suggestions() {
  const { currentUser } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // Mock user preferences (in real app, get from user profile)
  const userPreferences = {
    budget: 3500000,
    district: "Quận 1",
    gender: "female",
    roomType: "double",
    interests: ["Đọc sách", "Xem phim", "Yoga"],
    lifestyle: ["Sạch sẽ", "Yên tĩnh", "Học tập nhiều"]
  };

  // Mock suggestions data
  const mockSuggestions = [
    {
      id: 1,
      title: "Tìm bạn nữ ghép trọ quận 1",
      description: "Phòng trọ đẹp, đầy đủ tiện nghi, gần trường ĐH Khoa học Tự nhiên.",
      price: 3500000,
      location: "123 Nguyễn Huệ",
      district: "Quận 1",
      city: "Hồ Chí Minh",
      roomType: "double",
      gender: "female",
      maxPeople: 2,
      availableFrom: "2024-02-01",
      amenities: ["wifi", "ac", "washing", "security"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Minh Anh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        commonInterests: ["Đọc sách", "Yoga"],
        lifestyle: ["Sạch sẽ", "Yên tĩnh"]
      },
      createdAt: "2024-01-15T10:30:00Z",
      views: 145,
      likes: 12,
      matchScore: 95,
      matchReasons: [
        "Cùng giới tính và ngân sách phù hợp",
        "Có 2 sở thích chung",
        "Lối sống tương đồng",
        "Vị trí gần trường học"
      ]
    },
    {
      id: 2,
      title: "Nữ tìm bạn ghép trọ quận Bình Thạnh",
      description: "Phòng trọ yên tĩnh, an ninh tốt, phù hợp cho sinh viên nghiêm túc.",
      price: 3200000,
      location: "789 Xô Viết Nghệ Tĩnh",
      district: "Quận Bình Thạnh",
      city: "Hồ Chí Minh",
      roomType: "single",
      gender: "female",
      maxPeople: 2,
      availableFrom: "2024-01-25",
      amenities: ["wifi", "ac", "washing"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Thu Hà",
        avatar: "/api/placeholder/40/40",
        verified: true,
        commonInterests: ["Đọc sách", "Xem phim"],
        lifestyle: ["Yên tĩnh", "Học tập nhiều"]
      },
      createdAt: "2024-01-13T09:20:00Z",
      views: 98,
      likes: 15,
      matchScore: 88,
      matchReasons: [
        "Ngân sách phù hợp",
        "Có 2 sở thích chung",
        "Lối sống học tập nghiêm túc",
        "Môi trường yên tĩnh"
      ]
    },
    {
      id: 3,
      title: "Studio mới xây quận 7",
      description: "Studio đẹp, view sông, đầy đủ tiện nghi hiện đại.",
      price: 4000000,
      location: "321 Nguyễn Thị Thập",
      district: "Quận 7",
      city: "Hồ Chí Minh",
      roomType: "studio",
      gender: "",
      maxPeople: 2,
      availableFrom: "2024-02-10",
      amenities: ["wifi", "ac", "washing", "kitchen", "elevator"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Quang Minh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        commonInterests: ["Xem phim"],
        lifestyle: ["Sạch sẽ"]
      },
      createdAt: "2024-01-12T14:15:00Z",
      views: 267,
      likes: 23,
      matchScore: 82,
      matchReasons: [
        "Chất lượng phòng cao",
        "Có 1 sở thích chung",
        "Lối sống tương đồng",
        "Tiện ích đầy đủ"
      ]
    },
    {
      id: 4,
      title: "Phòng trọ sinh viên quận 3",
      description: "Gần trường ĐH Bách Khoa, môi trường học tập tốt.",
      price: 2800000,
      location: "456 Võ Văn Ngân",
      district: "Quận 3",
      city: "Hồ Chí Minh",
      roomType: "double",
      gender: "female",
      maxPeople: 2,
      availableFrom: "2024-02-15",
      amenities: ["wifi", "kitchen", "washing"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Lan Anh",
        avatar: "/api/placeholder/40/40",
        verified: false,
        commonInterests: ["Đọc sách"],
        lifestyle: ["Học tập nhiều"]
      },
      createdAt: "2024-01-14T15:45:00Z",
      views: 203,
      likes: 8,
      matchScore: 78,
      matchReasons: [
        "Ngân sách thấp hơn dự kiến",
        "Có 1 sở thích chung",
        "Môi trường học tập tốt",
        "Gần trường học"
      ]
    },
    {
      id: 5,
      title: "Căn hộ cao cấp quận 2",
      description: "Căn hộ mới, view đẹp, đầy đủ nội thất.",
      price: 5000000,
      location: "888 Đỗ Xuân Hợp",
      district: "Quận 2",
      city: "Hồ Chí Minh",
      roomType: "apartment",
      gender: "",
      maxPeople: 2,
      availableFrom: "2024-02-05",
      amenities: ["wifi", "ac", "washing", "kitchen", "elevator", "security"],
      images: ["/api/placeholder/400/300"],
      author: {
        name: "Phương Linh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        commonInterests: ["Yoga"],
        lifestyle: ["Sạch sẽ"]
      },
      createdAt: "2024-01-10T16:45:00Z",
      views: 189,
      likes: 18,
      matchScore: 75,
      matchReasons: [
        "Chất lượng cao",
        "Có 1 sở thích chung",
        "Lối sống tương đồng",
        "Tiện ích đầy đủ"
      ]
    }
  ];

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Sort by match score
      const sortedSuggestions = [...mockSuggestions].sort((a, b) => b.matchScore - a.matchScore);
      setSuggestions(sortedSuggestions);
      setLoading(false);
    }, 2000);
  };

  const refreshSuggestions = async () => {
    setRefreshing(true);
    
    // Simulate generating new suggestions
    setTimeout(() => {
      // Shuffle and re-score
      const shuffled = [...mockSuggestions].sort(() => Math.random() - 0.5);
      const rescored = shuffled.map(item => ({
        ...item,
        matchScore: Math.max(60, Math.floor(Math.random() * 40) + 60)
      }));
      
      setSuggestions(rescored.sort((a, b) => b.matchScore - a.matchScore));
      setRefreshing(false);
    }, 2000);
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

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getMatchScoreLabel = (score) => {
    if (score >= 90) return 'Rất phù hợp';
    if (score >= 80) return 'Phù hợp';
    if (score >= 70) return 'Khá phù hợp';
    return 'Có thể phù hợp';
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filterType === 'all') return true;
    if (filterType === 'high-match') return suggestion.matchScore >= 85;
    if (filterType === 'budget-friendly') return suggestion.price <= userPreferences.budget;
    if (filterType === 'nearby') return suggestion.district === userPreferences.district;
    return true;
  });

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gợi ý AI</h2>
        <p className="text-gray-600 mb-6">
          Đăng nhập để nhận được gợi ý bạn ghép trọ phù hợp nhất
        </p>
        <Link 
          to="/login" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Brain className="mr-3" size={32} />
              Gợi ý AI cho bạn
            </h1>
            <p className="text-blue-100 text-lg">
              Tìm được {filteredSuggestions.length} bạn ghép trọ phù hợp dựa trên sở thích của bạn
            </p>
          </div>
          
          <button
            onClick={refreshSuggestions}
            disabled={refreshing}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-md flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Đang tạo gợi ý...' : 'Làm mới gợi ý'}</span>
          </button>
        </div>
      </div>

      {/* User Preferences Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tiêu chí của bạn</h2>
          <Link 
            to="/profile" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Chỉnh sửa tiêu chí
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <DollarSign className="text-gray-600 mb-2" size={20} />
            <div className="text-sm text-gray-600">Ngân sách</div>
            <div className="font-semibold">{formatPrice(userPreferences.budget)}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <MapPin className="text-gray-600 mb-2" size={20} />
            <div className="text-sm text-gray-600">Khu vực</div>
            <div className="font-semibold">{userPreferences.district}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <Users className="text-gray-600 mb-2" size={20} />
            <div className="text-sm text-gray-600">Giới tính</div>
            <div className="font-semibold">{getGenderLabel(userPreferences.gender)}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <Home className="text-gray-600 mb-2" size={20} />
            <div className="text-sm text-gray-600">Loại phòng</div>
            <div className="font-semibold">{getRoomTypeLabel(userPreferences.roomType)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Filter className="mr-2" size={20} />
            Bộ lọc
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filterType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tất cả ({suggestions.length})
          </button>
          
          <button
            onClick={() => setFilterType('high-match')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filterType === 'high-match' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rất phù hợp ({suggestions.filter(s => s.matchScore >= 85).length})
          </button>
          
          <button
            onClick={() => setFilterType('budget-friendly')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filterType === 'budget-friendly' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Trong tầm giá ({suggestions.filter(s => s.price <= userPreferences.budget).length})
          </button>
          
          <button
            onClick={() => setFilterType('nearby')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filterType === 'nearby' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Gần bạn ({suggestions.filter(s => s.district === userPreferences.district).length})
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang phân tích và tìm kiếm gợi ý phù hợp...</p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy gợi ý phù hợp
          </h3>
          <p className="text-gray-600 mb-4">
            Hãy thử điều chỉnh tiêu chí hoặc làm mới để có gợi ý mới
          </p>
          <button
            onClick={refreshSuggestions}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Làm mới gợi ý
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.map((suggestion, index) => (
            <div key={suggestion.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={suggestion.images[0]}
                  alt={suggestion.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="absolute top-3 left-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(suggestion.matchScore)}`}>
                    <div className="flex items-center space-x-1">
                      <Star size={14} fill="currentColor" />
                      <span>{suggestion.matchScore}% - {getMatchScoreLabel(suggestion.matchScore)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleFavorite(suggestion.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    favorites.includes(suggestion.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={16} fill={favorites.includes(suggestion.id) ? 'currentColor' : 'none'} />
                </button>
                
                {index === 0 && (
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={14} />
                        <span>Gợi ý hàng đầu</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(suggestion.price)}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Eye size={12} className="mr-1" />
                    {suggestion.views}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {suggestion.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{suggestion.district}</span>
                  </div>
                  <div className="flex items-center">
                    <Home size={14} className="mr-1" />
                    <span>{getRoomTypeLabel(suggestion.roomType)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{getGenderLabel(suggestion.gender)} - {suggestion.maxPeople} người</span>
                  </div>
                </div>
                
                {/* Match Reasons */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Lý do phù hợp:</div>
                  <div className="space-y-1">
                    {suggestion.matchReasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <CheckCircle size={12} className="mr-1 text-green-500" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Common Interests */}
                {suggestion.author.commonInterests.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Sở thích chung:</div>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.author.commonInterests.map((interest, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mt-3 pt-3 border-t">
                  <img
                    src={suggestion.author.avatar}
                    alt={suggestion.author.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {suggestion.author.name}
                  </span>
                  {suggestion.author.verified && (
                    <CheckCircle size={14} className="ml-1 text-green-500" />
                  )}
                </div>
                
                <div className="mt-4">
                  <Link
                    to={`/post/${suggestion.id}`}
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
      
      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sparkles className="mr-2 text-purple-600" size={20} />
          Mẹo để tăng độ phù hợp
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">Cập nhật hồ sơ</h4>
            <p className="text-sm text-gray-600">
              Điền đầy đủ thông tin về sở thích, lối sống để AI có thể gợi ý chính xác hơn.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tương tác nhiều hơn</h4>
            <p className="text-sm text-gray-600">
              Thích, lưu và xem các bài đăng để hệ thống hiểu rõ hơn về sở thích của bạn.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">Điều chỉnh tiêu chí</h4>
            <p className="text-sm text-gray-600">
              Thử thay đổi ngân sách, khu vực để có thêm nhiều lựa chọn phù hợp.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">Làm mới thường xuyên</h4>
            <p className="text-sm text-gray-600">
              Hệ thống cập nhật gợi ý mới mỗi ngày dựa trên các bài đăng mới.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suggestions; 