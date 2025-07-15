import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collections
const CONNECTIONS_COLLECTION = 'connections';
const MESSAGES_COLLECTION = 'messages';
const NOTIFICATIONS_COLLECTION = 'notifications'; // Keep if createNotification is still here and uses it

// Helper functions (formerly from connectionService.js)
// Gửi lời mời kết nối
async function sendConnectionRequest(fromUserId, toUserId, postId, message = '') {
  try {
    if (!db) {
      console.warn('Firebase not initialized - using mock data');
      return {
        id: `mock-connection-${Date.now()}`,
        fromUserId,
        toUserId,
        postId,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }

    const connectionData = {
      fromUserId,
      toUserId,
      postId,
      message,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, CONNECTIONS_COLLECTION), connectionData);
    
    // Tạo thông báo cho người nhận
    await createNotification(toUserId, 'connection_request', {
      fromUserId,
      connectionId: docRef.id,
      postId,
      message
    });

    // Tạo tin nhắn đầu tiên (tích hợp với gửi tin nhắn)
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      connectionId: docRef.id,
      fromUserId,
      toUserId,
      postId,
      content: message,
      type: 'text',
      createdAt: serverTimestamp(),
      isSystem: true // đánh dấu là tin nhắn hệ thống (lời mời)
    });

    return {
      id: docRef.id,
      ...connectionData
    };
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error;
  }
}

