import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, FileText, Settings, ChevronDown } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <div className="bg-blue-600 text-white text-xs py-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>Kênh thông tin Phòng Trọ số 1 Việt Nam</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Hỗ trợ khách hàng</span>
              <span className="font-semibold">0917 686 101</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">
                  FPTro
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <div className="flex items-center px-3 py-2 bg-gray-50 border-r border-gray-300 min-w-0">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600 text-sm whitespace-nowrap">Toàn quốc</span>
                  <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm tin đăng..."
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                <button className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/suggestions" 
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Gợi ý AI
              </Link>

              <Link 
                to="/connections" 
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Kết nối
              </Link>

              <Link 
                to="/ratings" 
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Đánh giá
              </Link>

              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Hồ sơ
              </Link>

              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentUser.displayName || currentUser.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Thông tin cá nhân
                        </Link>
                        <Link
                          to="/my-posts"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Tin đăng của tôi
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Cài đặt
                        </Link>
                        <Link
                          to="/debug"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Debug
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>

                  <Link 
                    to="/register" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Đăng ký
                  </Link>
                </>
              )}

              <Link 
                to="/create-post" 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Đăng tin miễn phí
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Phòng trọ
            </Link>
            <Link 
              to="/nha-nguyen-can" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/nha-nguyen-can' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Nhà nguyên căn
            </Link>
            <Link 
              to="/can-ho-chung-cu" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/can-ho-chung-cu' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Căn hộ chung cư
            </Link>
            <Link 
              to="/can-ho-mini" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/can-ho-mini' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Căn hộ mini
            </Link>
            <Link 
              to="/can-ho-dich-vu" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/can-ho-dich-vu' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Căn hộ dịch vụ
            </Link>
            <Link 
              to="/o-ghep" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/o-ghep' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Ở ghép
            </Link>
            <Link 
              to="/mat-bang" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/mat-bang' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Mặt bằng
            </Link>
            <Link 
              to="/blog" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/blog' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/bang-gia" 
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/bang-gia' 
                  ? 'text-orange-500 border-orange-500' 
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Bảng giá dịch vụ
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <h3 className="font-bold text-lg text-gray-800 mb-4">FPTro</h3>
              <p className="text-gray-600 text-sm mb-4">
                FPTro tự hào có lượng dữ liệu bài đăng lớn nhất trong lĩnh vực cho thuê phòng trọ dành cho sinh viên FPT.
              </p>
              <div className="text-sm text-gray-600">
                <p className="mb-1"><strong>Điện thoại:</strong> 0917 686 101</p>
                <p className="mb-1"><strong>Email:</strong> support@fptro.com</p>
                <p><strong>Địa chỉ:</strong> Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng, Việt Nam</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Phòng trọ</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/ho-chi-minh" className="text-gray-600 hover:text-gray-800">Phòng trọ Hồ Chí Minh</Link></li>
                <li><Link to="/ha-noi" className="text-gray-600 hover:text-gray-800">Phòng trọ Hà Nội</Link></li>
                <li><Link to="/da-nang" className="text-gray-600 hover:text-gray-800">Phòng trọ Đà Nẵng</Link></li>
                <li><Link to="/binh-duong" className="text-gray-600 hover:text-gray-800">Phòng trọ Bình Dương</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Nhà cho thuê</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/thue-nha-hcm" className="text-gray-600 hover:text-gray-800">Thuê nhà Hồ Chí Minh</Link></li>
                <li><Link to="/thue-nha-hn" className="text-gray-600 hover:text-gray-800">Thuê nhà Hà Nội</Link></li>
                <li><Link to="/thue-nha-dn" className="text-gray-600 hover:text-gray-800">Thuê nhà Đà Nẵng</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/lien-he" className="text-gray-600 hover:text-gray-800">Liên hệ</Link></li>
                <li><Link to="/gop-y" className="text-gray-600 hover:text-gray-800">Góp ý</Link></li>
                <li><Link to="/quy-dinh" className="text-gray-600 hover:text-gray-800">Quy định sử dụng</Link></li>
                <li><Link to="/bao-mat" className="text-gray-600 hover:text-gray-800">Chính sách bảo mật</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="text-center text-sm text-gray-600">
              <p>© 2024 FPTro. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 