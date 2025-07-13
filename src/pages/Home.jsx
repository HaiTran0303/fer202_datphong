import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Eye, Star, Heart, Camera, ChevronRight } from 'lucide-react';

function Home() {
  const [activeTab, setActiveTab] = useState('featured');

  const provinces = [
    { name: 'Phòng trọ Hồ Chí Minh', active: true },
    { name: 'Phòng trọ Hà Nội' },
    { name: 'Phòng trọ Đà Nẵng' },
    { name: 'Phòng trọ Bình Dương' },
  ];

  const priceRanges = [
    'Dưới 1 triệu',
    'Từ 1 - 2 triệu', 
    'Từ 2 - 3 triệu',
    'Từ 3 - 5 triệu',
    'Từ 5 - 7 triệu',
    'Từ 7 - 10 triệu',
    'Từ 10 - 15 triệu',
    'Trên 15 triệu'
  ];

  const areaRanges = [
    'Dưới 20 m²',
    'Từ 20 - 30m²',
    'Từ 30 - 50m²',
    'Từ 50 - 70m²',
    'Từ 70 - 90m²',
    'Trên 90m²'
  ];

  const featuredPosts = [
    {
      id: 1,
      title: 'PHÒNG TRỌ MỚI RẤT ĐẸP SỐ 373/1 ĐƯỜNG LÝ THƯỜNG KIỆT, QUẬN TÂN BÌNH - GẦN BẾN TRƯỜNG ĐH BÁCH KHOA',
      price: '3.9 triệu/tháng',
      area: '25 m²',
      location: 'Tân Bình, Hồ Chí Minh',
      images: 15,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 2,
      title: 'CĂN HỘ DUPLEX CỦA SỐ THOÁNG - FULL NỘI THẤT CĂN HỘ TRUNG TÂM Q1',
      price: '5 triệu/tháng',
      area: '30 m²',
      location: 'Quận 1, Hồ Chí Minh',
      images: 12,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    },
    {
      id: 3,
      title: 'Duplex bancon siêu đẹp 30m2 - 656 Quang Trung F11 Gò Vấp',
      price: '4.5 triệu/tháng',
      area: '30 m²',
      location: 'Gò Vấp, Hồ Chí Minh',
      images: 8,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80'
    }
  ];

  const newPosts = [
    {
      id: 1,
      title: 'CĂN HỘ DUPLEX CỦA SỐ THOÁNG - FULL NỘI THẤT...',
      price: '5 triệu/tháng',
      time: '3 phút trước',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    },
    {
      id: 2,
      title: 'Duplex bancon siêu đẹp 30m2 - 656 Quang Trung F11 Gò...',
      price: '4.5 triệu/tháng',
      time: '1 giờ trước',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80'
    },
    {
      id: 3,
      title: 'Phòng trọ như nhà nguyên căn 1 trệt, 1 Gác cao, MT Hẻm...',
      price: '6.5 triệu/tháng',
      time: '2 giờ trước',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80'
    }
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-0">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-2 bg-white">
            {/* BDS123 Logo Box */}
            <div className="bg-gradient-to-b from-blue-500 to-blue-600 p-4 text-white">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-yellow-400 rounded mx-auto mb-1"></div>
                    <div className="text-xs font-bold">🏠</div>
                  </div>
                </div>
                <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                  fptro.vn
                </div>
                <div className="text-xs mt-1 font-medium">
                  CHUYÊN TRANG<br />
                  BẤT<br />
                  ĐỘNG<br />
                  SẢN
                </div>
              </div>
            </div>

            {/* Province Filter */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm mb-3 text-gray-800">TỈNH THÀNH</h3>
              <ul className="space-y-1">
                {provinces.map((province, index) => (
                  <li key={index}>
                    <Link 
                      to="/search" 
                      className={`text-sm ${
                        province.active 
                          ? 'text-blue-600 font-medium' 
                          : 'text-gray-700 hover:text-blue-600'
                      } transition-colors`}
                    >
                      {province.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button className="text-sm text-blue-600 hover:underline font-medium">
                    Tất cả <ChevronRight size={12} className="inline" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Filter Tabs */}
            <div className="border-b">
              <div className="flex">
                <button 
                  onClick={() => setActiveTab('featured')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'featured' 
                      ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-500' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Đề xuất
                </button>
                <button 
                  onClick={() => setActiveTab('new')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'new' 
                      ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-500' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Mới đăng
                </button>
                <button 
                  onClick={() => setActiveTab('video')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'video' 
                      ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-500' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Có video
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-7 bg-white border-l border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Kênh thông tin Phòng Trọ số 1 Việt Nam
              </h1>
              <p className="text-sm text-gray-600">
                Có <span className="font-semibold text-blue-600">73.876</span> tin đăng cho thuê
              </p>
            </div>

            {/* Featured Post Detail */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <img
                  src={featuredPosts[0].image}
                  alt="Room"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    alt="Room"
                    className="w-full h-24 object-cover rounded"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1631679706909-faf17c4436cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1192&q=80"
                    alt="Room"
                    className="w-full h-24 object-cover rounded"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    alt="Room"
                    className="w-full h-24 object-cover rounded"
                  />
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1206&q=80"
                      alt="Room"
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                      <div className="text-white text-xs font-medium flex items-center">
                        <Camera size={12} className="mr-1" />
                        {featuredPosts[0].images}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={`${
                      i < featuredPosts[0].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>

              <h2 className="text-lg font-bold text-red-600 mb-2 uppercase">
                {featuredPosts[0].title}
              </h2>

              <div className="flex items-center space-x-4 text-sm mb-3">
                <span className="text-green-600 font-semibold text-base">
                  {featuredPosts[0].price}
                </span>
                <span className="text-gray-600">{featuredPosts[0].area}</span>
                <span className="text-gray-600">{featuredPosts[0].location}</span>
              </div>

              <p className="text-sm text-gray-700 line-clamp-3">
                PHÒNG TRỌ MỚI ĐẸP SỐ 373/1 ĐƯỜNG LÝ THƯỜNG KIỆT, GẦN BH BÁCH KHOA- Phòng năm ngay trung tâm quận Tân Bình, gần nhiều trường đại học lớn. Phòng mới xây, đầy đủ tiện nghi, an ninh tốt, giá thuê hợp lý.
              </p>
            </div>

            {/* Other Posts */}
            <div className="divide-y divide-gray-100">
              {featuredPosts.slice(1).map((post) => (
                <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex space-x-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-24 h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm mb-1">
                        <span className="text-green-600 font-semibold">{post.price}</span>
                        <span className="text-gray-600">{post.area}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 bg-white">
            {/* Price Filter */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-800">Xem theo khoảng giá</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {priceRanges.map((range, index) => (
                  <Link
                    key={index}
                    to="/search"
                    className="text-blue-600 hover:underline py-1"
                  >
                    {range}
                  </Link>
                ))}
              </div>
            </div>

            {/* Area Filter */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-800">Xem theo diện tích</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {areaRanges.map((range, index) => (
                  <Link
                    key={index}
                    to="/search"
                    className="text-blue-600 hover:underline py-1"
                  >
                    {range}
                  </Link>
                ))}
              </div>
            </div>

            {/* New Posts */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-3 text-gray-800">Tin mới đăng</h3>
              <div className="space-y-3">
                {newPosts.map((post) => (
                  <div key={post.id} className="flex space-x-2">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-semibold">{post.price}</span>
                        <span className="text-xs text-gray-500">{post.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertisement */}
            <div className="p-4">
              <div className="bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg p-4 text-white text-center">
                <h4 className="font-bold text-sm mb-2">thueccanho123.vn</h4>
                <p className="text-xs mb-2">website<br />cho thuê<br />căn hộ<br />chung cư</p>
                <div className="w-12 h-12 bg-white/20 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 