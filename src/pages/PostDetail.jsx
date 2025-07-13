import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { postsService } from '../utils/firebase';
import { 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar, 
  Star,
  Heart,
  Eye,
  Share2,
  MessageCircle,
  Phone,
  ArrowLeft,
  CheckCircle,
  Home,
  Wifi,
  Car,
  Coffee,
  Tv,
  Snowflake,
  Shirt,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

function PostDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);



  const amenitiesLabels = {
    wifi: 'WiFi',
    parking: 'Chỗ đậu xe',
    kitchen: 'Nhà bếp',
    tv: 'TV',
    ac: 'Điều hòa',
    washing: 'Máy giặt',
    security: 'Bảo vệ 24/7',
    elevator: 'Thang máy'
  };

  const amenitiesIcons = {
    wifi: <Wifi size={16} />,
    parking: <Car size={16} />,
    kitchen: <Coffee size={16} />,
    tv: <Tv size={16} />,
    ac: <Snowflake size={16} />,
    washing: <Shirt size={16} />,
    security: <CheckCircle size={16} />,
    elevator: <Home size={16} />
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    
    try {
      if (!id) {
        navigate('/');
        return;
      }
      
      // Get post from Firebase
      const postData = await postsService.getPostById(id);
      
      if (!postData) {
        console.error('Post not found');
        navigate('/');
        return;
      }
      
      setPost(postData);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `${post.title} - ${formatPrice(post.budget || post.price)}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link bài đăng!');
    }
  };

  const handleContact = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (currentUser?.uid === post.author?.id) {
      alert('Đây là bài đăng của bạn!');
      return;
    }
    
    setShowContactModal(true);
  };

  const sendMessage = async () => {
    if (!contactMessage.trim()) return;
    
    setSendingMessage(true);
    
    // Simulate sending message
    setTimeout(() => {
      console.log('Sending message:', {
        to: post.author?.id,
        message: contactMessage,
        postId: post.id
      });
      
      setSendingMessage(false);
      setShowContactModal(false);
      setContactMessage('');
      alert('Tin nhắn đã được gửi!');
    }, 1000);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return 'N/A';
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} triệu`;
    }
    return `${price.toLocaleString()} đồng`;
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài đăng</h2>
        <p className="text-gray-600 mb-4">Bài đăng có thể đã được xóa hoặc không tồn tại.</p>
        <button
          onClick={() => navigate('/search')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Quay lại tìm kiếm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Quay lại
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            <Share2 size={20} />
          </button>
          
          <div className="flex items-center text-gray-500">
            <Eye size={16} className="mr-1" />
            <span>{post.views} lượt xem</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="relative">
          <img
            src={post.images[currentImageIndex]}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
            onClick={() => setShowImageModal(true)}
          />
          
          {post.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {post.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {post.images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${post.title} ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                  index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center text-blue-600">
                <DollarSign size={20} className="mr-1" />
                <span className="text-2xl font-bold">{formatPrice(post.budget || post.price)}/tháng</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-1" />
                <span>{post.district}, {post.city}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Home size={16} className="mr-1" />
                <span>{getRoomTypeLabel(post.roomType)}</span>
              </div>

            </div>
            
            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-semibold mb-2">Mô tả chi tiết</h3>
              <p className="text-gray-700 leading-relaxed">{post.description}</p>
            </div>
            
            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin phòng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa chỉ:</span>
                    <span className="font-medium">{post.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diện tích:</span>
                    <span className="font-medium">{post.additionalInfo?.area || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tầng:</span>
                    <span className="font-medium">{post.additionalInfo?.floor || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiền cọc:</span>
                    <span className="font-medium">{formatPrice(post.additionalInfo?.deposit || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Yêu cầu</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giới tính:</span>
                    <span className="font-medium">{getGenderLabel(post.gender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số người:</span>
                    <span className="font-medium">{post.maxPeople} người</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Có thể vào:</span>
                    <span className="font-medium">{formatDate(post.availableFrom)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Tiện ích</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {post.amenities?.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                    {amenitiesIcons[amenity]}
                    <span className="text-sm">{amenitiesLabels[amenity]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rules */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Quy tắc chung</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {post.rules?.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Nearby Places */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Địa điểm lân cận</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {post.additionalInfo?.nearby?.map((place, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm">{place}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={post.author?.avatar || '/default-avatar.png'}
                alt={post.author?.name || 'Người dùng'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {post.author?.name || 'Người dùng ẩn danh'}
                  {post.author?.verified && (
                    <CheckCircle size={16} className="ml-1 text-green-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  Tham gia từ {formatDate(post.author?.joinDate || new Date())}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tỷ lệ phản hồi:</span>
                <span className="font-medium">{post.author?.responseRate || 'N/A'}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Thời gian phản hồi:</span>
                <span className="font-medium">{post.author?.responseTime || 'N/A'}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleContact}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Gửi tin nhắn</span>
              </button>
              
              <button
                onClick={() => window.location.href = `tel:${post.author.phone}`}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Phone size={20} />
                <span>Gọi điện</span>
              </button>
            </div>
          </div>
          
          {/* Safety Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý an toàn</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Gặp mặt tại nơi công cộng</li>
              <li>• Kiểm tra giấy tờ chủ nhà</li>
              <li>• Không chuyển tiền trước khi xem phòng</li>
              <li>• Báo cáo hành vi đáng ngờ</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={24} />
            </button>
            
            <img
              src={post.images[currentImageIndex]}
              alt={post.title}
              className="w-full h-auto max-h-screen object-contain"
            />
            
            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gửi tin nhắn</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tin nhắn cho {post.author?.name || 'Người dùng'}
              </label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Xin chào, tôi quan tâm đến bài đăng của bạn..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={sendMessage}
                disabled={!contactMessage.trim() || sendingMessage}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingMessage ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
