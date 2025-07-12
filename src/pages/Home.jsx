import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Users, ChevronDown, ChevronRight, Heart, Camera, Eye, Star, Verified } from 'lucide-react';

function Home() {
  const [activeTab, setActiveTab] = useState('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    roomType: '',
    priceRange: '',
    area: ''
  });
  const navigate = useNavigate();

  const tabs = [
    { id: 'find', name: 'Tìm bạn trọ', active: true },
    { id: 'rent', name: 'Thuê phòng trọ', active: false },
    { id: 'post', name: 'Đăng tin tìm trọ', active: false }
  ];

  const roomTypes = [
    'Loại phòng', 'Phòng đơn', 'Phòng đôi', 'Phòng 3-4 người', 'Chung cư mini', 'Nhà trọ', 'Homestay', 'Ký túc xá'
  ];

  const priceRanges = [
    'Mức giá', 'Dưới 1 triệu', '1-2 triệu', '2-3 triệu', '3-4 triệu', '4-5 triệu', '5-7 triệu', 'Trên 7 triệu'
  ];

  const areas = [
    'Khu vực', 'Gần trường học', 'Trung tâm thành phố', 'Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Thủ Đức'
  ];

  const handleSearch = () => {
    navigate('/search', { state: { query: searchQuery, filters } });
  };

  const featuredPosts = [
    {
      id: 1,
      title: 'Tìm bạn nữ ở ghép phòng 2 người gần ĐH Bách Khoa TPHCM',
      price: '2,5 triệu/tháng',
      area: 'Quận 3',
      location: 'Gần ĐH Bách Khoa',
      images: 6,
      postedTime: 'Đăng hôm nay',
      verified: true,
      rating: 4.8,
      author: 'Minh Anh - Sinh viên IT',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 2,
      title: 'Nam sinh viên tìm bạn cùng phòng tại KTX khu A ĐHQG',
      price: '1,8 triệu/tháng',
      area: 'Thủ Đức',
      location: 'KTX ĐHQG TPHCM',
      images: 4,
      postedTime: 'Đăng hôm nay',
      verified: false,
      rating: 4.5,
      author: 'Văn Đức - Sinh viên Kinh tế',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    },
    {
      id: 3,
      title: 'Phòng trọ cao cấp gần ĐH Tôn Đức Thắng cần tìm bạn nữ',
      price: '3,2 triệu/tháng',
      area: 'Quận 7',
      location: 'Gần ĐH Tôn Đức Thắng',
      images: 8,
      postedTime: 'Đăng hôm nay',
      verified: true,
      rating: 4.9,
      author: 'Thu Hà - Sinh viên Luật',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80'
    },
    {
      id: 4,
      title: 'Chung cư mini gần ĐH Sư phạm cần 1 bạn nữ ở ghép',
      price: '2,8 triệu/tháng',
      area: 'Quận 5',
      location: 'Gần ĐH Sư phạm TPHCM',
      images: 5,
      postedTime: 'Đăng hôm nay',
      verified: true,
      rating: 4.7,
      author: 'Lan Anh - Sinh viên Sư phạm',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80'
    },
    {
      id: 5,
      title: 'Homestay gần ĐH FPT tìm bạn nam lịch sự, sạch sẽ',
      price: '4,5 triệu/tháng',
      area: 'Quận 9',
      location: 'Gần ĐH FPT',
      images: 7,
      postedTime: 'Đăng hôm nay',
      verified: false,
      rating: 4.3,
      author: 'Hoàng Nam - Sinh viên IT',
      image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 6,
      title: 'Phòng trọ gần ĐH Công nghiệp thực phẩm cần bạn nữ',
      price: '2,0 triệu/tháng',
      area: 'Tân Bình',
      location: 'Gần ĐH Công nghiệp thực phẩm',
      images: 6,
      postedTime: 'Đăng hôm nay',
      verified: true,
      rating: 4.6,
      author: 'Phương Linh - Sinh viên Công nghệ',
      image: 'https://images.unsplash.com/photo-1631679706909-faf17c4436cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1192&q=80'
    },
    {
      id: 7,
      title: 'KTX sinh viên cao cấp gần ĐH Văn Lang tìm bạn cùng phòng',
      price: '3,8 triệu/tháng',
      area: 'Quận 1',
      location: 'Gần ĐH Văn Lang',
      images: 9,
      postedTime: 'Đăng hôm nay',
      verified: true,
      rating: 4.8,
      author: 'Quang Minh - Sinh viên Kinh doanh',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 8,
      title: 'Phòng ở gia đình gần ĐH Huflit cần sinh viên nữ nghiêm túc',
      price: '2,2 triệu/tháng',
      area: 'Quận Bình Thạnh',
      location: 'Gần ĐH Huflit',
      images: 5,
      postedTime: 'Đăng hôm nay',
      verified: false,
      rating: 4.4,
      author: 'Cô Mai - Chủ nhà',
      image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1206&q=80'
    }
  ];

  const studentHubs = [
    {
      id: 1,
      name: 'KTX ĐHQG TP.HCM',
      area: 'Khu A, B, C',
      location: 'Thủ Đức, TPHCM',
      images: 12,
      status: 'Còn chỗ',
      price: '1,5 - 2,5 triệu/tháng',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    },
    {
      id: 2,
      name: 'Khu trọ sinh viên Phạm Văn Đồng',
      area: 'Quanh ĐH Bách Khoa',
      location: 'Thủ Đức, TPHCM',
      images: 18,
      status: 'Còn chỗ',
      price: '2,0 - 3,5 triệu/tháng',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 3,
      name: 'Chung cư mini khu vực ĐH Kinh tế',
      area: 'Quận 3',
      location: 'Gần ĐH Kinh tế TPHCM',
      images: 8,
      status: 'Còn chỗ',
      price: '3,0 - 4,5 triệu/tháng',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80'
    },
    {
      id: 4,
      name: 'Homestay sinh viên quận 7',
      area: 'Gần ĐH Tôn Đức Thắng',
      location: 'Quận 7, TPHCM',
      images: 6,
      status: 'Còn chỗ',
      price: '4,0 - 5,5 triệu/tháng',
      image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    }
  ];

  const locationData = [
    {
      id: 1,
      name: 'Khu vực ĐH Bách Khoa',
      listings: '2.500+ sinh viên tìm trọ',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      schools: ['ĐH Bách Khoa TPHCM', 'ĐH Kinh tế', 'ĐH Khoa học tự nhiên']
    },
    {
      id: 2,
      name: 'Khu vực ĐHQG Hà Nội',
      listings: '1.800+ sinh viên tìm trọ',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
      schools: ['ĐH Bách Khoa Hà Nội', 'ĐH Quốc gia Hà Nội']
    },
    {
      id: 3,
      name: 'Khu vực ĐH Đà Nẵng',
      listings: '900+ sinh viên tìm trọ',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      schools: []
    },
    {
      id: 4,
      name: 'Khu vực ĐH Duy Tân',
      listings: '650+ sinh viên tìm trọ',
      image: 'https://images.unsplash.com/photo-1631679706909-faf17c4436cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1192&q=80',
      schools: ['ĐH Duy Tân']
    },
    {
      id: 5,
      name: 'Khu vực ĐH Cần Thơ',
      listings: '420+ sinh viên tìm trọ',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      schools: ['ĐH Cần Thơ']
    }
  ];

  const newsArticles = [
    {
      id: 1,
      title: 'Kinh nghiệm tìm bạn cùng phòng an toàn cho sinh viên mới',
      excerpt: 'Những lưu ý quan trọng khi tìm bạn ghép trọ để đảm bảo an toàn...',
      date: '2024-01-15',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
    },
    {
      id: 2,
      title: 'Xu hướng giá thuê trọ sinh viên tại TPHCM năm 2024',
      excerpt: 'Phân tích mức giá thuê trọ và xu hướng thay đổi tại các quận...',
      date: '2024-01-14',
      readTime: '7 phút đọc',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1215&q=80'
    },
    {
      id: 3,
      title: 'Top 10 khu trọ sinh viên chất lượng tại Hà Nội',
      excerpt: 'Danh sách các khu trọ được sinh viên đánh giá cao nhất...',
      date: '2024-01-13',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Search */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tìm bạn cùng phòng lý tưởng
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kết nối với hàng ngàn sinh viên đang tìm kiếm bạn ghép trọ phù hợp. An toàn, tiện lợi và đáng tin cậy.
            </p>
          </div>

          {/* Search Tabs */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-8 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-red-600 bg-red-50 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="grid grid-cols-12 gap-4">
                  {/* Search Input */}
                  <div className="col-span-12 md:col-span-5">
                    <div className="relative">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm theo trường học, khu vực, tên phòng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="col-span-12 md:col-span-2">
                    <select
                      value={filters.roomType}
                      onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                      className="w-full py-4 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white custom-select text-sm shadow-sm"
                    >
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                      className="w-full py-4 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white custom-select text-sm shadow-sm"
                    >
                      {priceRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <select
                      value={filters.area}
                      onChange={(e) => setFilters({...filters, area: e.target.value})}
                      className="w-full py-4 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white custom-select text-sm shadow-sm"
                    >
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="col-span-12 md:col-span-1">
                    <button
                      onClick={handleSearch}
                      className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">5,000+</div>
              <div className="text-gray-600 font-medium">Sinh viên đang tìm trọ</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">1,200+</div>
              <div className="text-gray-600 font-medium">Bài đăng mỗi tháng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">850+</div>
              <div className="text-gray-600 font-medium">Ghép đôi thành công</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-12">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-red-600 text-red-600 py-3 px-1 font-semibold text-base">
              Tin nổi bật
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-3 px-1 font-medium text-base">
              Tin tức sinh viên
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-3 px-1 font-medium text-base">
              Trọ TPHCM
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-3 px-1 font-medium text-base">
              Trọ Hà Nội
            </button>
            <Link to="/search" className="text-red-600 hover:text-red-700 py-3 px-1 font-medium text-base flex items-center ml-auto">
              Xem thêm
              <ChevronRight size={18} className="ml-1" />
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Bài đăng tìm bạn trọ nổi bật</h2>
                <div className="flex items-center space-x-4">
                  <Link to="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Tin tìm bạn trọ mới nhất
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Tin cho thuê phòng mới nhất
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                        <Camera size={12} className="mr-1" />
                        {post.images}
                      </div>
                      {post.verified && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                          <Verified size={12} className="mr-1" />
                          Đã xác minh
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-md text-xs flex items-center">
                        <Star size={12} className="mr-1 text-yellow-500" fill="currentColor" />
                        {post.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm line-clamp-2 leading-relaxed">
                        {post.title}
                      </h3>
                      <div className="text-red-600 font-bold text-base mb-2">
                        {post.price}
                      </div>
                      <div className="text-gray-600 text-xs mb-2 font-medium">
                        {post.author}
                      </div>
                      <div className="flex items-center text-gray-600 text-xs mb-3">
                        <MapPin size={12} className="mr-1" />
                        {post.area} - {post.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">{post.postedTime}</span>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium">
                  Xem thêm tin đăng
                </button>
              </div>
            </div>

            {/* Student Housing Hubs Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Khu trọ sinh viên nổi bật</h2>
                <Link to="/housing" className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                  Xem thêm
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {studentHubs.map((hub) => (
                  <div key={hub.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative">
                      <img
                        src={hub.image}
                        alt={hub.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                        <Camera size={12} className="mr-1" />
                        {hub.images}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium">
                        {hub.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                        {hub.name}
                      </h3>
                      <div className="text-red-600 font-bold text-sm mb-2">
                        {hub.price}
                      </div>
                      <div className="text-gray-600 text-xs mb-2">
                        {hub.area}
                      </div>
                      <div className="flex items-center text-gray-600 text-xs">
                        <MapPin size={12} className="mr-1" />
                        {hub.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Based Student Housing */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Tìm trọ theo khu vực trường học</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main University Area - Large */}
                <div className="relative rounded-xl overflow-hidden group">
                  <img
                    src={locationData[0].image}
                    alt={locationData[0].name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{locationData[0].name}</h3>
                    <p className="text-white/90 text-sm mb-4">{locationData[0].listings}</p>
                    <div className="flex flex-wrap gap-2">
                      {locationData[0].schools.map((school, index) => (
                        <span key={index} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                          {school}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Other University Areas */}
                <div className="grid grid-cols-2 gap-4">
                  {locationData.slice(1).map((location) => (
                    <div key={location.id} className="relative rounded-xl overflow-hidden group">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-38 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-base mb-1">{location.name}</h3>
                        <p className="text-white/90 text-xs">{location.listings}</p>
                        {location.schools.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {location.schools.map((school, index) => (
                              <span key={index} className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                                {school}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* News Articles */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Tin tức sinh viên</h3>
              <div className="space-y-6">
                {newsArticles.map((article) => (
                  <div key={article.id} className="group cursor-pointer">
                    <div className="relative mb-3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 text-gray-700 px-2 py-1 rounded-md text-xs">
                        {article.readTime}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="text-gray-500 text-xs">
                      {new Date(article.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link to="/news" className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                  Xem tất cả tin tức
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 