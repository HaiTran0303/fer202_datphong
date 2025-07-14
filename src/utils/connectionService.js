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
  limit,
  getDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collections
const CONNECTIONS_COLLECTION = 'connections';
const MESSAGES_COLLECTION = 'messages';
const NOTIFICATIONS_COLLECTION = 'notifications';

// Connection Service
export const connectionService = {
  // Gửi lời mời kết nối
  async sendConnectionRequest(fromUserId, toUserId, postId, message = '') {
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
      await this.createNotification(toUserId, 'connection_request', {
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
  },

  // Lấy danh sách lời mời đã gửi
  async getSentConnections(userId) {
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
        
        console.log('ConnectionService: Processing connection:', connection.id);
        console.log('ConnectionService: Connection toUserId:', connection.toUserId);
        console.log('ConnectionService: Connection postId:', connection.postId);

        // Lấy thông tin người nhận
        if (connection.toUserId) {
          const toUserDoc = await getDoc(doc(db, 'users', connection.toUserId));
          if (toUserDoc.exists()) {
            connection.toUser = { uid: toUserDoc.id, ...toUserDoc.data() };
            console.log('ConnectionService: Fetched toUser:', connection.toUser);
          } else {
            console.warn('ConnectionService: toUser document not found for ID:', connection.toUserId);
          }
        } else {
          console.warn('ConnectionService: toUserId is undefined for connection:', connection.id);
        }

        // Lấy thông tin bài đăng
        if (connection.postId) {
          const postDoc = await getDoc(doc(db, 'posts', connection.postId));
          if (postDoc.exists()) {
            connection.post = { id: postDoc.id, ...postDoc.data() };
            console.log('ConnectionService: Fetched post:', connection.post);
          } else {
            console.warn('ConnectionService: Post document not found for ID:', connection.postId);
          }
        } else {
          console.warn('ConnectionService: postId is undefined for connection:', connection.id);
        }

        connections.push(connection);
      }

      return connections;
    } catch (error) {
      console.error('Error getting sent connections:', error);
      return [];
    }
  },

  // Lấy danh sách lời mời đã nhận
  async getReceivedConnections(userId) {
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
        
        console.log('ConnectionService: Processing connection:', connection.id);
        console.log('ConnectionService: Connection fromUserId:', connection.fromUserId);
        console.log('ConnectionService: Connection postId:', connection.postId);

        // Lấy thông tin người gửi
        if (connection.fromUserId) {
          const fromUserDoc = await getDoc(doc(db, 'users', connection.fromUserId));
          if (fromUserDoc.exists()) {
            connection.fromUser = { uid: fromUserDoc.id, ...fromUserDoc.data() };
            console.log('ConnectionService: Fetched fromUser:', connection.fromUser);
          } else {
            console.warn('ConnectionService: fromUser document not found for ID:', connection.fromUserId);
          }
        } else {
          console.warn('ConnectionService: fromUserId is undefined for connection:', connection.id);
        }

        // Lấy thông tin bài đăng
        if (connection.postId) {
          const postDoc = await getDoc(doc(db, 'posts', connection.postId));
          if (postDoc.exists()) {
            connection.post = { id: postDoc.id, ...postDoc.data() };
            console.log('ConnectionService: Fetched post:', connection.post);
          } else {
            console.warn('ConnectionService: Post document not found for ID:', connection.postId);
          }
        } else {
          console.warn('ConnectionService: postId is undefined for connection:', connection.id);
        }

        connections.push(connection);
      }

      return connections;
    } catch (error) {
      console.error('Error getting received connections:', error);
      return [];
    }
  },

  // Chấp nhận lời mời kết nối
  async acceptConnection(connectionId) {
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
      await this.createNotification(connection.fromUserId, 'connection_accepted', {
        toUserId: connection.toUserId,
        connectionId,
        postId: connection.postId
      });

      return { success: true };
    } catch (error) {
      console.error('Error accepting connection:', error);
      throw error;
    }
  },

  // Từ chối lời mời kết nối
  async declineConnection(connectionId) {
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
      await this.createNotification(connection.fromUserId, 'connection_declined', {
        toUserId: connection.toUserId,
        connectionId,
        postId: connection.postId
      });

      return { success: true };
    } catch (error) {
      console.error('Error declining connection:', error);
      throw error;
    }
  },

  // Hủy lời mời kết nối
  async cancelConnection(connectionId) {
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
      await this.createNotification(connection.toUserId, 'connection_cancelled', {
        fromUserId: connection.fromUserId,
        connectionId,
        postId: connection.postId
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling connection:', error);
      throw error;
    }
  },

  // Tạo thông báo
  async createNotification(userId, type, data) {
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
  },

  // Lấy thông báo của user
  async getNotifications(userId) {
    try {
      if (!db) {
        return [];
      }

      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const notifications = [];

      for (const notificationDoc of querySnapshot.docs) {
        const notification = { id: notificationDoc.id, ...notificationDoc.data() };
        
        // Lấy thông tin bổ sung dựa trên loại thông báo
        if (notification.type === 'connection_request' && notification.data.fromUserId) {
          const fromUserDoc = await getDoc(doc(db, 'users', notification.data.fromUserId));
          if (fromUserDoc.exists()) {
            notification.fromUser = fromUserDoc.data();
          }
        }

        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(notificationId) {
    try {
      if (!db) {
        return { success: true };
      }

      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Gửi tin nhắn
  async sendMessage(connectionId, fromUserId, toUserId, content, type = 'text') {
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
  },

  // Lấy tất cả các cuộc trò chuyện đang hoạt động (kết nối đã chấp nhận)
  async getActiveConversations(userId) {
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
          console.warn('ConnectionService: Other user document not found for ID:', otherUserId);
        }

        // Lấy thông tin bài đăng
        const postDoc = await getDoc(doc(db, 'posts', connection.postId));
        if (postDoc.exists()) {
          connection.post = { id: postDoc.id, ...postDoc.data() };
        } else {
          console.warn('ConnectionService: Post document not found for ID:', connection.postId);
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
  },

  // Lắng nghe thay đổi kết nối
  onConnectionsChange(userId, callback) {
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
  },

  // Lấy tin nhắn theo connectionId
  async getMessagesByConnectionId(connectionId) {
    try {
      if (!db) {
        return [];
      }

      const q = query(
        collection(db, MESSAGES_COLLECTION),
        where('connectionId', '==', connectionId),
        orderBy('createdAt', 'asc')
      );

      console.log('ConnectionService: Querying messages for connectionId:', connectionId);
      const querySnapshot = await getDocs(q);
      console.log('ConnectionService: querySnapshot size:', querySnapshot.size);
      const messages = [];

      for (const messageDoc of querySnapshot.docs) {
        const message = { id: messageDoc.id, ...messageDoc.data() };
        
        // Lấy thông tin người gửi
        if (message.fromUserId) {
          const fromUserDoc = await getDoc(doc(db, 'users', message.fromUserId));
          if (fromUserDoc.exists()) {
            message.fromUser = fromUserDoc.data();
          } else {
            console.warn('ConnectionService: Message sender (fromUser) document not found for ID:', message.fromUserId);
          }
        } else {
          console.warn('ConnectionService: Message has undefined fromUserId for message:', message.id);
        }
        // Lấy thông tin người nhận
        if (message.toUserId) {
          const toUserDoc = await getDoc(doc(db, 'users', message.toUserId));
          if (toUserDoc.exists()) {
            message.toUser = toUserDoc.data();
          } else {
            console.warn('ConnectionService: Message receiver (toUser) document not found for ID:', message.toUserId);
          }
        } else {
          console.warn('ConnectionService: Message has undefined toUserId for message:', message.id);
        }
        messages.push(message);
      }
      console.log('ConnectionService: Messages array before return:', messages);
      return messages;
    } catch (error) {
      console.error('Error getting messages by connection ID:', error);
      return [];
    }
  },

  // Lắng nghe thay đổi thông báo
  onNotificationsChange(userId, callback) {
    if (!db) {
      console.warn('Firebase not initialized - cannot listen to changes');
      return () => {};
    }

    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((notificationDoc) => {
        notifications.push({ id: notificationDoc.id, ...notificationDoc.data() });
      });
      callback(notifications);
    });
  }
};
