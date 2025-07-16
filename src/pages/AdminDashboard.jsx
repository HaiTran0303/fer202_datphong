import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bảng điều khiển Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/users" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2">Quản lý người dùng</h2>
          <p className="text-gray-600">Thêm, sửa, xóa người dùng và quản lý vai trò của họ.</p>
        </Link>
        <Link to="/admin/posts" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-2">Quản lý bài đăng</h2>
          <p className="text-gray-600">Kiểm duyệt, sửa, xóa bài đăng.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