// Lấy danh sách lời mời đã gửi
async function getSentConnections(userId) {
  try {
    if (!db) {
      return [];
    }

    const q = query(
      collection(db, CONNECTIONS_COLLECTION),
      where('fromUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const connections = [];

    for (const connectionDoc of querySnapshot.docs) {
      const connection = { id: connectionDoc.id, ...connectionDoc.data() };
      
      // Lấy thông tin người nhận
      if (connection.toUserId) {
        const toUserDoc = await getDoc(doc(db, 'users', connection.toUserId));
        if (toUserDoc.exists()) {
          connection.toUser = { uid: toUserDoc.id, ...toUserDoc.data() };
        } else {
          connection.toUser = { uid: connection.toUserId, name: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48' };
          console.warn('Connections: toUser document not found for ID:', connection.toUserId, 'Using placeholder.');
        }
      } else {
        console.warn('Connections: toUserId is undefined for connection:', connection.id);
      }

      // Lấy thông tin bài đăng
      if (connection.postId) {
        const postDoc = await getDoc(doc(db, 'posts', connection.postId));
        if (postDoc.exists()) {
          connection.post = { id: postDoc.id, ...postDoc.data() };
        } else {
          console.warn('Connections: Post document not found for ID:', connection.postId);
        }
      } else {
        console.warn('Connections: postId is undefined for connection:', connection.id);
      }

      connections.push(connection);
    }

    return connections;
  } catch (error) {
    console.error('Error getting sent connections:', error);
    return [];
  }
}

// Lấy danh sách lời mời đã nhận
async function getReceivedConnections(userId) {
  try {
    if (!db) {
      return [];
    }

    const q = query(
      collection(db, CONNECTIONS_COLLECTION),
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const connections = [];

    for (const connectionDoc of querySnapshot.docs) {
      const connection = { id: connectionDoc.id, ...connectionDoc.data() };
      
      // Lấy thông tin người gửi
      if (connection.fromUserId) {
        const fromUserDoc = await getDoc(doc(db, 'users', connection.fromUserId));
        if (fromUserDoc.exists()) {
          connection.fromUser = { uid: fromUserDoc.id, ...fromUserDoc.data() };
        } else {
          connection.fromUser = { uid: connection.fromUserId, name: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48' };
          console.warn('Connections: fromUser document not found for ID:', connection.fromUserId, 'Using placeholder.');
        }
      } else {
        console.warn('Connections: fromUserId is undefined for connection:', connection.id);
      }

      // Lấy thông tin bài đăng
      if (connection.postId) {
        const postDoc = await getDoc(doc(db, 'posts', connection.postId));
        if (postDoc.exists()) {
          connection.post = { id: postDoc.id, ...postDoc.data() };
        } else {
          console.warn('Connections: Post document not found for ID:', connection.postId);
        }
      } else {
        console.warn('Connections: postId is undefined for connection:', connection.id);
      }

      connections.push(connection);
    }

    return connections;
  } catch (error) {
    console.error('Error getting received connections:', error);
    return [];
  }
}

// Chấp nhận lời mời kết nối
async function acceptConnection(connectionId) {
  try {
    if (!db) {
      console.warn('Firebase not initialized - using mock data');
      return { success: true };
    }

    const connectionRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
    const connectionDoc = await getDoc(connectionRef);
    
    if (!connectionDoc.exists()) {
      throw new Error('Connection not found');
    }

    const connection = connectionDoc.data();
    
    // Cập nhật trạng thái
    await updateDoc(connectionRef, {
      status: 'accepted',
      updatedAt: serverTimestamp()
    });

    // Tạo thông báo cho người gửi
    await createNotification(connection.fromUserId, 'connection_accepted', {
      toUserId: connection.toUserId,
      connectionId,
      postId: connection.postId
    });

    return { success: true };
  } catch (error) {
    console.error('Error accepting connection:', error);
    throw error;
  }
}

// Từ chối lời mời kết nối
async function declineConnection(connectionId) {
  try {
    if (!db) {
      console.warn('Firebase not initialized - using mock data');
      return { success: true };
    }

    const connectionRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
    const connectionDoc = await getDoc(connectionRef);
    
    if (!connectionDoc.exists()) {
      throw new Error('Connection not found');
    }

    const connection = connectionDoc.data();
    
    // Cập nhật trạng thái
    await updateDoc(connectionRef, {
      status: 'declined',
      updatedAt: serverTimestamp()
    });

    // Tạo thông báo cho người gửi
    await createNotification(connection.fromUserId, 'connection_declined', {
      toUserId: connection.toUserId,
      connectionId,
      postId: connection.postId
    });

    return { success: true };
  } catch (error) {
    console.error('Error declining connection:', error);
    throw error;
  }
}

// Hủy lời mời kết nối
async function cancelConnection(connectionId) {
  try {
    if (!db) {
      console.warn('Firebase not initialized - using mock data');
      return { success: true };
    }

    const connectionRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
    const connectionDoc = await getDoc(connectionRef);
    
    if (!connectionDoc.exists()) {
      throw new Error('Connection not found');
    }

    const connection = connectionDoc.data();
    
    // Xóa lời mời
    await deleteDoc(connectionRef);

    // Tạo thông báo cho người nhận
    await createNotification(connection.toUserId, 'connection_cancelled', {
      fromUserId: connection.fromUserId,
      connectionId,
      postId: connection.postId
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling connection:', error);
    throw error;
  }
}

// Tạo thông báo (This function is kept here because sendConnectionRequest and other functions in this file use it)
async function createNotification(userId, type, data) {
  try {
    if (!db) {
      console.warn('Firebase not initialized - skipping notification');
      return;
    }

    const notificationData = {
      userId,
      type,
      data,
      isRead: false,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationData);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}


// Gửi tin nhắn
async function sendMessage(connectionId, fromUserId, toUserId, content, type = 'text') {
  try {
    if (!db) {
      console.warn('Firebase not initialized - skipping send message');
      return;
    }
    const messageData = {
      connectionId,
      fromUserId,
      toUserId,
      content,
      type,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Lấy tất cả các cuộc trò chuyện đang hoạt động (kết nối đã chấp nhận)
async function getActiveConversations(userId) {
  try {
    if (!db) {
      return [];
    }
    // Lấy các kết nối đã chấp nhận mà người dùng hiện tại là fromUserId hoặc toUserId
    const q1 = query(
      collection(db, CONNECTIONS_COLLECTION),
      where('fromUserId', '==', userId),
      where('status', '==', 'accepted')
    );
    const q2 = query(
      collection(db, CONNECTIONS_COLLECTION),
      where('toUserId', '==', userId),
      where('status', '==', 'accepted')
    );

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const connections = [];

    const processConnection = async (connectionDoc) => {
      const connection = { id: connectionDoc.id, ...connectionDoc.data() };
      
      // Lấy thông tin người dùng khác trong cuộc trò chuyện
      const otherUserId = connection.fromUserId === userId ? connection.toUserId : connection.fromUserId;
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
      if (otherUserDoc.exists()) {
        connection.otherUser = { uid: otherUserDoc.id, ...otherUserDoc.data() };
      } else {
        connection.otherUser = { uid: otherUserId, name: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48' };
        console.warn('Connections: Other user document not found for ID:', otherUserId, 'Using placeholder.');
      }

      // Lấy thông tin bài đăng
      const postDoc = await getDoc(doc(db, 'posts', connection.postId));
      if (postDoc.exists()) {
        connection.post = { id: postDoc.id, ...postDoc.data() };
      } else {
        console.warn('Connections: Post document not found for ID:', connection.postId);
      }
      connections.push(connection);
    };

    await Promise.all(snapshot1.docs.map(processConnection));
    await Promise.all(snapshot2.docs.map(processConnection));

    // Sắp xếp theo thời gian cập nhật gần nhất (hoặc tin nhắn cuối cùng)
    connections.sort((a, b) => (b.updatedAt?.toDate() || 0) - (a.updatedAt?.toDate() || 0));

    return connections;
  } catch (error) {
    console.error('Error getting active conversations:', error);
    return [];
  }
}

// Lắng nghe thay đổi tin nhắn trong một cuộc trò chuyện cụ thể
function onMessagesUpdate(connectionId, callback) {
  if (!db) {
    console.warn('Firebase not initialized - cannot listen to message changes');
    return () => {};
  }

  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('connectionId', '==', connectionId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((messageDoc) => {
      const message = { id: messageDoc.id, ...messageDoc.data() };
      messages.push({
        id: message.id,
        sender: message.fromUserId, // Will map to 'currentUser' or 'otherUser' in Connections.jsx
        content: message.content,
        timestamp: message.createdAt?.toDate ? message.createdAt.toDate().toISOString() : new Date().toISOString(),
        fromUserId: message.fromUserId, // Keep for comparison in frontend
        toUserId: message.toUserId // Keep for comparison in frontend
      });
    });
    callback(messages);
  });
}

// Lắng nghe thay đổi kết nối
function onConnectionsChange(userId, callback) {
  if (!db) {
    console.warn('Firebase not initialized - cannot listen to changes');
    return () => {};
  }

  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where('toUserId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const connections = [];
    snapshot.forEach((connectionDoc) => {
      connections.push({ id: connectionDoc.id, ...connectionDoc.data() });
    });
    callback(connections);
  });
}

// Lấy tin nhắn theo connectionId
async function getMessagesByConnectionId(connectionId) {
  try {
    if (!db) {
      return [];
    }

    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'asc')
    );

    console.log('Connections: Querying messages for connectionId:', connectionId);
    const querySnapshot = await getDocs(q);
    console.log('Connections: querySnapshot size:', querySnapshot.size);
    const messages = [];

    for (const messageDoc of querySnapshot.docs) {
      const message = { id: messageDoc.id, ...messageDoc.data() };
      
      // Lấy thông tin người gửi
      if (message.fromUserId) {
        const fromUserDoc = await getDoc(doc(db, 'users', message.fromUserId));
        if (fromUserDoc.exists()) {
          message.fromUser = fromUserDoc.data();
        } else {
          console.warn('Connections: Message sender (fromUser) document not found for ID:', message.fromUserId);
        }
      } else {
        console.warn('Connections: Message has undefined fromUserId for message:', message.id);
      }
      // Lấy thông tin người nhận
      if (message.toUserId) {
        const toUserDoc = await getDoc(doc(db, 'users', message.toUserId));
        if (toUserDoc.exists()) {
          message.toUser = toUserDoc.data();
        } else {
          console.warn('Connections: Message receiver (toUser) document not found for ID:', message.toUserId);
        }
      } else {
        console.warn('Connections: Message has undefined toUserId for message:', message.id);
      }
      messages.push(message);
    }
    console.log('Connections: Messages array before return:', messages);
    return messages;
  } catch (error) {
    console.error('Error getting messages by connection ID:', error);
    return [];
  }
}

function Connections() {
  // currentUser sẽ cần được cung cấp thông qua một cơ chế khác
  // Tạm thời để trống hoặc gán giá trị mặc định để tránh lỗi
  const currentUser = { uid: 'fake-uid-123', email: 'user@example.com', displayName: 'Example User', metadata: { creationTime: new Date().toISOString() } };
  const [activeTab, setActiveTab] = useState('messages'); 
  const [messages, setMessages] = useState([]); 
  const [sentInvitations, setSentInvitations] = useState([]);
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState({ conversation: [] });
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [invitationTab, setInvitationTab] = useState('received');

  useEffect(() => {
    fetchConnections();

    // Setup real-time listener for connections/invitations
    let unsubscribeConnections;
    if (currentUser) {
      unsubscribeConnections = onConnectionsChange(currentUser.uid, async (connections) => {
        // Re-fetch full user and post data for real-time updates
        const sent = [];
        const received = [];

        for (const conn of connections) {
          if (conn.fromUserId === currentUser.uid) {
            // Sent invitation
            const toUserDoc = await getDoc(doc(db, 'users', conn.toUserId));
            const postDoc = await getDoc(doc(db, 'posts', conn.postId));
            sent.push({
              id: conn.id,
              type: 'sent',
              toUser: toUserDoc.exists() ? { uid: toUserDoc.id, ...toUserDoc.data() } : { uid: conn.toUserId, name: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48' },
              postId: conn.postId,
              postTitle: postDoc.exists() ? postDoc.data().title : 'Bài đăng',
              message: conn.message,
              timestamp: conn.createdAt,
              status: conn.status
            });
          } else if (conn.toUserId === currentUser.uid) {
            // Received invitation
            const fromUserDoc = await getDoc(doc(db, 'users', conn.fromUserId));
            const postDoc = await getDoc(doc(db, 'posts', conn.postId));
            received.push({
              id: conn.id,
              type: 'received',
              fromUser: fromUserDoc.exists() ? { uid: fromUserDoc.id, ...fromUserDoc.data() } : { uid: conn.fromUserId, name: 'Người dùng không xác định', avatar: 'https://via.placeholder.com/48' },
              postId: conn.postId,
              postTitle: postDoc.exists() ? postDoc.data().title : 'Bài đăng',
              message: conn.message,
              timestamp: conn.createdAt,
              status: conn.status
            });
          }
        }
        setSentInvitations(sent);
        setReceivedInvitations(received);
      });
    }

    return () => {
      if (unsubscribeConnections) {
        unsubscribeConnections();
      }
    };
  }, [currentUser]); // Only re-run if currentUser changes

  useEffect(() => {
    let unsubscribeMessages;
    if (selectedConversation && selectedConversation.id && currentUser) {
      unsubscribeMessages = onMessagesUpdate(selectedConversation.id, (messages) => {
        setSelectedConversation(prev => ({
          ...prev,
          conversation: messages.map(msg => ({
            ...msg,
            sender: msg.fromUserId === currentUser.uid ? 'currentUser' : 'otherUser'
          }))
        }));
      });
    }

    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [selectedConversation?.id, currentUser]); // Re-run effect if selectedConversation.id or currentUser changes

  const fetchConnections = async () => {
    if (!currentUser) {
      console.log('Connections: No current user, skipping fetchConnections');
      return;
    }
    setLoading(true);
    console.log('Connections: Fetching connections for user ID:', currentUser.uid);
    try {
      const [sentConnections, receivedConnections, activeConversations] = await Promise.all([
        getSentConnections(currentUser.uid),
        getReceivedConnections(currentUser.uid),
        getActiveConversations(currentUser.uid)
      ]);

      console.log('Connections: Raw fetched sent connections:', sentConnections);
      console.log('Connections: Raw fetched received connections:', receivedConnections);
      console.log('Connections: Raw fetched active conversations:', activeConversations);

      const sent = sentConnections.map(conn => ({
        id: conn.id,
        type: 'sent',
        toUser: conn.toUser,
        postId: conn.postId,
        postTitle: conn.post?.title || 'Bài đăng',
        message: conn.message,
        timestamp: conn.createdAt,
        status: conn.status
      }));

      const received = receivedConnections.map(conn => ({
        id: conn.id,
        type: 'received',
        fromUser: conn.fromUser,
        postId: conn.postId,
        postTitle: conn.post?.title || 'Bài đăng',
        message: conn.message,
        timestamp: conn.createdAt,
        status: conn.status
      }));

      const mappedMessages = activeConversations.map(conv => ({
        id: conv.id,
        otherUser: conv.otherUser,
        postTitle: conv.post?.title || 'Bài đăng',
        lastMessage: conv.message,
        lastMessageTime: conv.updatedAt?.toDate ? conv.updatedAt.toDate().toISOString() : new Date().toISOString(),
        unread: false
      }));

      console.log('Connections: Transformed sent invitations:', sent);
      console.log('Connections: Transformed received invitations:', received);
      console.log('Connections: Mapped active conversations (messages):', mappedMessages);


      setSentInvitations(sent);
      setReceivedInvitations(received);
      setMessages(mappedMessages);
      setMatches([]);
    } catch (error) {
      console.error('Connections: Error fetching connections:', error);
    } finally {
      setLoading(false);
      console.log('Connections: Loading state set to false.');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const fromUserId = currentUser.uid;
      const toUserId = selectedConversation.otherUser.uid;
      const connectionId = selectedConversation.id;

      await sendMessage(connectionId, fromUserId, toUserId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  const handleInvitationResponse = async (invitationId, response) => {
    try {
      if (response === 'accept') {
        await acceptConnection(invitationId);
        const acceptedInvitation = receivedInvitations.find(inv => inv.id === invitationId);
        if (acceptedInvitation) {
          console.log('Connections: Accepted Invitation:', acceptedInvitation);
          console.log('Connections: acceptedInvitation.fromUser:', acceptedInvitation.fromUser);
          console.log('Connections: acceptedInvitation.toUser:', acceptedInvitation.toUser);

          let otherUser;
          if (acceptedInvitation.fromUser && acceptedInvitation.fromUser.uid) {
            otherUser = (acceptedInvitation.fromUser.uid === currentUser.uid)
              ? acceptedInvitation.toUser
              : acceptedInvitation.fromUser;
          } else {
            const targetUserId = acceptedInvitation.fromUserId === currentUser.uid
              ? acceptedInvitation.toUserId
              : acceptedInvitation.fromUserId;
            
            otherUser = {
              uid: targetUserId,
              name: "Người dùng không xác định",
              avatar: "https://via.placeholder.com/48",
            };
            console.warn('Connections: Using fallback otherUser due to undefined fromUser/toUser in acceptedInvitation:', acceptedInvitation);
          }

          if (!otherUser) {
            console.error('Connections: otherUser is still undefined even after fallback logic.');
            alert('Lỗi: Không thể xác định người dùng khác trong cuộc trò chuyện.');
            return;
          }
          console.log('Connections: Determined otherUser:', otherUser);
          
          const conversationMessages = await getMessagesByConnectionId(invitationId);
          console.log('Connections: Fetched conversation messages (raw):', conversationMessages);

          const mappedConversation = Array.isArray(conversationMessages)
            ? conversationMessages.map(msg => ({
                id: msg.id,
                sender: msg.fromUserId === currentUser.uid ? 'currentUser' : 'otherUser',
                content: msg.content,
                timestamp: msg.createdAt?.toDate ? msg.createdAt.toDate().toISOString() : new Date().toISOString()
              }))
            : [];
          
          console.log('Connections: Mapped conversation (before setting state):', mappedConversation);

          const newSelectedConversation = { 
            id: acceptedInvitation.id, 
            otherUser: otherUser,
            postTitle: acceptedInvitation.postTitle,
            conversation: Array.isArray(mappedConversation) ? mappedConversation : [],
            lastMessage: mappedConversation.length > 0 ? mappedConversation[mappedConversation.length - 1].content : '',
            lastMessageTime: mappedConversation.length > 0 ? mappedConversation[mappedConversation.length - 1].timestamp : new Date().toISOString()
          };

          setSelectedConversation(newSelectedConversation); 
          console.log('Connections: selectedConversation state set to:', newSelectedConversation); 

          setActiveTab('messages');
        }
      } else {
        await declineConnection(invitationId);
      }

      const updatedInvitations = [...sentInvitations, ...receivedInvitations].map(inv => {
        if (inv.id === invitationId) {
          return {
            ...inv,
            status: response === 'accept' ? 'accepted' : 'declined'
          };
        }
        return inv;
      });
      
      setSentInvitations(updatedInvitations.filter(inv => inv.type === 'sent'));
      setReceivedInvitations(updatedInvitations.filter(inv => inv.type === 'received'));
    } catch (error) {
      console.error('Error responding to invitation:', error);
      alert('Có lỗi xảy ra khi xử lý lời mời. Vui lòng thử lại.');
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

  const getUnreadCount = (type) => {
    switch (type) {
      case 'messages':
        return messages.filter(msg => msg.unread).length;
      case 'invitations':
        return [...sentInvitations, ...receivedInvitations].filter(inv => inv.status === 'pending').length;
      case 'matches':
        return matches.filter(match => match.status === 'new').length;
      default:
        return 0;
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.postTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Placeholder button to demonstrate sendConnectionRequest */}
        <button 
          onClick={() => sendConnectionRequest(currentUser.uid, 'some_other_user_id', 'some_post_id', 'Hello from Connections!')}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
        >
          Test Send Connection Request
        </button>
        {/* Placeholder button to demonstrate cancelConnection */}
        <button 
          onClick={() => cancelConnection('some_connection_id_to_cancel')} // Replace with an actual connection ID for testing
          className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Test Cancel Connection
        </button>
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
              placeholder="Nhập tìm kiếm..."
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
                              src={message.otherUser?.avatar || 'https://via.placeholder.com/48'}
                              alt={message.otherUser?.name || 'Người dùng'}
                              className="w-12 h-12 rounded-full"
                            />
                            {message.otherUser?.status === 'online' && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {message.otherUser?.name || 'Người dùng'}
                                </h3>
                                {message.otherUser?.verified && (
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
                <div>
                  {/* Tabs con */}
                  <div className="flex space-x-4 mb-4">
                    <button
                      className={`px-4 py-2 rounded-md font-medium text-sm ${invitationTab === 'received' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setInvitationTab('received')}
                    >
                      Lời mời đã nhận
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md font-medium text-sm ${invitationTab === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setInvitationTab('sent')}
                    >
                      Lời mời đã gửi
                    </button>
                  </div>
                  {/* Danh sách lời mời */}
                  <div className="space-y-4">
                    {invitationTab === 'received' ? (
                      receivedInvitations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Chưa có lời mời nào được nhận</div>
                      ) : (
                        receivedInvitations.map(inv => (
                          <div key={inv.id} className="border rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-start space-x-4">
                              <img
                                src={inv.fromUser?.avatar || 'https://via.placeholder.com/48'}
                                alt={inv.fromUser?.name || 'Người dùng'}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-semibold">{inv.fromUser?.name || 'Người gửi'}</div>
                                <div className="text-sm text-gray-600">{inv.postTitle}</div>
                                <div className="text-xs text-gray-400">{formatTime(inv.timestamp)}</div>
                                <div className="text-sm mt-1">{inv.message}</div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {inv.status === 'pending' && (
                                <>
                                  <button onClick={() => handleInvitationResponse(inv.id, 'accept')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">Chấp nhận</button>
                                  <button onClick={() => handleInvitationResponse(inv.id, 'decline')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Từ chối</button>
                                </>
                              )}
                              {inv.status === 'accepted' && <span className="text-green-600 text-xs font-medium">Đã chấp nhận</span>}
                              {inv.status === 'declined' && <span className="text-red-600 text-xs font-medium">Đã từ chối</span>}
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      sentInvitations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Chưa có lời mời nào đã gửi</div>
                      ) : (
                        sentInvitations.map(inv => (
                          <div key={inv.id} className="border rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{inv.toUser?.name || 'Người nhận'}</div>
                              <div className="text-sm text-gray-600">{inv.postTitle}</div>
                              <div className="text-xs text-gray-400">{formatTime(inv.timestamp)}</div>
                              <div className="text-sm mt-1">{inv.message}</div>
                            </div>
                            <div>
                              {inv.status === 'pending' && <span className="text-yellow-600 text-xs font-medium">Đang chờ</span>}
                              {inv.status === 'accepted' && <span className="text-green-600 text-xs font-medium">Đã chấp nhận</span>}
                              {inv.status === 'declined' && <span className="text-red-600 text-xs font-medium">Đã từ chối</span>}
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
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
                    <>
                      {filteredMatches.map(match => (
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
                      ))}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Conversation Modal */}
      {selectedConversation && selectedConversation.otherUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedConversation.otherUser.avatar || 'https://via.placeholder.com/48'}
                  alt={selectedConversation.otherUser.name || 'Người dùng'}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">
                    {selectedConversation.otherUser.name || 'Người dùng'}
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
              {selectedConversation.conversation && selectedConversation.conversation.length > 0 ? (
                selectedConversation.conversation.map(msg => (
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
                ))
              ) : (
                <div className="text-center text-gray-500">Chưa có tin nhắn nào.</div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tin nhắn..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={() => handleSendMessage()}
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
