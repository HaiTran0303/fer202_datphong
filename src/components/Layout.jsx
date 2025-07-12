import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Tìm bạn trọ', path: '/search' },
    { name: 'Đăng tin tìm trọ', path: '/create-post' },
    { name: 'Gợi ý phù hợp', path: '/suggestions' },
    { name: 'Tin tức', path: '/news' },
    { name: 'Hỗ trợ', path: '/support' },
    { name: 'Kết nối', path: '/connections' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <span className="text-red-600 font-bold text-xl">RoomMate</span>
                  <div className="text-xs text-gray-500">Tìm bạn cùng phòng</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-red-600 ${
                    isActive(item.path) ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile App Download */}
              <button className="hidden md:flex items-center text-sm text-gray-700 hover:text-red-600">
                Tải ứng dụng
              </button>

              {/* Favorites */}
              <button className="p-2 text-gray-700 hover:text-red-600">
                <Heart size={20} />
              </button>

              {/* User Actions */}
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-red-600"
                  >
                    <User size={16} />
                    <span className="hidden sm:inline">Tài khoản</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-sm text-gray-700 hover:text-red-600 font-medium"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-gray-700 hover:text-red-600 font-medium"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Post Button */}
              <Link
                to="/create-post"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Đăng tin</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-red-600"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 rounded ${
                    isActive(item.path) ? 'text-red-600 bg-red-50' : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="text-xl font-bold">RoomMate</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nền tảng tìm bạn cùng phòng hàng đầu cho sinh viên Việt Nam
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Dịch vụ</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/search" className="hover:text-white">Tìm bạn trọ</Link></li>
                <li><Link to="/create-post" className="hover:text-white">Đăng tin</Link></li>
                <li><Link to="/suggestions" className="hover:text-white">Gợi ý phù hợp</Link></li>
                <li><Link to="/connections" className="hover:text-white">Kết nối</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-white">Hướng dẫn sử dụng</a></li>
                <li><a href="#" className="hover:text-white">Báo cáo lỗi</a></li>
                <li><a href="#" className="hover:text-white">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Zalo</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2024 RoomMate. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 