import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Search, PlusCircle, User, Bell, LogOut, Heart } from 'lucide-react';

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                <Heart className="inline-block mr-2" size={28} />
                RoomMate
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 flex items-center">
                <Home size={20} className="mr-1" />
                Trang chủ
              </Link>
              <Link to="/search" className="text-gray-700 hover:text-blue-600 flex items-center">
                <Search size={20} className="mr-1" />
                Tìm kiếm
              </Link>
              {currentUser && (
                <>
                  <Link to="/create-post" className="text-gray-700 hover:text-blue-600 flex items-center">
                    <PlusCircle size={20} className="mr-1" />
                    Đăng bài
                  </Link>
                  <Link to="/suggestions" className="text-gray-700 hover:text-blue-600 flex items-center">
                    <Bell size={20} className="mr-1" />
                    Gợi ý
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 flex items-center">
                    <User size={20} className="mr-1" />
                    {currentUser.displayName || currentUser.email}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 flex items-center"
                  >
                    <LogOut size={20} className="mr-1" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RoomMate</h3>
              <p className="text-gray-400">
                Ứng dụng tìm bạn ghép trọ dành cho sinh viên
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Liên kết</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Trang chủ</Link></li>
                <li><Link to="/search" className="hover:text-white">Tìm kiếm</Link></li>
                <li><Link to="/create-post" className="hover:text-white">Đăng bài</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white">Điều khoản</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Theo dõi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RoomMate. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 