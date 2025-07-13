import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Plus, 
  Menu, 
  X, 
  Search,
  Bell,
  Settings,
  LogOut,
  Heart,
  Bookmark,
  ChevronDown,
  MapPin,
  Filter
} from 'lucide-react';
import { useState } from 'react';

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Phòng trọ', path: '/search', active: true },
    { name: 'Nhà nguyên căn', path: '/search' },
    { name: 'Căn hộ chung cư', path: '/search' },
    { name: 'Căn hộ mini', path: '/search' },
    { name: 'Căn hộ dịch vụ', path: '/search' },
    { name: 'Ở ghép', path: '/search' },
    { name: 'Mặt bằng', path: '/search' },
    { name: 'Blog', path: '/blog' },
    { name: 'Bảng giá dịch vụ', path: '/pricing' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* Top Header */}
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold">FPTro</span>
                  <span className="text-xs ml-1 opacity-80">Kênh thông tin phòng trọ số 1 Việt Nam</span>
                </Link>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center space-x-4 text-sm">
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors">
                  <MapPin size={14} />
                  <span>Tìm theo khu vực</span>
                </button>
                
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors">
                  <Filter size={14} />
                  <span>Bộ lọc</span>
                </button>

                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                      <Heart size={14} />
                      <span>Tin đã lưu</span>
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                      >
                        <User size={14} />
                        <span>Quản lý</span>
                        <ChevronDown size={12} />
                      </button>

                      {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border text-gray-700 z-50">
                          <div className="py-2">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <div className="font-medium text-sm">{currentUser.displayName || currentUser.email}</div>
                            </div>
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm hover:bg-gray-50"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              Thông tin cá nhân
                            </Link>
                            <Link
                              to="/create-post"
                              className="block px-4 py-2 text-sm hover:bg-gray-50"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              Đăng tin cho thuê
                            </Link>
                            <Link
                              to="/favorites"
                              className="block px-4 py-2 text-sm hover:bg-gray-50"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              Tin đã lưu
                            </Link>
                            <hr className="my-1" />
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              Thoát
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-sm">{currentUser.displayName || 'Người dùng'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm hover:text-blue-200 transition-colors">
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="text-sm hover:text-blue-200 transition-colors">
                      Đăng ký
                    </Link>
                  </div>
                )}

                <Link 
                  to="/create-post" 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Đăng tin</span>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="hidden md:flex">
              {navItems.map((item, index) => (
                <Link
                  key={item.path + index}
                  to={item.path}
                  className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                    item.active || isActive(item.path)
                      ? 'text-red-500 border-b-2 border-red-500'
                      : 'text-gray-700 hover:text-red-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-white border-t py-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.path + index}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FPTro</h3>
              <p className="text-sm text-gray-400">
                Website đăng tin cho thuê phòng trọ, nhà trọ, căn hộ, ký túc xá an toàn.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ khách hàng</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Câu hỏi thường gặp</li>
                <li>Hướng dẫn đăng tin</li>
                <li>Quy định đăng tin</li>
                <li>Liên hệ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Giới thiệu</li>
                <li>Tuyển dụng</li>
                <li>Truyền thông</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên kết</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 FPTro. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 