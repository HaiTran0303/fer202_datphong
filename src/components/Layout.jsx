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
  Filter,
  Phone,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Phòng trọ', path: '/', active: true },
    { name: 'Nhà nguyên căn', path: '/nha-nguyen-can' },
    { name: 'Căn hộ chung cư', path: '/can-ho-chung-cu' },
    { name: 'Căn hộ mini', path: '/can-ho-mini' },
    { name: 'Căn hộ dịch vụ', path: '/can-ho-dich-vu' },
    { name: 'Ở ghép', path: '/o-ghep' },
    { name: 'Mặt bằng', path: '/mat-bang' },
    { name: 'Blog', path: '/blog' },
    { name: 'Bảng giá dịch vụ', path: '/bang-gia' },
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
      {/* Simple Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">FPTro</div>
              <span className="text-xs ml-2 text-gray-500">Kênh thông tin phòng trọ số 1 Việt Nam</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Tìm theo khu vực</span>
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg">
                <Filter className="w-4 h-4 mr-1" />
                <span className="text-sm">Bộ lọc</span>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <Link 
                    to="/saved" 
                    className="hidden lg:flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="text-sm">Tin đã lưu</span>
                  </Link>

                  <Link 
                    to="/create-post" 
                    className="hidden lg:flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Đăng tin</span>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{currentUser?.displayName}</p>
                          <p className="text-xs text-gray-500">{currentUser?.email}</p>
                        </div>
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <User className="w-4 h-4 mr-3" />
                          Hồ sơ
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hidden lg:flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">Đăng nhập</span>
                  </Link>

                  <Link 
                    to="/register" 
                    className="hidden lg:flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">Đăng ký</span>
                  </Link>

                  <Link 
                    to="/create-post" 
                    className="hidden lg:flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Đăng tin</span>
                  </Link>
                </>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden lg:block">
            <ul className="flex h-12">
              {navItems.map((item, index) => (
                <li key={index} className="h-full mr-4">
                  <Link
                    to={item.path}
                    className={`flex items-center h-full px-1 text-sm border-b-2 ${
                      isActive(item.path) || (item.active && location.pathname === '/')
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">FPTro</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {!currentUser && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Đăng ký
                  </Link>
                </div>
              )}
              
              <Link 
                to="/create-post" 
                className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-full text-sm mb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Đăng tin mới
              </Link>

              <div className="bg-white rounded-lg">
                <ul className="space-y-0">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className="flex items-center justify-between py-3 px-0 border-b border-gray-100 text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-5 h-5 text-orange-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="bg-yellow-50 pt-5 pb-4 mt-6 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ chủ nhà đăng tin</h3>
            <p className="text-gray-600 mb-4">Nếu bạn cần hỗ trợ đăng tin, vui lòng liên hệ số điện thoại bên dưới:</p>
            <div className="flex justify-center space-x-4">
              <a 
                href="tel:0909316890" 
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Phone className="w-4 h-4 mr-2" />
                ĐT: 0909316890
              </a>
              <a 
                href="https://zalo.me/0909316890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Zalo: 0909316890
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 text-center mt-6">
            <p className="font-semibold text-gray-700 mb-2">CÔNG TY TNHH FPTRO</p>
            <p className="mb-1">Địa chỉ: FPT University, Hòa Lạc, Hà Nội, Việt Nam</p>
            <p className="mb-1">
              Tổng đài CSKH: 
              <a href="tel:0909316890" className="text-red-500 ml-1">0909 316 890</a>
              {' '}- Email: support@fptro.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 