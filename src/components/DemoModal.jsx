import React, { useState, useEffect } from 'react';
import { X, Info, User, Key } from 'lucide-react';

function DemoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal once when app loads
    const hasSeenDemo = localStorage.getItem('hasSeenDemoModal');
    if (!hasSeenDemo) {
      setIsOpen(true);
      localStorage.setItem('hasSeenDemoModal', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Info className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Demo Mode</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Ứng dụng đang chạy ở chế độ demo. Để test đầy đủ tính năng, bạn có thể:
          </p>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Đăng nhập Demo
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>Email:</strong> demo@test.com</div>
              <div><strong>Mật khẩu:</strong> 123456</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center">
              <Key className="w-4 h-4 mr-2" />
              Tính năng có thể test
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Đăng ký tài khoản mới</li>
              <li>• Đăng bài tìm bạn ghép trọ</li>
              <li>• Tìm kiếm và lọc bài đăng</li>
              <li>• Gợi ý AI phù hợp</li>
              <li>• Quản lý kết nối và đánh giá</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Lưu ý</h3>
            <p className="text-sm text-yellow-800">
              Dữ liệu trong demo mode chỉ mang tính chất minh họa và sẽ được reset khi refresh trang.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Bắt đầu sử dụng
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoModal; 