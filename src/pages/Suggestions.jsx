import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
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
import db from '../../db.json'; // Import data from db.json

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Mock user preferences (in real app, get from user profile)
  const userPreferences = {
    desiredBudget: 3500000, // Ngân sách
    desiredLocation: "Quận 1", // Khu vực mong muốn
    desiredGender: "female", // Giới tính mong muốn
    desiredLifestyle: ["Sạch sẽ", "Yên tĩnh", "Học tập nhiều", "Không hút thuốc", "Thích nấu ăn"], // Lối sống mong muốn
    desiredInterests: ["Đọc sách", "Xem phim", "Nấu ăn"], // Sở thích
  };

  useEffect(() => {
    fetchSuggestions();
  }, [searchTerm, filters]);

  const fetchSuggestions = async () => {
    setLoading(true);
    
    try {
      // Use posts data from db.json
      const allPostsFromDb = db.posts;

      // Apply search and filters to db data
      let filteredPosts = allPostsFromDb.filter(post => {
        const matchesSearch = searchTerm ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesCategory = filters.category ? post.category === filters.category : true;
        const matchesMinPrice = filters.minPrice ? post.price >= filters.minPrice : true;
        const matchesMaxPrice = filters.maxPrice ? post.price <= filters.maxPrice : true;
        const matchesLocation = filters.location ? (post.location && post.location.toLowerCase().includes(filters.location.toLowerCase())) || (post.district && post.district.toLowerCase().includes(filters.location.toLowerCase())) : true;
        const matchesGender = filters.genderPreference ? post.genderPreference === filters.genderPreference : true;
        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesLocation && matchesGender;
      });

      const allPosts = filteredPosts;
      
      // Calculate match scores based on user preferences
      const postsWithScores = allPosts.map(post => {
        let matchScore = 0;
        
        // Budget compatibility (25% weight)
        if (post.price && userPreferences.desiredBudget) {
          const budgetDiff = Math.abs(post.price - userPreferences.desiredBudget);
          const budgetScore = Math.max(0, 100 - (budgetDiff / userPreferences.desiredBudget * 100));
          matchScore += budgetScore * 0.25;
        }
        
        // Location match (20% weight)
        if (userPreferences.desiredLocation) {
          const desiredLocationLower = userPreferences.desiredLocation.toLowerCase();
          if (post.district && post.district.toLowerCase().includes(desiredLocationLower)) {
            matchScore += 20;
          } else if (post.location && post.location.toLowerCase().includes(desiredLocationLower)) {
            matchScore += 10; // Slightly lower score if only city matches, not district
          }
        }
        
        // Gender compatibility (15% weight)
        if (userPreferences.desiredGender === 'any') {
          matchScore += 15;
        } else if (post.genderPreference && (post.genderPreference === 'any' || post.genderPreference === userPreferences.desiredGender)) {
          matchScore += 15;
        }
        
        // Lifestyle compatibility (20% weight)
        if (userPreferences.desiredLifestyle && userPreferences.desiredLifestyle.length > 0) {
          let postAttributesForLifestyle = [];
          if (post.lifestyle && Array.isArray(post.lifestyle)) {
            postAttributesForLifestyle = post.lifestyle;
          } else if (post.amenities && Array.isArray(post.amenities)) {
            postAttributesForLifestyle = post.amenities.map(amenity => {
              if (amenity.toLowerCase().includes('yên tĩnh') || amenity.toLowerCase().includes('máy lạnh')) return 'Yên tĩnh';
              if (amenity.toLowerCase().includes('học tập nhiều') || amenity.toLowerCase().includes('wifi')) return 'Học tập nhiều';
              if (amenity.toLowerCase().includes('thích nấu ăn') || amenity.toLowerCase().includes('bếp')) return 'Thích nấu ăn';
              if (amenity.toLowerCase().includes('sạch sẽ')) return 'Sạch sẽ';
              if (amenity.toLowerCase().includes('không hút thuốc')) return 'Không hút thuốc';
              return null;
            }).filter(Boolean);
          }

          if (postAttributesForLifestyle.length > 0) {
            const commonLifestyles = postAttributesForLifestyle.filter(attr => 
              userPreferences.desiredLifestyle.includes(attr)
            );
            matchScore += (commonLifestyles.length / userPreferences.desiredLifestyle.length) * 20;
          }
        }

        // Interests overlap (20% weight)
        if (post.interests && userPreferences.desiredInterests && userPreferences.desiredInterests.length > 0) {
          const commonInterests = post.interests.filter(interest => 
            userPreferences.desiredInterests.includes(interest)
          );
          matchScore += (commonInterests.length / userPreferences.desiredInterests.length) * 20;
        }
        
        return {
          ...post,
          matchScore: Math.min(100, Math.max(0, matchScore))
        };
      });
      
      // Sort by match score and filter out low scores
      const sortedSuggestions = postsWithScores
        .filter(post => post.matchScore > 30)
        .sort((a, b) => b.matchScore - a.matchScore);
      
      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSuggestions = async () => {
    setRefreshing(true);
    
    try {
      // Re-fetch suggestions from mock data
      await fetchSuggestions();
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
    if (filterType === 'budget-friendly') return suggestion.price <= userPreferences.desiredBudget;
    if (filterType === 'nearby') return suggestion.location === userPreferences.desiredLocation;
    return true;
  });

  // Since currentUser and login are Firebase-related, we'll remove this block
  // and assume the user is always "logged in" for the purpose of suggestions.
  // if (!currentUser) {
  //   return (
  //     <div className="text-center py-12">
  //       <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  //       <h2 className="text-2xl font-bold text-gray-900 mb-2">Gợi ý AI</h2>
  //       <p className="text-gray-600 mb-6">
  //         Đăng nhập để nhận được gợi ý bạn ghép trọ phù hợp nhất
  //       </p>
  //       <Link 
  //         to="/login" 
  //         className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
  //       >
  //         Đăng nhập ngay
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Home className="mr-3" />
              Gợi ý phòng trọ
            </h1>
          </div>
          <button
            onClick={refreshSuggestions}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Bộ lọc</h2>
            
            {/* SearchFilter Component */}
            <div className="mb-6">
              <SearchFilter 
                onSearch={handleSearch}
                onFilter={handleFilterChange}
                initialFilters={filters}
              />
            </div>

            {/* Filter Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại gợi ý
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả gợi ý</option>
                <option value="high-match">Phù hợp cao</option>
                <option value="budget-friendly">Phù hợp ngân sách</option>
                <option value="nearby">Gần đây</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Gợi ý cho bạn
                </h2>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {filteredSuggestions.length} gợi ý phù hợp
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
          ) : filteredSuggestions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Brain size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Không tìm thấy gợi ý phù hợp
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi bộ lọc hoặc cập nhật sở thích của bạn
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                  setFilterType('all');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Match Score Badge */}
                  <div className="relative">
                    <img
                      src={suggestion.images?.[0] || '/placeholder-image.jpg'}
                      alt={suggestion.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(suggestion.matchScore)}`}>
                        {suggestion.matchScore}% {getMatchScoreLabel(suggestion.matchScore)}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(suggestion.id)}
                        className={`p-2 rounded-full ${
                          favorites.includes(suggestion.id)
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
                    {suggestion.hasVideo && (
                      <div className="absolute bottom-3 left-3">
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
                        <Link to={`/post/${suggestion.id}`} className="hover:text-blue-600">
                          {suggestion.title}
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
                        <span className="text-sm">{suggestion.location || suggestion.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        <span className="text-sm font-semibold text-green-600">
                          {formatPrice(suggestion.price || suggestion.budget)}/tháng
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2" />
                        <span className="text-sm">{getGenderLabel(suggestion.genderPreference)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm">{new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {suggestion.amenities && suggestion.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {suggestion.amenities.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                        {suggestion.amenities.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{suggestion.amenities.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/post/${suggestion.id}`}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
