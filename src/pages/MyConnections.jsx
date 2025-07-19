import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';
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

const API_BASE_URL = 'http://localhost:3001';

function MyConnections() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('received');
  const [connections, setConnections] = useState([]); // This will hold all relevant connections
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser?.id) {
      fetchConnections();
    }
  }, [currentUser?.id, activeTab]); // Re-fetch when user or tab changes

  useEffect(() => {
    if (!socket || !currentUser?.id) return;

    socket.on('connectionAccepted', (acceptedConnection) => {
      console.log('MyConnections: Connection accepted via socket:', acceptedConnection);
      // Update the local state for received invitations
      setConnections(prev => prev.map(conn => 
        conn.id === acceptedConnection.id ? { ...conn, status: 'accepted' } : conn
      ));
      // Optionally, add to messages list if this component also manages messages
      // For now, just re-fetch to ensure consistency
      fetchConnections();
    });

    socket.on('connectionRejected', (rejectedConnection) => {
      console.log('MyConnections: Connection rejected via socket:', rejectedConnection);
      setConnections(prev => prev.map(conn => 
        conn.id === rejectedConnection.id ? { ...conn, status: 'rejected' } : conn
      ));
      // For now, just re-fetch to ensure consistency
      fetchConnections();
    });

    return () => {
      socket.off('connectionAccepted');
      socket.off('connectionRejected');
    };
  }, [socket, currentUser]);

  const fetchConnections = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Fetch full currentUser details to ensure fullName and avatar are available
      const fullCurrentUserRes = await axios.get(`${API_BASE_URL}/users/${currentUser.id}`);
      const fullCurrentUser = fullCurrentUserRes.data;

      // Fetch all connections relevant to the current user
      const response = await axios.get(`${API_BASE_URL}/connections?senderId=${currentUser.id}&receiverId=${currentUser.id}_or`);
      const allUserConnections = response.data;

      const processedConnections = await Promise.all(allUserConnections.map(async (conn) => {
        const isSender = conn.senderId === currentUser.id;
        const otherUserId = isSender ? conn.receiverId : conn.senderId;
        
        let otherUser = null;
        let postData = null;

        try {
          if (otherUserId) {
            try {
              const userRes = await axios.get(`${API_BASE_URL}/users/${otherUserId}`);
              otherUser = userRes.data;
            } catch (userError) {
              console.warn(`Error fetching user ${otherUserId} for connection ${conn.id}:`, userError.message);
              otherUser = { id: otherUserId, fullName: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48', school: 'Không xác định', major: 'Không xác định', verified: false, status: 'offline' }; // Fallback
            }
          } else {
            console.warn(`Missing otherUserId for connection ${conn.id}. Skipping user fetch.`);
            otherUser = { id: otherUserId, fullName: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48', school: 'Không xác định', major: 'Không xác định', verified: false, status: 'offline' }; // Fallback
          }

          if (conn.postId) {
            try {
              const postRes = await axios.get(`${API_BASE_URL}/posts/${conn.postId}`);
              postData = postRes.data;
            } catch (postError) {
              console.warn(`Error fetching post ${conn.postId} for connection ${conn.id}:`, postError.message);
              postData = { id: conn.postId, title: 'Bài đăng không xác định', userId: '', images: [], address: '', price: 0 }; // Fallback
            }
          } else {
            console.warn(`Missing postId for connection ${conn.id}. Skipping post fetch.`);
            postData = { id: conn.postId, title: 'Bài đăng không xác định', userId: '', images: [], address: '', price: 0 }; // Fallback
          }

          return {
            ...conn,
            fromUser: isSender ? fullCurrentUser : otherUser, // Use fullCurrentUser
            toUser: isSender ? otherUser : fullCurrentUser,   // Use fullCurrentUser
            post: postData,
            type: isSender ? 'sent' : 'received'
          };
        } catch (error) {
          console.error(`Error processing connection ${conn.id}:`, error);
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          }
          // Return a partially processed connection or null to indicate an error
          return {
            ...conn,
            fromUser: isSender ? fullCurrentUser : { id: otherUserId, fullName: 'Không xác định', avatar: 'https://via.placeholder.com/48', school: 'Không xác định', major: 'Không xác định', verified: false, status: 'offline' }, // Provide fallback user info
            toUser: isSender ? { id: otherUserId, fullName: 'Không xác định', avatar: 'https://via.placeholder.com/48', school: 'Không xác định', major: 'Không xác định', verified: false, status: 'offline' } : fullCurrentUser,   // Provide fallback user info
            post: { id: conn.postId, title: 'Bài đăng không xác định', userId: '', images: [], address: '', price: 0 }, // Provide fallback post info
            type: isSender ? 'sent' : 'received',
            error: true // Add an error flag
          };
        }
      }));
      // Filter out connections that had critical errors if needed, or handle them in rendering
      setConnections(processedConnections.filter(conn => !conn.error)); // Filter out errored connections
      // Sort by createdAt for consistent display
      processedConnections.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setConnections(processedConnections);

    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionResponse = async (connectionId, response) => {
    try {
      await axios.put(`${API_BASE_URL}/connections/${connectionId}`, { status: response === 'accept' ? 'accepted' : 'rejected' });
      fetchConnections(); // Re-fetch to update the list
    } catch (error) {
      console.error('Error responding to connection:', error);
      alert('Có lỗi xảy ra khi xử lý lời mời. Vui lòng thử lại.');
    }
  };

  const handleCancelConnection = async (connectionId) => {
    try {
      // For simplicity, we'll change status to 'cancelled' instead of deleting
      // A real app might have a DELETE endpoint or specific cancellation logic
      await axios.put(`${API_BASE_URL}/connections/${connectionId}`, { status: 'cancelled' });
      fetchConnections();
    } catch (error) {
      console.error('Error cancelling connection:', error);
      alert('Có lỗi xảy ra khi hủy lời mời. Vui lòng thử lại.');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ'; // Handle invalid dates
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
    return `${diffInYears} năm trước`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Đang chờ
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đã chấp nhận
          </span>
        );
      case 'rejected': // Changed from declined to rejected
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Đã từ chối
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const filteredConnections = connections.filter(conn => {
    const user = activeTab === 'received' ? conn.fromUser : conn.toUser;
    const isRelevantTab = (activeTab === 'received' && conn.type === 'received') || (activeTab === 'sent' && conn.type === 'sent');
    
    return isRelevantTab && 
           (user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conn.post?.title?.toLowerCase().includes(searchTerm.toLowerCase()));
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
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                activeTab === 'received'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
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
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                activeTab === 'sent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
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
              src={user?.avatar || 'https://via.placeholder.com/48'}
              alt={user?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {user?.fullName || 'Người dùng không xác định'}
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
                          <p>{user?.school || 'Không xác định'} - {user?.major || 'Không xác định'}</p>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Về: {connection.post?.title || 'Bài đăng không xác định'}
                        </p>
                        
                        {connection.message && (
                          <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                            "{connection.message}"
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {connection.postId && (
                            <Link
                              to={`/post/${connection.postId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Xem bài đăng
                            </Link>
                          )}
                          
                          {connection.status === 'pending' && (
                            <div className="flex items-center space-x-2">
                              {activeTab === 'received' && (
                                <>
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
                                </>
                              )}
                              {activeTab === 'sent' && (
                                <button
                                  onClick={() => handleCancelConnection(connection.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                                >
                                  Hủy lời mời
                                </button>
                              )}
                            </div>
                          )}
                          
                          {connection.status === 'accepted' && (
                            <Link
                              to={`/connections?conversationId=${connection.id}`} // Link to the chat window
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
                            >
                              <MessageCircle size={16} />
                              <span>Nhắn tin</span>
                            </Link>
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
<environment_details>
# VSCode Visible Files
src/pages/Connections.jsx

# VSCode Open Tabs
db.json
server/index.js
src/components/ChatWindow.jsx
src/App.jsx
src/pages/MyConnections.jsx
src/pages/Connections.jsx
src/components/NotificationDropdown.jsx
package.json
src/pages/PostDetail.jsx
src/components/ConnectionModal.jsx
src/context/SocketContext.jsx
src/pages/Register.jsx
src/pages/PostManagement.jsx
src/components/Layout.jsx
src/components/NotificationModal.jsx
src/pages/UserManagement.jsx
src/pages/Settings.jsx
src/pages/EditPost.jsx
src/pages/CreatePost.jsx
src/components/RatingModal.jsx
src/pages/Login.jsx
src/context/SocketContextObject.js
src/hooks/useSocket.js
src/pages/Home.jsx
src/components/SearchFilter.jsx
src/pages/Blog.jsx
src/pages/AdminDashboard.jsx
src/pages/BlogManagement.jsx
src/components/PostCard.jsx

# Current Time
7/19/2025, 7:06:03 PM (Asia/Bangkok, UTC+7:00)

# Context Window Usage
759,490 / 1,048.576K tokens used (72%)

# Current Mode
ACT MODE
</environment_details>
