import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, UserPlus, Heart, Star, MapPin, Clock, Users } from 'lucide-react';

function Home() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Tìm kiếm thông minh",
      description: "Tìm bạn ghép trọ theo giới tính, khu vực, mức giá và ngành học"
    },
    {
      icon: <UserPlus className="w-8 h-8 text-green-600" />,
      title: "Kết nối dễ dàng",
      description: "Gửi lời mời và kết nối với những người phù hợp"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Gợi ý AI",
      description: "Nhận gợi ý ghép trọ phù hợp từ trí tuệ nhân tạo"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Đánh giá tin cậy",
      description: "Hệ thống đánh giá giúp bạn chọn bạn cùng phòng phù hợp"
    }
  ];

  const stats = [
    { number: "1000+", label: "Sinh viên" },
    { number: "500+", label: "Bài đăng" },
    { number: "200+", label: "Ghép đôi thành công" },
    { number: "50+", label: "Trường học" }
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Tìm bạn nữ ghép trọ quận 1",
      author: "Minh Anh",
      price: "3.5 triệu/tháng",
      location: "Quận 1, TP.HCM",
      timeAgo: "2 giờ trước"
    },
    {
      id: 2,
      title: "Nam tìm bạn cùng phòng gần ĐH Bách Khoa",
      author: "Việt Nam",
      price: "2.8 triệu/tháng",
      location: "Quận 3, TP.HCM",
      timeAgo: "4 giờ trước"
    },
    {
      id: 3,
      title: "Nữ tìm bạn ghép trọ quận Bình Thạnh",
      author: "Thu Hà",
      price: "3.2 triệu/tháng",
      location: "Quận Bình Thạnh, TP.HCM",
      timeAgo: "6 giờ trước"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tìm bạn ghép trọ lý tưởng
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Kết nối với sinh viên cùng sở thích, tạo không gian sống hoàn hảo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <>
                <Link 
                  to="/search" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Tìm kiếm ngay
                </Link>
                <Link 
                  to="/create-post" 
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Đăng bài mới
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Đăng ký miễn phí
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tại sao chọn RoomMate?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp các tính năng tốt nhất để giúp bạn tìm được bạn cùng phòng phù hợp
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Bài đăng mới nhất
          </h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-800 font-semibold">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.author}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.timeAgo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">{post.price}</span>
                  <Link 
                    to={`/post/${post.id}`} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16 px-4 rounded-2xl text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng tìm bạn cùng phòng?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Tham gia cộng đồng sinh viên lớn nhất và tìm được bạn ghép trọ hoàn hảo
          </p>
          {!currentUser && (
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Bắt đầu ngay hôm nay
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home; 