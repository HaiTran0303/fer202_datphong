import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { connectionService } from '../utils/connectionService';
import { 
  UserPlus, 
  Check, 
  X, 
  Clock, 
  MessageCircle,
  Users,
  Filter,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function MyConnections() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchConnections();
    }
  }, [currentUser, activeTab]);

  const fetchConnections = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let data = [];
      if (activeTab === 'received') {
        data = await connectionService.getReceivedConnections(currentUser.uid);
      } else {
        data = await connectionService.getSentConnections(currentUser.uid);
      }
      setConnections(data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionResponse = async (connectionId, response) => {
    try {
      if (response === 'accept') {
        await connectionService.acceptConnection(connectionId);
      } else {
        await connectionService.declineConnection(connectionId);
      }

      // Refresh connections
      fetchConnections();
    } catch (error) {
      console.error('Error responding to connection:', error);
      alert('Có lỗi xảy ra khi xử lý lời mời. Vui lòng thử lại.');
    }
  };

  const handleCancelConnection = async (connectionId) => {
    try {
      await connectionService.cancelConnection(connectionId);
      fetchConnections();
    } catch (error) {
      console.error('Error cancelling connection:', error);
      alert('Có lỗi xảy ra khi hủy lời mời. Vui lòng thử lại.');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Chờ phản hồi
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đã chấp nhận
          </span>
        );
      case 'declined':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Đã từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const filteredConnections = connections.filter(conn => {
    const user = activeTab === 'received' ? conn.fromUser : conn.toUser;
    return user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conn.post?.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết nối của tôi</h2>
        <p className="text-gray-600 mb-6">
          Đăng nhập để xem các kết nối của bạn
        </p>
        <Link 
          to="/login" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kết nối của tôi</h1>
        <p className="text-gray-600">Quản lý các lời mời kết nối đã gửi và nhận</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus size={20} />
              <span>Lời mời đã nhận</span>
              {connections.filter(c => c.status === 'pending' && activeTab === 'received').length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                  {connections.filter(c => c.status === 'pending' && activeTab === 'received').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle size={20} />
              <span>Lời mời đã gửi</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm theo tên hoặc bài đăng..."
            />
          </div>
        </div>

        {/* Connections List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {activeTab === 'received' 
                  ? 'Chưa có lời mời kết nối nào' 
                  : 'Chưa gửi lời mời kết nối nào'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConnections.map(connection => {
                const user = activeTab === 'received' ? connection.fromUser : connection.toUser;
                
                return (
                  <div key={connection.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={user?.avatar || '/api/placeholder/40/40'}
                        alt={user?.fullName}
                        className="w-12 h-12 rounded-full"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {user?.fullName || 'Người dùng'}
                            </h3>
                            {user?.isVerified && (
                              <CheckCircle size={16} className="text-green-500" />
                            )}
                            {getStatusBadge(connection.status)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatTime(connection.createdAt)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <p>{user?.school} - {user?.major}</p>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Về: {connection.post?.title || 'Bài đăng'}
                        </p>
                        
                        {connection.message && (
                          <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                            "{connection.message}"
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/post/${connection.postId}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Xem bài đăng
                          </Link>
                          
                          {activeTab === 'received' && connection.status === 'pending' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleConnectionResponse(connection.id, 'decline')}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                              >
                                Từ chối
                              </button>
                              <button
                                onClick={() => handleConnectionResponse(connection.id, 'accept')}
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                              >
                                Chấp nhận
                              </button>
                            </div>
                          )}
                          
                          {activeTab === 'sent' && connection.status === 'pending' && (
                            <button
                              onClick={() => handleCancelConnection(connection.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                            >
                              Hủy lời mời
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyConnections; 