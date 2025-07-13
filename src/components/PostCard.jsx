import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Eye, 
  Star, 
  Camera, 
  Phone, 
  MapPin, 
  Calendar,
  User,
  Maximize2
} from 'lucide-react';

function PostCard({ post, onLike, onView }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleView = () => {
    onView?.(post.id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Hôm nay';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hôm nay';
    if (diffDays === 2) return 'Hôm qua';
    if (diffDays <= 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Image Gallery */}
      <div className="relative overflow-hidden">
        <Link to={`/post/${post.id}`} onClick={handleView}>
          <div className="relative h-48 bg-gray-200">
            {/* Main Image */}
            <img
              src={post.images?.[currentImageIndex] || post.images?.[0]}
              alt={post.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse">
                <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 bg-gray-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}

            {/* Image Navigation */}
            {post.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Count Badge */}
            {post.images?.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Camera className="w-3 h-3" />
                {post.images.length}
              </div>
            )}

            {/* Featured Badge */}
            {post.featured && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                Nổi bật
              </div>
            )}

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500 text-white transform scale-110' 
                  : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Expand Icon */}
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 text-gray-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Maximize2 className="w-3 h-3" />
            </div>
          </div>
        </Link>

        {/* Image Dots Indicator */}
        {post.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {post.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        {post.rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < post.rating ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({post.rating}/5)</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          <Link to={`/post/${post.id}`} onClick={handleView}>
            {post.title}
          </Link>
        </h3>

        {/* Price and Area */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(post.price)}
          </span>
          <span className="text-sm text-gray-500">
            {post.area} m²
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">{post.district}, {post.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {post.description}
        </p>

        {/* Amenities */}
        {post.amenities && post.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {post.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{post.amenities.length - 3} khác
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {post.contact?.name || 'Chủ nhà'}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Views */}
            <div className="flex items-center text-gray-500">
              <Eye className="w-4 h-4 mr-1" />
              <span className="text-sm">{post.views || 0}</span>
            </div>

            {/* Contact Button */}
            <a
              href={`tel:${post.contact?.phone}`}
              className="flex items-center px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors duration-200 transform hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3 h-3 mr-1" />
              Gọi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard; 