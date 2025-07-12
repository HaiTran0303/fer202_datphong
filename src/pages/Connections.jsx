import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  UserPlus, 
  Heart, 
  Clock, 
  Check, 
  X,
  Send,
  Star,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  Search
} from 'lucide-react';

function Connections() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockMessages = [
    {
      id: 1,
      postId: 1,
      postTitle: "Tìm bạn nữ ghép trọ quận 1",
      otherUser: {
        id: "user123",
        name: "Minh Anh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        status: "online"
      },
      lastMessage: "Chào bạn! Tôi rất quan tâm đến bài đăng của bạn",
      lastMessageTime: "2024-01-15T14:30:00Z",
      unread: true,
      conversation: [
        {
          id: 1,
          sender: "user123",
          content: "Chào bạn! Tôi rất quan tâm đến bài đăng của bạn",
          timestamp: "2024-01-15T14:30:00Z"
        },
        {
          id: 2,
          sender: "currentUser",
          content: "Chào bạn! Cảm ơn bạn đã quan tâm. Bạn có thể cho tôi biết thêm về bản thân không?",
          timestamp: "2024-01-15T14:32:00Z"
        }
      ]
    },
    {
      id: 2,
      postId: 2,
      postTitle: "Studio mới xây quận 7",
      otherUser: {
        id: "user456",
        name: "Thu Hà",
        avatar: "/api/placeholder/40/40",
        verified: false,
        status: "offline"
      },
      lastMessage: "Phòng vẫn còn trống không bạn?",
      lastMessageTime: "2024-01-14T10:15:00Z",
      unread: false,
      conversation: [
        {
          id: 1,
          sender: "user456",
          content: "Phòng vẫn còn trống không bạn?",
          timestamp: "2024-01-14T10:15:00Z"
        },
        {
          id: 2,
          sender: "currentUser",
          content: "Vẫn còn bạn ạ. Bạn có muốn xem phòng không?",
          timestamp: "2024-01-14T10:20:00Z"
        },
        {
          id: 3,
          sender: "user456",
          content: "Có ạ. Chúng ta có thể hẹn gặp vào cuối tuần được không?",
          timestamp: "2024-01-14T10:25:00Z"
        }
      ]
    },
    {
      id: 3,
      postId: 3,
      postTitle: "Căn hộ cao cấp quận 2",
      otherUser: {
        id: "user789",
        name: "Quang Minh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        status: "online"
      },
      lastMessage: "Khi nào có thể chuyển vào ạ?",
      lastMessageTime: "2024-01-13T16:45:00Z",
      unread: true,
      conversation: [
        {
          id: 1,
          sender: "user789",
          content: "Khi nào có thể chuyển vào ạ?",
          timestamp: "2024-01-13T16:45:00Z"
        }
      ]
    }
  ];

  const mockInvitations = [
    {
      id: 1,
      type: "received",
      fromUser: {
        id: "user111",
        name: "Phương Linh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        school: "ĐH Bách Khoa",
        major: "Công nghệ thông tin"
      },
      postId: 4,
      postTitle: "Tìm bạn ở ghép studio quận 7",
      message: "Chào bạn! Tôi thấy chúng ta có nhiều điểm chung và muốn làm quen. Hy vọng chúng ta có thể trở thành bạn cùng phòng!",
      timestamp: "2024-01-15T11:20:00Z",
      status: "pending"
    },
    {
      id: 2,
      type: "sent",
      toUser: {
        id: "user222",
        name: "Lan Anh",
        avatar: "/api/placeholder/40/40",
        verified: false,
        school: "ĐH Khoa học Tự nhiên",
        major: "Sinh học"
      },
      postId: 5,
      postTitle: "Phòng trọ sinh viên quận 3",
      message: "Xin chào! Tôi rất thích bài đăng của bạn và muốn kết nối.",
      timestamp: "2024-01-14T09:30:00Z",
      status: "pending"
    },
    {
      id: 3,
      type: "received",
      fromUser: {
        id: "user333",
        name: "Hoàng Long",
        avatar: "/api/placeholder/40/40",
        verified: true,
        school: "ĐH Kinh tế",
        major: "Quản trị kinh doanh"
      },
      postId: 6,
      postTitle: "Căn hộ 2 phòng ngủ quận 2",
      message: "Chào bạn! Tôi quan tâm đến bài đăng của bạn.",
      timestamp: "2024-01-13T14:10:00Z",
      status: "accepted"
    }
  ];

  const mockMatches = [
    {
      id: 1,
      user: {
        id: "user444",
        name: "Mai Anh",
        avatar: "/api/placeholder/40/40",
        verified: true,
        school: "ĐH Bách Khoa",
        major: "Kỹ thuật phần mềm",
        interests: ["Đọc sách", "Yoga", "Du lịch"],
        lifestyle: ["Sạch sẽ", "Yên tĩnh"]
      },
      postId: 7,
      postTitle: "Tìm bạn nữ ghép trọ quận 1",
      matchScore: 92,
      mutualInterests: ["Đọc sách", "Yoga"],
      timestamp: "2024-01-15T08:00:00Z",
      status: "new"
    },
    {
      id: 2,
      user: {
        id: "user555",
        name: "Ngọc Hân",
        avatar: "/api/placeholder/40/40",
        verified: false,
        school: "ĐH Khoa học Tự nhiên",
        major: "Toán học",
        interests: ["Xem phim", "Nấu ăn"],
        lifestyle: ["Thân thiện", "Học tập nhiều"]
      },
      postId: 8,
      postTitle: "Studio cao cấp quận 7",
      matchScore: 85,
      mutualInterests: ["Xem phim"],
      timestamp: "2024-01-14T12:30:00Z",
      status: "contacted"
    }
  ];

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setInvitations(mockInvitations);
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  };

  const handleSendMessage = (conversationId) => {
    if (!newMessage.trim()) return;
    
    const updatedMessages = messages.map(msg => {
      if (msg.id === conversationId) {
        return {
          ...msg,
          conversation: [
            ...msg.conversation,
            {
              id: msg.conversation.length + 1,
              sender: "currentUser",
              content: newMessage,
              timestamp: new Date().toISOString()
            }
          ],
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString()
        };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    setNewMessage('');
  };

  const handleInvitationResponse = (invitationId, response) => {
    const updatedInvitations = invitations.map(inv => {
      if (inv.id === invitationId) {
        return {
          ...inv,
          status: response === 'accept' ? 'accepted' : 'declined'
        };
      }
      return inv;
    });
    
    setInvitations(updatedInvitations);
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

  const getUnreadCount = (type) => {
    switch (type) {
      case 'messages':
        return messages.filter(msg => msg.unread).length;
      case 'invitations':
        return invitations.filter(inv => inv.status === 'pending' && inv.type === 'received').length;
      case 'matches':
        return matches.filter(match => match.status === 'new').length;
      default:
        return 0;
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvitations = invitations.filter(inv => {
    const user = inv.type === 'received' ? inv.fromUser : inv.toUser;
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           inv.postTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredMatches = matches.filter(match => 
    match.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { 
      id: 'messages', 
      label: 'Tin nhắn', 
      icon: <MessageCircle size={20} />,
      count: getUnreadCount('messages')
    },
    { 
      id: 'invitations', 
      label: 'Lời mời', 
      icon: <UserPlus size={20} />,
      count: getUnreadCount('invitations')
    },
    { 
      id: 'matches', 
      label: 'Gợi ý kết nối', 
      icon: <Heart size={20} />,
      count: getUnreadCount('matches')
    }
  ];

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết nối</h2>
        <p className="text-gray-600 mb-6">
          Đăng nhập để quản lý tin nhắn và kết nối với các bạn ghép trọ
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kết nối</h1>
        <p className="text-gray-600">Quản lý tin nhắn, lời mời và gợi ý kết nối</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
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

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có tin nhắn nào</p>
                    </div>
                  ) : (
                    filteredMessages.map(message => (
                      <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <img
                              src={message.otherUser.avatar}
                              alt={message.otherUser.name}
                              className="w-12 h-12 rounded-full"
                            />
                            {message.otherUser.status === 'online' && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {message.otherUser.name}
                                </h3>
                                {message.otherUser.verified && (
                                  <CheckCircle size={16} className="text-green-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {formatTime(message.lastMessageTime)}
                                </span>
                                {message.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-1">
                              Về: {message.postTitle}
                            </p>
                            
                            <p className="text-gray-700 mb-3">
                              {message.lastMessage}
                            </p>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedConversation(message)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Xem cuộc trò chuyện
                              </button>
                              <span className="text-gray-300">•</span>
                              <Link
                                to={`/post/${message.postId}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Xem bài đăng
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Invitations Tab */}
              {activeTab === 'invitations' && (
                <div className="space-y-4">
                  {filteredInvitations.length === 0 ? (
                    <div className="text-center py-8">
                      <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có lời mời nào</p>
                    </div>
                  ) : (
                    filteredInvitations.map(invitation => (
                      <div key={invitation.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={invitation.type === 'received' ? invitation.fromUser.avatar : invitation.toUser.avatar}
                            alt={invitation.type === 'received' ? invitation.fromUser.name : invitation.toUser.name}
                            className="w-12 h-12 rounded-full"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {invitation.type === 'received' ? invitation.fromUser.name : invitation.toUser.name}
                                </h3>
                                {(invitation.type === 'received' ? invitation.fromUser.verified : invitation.toUser.verified) && (
                                  <CheckCircle size={16} className="text-green-500" />
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  invitation.type === 'received' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {invitation.type === 'received' ? 'Đã nhận' : 'Đã gửi'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatTime(invitation.timestamp)}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              <p>
                                {invitation.type === 'received' ? invitation.fromUser.school : invitation.toUser.school} - {invitation.type === 'received' ? invitation.fromUser.major : invitation.toUser.major}
                              </p>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              Về: {invitation.postTitle}
                            </p>
                            
                            <p className="text-gray-700 mb-3">
                              {invitation.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <Link
                                to={`/post/${invitation.postId}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Xem bài đăng
                              </Link>
                              
                              {invitation.type === 'received' && invitation.status === 'pending' && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                                  >
                                    Từ chối
                                  </button>
                                  <button
                                    onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                                  >
                                    Chấp nhận
                                  </button>
                                </div>
                              )}
                              
                              {invitation.status !== 'pending' && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  invitation.status === 'accepted' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {invitation.status === 'accepted' ? 'Đã chấp nhận' : 'Đã từ chối'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === 'matches' && (
                <div className="space-y-4">
                  {filteredMatches.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có gợi ý kết nối nào</p>
                    </div>
                  ) : (
                    filteredMatches.map(match => (
                      <div key={match.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={match.user.avatar}
                            alt={match.user.name}
                            className="w-12 h-12 rounded-full"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {match.user.name}
                                </h3>
                                {match.user.verified && (
                                  <CheckCircle size={16} className="text-green-500" />
                                )}
                                <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                  <Star size={12} fill="currentColor" />
                                  <span>{match.matchScore}% phù hợp</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatTime(match.timestamp)}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              <p>{match.user.school} - {match.user.major}</p>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              Về: {match.postTitle}
                            </p>
                            
                            {match.mutualInterests.length > 0 && (
                              <div className="mb-3">
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  Sở thích chung:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {match.mutualInterests.map((interest, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <Link
                                to={`/post/${match.postId}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Xem bài đăng
                              </Link>
                              
                              <div className="flex items-center space-x-2">
                                {match.status === 'new' && (
                                  <button
                                    onClick={() => {
                                      const updatedMatches = matches.map(m => 
                                        m.id === match.id ? { ...m, status: 'contacted' } : m
                                      );
                                      setMatches(updatedMatches);
                                    }}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                                  >
                                    Gửi lời mời
                                  </button>
                                )}
                                
                                {match.status === 'contacted' && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Đã liên hệ
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedConversation.otherUser.avatar}
                  alt={selectedConversation.otherUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">
                    {selectedConversation.otherUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedConversation.postTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {selectedConversation.conversation.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'currentUser' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'currentUser' 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tin nhắn..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedConversation.id)}
                />
                <button
                  onClick={() => handleSendMessage(selectedConversation.id)}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Connections; 